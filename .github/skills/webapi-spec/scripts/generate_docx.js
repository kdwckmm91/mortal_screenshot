/**
 * WebAPI仕様書 Word (.docx) 生成テンプレートスクリプト
 *
 * このスクリプトはプロジェクト固有のエンドポイント情報を埋め込んで使用する汎用テンプレート。
 * 各 "TODO" コメントの箇所をプロジェクトに合わせてカスタマイズすること。
 *
 * 前提:
 *   npm install docx (ローカル) or npm install -g docx (グローバル)
 *
 * 使用方法:
 *   node generate_docx.js
 *
 * 出力:
 *   webapi-spec.docx（同ディレクトリ内）
 */

const fs = require("fs");
const path = require("path");
const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    Header,
    Footer,
    AlignmentType,
    HeadingLevel,
    BorderStyle,
    WidthType,
    ShadingType,
    VerticalAlign,
    LevelFormat,
    PageBreak,
    PageNumber,
} = require("docx");

// ===================================================================
// 共通定数（カラーテーマ・フォント・レイアウト）
// ===================================================================
const FONT = "Arial";
const FONT_CODE = "Consolas";
const COLOR_BLACK = "000000";
const COLOR_WHITE = "FFFFFF";
const COLOR_HEADER_BG = "2B579A";      // テーブルヘッダー行（濃青）
const COLOR_SECTION_BG = "D6E4F0";     // KVテーブルキー列（薄青）
const COLOR_CODE_BG = "F2F2F2";        // コードブロック背景（薄灰）
const COLOR_WARNING_BG = "FFF3CD";     // 警告ボックス背景（黄）
const COLOR_WARNING_TEXT = "856404";    // 警告ボックステキスト色

// Letter用紙 - 1インチマージン左右の利用可能幅（DXA）
const PAGE_WIDTH_DXA = 9360;

// テーブル罫線
const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" };
const cellBorders = {
    top: tableBorder,
    bottom: tableBorder,
    left: tableBorder,
    right: tableBorder,
};

// ===================================================================
// ヘルパー関数群
// ===================================================================

/**
 * テーブルヘッダーセル（濃色背景・白文字・中央揃え）
 */
function headerCell(text, widthDxa) {
    return new TableCell({
        borders: cellBorders,
        width: { size: widthDxa, type: WidthType.DXA },
        shading: { fill: COLOR_HEADER_BG, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text, bold: true, color: COLOR_WHITE, font: FONT, size: 20 }),
                ],
            }),
        ],
    });
}

/**
 * 通常テーブルセル
 * @param {string|Paragraph[]} text - セル内容（文字列 or Paragraph配列）
 * @param {number} widthDxa - セル幅（DXA）
 * @param {object} opts - オプション: center, code, bold, color, bg, size
 */
function cell(text, widthDxa, opts = {}) {
    const children = [];
    if (typeof text === "string") {
        children.push(
            new Paragraph({
                alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
                children: [
                    new TextRun({
                        text,
                        font: opts.code ? FONT_CODE : FONT,
                        size: opts.size || 20,
                        bold: !!opts.bold,
                        color: opts.color || COLOR_BLACK,
                    }),
                ],
            })
        );
    } else if (Array.isArray(text)) {
        text.forEach((t) => children.push(t));
    }
    return new TableCell({
        borders: cellBorders,
        width: { size: widthDxa, type: WidthType.DXA },
        shading: opts.bg ? { fill: opts.bg, type: ShadingType.CLEAR } : undefined,
        verticalAlign: VerticalAlign.CENTER,
        children,
    });
}

/**
 * コードブロック（Consolas・背景色付き）を Paragraph 配列で返す
 */
function codeBlock(code) {
    return code.split("\n").map(
        (line) =>
            new Paragraph({
                spacing: { before: 0, after: 0, line: 276 },
                children: [
                    new TextRun({ text: line || " ", font: FONT_CODE, size: 18, color: "333333" }),
                ],
                shading: { fill: COLOR_CODE_BG, type: ShadingType.CLEAR },
                indent: { left: 180 },
            })
    );
}

/**
 * セクション見出し
 */
function sectionTitle(text, level) {
    return new Paragraph({
        heading:
            level === 1
                ? HeadingLevel.HEADING_1
                : level === 2
                    ? HeadingLevel.HEADING_2
                    : HeadingLevel.HEADING_3,
        children: [new TextRun({ text })],
    });
}

/**
 * 空行スペーサー
 */
function spacer(before = 100) {
    return new Paragraph({ spacing: { before, after: 0 }, children: [] });
}

/**
 * 警告/注釈ボックス（黄色背景）
 */
function noteBox(text, bgColor = COLOR_WARNING_BG) {
    return new Paragraph({
        spacing: { before: 100, after: 100 },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        indent: { left: 360, right: 360 },
        children: [
            new TextRun({ text: "\u26a0 " + text, font: FONT, size: 20, color: COLOR_WARNING_TEXT }),
        ],
    });
}

/**
 * 2列キー値テーブル（システム概要等）
 * @param {Array<[string, string]>} rows - [キー, 値] の配列
 */
function kvTable(rows, col1Width = 2600, col2Width = PAGE_WIDTH_DXA - 2600) {
    return new Table({
        columnWidths: [col1Width, col2Width],
        rows: rows.map(
            ([k, v]) =>
                new TableRow({
                    children: [
                        cell(k, col1Width, { bold: true, bg: COLOR_SECTION_BG }),
                        cell(v, col2Width),
                    ],
                })
        ),
    });
}

/**
 * フィールド定義テーブル（リクエストボディ/レスポンス）
 * @param {string[]} cols - 列名配列
 * @param {string[][]} data - 行データ配列
 */
function fieldTable(cols, data) {
    const colCount = cols.length;
    const colW = Math.floor(PAGE_WIDTH_DXA / colCount);
    const colWidths = Array(colCount).fill(colW);
    colWidths[colCount - 1] = PAGE_WIDTH_DXA - colW * (colCount - 1);
    return new Table({
        columnWidths: colWidths,
        rows: [
            new TableRow({
                tableHeader: true,
                children: cols.map((c, i) => headerCell(c, colWidths[i])),
            }),
            ...data.map(
                (row) =>
                    new TableRow({
                        children: row.map((val, i) =>
                            cell(val, colWidths[i], { code: i === 0 })
                        ),
                    })
            ),
        ],
    });
}

/**
 * リクエスト概要テーブル
 */
function requestOverview(method, urlPath, auth, contentType, queryParams) {
    const rows = [
        ["\u30e1\u30bd\u30c3\u30c9", method],
        ["\u30d1\u30b9", urlPath],
        ["\u8a8d\u53ef", auth],
    ];
    if (contentType) rows.push(["Content-Type", contentType]);
    if (queryParams) rows.push(["\u30af\u30a8\u30ea\u30d1\u30e9\u30e1\u30fc\u30bf", queryParams]);
    return kvTable(rows);
}

/**
 * サンプルリクエスト＋レスポンスのセクション
 */
function sampleSection(title, curlCmd, responseJson) {
    const parts = [];
    parts.push(
        new Paragraph({
            spacing: { before: 160, after: 60 },
            children: [new TextRun({ text: title, bold: true, font: FONT, size: 22 })],
        })
    );
    if (curlCmd) {
        parts.push(
            new Paragraph({
                spacing: { before: 60, after: 20 },
                children: [new TextRun({ text: "\u30ea\u30af\u30a8\u30b9\u30c8:", bold: true, font: FONT, size: 20 })],
            })
        );
        parts.push(...codeBlock(curlCmd));
    }
    if (responseJson) {
        parts.push(
            new Paragraph({
                spacing: { before: 60, after: 20 },
                children: [new TextRun({ text: "\u30ec\u30b9\u30dd\u30f3\u30b9:", bold: true, font: FONT, size: 20 })],
            })
        );
        parts.push(...codeBlock(responseJson));
    }
    return parts;
}

// ===================================================================
// TODO: エンドポイント詳細セクションをここに実装
// ===================================================================
//
// 各エンドポイントを個別の関数として実装する。パターン:
//
//   function ep_GET_resources() {
//     const parts = [];
//     parts.push(sectionTitle("5.1 GET /api/v1/resources", 3));
//     parts.push(new Paragraph({ children: [new TextRun({ text: "概要: ...", font: FONT, size: 20 })] }));
//     parts.push(spacer());
//     parts.push(requestOverview("GET", "/api/v1/resources", "全認証ユーザー", null, "なし"));
//     parts.push(spacer());
//     parts.push(new Paragraph({ children: [new TextRun({ text: "レスポンス（200 OK）", bold: true, font: FONT, size: 22 })] }));
//     parts.push(fieldTable(
//       ["フィールド", "型", "説明"],
//       [["items", "Resource[]", "リソースリスト"], ["total", "integer", "総数"]]
//     ));
//     parts.push(spacer());
//     parts.push(...sampleSection("サンプルリクエスト",
//       `curl -X GET "{BASE_URL}/api/v1/resources" \\\n  -H "Authorization: Bearer {JWT_TOKEN}"`,
//       `{ "items": [...], "total": 10 }`
//     ));
//     return parts;
//   }

// ===================================================================
// TODO: 共通エラーテーブルをプロジェクトに合わせてカスタマイズ
// ===================================================================

function commonErrorsTable() {
    const colWidths = [1200, 2600, 5560];
    // TODO: プロジェクトのエラーコード体系に合わせて行を修正
    const errorRows = [
        ["400", "\u4e0d\u6b63\u306a\u30ea\u30af\u30a8\u30b9\u30c8", '{ "error": { "code": "BAD_REQUEST", "message": "...", "details": {} } }'],
        ["401", "\u8a8d\u8a3c\u30a8\u30e9\u30fc", '{ "message": "Unauthorized" }'],
        ["403", "\u8a8d\u53ef\u30a8\u30e9\u30fc\uff08\u6a29\u9650\u4e0d\u8db3\uff09", '{ "error": { "code": "FORBIDDEN", "message": "...", "details": {} } }'],
        ["404", "\u30ea\u30bd\u30fc\u30b9\u672a\u691c\u51fa", '{ "error": { "code": "NOT_FOUND", "message": "...", "details": {} } }'],
        ["409", "\u30ea\u30bd\u30fc\u30b9\u7af6\u5408", '{ "error": { "code": "CONFLICT", "message": "...", "details": {} } }'],
        ["422", "\u30d0\u30ea\u30c7\u30fc\u30b7\u30e7\u30f3\u30a8\u30e9\u30fc", '{ "detail": [{ "type": "...", "loc": [...], "msg": "..." }] }'],
        ["500", "\u5185\u90e8\u30b5\u30fc\u30d0\u30fc\u30a8\u30e9\u30fc", '{ "error": { "code": "INTERNAL_ERROR", "message": "...", "details": {} } }'],
    ];

    return new Table({
        columnWidths: colWidths,
        rows: [
            new TableRow({
                tableHeader: true,
                children: [
                    headerCell("\u30b3\u30fc\u30c9", colWidths[0]),
                    headerCell("\u610f\u5473", colWidths[1]),
                    headerCell("\u30ec\u30b9\u30dd\u30f3\u30b9\u30dc\u30c7\u30a3", colWidths[2]),
                ],
            }),
            ...errorRows.map(
                ([code, meaning, body]) =>
                    new TableRow({
                        children: [
                            cell(code, colWidths[0], { center: true, bold: true }),
                            cell(meaning, colWidths[1]),
                            cell(body, colWidths[2], { code: true, size: 16 }),
                        ],
                    })
            ),
        ],
    });
}

// ===================================================================
// TODO: URL一覧テーブルをプロジェクトに合わせてカスタマイズ
// ===================================================================

function urlListTable() {
    const colWidths = [600, 1100, 3200, 2160, 2300];
    const headers = ["No", "\u30e1\u30bd\u30c3\u30c9", "\u30d1\u30b9", "\u8a8d\u53ef", "\u533a\u5206"];

    // TODO: プロジェクトのエンドポイント一覧に置き換え
    const data = [
        // ["1", "GET", "/api/v1/resources", "全認証ユーザー", "既存機能"],
        // ["2", "POST", "/api/v1/resources", "Admin専用", "既存機能"],
        // ["3", "GET", "/api/v1/new-feature", "全認証ユーザー", "新規追加"],
    ];

    return new Table({
        columnWidths: colWidths,
        rows: [
            new TableRow({
                tableHeader: true,
                children: headers.map((h, i) => headerCell(h, colWidths[i])),
            }),
            ...data.map(
                (row) =>
                    new TableRow({
                        children: row.map((val, i) => {
                            const isNew = row[4] === "\u65b0\u898f\u8ffd\u52a0";
                            return cell(val, colWidths[i], {
                                center: i === 0 || i === 1,
                                code: i === 2,
                                bg: isNew && i === 4 ? COLOR_WARNING_BG : undefined,
                            });
                        }),
                    })
            ),
        ],
    });
}

// ===================================================================
// TODO: 付録をプロジェクトに合わせてカスタマイズ
// ===================================================================

function appendixChecklist() {
    const colWidths = [7360, 2000];
    // TODO: プロジェクト固有のチェック項目に調整
    const items = [
        "\u8a3a\u65ad\u5bfe\u8c61\u74b0\u5883\u306eURL\u8a18\u5165\u6e08\u307f",
        "\u8a3a\u65ad\u7528\u30c8\u30fc\u30af\u30f3\u53d6\u5f97\u6e08\u307f\uff08\u5404\u30ed\u30fc\u30eb\u5206\uff09",
        "\u958b\u767a\u4e2d\u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u306e\u5b9f\u88c5\u72b6\u6cc1\u78ba\u8a8d\u6e08\u307f",
    ];
    return [
        sectionTitle("\u4ed8\u9332A. \u8a3a\u65ad\u7528\u30c1\u30a7\u30c3\u30af\u30ea\u30b9\u30c8", 2),
        new Table({
            columnWidths: colWidths,
            rows: [
                new TableRow({
                    tableHeader: true,
                    children: [
                        headerCell("\u78ba\u8a8d\u9805\u76ee", colWidths[0]),
                        headerCell("\u72b6\u614b", colWidths[1]),
                    ],
                }),
                ...items.map(
                    (item) =>
                        new TableRow({
                            children: [cell(item, colWidths[0]), cell("\u2610", colWidths[1], { center: true })],
                        })
                ),
            ],
        }),
    ];
}

function appendixDiagnosticPerspectives() {
    const colWidths = [600, 2600, 6160];
    // TODO: プロジェクトのエンドポイント別診断観点に置き換え
    const rows = [
        // ["1", "GET /resources", "認証なしアクセス、情報漏えい"],
        // ["2", "POST /resources", "SQLインジェクション、バリデーション回避"],
    ];
    return [
        sectionTitle("\u4ed8\u9332B. \u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\u5225\u8a3a\u65ad\u89b3\u70b9", 2),
        new Table({
            columnWidths: colWidths,
            rows: [
                new TableRow({
                    tableHeader: true,
                    children: [
                        headerCell("No", colWidths[0]),
                        headerCell("\u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8", colWidths[1]),
                        headerCell("\u4e3b\u306a\u8a3a\u65ad\u89b3\u70b9", colWidths[2]),
                    ],
                }),
                ...rows.map(
                    ([no, ep, note]) =>
                        new TableRow({
                            children: [
                                cell(no, colWidths[0], { center: true }),
                                cell(ep, colWidths[1], { code: true }),
                                cell(note, colWidths[2]),
                            ],
                        })
                ),
            ],
        }),
    ];
}

// ===================================================================
// ドキュメント構築
// ===================================================================

async function main() {
    // TODO: プロジェクト固有の情報に置き換え
    const PROJECT_NAME = "MyProject";
    const DOC_TITLE = "\u8106\u5f31\u6027\u8a3a\u65ad WebAPI\u4ed5\u69d8\u66f8";
    const OUTPUT_FILENAME = "webapi-spec.docx";

    const doc = new Document({
        styles: {
            default: {
                document: { run: { font: FONT, size: 22 } },
            },
            paragraphStyles: [
                {
                    id: "Title", name: "Title", basedOn: "Normal",
                    run: { size: 52, bold: true, color: COLOR_BLACK, font: FONT },
                    paragraph: { spacing: { before: 0, after: 120 }, alignment: AlignmentType.CENTER },
                },
                {
                    id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                    run: { size: 32, bold: true, color: COLOR_HEADER_BG, font: FONT },
                    paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
                },
                {
                    id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                    run: { size: 28, bold: true, color: "333333", font: FONT },
                    paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 },
                },
                {
                    id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
                    run: { size: 24, bold: true, color: "444444", font: FONT },
                    paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 },
                },
            ],
        },
        sections: [
            {
                properties: {
                    page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
                },
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: `${PROJECT_NAME} ${DOC_TITLE}`,
                                        font: FONT, size: 18, color: "888888",
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: "Page ", font: FONT, size: 18, color: "888888" }),
                                    new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18, color: "888888" }),
                                    new TextRun({ text: " / ", font: FONT, size: 18, color: "888888" }),
                                    new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 18, color: "888888" }),
                                ],
                            }),
                        ],
                    }),
                },
                children: [
                    // ── 表紙 ──
                    spacer(2400),
                    new Paragraph({
                        heading: HeadingLevel.TITLE,
                        children: [new TextRun({ text: PROJECT_NAME })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 120, after: 600 },
                        children: [
                            new TextRun({ text: DOC_TITLE, font: FONT, size: 36, bold: true, color: "555555" }),
                        ],
                    }),
                    // TODO: 表紙メタ情報を調整
                    kvTable([
                        ["\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u30d0\u30fc\u30b8\u30e7\u30f3", "1.0"],
                        ["\u4f5c\u6210\u65e5", new Date().toISOString().slice(0, 10)],
                        ["\u5bfe\u8c61\u30b7\u30b9\u30c6\u30e0", "TODO: \u30b7\u30b9\u30c6\u30e0\u540d\u30fb\u6982\u8981"],
                        ["\u8a3a\u65ad\u5bfe\u8c61\u74b0\u5883", "TODO: STG\u74b0\u5883\u7b49"],
                        ["\u30d9\u30fc\u30b9URL", "{BASE_URL}"],
                        ["API\u30d7\u30ec\u30d5\u30a3\u30c3\u30af\u30b9", "TODO: /api/v1"],
                    ]),
                    spacer(400),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "本ドキュメントはWebAPI仕様書です。",
                                font: FONT, size: 20, color: "666666", italics: true,
                            }),
                        ],
                    }),

                    // ── 1. システム概要 ──
                    new Paragraph({ children: [new PageBreak()] }),
                    sectionTitle("1. \u30b7\u30b9\u30c6\u30e0\u6982\u8981", 1),
                    sectionTitle("1.1 \u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3\u69cb\u6210", 2),
                    // TODO: プロジェクトのアーキテクチャ情報に置き換え
                    kvTable([
                        ["\u30d5\u30ed\u30f3\u30c8\u30a8\u30f3\u30c9", "TODO"],
                        ["\u30d0\u30c3\u30af\u30a8\u30f3\u30c9API", "TODO"],
                        ["API Gateway", "TODO"],
                        ["\u8a8d\u8a3c\u57fa\u76e4", "TODO"],
                        ["\u30c7\u30fc\u30bf\u30b9\u30c8\u30a2", "TODO"],
                    ]),
                    spacer(),

                    sectionTitle("1.2 \u74b0\u5883\u60c5\u5831", 2),
                    // TODO: プロジェクトの環境情報に置き換え
                    kvTable([
                        ["\u8a3a\u65ad\u5bfe\u8c61\u74b0\u5883", "TODO"],
                        ["\u30d9\u30fc\u30b9URL", "{BASE_URL}"],
                        ["API\u30d7\u30ec\u30d5\u30a3\u30c3\u30af\u30b9", "TODO"],
                    ]),

                    // ── 2. 認証仕様 ──
                    new Paragraph({ children: [new PageBreak()] }),
                    sectionTitle("2. \u8a8d\u8a3c\u30fb\u8a8d\u53ef\u4ed5\u69d8", 1),
                    // TODO: プロジェクトの認証仕様を実装

                    // ── 3. 共通エラーレスポンス ──
                    new Paragraph({ children: [new PageBreak()] }),
                    sectionTitle("3. \u5171\u901a\u30a8\u30e9\u30fc\u30ec\u30b9\u30dd\u30f3\u30b9", 1),
                    commonErrorsTable(),

                    // ── 4. URL一覧 ──
                    new Paragraph({ children: [new PageBreak()] }),
                    sectionTitle("4. URL\u4e00\u89a7\uff08\u5168\u30a8\u30f3\u30c9\u30dd\u30a4\u30f3\u30c8\uff09", 1),
                    urlListTable(),

                    // ── 5〜N. API詳細仕様 ──
                    new Paragraph({ children: [new PageBreak()] }),
                    sectionTitle("5. API\u8a73\u7d30\u4ed5\u69d8", 1),
                    // TODO: 各エンドポイント関数を呼び出す
                    // ...ep_GET_resources(),
                    // new Paragraph({ children: [new PageBreak()] }),
                    // ...ep_POST_resources(),

                    // ── CORS ──
                    new Paragraph({ children: [new PageBreak()] }),
                    sectionTitle("6. CORS\u30dd\u30ea\u30b7\u30fc", 1),
                    // TODO: 環境別CORS設定

                    // ── レート制限 ──
                    spacer(300),
                    sectionTitle("7. \u30ec\u30fc\u30c8\u5236\u9650\u30fb\u5236\u7d04", 1),
                    // TODO: レート制限テーブル

                    // ── セキュリティヘッダー ──
                    spacer(300),
                    sectionTitle("8. \u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u95a2\u9023\u30d8\u30c3\u30c0\u30fc", 1),
                    // TODO: セキュリティヘッダーテーブル

                    // ── 付録 ──
                    new Paragraph({ children: [new PageBreak()] }),
                    ...appendixChecklist(),
                    spacer(400),
                    ...appendixDiagnosticPerspectives(),
                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    const outPath = path.join(__dirname, OUTPUT_FILENAME);
    fs.writeFileSync(outPath, buffer);
    console.log(`\u2705 Generated: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
    console.error("\u274c Error:", err);
    process.exit(1);
});
