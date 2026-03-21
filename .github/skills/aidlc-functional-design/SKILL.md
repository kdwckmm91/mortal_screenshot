---
name: aidlc-functional-design
description: AI-DLC機能設計スキル。ユニット単位での詳細ビジネスロジック設計、ドメインモデル、ビジネスルール定義を実行。技術非依存の純粋なビジネス機能に焦点。新しいデータモデル、複雑なビジネスロジック、ビジネスルール設計時に使用。CONSTRUCTIONフェーズの条件付きステージ。
---

# Functional Design

ユニット単位で詳細なビジネスロジック設計を行います。技術非依存で純粋なビジネス機能に焦点を当てます。

## 目的
- ユニットの詳細なビジネスロジックとアルゴリズム
- エンティティと関係を持つドメインモデル
- 詳細なビジネスルール、バリデーションロジック、制約

**注意**: Application Design（INCEPTION）で定義された高レベルコンポーネント設計を基に構築

## 実行条件

**Execute IF**:
- 新しいデータモデルまたはスキーマ
- 複雑なビジネスロジック
- 詳細設計が必要なビジネスルール

**Skip IF**:
- シンプルなロジック変更
- 新しいビジネスロジックなし

## 生成する成果物

| ファイル | 内容 |
|---------|------|
| business-logic-model.md | ビジネスロジックモデル |
| business-rules.md | ビジネスルールとバリデーション |
| domain-entities.md | ドメインエンティティ定義 |

## 実行手順概要

### Step 1: ユニットコンテキスト分析
- unit-of-work.md からユニット定義を読み込み
- unit-of-work-story-map.md から割り当てストーリーを読み込み
- ユニットの責務と境界を理解

### Step 2: 機能設計プラン作成
チェックボックス付きプランを生成

### Step 3: 質問生成

**質問カテゴリ**:
- ビジネスロジックモデリング
- ドメインモデル
- ビジネスルール
- データフロー
- 統合ポイント
- エラーハンドリング
- ビジネスシナリオ

### Step 4-5: プラン保存と回答収集

### Step 6: 機能設計成果物生成

### Step 6.5: 上流ドキュメントフィードバック更新

[upstream-document-update.md](references/upstream-document-update.md) のルールに従い、承認内容に基づいて前段階ドキュメントを最新化する。

**更新対象フォルダ**:
- `aidlc-docs/inception/application-design/`: 詳細ビジネスロジックで精緻化された内容に置換
- `aidlc-docs/inception/requirements/`: 上流の概要記述を参照リンクに置換

**更新ルール**:
1. 古い記述 → 最新内容で置換
2. 重複記載 → 削除し参照リンクへ置換
3. 変更は Git commit で追跡

**除外**: `aidlc-docs/**/plans/*-plan.md` は更新対象外

### Step 7: 完了メッセージ

```markdown
# 🔧 Functional Design Complete - [unit-name]

[AI-generated summary]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/construction/[unit-name]/functional-design/`



> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications
> ✅ **Continue to Next Stage** - Proceed to **[next-stage-name]**
```

### Step 8-9: 承認待ちと進捗更新

## 参照ドキュメント

- [詳細手順](references/detailed-steps.md)

### 共通ルール
- [質問フォーマットガイド](references/question-format.md)
- [過信防止ガイド](references/overconfidence.md)
