from playwright.sync_api import sync_playwright
from datetime import datetime 
import os
import tkinter as tk
from tkinter import simpledialog

def get_url_from_popup() -> str | None:
    """
    ポップアップウィンドウを表示して、ユーザーからURLを取得します。
    """
    root = tk.Tk()
    root.withdraw()  # メインウィンドウを非表示にする
    url = simpledialog.askstring("URL入力", "キャプチャするURLを入力してください:")
    return url

def capture_screenshots(url: str, export_folder_path: str)-> None:
    """    Capture screenshots of a specific element before and after an operation.
    Args:
        url (str): The URL of the page to capture screenshots from.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url)
        page.set_viewport_size({"width": 1920, "height": 1080})
        # ページの主要な要素が表示されるのを待つ
        page.wait_for_selector("body > main > div > div.grid-main", state="visible")

        # 対象要素の取得とスクショ1枚目
        element = page.locator("body > main > div > div.grid-main")
        if not element.is_visible():
            print("Target element is not visible.")
            browser.close()
            return
        
        # 設定（#options）変更
        # 画面内の設定ボタンをクリック
        settings_button = page.locator("#options")
        if not settings_button.is_visible():
            print("Settings button is not visible.")
            browser.close()
            return
        settings_button.click()
        # ダイアログが表示されるのを待つ
        page.wait_for_timeout(500) # 500ミリ秒待機
        page.wait_for_selector("#options-modal > div", state="visible", timeout=5000)
        # 言語(#langSelect)のプルダウンから日本語を選択
        lang_select = page.locator("#langSelect")
        if not lang_select.is_visible():
            print("Language select dropdown is not visible.")
            browser.close()
            return
        #langSelect > option:nth-child(4)
        # プルダウンをクリックしてオプションを表示
        lang_select.click()
        # オプションを選択
        lang_select.select_option(value="ja")

        #　放銃率表示のボタン(#toggle-dealin-rate)をクリック
        toggle_dealin_rate_button = page.locator("#toggle-dealin-rate")
        if not toggle_dealin_rate_button.is_visible():
            print("Toggle dealin rate button is not visible.")
            browser.close()
            return
        toggle_dealin_rate_button.click()

        # ダイアログを閉じるボタン(#options-modal > div > div.options-header > button)を押す
        close_button = page.locator("#options-modal > div > div.options-header > button")
        if not close_button.is_visible():
            print("Close button in options modal is not visible.")
            browser.close()
            return
        close_button.click()
        # ダイアログが非表示になるまで待機
        page.wait_for_selector("#options-modal > div", state="hidden", timeout=5000)

        # 画面内の局確認ボタンの中身が"東1"であることを確認
        # 実際の要素=<button class="info-round">E1</button>
        if page.locator("body > main > div > div.grid-main > div > button").inner_text() != "東1":
            print("Not on the first round screen.")
            browser.close()

        # urlの末尾を取得
        url_suffix = url.split("/")[-1].split(".")[0]
        i = 1
        e1_chenged_detected = False
        kyoku_str = page.locator("body > main > div > div.grid-main > div > button").inner_text()
        while True:
            
            # 次のエラーボタンが押せる常態か確認し、押す
            if page.locator("#next-mismatch").is_visible():
                # クリック前にダイアログが開いていれば閉じる
                dialog = page.locator("body > dialog.modal.info-this-round-modal > button")
                if dialog.is_visible():
                    dialog.click()
                    page.wait_for_selector("body > dialog.modal.info-this-round-modal", state="hidden", timeout=5000)
                page.click("#next-mismatch")

            # １局終了時の画面が表示されたらバツボタンを押し、”次のエラー”を押す
            if page.locator("body > dialog.modal.info-this-round-modal > button").is_visible():
                page.click("body > dialog.modal.info-this-round-modal > button")
                page.click("#next-mismatch")

            if page.locator("body > main > div > div.grid-main > div > button").inner_text() != kyoku_str:
                i = 1
                # 局がE1から別の局に変わった場合、次にE1が来たときにループを抜けるためのフラグを立てる
                if page.locator("body > main > div > div.grid-main > div > button").inner_text() == "東1":
                    print("東1 has been detected again, exiting the loop.")
                    break
            kyoku_str = page.locator("body > main > div > div.grid-main > div > button").inner_text()

            # AI判断の表示前かを確認し、AI表示であればクリック
            locator = page.locator("#discard-bars > svg.discard-bars-svg > text")
            # クリック前にダイアログが開いていれば閉じる
            dialog = page.locator("body > dialog.modal.info-this-round-modal > button")
            if dialog.is_visible():
                dialog.click()
                # ダイアログが非表示になるまで待機
                page.wait_for_selector("body > dialog.modal.info-this-round-modal", state="hidden", timeout=5000)
            if not locator.is_visible():
                locator = page.locator("#discard-bars > svg.discard-bars-svg")
                locator.click()

            # スクリーンショットの保存 
            file_name = f"{url_suffix}_{kyoku_str}_{i}.png"
            file_path = os.path.join(export_folder_path, file_name)
            # クリック前にダイアログが開いていれば閉じる
            dialog = page.locator("body > dialog.modal.info-this-round-modal > button")
            if dialog.is_visible():
                dialog.click()
                page.wait_for_selector("body > dialog.modal.info-this-round-modal", state="hidden", timeout=5000)
            # スクリーンショットを撮る
            element.screenshot(path=file_path)
            print(f"Screenshot saved as: {file_path}")

            # 画面内をクリックしてAI判断を表示
            locator = page.locator("#discard-bars > svg.discard-bars-svg > text")
            # クリック前にダイアログが開いていれば閉じる
            dialog = page.locator("body > dialog.modal.info-this-round-modal > button")
            if dialog.is_visible():
                dialog.click()
                page.wait_for_selector("body > dialog.modal.info-this-round-modal", state="hidden", timeout=5000)
            if locator.is_visible():
                locator.click()

            # スクリーンショットの保存
            file_name = f"{url_suffix}_{kyoku_str}_{i}_AI.png"
            file_path = os.path.join(export_folder_path, file_name)
            box = element.bounding_box()
            if box:
                left_top_x = box["x"]
                left_top_y = box["y"]
            else:
                left_top_x = 0
                left_top_y = 0

            page.screenshot(
                path=file_path,
                clip={"x": left_top_x, "y": left_top_y, "width": 1200, "height": 735}
            )
            print(f"Screenshot saved as: {file_path}")

            i += 1

            # 画面内をクリックしてAI判断を非表示に
            # discard-bars > svg.discard-bars-svg
            dialog = page.locator("body > dialog.modal.info-this-round-modal > button")
            if dialog.is_visible():
                dialog.click()
                page.wait_for_selector("body > dialog.modal.info-this-round-modal", state="hidden", timeout=5000)
            page.click("#discard-bars > svg.discard-bars-svg")

        browser.close()

if __name__ == "__main__":
    url = get_url_from_popup()

    if not url:
        print("URLが入力されませんでした。終了します。")
    else:
        # スクリプト自身の場所を基準に保存先フォルダを決定
        script_dir = os.path.dirname(os.path.abspath(__file__))
        base_export_folder = os.path.join(script_dir, "screenshots")

        # URLの末尾と今日の日付を取得してフォルダ名を作成
        today_str = datetime.now().strftime("%Y%m%d")
        url_suffix = url.split("/")[-1].split(".")[0]
        folder_name = f"{today_str}_{url_suffix}"
        export_folder_path = os.path.join(base_export_folder, folder_name)
        
        # 保存先のフォルダを作成
        if not os.path.exists(export_folder_path):
            os.makedirs(export_folder_path)

        capture_screenshots(url, export_folder_path)
