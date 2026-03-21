# 検索キーワード戦略

ユースケース別の効果的な検索キーワード構成パターン。
Step 1（キーワード決定）で参照し、検索精度を向上させる。

## 基本原則

- **具体性**: 一般的な単語より固有名詞・技術名を優先する
- **英語優先**: 技術情報は英語で検索した方が情報量が多い場合が多い
- **段階的絞り込み**: 広い検索 → 結果を確認 → キーワード追加で絞り込む

## ユースケース別パターン

### 1. 最新バージョン・リリース情報

**目的**: ライブラリ・フレームワークの最新版情報を取得する

**キーワードパターン**:
```
{技術名}+{バージョン}+release
{技術名}+latest+version+{年}
{技術名}+changelog+{年}
```

**具体例**:
```
Next.js+15+release+notes
React+19+new+features+2024
Python+3.13+changelog
```

**情報源の優先順位**:
1. GitHub Releases ページ
2. 公式ブログ
3. 公式ドキュメントの "What's New" セクション

---

### 2. エラー・トラブルシューティング

**目的**: エラーメッセージや問題の解決方法を検索する

**キーワードパターン**:
```
{エラーメッセージの主要部分}+{技術名}
{技術名}+{エラーコード}+fix
{技術名}+{症状}+solution
```

**具体例**:
```
ECONNREFUSED+Node.js+fix
TypeError+cannot+read+property+undefined+React
AWS+Lambda+timeout+increase
```

**注意事項**:
- エラーメッセージは引用符で囲まず、主要なキーワードのみ抽出する
- 動的な値（ファイルパス、タイムスタンプ等）は除外する
- スタックトレースの最初の1行目を使用する

---

### 3. API仕様・ドキュメント検索

**目的**: 特定のAPIやメソッドの仕様・使用方法を確認する

**キーワードパターン**:
```
{技術名}+{API名}+documentation
{技術名}+{メソッド名}+example
{技術名}+{クラス名}+API+reference
```

**具体例**:
```
AWS+S3+putObject+SDK+v3
React+useEffect+cleanup+documentation
PostgreSQL+JSONB+query+operators
```

**情報源の優先順位**:
1. 公式APIリファレンス
2. 公式ガイド・チュートリアル
3. Stack Overflow の高投票回答

---

### 4. ベストプラクティス・設計パターン

**目的**: 推奨される実装方法やアーキテクチャパターンを調査する

**キーワードパターン**:
```
{技術名}+best+practices+{年}
{技術名}+{パターン名}+implementation
{技術名}+production+setup+guide
```

**具体例**:
```
Next.js+App+Router+best+practices+2025
Docker+multi-stage+build+production
TypeScript+monorepo+setup+guide
```

---

### 5. 比較・技術選定

**目的**: 技術間の比較情報を収集し選定を支援する

**キーワードパターン**:
```
{技術A}+vs+{技術B}+{年}
{技術A}+alternative+{年}
{技術カテゴリ}+comparison+{年}
```

**具体例**:
```
Bun+vs+Node.js+2025+benchmark
Prisma+vs+Drizzle+ORM+comparison
React+state+management+comparison+2025
```

---

### 6. セキュリティ・脆弱性情報

**目的**: 特定のパッケージやソフトウェアの脆弱性情報を確認する

**キーワードパターン**:
```
{パッケージ名}+CVE+{年}
{パッケージ名}+security+vulnerability
{パッケージ名}+security+advisory
```

**具体例**:
```
lodash+CVE+2025
OpenSSL+security+advisory
npm+audit+fix+guide
```

**情報源の優先順位**:
1. NVD (National Vulnerability Database)
2. GitHub Security Advisories
3. パッケージの公式セキュリティアナウンス

## 日本語検索のコツ

日本語固有のコンテンツが必要な場合のみ日本語で検索する。

**日本語が有効な場面**:
- 法律・規制に関する情報
- 日本固有のサービス・API（マイナンバー、JP Pay等）
- 日本語の技術ブログ（Zenn、Qiita）上の実践的なノウハウ

**キーワード例**:
```
Next.js+App+Router+ベストプラクティス
AWS+Lambda+コールドスタート+対策
TypeScript+型安全+設計パターン
```

## 再検索の戦略

初回検索で十分な結果が得られなかった場合の再試行パターン。

| 試行 | 戦略 | 例 |
|---|---|---|
| 1回目 | 具体的なキーワードで検索 | `Next.js+15+App+Router+migration+guide` |
| 2回目 | キーワードを減らして広げる | `Next.js+15+migration` |
| 3回目 | 言語を変えて検索 | `Next.js+15+マイグレーション` |
