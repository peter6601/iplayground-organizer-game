#!/usr/bin/env python3
"""把講者／工作人員照片鏡像到本機 images/speakers/、images/staff/ 並縮成 240px 頭像。

為什麼：raw.githubusercontent 對突發請求會限流（一次載 15 張必中），
且原圖動輒 4000px／數 MB，本機鏡像 + 縮圖一次解決載入失敗與速度問題。

用法：python3 mirror_photos.py
下載走 `gh api`（已登入的帳號有較高速率上限），縮圖用 macOS 內建 sips。
跑完再執行 update_data.py，卡池資料的 photo 會自動改指本機檔案。
"""
import json
import os
import pathlib
import subprocess
import tempfile
import urllib.parse
import urllib.request

BASE = "https://raw.githubusercontent.com/iplayground/SessionData/2026/v1/"
KNOWN_REFS = ["2026/v1", "2025/v1", "develop"]
SIZE = 240  # 卡面 104px、縮圖 52px，240 足夠 retina


def fetch_json(name):
    with urllib.request.urlopen(BASE + name) as resp:
        return json.load(resp)


def split_ref_path(url):
    """raw URL → (ref, repo 內路徑)。ref 可能含斜線，用已知清單比對。"""
    tail = url.split("SessionData/", 1)[1]
    for ref in KNOWN_REFS:
        if tail.startswith(ref + "/"):
            return ref, tail[len(ref) + 1:]
    ref, _, path = tail.partition("/")
    return ref, path


def local_name(path):
    """repo 路徑 → 本機檔名（副檔名一律轉 .jpg）。"""
    return pathlib.Path(path).stem + ".jpg"


def mirror(url, out_dir):
    if not url or "." not in url.rsplit("/", 1)[-1]:
        return None
    ref, path = split_ref_path(url)
    out = pathlib.Path(out_dir) / local_name(path)
    if out.exists():
        print(f"  skip（已存在）: {out.name}")
        return str(out)
    api = f"repos/iplayground/SessionData/contents/{urllib.parse.quote(path)}?ref={urllib.parse.quote(ref)}"
    with tempfile.NamedTemporaryFile(suffix=pathlib.Path(path).suffix, delete=False) as tmp:
        r = subprocess.run(["gh", "api", api, "-H", "Accept: application/vnd.github.raw"],
                           stdout=tmp, stderr=subprocess.PIPE)
    if r.returncode != 0:
        print(f"  ✗ 下載失敗: {path}（{r.stderr.decode()[:80]}）")
        os.unlink(tmp.name)
        return None
    s = subprocess.run(["sips", "-Z", str(SIZE), "-s", "format", "jpeg",
                        "-s", "formatOptions", "82", tmp.name, "--out", str(out)],
                       capture_output=True)
    os.unlink(tmp.name)
    if s.returncode != 0:
        print(f"  ✗ 縮圖失敗: {path}")
        return None
    print(f"  ✓ {out.name}（{out.stat().st_size // 1024}KB）")
    return str(out)


def main():
    os.makedirs("images/speakers", exist_ok=True)
    os.makedirs("images/staff", exist_ok=True)

    print("講者照片：")
    for p in fetch_json("speakers.json"):
        mirror(p.get("photo", ""), "images/speakers")

    print("工作人員照片：")
    for p in fetch_json("staffs.json"):
        mirror(p.get("photo", ""), "images/staff")

    print("完成。接著跑 python3 update_data.py 讓卡池改用本機照片。")


if __name__ == "__main__":
    main()
