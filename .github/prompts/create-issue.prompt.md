---
agent: agent
description: AIDLCドキュメントを元にGitHub Issueを自動作成し、Projectに追加します。
---

# GitHub Issue作成プロンプト

## 設定（配布時に編集）

以下の値をプロジェクトに合わせて変更してください。

| 変数 | 値 | 説明 |
|------|-----|------|
| `PROJECT_OWNER` | `<your-org>` | GitHub Organization または ユーザー名 |
| `PROJECT_NUMBER` | `<project-number>` | GitHub Project の番号 |
| `PROJECT_NAME` | `<project-name>` | GitHub Project の名前（`gh issue create --project` で使用） |

---

## 概要

このプロンプトは以下の手順でIssueを作成する：
1. **Projects状態確認** → 既存Issue一覧を取得
2. **AIDLCドキュメント解析** → Issue候補を抽出
3. **親Issue自動判定** → 紐づけ先を決定
4. **ユーザー確認** → 承認を得る
5. **Issue作成・Project追加** → 実行

---

## STEP 1: Projects状態確認

**【必須】Issue作成前に必ず実行すること**

### 1.1 既存Issueの取得

```bash
# Epic一覧
gh search issues --project {PROJECT_OWNER}/{PROJECT_NUMBER} --label "Type: Epic" --state open --json number,title

# Story一覧
gh search issues --project {PROJECT_OWNER}/{PROJECT_NUMBER} --label "Type: Story" --state open --json number,title

# Task一覧
gh search issues --project {PROJECT_OWNER}/{PROJECT_NUMBER} --label "Type: Task" --state open --json number,title
```

> **Note**: `{PROJECT_OWNER}/{PROJECT_NUMBER}` は設定セクションの値を使用する。

### 1.2 結果をユーザーに報告

```
📋 現在のProjects状態:

【Epic】
  #10 ユーザー管理機能
  #15 コスト可視化ダッシュボード

【Story】
  #25 ユーザー登録機能 → Epic #10
  #30 ログイン機能 → Epic #10
```

---

## STEP 2: AIDLCドキュメント解析

### 2.1 現在フェーズの確認

`aidlc-docs/aidlc-state.md` を読み込み、現在のフェーズを確認する。

### 2.2 参照ドキュメントの決定

**最低限取得するドキュメント:**

| 作成するIssue | 必須ドキュメント |
|--------------|-----------------|
| **Epic** | `inception/requirements/requirements.md` |
| **Story** | `inception/application-design/unit-of-work.md` |
| **Task** | `construction/plans/{unit-name}-*.md` |

**状況に応じて追加取得:**

ユーザープロンプトやAIDLCの状態に応じて、必要に応じて以下を参照する：

- `inception/user-stories/stories.md` - ユーザーストーリーの詳細が必要な場合
- `inception/application-design/unit-of-work-story-map.md` - Story-Unit間のマッピングが必要な場合
- `inception/application-design/components.md` - コンポーネント情報が必要な場合
- `inception/application-design/services.md` - サービス層の情報が必要な場合
- `construction/{unit-name}/` 配下 - 具体的な設計情報が必要な場合
- `inception/requirements/domain-glossary.md` - 用語の確認が必要な場合
- ユーザーからの追加指定ドキュメント

### 2.3 Issue候補の抽出

ドキュメントから以下を抽出：
- Issue種別（Epic/Story/Task）
- タイトル
- 内容（Summary、User Story、タスク内容など）

---

## STEP 3: 親Issue自動判定

### 3.1 判定ルール

| 作成するIssue | 親Issue | 判定基準 |
|--------------|--------|---------|
| **Story** | Epic | タイトルのキーワード一致、機能領域の一致 |
| **Task** | Story | Unit名との一致、コンポーネント関連性 |

### 3.2 判定の実行

1. STEP 1で取得した既存Issue一覧を参照
2. 作成するIssueの内容と照合
3. 最も関連性の高い親Issueを特定

---

## STEP 4: ユーザー確認

**【必須】Issue作成前に必ず確認を得ること**

### 4.1 確認事項

以下をユーザーに提示し、承認を得る：

```
📝 Issue作成確認:

【作成予定】
種別: Task
タイトル: 登録フォームUI作成
親Story: #25 ユーザー登録機能

【ブランチ作成】
作成しますか？ Yes / No

この内容でよろしいですか？
```

### 4.2 必須確認項目

- [ ] Issue内容の確認
- [ ] 親Issueの紐づけ確認
- [ ] ブランチ作成要否の確認（Story/Taskの場合）

---

## STEP 5: Issue作成・Project追加

### 5.1 Bodyファイル生成

ISSUE_TEMPLATEと同一フォーマットでbodyを生成し、一時ファイルに保存する。

> **Note**: `gh issue create` では `--template` と `--body` を同時に使用できないため、テンプレートと同一フォーマットのbodyを生成し、`--label` でラベルを直接指定する。

**Epic の場合（ラベル: `Type: Epic`）:**

一時ファイル: `.github/tmp/issue_body.md`

```markdown
## 概要
このEpicは、プロジェクトにおける大きな開発テーマを表します。
配下に複数のStoryがぶら下がる想定です。

---

## 概要（Summary）
[AIDLCドキュメントから抽出した概要]

---

## 背景 / 課題
[なぜこのEpicが必要か]

---

## ゴール / 成功条件
- [条件1]
- [条件2]

---

## スコープ（含まれるもの / 含まれないもの）

### 含まれる
- [項目1]

### 含まれない
- [項目1]

---

## リスク / 懸念事項
- [リスク1]

---

## 関連するIssue / Story
- #[番号]
```

**Story の場合（ラベル: `Type: Story`）:**

一時ファイル: `.github/tmp/issue_body.md`

```markdown
## 概要
Storyは、Epicを構成する開発・検証の単位です。
AIDLCのStatus Syncは、このStory単位で進捗を自動更新します。

---

### 関連するEpic
#[Epic番号]

---

### ユーザーストーリー
As：[誰として]
When：[いつ/何をするときに]
So that：[何ができるようにしたい]

---

### 受け入れ条件（Acceptance Criteria）
- [条件1]
- [条件2]

---

### AI-DLCフェーズ（参考）
- [x] Construction（構築・実装）

---

### ブランチ作成
- [x] Yes - 新しいブランチを作成する

---

### 想定されるタスク（任意）
- [タスク1]
- [タスク2]
```

**Task の場合（ラベル: `Type: Task`）:**

一時ファイル: `.github/tmp/issue_body.md`

```markdown
## 概要
Task は Story を完了させるための作業単位です。
必要に応じて 対象Project（Projects v2）に載せ、Timeline / Board で可視化します。

---

### 親Story
#[Story番号]

---

### タスク内容
[具体的にやること]

---

### 完了の定義（Doneの状態）
- [完了条件1]
- [完了条件2]

---

### ブランチ作成
- [x] No - Storyのブランチを使用

---

### 備考
- [参考URL、補足など]
```

### 5.2 Issue作成コマンド（Project追加込み）

```bash
# Epic
gh issue create \
  --title "[タイトル]" \
  --label "Type: Epic" \
  --project "{PROJECT_NAME}" \
  --body-file .github/tmp/issue_body.md

# Story
gh issue create \
  --title "[タイトル]" \
  --label "Type: Story" \
  --project "{PROJECT_NAME}" \
  --body-file .github/tmp/issue_body.md

# Task
gh issue create \
  --title "[タイトル]" \
  --label "Type: Task" \
  --project "{PROJECT_NAME}" \
  --body-file .github/tmp/issue_body.md
```

> **Note**: `{PROJECT_NAME}` は設定セクションの値を使用する。`--body-file` で一時ファイルからbodyを読み込むことで、複数行のbodyを正しく渡すことができる。

### 5.3 結果報告

```
✅ Issue作成完了:

[Task] #150 登録フォームUI作成
  URL: https://github.com/<your-org>/<your-repo>/issues/150
  親Story: #25
  Project: 追加済み
```

### 5.4 一時ファイルの削除

Issue作成完了後、一時ファイルを削除する：

```bash
rm -f .github/tmp/issue_body.md
```

> **Note**: 複数Issueを連続作成する場合は、全Issue作成完了後にまとめて削除する。

---

## Issue種別の判断基準

### いつEpicを作成するか
- 大規模な開発テーマ（1-3ヶ月）
- 複数のStoryに分割できる
- ビジネス価値が明確

### いつStoryを作成するか
- ConstructionのUnit自体
- 1-2週間で完了する規模
- User Storyとして記述可能

### いつTaskを作成するか
- Unit内での細かい作業
- 1日〜数日で完了
- 具体的な実装タスク

---

## Template記入ガイド

### Epic

タイトルは機能名のみを入力する（プレフィックス不要）。

| フィールド | 記入内容 |
|-----------|----------|
| **概要（Summary）** | このEpicで実現したいことを一言で |
| **背景 / 課題** | なぜこのEpicが必要なのか |
| **ゴール / 成功条件** | 完了と判断する条件（定量・定性） |
| **スコープ** | 含まれるもの / 含まれないもの |
| **リスク / 懸念事項** | 想定されるリスク |
| **関連するIssue / Story** | 関連Issue番号 |

### Story

タイトルは機能名のみを入力する（プレフィックス不要）。

| フィールド | 記入内容 |
|-----------|----------|
| **関連するEpic** | `#[Epic番号]` |
| **ユーザーストーリー** | As: [誰として]<br>When: [いつ/何をするときに]<br>So that: [何ができるようにしたい] |
| **受け入れ条件（Acceptance Criteria）** | 完了条件をチェックリストで |
| **AI-DLCフェーズ** | Inception / Construction / Transition |
| **ブランチ作成** | Yes / No |
| **想定されるタスク** | Task Issueの叩き台（任意） |

### Task

タイトルはタスク名のみを入力する（プレフィックス不要）。

| フィールド | 記入内容 |
|-----------|----------|
| **親Story** | `#[Story番号]` |
| **タスク内容** | 具体的にやること |
| **完了の定義（Doneの状態）** | 完了と判断する条件 |
| **ブランチ作成** | No（通常）/ Yes（並行作業時） |
| **備考** | 参考URL、補足など（任意） |

---

## 注意事項

1. **GitHub Actionsによる自動処理**
  - タイトルフォーマット（`[Type] #00001: タイトル`（5桁ゼロ埋め））
   - ラベル付与（`Type: Epic/Story/Task`）
   - 親子関係設定
   - Status設定（初期: Todo）
   
   → Agentはこれらを手動で設定する必要なし

2. **親子関係の必須ルール**
   - Task → 必ずStoryに紐づける
   - Story → 必ずEpicに紐づける
   - 紐づけ先が存在しない場合は、先に親Issueを作成する

3. **Task IssueとTask Listの使い分け**
   - 1日以上の作業 → Task Issue
   - 数時間以内の確認項目 → Task List（Issue内のチェックボックス）