# Development Standards - 標準テンプレート

開発標準ドキュメント生成時に参照するテンプレートです。

## 成果物フォーマット

`development-standards.md` は以下のフォーマットで生成し、承認後に `copilot-instructions.md` に追記します。

```markdown
# プロジェクト開発標準

## ディレクトリ構造規約

### プロジェクト構造
\`\`\`
<PROJECT-ROOT>/
├── src/                    # ソースコード
│   ├── components/         # 共通コンポーネント
│   ├── features/           # 機能別モジュール
│   ├── services/           # サービス層
│   ├── utils/              # ユーティリティ
│   └── types/              # 型定義
├── tests/                  # テストコード
│   ├── unit/               # ユニットテスト
│   ├── integration/        # 統合テスト
│   └── e2e/                # E2Eテスト
├── docs/                   # ドキュメント
└── config/                 # 設定ファイル
\`\`\`

### 配置ルール
- [具体的な配置ルールを記載]

## 命名規約

### ファイル名
| 種別 | 規約 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `UserProfile.tsx` |
| ユーティリティ | camelCase | `formatDate.ts` |
| 定数 | SCREAMING_SNAKE_CASE | `API_ENDPOINTS.ts` |
| テスト | *.test.ts / *.spec.ts | `UserProfile.test.tsx` |

### 変数・関数・クラス
| 種別 | 規約 | 例 |
|------|------|-----|
| 変数 | camelCase | `userName` |
| 定数 | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 関数 | camelCase | `getUserById` |
| クラス | PascalCase | `UserService` |
| インターフェース | PascalCase + I prefix (optional) | `IUserRepository` |

## コーディング規約

### 共通ルール
- インデント: [スペース数]
- 最大行長: [文字数]
- 文字列: [シングル/ダブルクォート]
- セミコロン: [あり/なし]

### インポート順序
1. 外部ライブラリ
2. 内部モジュール（絶対パス）
3. 内部モジュール（相対パス）
4. 型定義
5. スタイル

### コメント規約
- 関数・クラスにはJSDoc/Docstringを記載
- 複雑なロジックには説明コメントを追加
- TODOコメントには担当者と期限を記載

## テスト完了定義

### カバレッジ閾値
| 種別 | 閾値 |
|------|------|
| ステートメント | [X]% |
| ブランチ | [X]% |
| 関数 | [X]% |
| 行 | [X]% |

### 必須テストパターン
- [ ] ユニットテスト: 全パブリック関数
- [ ] 統合テスト: API エンドポイント
- [ ] E2Eテスト: 主要ユーザーフロー

### テストファイル配置
- ユニットテスト: `tests/unit/` または `__tests__/`
- 統合テスト: `tests/integration/`
- E2Eテスト: `tests/e2e/`

## 統合ルール

### ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 機能開発
- `bugfix/*`: バグ修正
- `hotfix/*`: 緊急修正

### コミットメッセージ規約
\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

**Type:**
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: フォーマット
- refactor: リファクタリング
- test: テスト
- chore: その他

### コードレビュー基準
- [ ] コーディング規約に準拠
- [ ] 適切なテストが追加されている
- [ ] ドキュメントが更新されている
- [ ] セキュリティ上の問題がない
- [ ] パフォーマンスへの影響が考慮されている
```

## 技術スタック別テンプレート

### Node.js / TypeScript
```markdown
### 追加ルール（Node.js / TypeScript）
- ESLint + Prettier を使用
- TypeScript strict mode を有効化
- async/await を優先（Promise.then より）
```

### Python
```markdown
### 追加ルール（Python）
- Black + isort を使用
- Type hints を必須化
- docstring は Google スタイル
```

### React
```markdown
### 追加ルール（React）
- 関数コンポーネントを使用
- カスタムフックは use* プレフィックス
- Props には型定義を必須
```
