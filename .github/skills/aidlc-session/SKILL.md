---
name: aidlc-session
description: AI-DLCプロジェクトのセッション継続・再開を管理するスキル。既存プロジェクトへの復帰、ワークフロー中断後の再開、進捗確認時に使用。aidlc-state.mdの読み取り、コンテキストロード、ワークフロー変更対応を行う。「続きから」「前回の続き」「進捗確認」「resume」「continue」などのリクエストで自動アクティブ化。
---

# AI-DLC セッション管理

既存のAI-DLCプロジェクトへの復帰とワークフロー変更を管理します。

## セッション再開手順

### 1. 状態ファイルの確認
`aidlc-docs/aidlc-state.md` を読み取り、現在のステータスを確認:
- プロジェクトタイプ（Greenfield/Brownfield）
- 現在のフェーズとステージ
- 完了済みステージ
- 次のステップ

### 2. ウェルカムバックメッセージの表示

```markdown
**Welcome back! I can see you have an existing AI-DLC project in progress.**

Based on your aidlc-state.md, here's your current status:
- **Project**: [project-name]
- **Current Phase**: [INCEPTION/CONSTRUCTION/OPERATIONS]
- **Current Stage**: [Stage Name]
- **Last Completed**: [Last completed step]
- **Next Step**: [Next step to work on]

**What would you like to work on today?**

A) Continue where you left off ([Next step description])
B) Review a previous stage ([Show available stages])

[Answer]: 
```

### 3. 前ステージの成果物ロード

ステージに応じて必要な成果物を自動ロード:

| 現在のステージ | ロードすべき成果物 |
|--------------|-------------------|
| Requirements | reverse-engineering/* |
| User Stories | requirements/* |
| Design Stages | requirements/*, user-stories/*, application-design/* |
| Code Stages | 全ての前ステージ成果物 + 既存コード |

### 4. 継続オプション

- **続きから**: 次のステップから再開
- **レビュー**: 前のステージを確認・修正
- **変更リクエスト**: ワークフロー計画の変更

## ワークフロー変更対応

詳細は [workflow-changes.md](references/workflow-changes.md) を参照。

### 変更タイプ
1. **スキップしたフェーズの追加**
2. **計画したフェーズのスキップ**
3. **現在のステージのリスタート**
4. **前のステージのリスタート**
5. **深度レベルの変更**
6. **ワークフローの一時停止**
7. **アーキテクチャ決定の変更**
8. **ユニットの追加/削除**

## エラーハンドリング

成果物の欠損・破損時は [error-handling.md](references/error-handling.md) を参照。

## 参照ドキュメント

- [セッション継続詳細](references/session-continuity.md)
- [ワークフロー変更](references/workflow-changes.md)
