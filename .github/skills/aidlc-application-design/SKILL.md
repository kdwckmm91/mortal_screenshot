---
name: aidlc-application-design
description: AI-DLCアプリケーション設計スキル。高レベルコンポーネント識別、サービスレイヤー設計、コンポーネント間依存関係の定義を実行。新しいコンポーネント、サービス、メソッド定義が必要な場合に使用。アーキテクチャ設計、コンポーネント設計、API設計時に自動アクティブ化。条件付きステージ。
---

# Application Design

高レベルのコンポーネント識別とサービスレイヤー設計を行います。

## 目的
- 主要な機能コンポーネントとその責務の識別
- コンポーネントインターフェースの定義
- オーケストレーション用サービスレイヤーの設計
- コンポーネント依存関係とコミュニケーションパターンの確立

**注意**: 詳細なビジネスロジック設計は後のFunctional Design（CONSTRUCTION）で実行

## 実行条件

**Execute IF**:
- 新しいコンポーネントまたはサービスが必要
- コンポーネントメソッドとビジネスルールの定義が必要
- サービスレイヤー設計が必要
- コンポーネント依存関係の明確化が必要

**Skip IF**:
- 既存コンポーネント境界内の変更
- 新しいコンポーネントやメソッドなし
- 純粋な実装変更

## 生成する成果物

| ファイル | 内容 |
|---------|------|
| components.md | コンポーネント定義と高レベル責務 |
| component-methods.md | メソッドシグネチャ（詳細ルールは後で） |
| services.md | サービス定義とオーケストレーションパターン |
| component-dependency.md | 依存関係マトリックス、コミュニケーションパターン |
| ui-component-mapping.md | UI画面とコンポーネントのマッピング（UI Mockupがある場合） |

## UI Mockup連携

### 前提条件チェック

**Step 0: Web UI判定**

1. `aidlc-state.md` の `Web UI Detected` を確認
2. **Web UI Detected: No** の場合 → UI Mockup関連ステップを全てスキップ
3. **Web UI Detected: Yes** の場合 → 以下のUI Mockup連携ステップを実行

### UI Mockupステージ確認（Web UIアプリのみ）

**Step 0.1: UI Mockup完了状態の確認**

`aidlc-state.md` の Stage Progress でUI Mockupの状態を確認:

| UI Mockup状態 | アクション |
|--------------|-----------|
| `[x]` 完了 | 既存Mockupを参照して設計を進める |
| `[ ]` 未実行・スキップ | ユーザーに新規作成を提案 |

**UI Mockup未実行時の提案メッセージ:**

```markdown
# ⚠️ UI Mockup未実行の検出

Web UIアプリケーションですが、UI Mockupステージがスキップされています。

Application Designを進める前に、UI Mockupを作成することを推奨します。
画面イメージがあると、コンポーネント設計の精度が向上します。

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🎨 **UI Mockupを作成** - UI Mockupステージに移行
> ⏭️ **スキップ** - Mockupなしで設計を続行
```

### 既存Mockupがある場合

1. `aidlc-docs/inception/ui-mockup/` を読み込み
2. `mockups/` のプロトタイプコードを参照
3. 画面一覧・遷移図を参照
4. コンポーネント設計にUI構造を反映
5. UI-コンポーネントマッピングを `ui-component-mapping.md` に作成

### UI-コンポーネントマッピング形式

```markdown
# UI-Component Mapping

| 画面 | 使用コンポーネント | 説明 |
|------|------------------|------|
| ログイン画面 | AuthComponent, FormComponent | ユーザー認証UI |
| ダッシュボード | DashboardComponent, ChartComponent | メイン画面 |
| 設定画面 | SettingsComponent, FormComponent | 設定管理UI |
```

### Mockup修正提案（設計完了前 - Web UIアプリのみ）

**Step 9.5: UI変更必要性の評価**

設計成果物生成後、以下を評価:

1. **新規画面の必要性**: 設計で新たに必要になった画面があるか
2. **既存画面の変更**: コンポーネント設計により画面構成の変更が必要か
3. **画面遷移の変更**: 新しいフローや遷移パスが必要か

| 評価結果 | アクション |
|---------|-----------|
| 変更なし | Step 10に進む |
| 変更あり | ユーザーにMockup修正を提案 |

**Mockup修正提案メッセージ:**

```markdown
# 🎨 UI Mockup修正の提案

Application Designの結果、以下のUI変更が推奨されます:

**新規画面:**
- [画面名]: [理由]

**変更が必要な画面:**
- [画面名]: [変更内容と理由]

**画面遷移の変更:**
- [変更内容]

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🎨 **Mockupを修正** - UI Mockupステージに戻って修正
> ⏭️ **後で修正** - 現状のまま設計を続行（CONSTRUCTIONで対応）
> ✅ **変更不要** - 提案を却下して次に進む
```

**注意**: 
- ユーザーが「Mockupを修正」を選択した場合、UI Mockupスキルに制御を移行
- 修正完了後、Application Designに戻る（設計成果物の更新が必要な場合あり）

## 実行手順概要

### Step 0: Web UI判定とUI Mockup状態確認（Web UIアプリのみ）
- `aidlc-state.md` の `Web UI Detected` を確認
- **No** の場合: このステップをスキップ
- **Yes** の場合: UI Mockupの完了状態を確認
  - 未実行の場合: ユーザーにUI Mockup作成を提案

### Step 1: コンテキスト分析
- requirements.md と stories.md を読み込み
- **Web UIアプリの場合**: ui-mockup/ も読み込み
- 主要ビジネス機能と領域を特定

### Step 2: アプリケーション設計プラン作成
チェックボックス付きプランを生成

### Step 3: 質問生成
コンテキストに適した質問のみ生成:
- コンポーネント識別
- コンポーネントメソッド
- サービスレイヤー設計
- コンポーネント依存関係
- デザインパターン

### Step 4-5: プラン保存とユーザー入力収集

### Step 6-8: 回答分析とフォローアップ

### Step 9: 設計成果物生成

### Step 9.5: UI-コンポーネントマッピングとUI変更評価（Web UIアプリのみ）
- UI-コンポーネントマッピングを `ui-component-mapping.md` に作成
- 設計によるUI変更必要性を評価
- 変更が必要な場合、Mockup修正を提案

### Step 9.7: 上流ドキュメントフィードバック更新

[upstream-document-update.md](references/upstream-document-update.md) のルールに従い、承認内容に基づいて前段階ドキュメントを最新化する。

**更新対象フォルダ**:
- `aidlc-docs/inception/requirements/`: コンポーネント設計で精緻化された内容に置換
- `aidlc-docs/inception/user-stories/`: 設計での詳細化に伴い重複する設計記述を削除
- `aidlc-docs/inception/ui-mockup/`（Web UIアプリの場合）: コンポーネント設計による画面変更を反映

**更新ルール**:
1. 古い記述 → 最新内容で置換
2. 重複記載 → 削除し参照リンクへ置換
3. 変更は Git commit で追跡

**除外**: `aidlc-docs/**/plans/*-plan.md` は更新対象外

### Step 10: 完了メッセージ

```markdown
# 🏗️ Application Design Complete

[AI-generated summary]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/inception/application-design/`

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **修正依頼** - 設計の修正を依頼
> [IF Web UI & Mockup変更推奨:]
> 🎨 **Mockupを修正** - UI Mockupステージに戻って修正
> [IF Units Generation skipped:]
> 📝 **Add Units Generation** - Include Units Generation stage
> ✅ **承認** - **[Units Generation/Development Standards]** に進む
```

## 参照ドキュメント

- [詳細手順](references/detailed-steps.md)

### 共通ルール
- [質問フォーマットガイド](references/question-format.md)
- [過信防止ガイド](references/overconfidence.md)
