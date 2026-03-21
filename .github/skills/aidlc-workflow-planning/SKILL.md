---
name: aidlc-workflow-planning
description: AI-DLCワークフロー計画スキル。実行するフェーズの決定、実行計画の作成、ワークフロー可視化を実行。要件分析後に常に実行。プロジェクト計画、フェーズ決定、実行戦略策定時に使用。スコープ分析、リスク評価、コンポーネント関係マッピングを含む。
---

# Workflow Planning

どのフェーズを実行するかを決定し、包括的な実行計画を作成します。

## 実行条件
- **常時実行**: Requirements Analysis 後に必ず実行

## 実行手順概要

### Step 1: 前コンテキストのロード
- リバースエンジニアリング成果物（Brownfield時）
- 要件分析成果物
- ユーザーストーリー成果物（実行時）

### Step 2: 詳細スコープ・影響分析

#### 変換スコープ検出（Brownfieldのみ）
- 単一コンポーネント変更 vs アーキテクチャ変換
- インフラ変更 vs アプリケーション変更
- デプロイメントモデル変更

#### 変更影響評価
1. ユーザー向け変更
2. 構造変更
3. データモデル変更
4. API変更
5. NFR影響

#### リスク評価
- Low / Medium / High / Critical

### Step 3: フェーズ決定

| フェーズ | Execute IF | Skip IF |
|---------|-----------|---------|
| User Stories | 複数ペルソナ、UX影響 | 内部リファクタリング |
| Application Design | 新コンポーネント必要 | 既存境界内の変更 |
| Design (Units) | 新データモデル、複雑ロジック | シンプルな変更 |
| NFR Implementation | パフォーマンス/セキュリティ要件 | 既存NFR設定で十分 |

### Step 4: 適応的詳細度の記録
各ステージの詳細レベルを問題の複雑さに応じて決定

### Step 5: ワークフロー可視化の生成

Mermaidフローチャートを生成。
**コンテンツ検証必須**: [content-validation.md](references/content-validation.md) 参照

### Step 6: 実行計画ドキュメント作成

`aidlc-docs/inception/plans/execution-plan.md` を作成:
- 詳細分析サマリー
- ワークフロー可視化
- 実行フェーズ一覧
- パッケージ変更順序（Brownfield）
- タイムライン推定
- 成功基準

### Step 7: 状態追跡の初期化
`aidlc-state.md` を更新

### Step 7.5: 上流ドキュメントフィードバック更新

[upstream-document-update.md](references/upstream-document-update.md) のルールに従い、承認内容に基づいて前段階ドキュメントを最新化する。

**更新対象フォルダ**:
- `aidlc-docs/inception/requirements/`: 実行計画との紐付け。スキップ対象の要件にマーク
- `aidlc-docs/inception/user-stories/`: 実行計画との紐付け。スキップ対象のストーリーにマーク

**更新ルール**:
1. 古い記述 → 最新内容で置換
2. 重複記載 → 削除し参照リンクへ置換
3. 変更は Git commit で追跡

**除外**: `aidlc-docs/**/plans/*-plan.md` は更新対象外

### Step 8: ユーザーへの計画提示

```markdown
# 📋 Workflow Planning Complete

**Recommended Execution Plan**:

🔵 **INCEPTION PHASE:**
1. [Stage] - *Rationale:* [Why]
...

🟢 **CONSTRUCTION PHASE:**
1. [Stage] - *Rationale:* [Why]
...

**Skipped Stages:**
- [Stage] - *Rationale:* [Why skipping]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/inception/plans/execution-plan.md`

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications
> 📝 **Add Skipped Stages** - Include skipped stages
> ✅ **Approve & Continue** - Proceed to **[Next Stage]**
```

## 参照ドキュメント

- [詳細手順](references/detailed-steps.md)

