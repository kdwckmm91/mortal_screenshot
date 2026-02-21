import os
import logging
from datetime import datetime


def setup_logger(name: str = __name__):
    """ロガーをセットアップして返す。"""
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler()
        fmt = "%(asctime)s [%(levelname)s] %(message)s"
        handler.setFormatter(logging.Formatter(fmt))
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger


def make_export_folder(base_dir: str, url_suffix: str) -> str:
    """出力用フォルダを作成してパスを返す。

    フォルダ名は日付と URL サフィックスを組み合わせたものにする。
    """
    today_str = datetime.now().strftime("%Y%m%d")
    folder_name = f"{today_str}_{url_suffix}"
    export_folder_path = os.path.join(base_dir, folder_name)
    os.makedirs(export_folder_path, exist_ok=True)
    return export_folder_path
