"""ページから捨て牌や牌姿を抜き出してテキストで保存するユーティリティ。"""
from typing import List
import os
from playwright.sync_api import Page
from .utils import setup_logger

logger = setup_logger(__name__)


def _gather_texts_from_selectors(page: Page, selectors: List[str]) -> List[str]:
    """複数セレクタを試して、見つかった要素のテキストを返す。"""
    texts: List[str] = []
    for sel in selectors:
        try:
            loc = page.locator(sel)
            if loc.count() == 0:
                continue
            for i in range(loc.count()):
                try:
                    t = loc.nth(i).inner_text()
                except Exception:
                    try:
                        t = loc.nth(i).get_attribute("data-tile") or ""
                    except Exception:
                        t = ""
                if t:
                    texts.append(t.strip())
        except Exception:
            continue
    return texts


def extract_round_info(page: Page) -> str:
    """ページからその局の捨て牌・牌姿情報を抽出して文字列で返す。

    戻り値は複数行のテキスト（人間が読める簡易フォーマット）です。
    DOM が変わる可能性があるため、複数候補のセレクタを試します。
    """
    parts: List[str] = []

    # 局の識別（ボタン等のテキスト）
    try:
        kyoku = page.locator("body > main > div > div.grid-main > div > button").inner_text()
        parts.append(f"局: {kyoku}")
    except Exception:
        pass

    # 捨て牌候補セレクタ群
    discard_selectors = [
        "#discard-bars > svg.discard-bars-svg > text",
        "#discard-bars text",
        ".discard .tile",
        ".discards .tile",
    ]
    discards = _gather_texts_from_selectors(page, discard_selectors)
    if discards:
        parts.append("捨て牌: " + ", ".join(discards))

    # 牌姿（手牌）候補セレクタ群
    hand_selectors = [
        ".hand .tile",
        "#hand .tile",
        ".tiles .tile",
        "body main div .hand-tile",
    ]
    hand = _gather_texts_from_selectors(page, hand_selectors)
    if hand:
        parts.append("手牌: " + ", ".join(hand))

    # AI判断などの補助情報
    ai_selectors = [
        "#discard-bars > svg.discard-bars-svg > text",  # 既に含むが再掲
    ]
    ai = _gather_texts_from_selectors(page, ai_selectors)
    if ai:
        parts.append("AI表示: " + ", ".join(ai))

    if not parts:
        return ""
    return "\n".join(parts)


def save_round_text(export_folder: str, file_name: str, text: str) -> None:
    os.makedirs(export_folder, exist_ok=True)
    path = os.path.join(export_folder, file_name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    logger.info("Round info saved: %s", path)
