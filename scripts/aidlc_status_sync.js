// scripts/aidlc_status_sync.js
// AI-DLC Status Sync handler
//
// GitHub Actions から実行され、push / pull_request イベントに応じて
// GitHub Project v2 の Status フィールドを自動更新します。
//
// ■ 前提環境変数（GitHub Actions 側で設定）
// - GITHUB_TOKEN        : GitHub API 用トークン（Actions 付与）
// - GITHUB_REPOSITORY   : "owner/repo" 形式（Actions で自動）
//   または REPOSITORY   : 同上（どちらか一方があればOK）
// - GITHUB_EVENT_NAME   : イベント名 (push / pull_request など)
// - GITHUB_EVENT_PATH   : イベント JSON ファイルへのパス
// - AIDLC_OWNER         : Project を持つ organization or user の login
// - AIDLC_PROJECT_NUMBER: 対象 Project v2 の番号 (例: 3)
// - AIDLC_STATUS_FIELD_NAME (任意) : Status フィールド名（デフォルト: "Status")
//
// ■ 概要
// - ブランチ名から Issue 番号（例: issue-123 / <PROJECT_KEY>-123 の 123 部分）を抽出
// - Issue #123 に紐づく Project Item を特定
// - Project v2 の Status フィールドを、イベントに応じて更新
//
// ■ イベント → Status 変換ルール
// - push                       → "In Progress"
// - pull_request opened        → "In Review"
// - pull_request reopened      → "In Review"
// - pull_request ready_for_review → "In Review"
// - pull_request closed & merged → "Done"
//
// ※ Status 名は Project 側で事前に作成しておく必要があります。

const fs = require("fs");
const GITHUB_API_REST = "https://api.github.com";
const GITHUB_API_GRAPHQL = "https://api.github.com/graphql";

// Status 名（Project 側の Single Select の option 名と一致させる）
const STATUS_IN_PROGRESS = "In Progress";
const STATUS_IN_REVIEW = "In Review";
const STATUS_DONE = "Done";

function normalizeName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function uniqueStrings(values) {
  const out = [];
  const seen = new Set();
  for (const v of values) {
    if (v === null || v === undefined) continue;
    const s = String(v).trim();
    if (!s) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

function createCandidateSet(values) {
  const candidates = uniqueStrings(values);
  const norms = new Set(candidates.map(normalizeName));
  return { candidates, norms };
}

function findOptionId(optionsByName, optionsByNorm, candidateNames) {
  for (const c of uniqueStrings(candidateNames)) {
    if (optionsByName[c]) return optionsByName[c];
    const n = normalizeName(c);
    if (optionsByNorm[n]) return optionsByNorm[n];
  }
  return null;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("❌ GITHUB_TOKEN が設定されていません（workflow 側で secrets.PROJECT_TOKEN などを渡してください）。");
    process.exit(1);
  }

  const repoEnv = process.env.REPOSITORY || process.env.GITHUB_REPOSITORY;
  if (!repoEnv) {
    console.error("❌ REPOSITORY / GITHUB_REPOSITORY が設定されていません。");
    process.exit(1);
  }
  const [repoOwner, repoName] = repoEnv.split("/");

  const eventName = process.env.GITHUB_EVENT_NAME;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventName || !eventPath) {
    console.error("❌ GITHUB_EVENT_NAME または GITHUB_EVENT_PATH が不足しています。");
    process.exit(1);
  }

  // ローカル実行時など、ENV が未設定のケースを補助（ENV が優先で上書きしない）。
  maybeLoadAidlcConfigFromFile();

  const aidlcOwner = process.env.AIDLC_OWNER;
  const projectNumberStr = process.env.AIDLC_PROJECT_NUMBER;
  if (!aidlcOwner || !projectNumberStr) {
    console.error("❌ AIDLC_OWNER / AIDLC_PROJECT_NUMBER が設定されていません。");
    process.exit(1);
  }

  const projectNumber = parseInt(projectNumberStr, 10);
  if (Number.isNaN(projectNumber)) {
    console.error(`❌ AIDLC_PROJECT_NUMBER=\"${projectNumberStr}\" が数値として解釈できません。`);
    process.exit(1);
  }

  const statusFieldName = process.env.AIDLC_STATUS_FIELD_NAME || "Status";
  const statusFieldCandidates = createCandidateSet([
    process.env.AIDLC_STATUS_FIELD_NAME,
    "Status",
    "ステータス",
  ]);
  const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));

  // イベントから targetStatus と issueNumber を決定
  const { targetStatus, issueNumber } = determineStatusAndIssue(eventName, event);
  if (!targetStatus) {
    console.log("対象外のイベント、または状態遷移不要のため何もしません。");
    return;
  }
  if (!issueNumber) {
    console.log("ブランチ名などから Issue 番号を特定できませんでした。");
    return;
  }

  console.log(`Detected event=${eventName}, issue=#${issueNumber}, targetStatus=${targetStatus}`);

  const projectInfo = await getProjectAndStatusFieldInfo({
    owner: aidlcOwner,
    projectNumber,
    statusFieldName,
    statusFieldCandidates,
  });
  if (!projectInfo) {
    console.log("Status Sync: 対象 Project / Status フィールドが見つからないためスキップします。");
    return;
  }

  const { projectId, statusFieldId, statusOptionsByName, statusOptionsByNorm, statusFieldNameResolved } = projectInfo;

  const statusOptionAliases = {
    [STATUS_IN_PROGRESS]: [STATUS_IN_PROGRESS, "InProgress", "進行中", "作業中", "対応中"],
    [STATUS_IN_REVIEW]: [STATUS_IN_REVIEW, "InReview", "レビュー中", "確認中"],
    [STATUS_DONE]: [STATUS_DONE, "完了", "Done", "完了済み"],
  };

  const optionCandidates = statusOptionAliases[targetStatus] || [targetStatus];
  const optionId = findOptionId(statusOptionsByName, statusOptionsByNorm, optionCandidates);
  if (!optionId) {
    console.log(
      `Project の Status フィールド (\"${statusFieldNameResolved}\") に、対象オプションが存在しません。` +
        ` candidates=[${optionCandidates.join(", ")}]`
    );
    return;
  }

  const itemId = await getProjectItemIdForIssue({
    repoOwner,
    repoName,
    projectNumber,
    issueNumber,
  });
  if (!itemId) {
    console.log(`Issue #${issueNumber} に対応する Project Item が見つかりませんでした。`);
    return;
  }

  await updateProjectItemStatus({
    projectId,
    itemId,
    fieldId: statusFieldId,
    optionId,
  });

  console.log(`✅ Status を \"${targetStatus}\" に更新しました (issue #${issueNumber})`);
}

function maybeLoadAidlcConfigFromFile() {
  const requiredKeys = ["AIDLC_OWNER", "AIDLC_PROJECT_NUMBER"];
  const missing = requiredKeys.some((k) => !process.env[k] || String(process.env[k]).trim() === "");
  if (!missing) return;

  const repoRoot = process.env.GITHUB_WORKSPACE
    ? process.env.GITHUB_WORKSPACE
    : require("path").resolve(__dirname, "..");
  const configRelPath = process.env.AIDLC_CONFIG_PATH || ".github/aidlc-config.json";
  const configPath = require("path").resolve(repoRoot, configRelPath);

  if (!fs.existsSync(configPath)) return;

  try {
    const parsed = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;

    for (const [key, rawValue] of Object.entries(parsed)) {
      if (process.env[key] && String(process.env[key]).trim() !== "") continue;
      if (rawValue === null || rawValue === undefined) continue;
      if (typeof rawValue === "object") continue;
      process.env[key] = String(rawValue);
    }
  } catch {
    // best-effort (ENV が正なら不要)
  }
}

/**
 * イベント種別と payload から、対象 Story の Issue 番号と目標 Status を決定
 */
function determineStatusAndIssue(eventName, event) {
  let targetStatus = null;
  let issueNumber = null;

  if (eventName === "push") {
    const ref = event.ref; // e.g. "refs/heads/feature/issue-123-something"
    const branchName = ref.replace("refs/heads/", "");
    const issueNum = parseIssueNumberFromBranch(branchName);
    if (!issueNum) {
      console.log(
        `push: ブランチ名 "${branchName}" から Issue番号を抽出できませんでした（例: feature/issue-123-...）。`
      );
      return { targetStatus: null, issueNumber: null };
    }
    targetStatus = STATUS_IN_PROGRESS;
    issueNumber = issueNum;
  } else if (eventName === "pull_request") {
    const pr = event.pull_request;
    const action = event.action;
    const branchName = pr.head && pr.head.ref ? pr.head.ref : null;
    const issueNum = branchName ? parseIssueNumberFromBranch(branchName) : null;
    if (!issueNum) {
      console.log(
        `pull_request: ブランチ名 "${branchName}" から Issue番号を抽出できませんでした（例: feature/issue-123-...）。`
      );
      return { targetStatus: null, issueNumber: null };
    }

    // action: opened, reopened, ready_for_review, closed, etc.
    if (action === "opened" || action === "reopened" || action === "ready_for_review") {
      targetStatus = STATUS_IN_REVIEW;
      issueNumber = issueNum;
    } else if (action === "closed") {
      // merged: true のときだけ Done にする
      if (pr.merged) {
        targetStatus = STATUS_DONE;
        issueNumber = issueNum;
      }
    }
  }

  return { targetStatus, issueNumber };
}

/**
 * ブランチ名から Issue 番号を抽出
 * - feature/issue-123-...   → 123
 * - feature/ABC-123-...     → 123
 */
function parseIssueNumberFromBranch(branchName) {
  if (!branchName) return null;

  const patterns = [/\bissue-(\d+)\b/i, /\b[A-Z][A-Z0-9]*-(\d+)\b/i];
  for (const pattern of patterns) {
    const match = branchName.match(pattern);
    if (!match) continue;
    const num = parseInt(match[1], 10);
    if (!Number.isNaN(num)) return num;
  }

  return null;
}

// --------------------
// GitHub API (REST/GraphQL) ユーティリティ
// --------------------

async function githubRest(path, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  const url = `${GITHUB_API_REST}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub REST error: ${res.status} ${res.statusText} - ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function githubGraphQL(query, variables = {}) {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(GITHUB_API_GRAPHQL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error("GitHub GraphQL error: " + JSON.stringify(json.errors));
  }
  return json.data;
}

// --------------------
// Project / Field 情報取得
// --------------------

async function getProjectAndStatusFieldInfo({ owner, projectNumber, statusFieldName, statusFieldCandidates }) {
  // owner が org の場合: organization(login: ...), user の場合: user(login: ...)
  // と分岐させることもできるが、ここでは organization を前提としつつ、
  // エラー時に user も試すシンプルな実装にする。
  let projectNode = null;

  const orgQuery = `
    query($login: String!, $number: Int!) {
      organization(login: $login) {
        projectV2(number: $number) {
          id
          number
          title
          fields(first: 50) {
            nodes {
              __typename
              ... on ProjectV2FieldCommon {
                id
                name
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const userQuery = `
    query($login: String!, $number: Int!) {
      user(login: $login) {
        projectV2(number: $number) {
          id
          number
          title
          fields(first: 50) {
            nodes {
              __typename
              ... on ProjectV2FieldCommon {
                id
                name
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const dataOrg = await githubGraphQL(orgQuery, { login: owner, number: projectNumber });
    projectNode = dataOrg.organization && dataOrg.organization.projectV2;
  } catch (e) {
    console.log("organization としての projectV2 取得に失敗:", e.message);
  }

  if (!projectNode) {
    try {
      const dataUser = await githubGraphQL(userQuery, { login: owner, number: projectNumber });
      projectNode = dataUser.user && dataUser.user.projectV2;
    } catch (e) {
      console.log("user としての projectV2 取得に失敗:", e.message);
    }
  }

  if (!projectNode) {
    console.log("organization/user どちらとしても projectV2 が取得できませんでした。");
    return null;
  }

  const projectId = projectNode.id;
  const fields = projectNode.fields.nodes || [];

  let statusFieldId = null;
  let statusFieldNameResolved = null;
  const statusOptionsByName = {};
  const statusOptionsByNorm = {};

  for (const field of fields) {
    if (field.__typename !== "ProjectV2SingleSelectField") continue;
    if (statusFieldId) continue;

    const norms = statusFieldCandidates?.norms
      ? statusFieldCandidates.norms
      : createCandidateSet([statusFieldName, "Status", "ステータス"]).norms;

    if (!norms.has(normalizeName(field.name))) continue;

    statusFieldId = field.id;
    statusFieldNameResolved = field.name;
    for (const opt of field.options || []) {
      statusOptionsByName[opt.name] = opt.id;
      statusOptionsByNorm[normalizeName(opt.name)] = opt.id;
    }
  }

  if (!statusFieldId) {
    const candidates = statusFieldCandidates?.candidates || [statusFieldName, "Status", "ステータス"];
    console.log(`Project に Status フィールドが見つかりませんでした。candidates=[${candidates.join(", ")}]`);
    return null;
  }

  return {
    projectId,
    statusFieldId,
    statusOptionsByName,
    statusOptionsByNorm,
    statusFieldNameResolved,
  };
}

// --------------------
// Issue → Project Item の取得
// --------------------

async function getProjectItemIdForIssue({ repoOwner, repoName, projectNumber, issueNumber }) {
  const query = `
    query($owner: String!, $name: String!, $number: Int!) {
      repository(owner: $owner, name: $name) {
        issue(number: $number) {
          id
          projectItems(first: 20) {
            nodes {
              id
              project {
                number
              }
            }
          }
        }
      }
    }
  `;

  const data = await githubGraphQL(query, {
    owner: repoOwner,
    name: repoName,
    number: issueNumber,
  });

  const issue = data.repository && data.repository.issue;
  if (!issue) return null;

  const items = issue.projectItems.nodes || [];
  const item = items.find((it) => it.project && it.project.number === projectNumber);
  if (!item) return null;
  return item.id;
}

// --------------------
// Project Item の Status 更新
// --------------------

async function updateProjectItemStatus({ projectId, itemId, fieldId, optionId }) {
  const mutation = `
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
      updateProjectV2ItemFieldValue(
        input: {
          projectId: $projectId,
          itemId: $itemId,
          fieldId: $fieldId,
          value: { singleSelectOptionId: $optionId }
        }
      ) {
        projectV2Item {
          id
        }
      }
    }
  `;

  await githubGraphQL(mutation, {
    projectId,
    itemId,
    fieldId,
    optionId,
  });
}

// --------------------
// 実行
// --------------------

main().catch((err) => {
  console.error("Status Sync fatal error:", err);
  process.exit(1);
});
