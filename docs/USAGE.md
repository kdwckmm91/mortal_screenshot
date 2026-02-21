# 使い方

セットアップ手順（macOS / Linux）:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m playwright install
```

実行例:

```bash
python -m mortal_screenshot.cli --url "https://killerducky/your_result" --out ./screenshots --headless
# またはポップアップでURL入力
python -m mortal_screenshot.cli --popup
```

オプション:
- `--url`: キャプチャ対象の URL
- `--out`: 出力のベースフォルダ
- `--headless`: ヘッドレス実行 (GUIなし)
- `--popup`: ポップアップで URL を入力する

トラブルシュート:
- Playwright のブラウザがインストールされていない場合は `python -m playwright install` を実行してください。
