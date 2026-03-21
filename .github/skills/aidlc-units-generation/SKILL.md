---
name: aidlc-units-generation
description: AI-DLCユニット生成スキル。システムを管理可能な作業単位に分解、ユニット間依存関係のマッピング、ストーリーのユニットへの割り当てを実行。複数サービス、マイクロサービス、モジュール分割が必要な場合に使用。システム分解、作業単位定義、開発計画時に自動アクティブ化。条件付きステージ。
---

# Units Generation

システムを管理可能な作業単位に分解します。

## 定義
**Unit of Work**: 開発目的で論理的にグループ化されたストーリー群
- マイクロサービスでは、各ユニットが独立してデプロイ可能なサービスになる
- モノリスでは、単一ユニットが論理モジュールを持つアプリケーション全体を表す

## 実行条件

**Execute IF**:
- 複数の作業単位への分解が必要
- 複数サービスまたはモジュールが必要
- 構造化された分解が必要な複雑なシステム

**Skip IF**:
- シンプルな単一ユニット
- 分解不要
- 単純な単一コンポーネント実装

## 2パート構成

### Part 1: Planning
1. ユニット作業プラン作成
2. コンテキストに適した質問生成
3. 回答収集と曖昧さ分析
4. プラン承認

### Part 2: Generation
1. 承認済みプラン実行
2. ユニット成果物生成
3. 成果物承認

## 生成する成果物

| ファイル | 内容 |
|---------|------|
| unit-of-work.md | ユニット定義と責務 |
| unit-of-work-dependency.md | 依存関係マトリックス |
| unit-of-work-story-map.md | ストーリーからユニットへのマッピング |

## 質問カテゴリ

- ストーリーグループ化
- 依存関係
- チーム連携
- 技術的考慮事項
- ビジネスドメイン

## 上流ドキュメントフィードバック更新

[upstream-document-update.md](references/upstream-document-update.md) のルールに従い、承認内容に基づいて前段階ドキュメントを最新化する。

**更新対象フォルダ**:
- `aidlc-docs/inception/application-design/`: ユニット割当情報を反映
- `aidlc-docs/inception/user-stories/`: ストーリーにユニット紐付けを追記

**更新ルール**:
1. 古い記述 → 最新内容で置換
2. 重複記載 → 削除し参照リンクへ置換
3. 変更は Git commit で追跡

**除外**: `aidlc-docs/**/plans/*-plan.md` は更新対象外

## 完了メッセージ

```markdown
# 🔧 Units Generation Complete

[AI-generated summary]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/inception/application-design/`

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications
> ✅ **Approve & Continue** - Proceed to **CONSTRUCTION PHASE**
```

## 用語ガイド

| 用語 | 使用場面 |
|------|---------|
| Unit of Work | 計画・分解時 |
| Service | 独立デプロイ可能コンポーネント（マイクロサービス） |
| Module | サービスまたはモノリス内の論理グループ |
| Component | 再利用可能な構成要素（クラス、関数など） |

## 参照ドキュメント

- [詳細手順](references/detailed-steps.md)

### 共通ルール
- [質問フォーマットガイド](references/question-format.md)
- [過信防止ガイド](references/overconfidence.md)
