// 既存のIssueタイトルを一括修正するスクリプト
// GitHub Actions の issue_title_formatter.yml と同じロジックを使用

const issueNumber = process.argv[2];

if (!issueNumber) {
  console.error('使用方法: node scripts/fix_issue_title.js <issue_number>');
  process.exit(1);
}

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

async function fixIssueTitle(num) {
  const issueUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${num}`;
  
  // Issue取得
  const issueRes = await fetch(issueUrl, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!issueRes.ok) {
    console.error(`❌ Issue #${num} が見つかりません`);
    process.exit(1);
  }
  
  const issue = await issueRes.json();
  const oldTitle = issue.title;
  const labels = issue.labels.map(l => l.name);
  
  // Type判定
  let kind = null;
  if (labels.includes('Type: Epic')) kind = 'Epic';
  else if (labels.includes('Type: Story')) kind = 'Story';
  else if (labels.includes('Type: Task')) kind = 'Task';
  
  if (!kind) {
    console.error(`❌ Issue #${num} には Type ラベルがありません`);
    process.exit(1);
  }

  const prefix = buildPrefix(kind, issue.number);
  const cleanTitle = cleanupTitle(kind, oldTitle);
  const newTitle = prefix + cleanTitle;

  // すでに正しいフォーマットになっていれば何もしない
  if (oldTitle === newTitle) {
    console.log(`✅ Issue #${num} は既にフォーマット済みです: "${oldTitle}"`);
    return;
  }
  
  // タイトル更新
  const updateRes = await fetch(issueUrl, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: newTitle })
  });
  
  if (!updateRes.ok) {
    console.error(`❌ タイトル更新に失敗しました`);
    process.exit(1);
  }
  
  console.log(`✅ タイトルを更新しました`);
  console.log(`   変更前: "${oldTitle}"`);
  console.log(`   変更後: "${newTitle}"`);
}

fixIssueTitle(issueNumber);
