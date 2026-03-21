---
name: screen-transition-doc
description: Webアプリケーションの画面遷移図・機能一覧・URL一覧・API紐付けドキュメントを自動生成するスキル。ソースコード分析から画面定義を抽出し、Playwrightによるスクリーンショットキャプチャ、Markdownドキュメント生成、DOCX変換までをカバーする。「画面遷移図」「画面一覧」「機能一覧」「screen transition」「画面仕様書」「スクリーンショット付きドキュメント」などの表現で自動アクティブ化。
---

# Screen Transition Document Generator

Webアプリケーションのソースコードと仕様書から、画面遷移図・機能一覧・API紐付けドキュメントを自動生成するスキル。

## 概要

対象のWebアプリケーションのルーティング・画面構成・APIエンドポイントをソースコードから分析し、以下を生成する:

1. **config.js** — 画面定義・API仕様・遷移ルールの構造化データ
2. **capture.js** — Playwrightによるスクリーンショット自動取得スクリプト
3. **generate-doc.js** — Markdownドキュメント生成スクリプト
4. **generate-docx.js** — DOCX変換スクリプト（オプション）

## トリガー条件

以下のリクエストでこのスキルをアクティブ化する:

- 「画面遷移図を作成して」「画面一覧を作って」
- 「画面仕様書を生成して」「スクリーンショット付きドキュメント」
- 「screen transition document」「screen capture document」
- 「全画面のURL一覧・機能一覧を作って」

## 前提条件

- **Node.js** (v18+)
- **Playwright** (`playwright` npm パッケージ + `npx playwright install chromium`)
- **docx** (`docx` npm パッケージ、DOCX変換時のみ)
- **@mermaid-js/mermaid-cli** (Mermaid図のPNG変換時のみ、`npx` で利用可能)

## ワークフロー

### Phase 1: ソースコード分析

対象アプリケーションのソースコードを分析し、以下を抽出する。
詳細は `references/workflow-detail.md` の「Phase 1」セクションを参照。

1. **ルーティング定義** — URLパス、ページコンポーネント、認可要件
2. **画面構成** — 各画面の保有機能、UIコンポーネント、タブ/ビュー構造
3. **APIエンドポイント** — 各画面が呼び出すAPIのメソッド・パス・パラメータ
4. **画面遷移** — ナビゲーション構造（サイドバー、タブ切替、リダイレクト）

分析対象（フレームワーク非依存 — 対象プロジェクトの技術スタックに応じて適用）:
- ルーティング: Next.js (`app/`, `pages/`)、React Router、Vue Router、Angular Router、SvelteKit、Nuxt 等
- API呼び出し: `fetch`, `axios`, カスタムAPIクライアント、React Query/SWR/TanStack Query、Apollo Client 等
- 認可: ルートガード、ミドルウェア、ロールベースアクセス制御
- ナビゲーション: サイドバー/ヘッダーのリンク構造、各フレームワークのルーターリンクコンポーネント

### Phase 2: プロジェクトセットアップ

分析結果を基にツール群を生成する。

1. **出力ディレクトリの確認** — ドキュメントおよびスクリプトの保存先をユーザーに確認する。`[Question]` + `[Answer]` 形式で以下を問い合わせる:
   - ドキュメント出力先（例: `documents/<project-name>/screen-transition/`）
   - スクリプト保存先（例: `scripts/screen-capture/`）
2. **出力ディレクトリ作成** — 確認した出力先にディレクトリを作成
3. **スクリプトディレクトリ作成** — 確認した保存先にディレクトリを作成
4. **package.json 生成** — 依存関係（playwright, docx）
5. **config.js 生成** — 画面定義・API仕様・遷移ルール（スキーマは `references/config-schema.md` 参照）

### Phase 3: キャプチャスクリプト生成

`capture.js` を生成する。主な設計パターン:

- **認証フロー対応** — 初回実行時は手動ログイン→Cookie保存、2回目以降は `--reuse` で再利用
- **ネットワーク傍受** — `/api/` パスのリクエスト/レスポンスを自動記録
- **機密データマスキング** — Authorization ヘッダー、個人情報をマスク
- **タブ切替対応** — 同一URLパス内の複数ビュー（`afterNavigate` アクション）
- **セレクター待機** — 非同期コンテンツ（グラフ描画、データ読込）の完了待ち

詳細パターンは `references/workflow-detail.md` の「Phase 3」セクションを参照。

### Phase 4: ドキュメント生成スクリプト

`generate-doc.js` を生成する。出力フォーマットの詳細は `references/output-format.md` を参照。

出力Markdownの標準セクション構成:
1. 画面遷移図（Mermaid）
2. 画面URL一覧
3. 全機能一覧
4. 画面-API紐付け
5. 画面遷移テーブル
6. 画面別詳細（スクリーンショット + 機能 + APIテーブル）

### Phase 5: DOCX変換（オプション）

ユーザーが要求した場合、`generate-docx.js` を生成する。

- **docx-js** ライブラリ（`docx` npm パッケージ）を使用
- **Mermaid図** → PNG: `@mermaid-js/mermaid-cli` で変換して埋め込み
- **スクリーンショット** → `ImageRun` で埋め込み
- **テーブル** → `Table` / `TableRow` / `TableCell`
- DOCX生成の詳細ルール・注意事項は `references/workflow-detail.md` の「Phase 5」セクションを参照

### Phase 6: 実行

```bash
cd scripts/screen-capture
npm install
npx playwright install chromium

# スクリーンショット取得
node capture.js          # 初回: 手動ログイン
node capture.js --reuse  # 2回目以降

# Markdownドキュメント生成
node generate-doc.js

# DOCX変換（オプション）
node generate-docx.js
```

## 出力物

| ファイル | 説明 |
|---------|------|
| `screenshots/*.png` | 各画面のスクリーンショット |
| `capture-data.json` | キャプチャメタデータ・API通信記録 |
| `screen-transition.md` | 画面遷移図・機能一覧・API紐付けドキュメント |
| `screen-transition.docx` | DOCX形式（オプション） |

## References

| ファイル | 内容 | 参照タイミング |
|---------|------|--------------|
| `references/config-schema.md` | config.js のスキーマ定義・全プロパティ・実装例 | Phase 2: config.js 生成時 |
| `references/workflow-detail.md` | 各Phaseの詳細手順・設計パターン・実装例 | Phase 1〜5 の実装時 |
| `references/output-format.md` | 出力ドキュメントのセクション構成・テーブル定義・Mermaid図ルール | Phase 4: ドキュメント生成時 |

## 注意事項

- `storageState.json` / `auth-state.json` にはセッション情報が含まれるため `.gitignore` に追加すること
- 機密データ（メールアドレス、トークン等）はキャプチャ時にマスキングすること
- `config.js` の `afterNavigate` は JavaScript 関数を含むため `module.exports` で CommonJS 形式にすること
- Mermaid図は `generate-doc.js` 内にハードコードするのではなく、`config.js` のデータから動的に生成すること
