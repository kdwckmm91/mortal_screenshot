// 既存のIssueタイトルを一括修正するスクリプト
// <PROJECT_KEY>-XXX 形式などを [Type] #番号: 形式に変換

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('❌ GITHUB_TOKEN が設定されていません');
  process.exit(1);
}

const repoEnv = process.env.REPOSITORY || process.env.GITHUB_REPOSITORY;
if (!repoEnv) {
  console.error('❌ REPOSITORY / GITHUB_REPOSITORY が設定されていません');
  process.exit(1);
}

const [owner, repo] = repoEnv.split('/');

function formatIssueNumber(num) {
  return String(num).padStart(5, '0');
}

function buildPrefix(kind, num) {
  return `[${kind}] ${formatIssueNumber(num)}: `;
}

function cleanupTitle(kind, oldTitle) {
  let cleanTitle = String(oldTitle ?? '').trim();

  const templatePrefixSpace = `${kind}: `;
  const templatePrefixNoSpace = `${kind}:`;
  if (cleanTitle.startsWith(templatePrefixSpace)) {
    cleanTitle = cleanTitle.substring(templatePrefixSpace.length).trim();
  } else if (cleanTitle.startsWith(templatePrefixNoSpace)) {
    cleanTitle = cleanTitle.substring(templatePrefixNoSpace.length).trim();
  }

  const typeBracketPattern = new RegExp(`^\\[${kind}\\]\\s*`, 'i');
  cleanTitle = cleanTitle.replace(typeBracketPattern, '').trim();

  cleanTitle = cleanTitle.replace(/^[A-Z][A-Z0-9]*-\d+\s+/, '').trim();
  cleanTitle = cleanTitle.replace(/^#?\d+\s*:\s*/, '').trim();

  // 末尾の GitHub 自動付与 Issue番号 (例: #279) を削除
  cleanTitle = cleanTitle.replace(/\s+#\d+$/, '').trim();

  return cleanTitle;
}

async function fetchAllIssues() {
  const issues = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=${perPage}&page=${page}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!res.ok) {
      console.error(`❌ Issue取得に失敗しました: ${res.status}`);
      break;
    }

    const data = await res.json();
    if (data.length === 0) break;

    issues.push(...data);
    page++;
  }

  return issues;
}

async function updateIssueTitle(issue) {
  const number = issue.number;
  const oldTitle = issue.title;
  const labels = issue.labels.map(l => l.name);

  // Type判定
  let kind = null;
  if (labels.includes('Type: Epic')) kind = 'Epic';
  else if (labels.includes('Type: Story')) kind = 'Story';
  else if (labels.includes('Type: Task')) kind = 'Task';

  if (!kind) {
    console.log(`⏭️  Issue #${number}: Type ラベルなし - スキップ`);
    return { updated: false };
  }

  const prefix = buildPrefix(kind, number);
  const cleanTitle = cleanupTitle(kind, oldTitle);
  const newTitle = prefix + cleanTitle;

  // 既にフォーマット済みかチェック
  if (oldTitle === newTitle) {
    console.log(`✅ Issue #${number}: 既にフォーマット済み`);
    return { updated: false };
  }

  // タイトルが変更されない場合はスキップ
  if (oldTitle === newTitle) {
    console.log(`⏭️  Issue #${number}: 変更不要`);
    return { updated: false };
  }

  // タイトル更新
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${number}`;
  const updateRes = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: newTitle })
  });

  if (!updateRes.ok) {
    console.error(`❌ Issue #${number}: タイトル更新に失敗`);
    return { updated: false, error: true };
  }

  console.log(`🔄 Issue #${number}: 更新完了`);
  console.log(`   変更前: "${oldTitle}"`);
  console.log(`   変更後: "${newTitle}"`);

  return { updated: true, oldTitle, newTitle };
}

async function main() {
  console.log('📋 Issueを取得中...\n');
  const issues = await fetchAllIssues();
  console.log(`✅ ${issues.length}件のIssueを取得しました\n`);

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const issue of issues) {
    // Pull Requestsは除外
    if (issue.pull_request) continue;

    const result = await updateIssueTitle(issue);
    
    if (result.updated) {
      updatedCount++;
    } else if (result.error) {
      errorCount++;
    } else {
      skippedCount++;
    }

    // レート制限対策: 少し待機
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 処理結果:');
  console.log(`   更新: ${updatedCount}件`);
  console.log(`   スキップ: ${skippedCount}件`);
  console.log(`   エラー: ${errorCount}件`);
  console.log('='.repeat(60));
}

main().catch(error => {
  console.error('❌ エラーが発生しました:', error);
  process.exit(1);
});
