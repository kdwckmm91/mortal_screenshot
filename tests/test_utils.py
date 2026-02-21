import os
from mortal_screenshot.utils import make_export_folder


def test_make_export_folder(tmp_path):
    base = tmp_path / "base"
    base.mkdir()
    out = make_export_folder(str(base), "suffix")
    assert os.path.isdir(out)
