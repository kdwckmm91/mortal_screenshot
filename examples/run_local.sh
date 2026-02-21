#!/usr/bin/env bash
set -euo pipefail

# ローカル実行サンプル
source .venv/bin/activate
python -m mortal_screenshot.cli --popup
