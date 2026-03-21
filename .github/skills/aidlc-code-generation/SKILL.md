---
name: aidlc-code-generation
description: AI-DLCコード生成スキル。ユニット単位でのコード計画作成と実行、ビジネスロジック・API・リポジトリ層の実装、ユニットテスト生成を実行。実装、コーディング、プログラミング、開発時に使用。CONSTRUCTIONフェーズで常に実行される必須ステージ。2パート構成（Planning + Generation）。
---

# Code Generation

各ユニットのコードを計画し生成します。

## 実行条件
- **常時実行**: 各ユニットで必ず実行

## 2パート構成

### Part 1: Planning
1. ユニットコンテキスト分析
2. 詳細コード生成プラン作成
3. プラン承認

### Part 2: Generation
1. 承認済みプラン実行
2. コード、テスト、成果物生成
3. 生成コード承認

## 生成プランに含まれるステップ

- ビジネスロジック生成
- ビジネスロジックユニットテスト
- ビジネスロジックサマリー
- APIレイヤー生成
- APIレイヤーユニットテスト
- APIレイヤーサマリー
- リポジトリレイヤー生成
- リポジトリレイヤーユニットテスト
- リポジトリレイヤーサマリー
- データベースマイグレーションスクリプト生成（データモデルがある場合）
- ドキュメント生成
- デプロイメント成果物生成

## 生成する成果物

| カテゴリ | 内容 |
|---------|------|
| code/ | 実装コードファイル |
| tests/ | ユニットテストファイル |
| migrations/ | DBマイグレーション（該当時） |
| docs/ | APIドキュメント、README更新 |
| deploy/ | デプロイメント設定 |

## 実行手順概要

### Part 1: Planning

#### Step 1: ユニットコンテキスト分析
- ユニット設計成果物を読み込み
- ユニットストーリーマップを読み込み
- 依存関係とインターフェースを特定

#### Step 2: 詳細ユニットコード生成プラン作成
チェックボックス付き明示的ステップを作成

#### Step 3-6: ユニットコンテキスト、プラン保存、承認

#### Step 7-9: 承認待ち、記録、進捗更新

### Part 2: Generation

#### Step 10: コード生成プランロード
次の未完了ステップを特定

#### Step 11: 現在のステップ実行
プラン通りにコード/テスト/ドキュメント生成

#### Step 12: 進捗更新
完了ステップを [x] でマーク

#### Step 13: 継続または完了
全ステップ完了まで繰り返し

#### Step 13.5: 上流ドキュメントフィードバック更新

[upstream-document-update.md](references/upstream-document-update.md) のルールに従い、承認内容に基づいて前段階ドキュメントを最新化する。

**更新対象フォルダ**:
- `aidlc-docs/construction/[unit-name]/functional-design/`: 実装時に判明した設計変更・補足を反映
- `aidlc-docs/construction/[unit-name]/infrastructure-design/`: 実装時に判明したインフラ設計変更を反映

**更新ルール**:
1. 古い記述 → 最新内容で置換
2. 重複記載 → 削除し参照リンクへ置換
3. 変更は Git commit で追跡

**除外**: `aidlc-docs/**/plans/*-plan.md` は更新対象外

#### Step 14: 完了メッセージ

```markdown
# 💻 Code Generation Complete - [unit-name]

[AI-generated summary]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/construction/[unit-name]/code/`



> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications
> ✅ **Continue to Next Stage** - Proceed to **[next-unit/Build & Test]**
```

#### Step 15-16: 承認待ちと進捗記録

## 重要ルール

### Planning フェーズルール
- 全生成アクティビティの明示的番号付きステップ作成
- ストーリートレーサビリティをプランに含める
- ユニットコンテキストと依存関係をドキュメント化
- 生成前にユーザー承認を取得

### Generation フェーズルール
- **ハードコード禁止**: プランに書かれたことのみ実行
- **プラン厳守**: ステップ順序から逸脱しない
- **チェックボックス更新**: ステップ完了後即座に [x] でマーク
- **ストーリートレーサビリティ**: 機能実装時にストーリーを [x] でマーク
- **依存関係尊重**: 依存関係が満たされた場合のみ実装

## 参照ドキュメント

- [詳細手順](references/detailed-steps.md)

### 共通ルール
- [コンテンツ検証](references/content-validation.md) - コードブロックの検証時に使用
