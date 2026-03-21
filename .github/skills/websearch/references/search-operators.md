# DuckDuckGo 検索演算子・高度クエリ技法

DuckDuckGo HTML版で使用可能な検索演算子と、検索精度を向上させるテクニック。

## 基本演算子

| 演算子 | 説明 | 使用例 |
|---|---|---|
| `"phrase"` | 完全一致フレーズ検索 | `"useEffect cleanup function"` |
| `site:` | 特定サイト内に限定 | `site:github.com React server components` |
| `-keyword` | 特定キーワードを除外 | `React hooks -class component` |
| `filetype:` | ファイル形式で絞り込み | `filetype:pdf AWS Well-Architected` |
| `intitle:` | タイトルにキーワードを含む | `intitle:migration Next.js 15` |

## サイト限定検索の活用

特定ドメインに絞ることで、信頼性の高い情報源から効率的に情報を取得する。

### 公式ドキュメント検索

```
site:react.dev useEffect best practices
site:nextjs.org App Router migration
site:docs.aws.amazon.com Lambda cold start
site:learn.microsoft.com Azure Functions
```

### GitHub 検索

```
site:github.com {リポジトリ名} release
site:github.com {組織名} {プロジェクト名} CHANGELOG
site:github.com {パッケージ名} issues {エラーメッセージ}
```

### 技術ブログ・Q&A検索

```
site:stackoverflow.com {技術名} {問題}
site:zenn.dev {技術名} {キーワード}
site:qiita.com {技術名} {キーワード}
site:dev.to {技術名} {キーワード}
```

## 除外パターン

不要な結果を除外して精度を上げる。

```
React hooks tutorial -youtube -video
AWS Lambda pricing -calculator
Next.js deployment -vercel    # Vercel以外のデプロイ方法を検索
TypeScript generics -beginner # 入門記事を除外
```

## フレーズ検索の活用

エラーメッセージや特定の技術用語を正確に検索する。

```
"Cannot find module" TypeScript
"CORS policy" fetch API solution
"connection refused" PostgreSQL Docker
```

**注意**: フレーズ検索では動的な部分（パス、数値等）を除外したコアメッセージのみを引用符で囲む。

```
# ✅ 良い例
"Cannot read properties of undefined" React

# ❌ 悪い例（パスは動的なので含めない）
"Cannot read properties of undefined (reading 'map') at /Users/..."
```

## 時間指定検索

DuckDuckGo HTML版では直接的な時間フィルターのパラメータはサポートされていない。代わりにキーワードに年を含める。

```
React 19 new features 2024
Next.js 15 release notes 2025
TypeScript 5.5 changelog 2024
```

## Bang検索（リダイレクト）

DuckDuckGoのBang検索は、特定サイトに直接リダイレクトする機能。HTML版でも使用可能。

| Bang | リダイレクト先 | 使用例 |
|---|---|---|
| `!gh` | GitHub | `!gh react server components` |
| `!so` | Stack Overflow | `!so React useEffect infinite loop` |
| `!npm` | npm | `!npm zod` |
| `!mdn` | MDN Web Docs | `!mdn fetch API` |
| `!w` | Wikipedia | `!w REST API` |

**注意**: Bang検索はSERPの代わりに対象サイトの検索結果にリダイレクトされる。SERPパースの代わりにリダイレクト先のページが直接取得される。

## 組み合わせ例

複雑な検索ニーズに対する演算子の組み合わせ例。

### ライブラリの最新脆弱性を調査

```
site:github.com {パッケージ名} security advisory 2025
```

### 公式ドキュメントからAPI仕様を検索

```
site:docs.aws.amazon.com "S3" "putObject" intitle:API
```

### エラー解決（ノイズを除外）

```
"ECONNREFUSED" Node.js Docker -windows site:stackoverflow.com
```

### 特定バージョンのマイグレーションガイド

```
site:nextjs.org "upgrading" intitle:migration 15
```

## URL構成時の注意

DuckDuckGo HTML版のURL構成ルール。

```
https://html.duckduckgo.com/html/?q={エンコード済みクエリ}
```

- スペースは `+` に変換する
- 特殊文字（`"`, `:`, `-`）はURLエンコードせずそのまま使用可能
- 日本語はURLエンコードする

**例**:
```
# site: 演算子を使用する場合
https://html.duckduckgo.com/html/?q=site:github.com+React+19+release

# フレーズ検索を使用する場合
https://html.duckduckgo.com/html/?q="Cannot+find+module"+TypeScript+fix

# 除外を使用する場合
https://html.duckduckgo.com/html/?q=React+hooks+tutorial+-youtube
```
