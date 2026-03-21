---
name: websearch
description: Web検索を行い、最新の情報をもとに質問に回答するための統合スキル。DuckDuckGo HTML版でSERPを取得し、fetch_webpageツールで段階的に情報を収集する。最新の技術情報・バージョン情報・プロジェクト外の知識が必要な場合、またはユーザーがWeb検索を明示的にリクエストした場合に自動アクティブ化。
---

# Web検索スキル

Web検索（DuckDuckGo HTML版）と `fetch_webpage` ツールを活用し、最新の情報をもとにユーザーの質問に正確に回答する。
推測や古い知識に頼らず、取得した情報に基づいて回答することで情報の正確性を担保する。

## 適用判断基準

以下の条件に **1つでも** 該当する場合、本スキルを適用する。

**適用する場合**:
- ユーザーが明示的にWeb検索をリクエストした
- 最新のバージョン情報・リリース日・変更履歴が必要
- プロジェクト外の技術仕様・API仕様の確認が必要
- 既存の知識のカットオフ日以降の情報が必要
- 正確性の担保にWeb上の一次情報源が必要

**適用しない場合**:
- ワークスペース内のコードやファイルに関する質問（`grep_search`/`read_file` を使用）
- 一般的なプログラミング概念の説明（既存知識で十分）
- ユーザーが提供した情報のみで回答可能

## 前提: ツールのロード

`fetch_webpage` は **deferred tool**（遅延ロードツール）であるため、使用前に必ず `tool_search_tool_regex` でロードする必要がある。

**ロード手順**（初回のみ）:
```
tool_search_tool_regex(pattern: "fetch_webpage")
```

> **⚠️ CRITICAL**: `fetch_webpage` を直接呼び出すと失敗する。必ず `tool_search_tool_regex` で事前にロードしてから使用すること。ロード済みの場合は再検索不要。

## `fetch_webpage` ツール仕様

Webページの主要コンテンツをMarkdown形式で取得するツール。

**パラメータ**:

| パラメータ | 型 | 必須 | 説明 |
|---|---|---|---|
| `urls` | `string[]` | ✅ | 取得対象のURL配列。複数URLを同時に指定可能 |
| `query` | `string` | ✅ | ページ内で検索する内容の簡潔な説明。取得結果のフィルタリングに使用される |

## 検索実行手順

### Step 1: 検索キーワードを決定する

ユーザーの質問を分析し、効果的な検索キーワードを決定する。

- 質問の核心を捉えたキーワードを選定する
- 技術名・バージョン番号・固有名詞を含める
- 日本語と英語の両方のキーワードを検討する（技術情報は英語の方が情報量が多い場合がある）

> 詳細なキーワード戦略は [references/search-strategies.md](references/search-strategies.md) を参照。

### Step 2: SERP（検索結果一覧）を取得する

DuckDuckGo HTML版を `fetch_webpage` で取得する。

**URL形式**:
```
https://html.duckduckgo.com/html/?q={キーワードを+で結合}
```

**キーワード指定ルール**:
- 英語キーワードは `+` で区切る（例: `Flutter+Firebase+AI+Logic`）
- 日本語キーワードはそのままURLエンコードして使用する

**実行例**:
```
fetch_webpage(
  urls: ["https://html.duckduckgo.com/html/?q=React+19+new+features"],
  query: "React 19 の新機能に関する検索結果一覧"
)
```

> **⚠️ 禁止**: Google 検索（google.com/search）は使用禁止。ボット検知でブロックされるため、**DuckDuckGo HTML版のみ** を使用すること。

> DuckDuckGo固有の検索演算子については [references/search-operators.md](references/search-operators.md) を参照。

### Step 3: SERP応答からURLを選定する

`fetch_webpage` はHTMLをMarkdown変換した形式で結果を返す。以下のパターンでURL・タイトル・スニペットを抽出する。

**SERP応答の典型的な構造**:
```
[タイトルテキスト](https://example.com/path)
スニペット（説明文）...
```

**抽出手順**:
1. Markdown内のリンク `[text](url)` パターンからURLとタイトルを抽出する
2. DuckDuckGo内部リンク（`duckduckgo.com` ドメイン）やナビゲーションリンクを除外する
3. 各リンク直後のテキストをスニペットとして取得する

**URL選定基準**（優先度順）:
1. 公式ドキュメント・公式ブログ
2. GitHub リポジトリ・リリースページ
3. Stack Overflow・技術ブログ（Zenn、Qiita 等）
4. その他の信頼性の高いソース

**選定件数**: 2〜4件を目安に選定する。

### Step 4: 個別ページの詳細を取得する

選定したURLを `fetch_webpage` で取得し、詳細な情報を収集する。

**実行例**:
```
fetch_webpage(
  urls: [
    "https://react.dev/blog/2024/12/05/react-19",
    "https://github.com/facebook/react/releases/tag/v19.0.0"
  ],
  query: "React 19 の新機能、破壊的変更、マイグレーション方法"
)
```

> 複数URLを配列で渡すことで、1回のツール呼び出しで複数ページを同時取得できる。

> ページ取得に失敗した場合は [references/troubleshooting.md](references/troubleshooting.md) を参照。

### Step 5: 回答を生成する

収集した情報をもとに日本語で回答を生成する。

**回答フォーマット**:
```markdown
## 回答内容

[ここに回答本文]

## 情報源

- [ページタイトル](URL)
- [ページタイトル](URL)
```

## ルール

### 検索エンジン
- **DuckDuckGo HTML版のみ使用** する
- Google 検索は使用禁止（ボット検知でブロックされるため）

### ツール使用
- `fetch_webpage` は使用前に `tool_search_tool_regex` で必ずロードする
- ロード済みであれば再検索は不要

### 回答品質
- 情報源のURLを **必ず明示** する
- 推測や古い知識に頼らず、**取得した情報に基づいて** 回答する
- 取得できなかった場合はその旨を正直に伝える
- 検索結果が不十分な場合はキーワードを変えて再検索する（**最大3回**）

### 回答言語
- すべての回答は **日本語** で作成する

## チェックフロー

```
ユーザーの質問を受取
    ↓
適用判断基準を確認 → 該当しない場合はスキル適用終了
    ↓
tool_search_tool_regex で fetch_webpage をロード（未ロードの場合）
    ↓
検索キーワードを決定
    ↓
DuckDuckGo HTML版で SERP を取得
    ↓
結果が十分？
    ↓ No → キーワードを変えて再検索（最大3回）
    ↓ Yes
有望な URL を選定（2〜4件）
    ↓
fetch_webpage で詳細を取得
    ↓
情報源 URL を明示した日本語回答を生成
```

## 参考資料

### References（必要に応じてロード）
- [search-strategies.md](references/search-strategies.md) — ユースケース別の検索キーワード戦略
- [search-operators.md](references/search-operators.md) — DuckDuckGo固有の検索演算子・高度クエリ技法
- [troubleshooting.md](references/troubleshooting.md) — 検索失敗時のエラーハンドリングとフォールバック戦略

### 関連ファイル
- カスタムプロンプト: [.github/prompts/websearch.prompt.md](../../prompts/websearch.prompt.md)
- 旧スキル: [.github/skills/websearch-guide/SKILL.md](../websearch-guide/SKILL.md)
