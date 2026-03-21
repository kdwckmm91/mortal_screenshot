# config.js スキーマ定義

`config.js` は画面定義・API仕様・遷移ルールを構造化するプロジェクト固有の設定ファイル。
ソースコード分析結果を基にAI Agentが生成する。

## ファイル形式

- **CommonJS** (`module.exports`) — `afterNavigate` に JavaScript 関数を含むため、JSON形式は使用不可
- ファイル名: `config.js`

## トップレベル構造

```javascript
module.exports = {
  // === アプリケーション基本設定 ===
  baseUrl: 'http://localhost:3000',        // 必須: 対象アプリのベースURL
  outputDir: '../path/to/output/',         // 必須: ドキュメント出力先（config.jsからの相対パス）
  screenshotDir: '../path/to/screenshots/',// 必須: スクリーンショット保存先
  dataFile: '../path/to/capture-data.json',// 必須: キャプチャメタデータ保存先

  // === ブラウザ設定 ===
  browser: {
    headless: false,                       // true=ヘッドレス, false=UI表示（認証時はfalse推奨）
    viewport: { width: 1440, height: 900 },// ブラウザビューポートサイズ
    storageStatePath: './auth-state.json'   // ログイン情報の保存先（.gitignore推奨）
  },

  // === 待機設定 ===
  wait: {
    networkIdle: 5000,    // ネットワーク通信が安定するまでの待機（ms）
    afterNavigation: 2000,// ページ遷移後の追加待機（ms）
    chartRender: 5000     // チャート・グラフの描画完了待機（ms）
  },

  // === 画面定義 ===
  screens: [/* Screen オブジェクトの配列 */],

  // === 遷移定義 ===
  transitions: [/* Transition オブジェクトの配列 */]
};
```

## Screen オブジェクト

画面定義の各要素。

```javascript
{
  // --- 識別情報 ---
  id: 'screen-id',           // 必須: 一意の識別子（ケバブケース推奨）
  name: '画面名',             // 必須: ドキュメント表示用の日本語名
  path: '/url/path',         // 必須: URLパス（baseUrl からの相対）

  // --- 表示/説明 ---
  description: '画面の説明文', // 必須: 画面の役割・概要
  features: [                 // 必須: 画面で提供する機能のリスト
    '機能1の説明',
    '機能2の説明'
  ],

  // --- タブ/ビュー設定（オプション） ---
  tab: 'tab-identifier',     // オプション: 同一パスで複数ビューを持つ場合のタブ識別子
  tabLabel: 'タブ名',         // オプション: タブのUI上のテキスト（タブクリック時のセレクタ構築に使用）

  // --- 認証・権限（オプション） ---
  requiresAuth: true,        // オプション: 認証が必要か（デフォルト: true を想定）
  requiresAdmin: false,      // オプション: 管理者権限が必要か
  screenshotBeforeAuth: true, // オプション: 認証前にスクリーンショットを取得するか（ログイン画面用）

  // --- キャプチャ制御 ---
  waitForSelector: '.css-selector', // 必須: この要素の表示を待ってからスクリーンショット取得
  waitTime: 3000,                   // オプション: waitForSelector後の追加待機時間（ms）

  // --- ナビゲーション後アクション（オプション） ---
  afterNavigate: async (page) => {  // オプション: ページ遷移後に実行するPlaywright操作
    // タブクリック、モーダル操作、フォーム入力など
    await page.click('[role="tab"]:has-text("タブ名")');
    await page.waitForTimeout(2000);
  },

  // --- API定義 ---
  apis: [/* API オブジェクトの配列 */]
}
```

### タブ/ビュー構成のパターン

同一URLパス上で複数のタブ/ビューがある場合、各タブを独立した Screen として定義する:

```javascript
// タブビューの例: 同じ /analysis パスに「集計」「シミュレーション」タブ
{
  id: 'analysis-summary',
  name: 'RI/SP分析: 集計',
  path: '/analysis',
  tab: 'summary',
  tabLabel: '集計',
  afterNavigate: async (page) => {
    await page.click('[role="tab"]:has-text("集計")');
    await page.waitForTimeout(2000);
  },
  // ...
},
{
  id: 'analysis-simulation',
  name: 'RI/SP分析: シミュレーション',
  path: '/analysis',
  tab: 'simulation',
  tabLabel: 'シミュレーション',
  afterNavigate: async (page) => {
    await page.click('[role="tab"]:has-text("シミュレーション")');
    await page.waitForTimeout(2000);
  },
  // ...
}
```

**同一パスのタブ切替最適化**: `capture.js` は `previousPath` を追跡し、同じパスの連続する Screen ではページ再読込をスキップして `afterNavigate` のみ実行する。したがって、同じパスのタブは `screens[]` 配列内で連続して配置すること。

## API オブジェクト

各画面が呼び出すAPIエンドポイントの定義。

```javascript
{
  method: 'GET',              // 必須: HTTPメソッド (GET, POST, PUT, DELETE, PATCH)
  path: '/api/v1/resource',   // 必須: APIパス
  description: 'API説明',     // 必須: APIの役割・概要
  auth: true,                 // 必須: 認証が必要か
  parameters: {               // オプション: リクエストパラメータ定義
    path: {                   // オプション: パスパラメータ
      paramName: '説明'
    },
    query: {                  // オプション: クエリパラメータ
      paramName: '説明'
    },
    body: {                   // オプション: リクエストボディ
      fieldName: '説明'
    }
  },
  response: {                 // オプション: 主要レスポンスフィールド
    fieldName: '説明'
  }
}
```

## Transition オブジェクト

画面間の遷移ルール定義。

```javascript
{
  from: 'source-screen-id',   // 必須: 遷移元の screen.id
  to: 'target-screen-id',     // 必須: 遷移先の screen.id
  trigger: 'ユーザーアクション',// 必須: 遷移を発生させる操作
  description: '遷移の説明'    // 必須: 遷移の補足説明
}
```

### 遷移パターン

| パターン | trigger 例 | 説明 |
|---------|-----------|------|
| ログイン | `認証処理` | ログイン画面 → 認証後リダイレクト先 |
| サイドバー | `サイドメニュー選択` | サイドバーのナビゲーションリンク |
| タブ切替 | `タブ切替` | 同一画面内のタブ/ビュー切替 |
| ボタン | `ボタンクリック` | 操作ボタンによる画面遷移 |
| リンク | `リンクで遷移` | テキストリンクによる遷移 |
| ログアウト | `ヘッダーメニューからログアウト` | ログアウト操作 |

## 実装例（参考）

> 以下はCostVisualizer4プロジェクトでの実装例。スキーマの使い方を示す参考として掲載しており、プロジェクト固有の値を含む。実際の利用時はAI Agentが対象プロジェクトのソースコード分析結果に基づいて生成する。

```javascript
const path = require('path');

module.exports = {
  baseUrl: 'http://localhost:3000',
  outputDir: path.resolve(__dirname, '../../documents/screen-transition/'),
  screenshotDir: path.resolve(__dirname, '../../documents/screen-transition/screenshots/'),
  dataFile: path.resolve(__dirname, '../../documents/screen-transition/capture-data.json'),

  browser: {
    headless: false,
    viewport: { width: 1440, height: 900 },
    storageStatePath: path.resolve(__dirname, './auth-state.json')
  },

  wait: {
    networkIdle: 5000,
    afterNavigation: 2000,
    chartRender: 5000
  },

  screens: [
    {
      id: 'login',
      name: 'ログイン画面',
      path: '/',
      description: '認証前のログイン画面',
      features: ['Oktaフェデレーションログイン', 'サインアップ機能'],
      waitForSelector: 'button, [data-testid="login"]',
      screenshotBeforeAuth: true,
      apis: []
    },
    {
      id: 'cost-trend',
      name: 'コスト推移画面',
      path: '/cost-trend',
      description: 'AWSアカウントのコスト推移をグラフで表示',
      features: [
        '月別コスト推移グラフ',
        'サービス別コスト内訳'
      ],
      waitForSelector: '.recharts-wrapper, [data-testid="chart"]',
      waitTime: 5000,
      apis: [
        {
          method: 'GET',
          path: '/api/cost-trend',
          description: 'コスト推移データ取得',
          auth: true,
          parameters: {
            query: {
              period: '表示期間',
              accountId: 'AWSアカウントID'
            }
          },
          response: {
            monthlyCosts: '月別コストデータ配列'
          }
        }
      ]
    },
    {
      id: 'ri-sp-utilization',
      name: 'RI/SP分析: 利用状況',
      path: '/ri-sp',
      tab: 'utilization',
      tabLabel: '利用状況',
      description: 'RI/SPの利用状況を分析',
      features: ['利用率グラフ', '利用状況テーブル'],
      waitForSelector: '.recharts-wrapper',
      waitTime: 3000,
      apis: [
        {
          method: 'GET',
          path: '/api/ri-sp/utilization',
          description: 'RI/SP利用状況データ取得',
          auth: true,
          parameters: { query: { period: '分析期間' } },
          response: { utilizationData: '利用状況データ' }
        }
      ]
    },
    {
      id: 'ri-sp-simulation',
      name: 'RI/SP分析: シミュレーション',
      path: '/ri-sp',
      tab: 'simulation',
      tabLabel: 'シミュレーション',
      description: 'RI/SP購入シミュレーション',
      features: ['購入シミュレーション', 'コスト比較'],
      afterNavigate: async (page) => {
        await page.click('[role="tab"]:has-text("シミュレーション")');
        await page.waitForTimeout(2000);
      },
      waitForSelector: '[role="tabpanel"]',
      waitTime: 3000,
      apis: [
        {
          method: 'POST',
          path: '/api/ri-sp/simulation',
          description: 'シミュレーション実行',
          auth: true,
          parameters: {
            body: {
              type: 'RI/SP種別',
              term: '購入期間'
            }
          },
          response: { simulationResult: 'シミュレーション結果' }
        }
      ]
    }
  ],

  transitions: [
    {
      from: 'login',
      to: 'cost-trend',
      trigger: '認証処理',
      description: 'Okta認証後にコスト推移画面へリダイレクト'
    },
    {
      from: 'cost-trend',
      to: 'ri-sp-utilization',
      trigger: 'サイドメニュー選択',
      description: 'サイドバーからRI/SP分析を選択'
    },
    {
      from: 'ri-sp-utilization',
      to: 'ri-sp-simulation',
      trigger: 'タブ切替',
      description: 'シミュレーションタブに切替'
    }
  ]
};
```
