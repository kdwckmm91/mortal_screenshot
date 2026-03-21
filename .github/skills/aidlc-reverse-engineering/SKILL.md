---
name: aidlc-reverse-engineering
description: 既存コードベースのリバースエンジニアリングスキル。Brownfieldプロジェクトでアーキテクチャ、コード構造、API、依存関係、技術スタックを分析。既存システムの理解、レガシーコード分析、マイグレーション計画時に使用。Workspace Detectionで既存コードが検出された場合に自動アクティブ化。
---

# Reverse Engineering

既存コードベースを分析し、包括的な設計ドキュメントを生成します。

## 実行条件

**Execute IF**:
- 既存コードベースが検出された（Brownfieldプロジェクト）

**Skip IF**:
- Greenfieldプロジェクト（既存コードなし）

**Rerun behavior**: Brownfieldプロジェクトで常に再実行（成果物が存在しても）。これにより成果物が現在のコード状態を反映することを保証。

## 生成する成果物

| ファイル | 内容 |
|---------|------|
| business-overview.md | ビジネスコンテキスト、トランザクション、用語集 |
| architecture.md | システム概要、アーキテクチャ図、コンポーネント説明 |
| code-structure.md | ビルドシステム、クラス/モジュール階層、設計パターン |
| api-documentation.md | REST API、内部API、データモデル |
| component-inventory.md | パッケージ一覧と分類 |
| technology-stack.md | 言語、フレームワーク、インフラ |
| dependencies.md | 内部/外部依存関係 |
| code-quality-assessment.md | テストカバレッジ、コード品質指標 |
| reverse-engineering-timestamp.md | 分析メタデータ |

## 実行手順概要

### Step 1: マルチパッケージ発見
- 全パッケージをスキャン
- パッケージ関係を設定ファイルから把握
- パッケージタイプを分類（Application, CDK, Models, Clients, Tests）

### Step 2: ビジネスコンテキスト理解
- コアビジネス概要
- 各パッケージのビジネス概要
- ビジネストランザクション一覧

### Step 3: インフラストラクチャ発見
- CDKパッケージ、Terraform、CloudFormation
- デプロイメントスクリプト

### Step 4: ビルドシステム発見
- Maven, Gradle, npm等のビルドツール
- ビルド依存関係

### Step 5: サービスアーキテクチャ発見
- Lambda関数、コンテナサービス
- API定義、データストア

### Step 6: コード品質分析
- 言語とフレームワーク
- テストカバレッジ、CI/CD

### Step 7-14: ドキュメント生成
各成果物ファイルを順次生成

### Step 15: 状態更新
`aidlc-state.md` を更新

### Step 16: 次フェーズ判定と完了メッセージ表示

**Web UI判定**: ユーザーリクエストまたは検出された技術スタックに以下が含まれるか確認
- フロントエンドフレームワーク（React, Vue, Angular等）
- UIコンポーネント/画面ファイルの存在
- フロントエンド関連パッケージ

| 条件 | 次のステージ |
|------|-------------|
| Web UI含む | UI Mockup |
| Web UI含まない | Requirements Analysis |

**Web UI含む場合**:
```markdown
# 🔍 Reverse Engineering Complete

[AI-generated summary of key findings]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine the artifacts at: `aidlc-docs/inception/reverse-engineering/`

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications
> ✅ **Approve & Continue** - Proceed to **UI Mockup**
```

**Web UI含まない場合**:
```markdown
# 🔍 Reverse Engineering Complete

[AI-generated summary of key findings]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine the artifacts at: `aidlc-docs/inception/reverse-engineering/`

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications
> ✅ **Approve & Continue** - Proceed to **Requirements Analysis**
```

### Step 17: ユーザー承認待ち
明示的な承認なしに次へ進まない

## 詳細手順

詳細な実行手順は [detailed-steps.md](references/detailed-steps.md) を参照。

### 共通ルール
- [コンテンツ検証](references/content-validation.md) - アーキテクチャ図の生成時に使用
