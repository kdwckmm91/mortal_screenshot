# 上流ドキュメントフィードバック更新ルール

各ステージのユーザー承認後に、前段階（上流）ドキュメントを最新化するためのルールです。

## 目的
- 後続ステージで得られた知見・精緻化された内容を上流ドキュメントに反映
- ドキュメント間の重複を排除し、情報の鮮度を維持
- AI Agentが効率的に全ドキュメントを読み取れるコンパクトさを確保

## 基本原則

### 上書き更新
- 上流ドキュメントの古い記述は、最新内容に**置換**する
- ドキュメント内にUpdate LogやChange Historyは記載しない
- Gitコミットが変更履歴の記録となる

### 重複排除
- 同一情報が複数ドキュメントに存在する場合、最も詳細なドキュメントに一元化する
- 他方の重複箇所は**削除**し、参照リンク1行に置換する

```markdown
> 📎 **詳細**: [ファイル名](相対パス) を参照
```

### Planファイル除外
以下のファイルは更新対象外とする:
- `aidlc-docs/inception/plans/*-plan.md`
- `aidlc-docs/construction/plans/*-plan.md`
- 全ての `*-plan.md` ファイル（実施計画・チェックボックス管理用）

### 情報の一元化先の判断基準

| 条件 | 情報を残す場所 |
|------|--------------|
| 後続ステージでより詳細に記述された | 後続ステージのドキュメント |
| 要件レベルの概要のみ必要 | `requirements.md`（概要1行 + 参照リンク） |
| 設計の詳細 | 該当の設計ドキュメント |
| 実装の詳細 | コードファイル自体 |

## ステージ別更新マッピング

### INCEPTION Phase

| 完了ステージ | 更新対象フォルダ | 更新内容 | 除外 |
|------------|----------------|---------|------|
| UI Mockup | ー | 上流ドキュメントなし | 全planファイル |
| Requirements | `aidlc-docs/inception/ui-mockup/`（Web UI時） | 要件分析で判明した追加画面・画面変更を反映 | 全planファイル |
| User Stories | `aidlc-docs/inception/requirements/` | ストーリーで詳細化された要件を参照リンクに置換。カバレッジ情報を追記 | 全planファイル |
| Workflow Planning | `aidlc-docs/inception/requirements/`, `aidlc-docs/inception/user-stories/` | 実行計画との紐付け。スキップ対象の要件/ストーリーにマーク | 全planファイル |
| Application Design | `aidlc-docs/inception/requirements/`, `aidlc-docs/inception/user-stories/`, `aidlc-docs/inception/ui-mockup/`（Web UI時） | コンポーネント設計で精緻化された内容に置換。重複する設計記述を削除 | 全planファイル |
| Units Generation | `aidlc-docs/inception/application-design/`, `aidlc-docs/inception/user-stories/` | ユニット割当情報を反映。ストーリーにユニット紐付けを追記 | 全planファイル |
| Development Standards | `aidlc-docs/inception/application-design/` | 開発ルール適用方針の反映 | 全planファイル |

### CONSTRUCTION Phase

| 完了ステージ | 更新対象フォルダ | 更新内容 | 除外 |
|------------|----------------|---------|------|
| Functional Design | `aidlc-docs/inception/application-design/`, `aidlc-docs/inception/requirements/` | 詳細ビジネスロジックで精緻化。上流の概要記述を参照リンクに置換 | 全planファイル |
| NFR Requirements | `aidlc-docs/inception/requirements/`, `aidlc-docs/construction/[unit-name]/functional-design/` | NFR具体化で古いNFR記述を置換。技術スタック決定の影響を反映 | 全planファイル |
| NFR Design | `aidlc-docs/construction/[unit-name]/nfr-requirements/`, `aidlc-docs/inception/requirements/` | 設計パターン反映。重複するNFR記述を一元化 | 全planファイル |
| Infrastructure Design | `aidlc-docs/construction/[unit-name]/nfr-design/`, `aidlc-docs/inception/requirements/` | インフラ制約による設計・要件への影響を反映 | 全planファイル |
| Code Generation | `aidlc-docs/construction/[unit-name]/functional-design/`, `aidlc-docs/construction/[unit-name]/infrastructure-design/` | 実装時に判明した設計変更・補足を反映 | 全planファイル |
| Security Check | `aidlc-docs/inception/requirements/`, 生成コード | セキュリティ要件の追加。脆弱性対応による変更を反映 | 全planファイル |
| Build & Test | `aidlc-docs/inception/requirements/` + 全上流フォルダ | テスト結果によるカバレッジ情報。品質指標の反映 | 全planファイル |

## 実行手順

### Step 1: 更新対象ドキュメントの特定
上記マッピングテーブルから、現在のステージに対応する更新対象ドキュメントを特定する。

### Step 2: 古い記述・重複箇所の検出
更新対象ドキュメント内で、本ステージの成果物と重複・矛盾する箇所を検出する。

### Step 3: 上書き更新・重複排除の実行
- 古い記述 → 最新内容に**置換**
- 重複箇所 → **削除**し、参照リンク1行に置換
- `*-plan.md` は更新しない

### Step 4: 整合性確認
更新後のドキュメント間で矛盾がないことを確認する。

## ドキュメントサイズガイドライン

AI Agentの効率的な読み取りのため、以下を目安とする:

| ドキュメント | 推奨上限 | 対策 |
|------------|---------|------|
| `requirements.md` | 500行以内 | 詳細は下流ドキュメントに委譲し参照リンクで代替 |
| `stories.md` | 300行以内 | 設計詳細は `components.md` に委譲 |
| `components.md` | 400行以内 | 詳細ロジックは `functional-design/` に委譲 |
| 各 `functional-design/*.md` | 300行以内 | 実装詳細はコードに委譲 |

**上限を超えた場合**: 重複排除と参照リンク化を積極的に実施し、コンパクト化する。
