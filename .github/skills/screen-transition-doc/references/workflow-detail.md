# ワークフロー詳細

各フェーズの詳細な手順・設計パターン・実装例。

---

## Phase 1: ソースコード分析

### 1.1 ルーティング構造の抽出

対象フレームワーク別に以下を分析する:

| フレームワーク | 分析対象 |
|-------------|---------|
| Next.js App Router | `app/` ディレクトリの `page.tsx`、`layout.tsx`、`route.ts` |
| Next.js Pages Router | `pages/` ディレクトリの各ファイル |
| React Router | `<Route>`, `<Routes>`, `createBrowserRouter` 設定 |
| Vue Router / Nuxt | `router/index.ts`、`pages/` ディレクトリ（Nuxtファイルベースルーティング） |
| Angular Router | `app-routing.module.ts`、`Routes` 配列定義、遅延ロードモジュール |
| SvelteKit | `src/routes/` ディレクトリの `+page.svelte`、`+layout.svelte` |
| Astro | `src/pages/` ディレクトリの `.astro`/`.md` ファイル |
| その他 SPA | フレームワーク固有のルーター設定ファイル |

抽出する情報:
- URLパス（動的セグメント含む）
- ページコンポーネント名
- レイアウト構造（ネスト）
- ミドルウェア / ルートガード

### 1.2 画面UI構成の分析

各ページコンポーネントを解析し、以下を特定する:

- **主要機能**: テーブル、グラフ、フォーム、モーダル等
- **タブ/ビュー構造**: 同一URL上で切り替わるビュー（例: タブコンポーネント）
- **UIフレームワーク**: MUI, Vuetify, Angular Material, Chakra UI, shadcn/ui, PrimeNG 等
- **状態管理**: React (useState, Zustand, Redux)、Vue (Pinia, Vuex)、Angular (NgRx, Signals)、Svelte (stores) 等

### 1.3 APIエンドポイントの抽出

画面から呼び出されるAPIを以下のソースから特定:

- `fetch()`, `axios`, `ky`, `ofetch` 呼び出し
- React Query / SWR / TanStack Query / Apollo Client のフック
- Angular の `HttpClient`、`HttpResource`
- Vue の `useFetch` (Nuxt)、`useAsyncData`
- Svelte の `load` 関数
- カスタムAPIクライアント
- バックエンドの API ルート定義（Next.js `route.ts`, Express `router`, FastAPI, Django, Spring Boot 等）

各APIについて抽出する情報:
- HTTPメソッド（GET/POST/PUT/DELETE/PATCH）
- エンドポイントパス
- リクエストパラメータ（パス/クエリ/ボディ）
- レスポンス構造（主要フィールド）
- 認証要件

### 1.4 画面遷移の特定

ナビゲーション構造を以下から特定:

- サイドバー / ヘッダーのメニュー構造
- ルーターリンク: React `<Link>`, Vue `<RouterLink>`, Angular `routerLink`, SvelteKit `<a>` 等
- プログラマティック遷移: `router.push`, `navigate`, `$navigating`, `router.navigate()` 等
- 認証リダイレクト
- フォーム送信後のリダイレクト

---

## Phase 2: config.js 生成

分析結果を `config.js` のスキーマ（`references/config-schema.md` 参照）に変換する。

### 生成ルール

1. **screen.id** はケバブケースで一意にする（例: `cost-trend`, `user-management`）
2. **features[]** は画面の機能を箇条書きで列挙（ユーザー視点で記述）
3. **apis[]** はソースコードから特定した実際のAPI呼び出しを記載
4. **transitions[]** はナビゲーション構造から全遷移を網羅
5. **タブ付き画面** は `screens[]` 内で連続して配置（同一パス最適化のため）
6. **waitForSelector** は画面の「読込完了」を判定するセレクタ（グラフ、テーブル等）
7. **afterNavigate** はPlaywrightの `page` オブジェクトを引数に取る非同期関数

### ユーザー確認事項

`config.js` 生成前に以下をユーザーに確認する。`[Question]` + `[Answer]` 形式で提示し、推奨例と質問の背景・目的を記載すること:

- **ドキュメント出力先**: スクリーンショット・Markdown・DOCXの保存先（推奨例: `documents/<project-name>/screen-transition/`）
- **スクリプト保存先**: capture.js・generate-doc.js 等の保存先（推奨例: `scripts/screen-capture/`）
- **baseUrl**: 開発サーバーのURL（推奨例: `http://localhost:3000`）
- **認証方式**: SSO, OAuth, ID/PW 等（手動ログインフロー設計に影響）
- **スクリーンショット解像度**: ビューポートサイズ（推奨例: 1440x900）

**重要**: 保存先ディレクトリは勝手に決定せず、必ずユーザーの承認を得てから作成すること。

---

## Phase 3: capture.js 設計パターン

### 3.1 全体構造

```javascript
const { chromium } = require('playwright');
const config = require('./config');
const fs = require('fs');
const path = require('path');

async function main() {
  const reuseAuth = process.argv.includes('--reuse');

  // ディレクトリ作成
  ensureDirectories();

  // ブラウザ起動
  const browser = await chromium.launch({ headless: config.browser.headless });
  const context = await createContext(browser, reuseAuth);
  const page = await context.newPage();

  // ネットワーク傍受設定
  const networkRecorder = setupNetworkRecorder(page);

  // Phase 1: 認証
  await handleAuthentication(page, context, reuseAuth);

  // Phase 2: 画面キャプチャ
  const captureData = await captureScreens(page, networkRecorder);

  // Phase 3: データ保存
  saveCaptureData(captureData);

  await browser.close();
}
```

### 3.2 認証フロー

```javascript
async function handleAuthentication(page, context, reuseAuth) {
  if (reuseAuth && fs.existsSync(config.browser.storageStatePath)) {
    console.log('保存済み認証情報を使用');
    return;
  }

  // ログイン画面に遷移
  await page.goto(`${config.baseUrl}/`);
  await page.waitForTimeout(config.wait.afterNavigation);

  // ログイン画面のスクリーンショット（screenshotBeforeAuth: true の画面）
  const loginScreen = config.screens.find(s => s.screenshotBeforeAuth);
  if (loginScreen) {
    await captureScreenshot(page, loginScreen);
  }

  // 手動ログイン待機
  console.log('ブラウザでログインしてください...');
  console.log('ログイン完了後、Enterキーを押してください');

  await waitForUserInput();

  // 認証状態保存
  await context.storageState({ path: config.browser.storageStatePath });
  console.log('認証情報を保存しました');
}
```

**手動ログイン待機の実装**:
```javascript
function waitForUserInput() {
  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      resolve();
    });
  });
}
```

### 3.3 ネットワーク傍受

```javascript
function setupNetworkRecorder(page) {
  const records = new Map(); // screenId -> { requests: [], responses: [] }

  page.on('request', (request) => {
    const url = request.url();
    if (!url.includes('/api/')) return; // APIパスのみ記録

    const currentScreenId = getCurrentScreenId();
    if (!records.has(currentScreenId)) {
      records.set(currentScreenId, { requests: [], responses: [] });
    }

    records.get(currentScreenId).requests.push({
      method: request.method(),
      url: maskSensitiveData(url),
      headers: maskHeaders(request.headers()),
      postData: maskSensitiveData(request.postData())
    });
  });

  page.on('response', async (response) => {
    const url = response.url();
    if (!url.includes('/api/')) return;

    const currentScreenId = getCurrentScreenId();
    if (!records.has(currentScreenId)) {
      records.set(currentScreenId, { requests: [], responses: [] });
    }

    let body = null;
    try {
      body = maskSensitiveData(JSON.stringify(await response.json()));
    } catch (e) {
      body = '[non-JSON response]';
    }

    records.get(currentScreenId).responses.push({
      url: maskSensitiveData(url),
      status: response.status(),
      body: body
    });
  });

  return {
    getRecords: () => records,
    getScreenRecords: (screenId) => records.get(screenId) || { requests: [], responses: [] }
  };
}
```

### 3.4 機密データマスキング

マスキング対象:
- 認証トークン（Authorization ヘッダー）
- メールアドレス
- AWSアカウントID
- S3パス
- APIキー

```javascript
function maskSensitiveData(data) {
  if (!data) return data;
  let masked = String(data);
  // メールアドレス
  masked = masked.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '***@***.***');
  // Authorization ヘッダー値
  masked = masked.replace(/(Bearer\s+)[^\s"]+/gi, '$1[MASKED]');
  // AWSアカウントID (12桁数字)
  masked = masked.replace(/\b\d{12}\b/g, '************');
  // プロジェクト固有の機密パターンはここに追加
  return masked;
}

function maskHeaders(headers) {
  const masked = { ...headers };
  if (masked.authorization) masked.authorization = '[MASKED]';
  if (masked.cookie) masked.cookie = '[MASKED]';
  return masked;
}
```

### 3.5 画面キャプチャループ

```javascript
async function captureScreens(page, networkRecorder) {
  const captureData = {};
  let previousPath = null;

  for (let i = 0; i < config.screens.length; i++) {
    const screen = config.screens[i];

    // 認証前スクリーンショット済みの画面はスキップ
    if (screen.screenshotBeforeAuth) {
      previousPath = screen.path;
      continue;
    }

    console.log(`[${i + 1}/${config.screens.length}] ${screen.name} をキャプチャ中...`);

    // ★ 同一パス最適化: パスが前画面と同じならページ遷移をスキップ
    if (screen.path !== previousPath) {
      await page.goto(`${config.baseUrl}${screen.path}`);
      await page.waitForTimeout(config.wait.afterNavigation);
    }

    // afterNavigate アクション（タブクリック等）
    if (screen.afterNavigate) {
      await screen.afterNavigate(page);
    }

    // セレクター待機
    if (screen.waitForSelector) {
      try {
        await page.waitForSelector(screen.waitForSelector, { timeout: 10000 });
      } catch (e) {
        console.warn(`  ⚠ セレクター待機タイムアウト: ${screen.waitForSelector}`);
      }
    }

    // 追加待機
    if (screen.waitTime) {
      await page.waitForTimeout(screen.waitTime);
    }

    // スクリーンショット取得
    const screenshotPath = path.join(
      config.screenshotDir,
      `${String(i).padStart(2, '0')}-${screen.id}.png`
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // キャプチャデータ記録
    captureData[screen.id] = {
      screenshotFile: path.basename(screenshotPath),
      viewportSize: config.browser.viewport,
      actualSize: await page.evaluate(() => ({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
      })),
      url: page.url(),
      networkLogs: networkRecorder.getScreenRecords(screen.id)
    };

    previousPath = screen.path;
  }

  return captureData;
}
```

### 3.6 データ保存

```javascript
function saveCaptureData(captureData) {
  const outputData = {
    capturedAt: new Date().toISOString(),
    screens: captureData
  };
  fs.writeFileSync(config.dataFile, JSON.stringify(outputData, null, 2));
  console.log(`キャプチャデータを保存: ${config.dataFile}`);
}
```

---

## Phase 4: generate-doc.js 設計パターン

### 4.1 全体構造

```javascript
const config = require('./config');
const fs = require('fs');
const path = require('path');

function main() {
  const captureData = loadCaptureData();

  const sections = [
    generateHeader(),
    generateMermaidDiagram(),
    generateUrlListTable(),
    generateFeatureTable(),
    generateScreenApiMappingTable(),
    generateTransitionTable(),
    generateScreenDetails(captureData)
  ];

  const markdown = sections.join('\n\n');
  const outputPath = path.join(config.outputDir, 'screen-transition.md');
  fs.writeFileSync(outputPath, markdown);
  console.log(`ドキュメント生成完了: ${outputPath}`);
}
```

### 4.2 Mermaid 画面遷移図生成

```javascript
function generateMermaidDiagram() {
  let mermaid = '```mermaid\ngraph TD\n';

  // スタイル定義
  mermaid += '  classDef authPage fill:#e3f2fd,stroke:#1565c0,stroke-width:2px\n';
  mermaid += '  classDef normalPage fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px\n';
  mermaid += '  classDef adminPage fill:#fff3e0,stroke:#e65100,stroke-width:2px\n\n';

  // ノード定義
  const tabGroups = groupScreensByPath(config.screens);

  for (const [groupPath, screens] of Object.entries(tabGroups)) {
    if (screens.length > 1) {
      // タブグループはサブグラフ
      const groupName = screens[0].name.split(':')[0].trim();
      mermaid += `  subgraph ${groupName}\n`;
      for (const screen of screens) {
        mermaid += `    ${screen.id}["${screen.name}"]\n`;
      }
      mermaid += '  end\n\n';
    } else {
      mermaid += `  ${screens[0].id}["${screens[0].name}"]\n`;
    }
  }

  // スタイル適用
  for (const screen of config.screens) {
    if (screen.screenshotBeforeAuth) {
      mermaid += `  class ${screen.id} authPage\n`;
    } else if (screen.requiresAdmin) {
      mermaid += `  class ${screen.id} adminPage\n`;
    } else {
      mermaid += `  class ${screen.id} normalPage\n`;
    }
  }

  // 遷移矢印
  mermaid += '\n';
  for (const t of config.transitions) {
    mermaid += `  ${t.from} -->|"${t.trigger}"| ${t.to}\n`;
  }

  mermaid += '```';
  return `## 1. 画面遷移図\n\n${mermaid}`;
}

function groupScreensByPath(screens) {
  const groups = {};
  for (const screen of screens) {
    if (!groups[screen.path]) groups[screen.path] = [];
    groups[screen.path].push(screen);
  }
  return groups;
}
```

### 4.3 テーブル生成パターン

共通パターン: ヘッダー行 + 区切り行 + データ行

```javascript
function generateUrlListTable() {
  let md = '## 2. 画面URL一覧\n\n';
  md += '| No. | 画面名 | URLパス | 認証 | 管理者 | 説明 |\n';
  md += '|-----|--------|--------|------|--------|------|\n';

  config.screens.forEach((screen, i) => {
    const auth = screen.screenshotBeforeAuth ? '不要' : '必要';
    const admin = screen.requiresAdmin ? '必要' : '-';
    md += `| ${i + 1} | ${screen.name} | \`${screen.path}\` | ${auth} | ${admin} | ${screen.description} |\n`;
  });

  return md;
}
```

---

## Phase 5: generate-docx.js 設計パターン

> このセクションはdocx-jsライブラリのベストプラクティスを内包しており、外部スキルへの依存なく自己完結する。

### 5.1 依存関係

```javascript
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, HeadingLevel, AlignmentType, WidthType, BorderStyle,
  ShadingType, PageBreak, Header, Footer, PageNumber,
  LevelFormat, ExternalHyperlink, TableOfContents,
  VerticalAlign, UnderlineType
} = require('docx');
const fs = require('fs');
const path = require('path');
```

### 5.2 docx-js 必須ルール

以下のルールに従わないとファイル破損や描画崩れが発生するため、必ず遵守すること。

#### 絶対禁止事項
- `\n` での改行禁止 — 常に別々の `Paragraph` 要素を使う
- `PageBreak` 単体使用禁止 — 必ず `new Paragraph({ children: [new PageBreak()] })` の形式
- Unicodeバレット文字禁止 — 箇条書きは `LevelFormat.BULLET` 定数を使った `numbering` 設定で行う
- `ShadingType.SOLID` 禁止 — テーブルセルの背景色は必ず `ShadingType.CLEAR` を使う

#### 必須ルール
- **フォント**: `styles.default.document.run.font` でデフォルトフォントを設定（Arial推奨）
- **見出しスタイル**: 組み込みID（`"Heading1"`, `"Heading2"` 等）でオーバーライドし、`outlineLevel` を設定（TOCに必須）
- **テーブル幅**: `Table` の `columnWidths` 配列＋各 `TableCell` の `width` の両方を設定
- **テーブルボーダー**: `TableCell` 単位で設定（`Table` レベルではない）
- **テーブルmargin**: `Table` レベルで `margins` を設定（全セル共通）
- **画像**: `ImageRun` には必ず `type` パラメータを指定（`'png'`, `'jpg'` 等）
- **TOC**: `TableOfContents` 使用時、見出しは `HeadingLevel` のみ使用（カスタムスタイルと併用するとTOCが壊れる）
- **番号付きリスト**: 同じ `reference` = 番号継続、異なる `reference` = 番号リセット
- **単位**: DXA（1440 = 1インチ）、A4用紙 = 11906 x 16838 twips

#### スタイル設定例

```javascript
const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 24 } } }, // 12ptデフォルト
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal',
        run: { size: 56, bold: true, color: '000000', font: 'Arial' },
        paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.CENTER } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, color: '000000', font: 'Arial' },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, color: '000000', font: 'Arial' },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, color: '000000', font: 'Arial' },
        paragraph: { spacing: { before: 120, after: 120 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [{
      reference: 'bullet-list',
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: '\u2022',
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }]
  },
  // ... sections
});
```

#### ページ設定（ヘッダー・フッター・ページ番号）

```javascript
headers: {
  default: new Header({
    children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: 'ドキュメントタイトル', font: 'Arial', size: 18 })]
    })]
  })
},
footers: {
  default: new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: 'Page ', font: 'Arial', size: 18 }),
        new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18 }),
        new TextRun({ text: ' / ', font: 'Arial', size: 18 }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18 })
      ]
    })]
  })
}
```

### 5.3 Mermaid図のPNG変換

Mermaid記法を `.mmd` ファイルとして書き出し、CLI で PNG に変換する。

```javascript
const { execSync } = require('child_process');

function convertMermaidToPng(mermaidCode, outputPath) {
  const tempMmdPath = '/tmp/mermaid-diagram.mmd';
  fs.writeFileSync(tempMmdPath, mermaidCode);
  execSync(`npx --yes @mermaid-js/mermaid-cli -i ${tempMmdPath} -o ${outputPath}`);
}
```

> **注意**: `npx --yes @mermaid-js/mermaid-cli` を使用すること。`npx mmdc` は「too many arguments」エラーが発生する場合がある。

### 5.5 ドキュメント構造

```javascript
const doc = new Document({
  styles: { /* 5.2 のスタイル設定例を参照 */ },
  numbering: { /* 5.2 の箇条書き設定を参照 */ },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: { /* 5.2 のページ設定例を参照 */ },
      footers: { /* 5.2 のページ設定例を参照 */ },
      children: [
        // タイトルページ
        // 目次: new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-3' })
        // セクション 1〜6（各セクション間に PageBreak）
      ]
    }
  ]
});
```

### 5.6 テーブル構築ヘルパー

```javascript
function buildTable(headers, rows, columnWidths) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: columnWidths,
    rows: [
      // ヘッダー行
      new TableRow({
        tableHeader: true,
        children: headers.map((header, i) => new TableCell({
          width: { size: columnWidths[i], type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: '1565C0' },
          children: [new Paragraph({
            children: [new TextRun({ text: header, bold: true, color: 'FFFFFF', font: 'Arial' })]
          })]
        }))
      }),
      // データ行（交互背景色）
      ...rows.map((row, rowIndex) => new TableRow({
        children: row.map((cell, i) => new TableCell({
          width: { size: columnWidths[i], type: WidthType.DXA },
          shading: rowIndex % 2 === 1
            ? { type: ShadingType.CLEAR, fill: 'F5F5F5' }
            : undefined,
          children: [new Paragraph({
            children: [new TextRun({ text: String(cell), font: 'Arial', size: 20 })]
          })]
        }))
      }))
    ]
  });
}
```

### 5.7 画像埋め込み

```javascript
// CRITICAL: ImageRun には必ず type パラメータを指定すること
function embedImage(imagePath, widthPx, heightPx, maxWidthEmu = 5500000) {
  const imageBuffer = fs.readFileSync(imagePath);
  const aspectRatio = heightPx / widthPx;
  const width = Math.min(maxWidthEmu, widthPx * 9525);  // px to EMU
  const height = Math.round(width * aspectRatio);

  return new ImageRun({
    data: imageBuffer,
    transformation: { width: Math.round(width / 9525), height: Math.round(height / 9525) },
    type: 'png'  // 必須: 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'
  });
}
```

### 5.8 箇条書きリスト

```javascript
// CRITICAL: Unicodeバレット文字禁止。必ず numbering 設定を使う
// × new TextRun('• Item')         // Unicodeバレットは不正なリストになる
// ○ numbering 設定で正規Wordリストを生成
new Paragraph({
  numbering: { reference: 'bullet-list', level: 0 },
  children: [new TextRun({ text: '箇条書き項目', font: 'Arial', size: 20 })]
})
```

### 5.9 DOCX出力

```javascript
async function generateDocx(children) {
  const doc = new Document({ /* ... */ sections: [{ children }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
}
```
