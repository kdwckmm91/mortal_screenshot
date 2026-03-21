---
name: aidlc-requirements
description: AI-DLC要件分析スキル。ユーザーリクエストの分析、機能・非機能要件の収集、明確化質問の作成、要件ドキュメント生成を実行。要件定義、要求分析、仕様策定、スコープ定義時に使用。全ての開発プロジェクトで常に実行される必須ステージ。深度は問題の複雑さに応じて適応。
---

# Requirements Analysis

ユーザーリクエストを分析し、要件ドキュメントを作成します。

## 実行条件
- **常時実行**: 深度はリクエストの明確さと複雑さに応じて適応

## 深度レベル

| 深度 | 条件 | 内容 |
|------|------|------|
| Minimal | シンプルで明確なリクエスト | 意図分析のドキュメント化のみ |
| Standard | 通常の複雑さ | 機能・非機能要件の収集 |
| Comprehensive | 複雑・高リスク | トレーサビリティ付き詳細要件 |

## 実行手順概要

### Step 1: リバースエンジニアリング成果物のロード
Brownfieldの場合、既存システム情報をロード

### Step 2: ユーザーリクエストの分析（意図分析）

評価項目:
- **リクエストの明確さ**: Clear / Vague / Incomplete
- **リクエストタイプ**: New Feature / Bug Fix / Refactoring / Upgrade / Migration / Enhancement / New Project
- **スコープ推定**: Single File / Single Component / Multiple Components / System-wide / Cross-system
- **複雑さ推定**: Trivial / Simple / Moderate / Complex

### Step 3: 要件深度の決定
分析結果に基づき適切な深度を選択

### Step 4: 現在の要件の評価
ユーザー提供情報を分析:
- 意図記述
- 既存要件ドキュメント
- 貼り付けコンテンツ

### Step 5: 完全性の徹底分析

**必須評価エリア**:
- 機能要件
- 非機能要件
- ユーザーシナリオ
- ビジネスコンテキスト
- 技術コンテキスト
- 品質属性

### Step 6: 明確化質問の生成

`aidlc-docs/inception/requirements/requirement-verification-questions.md` を作成。
質問フォーマットは [question-format.md](references/question-format.md) を参照。

### Step 7: 要件ドキュメントの生成

`aidlc-docs/inception/requirements/requirements.md` を作成:
- 意図分析サマリー
- 機能要件
- 非機能要件
- ユーザー回答の反映

### Step 8: 状態更新

### Step 8.5: 上流ドキュメントフィードバック更新

[upstream-document-update.md](references/upstream-document-update.md) のルールに従い、承認内容に基づいて前段階ドキュメントを最新化する。

**更新対象フォルダ**:
- `aidlc-docs/inception/ui-mockup/`（Web UIアプリの場合）: 要件分析で判明した追加画面・画面変更を反映

**更新ルール**:
1. 古い記述 → 最新内容で置換
2. 重複記載 → 削除し参照リンクへ置換
3. 変更は Git commit で追跡

**除外**: `aidlc-docs/**/plans/*-plan.md` は更新対象外

### Step 9: 完了メッセージと承認待ち

```markdown
# 🔍 Requirements Analysis Complete

[AI-generated summary]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/inception/requirements/requirements.md`

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications
> [IF User Stories will be skipped:]
> 📝 **Add User Stories** - Include User Stories stage
> ✅ **Approve & Continue** - Proceed to **[User Stories/Workflow Planning]**
```

## 参照ドキュメント

- [詳細手順](references/detailed-steps.md)

### 共通ルール
- [質問フォーマットガイド](references/question-format.md)
- [過信防止ガイド](references/overconfidence.md)
