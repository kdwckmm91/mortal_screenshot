---
name: aidlc-core
description: AI-DLC（AI-Driven Development Life Cycle）のコアワークフロー管理スキル。AI-DLCでは必ず参照されるskill。ソフトウェア開発、実装、コーディング、アプリケーション作成のリクエスト時に使用。INCEPTION（計画）、CONSTRUCTION（実装）、OPERATIONS（運用）の3フェーズで構成。開発プロジェクト開始、新機能追加、リファクタリング、バグ修正などで自動的にアクティブ化。
---

# AI-DLC コアワークフロー

AI-DLC（AI-Driven Development Life Cycle）は、AIがソフトウェア開発プロセス全体を適応的にガイドするワークフローです。

## 基本原則

- **日本語で回答・ドキュメント作成**
- **適応的実行**: 価値を追加するステージのみ実行
- **透明な計画**: 実行計画を開始前に表示
- **ユーザーコントロール**: ステージの追加・除外をリクエスト可能
- **完全な監査証跡**: audit.md に全記録

## 3フェーズライフサイクル

### 🔵 INCEPTION PHASE（計画・アーキテクチャ）
**目的**: WHAT（何を作るか）と WHY（なぜ作るか）を決定

**ステージ**:
1. **Workspace Detection** (常時実行) → `aidlc-workspace-detection` スキル
2. **Reverse Engineering** (ブラウンフィールドのみ) → `aidlc-reverse-engineering` スキル
3. **UI Mockup** (条件付き: Web UI) → `aidlc-ui-mockup` スキル
4. **Requirements Analysis** (常時実行) → `aidlc-requirements` スキル
5. **User Stories** (条件付き) → `aidlc-user-stories` スキル
6. **Workflow Planning** (常時実行) → `aidlc-workflow-planning` スキル
7. **Application Design** (条件付き) → `aidlc-application-design` スキル
8. **Units Generation** (条件付き) → `aidlc-units-generation` スキル
9. **Development Standards** (条件付き: 複数ユニット) → `aidlc-development-standards` スキル

### 🟢 CONSTRUCTION PHASE（設計・実装・テスト）
**目的**: HOW（どのように作るか）を決定し実装

**ステージ（ユニット単位で実行）**:
1. **Functional Design** (条件付き) → `aidlc-functional-design` スキル
2. **NFR Requirements/Design** (条件付き) → `aidlc-nfr` スキル
3. **Infrastructure Design** (条件付き) → `aidlc-infrastructure-design` スキル
4. **Code Generation** (常時実行) → `aidlc-code-generation` スキル
5. **Security Check** (推奨) → `aidlc-security-check` スキル
6. **Build and Test** (常時実行) → `aidlc-build-test` スキル

### 🟡 OPERATIONS PHASE（運用）
**目的**: デプロイメントと監視（将来拡張用プレースホルダ）

## ワークフロー開始時の手順

1. ウェルカムメッセージを表示 → [welcome-message.md](references/welcome-message.md)
2. Workspace Detection を実行 → `aidlc-workspace-detection` スキル
3. 以降は検出結果に応じて適切なスキルを順次実行

## ディレクトリ構造

```
aidlc-docs/
├── inception/                  # INCEPTION成果物
│   ├── plans/
│   ├── reverse-engineering/    # ブラウンフィールドのみ
│   ├── requirements/
│   ├── user-stories/
│   └── application-design/
├── construction/               # CONSTRUCTION成果物
│   ├── plans/
│   ├── {unit-name}/
│   └── build-and-test/
├── operations/                 # OPERATIONS成果物（将来）
├── aidlc-state.md             # 状態追跡
└── audit.md                    # 監査証跡
```

## 参照ドキュメント

### コア参照
- [用語集](references/terminology.md) - Phase/Stageの定義、用語説明
- [深度レベル](references/depth-levels.md) - 適応的な詳細レベルの説明
- [エラーハンドリング](references/error-handling.md) - エラー対応手順
- [プロセス概要](references/process-overview.md) - ワークフロー図解
- [ウェルカムメッセージ](references/welcome-message.md) - ワークフロー開始時の表示

### 共通ルール（全ステージで使用）
- [質問フォーマットガイド](references/question-format.md) - 質問ファイルの形式と回答収集ルール
- [過信防止ガイド](references/overconfidence.md) - 適切な質問量の確保
- [コンテンツ検証](references/content-validation.md) - Mermaid/コードブロックの検証ルール
- [ドキュメント最新化・重複排除](references/document-consolidation.md) - ステージ間ドキュメント最新化ルール
- [上流ドキュメント更新ルール](references/upstream-document-update.md) - 各ステージ承認後のフィードバック更新

## セッション継続

既存プロジェクトへの復帰時は `aidlc-session` スキルを使用。
