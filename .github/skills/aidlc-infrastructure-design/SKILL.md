---
name: aidlc-infrastructure-design
description: AI-DLCインフラストラクチャ設計スキル。論理ソフトウェアコンポーネントを実際のインフラストラクチャサービス（AWS、Azure、GCP、オンプレミス）にマッピング。デプロイメントアーキテクチャ、クラウドリソース仕様定義時に使用。インフラ設計、クラウド設計、デプロイメント設計で自動アクティブ化。CONSTRUCTIONフェーズの条件付きステージ。
---

# Infrastructure Design

論理ソフトウェアコンポーネントを実際のインフラストラクチャ選択にマッピングします。

## 実行条件

**Execute IF**:
- インフラストラクチャサービスのマッピングが必要
- デプロイメントアーキテクチャが必要
- クラウドリソースの仕様が必要

**Skip IF**:
- インフラ変更なし
- インフラが既に定義済み

## 生成する成果物

| ファイル | 内容 |
|---------|------|
| infrastructure-design.md | インフラ設計指示 |
| deployment-architecture.md | デプロイメントアーキテクチャ |
| shared-infrastructure.md | 共有インフラ（該当時） |

## 実行手順概要

### Step 1: 設計成果物の分析
- functional-design/ から機能設計を読み込み
- nfr-design/ からNFR設計を読み込み（存在時）
- インフラが必要な論理コンポーネントを特定

### Step 2: インフラ設計プラン作成
チェックボックス付きプランを生成

### Step 3: 質問生成

**質問カテゴリ**（該当する場合のみ）:
- デプロイメント環境
- コンピュートインフラ
- ストレージインフラ
- メッセージングインフラ
- ネットワーキングインフラ
- モニタリングインフラ
- 共有インフラ

### Step 4-5: プラン保存と回答収集

### Step 6: インフラ設計成果物生成

### Step 6.5: 上流ドキュメントフィードバック更新

[upstream-document-update.md](references/upstream-document-update.md) のルールに従い、承認内容に基づいて前段階ドキュメントを最新化する。

**更新対象フォルダ**:
- `aidlc-docs/construction/[unit-name]/nfr-design/`: インフラ制約による設計への影響を反映
- `aidlc-docs/inception/requirements/`: インフラ制約による要件への影響を反映

**更新ルール**:
1. 古い記述 → 最新内容で置換
2. 重複記載 → 削除し参照リンクへ置換
3. 変更は Git commit で追跡

**除外**: `aidlc-docs/**/plans/*-plan.md` は更新対象外

### Step 7: 完了メッセージ

```markdown
# 🏢 Infrastructure Design Complete - [unit-name]

[AI-generated summary]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/construction/[unit-name]/infrastructure-design/`



> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications
> ✅ **Continue to Next Stage** - Proceed to **Code Generation**
```

### Step 8-9: 承認待ちと進捗更新

## 参照ドキュメント

- [詳細手順](references/detailed-steps.md)

### 共通ルール
- [質問フォーマットガイド](references/question-format.md)
- [過信防止ガイド](references/overconfidence.md)
