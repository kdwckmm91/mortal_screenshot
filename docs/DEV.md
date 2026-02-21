# 開発者向けドキュメント


セットアップ:

任意の Python 実行環境で依存をインストールしてください（VS Code の選択したインタプリタを使う等）。

```bash
pip install -r requirements.txt
python -m playwright install
```

テスト実行:

```bash
pytest -q
```

開発方針:
- `mortal_screenshot/cli.py` をエントリポイントにして、処理は `screenshot.py` に集約します。
- 変更を加える際はテストを追加してください。
