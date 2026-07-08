# 圖片生成指令集（GPT / Midjourney 用）

> 用途：把遊戲內建的程序化 SVG 場景升級成日式賽博科技感插圖。
> 生成後把檔案丟進 `images/` 資料夾，然後到 `index.html` 最上方的
> `SCENE_IMAGES` / `ACTION_IMAGES` / `EVENT_IMAGES` 填入路徑即可，例如：
>
> ```js
> const SCENE_IMAGES = { rainy: 'images/scene_rainy.png', ... };
> ```
>
> 填了就自動取代內建 SVG，沒填的維持原樣——可以一張一張慢慢換。

## 共用風格前綴（每個 prompt 開頭都貼這段）

```
Japanese cyberpunk anime illustration, futuristic neo-Tokyo tech aesthetic,
sleek visual-novel background art style, clean sharp lines with subtle glow,
dark night palette accented by neon yellow-green (#D7FF00) holographic lights,
a futuristic tech conference venue with glowing holographic signage and floating UI panels,
cinematic lighting, stylish and playful sci-fi mood,
no text, no letters, no watermark, landscape 16:9
```

> 💡 建議：同一批圖盡量在同一個 session 內生成、沿用同一組 seed／風格參照，一致性最好。
> 尺寸建議 1104×576 或 1344×768（16:9），檔案壓成 WebP/PNG 各張 < 300KB 為佳。

---

## 一、場景圖（5 張）— `SCENE_IMAGES`

時間軸：iPlayground 在 7 月底，往回推 9 週從 5 月底開始（梅雨 → 初夏 → 盛夏 → 前夜 → 活動日）。

| key | 檔名建議 | Prompt（接在共用前綴後） |
|---|---|---|
| `rainy` | scene_rainy.png | Rainy season (tsuyu) in a futuristic Taipei: gray-blue sky, rain streaks catching neon reflections on wet chrome streets, holographic hydrangea ads flickering, one organizer with a glowing neon-yellow umbrella walking toward the venue, empty holographic registration kiosk, melancholic but hopeful |
| `early` | scene_early.png | Early summer clearing sky over the futuristic venue: bright blue sky with drifting clouds, sunlight glinting off glass-and-chrome architecture, holographic trees and floating signage booting up, a few attendees gathering near the entrance gates, optimistic mood |
| `mid` | scene_mid.png | Blazing midsummer: deep blue sky, giant golden sun, heat shimmer over neon-lit streets, cyber-cicada drones hovering, a lively crowd of stylish anime figures gathering in front of the venue, holographic countdown panels, energetic |
| `eve` | scene_eve.png | The night before the event: purple-navy dusk sky, crescent moon, strings of holographic lanterns glowing warm yellow and neon green across the venue entrance, staff silhouettes with AR visors doing final setup, drones carrying equipment, quiet anticipation |
| `day` | scene_day.png | Event day celebration: bright morning, holographic confetti raining from drones, a big crowd of colorful anime-style attendees streaming through glowing entrance gates, neon signage at full brightness, triumphant festival mood |

## 二、行動結果圖（5 張）— `ACTION_IMAGES`

| key | 檔名建議 | Prompt（接在共用前綴後） |
|---|---|---|
| `promo` | act_promo.png | Ticket promotion scene: a giant neon-yellow holographic megaphone projecting social media posts as glowing data cards into the sky, a massive digital billboard of the conference, passersby stopping to look up, dynamic diagonal composition |
| `announce` | act_announce.png | Agenda announcement: a huge holographic schedule board materializing above a stage, laser spotlights, rows of speaker portrait holo-cards lighting up one by one, audience silhouettes cheering below |
| `success` | end_success.png | Grand success ending: packed futuristic conference hall, hundreds of anime-style attendees, holographic confetti raining, speakers waving on stage under a blazing neon banner, warm golden light mixing with neon glow, euphoric |
| `fail_gap` | end_fail_gap.png | Failure ending (empty agenda): a dark backstage with a glitching blank schedule hologram full of question marks, one sad organizer sitting alone with a tablet, single cold spotlight, muted colors |
| `fail_quiet` | end_fail_quiet.png | Failure ending (no audience): a huge futuristic conference hall with rows of empty seats, one lone attendee clapping, organizer on stage forcing a smile, cold blue lighting, flickering half-dead neon sign, tragicomic |

## 三、事件圖（17 張，可選）— `EVENT_IMAGES`

> 這批是加分項，v1 沒有也完全能玩（事件走訊息窗文字敘事）。
> 有圖時建議做 460×240（約 23:12）橫幅小圖。填法：`EVENT_IMAGES = { typhoon: 'images/ev_typhoon.png', ... }`

| key | 事件 | Prompt（接在共用前綴後） |
|---|---|---|
| `quiet` | 風平浪靜 | A peaceful high-tech office desk with a steaming cup of tea, floating holographic checklist, and a small potted plant, calm morning light through a smart window |
| `sponsor` | 贊助商注資 | A sleek briefcase opening with glowing golden credit chips and a holographic contract, handshake between two anime-style characters |
| `designate` | 指定邀請 | A hand picking one glowing speaker holo-card from a fanned deck of translucent cards, neon target crosshair locking on |
| `cfp_cold` | CFP 冷清 | An empty holographic inbox flickering "0", digital cobwebs and a lone tumbleweed drone rolling past, organizer staring at the screen |
| `self_submit` | 講者主動投稿 | A cheerful anime-style character knocking on the venue's glass door holding a glowing proposal data-envelope |
| `boost_share` | 大神轉發 | A giant holographic phone showing a repost rocketing upward with neon arrows and heart icons bursting everywhere |
| `earlybird` | 早鳥完售 | A flock of glowing mechanical early birds carrying golden holo-tickets flying over a SOLD OUT kiosk |
| `viral` | 社群爆紅 | A social post exploding into fireworks of neon likes and shares over a cyberpunk city skyline at night |
| `rival` | 隔壁研討會同天 | Two futuristic conference towers facing off across a neon street like a showdown, giant holographic calendars showing the same date |
| `ticket_down` | 售票系統掛掉 | A server rack sparking with red error holograms, a panicked engineer holding a fire extinguisher, glitch effects everywhere |
| `drama` | 社群論戰 | Two groups of anime-style characters arguing with lightning-shaped holographic speech bubbles clashing between them, one spectator eating popcorn in front |
| `flu` | 流行性感冒 | Anime-style characters with masks and digital thermometers under falling glowing virus particles, health-alert holograms |
| `typhoon` | 颱風警報 | A swirling typhoon spiral approaching a glowing island venue on a giant holographic weather map, red warning sirens |
| `refund` | 退票潮 | Holographic tickets dissolving into pixels and flying backwards out of a kiosk window into the night |
| `cancel` | 講者臨時取消 | A cold spotlight on an empty stage podium with a fallen microphone, a floating phone hologram showing a cancellation message |
| `volunteer` | 志工大量報名 | A crowd of enthusiastic anime-style volunteers in matching neon staff tees raising hands, recruitment holograms overhead |
| `bento` | 便當廠商加菜 | A luxurious high-tech bento box opening with glowing gourmet food and steam-light effects, chopsticks raised in celebration |

## 四、其他可選

| 用途 | 檔名建議 | Prompt |
|---|---|---|
| 開場（委員會任命） | intro.png | A committee of anime-style characters pointing at the surprised protagonist, "it's you" moment, futuristic meeting room with holographic conference posters |
| 網站 OG 分享圖 | og.png | Game key visual: the futuristic venue at dusk with neon signage glowing, a giant holographic wheel of speaker cards spinning above it, light beams and floating festival banners |

## 接圖 SOP

1. 生成 → 存到 `images/`（檔名照上表）
2. 打開 `index.html`，最上方 `/* 圖片接口 */` 區塊填路徑
3. 存檔重整就生效；`python3 update_data.py` 只動卡池資料，不會蓋掉你的路徑設定
4. commit 時記得把 `images/` 一起加進 git
