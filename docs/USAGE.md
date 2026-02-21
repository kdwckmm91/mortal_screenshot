# 使い方

セットアップ手順（macOS / Linux）:

```bash
python -m venv .venv
source .venv/bin/activate
 任意の Python 環境（システム環境や VS Code の選択したインタプリタ）に依存パッケージをインストールしてください。
 
 ```bash
実行例:

```bash
python -m mortal_screenshot.cli --url "https://killerducky/your_result" --out ./screenshots --headless
# またはポップアップでURL入力
python -m mortal_screenshot.cli --popup
```

オプション:
- `--url`: キャプチャ対象の URL
トラブルシュート:
