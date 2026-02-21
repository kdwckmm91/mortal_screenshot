try:
    from playwright.sync_api import sync_playwright
except Exception as e:
    raise RuntimeError(
        "Playwright が見つかりません。この Python 環境に依存パッケージをインストールしてください。\n"
        "例: `python -m pip install -r requirements.txt` と `python -m playwright install` を実行してください。\n"
        f"詳細エラー: {e}"
    )
from datetime import datetime
import os
from typing import Optional
from .utils import setup_logger

logger = setup_logger(__name__)


def capture_screenshots(url: str, export_folder_path: str, headless: bool = True) -> None:
    """killerducky の結果画面からスクリーンショットを取得して保存する。

    これは元のスクリプトをリファクタリングし、パラメータ化したバージョンです。
    """
    with sync_playwright() as p:
        # ブラウザを起動（ヘッドレスの有無は引数で制御）
        browser = p.chromium.launch(headless=headless)
        try:
            page = browser.new_page()
            page.goto(url)
            page.set_viewport_size({"width": 1920, "height": 1080})

            # メイン要素が表示されるまで待機
            page.wait_for_selector("body > main > div > div.grid-main", state="visible", timeout=10000)
            element = page.locator("body > main > div > div.grid-main")
            if not element.is_visible():
                logger.error("対象要素が表示されていません。")
                return

            # 設定ダイアログを開き、言語や表示設定を変更する
            settings_button = page.locator("#options")
            if not settings_button.is_visible():
                logger.error("設定ボタンが見つかりません。")
                return
            settings_button.click()
            page.wait_for_timeout(500)
            page.wait_for_selector("#options-modal > div", state="visible", timeout=5000)

            # 言語を日本語に変更（可能なら）
            lang_select = page.locator("#langSelect")
            if lang_select.is_visible():
                try:
                    lang_select.click()
                    lang_select.select_option(value="ja")
                except Exception:
                    logger.info("言語を設定できませんでした。次に進みます。")

            # 放銃率表示の切替
            toggle_dealin_rate_button = page.locator("#toggle-dealin-rate")
            if toggle_dealin_rate_button.is_visible():
                toggle_dealin_rate_button.click()

            # ダイアログを閉じる
            close_button = page.locator("#options-modal > div > div.options-header > button")
            if close_button.is_visible():
                close_button.click()
                page.wait_for_selector("#options-modal > div", state="hidden", timeout=5000)

            # キャプチャのメインループ
            url_suffix = url.split("/")[-1].split(".")[0]
            i = 1
            kyoku_str = page.locator("body > main > div > div.grid-main > div > button").inner_text()
            while True:
                # "次のエラー" ボタンが押せる場合は押す
                try:
                    if page.locator("#next-mismatch").is_visible():
                        dialog = page.locator("body > dialog.modal.info-this-round-modal > button")
                        if dialog.is_visible():
                            dialog.click()
                            page.wait_for_selector("body > dialog.modal.info-this-round-modal", state="hidden", timeout=5000)
                        page.click("#next-mismatch")
                except Exception:
                    pass

                # 局終了モーダルが出ている場合に閉じて進める
                try:
                    if page.locator("body > dialog.modal.info-this-round-modal > button").is_visible():
                        page.click("body > dialog.modal.info-this-round-modal > button")
                        page.click("#next-mismatch")
                except Exception:
                    pass

                try:
                    current = page.locator("body > main > div > div.grid-main > div > button").inner_text()
                except Exception:
                    current = kyoku_str

                # 局が変わったらリセット、もし東1に戻ったら処理を終了
                if current != kyoku_str:
                    i = 1
                    if current == "東1":
                        logger.info("東1 が再検出されたためループを終了します。")
                        break
                kyoku_str = current

                # AI表示用の要素が見えない場合は代替要素をクリック
                try:
                    locator = page.locator("#discard-bars > svg.discard-bars-svg > text")
                    if not locator.is_visible():
                        fallback = page.locator("#discard-bars > svg.discard-bars-svg")
                        fallback.click()
                except Exception:
                    pass

                # 通常表示のスクリーンショット保存
                file_name = f"{url_suffix}_{kyoku_str}_{i}.png"
                file_path = os.path.join(export_folder_path, file_name)
                try:
                    element.screenshot(path=file_path)
                    logger.info("スクリーンショットを保存しました: %s", file_path)
                except Exception as e:
                    logger.error("スクリーンショット保存に失敗しました: %s", e)

                # AI表示をクリックして AI 表示付きのスクリーンショットを保存
                try:
                    locator_text = page.locator("#discard-bars > svg.discard-bars-svg > text")
                    if locator_text.is_visible():
                        locator_text.click()
                except Exception:
                    pass

                file_name = f"{url_suffix}_{kyoku_str}_{i}_AI.png"
                file_path = os.path.join(export_folder_path, file_name)
                box = element.bounding_box() or {"x": 0, "y": 0}
                try:
                    page.screenshot(path=file_path, clip={"x": box["x"], "y": box["y"], "width": 1200, "height": 735})
                    logger.info("スクリーンショットを保存しました: %s", file_path)
                except Exception as e:
                    logger.error("AI付きスクリーンショット保存に失敗しました: %s", e)

                i += 1

                # モーダルが出ていれば閉じて、AI表示を非表示にするクリック
                try:
                    dialog = page.locator("body > dialog.modal.info-this-round-modal > button")
                    if dialog.is_visible():
                        dialog.click()
                        page.wait_for_selector("body > dialog.modal.info-this-round-modal", state="hidden", timeout=5000)
                except Exception:
                    pass
                try:
                    page.click("#discard-bars > svg.discard-bars-svg")
                except Exception:
                    pass

        finally:
            try:
                browser.close()
            except Exception:
                pass
