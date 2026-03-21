````skill
---
name: aidlc-development-standards
description: AI-DLC開発標準スキル。並列開発での統合を円滑にするための開発ルール（ディレクトリ構造、命名規約、テスト完了定義等）を定義。成果物は.github/copilot-instructions.mdに追記。複数ユニット開発時に実行。
---

# Development Standards

並列開発での統合を円滑にするための開発ルールを定義します。

## 目的
- 複数ユニット/並列開発時の統合を円滑化
- コードの一貫性と品質の確保
- チーム間のルール共有

## 実行条件

**Execute IF**:
- 複数ユニット/並列開発が予定される
- 明示的にユーザーが開発標準を要求

**Skip IF**:
- 単一ユニット
- シンプルな変更

## 配置位置
- Units Generation後、CONSTRUCTION開始前
- 理由: ユニット分割が確定した後に、統合ルールを定義

## 3パート構成

### Part 1: Planning
1. コンテキスト分析
2. 開発標準プラン作成
3. ユーザーレビュー・承認

### Part 2: Generation
1. 承認済みPlanの実行
2. 開発標準ドキュメント生成
3. ユーザーレビュー・承認

### Part 3: Application
1. copilot-instructions.mdへの追記
2. 完了確認・ユーザー承認

## 定義する内容

### 1. ディレクトリ構造規約
- プロジェクトルートからのディレクトリ構造
- 各ディレクトリの責務と配置ルール

### 2. 命名規約
- ファイル名（ケース、接尾辞等）
- 変数名・定数名
- 関数名・メソッド名
- クラス名・インターフェース名

### 3. コーディング規約
- 言語別のスタイルガイド参照
- インデント、改行ルール
- コメント規約
- インポート順序

### 4. テスト完了定義
- カバレッジ閾値
- 必須テストパターン（ユニット、統合、E2E）
- テストファイル配置ルール

### 5. 統合ルール
- ブランチ戦略
- コミットメッセージ規約
- PR/MRテンプレート
- コードレビュー基準

## 生成する成果物

| 場所 | ファイル | 内容 |
|------|---------|------|
| aidlc-docs/inception/plans/ | development-standards-plan.md | 開発標準プラン |
| aidlc-docs/inception/development-standards/ | development-standards.md | copilot-instructions.mdに追記する内容 |

## 実行手順概要

### Part 1: Planning

#### Step 1: コンテキスト分析
- Units Generationの結果を読み込み
- プロジェクトの技術スタックを確認
- 既存のプロジェクト規則を確認

#### Step 2: 定義すべき開発標準項目の決定

#### Step 3: 開発標準プラン作成

チェックボックス付きの詳細プランを作成:

```markdown
# Development Standards Plan

## 対象プロジェクト情報
- ユニット数: [X]
- 技術スタック: [languages/frameworks]
- 並列開発: [Yes/No]

## 定義する開発標準項目
- [ ] ディレクトリ構造規約
- [ ] ファイル命名規約
- [ ] 変数・関数・クラス命名規約
- [ ] コーディング規約
- [ ] テスト完了定義
- [ ] ブランチ戦略
- [ ] コミットメッセージ規約
- [ ] コードレビュー基準

## 生成ステップ
- [ ] Step 1: ディレクトリ構造規約の定義
- [ ] Step 2: 命名規約の定義
- [ ] Step 3: コーディング規約の定義
- [ ] Step 4: テスト完了定義の作成
- [ ] Step 5: 統合ルールの定義
- [ ] Step 6: 成果物ファイル生成
```

#### Step 4: Planファイル保存

`aidlc-docs/inception/plans/development-standards-plan.md` に保存

#### Step 5: ユーザーレビュー依頼

```markdown
# 📐 Development Standards Plan - Review Required

[AI-generated plan summary]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/inception/plans/development-standards-plan.md`

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications to the plan
> ✅ **Approve Plan** - Proceed to standards definition
```

#### Step 6: ユーザー承認待ち

### Part 2: Generation

#### Step 7: 承認済みPlanのロード

#### Step 8: 開発標準ドキュメント生成
- Planの各ステップを順次実行
- 完了したステップは [x] でマーク
- copilot-instructions.mdに追記する形式で作成

#### Step 9: 成果物の保存

`aidlc-docs/inception/development-standards/development-standards.md` に保存

#### Step 10: 成果物レビュー依頼

```markdown
# 📐 Development Standards - Review Required

[AI-generated summary of standards]

**Generated Content Preview:**
以下の内容が `.github/copilot-instructions.md` に追記されます:

---
[development-standards.md の内容プレビュー]
---

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/inception/development-standards/development-standards.md`
>
> This content will be appended to `.github/copilot-instructions.md` upon approval.

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications
> ✅ **Approve & Apply** - Append to copilot-instructions.md
```

#### Step 11: ユーザー承認待ち

### Part 3: Application

#### Step 12: copilot-instructions.mdへの追記

承認された内容を `.github/copilot-instructions.md` の「# プロジェクト規則」セクション末尾に追記

#### Step 12.5: 上流ドキュメントフィードバック更新

[upstream-document-update.md](references/upstream-document-update.md) のルールに従い、承認内容に基づいて前段階ドキュメントを最新化する。

**更新対象フォルダ**:
- `aidlc-docs/inception/application-design/`: 開発ルール適用方針の反映

**更新ルール**:
1. 古い記述 → 最新内容で置換
2. 重複記載 → 削除し参照リンクへ置換
3. 変更は Git commit で追跡

**除外**: `aidlc-docs/**/plans/*-plan.md` は更新対象外

#### Step 13: 完了メッセージ

```markdown
# 📐 Development Standards Complete

**Applied Standards:**
- ✅ Directory structure conventions
- ✅ Naming conventions
- ✅ Coding standards
- ✅ Test completion definition
- ✅ Integration rules

**Updated Files:**
- ✅ development-standards.md (documentation)
- ✅ .github/copilot-instructions.md (applied)

> **📋 <u>**VERIFICATION:**</u>**  
> Please verify: `.github/copilot-instructions.md`

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications
> ✅ **Approve & Continue** - Proceed to **CONSTRUCTION Phase**
```

#### Step 14: ユーザー承認待ち（フェーズ完了確認）

#### Step 15: 状態更新・監査ログ記録

## 参照ドキュメント

- [標準テンプレート](references/standard-templates.md)

### 共通ルール
- [質問フォーマットガイド](../aidlc-core/references/question-format.md)
- [過信防止ガイド](../aidlc-core/references/overconfidence.md)

````
