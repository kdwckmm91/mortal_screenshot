---
name: aidlc-build-test
description: AI-DLCビルド・テストスキル。全ユニットのビルド、包括的テスト戦略の実行、品質検証を行う。ビルド手順、ユニットテスト、統合テスト、パフォーマンステスト、E2Eテストの指示書を生成。ビルド、テスト、検証、品質保証時に使用。CONSTRUCTIONフェーズで常に実行される必須ステージ。全ユニットのコード生成完了後に実行。
---

# Build and Test

全ユニットをビルドし、包括的なテスト戦略を実行します。

## 実行条件
- **常時実行**: 全ユニットのCode Generation完了後

## 前提条件
- 全ユニットのCode Generation完了
- 全コード成果物生成済み
- プロジェクトがビルド・テスト可能な状態

## 生成する成果物

| ファイル | 内容 |
|---------|------|
| build-instructions.md | ビルド手順と設定 |
| unit-test-instructions.md | ユニットテスト実行手順 |
| integration-test-instructions.md | 統合テスト手順 |
| performance-test-instructions.md | パフォーマンステスト手順（該当時） |
| contract-test-instructions.md | APIコントラクトテスト（マイクロサービス時） |
| security-test-instructions.md | セキュリティテスト（該当時） |
| e2e-test-instructions.md | E2Eテスト（該当時） |
| build-and-test-summary.md | ビルド・テスト結果サマリー |

## 実行手順概要

### Step 1: テスト要件分析
プロジェクトを分析し適切なテスト戦略を決定:
- ユニットテスト（コード生成時に生成済み）
- 統合テスト（ユニット/サービス間の相互作用）
- パフォーマンステスト（負荷、ストレス、スケーラビリティ）
- E2Eテスト（完全なユーザーワークフロー）
- コントラクトテスト（サービス間APIコントラクト検証）
- セキュリティテスト（脆弱性スキャン、ペネトレーション）

### Step 2: ビルド手順生成
- 前提条件（ビルドツール、依存関係、環境変数）
- ビルドステップ（依存関係インストール、環境設定、ビルド実行）
- 成功検証
- トラブルシューティング

### Step 3: ユニットテスト実行手順生成

### Step 4: 統合テスト手順生成

### Step 5: パフォーマンステスト手順生成（該当時）

### Step 6: 追加テスト手順生成（必要に応じて）

### Step 7: テストサマリー生成

```markdown
# Build and Test Summary

## Build Status
- **Build Tool**: [Tool name]
- **Build Status**: [Success/Failed]
- **Build Artifacts**: [List]

## Test Execution Summary

### Unit Tests
- **Total Tests**: [X]
- **Passed**: [X]
- **Failed**: [X]
- **Coverage**: [X]%

### Integration Tests
- **Test Scenarios**: [X]
- **Passed**: [X]
- **Failed**: [X]

### Performance Tests
- **Response Time**: [Actual] (Target: [Expected])
- **Throughput**: [Actual] (Target: [Expected])

## Overall Status
- **Build**: [Success/Failed]
- **All Tests**: [Pass/Fail]
- **Ready for Operations**: [Yes/No]
```

### Step 8: 状態追跡更新

### Step 8.5: 上流ドキュメントフィードバック更新

[upstream-document-update.md](references/upstream-document-update.md) のルールに従い、承認内容に基づいて前段階ドキュメントを最新化する。

**更新対象フォルダ**:
- `aidlc-docs/inception/requirements/`: テスト結果によるカバレッジ情報。品質指標の反映
- 全上流フォルダ: テスト結果で判明した設計・実装の齟齬を反映

**更新ルール**:
1. 古い記述 → 最新内容で置換
2. 重複記載 → 削除し参照リンクへ置換
3. 変更は Git commit で追跡

**除外**: `aidlc-docs/**/plans/*-plan.md` は更新対象外

### Step 9: 結果提示

```markdown
# 🔨 Build and Test Complete

**Build Status**: [Success/Failed]

**Test Results**:
✅ Unit Tests: [X] passed
✅ Integration Tests: [X] scenarios passed
✅ Performance Tests: [Status]
✅ Additional Tests: [Status]

**Generated Files**:
1. ✅ build-instructions.md
2. ✅ unit-test-instructions.md
3. ✅ integration-test-instructions.md
4. ✅ [additional files]
5. ✅ build-and-test-summary.md

> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine: `aidlc-docs/construction/build-and-test/`



> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> Ready to proceed to **Operations** stage for deployment planning?
```

### Step 10: 完了記録

## 参照ドキュメント

- [詳細手順](references/detailed-steps.md)
