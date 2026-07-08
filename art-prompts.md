# 圖片生成指令集（GPT / Midjourney 用）

> 用途：把遊戲內建的程序化 SVG 場景升級成像素風插圖。
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
16-bit pixel art, retro Japanese adventure game (ADV/visual novel) style,
clean flat colors, dark night-friendly palette with neon yellow-green (#D7FF00) accent,
a small tech conference venue building with a glowing neon sign, cozy and playful mood,
no text, no letters, no watermark, landscape 16:9
```

> 💡 建議：同一批圖盡量在同一個 session 內生成、沿用同一組 seed／風格參照，一致性最好。
> 尺寸建議 1104×576 或 1344×768（16:9），檔案壓成 WebP/PNG 各張 < 300KB 為佳。

---

## 一、場景圖（5 張）— `SCENE_IMAGES`

時間軸：iPlayground 在 7 月底，往回推 9 週從 5 月底開始（梅雨 → 初夏 → 盛夏 → 前夜 → 活動日）。

| key | 檔名建議 | Prompt（接在共用前綴後） |
|---|---|---|
| `rainy` | scene_rainy.png | Rainy season (tsuyu) in late May Taipei: gray-blue sky, soft rain streaks, hydrangea bushes, one organizer with a neon-yellow umbrella walking toward the venue, empty registration booth, melancholic but hopeful |
| `early` | scene_early.png | Early summer clearing sky in June: bright blue sky, white clouds, small sun, fresh green trees around the venue, a few attendees starting to gather near the entrance, optimistic mood |
| `mid` | scene_mid.png | Blazing midsummer July: deep blue sky, big golden sun, heat shimmer, cicadas vibe, lush trees, a lively crowd of small pixel people gathering in front of the venue, energetic |
| `eve` | scene_eve.png | The night before the event: purple-navy dusk sky, crescent moon, string lights hung across the venue entrance glowing warm yellow and neon green, staff silhouettes doing final setup, quiet anticipation |
| `day` | scene_day.png | Event day celebration: bright morning, confetti in the air, a big crowd of colorful pixel attendees streaming into the venue, neon banner glowing, triumphant festival mood |

## 二、行動結果圖（5 張）— `ACTION_IMAGES`

| key | 檔名建議 | Prompt（接在共用前綴後） |
|---|---|---|
| `promo` | act_promo.png | Ticket promotion scene: a giant neon-yellow megaphone, social media posts flying out as pixel cards, a glowing billboard of the conference, small pixel people noticing and walking toward it, dynamic diagonal composition |
| `announce` | act_announce.png | Agenda announcement: a large glowing schedule board being unveiled on a stage, spotlights, rows of speaker portrait cards lighting up one by one, audience silhouettes cheering below |
| `success` | end_success.png | Grand success ending: packed conference hall interior, 350 pixel attendees, confetti raining, speakers waving on stage under a glowing neon banner, golden hour light through windows, euphoric |
| `fail_gap` | end_fail_gap.png | Failure ending (empty agenda): a dark backstage with a blank schedule board full of question marks, one sad organizer sitting alone with a clipboard, single spotlight, muted colors |
| `fail_quiet` | end_fail_quiet.png | Failure ending (no audience): a huge conference hall with rows of empty chairs, one lone attendee clapping, organizer on stage forcing a smile, cold blue lighting, tragicomic |

## 三、事件圖（17 張，可選）— `EVENT_IMAGES`

> 這批是加分項，v1 沒有也完全能玩（事件走訊息窗文字敘事）。
> 有圖時建議做 460×240（約 23:12）橫幅小圖。填法：`EVENT_IMAGES = { typhoon: 'images/ev_typhoon.png', ... }`

| key | 事件 | Prompt（接在共用前綴後） |
|---|---|---|
| `quiet` | 風平浪靜 | A peaceful office desk with a cup of tea, checklist, and a small potted plant, calm sunny window |
| `sponsor` | 贊助商注資 | A briefcase opening with golden coins and a glowing contract, handshake between two pixel characters |
| `designate` | 指定邀請 | A hand picking one glowing speaker card from a fanned deck, target crosshair made of neon light |
| `cfp_cold` | CFP 冷清 | An empty mailbox with cobwebs and a tumbleweed, organizer staring at a zero-inbox screen |
| `self_submit` | 講者主動投稿 | A cheerful pixel character knocking on the venue door holding a glowing proposal envelope |
| `boost_share` | 大神轉發 | A giant smartphone showing a repost rocketing with neon arrows and heart icons everywhere |
| `earlybird` | 早鳥完售 | A flock of pixel early birds carrying golden tickets flying over a SOLD OUT booth |
| `viral` | 社群爆紅 | A post exploding into fireworks of likes and shares over a night city skyline |
| `rival` | 隔壁研討會同天 | Two conference buildings facing off across a street like a showdown, calendars showing the same date |
| `ticket_down` | 售票系統掛掉 | A server rack on fire with a panicked pixel engineer holding a fire extinguisher, error symbols floating |
| `drama` | 社群論戰 | Two groups of pixel characters arguing with speech-bubble lightning between them, popcorn spectator in front |
| `flu` | 流行性感冒 | Pixel characters with masks and thermometers under falling virus particles, tissue boxes |
| `typhoon` | 颱風警報 | A swirling typhoon spiral approaching a small island venue on a weather map, warning sirens glowing red |
| `refund` | 退票潮 | Tickets flying backwards out of a booth window into the night like escaping birds |
| `cancel` | 講者臨時取消 | A spotlight on an empty stage podium with a fallen microphone, a phone showing a cancellation message |
| `volunteer` | 志工大量報名 | A crowd of enthusiastic pixel volunteers in matching neon staff tees raising hands |
| `bento` | 便當廠商加菜 | A luxurious bento box opening with glowing food and sparkles, chopsticks raised in celebration |

## 四、其他可選

| 用途 | 檔名建議 | Prompt |
|---|---|---|
| 開場（委員會任命） | intro.png | A committee of pixel characters pointing at the surprised protagonist, "it's you" moment, meeting room with conference posters |
| 網站 OG 分享圖 | og.png | Game key visual: the venue at dusk with neon sign glowing, a wheel of speaker cards spinning above it, festival flags |

## 接圖 SOP

1. 生成 → 存到 `images/`（檔名照上表）
2. 打開 `index.html`，最上方 `/* 圖片接口 */` 區塊填路徑
3. 存檔重整就生效；`python3 update_data.py` 只動卡池資料，不會蓋掉你的路徑設定
4. commit 時記得把 `images/` 一起加進 git
