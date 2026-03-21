---
name: webapi-spec
description: WebAPI仕様書の作成スキル。コードベース分析からMarkdown仕様書を生成し、セキュリティ診断観点を含む包括的なAPI仕様書を作成する。オプションでWord(.docx)形式に変換可能。「API仕様書」「WebAPI仕様」「インターフェース仕様書」「API documentation」「脆弱性診断」「WebAPI仕様書」「ペネトレーションテスト」「セキュリティ診断」などの表現で自動アクティブ化。
---

# WebAPI Specification Generator

対象プロジェクトのコードベースを分析し、APIエンドポイント・認証仕様・データモデル・セキュリティ観点を含む包括的なWebAPI仕様書を自動生成するスキル。

## Overview

WebAPI仕様書は以下のような場面で必要になる:

- **チーム間共有**: フロントエンド/バックエンド間、チーム間でのAPI仕様の共有
- **外部ベンダー連携**: 脆弱性診断ベンダー、外部開発パートナーへの情報提供
- **API公開ドキュメント**: 利用者向けのAPI仕様公開
- **セキュリティレビュー**: セキュリティ観点でのAPI設計レビュー
- **運用引き継ぎ**: 運用チームへのAPI仕様引き継ぎ

このスキルは以下を実現する:

1. 対象プロジェクトのコードベースを分析し、APIエンドポイント・認証仕様・データモデルを特定
2. セキュリティ診断観点を含む構造化されたMarkdown仕様書を生成
3. オプションでWord (.docx) 形式の仕様書を生成

## Workflow

```
Phase 1: 情報収集          Phase 2: Markdown生成       Phase 3: docx出力（任意）
┌──────────────────┐     ┌──────────────────┐       ┌──────────────────┐
│ 1-1 システム構成  │     │ ドキュメント構造  │       │ docx-js テンプレ │
│ 1-2 認証・認可   │ ──▶ │ テンプレートに    │ ──▶   │ ートを使って     │
│ 1-3 EP全量把握   │     │ 従いMD生成       │       │ Word文書に変換   │
│ 1-4 ユーザー確認 │     │ + 自己レビュー   │       │                  │
└──────────────────┘     └──────────────────┘       └──────────────────┘
```

### Phase 1: 情報収集

対象プロジェクトの以下の情報を収集する。不明な点はユーザーに質問する。

#### 1-1. システム構成の把握

以下の要素を特定する:

- **フロントエンド技術** (React, Vue, Angular, etc.)
- **バックエンドフレームワーク** (FastAPI, Express, Spring Boot, Django, Rails, etc.)
- **API Gateway / リバースプロキシ** (AWS API Gateway, nginx, Kong, etc.)
- **認証基盤** (Cognito, Auth0, Okta, Firebase Auth, Keycloak, 自前実装 etc.)
- **データストア** (RDS, DynamoDB, Athena, MongoDB, etc.)
- **ホスティング** (Lambda, ECS, EC2, Kubernetes, etc.)
- **CDN** (CloudFront, Cloudflare, etc.)

#### 1-2. 認証・認可仕様の把握

- **認証フロー**: IdP連携有無、トークン種別（JWT / Session / API Key / OAuth2）
- **認可モデル**: RBAC / ABAC / カスタム
- **ロール定義**: 各ロールのアクセス範囲
- **トークン配送**: Header / Cookie / Query Parameter
- **トークンのライフサイクル**: 有効期限、リフレッシュ方法

#### 1-3. API エンドポイントの全量把握

コードベースから以下の方法でエンドポイントを特定する:

- **ルーター/コントローラーファイルの走査**: フレームワーク固有のルーティング定義を検索
  - FastAPI: `@router.get`, `@router.post`, `@app.get` 等
  - Express: `router.get`, `router.post`, `app.get` 等
  - Spring Boot: `@GetMapping`, `@PostMapping`, `@RequestMapping` 等
  - Django REST: `urlpatterns`, `@api_view` 等
  - Next.js App Router: `app/api/**/route.ts` のファイル構造
  - Rails: `config/routes.rb`
- **API Gateway / IaC設定**: CloudFormation, Terraform, Serverless Framework 等のルート定義を確認
- **OpenAPI / Swagger 定義**: 既存のAPI仕様ファイルがあれば参照

各エンドポイントについて以下を記録:
- HTTPメソッド、パス、認可レベル
- リクエストパラメータ（パス / クエリ / ヘッダー / ボディ）とバリデーションルール
- レスポンス構造（正常系 + エラー系）
- サンプルリクエスト（curlコマンド形式）
- サンプルレスポンス（JSONイメージ）

#### 1-4. ユーザーへの確認事項

コードベース分析だけでは判断できない以下の項目を `[Question]` + `[Answer]` 形式で確認する:

| 確認項目 | 質問の目的 |
|---------|-----------|
| 仕様書の利用目的 | チーム共有 / 外部連携 / セキュリティ診断 / その他 |
| 対象環境 | STG / DEV / 本番のどれを対象とするか |
| ベースURL | カスタムドメイン or デフォルトURL |
| 対象外EP | 仕様書に含めないエンドポイントの有無 |
| 開発中EP | 未リリースAPIの有無と仕様書での扱い方 |
| 中間層ヘッダー | WAF / CDN / API GW で付与されるヘッダー情報 |
| レート制限 | スロットリング設定の有無と値 |
| 仕様書の出力形式 | Markdownのみ or Word (.docx) も必要か |

### Phase 2: Markdown仕様書の生成

`references/document-structure.md` に定義されたドキュメント構造テンプレートに従い、Markdown形式で仕様書を生成する。

#### 出力先

仕様書の出力先はプロジェクト構造に合わせて決定する。一般的なパス例:
- `documents/api/webapi-spec.md`
- `docs/api-specification.md`
- `documents/vulnerability-assessment/webapi-spec.md`（セキュリティ診断目的の場合）

#### 生成ルール

1. **プレースホルダーの使用**: 環境固有の値（URL、トークン等）は `{BASE_URL}`, `{JWT_TOKEN}` 等のプレースホルダーを使用
2. **サンプルリクエストはcurl形式**: そのまま実行できるcurlコマンドを記載
3. **エラーケースの網羅**: 各エンドポイントの正常系に加え、代表的なエラーケース（認証エラー、バリデーションエラー、権限不足等）のサンプルを含める
4. **セキュリティ診断観点の付記**: 各エンドポイントで注意すべき診断観点は `references/security-perspectives.md` を参照し、必要に応じて注釈として記載
5. **認証情報をハードコードしない**: 実際のトークンやURLを文書に含めない。プレースホルダーのみ使用
6. **エンドポイントのカテゴリ分け**: リリース状態、機能グループ等の適切な区分で整理

#### 生成後の自己レビュー

Markdownを生成したら、以下をセルフレビューする:
- 全エンドポイントが漏れなく記載されているか
- リクエスト/レスポンスのフィールド定義が実装と一致しているか
- サンプルリクエストが実行可能な形式か
- エラーコード・レスポンス形式がコードベースと一致しているか
- セキュリティ観点が各エンドポイントの特性に適合しているか

レビュー結果をユーザーに提示し、承認を得てからPhase 3に進む。

### Phase 3: Word (.docx) 出力（任意）

ユーザーがWord形式を要求した場合、docx-jsライブラリを使用してWord文書を生成する。

#### 前提条件

- Node.js がインストール済みであること
- `docx` npm パッケージが利用可能であること（グローバルまたはローカル）
- `docx` スキルが存在する場合は `docx-js.md` を参照すること

#### 生成手順

1. `scripts/generate_docx.js` テンプレートを参考に、プロジェクト固有のdocx生成スクリプトを作成
2. Phase 2で生成したMarkdown仕様書の内容をdocx-jsのDocument構造に変換
3. スクリプトを実行してdocxファイルを出力

#### docx生成の必須ルール

- **改行に `\n` を使わない**: 常に別々の `Paragraph` 要素を使用
- **テーブルセルのシェーディング**: `ShadingType.CLEAR` を使用（SOLIDは黒背景になる）
- **テーブル幅**: `columnWidths` 配列と各セルの `width` の両方を設定
- **PageBreak**: `new Paragraph({ children: [new PageBreak()] })` — 必ずParagraph内に配置
- **箇条書き**: `LevelFormat.BULLET` 定数を使用（文字列 "bullet" ではない）
- **デフォルトフォント**: `styles.default.document.run.font` で Arial を設定
- **DXA単位**: 1440 DXA = 1インチ。Letter用紙の利用可能幅 = 9360 DXA（1"マージン時）

#### スクリプト構成パターン

`scripts/generate_docx.js` テンプレートは以下のヘルパー関数群を提供:

| 関数 | 用途 |
|------|------|
| `headerCell(text, width)` | テーブルヘッダーセル（濃色背景・白文字） |
| `cell(text, width, opts)` | 通常テーブルセル（コード表示、中央揃え等オプション付き） |
| `codeBlock(code)` | コードブロック（Consolas・背景色付きParagraph配列） |
| `kvTable(rows)` | キー値テーブル（2列・概要情報用） |
| `fieldTable(cols, data)` | フィールド定義テーブル（n列・リクエストボディ/レスポンス用） |
| `sampleSection(title, curl, json)` | サンプルリクエスト＋レスポンスセクション |
| `noteBox(text)` | 注釈ボックス（警告背景色付き） |
| `sectionTitle(text, level)` | セクション見出し |
| `requestOverview(method, path, ...)` | リクエスト概要テーブル |

## Document Structure Reference

詳細なドキュメント構造テンプレートは `references/document-structure.md` を参照。主要セクション構成:

| セクション | 内容 |
|-----------|------|
| 1. システム概要 | アーキテクチャ構成図、環境情報テーブル |
| 2. 認証・認可仕様 | 認証フロー、トークン仕様、認可モデル |
| 3. 共通エラーレスポンス | エラーコード一覧、レスポンス形式 |
| 4. URL一覧 | 全エンドポイントの一覧テーブル（メソッド・パス・認可・区分） |
| 5〜N. API詳細仕様 | カテゴリ別のエンドポイント詳細（リクエスト/レスポンス/サンプル） |
| N+1. CORSポリシー | 環境別CORS設定 |
| N+2. レート制限・制約 | スロットリング、サイズ制限等 |
| N+3. セキュリティ関連ヘッダー | アプリケーション層のセキュリティヘッダー |

## Security Perspectives Reference

`references/security-perspectives.md` は、APIの操作パターン（READ / CREATE / UPDATE / DELETE / 検索 / ファイルアップロード）別にセキュリティ診断観点を整理したリファレンスである。各エンドポイントの特性に応じた診断ポイントを選定する際に参照する。

## Resources

### scripts/
- `generate_docx.js` - docx-jsを使用したWord文書生成のテンプレートスクリプト。ヘルパー関数群とドキュメント構築の雛形を提供。プロジェクト固有のエンドポイント情報を埋め込んで使用する。

### references/
- `document-structure.md` - WebAPI仕様書の標準ドキュメント構造テンプレート。セクション構成、各セクションに含めるべき項目、Markdownの記載例を定義。
- `security-perspectives.md` - API種類・操作パターン別のセキュリティ診断観点一覧。エンドポイントの特性に応じた診断ポイントの参考資料。

