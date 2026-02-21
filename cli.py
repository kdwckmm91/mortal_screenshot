import argparse
import os
import tkinter as tk
from tkinter import simpledialog
try:
    # 通常パッケージとして実行される場合の相対インポート
    from .screenshot import capture_screenshots
    from .utils import make_export_folder, setup_logger
except Exception:
    # スクリプトを直接実行する場合に備えてフォールバック（デバッグ用）
    import sys
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from screenshot import capture_screenshots
    from utils import make_export_folder, setup_logger

logger = setup_logger(__name__)


def get_url_from_popup() -> str | None:
    """ポップアップでURLを入力してもらう（GUI）"""
    root = tk.Tk()
    root.withdraw()
    return simpledialog.askstring("URL入力", "キャプチャするURLを入力してください:")


def main():
    """CLI エントリポイント

    引数:
      --url: 直接指定する URL
      --out: 出力ベースフォルダ
      --headless: ヘッドレス実行
      --popup: ポップアップで URL を入力
    """
    parser = argparse.ArgumentParser(description="mortal_screenshot CLI")
    parser.add_argument("--url", help="キャプチャ対象のURL", required=False)
    parser.add_argument("--out", help="出力のベースフォルダ (デフォルト: package/screenshots)", default=None)
    parser.add_argument("--headless", action="store_true", help="ヘッドレスで実行する")
    parser.add_argument("--popup", action="store_true", help="--url 未指定時にポップアップで入力する")
    args = parser.parse_args()

    url = args.url
    if not url and args.popup:
        url = get_url_from_popup()
    if not url:
        logger.error("URL が指定されていません。--url か --popup を使用してください。")
        return

    url_suffix = url.split("/")[-1].split(".")[0]
    # デフォルトの出力先をパッケージ直下の screenshots フォルダにする
    base_out = args.out
    if not base_out:
        package_dir = os.path.dirname(__file__)
        base_out = os.path.join(package_dir, "screenshots")
    export_folder_path = make_export_folder(base_out, url_suffix)
    capture_screenshots(url, export_folder_path, headless=args.headless)


if __name__ == "__main__":
    main()
