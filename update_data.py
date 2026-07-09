#!/usr/bin/env python3
"""從 iPlayground SessionData 重抓議程 / 講者 / 工作人員資料，更新 index.html 內嵌卡池。

用法：python3 update_data.py
議程或名單有異動時跑一次即可。
卡型由議程時長判定（>=40min 為 SR、20min 為 R、5min 為 Lightning、workshop 天為 W），
原始 tags 收斂為 6 大遊戲分類，無 tag 講者由 MANUAL 表補指派。
"""
import json
import os
import re
import urllib.parse
import urllib.request

BASE = "https://raw.githubusercontent.com/iplayground/SessionData/2026/v1/"

# 原始 tag → 遊戲 6 大分類（ai / arch / uiux / swift / cross / product）
TAG_MAP = {
    'AI': 'ai', 'AI Agent': 'ai', 'AI agent': 'ai', 'Agent': 'ai', 'Agentic Coding': 'ai',
    'Agent Skill': 'ai', 'Agentic Workflow': 'ai', 'Coding Agent': 'ai', 'AI Coding': 'ai',
    'AI 自動化': 'ai', 'claude': 'ai', 'codex': 'ai', 'LLM': 'ai', 'llama.cpp': 'ai',
    'MLX': 'ai', 'Twinkle AI': 'ai', 'Apple Intelligence': 'ai', 'vibe coding': 'ai',
    'Vibe Coding': 'ai', 'SDD': 'ai', '規格驅動': 'ai', 'Gemini': 'ai',
    'Swift': 'swift', 'Swift Concurrency': 'swift', 'RxSwift': 'swift', 'async/await': 'swift',
    'AsyncSequence': 'swift', 'Combine': 'swift', 'Macro': 'swift', 'Compiler': 'swift',
    'Preview': 'swift', '函數式': 'swift',
    'SwiftUI': 'uiux', 'UI/UX': 'uiux', '無障礙': 'uiux', 'accessibility': 'uiux', 'ux': 'uiux',
    'assistive technology': 'uiux', '使用者體驗': 'uiux', 'User Experience': 'uiux',
    '架構': 'arch', '重構': 'arch', '模組化': 'arch', '軟體工程': 'arch', '可觀測性': 'arch',
    '開發工具': 'arch', 'Xcode': 'arch', 'Developer Productivity': 'arch',
    'Kotlin': 'cross', 'KMP': 'cross', 'CMP': 'cross', 'Multiplatform': 'cross',
    'Flutter': 'cross', '跨平台': 'cross', 'Android': 'cross', 'Apple Container': 'cross',
    '開源貢獻': 'cross', 'macOS': 'cross', 'CLI': 'cross', 'terminal': 'cross',
    '年齡驗證': 'cross', '數位憑證皮夾': 'cross', '零知識證明': 'cross',
    '獨立開發': 'product', '獵頭': 'product', '趨勢': 'product', 'App 經營': 'product',
    'Side Project': 'product', 'Product Discovery': 'product', 'Market Research': 'product',
    '開發經驗': 'product',
    '英文演講': None, 'iOS': None,  # 前者變 🌐 特質、後者太泛
}

# 無 tag 場次的手動分類（依講題內容指派）
MANUAL = {
    '劉信': ['product', 'uiux'],
    'Ethan': ['ai', 'product'],
    'Harry': ['ai', 'product'],
    'Kevin': ['ai', 'uiux'],
}
# 有 tag 但需補分類的（Hedula 的 AI 怪獸對戰遊戲只帶 Swift tag）
SUPPLEMENT = {'Hedula': ['ai']}


def fetch(name):
    try:
        with urllib.request.urlopen(BASE + name) as resp:
            return json.load(resp)
    except urllib.error.HTTPError:
        # raw.githubusercontent 被限流時改走已登入的 gh api
        import subprocess
        r = subprocess.run(
            ["gh", "api", f"repos/iplayground/SessionData/contents/{name}?ref=2026/v1",
             "-H", "Accept: application/vnd.github.raw"],
            capture_output=True, check=True)
        return json.loads(r.stdout)


def remote_photo(url):
    """percent-encode 過的原始遠端 URL（高清、不壓縮），供大卡使用；無照片回傳空字串。"""
    if not url or "." not in url.rsplit("/", 1)[-1]:
        return ""
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit((p.scheme, p.netloc, urllib.parse.quote(p.path), p.query, p.fragment))


def photo_url(url, kind="speakers"):
    """縮圖用：優先本機鏡像（images/speakers|staff/，跑 mirror_photos.py 產生），
    沒有鏡像才回傳遠端 URL；無照片回傳空字串。"""
    if not url or "." not in url.rsplit("/", 1)[-1]:
        return ""
    stem = url.rsplit("/", 1)[-1].rsplit(".", 1)[0]
    local = f"images/{kind}/{stem}.jpg"
    if os.path.exists(local):
        return local
    return remote_photo(url)


def duration_min(time_str):
    m = re.findall(r"(\d{2}):(\d{2})", time_str)
    if len(m) < 2:
        return None
    s = int(m[0][0]) * 60 + int(m[0][1])
    e = int(m[1][0]) * 60 + int(m[1][1])
    return e - s


def build_speakers():
    sch = fetch("schedule.json")
    sch_en = fetch("schedule_en.json")
    profiles = {p["name"]: p for p in fetch("speakers.json")}
    profiles_en = {p["id"]: p for p in fetch("speakers_en.json")}
    # 名稱別名（schedule 與 speakers 名字不一致時補這裡）
    if "彭成瑋 Ervis" in profiles:
        profiles["彭成瑋"] = profiles["彭成瑋 Ervis"]

    cards = {}
    for day, items in sch.items():
        en_items = sch_en.get(day, [])
        for i, it in enumerate(items):
            name = it.get("speaker", "").strip()
            if not name:
                continue
            en = en_items[i] if i < len(en_items) else {}
            dur = duration_min(it["time"])
            if day.startswith("workshop"):
                stype = "workshop"
            elif dur and dur <= 10:
                stype = "lightning"
            else:
                stype = "regular"
            cats, intl = set(), False
            for t in it.get("tags", []):
                c = TAG_MAP.get(t)
                if c:
                    cats.add(c)
                if t == "英文演講":
                    intl = True
            if not cats and name in MANUAL:
                cats = set(MANUAL[name])
            cats |= set(SUPPLEMENT.get(name, []))
            prof = profiles.get(name, {})
            prof_en = profiles_en.get(prof.get("id"), {})

            day_label = {"day1": "Day 1", "day2": "Day 2",
                         "workshop_day1": "WS Day 1", "workshop_day2": "WS Day 2"}.get(day, day)
            session = {"day": day_label, "time": it["time"],
                       "title": it["title"], "title_en": en.get("title", it["title"])}

            if name in cards:  # 雙棲講者（talk + workshop）
                c = cards[name]
                if stype not in c["types"]:
                    c["types"].append(stype)
                c["cats"] = sorted(set(c["cats"]) | cats)
                c["sessions"].append(session)
                continue
            rarity = ("SR" if (stype == "regular" and dur and dur >= 40)
                      else "R" if stype == "regular"
                      else "N" if stype == "lightning" else "W")
            cards[name] = {
                "name": prof.get("name", name),
                "name_en": prof_en.get("name", prof.get("name", name)),
                "rarity": rarity,
                "types": [stype],
                "cats": sorted(cats),
                "intl": intl,
                "title": prof.get("title", ""),
                "title_en": prof_en.get("title", prof.get("title", "")),
                "intro": prof.get("intro", ""),
                "intro_en": prof_en.get("intro", prof.get("intro", "")),
                "talk": it["title"],
                "talk_en": en.get("title", it["title"]),
                "sessions": [session],
                "photo": photo_url(prof.get("photo", "")),
                "photo_hd": remote_photo(prof.get("photo", "")),
            }
    return list(cards.values())


def build_staffs():
    return [{"name": s["name"], "photo": photo_url(s.get("photo", ""), kind="staff"),
             "photo_hd": remote_photo(s.get("photo", ""))} for s in fetch("staffs.json")]


def main():
    speakers = build_speakers()
    staffs = build_staffs()
    js = ("const SPEAKER_CARDS = " + json.dumps(speakers, ensure_ascii=False, separators=(",", ":"))
          + ";\nconst STAFF_CARDS = " + json.dumps(staffs, ensure_ascii=False, separators=(",", ":")) + ";")

    with open("index.html", encoding="utf-8") as f:
        html = f.read()
    new = re.sub(r"/\*__DATA_START__\*/.*?/\*__DATA_END__\*/",
                 "/*__DATA_START__*/\n" + js + "\n/*__DATA_END__*/", html, flags=re.S)
    if new == html:
        raise SystemExit("找不到資料 marker，index.html 未更新")
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(new)
    print(f"更新完成：{len(speakers)} 位講者、{len(staffs)} 位工作人員")


if __name__ == "__main__":
    main()
