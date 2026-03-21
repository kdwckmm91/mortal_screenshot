---
name: aidlc-workspace-detection
description: AI-DLCワークスペース検出スキル。プロジェクト開始時にワークスペースの状態を分析。新規プロジェクト（Greenfield）か既存コードベース（Brownfield）かを判定。既存のaidlc-state.mdがある場合はセッション再開。ソフトウェア開発リクエスト受信時に最初に実行されるステージ。
---

# Workspace Detection

AI-DLCワークフローの開始点。ワークスペースの状態を検出し、次のステップを決定します。

## 実行タイミング
- **常時実行**: 全ての開発リクエストで最初に実行

## 実行手順

### Step 1: 既存AI-DLCプロジェクトの確認

`aidlc-docs/aidlc-state.md` の存在を確認:
- **存在する場合**: `aidlc-session` スキルで再開
- **存在しない場合**: 新規プロジェクトとして続行

### Step 2: ワークスペースのスキャン

既存コードの有無を確認:
- ソースコードファイル（.java, .py, .js, .ts など）
- ビルドファイル（pom.xml, package.json, build.gradle など）
- プロジェクト構造の指標

### Step 3: 判定結果の記録

```markdown
## Workspace State
- **Existing Code**: [Yes/No]
- **Programming Languages**: [List if found]
- **Build System**: [Maven/Gradle/npm/etc. if found]
- **Project Structure**: [Monolith/Microservices/Library/Empty]
```

### Step 4: 次のフェーズ決定

**Web UI判定**: ユーザーリクエストに以下が含まれるか確認
- フロントエンドフレームワーク（React, Vue, Angular, Svelte等）
- UI関連キーワード（画面, ダッシュボード, ログイン, フォーム, UI, フロントエンド等）
- Webアプリケーションタイプ（SPA, Webアプリ等）

| ワークスペース状態 | Web UI含む | 次のステージ |
|------------------|-----------|-------------|
| 空（コードなし） | Yes | UI Mockup |
| 空（コードなし） | No | Requirements Analysis |
| コードあり + RE成果物なし | - | Reverse Engineering |
| コードあり + RE成果物あり | Yes | UI Mockup |
| コードあり + RE成果物あり | No | Requirements Analysis |

**注意**: Reverse Engineering完了後の遷移は`aidlc-reverse-engineering`スキルで定義

### Step 5: 初期状態ファイル作成

`aidlc-docs/aidlc-state.md` を作成:

```markdown
# AI-DLC State Tracking

## Project Information
- **Project Type**: [Greenfield/Brownfield]
- **Start Date**: [ISO timestamp]
- **Current Stage**: INCEPTION - Workspace Detection

## Workspace State
- **Existing Code**: [Yes/No]
- **Reverse Engineering Needed**: [Yes/No]
- **Workspace Root**: [Absolute path]

## Code Location Rules
- **Application Code**: Workspace root (NEVER in aidlc-docs/)
- **Documentation**: aidlc-docs/ only
- **Structure patterns**: See code-generation.md Critical Rules

## Stage Progress
[Will be populated as workflow progresses]
```

### Step 6: 完了メッセージ表示

**Greenfield + Web UI の場合**:
```markdown
# 🔍 Workspace Detection Complete

Workspace analysis findings:
• **Project Type**: Greenfield project
• **Web UI Detected**: Yes
• **Next Step**: Proceeding to **UI Mockup**...
```

**Greenfield + Web UI なし の場合**:
```markdown
# 🔍 Workspace Detection Complete

Workspace analysis findings:
• **Project Type**: Greenfield project
• **Next Step**: Proceeding to **Requirements Analysis**...
```

**Brownfield の場合**:
```markdown
# 🔍 Workspace Detection Complete

Workspace analysis findings:
• **Project Type**: Brownfield project
• [Additional findings]
• **Next Step**: Proceeding to **Reverse Engineering**...
```

### Step 7: 自動的に次のフェーズへ進行

ユーザー承認は不要。自動的に次のステージを開始。

## 詳細手順

詳細な実行手順は [detailed-steps.md](references/detailed-steps.md) を参照。
