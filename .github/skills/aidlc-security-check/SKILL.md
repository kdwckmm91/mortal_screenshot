````skill
---
name: aidlc-security-check
description: AI-DLCセキュリティチェックスキル。コード生成後に静的セキュリティ解析（SAST）、依存関係脆弱性チェック、シークレット検出を実施。CONSTRUCTIONフェーズで推奨実行。
---

# Security Check

コード生成後にセキュリティチェックを実施し、脆弱性を検出・報告します。

## 目的
- 静的コード解析による脆弱性パターンの検出
- 依存関係の脆弱性チェック
- ハードコードされたシークレットの検出
- セキュリティベストプラクティスの準拠確認

## 実行条件

**RECOMMENDED**: Code Generation 完了後

**Skip IF**: 明示的にユーザーがスキップを指示

## 2パート構成

### Part 1: Planning
1. コンテキスト分析
2. セキュリティチェックプラン作成
3. ユーザーレビュー・承認

### Part 2: Execution
1. 承認済みPlanの実行
2. セキュリティチェック実行
3. 結果レポート作成
4. ユーザー承認

## チェック項目定義

### 1. 静的コード解析（SAST）
- SQLインジェクション脆弱性パターン検出
- XSS (Cross-Site Scripting) 脆弱性検出
- CSRF (Cross-Site Request Forgery) 対策確認
- パストラバーサル脆弱性検出
- コマンドインジェクション検出
- 安全でないデシリアライゼーション検出

### 2. 依存関係脆弱性チェック
- npm audit / yarn audit（Node.js）
- pip-audit / safety（Python）
- bundler-audit（Ruby）
- 既知の脆弱性を持つライブラリの検出

### 3. シークレット検出
- ハードコードされた認証情報
- APIキー、アクセストークン
- 秘密鍵、証明書
- データベース接続文字列

### 4. セキュリティベストプラクティス
- OWASP Top 10 対応確認
- 入力検証の実装確認
- 認証・認可の実装確認
- エラーハンドリングでの情報漏洩防止

## 生成する成果物

| 場所 | ファイル | 内容 |
|------|---------|------|
| aidlc-docs/construction/plans/ | {unit-name}-security-check-plan.md | 検査プラン |
| aidlc-docs/construction/{unit-name}/security/ | security-scan-results.md | スキャン結果 |
| aidlc-docs/construction/{unit-name}/security/ | vulnerability-report.md | 脆弱性レポート |
| aidlc-docs/construction/{unit-name}/security/ | remediation-plan.md | 修正計画（問題検出時） |

## 実行手順概要

### Part 1: Planning

#### Step 1: コンテキスト分析
- 生成コードの分析
- 使用技術スタックの確認
- 適用するセキュリティチェック項目の決定

#### Step 2: セキュリティチェックプラン作成

チェックボックス付きの詳細プランを作成:

```markdown
# Security Check Plan - [unit-name]

## チェック対象
- 対象ユニット: [unit-name]
- 技術スタック: [languages/frameworks]
- コードファイル数: [X]

## 実行するチェック項目
### 1. 静的コード解析（SAST）
- [ ] SQLインジェクション脆弱性パターン検出
- [ ] XSS (Cross-Site Scripting) 脆弱性検出
- [ ] CSRF (Cross-Site Request Forgery) 対策確認
- [ ] パストラバーサル脆弱性検出
- [ ] コマンドインジェクション検出
- [ ] 安全でないデシリアライゼーション検出

### 2. 依存関係脆弱性チェック
- [ ] パッケージマネージャーの脆弱性スキャン
- [ ] 既知の脆弱性を持つライブラリの検出

### 3. シークレット検出
- [ ] ハードコードされた認証情報
- [ ] APIキー、アクセストークン
- [ ] 秘密鍵、証明書
- [ ] データベース接続文字列

### 4. セキュリティベストプラクティス
- [ ] OWASP Top 10 対応確認
- [ ] 入力検証の実装確認
- [ ] 認証・認可の実装確認
- [ ] エラーハンドリングでの情報漏洩防止
```

#### Step 3: Planファイル保存

`aidlc-docs/construction/plans/{unit-name}-security-check-plan.md` に保存

#### Step 4: ユーザーレビュー依頼

```markdown
# 🔒 Security Check Plan - Review Required

**Unit**: [unit-name]

[AI-generated plan summary]

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/construction/plans/{unit-name}-security-check-plan.md`

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications to the plan
> ✅ **Approve Plan** - Proceed to security check execution
```

#### Step 5: ユーザー承認待ち

### Part 2: Execution

#### Step 6: 承認済みPlanのロード

#### Step 7: セキュリティチェック実行
- Planの各チェック項目を順次実行
- 完了した項目は [x] でマーク
- 検出された問題を記録

#### Step 8: 結果レポート作成
- `security-scan-results.md`: スキャン結果
- `vulnerability-report.md`: 脆弱性レポート
- `remediation-plan.md`: 修正計画（問題検出時）

#### Step 9: 成果物の保存

#### Step 9.5: 上流ドキュメントフィードバック更新

[upstream-document-update.md](references/upstream-document-update.md) のルールに従い、承認内容に基づいて前段階ドキュメントを最新化する。

**更新対象フォルダ**:
- `aidlc-docs/inception/requirements/`: セキュリティ要件の追加
- 生成コード: 脆弱性対応による変更を反映

**更新ルール**:
1. 古い記述 → 最新内容で置換
2. 重複記載 → 削除し参照リンクへ置換
3. 変更は Git commit で追跡

**除外**: `aidlc-docs/**/plans/*-plan.md` は更新対象外

#### Step 10: 完了メッセージ

```markdown
# 🔒 Security Check Complete - [unit-name]

**Scan Results Summary:**
- Static Analysis: [X] issues found
- Dependency Vulnerabilities: [X] found
- Secrets Detection: [X] found
- Best Practices: [X] issues found

**Generated Artifacts:**
- ✅ security-scan-results.md
- ✅ vulnerability-report.md
- ✅ remediation-plan.md (if issues found)

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/construction/[unit-name]/security/`

> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> 🔧 **Request Changes** - Ask for modifications or fix issues
> ✅ **Approve & Continue** - Proceed to **Build and Test**
```

#### Step 11: ユーザー承認待ち（フェーズ完了確認）

#### Step 12: 状態更新・監査ログ記録

## 将来拡張
- references/security-checklist.md によるカスタムチェックリスト対応（予定）

````
