---
name: aidlc-nfr
description: AI-DLC非機能要件スキル。NFR Requirements（スケーラビリティ、パフォーマンス、セキュリティ要件の定義、技術スタック選定）とNFR Design（NFRパターンの組み込み、論理コンポーネント設計）を統合。パフォーマンス、セキュリティ、スケーラビリティ、技術選定時に使用。CONSTRUCTIONフェーズの条件付きステージ。
---

# NFR (Non-Functional Requirements)

ユニットの非機能要件の定義と、それを実現する設計パターンを作成します。

## 2つのサブステージ

### NFR Requirements
- スケーラビリティ、パフォーマンス、可用性、セキュリティ要件の定義
- 技術スタックの選定

### NFR Design
- NFRパターンの設計への組み込み
- 論理コンポーネントの設計

## 実行条件

**NFR Requirements - Execute IF**:
- パフォーマンス要件がある
- セキュリティ考慮が必要
- スケーラビリティ要件がある
- 技術スタック選定が必要

**NFR Design - Execute IF**:
- NFR Requirementsが実行された
- NFRパターンの組み込みが必要

**Skip IF**:
- NFR要件なし
- 技術スタックが既に決定済み

## 生成する成果物

### NFR Requirements
| ファイル | 内容 |
|---------|------|
| nfr-requirements.md | NFR要件定義 |
| tech-stack-decisions.md | 技術スタック決定と根拠 |

### NFR Design
| ファイル | 内容 |
|---------|------|
| nfr-design-patterns.md | NFRデザインパターン |
| logical-components.md | 論理コンポーネント設計 |

## 質問カテゴリ

### NFR Requirements
- スケーラビリティ要件
- パフォーマンス要件
- 可用性要件
- セキュリティ要件
- 技術スタック選定
- 信頼性要件
- 保守性要件
- ユーザビリティ要件

### NFR Design
- レジリエンスパターン
- スケーラビリティパターン
- パフォーマンスパターン
- セキュリティパターン
- 論理コンポーネント

## 上流ドキュメントフィードバック更新

[upstream-document-update.md](references/upstream-document-update.md) のルールに従い、承認内容に基づいて前段階ドキュメントを最新化する。

### NFR Requirements 完了後の更新

**更新対象フォルダ**:
- `aidlc-docs/inception/requirements/`: NFR具体化で古いNFR記述を置換。技術スタック決定の影響を反映
- `aidlc-docs/construction/[unit-name]/functional-design/`: 技術スタック決定による影響を反映

### NFR Design 完了後の更新

**更新対象フォルダ**:
- `aidlc-docs/construction/[unit-name]/nfr-requirements/`: 設計パターン反映。重複するNFR記述を一元化
- `aidlc-docs/inception/requirements/`: 設計パターンによる要件への影響を反映

**更新ルール（共通）**:
1. 古い記述 → 最新内容で置換
2. 重複記載 → 削除し参照リンクへ置換
3. 変更は Git commit で追跡

**除外**: `aidlc-docs/**/plans/*-plan.md` は更新対象外

## 完了メッセージ

### NFR Requirements 完了時
```markdown
# 📊 NFR Requirements Complete - [unit-name]

[AI-generated summary]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/construction/[unit-name]/nfr-requirements/`



> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications
> ✅ **Continue to Next Stage** - Proceed to **NFR Design**
```

### NFR Design 完了時
```markdown
# 🎨 NFR Design Complete - [unit-name]

[AI-generated summary]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/construction/[unit-name]/nfr-design/`



> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications
> ✅ **Continue to Next Stage** - Proceed to **[next-stage-name]**
```

## 参照ドキュメント

- [NFR Requirements 詳細](references/nfr-requirements.md)
- [NFR Design 詳細](references/nfr-design.md)

### 共通ルール
- [質問フォーマットガイド](references/question-format.md)
- [過信防止ガイド](references/overconfidence.md)
