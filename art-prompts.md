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

## 三之二、v1.2 新主事件圖（3 張）— `EVENT_IMAGES`

| key | 檔名建議 | Prompt（接在共用前綴後） |
|---|---|---|
| `apple_framework` | ev_apple_framework.png | A surprise midnight framework launch: a giant glowing keynote hologram lighting up the night sky over the city, developers on rooftops looking up from their laptops in awe, timelines exploding with notifications |
| `venue_change` | ev_venue_change.png | Venue hall renovation chaos: staff carrying boxes and cables out of a conference hall wrapped in construction holo-tape, a sad "under renovation" drone sign, organizer sighing with a floor plan hologram |
| `price_drama` | ev_price_drama.png | Online pricing debate: a giant holographic comment thread splitting a crowd into two glowing camps, angry and supportive emoji projectiles flying, one calm organizer typing a long reply in the middle |

（神秘講者來訪不需生圖——遊戲用講者照片剪影。）

## 三之三、v1.2 輕事件圖（19 張，選配）— `EVENT_IMAGES`

> 輕事件**沒圖也完全成立**（訊息窗快訊）；有圖則同主事件切換場景。
> 建議生成優先序：先做戲劇性高的（🎙 專訪影片、🐙 GitHub 當機、🥵 熱浪、🎤 偶像人潮），其餘隨緣。
> 檔名照 key：`lt_coffee.png` → 我壓縮接上。

| key | 事件 | Prompt（接在共用前綴後） |
|---|---|---|
| `lt_coffee` | 前總召喝咖啡 | Two organizers chatting in a cozy neon café at night, the senior one passing over glowing holographic notes with a knowing smile, steam rising from cyber-style coffee cups |
| `lt_nostalgia` | 老照片回憶殺 | A floating holographic photo album showing warm old conference memories, hands reaching toward the glowing vintage photos amid a dark cyber city |
| `lt_studygroup` | 講者自組讀書會 | Speakers gathered around a table piled with floating holo-books and slide projections, cozy late-night study vibes, warm lamp glow mixing with neon |
| `lt_uni_group` | 大學社團包團 | A cheerful group of university students with backpacks marching together at night, each holding a glowing ticket, campus gate behind them |
| `lt_threads_slides` | 講者曬投影片 | A speaker at a desk at midnight polishing a glowing slide deck hologram, social feed reaction icons floating up from a phone beside the keyboard |
| `lt_volunteer_fight` | 志工鬧不合 | Two volunteers arguing over a floor-plan hologram with sparks flying between their speech bubbles, a third mediator sweating between them |
| `lt_scam` | 假票券詐騙 | A shady hooded figure in a back alley offering glitching counterfeit holo-tickets, red warning icons flashing, wary passersby |
| `lt_interview_video` | 專訪影片上線 | A podcast interview studio with mics and cameras, a floating video player hologram with hearts and likes rising like bubbles |
| `lt_speaker_cue` | 講者互 cue | Two speakers in different corners of the city looking at their phones and grinning, connected by a single glowing thread of light across the skyline |
| `lt_company_tickets` | 公司包票 | An office team celebrating around a desk where a fan of glowing tickets is spread out, confetti and cheers in a neon-lit workspace |
| `lt_heatwave` | 熱浪來襲 | A melting-hot city street with visible heat shimmer, people wilting under neon parasols, a thermometer hologram spiking into the red |
| `lt_mrt` | 捷運新站開通 | A futuristic metro station gate opening in a burst of light, commuters streaming out toward a glowing conference venue in the distance |
| `lt_rain` | 午後雷陣雨 | A heavy summer downpour over neon streets, umbrellas glowing softly, rain reflections everywhere, calm and moody |
| `lt_fire_drill` | 消防安檢日 | Safety inspectors with clipboards and scanning drones sweeping a conference hall with red scan beams, staff standing by patiently |
| `lt_sunny` | 久違的放晴日 | A rare bright clear morning over the futuristic venue, people looking up and smiling, fresh sunlight mixing with soft neon accents |
| `lt_idol_crowd` | 偶像簽售人潮 | A massive queue with lightsticks outside the next-door exhibition hall, a few curious fans drifting toward the conference venue's glowing sign |
| `lt_github_down` | GitHub 大當機 | A giant glitching red error hologram looming over an office skyline while relaxed developers lean back happily scrolling their phones |
| `lt_apple_store` | 新品開賣排隊 | A glowing flagship tech store at dawn with a long orderly queue, a shiny product hologram rotating above the entrance |
| `lt_makeup_day` | 颱風假補班日 | Exhausted office workers on a gray drizzly morning commute, rain-slick streets, one flickering dim neon sign, collective sigh energy |

## 三之四、v1.3 深度專訪圖（1 張）— `INTERVIEW_FAIL_IMAGE`

> 深度專訪的 quiz show 背景沿用「猜猜樂 OG」那張（`quiz_og`，見下表四）——點講者開訪→整場問答顯示。
> **成功不另生圖**：⭐ 講者卡翻卡（＋規劃中的彩帶）就是獎勵；這裡只需一張「失敗＝講者婉拒」圖。
> 建議與 `quiz_og` 同一 seed／同構圖（舞台＋巨大問號＋A/B/C/D 面板），切換才順、失敗感才對比得出來。

| key | 檔名建議 | Prompt（接在共用前綴後） |
|---|---|---|
| `interview_fail` | interview_fail.png | Deep interview gone wrong on the same quiz-show stage: a speaker holo-figure politely raising one hand to decline and turning away with an awkward apologetic smile, the giant neon question mark above fizzling out into gray static, the four A/B/C/D answer panels going dark one by one, the lone host-organizer left under a cooling blue-gray spotlight holding a dimmed interview cue-card, deflated tragicomic mood |

## 四、其他可選

| 用途 | 檔名建議 | Prompt |
|---|---|---|
| 首頁滿版背景（`SCENE_IMAGES.title`） | scene_title.png | Title screen key art: the futuristic conference venue at night from a low dramatic angle, giant glowing neon signage, holographic light beams sweeping the sky, rain-slicked reflective plaza, awe-inspiring and inviting — leave the center area visually calm for UI text overlay |
| 開場（委員會任命） | intro.png | A committee of anime-style characters pointing at the surprised protagonist, "it's you" moment, futuristic meeting room with holographic conference posters |
| 網站 OG 分享圖 | og.png | Game key visual: the futuristic venue at dusk with neon signage glowing, a giant holographic wheel of speaker cards spinning above it, light beams and floating festival banners |
| 猜猜樂 OG（獨立遊戲用） | quiz_og.png | Quiz game key visual: a mysterious speaker silhouette standing under a spotlight with a giant glowing neon question mark above, four answer buttons floating around, playful game-show energy |

## 接圖 SOP

1. 生成 → 存到 `images/`（檔名照上表）
2. 打開 `index.html`，最上方 `/* 圖片接口 */` 區塊填路徑
3. 存檔重整就生效；`python3 update_data.py` 只動卡池資料，不會蓋掉你的路徑設定
4. commit 時記得把 `images/` 一起加進 git
