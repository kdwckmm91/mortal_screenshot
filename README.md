# mortal_screenshot

killerducky の麻雀結果画面を自動でキャプチャして保存するツールです。

このリポジトリでは `mortal_screenshot/` 配下をプロジェクトのルートとして扱います。

主な目的:
- killerducky の結果画面を自動的に巡回して、局ごとのスクリーンショット（通常表示・AI表示付き）を保存します。

目次
- [mortal\_screenshot](#mortal_screenshot)
  - [前提](#前提)
  - [インストール](#インストール)
  - [使い方](#使い方)
  - [出力とフォルダ構成](#出力とフォルダ構成)
  - [トラブルシュート](#トラブルシュート)
  - [開発とテスト](#開発とテスト)
  - [貢献方法](#貢献方法)


## 前提
- Python 3.10 以上を推奨
- Homebrew / apt 等で Python を用意しておくこと（macOS の場合は `brew install python`）


## インストール
リポジトリのルートが `mortal_screenshot/` である想定で手順を示します。

```bash
# 仮想環境の作成（推奨）
python -m venv .venv
source .venv/bin/activate

# 依存のインストール
pip install -r requirements.txt

# Playwright のブラウザをインストール
python -m playwright install
```

requirements.txt の内容例:

- playwright>=1.30.0,<2
- pytest>=7.0


## 使い方
CLI として実行する方法と、ポップアップで URL を入力する方法があります。

- 直接 URL を指定して実行（ヘッドレス）:

```bash
python -m mortal_screenshot.cli --url "https://example.com/your_result" --out ./screenshots --headless
```

- ポップアップで URL を入力:

```bash
python -m mortal_screenshot.cli --popup
```

主なオプション:
- `--url`: キャプチャ対象の URL
- `--out`: 出力のベースフォルダ（デフォルト: `./screenshots`）
- `--headless`: ヘッドレスブラウザで実行
- `--popup`: GUI ポップアップで URL を入力


## 出力とフォルダ構成
実行するとベースフォルダ（例: `./screenshots`）の下に日付と URL サフィックスを組み合わせたフォルダが作成されます。

例:

- `./screenshots/20260221_yoursite/` 配下に `yoursite_東1_1.png`, `yoursite_東1_1_AI.png` のようなファイルが保存されます。

スクリーンショットは局ごとに連番で保存され、AI 表示あり／なしで別ファイルになります。


## トラブルシュート
- Playwright のブラウザが足りないエラーが出る場合:
	- `python -m playwright install` を実行してください。
- ヘッドレスでなく画面表示で動作確認したい場合:
	- `--headless` を付けずに実行するか、`cli.py` の `--headless` オプションを使って切り替えてください。
- 要素が見つからない・セレクタが変わった場合:
	- サイトの DOM が変更されている可能性があります。`mortal_screenshot/screenshot.py` 内のセレクタを確認・更新してください。


## 開発とテスト
簡易テストは `pytest` を使います。

```bash
pytest -q
```

開発者向けドキュメント: `docs/DEV.md` を参照してください。


## 貢献方法
貢献ガイドは `CONTRIBUTING.md` を参照してください。Issue や PR を歓迎します。


---
ファイル: [mortal_screenshot/README.md](mortal_screenshot/README.md)
