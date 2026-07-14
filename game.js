
/* ═══════════ 圖片接口（方案 B：填入圖片路徑即取代內建 SVG，見 art-prompts.md） ═══════════ */
const SCENE_IMAGES = {
  rainy: 'images/scene_rainy.jpg',
  early: 'images/scene_early.jpg',
  mid:   'images/scene_mid.jpg',
  eve:   'images/scene_eve.jpg',
  day:   'images/scene_day.jpg',
  title: 'images/scene_title.jpg',
};
const ACTION_IMAGES = {
  promo:    'images/act_promo.jpg',
  announce: 'images/act_announce.jpg',
  success:  'images/end_success.jpg',
  fail_gap: 'images/end_fail_gap.jpg',
  fail_quiet: 'images/end_fail_quiet.jpg',
};
const INTRO_IMAGE = 'images/intro.jpg';   // 開場（委員會任命）
const INTERVIEW_IMAGE = 'images/quiz_og.jpg';   // 深度專訪：quiz show 場景背景（點講者開訪時跳出，整場問答期間顯示）
const INTERVIEW_FAIL_IMAGE = 'images/interview_fail.jpg';   // 深度專訪失敗（講者婉拒）；成功不另生圖＝⭐ 卡＋彩帶
const EVENT_IMAGES = {   // 事件敘事時場景切換成對應圖（key = 事件 id）
  quiet: 'images/ev_quiet.jpg', sponsor: 'images/ev_sponsor.jpg', designate: 'images/ev_designate.jpg',
  cfp_cold: 'images/ev_cfp_cold.jpg', self_submit: 'images/ev_self_submit.jpg', boost_share: 'images/ev_boost_share.jpg',
  earlybird: 'images/ev_earlybird.jpg', viral: 'images/ev_viral.jpg', rival: 'images/ev_rival.jpg',
  ticket_down: 'images/ev_ticket_down.jpg', drama: 'images/ev_drama.jpg', flu: 'images/ev_flu.jpg',
  typhoon: 'images/ev_typhoon.jpg', refund: 'images/ev_refund.jpg', volunteer: 'images/ev_volunteer.jpg',
  bento: 'images/ev_bento.jpg', cancel: 'images/ev_cancel.jpg',
  // v1.2 新主事件圖（DinDin GPT 生成，2026/07/14 到位）
  apple_framework: 'images/ev_apple_framework.jpg', venue_change: 'images/ev_venue_change.jpg', price_drama: 'images/ev_price_drama.jpg',
  // 神秘講者來訪：開場旁白封面圖（猜題階段仍用講者照片剪影）
  quiz_visit: 'images/ev_quiz_visit.jpg',
  // 輕事件圖（2026/07/14 改設計：19 張皆上圖，快訊時場景切換；缺圖仍走季節場景 fallback）
  lt_coffee: 'images/lt_coffee.jpg', lt_nostalgia: 'images/lt_nostalgia.jpg', lt_studygroup: 'images/lt_studygroup.jpg',
  lt_uni_group: 'images/lt_uni_group.jpg', lt_threads_slides: 'images/lt_threads_slides.jpg', lt_volunteer_fight: 'images/lt_volunteer_fight.jpg',
  lt_scam: 'images/lt_scam.jpg', lt_interview_video: 'images/lt_interview_video.jpg', lt_speaker_cue: 'images/lt_speaker_cue.jpg',
  lt_company_tickets: 'images/lt_company_tickets.jpg', lt_heatwave: 'images/lt_heatwave.jpg', lt_mrt: 'images/lt_mrt.jpg',
  lt_rain: 'images/lt_rain.jpg', lt_fire_drill: 'images/lt_fire_drill.jpg', lt_sunny: 'images/lt_sunny.jpg',
  lt_idol_crowd: 'images/lt_idol_crowd.jpg', lt_github_down: 'images/lt_github_down.jpg', lt_apple_store: 'images/lt_apple_store.jpg',
  lt_makeup_day: 'images/lt_makeup_day.jpg',
};

/* ═══════════ i18n ═══════════ */
let lang = localStorage.getItem('ipg_lang') || 'zh';
const L = (zh, en) => lang === 'zh' ? zh : en;

const CAT_LABELS = {
  ai:      { zh: '🤖 AI／Agent',      en: '🤖 AI / Agent' },
  arch:    { zh: '🏗 架構／工程',      en: '🏗 Architecture' },
  uiux:    { zh: '🎨 UI/UX／無障礙',   en: '🎨 UI/UX / A11y' },
  swift:   { zh: '🐦 Swift／底層',     en: '🐦 Swift / Internals' },
  cross:   { zh: '🔀 跨平台／系統',    en: '🔀 Cross-platform' },
  product: { zh: '💼 產品／職涯',      en: '💼 Product / Career' },
};
const CAT_KEYS = ['ai', 'arch', 'uiux', 'swift', 'cross', 'product'];
const catL = k => CAT_LABELS[k][lang] || CAT_LABELS[k].zh;

const TYPE_LABELS = {
  regular:   { zh: '一般講者', en: 'Regular Talk' },
  workshop:  { zh: 'Workshop', en: 'Workshop' },
  lightning: { zh: 'Lightning', en: 'Lightning' },
};
const typeL = t => TYPE_LABELS[t][lang];
/* 講者不分等級，數值只看類型（雙棲卡以一般講者計） */
function typeKey(c) { return c.types.includes('regular') ? 'R' : c.types.includes('workshop') ? 'W' : 'N'; }
function primaryType(c) { return c.types.includes('regular') ? 'regular' : c.types.includes('workshop') ? 'workshop' : 'lightning'; }
const typeBadges = c => c.types.map(t => typeL(t)).join(' + ');

/* 標籤色系：雙棲(黃) > Workshop(紫) > Lightning(藍) > 國際講者(橘) > 一般(無) */
function accentOf(c) {
  if (c.types.length > 1) return 'dual';
  if (c.types.includes('workshop')) return 'w';
  if (c.types.includes('lightning')) return 'lt';
  if (c.intl) return 'intl';
  return '';
}
const ACCENT_FILL = { dual: 'rgba(255,216,77,0.18)', w: 'rgba(192,132,252,0.16)', lt: 'rgba(125,211,252,0.15)', intl: 'rgba(255,158,69,0.15)' };
const ACCENT_INK  = { dual: '#FFD84D', w: '#C084FC', lt: '#7DD3FC', intl: '#FF9E45' };

const nm = c => (lang === 'en' && c.name_en) ? c.name_en : c.name;
const tk = c => (lang === 'en' && c.talk_en) ? c.talk_en : c.talk;
const tt = c => (lang === 'en' && c.title_en) ? c.title_en : c.title;

const REG_CAP = 350, REG_FAIL = 200, TOTAL_WEEKS = 9;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══════════ 遊戲狀態 ═══════════ */
let S;
function newGame() {
  S = {
    week: 1, ap: apBaseStart(), reg: 0,
    drawsThisWeek: 0, speakerDrawLimit: 3, freeDraws: 0,
    speakerPool: SPEAKER_CARDS.map((_, i) => i),
    staffPool: STAFF_CARDS.map((_, i) => i),
    roster: [],
    staff: [],
    promoBoost: false, promoHalved: false, promoHalvedNextWeek: false,
    forcedType: null, forcedReason: '',
    covBonusGiven: false,
    lastEventId: null,
    lastLightEventId: null,
    usedLightIds: [],
    interviewDone: false,
    over: false,
  };
}
function apBaseStart() { return localStorage.getItem('ipg_boost') === '1' ? 3 : 2; }

/* ═══════════ 工具 ═══════════ */
const $ = id => document.getElementById(id);
function d6() { return 1 + Math.floor(Math.random() * 6); }
function dice(n) { const r = []; for (let i = 0; i < n; i++) r.push(d6()); return r; }
function sum(a) { return a.reduce((x, y) => x + y, 0); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function clampReg() { S.reg = Math.max(0, S.reg); }   /* 上限開放：REG_CAP 只是滿員成就門檻 */
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const wait = ms => new Promise(r => setTimeout(r, reducedMotion ? 0 : ms));

function weeklyApBase() { return Math.min(5, apBaseStart() + Math.floor(S.staff.length / 3)) + (selfStaffRecruited() ? 1 : 0); }
function countType(t) { return S.roster.filter(r => SPEAKER_CARDS[r.idx].types.includes(t)).length; }
function regularCats() {
  const set = new Set();
  S.roster.forEach(r => { const c = SPEAKER_CARDS[r.idx]; if (c.types.includes('regular')) c.cats.forEach(x => set.add(x)); });
  return set;
}
function intlCount() { return S.roster.filter(r => SPEAKER_CARDS[r.idx].intl).length; }

/* 本人卡：玩家名字對到講者/工作人員時的彩蛋加成 */
const SELF_LUCK = 5; // 抽卡時本人卡的權重（其他卡為 1）
/* 拆名字為 token（空格／中點分隔，≥2 字才算，避免單字誤中） */
function nameTokens(s) {
  return String(s || '').toLowerCase().split(/[\s·・.,]+/).filter(t => t.length >= 2);
}
/* 玩家名字只要對到卡片名字的任一 token 即算本人（如「Rudrank」對到「Rudrank Riyam」） */
function isSelfName(name) {
  if (!playerName) return false;
  const pt = nameTokens(playerName), nt = nameTokens(name);
  if (!pt.length || !nt.length) return false;
  if (pt.join(' ') === nt.join(' ')) return true;
  return pt.some(t => nt.includes(t));
}
function isSelfSpeaker(c) { return isSelfName(c.name) || isSelfName(c.name_en); }
function selfStaffRecruited() { return S.staff.some(i => isSelfName(STAFF_CARDS[i].name)); }
function pickCard(pool, isSelf) {
  const w = pool.map(i => (isSelf(i) ? SELF_LUCK : 1));
  let t = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let k = 0; k < pool.length; k++) { t -= w[k]; if (t < 0) return pool[k]; }
  return pool[pool.length - 1];
}

function log(msg, cls) {
  const p = document.createElement('p');
  if (cls) p.className = cls;
  p.innerHTML = `<span class="wkb">W${S.week}</span>${msg}`;
  const el = $('log');
  el.prepend(p);
  while (el.children.length > 60) el.lastChild.remove();
}

/* ═══════════ 議程效應（公布後每週持續發酵） ═══════════ */
function d3() { return 1 + Math.floor(Math.random() * 3); }
const WEEKLY_BASE = { R: 2, W: 1, N: 0 };
const WEEKLY_RANGE = { R: '3~5', W: '2~4', N: '1~3' };
const WEEKLY_AVG = { R: 4, W: 3, N: 2 };
const INTERVIEW_BONUS = 2;   // v1.3 深度專訪升 ⭐：每週發酵固定 +2（吃陣容乘數）。過強→改 1；過弱→改 1d3+1
function weeklyRoll(card) { return WEEKLY_BASE[typeKey(card)] + d3(); }
function announceHint(card) {
  return L(`公布議程後：每週 +${WEEKLY_RANGE[typeKey(card)]} 報名，持續發酵到活動日`,
           `Once announced: +${WEEKLY_RANGE[typeKey(card)]} signups every week until showtime`);
}
function lineupMult() {
  const n = S.roster.filter(r => r.announced).length;
  let m = Math.min(1.3, 1 + 0.04 * Math.max(0, n - 1));
  if (S.covBonusGiven) m *= 1.2;
  return m;
}
function estimateWeekly() {
  const ann = S.roster.filter(r => r.announced);
  if (!ann.length) return 0;
  return Math.round(ann.reduce((s, r) => { const c = SPEAKER_CARDS[r.idx]; return s + (WEEKLY_AVG[typeKey(c)] + (r.interviewed ? INTERVIEW_BONUS : 0)) * (isSelfSpeaker(c) ? 2 : 1); }, 0) * lineupMult());
}
function agendaTick(label) {
  const ann = S.roster.filter(r => r.announced);
  if (!ann.length) return 0;
  const m = lineupMult();
  let raw = 0;
  ann.forEach(r => { const c = SPEAKER_CARDS[r.idx]; let v = weeklyRoll(c); if (r.interviewed) v += INTERVIEW_BONUS; if (isSelfSpeaker(c)) v *= 2; raw += v; r.contrib += v; });
  const gain = Math.round(raw * m);
  S.reg += gain; clampReg();
  log(L(`📈 ${label}：${ann.length} 位已公布講者持續發酵，報名 +${gain}（陣容乘數 ×${m.toFixed(2)}）`,
        `📈 ${label}: ${ann.length} announced speaker(s) keep working — +${gain} signups (lineup ×${m.toFixed(2)})`), 'good');
  return gain;
}

/* ═══════════ 場景（方案 A：程序化 SVG；SCENE_IMAGES 有值時換成圖片） ═══════════ */
function scenePhase() { return S.over ? 'day' : S.week <= 3 ? 'rainy' : S.week <= 6 ? 'early' : S.week <= 8 ? 'mid' : 'eve'; }

function crowdFigs(count, groundY) {
  let out = '';
  const colors = ['#F0997B', '#AFA9EC', '#5DCAA5', '#F4C0D1', '#FAC775', '#85B7EB'];
  for (let i = 0; i < count; i++) {
    const x = 30 + ((i * 53) % 400) + (i % 3) * 7;
    const y = groundY + 4 + (i % 3) * 9;
    const c = colors[i % colors.length];
    out += `<circle cx="${x}" cy="${y}" r="7" fill="${c}"/><rect x="${x - 5}" y="${y + 6}" width="10" height="15" rx="3" fill="${c}" opacity="0.75"/>`;
  }
  return out;
}
function venueSVG(dark) {
  const wall = dark ? '#3a3f4a' : '#D3D1C7', roof = dark ? '#262a33' : '#888780', door = dark ? '#171a20' : '#5F5E5A';
  return `<rect x="150" y="82" width="160" height="76" fill="${wall}"/>
    <polygon points="150,82 230,56 310,82" fill="${roof}"/>
    <rect x="205" y="122" width="50" height="36" fill="${door}"/>
    <rect x="165" y="98" width="130" height="18" fill="#D7FF00"/>
    <text x="230" y="111" text-anchor="middle" font-size="12" font-weight="700" fill="#26215C" font-family="sans-serif">iPlayground</text>`;
}
function sceneSVG(phase) {
  const crowd = crowdFigs(Math.min(14, Math.floor(S.reg / 25)), 168);
  if (phase === 'rainy') {
    let rain = '';
    for (let i = 0; i < 26; i++) rain += `<line x1="${(i * 37) % 460}" y1="${(i * 53) % 120}" x2="${(i * 37) % 460 - 5}" y2="${(i * 53) % 120 + 16}" stroke="#7DA4CC" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`;
    return `<svg viewBox="0 0 460 240" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="240" fill="#5E6E85"/>
      <ellipse cx="90" cy="36" rx="46" ry="16" fill="#8B99AD"/><ellipse cx="200" cy="26" rx="56" ry="18" fill="#7D8CA1"/><ellipse cx="370" cy="40" rx="50" ry="16" fill="#8B99AD"/>
      ${rain}<rect y="158" width="460" height="82" fill="#4F6B4A"/>${venueSVG(false)}${crowd}
      <circle cx="60" cy="200" r="12" fill="#7F77DD"/><rect x="52" y="208" width="16" height="20" rx="4" fill="#534AB7"/>
      <path d="M 40 190 Q 60 168 80 190" stroke="#D7FF00" stroke-width="3" fill="none"/></svg>`;
  }
  if (phase === 'early') {
    return `<svg viewBox="0 0 460 240" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="240" fill="#8FC1EA"/>
      <circle cx="395" cy="42" r="22" fill="#FFD34D"/>
      <ellipse cx="110" cy="40" rx="44" ry="15" fill="#F1EFE8"/><ellipse cx="250" cy="30" rx="36" ry="12" fill="#FFFFFF"/>
      <rect y="158" width="460" height="82" fill="#639922"/>${venueSVG(false)}${crowd}
      <ellipse cx="70" cy="150" rx="18" ry="24" fill="#3B6D11"/><rect x="66" y="164" width="8" height="18" fill="#712B13"/>
      <ellipse cx="410" cy="148" rx="20" ry="26" fill="#3B6D11"/><rect x="406" y="164" width="8" height="18" fill="#712B13"/></svg>`;
  }
  if (phase === 'mid') {
    return `<svg viewBox="0 0 460 240" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="240" fill="#4D9FE0"/>
      <circle cx="380" cy="46" r="30" fill="#FFC93C"/><circle cx="380" cy="46" r="38" fill="#FFC93C" opacity="0.3"/>
      <rect y="158" width="460" height="82" fill="#7AA82E"/>${venueSVG(false)}${crowd}
      <ellipse cx="66" cy="146" rx="20" ry="28" fill="#2F5E12"/><rect x="62" y="164" width="8" height="18" fill="#712B13"/>
      <text x="52" y="80" font-size="16" fill="#FFFFFF" opacity="0.85" font-family="sans-serif">〰</text>
      <text x="96" y="62" font-size="16" fill="#FFFFFF" opacity="0.7" font-family="sans-serif">〰</text></svg>`;
  }
  if (phase === 'eve') {
    let lights = '';
    for (let i = 0; i < 9; i++) lights += `<circle cx="${100 + i * 32}" cy="${64 + Math.sin(i) * 6}" r="4" fill="${i % 2 ? '#FFD34D' : '#D7FF00'}"/>`;
    return `<svg viewBox="0 0 460 240" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="240" fill="#2B2340"/>
      <rect width="460" height="90" fill="#4A3358"/><circle cx="70" cy="46" r="16" fill="#F1EFE8"/>
      <path d="M 96 66 Q 230 44 364 66" stroke="#555" stroke-width="2" fill="none"/>${lights}
      <rect y="158" width="460" height="82" fill="#22301E"/>${venueSVG(true)}${crowd}
      <rect x="180" y="164" width="100" height="8" rx="4" fill="#D7FF00" opacity="0.5"/></svg>`;
  }
  let confetti = '';
  for (let i = 0; i < 22; i++) confetti += `<rect x="${(i * 61) % 450}" y="${(i * 37) % 130}" width="6" height="3" rx="1" fill="${['#D7FF00', '#F0997B', '#85B7EB', '#F4C0D1'][i % 4]}" transform="rotate(${i * 33} ${(i * 61) % 450} ${(i * 37) % 130})"/>`;
  return `<svg viewBox="0 0 460 240" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="240" fill="#8FC1EA"/>
    <circle cx="395" cy="40" r="22" fill="#FFD34D"/>${confetti}
    <rect y="158" width="460" height="82" fill="#639922"/>${venueSVG(false)}
    ${crowdFigs(Math.min(20, Math.floor(S.reg / 18)), 164)}
    <rect x="150" y="60" width="160" height="16" rx="8" fill="#D7FF00"/>
    <text x="230" y="72" text-anchor="middle" font-size="11" font-weight="700" fill="#26215C" font-family="sans-serif">${L('活動日！', 'EVENT DAY!')}</text></svg>`;
}
let currentEventArt = null;   // 事件敘事期間覆蓋場景的事件圖 id
let sceneOverride = null;     // 直接注入 sceneArt 的原始 HTML（神秘講者剪影/點亮用）
function renderScene() {
  if (sceneOverride) {
    $('sceneArt').innerHTML = sceneOverride;
    return;
  }
  if (currentEventArt && EVENT_IMAGES[currentEventArt]) {
    $('sceneArt').innerHTML = `<img src="${EVENT_IMAGES[currentEventArt]}" alt="">`;
    return;
  }
  const phase = scenePhase();
  const img = SCENE_IMAGES[phase];
  $('sceneArt').innerHTML = img ? `<img src="${img}" alt="">` : sceneSVG(phase);
}
/* 首頁滿版背景：title key art → 前夜場景圖 → 內建 SVG */
function renderTitleBg() {
  const img = SCENE_IMAGES.title || SCENE_IMAGES.eve;
  if (img) {
    $('tBg').innerHTML = `<img src="${img}" alt="">`;
  } else {
    $('tBg').innerHTML = sceneSVG('eve').replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ');
  }
}

/* ═══════════ 訊息窗（打字機） ═══════════ */
let msgBusy = false, typing = false, awaitingAck = false, ackShown = 0;
let curFinish = null, ackResolve = null, typeTimer = null;

function say(text, opts = {}) {
  return new Promise(resolve => {
    msgBusy = true;
    if (typeof render === 'function') render();   // 訊息期間即時視覺鎖住行動列與側欄
    $('msgTag').textContent = opts.tag || '';
    $('msgChoices').innerHTML = '';
    $('msgAdv').style.display = 'none';
    const el = $('msgText');
    el.textContent = '';
    typing = true;
    let i = 0;
    clearInterval(typeTimer);
    const speed = reducedMotion ? 0 : 20;
    curFinish = finish;
    if (speed === 0) { finish(); } else {
      typeTimer = setInterval(() => {
        if (i >= text.length) { finish(); return; }
        el.textContent += text[i++];
      }, speed);
    }
    function finish() {
      clearInterval(typeTimer);
      typing = false;
      el.textContent = text;
      if (opts.choices && opts.choices.length) {
        opts.choices.forEach(ch => {
          const b = document.createElement('button');
          b.className = 'msg-btn' + (ch.ghost ? ' ghost' : '');
          b.textContent = ch.label;
          b.onclick = e => {
            e.stopPropagation();
            $('msgChoices').innerHTML = '';
            msgBusy = false;
            if (ch.run) ch.run();
            resolve();
            renderScene(); render();
          };
          $('msgChoices').appendChild(b);
        });
      } else if (opts.wait === false) {
        msgBusy = false; resolve(); render();
      } else {
        // 前幾次帶「點擊繼續」教學字樣，之後只留 ▼
        $('msgAdv').textContent = ackShown < 3 ? L('👆 點訊息欄繼續 ▼', '👆 tap message box ▼') : '▼';
        $('msgAdv').style.display = '';
        awaitingAck = true;
        ackResolve = () => {
          awaitingAck = false; ackShown++;
          $('msgAdv').style.display = 'none';
          msgBusy = false; resolve(); render();
        };
      }
    }
  });
}
$('msgwin').addEventListener('click', () => {
  if (typing && curFinish) { curFinish(); }
  else if (awaitingAck && ackResolve) { ackResolve(); }
});

/* ═══════════ 事件卡 ═══════════ */
const EVENTS = [
  { id: 'quiet', phase: 'any', icon: '🌤',
    name: { zh: '風平浪靜', en: 'Calm Week' },
    desc: { zh: '沒有大事發生的一週。專心籌備吧！', en: 'Nothing dramatic this week. Focus on the prep!' },
    apply() {} },
  { id: 'sponsor', phase: 'any', icon: '💰',
    name: { zh: '贊助商注資', en: 'Sponsor Boost' },
    desc: { zh: '贊助商臨時加碼！本週行動點 +2。', en: 'A sponsor chips in! +2 action points this week.' },
    apply() { S.ap += 2; log(L('💰 贊助商注資：本週行動點 +2', '💰 Sponsor boost: +2 AP this week'), 'good'); } },
  { id: 'designate', phase: 'any', icon: '🎯',
    name: { zh: '指定邀請', en: 'Targeted Invitation' },
    desc: { zh: '議程組人脈大爆發——你可以指定下一次抽講者的卡型！', en: 'Your program team pulls some strings — choose the type of your next speaker draw!' },
    choices: [
      { label: { zh: '🎤 一般講者', en: '🎤 Regular Talk' }, run() { setForced('regular', L('指定邀請', 'Targeted invitation')); } },
      { label: { zh: '🛠 Workshop', en: '🛠 Workshop' }, run() { setForced('workshop', L('指定邀請', 'Targeted invitation')); } },
      { label: { zh: '⚡ Lightning', en: '⚡ Lightning' }, run() { setForced('lightning', L('指定邀請', 'Targeted invitation')); } },
    ] },
  { id: 'cfp_cold', phase: 'early', icon: '😨',
    name: { zh: 'CFP 冷清', en: 'Quiet CFP' },
    desc: { zh: '這週投稿信箱靜悄悄……本週邀請講者上限 3 → 2。', en: 'The CFP inbox is silent... speaker invites capped at 2 this week.' },
    apply() { S.speakerDrawLimit = 2; log(L('😨 CFP 冷清：本週邀請上限 2 次', '😨 Quiet CFP: invite limit 2 this week'), 'bad'); } },
  { id: 'self_submit', phase: 'early', icon: '🙋‍♂️',
    name: { zh: '講者主動投稿', en: 'Surprise Submission' },
    desc: { zh: '有講者自己敲門！獲得一次免費抽講者（不佔上限、不花行動點）。', en: 'A speaker knocks on YOUR door! One free speaker draw (no AP, no limit).' },
    apply() { S.freeDraws += 1; log(L('🙋‍♂️ 講者主動投稿：免費抽講者 ×1', '🙋‍♂️ Surprise submission: free speaker draw ×1'), 'good'); } },
  { id: 'boost_share', phase: 'mid', icon: '📢',
    name: { zh: '大神轉發', en: 'Influencer Repost' },
    desc: { zh: '圈內大神轉發了你的貼文——下一次宣傳效果 ×2！', en: 'A community legend reposts you — next promo counts double!' },
    apply() { S.promoBoost = true; log(L('📢 大神轉發：下次宣傳 ×2', '📢 Influencer repost: next promo ×2'), 'good'); } },
  { id: 'earlybird', phase: 'mid', icon: '🐦',
    name: { zh: '早鳥完售', en: 'Early Birds Sold Out' },
    desc: { zh: '早鳥票完售，話題發酵！', en: 'Early-bird tickets are gone — the buzz is real!' },
    apply() { const d = dice(3); S.reg += sum(d); clampReg(); log(L(`🐦 早鳥完售：報名 +${sum(d)}（3d6）`, `🐦 Early birds sold out: +${sum(d)} signups (3d6)`), 'good'); } },
  { id: 'viral', phase: 'mid', icon: '🔥',
    name: { zh: '社群爆紅', en: 'Gone Viral' },
    desc: { zh: '你的宣傳貼文被瘋轉！', en: 'Your promo post blows up!' },
    apply() { const d = dice(2); S.reg += sum(d); clampReg(); log(L(`🔥 社群爆紅：報名 +${sum(d)}（2d6）`, `🔥 Gone viral: +${sum(d)} signups (2d6)`), 'good'); } },
  { id: 'rival', phase: 'mid', icon: '🥊',
    name: { zh: '隔壁研討會同天', en: 'Rival Conference' },
    desc: { zh: '另一場研討會宣布跟你同一天……本週宣傳效果減半。', en: 'Another conference lands on the same date... promos halved this week.' },
    apply() { S.promoHalved = true; log(L('🥊 撞檔：本週宣傳效果減半', '🥊 Rival conference: promos halved this week'), 'bad'); } },
  { id: 'ticket_down', phase: 'mid', icon: '💥',
    name: { zh: '售票系統掛掉', en: 'Ticketing Outage' },
    desc: { zh: '搶修一整天……本週行動點 −1。', en: 'A full day of firefighting... −1 AP this week.' },
    apply() { S.ap = Math.max(0, S.ap - 1); log(L('💥 售票系統掛掉：本週行動點 −1', '💥 Ticketing outage: −1 AP this week'), 'bad'); } },
  { id: 'drama', phase: 'mid', icon: '⚡',
    name: { zh: '社群論戰', en: 'Community Drama' },
    desc: { zh: 'iOS 圈吵起來了，話題正熱。要蹭這波流量嗎？', en: 'The iOS community is on fire. Ride the wave?' },
    choices: [
      { label: { zh: '🔥 蹭！（+2d6，下週宣傳減半）', en: '🔥 Ride it! (+2d6, promos halved next week)' },
        run() { const d = dice(2); S.reg += sum(d); clampReg(); S.promoHalvedNextWeek = true; log(L(`⚡ 蹭上論戰：報名 +${sum(d)}，但下週宣傳減半`, `⚡ Rode the drama: +${sum(d)} signups, promos halved next week`), 'good'); } },
      { label: { zh: '🧘 保持中立', en: '🧘 Stay neutral' }, ghost: true,
        run() { log(L('🧘 社群論戰：選擇保持中立', '🧘 Community drama: stayed neutral')); } },
    ] },
  { id: 'flu', phase: 'late', icon: '🤧',
    name: { zh: '流行性感冒', en: 'Flu Season' },
    desc: { zh: '流感大流行，一波退票……', en: 'Flu season hits — a wave of refunds...' },
    apply() { const d = dice(2); S.reg -= sum(d); clampReg(); log(L(`🤧 流感：報名 −${sum(d)}（2d6）`, `🤧 Flu: −${sum(d)} signups (2d6)`), 'bad'); } },
  { id: 'typhoon', phase: 'late', icon: '🌀',
    name: { zh: '颱風警報', en: 'Typhoon Warning' },
    desc: { zh: '颱風生成中，路徑直指活動日……', en: 'A typhoon is forming, headed straight for the event...' },
    apply() { const n = S.week >= 9 ? 4 : 2; const d = dice(n); S.reg -= sum(d); clampReg(); log(L(`🌀 颱風警報：報名 −${sum(d)}（${n}d6）`, `🌀 Typhoon: −${sum(d)} signups (${n}d6)`), 'bad'); } },
  { id: 'refund', phase: 'late', icon: '🎫',
    name: { zh: '退票潮', en: 'Refund Wave' },
    desc: { zh: '不明原因的一小波退票。', en: 'A small mysterious wave of refunds.' },
    apply() { const d = dice(1); S.reg -= sum(d); clampReg(); log(L(`🎫 退票潮：報名 −${sum(d)}`, `🎫 Refunds: −${sum(d)} signups`), 'bad'); } },
  { id: 'volunteer', phase: 'late', icon: '💪',
    name: { zh: '志工大量報名', en: 'Volunteer Surge' },
    desc: { zh: '社群夥伴來支援——免費獲得一位工作人員！', en: 'The community shows up — gain a free staff member!' },
    apply() {
      if (S.staffPool.length) {
        const i = S.staffPool.splice(Math.floor(Math.random() * S.staffPool.length), 1)[0];
        S.staff.push(i);
        log(L(`💪 志工支援：${esc(STAFF_CARDS[i].name)} 加入（工作人員 ${S.staff.length} 位）`, `💪 Volunteer surge: ${esc(STAFF_CARDS[i].name)} joins (${S.staff.length} staff)`), 'good');
      } else { S.reg += 5; clampReg(); log(L('💪 志工支援：人手已滿，改幫忙發傳單（報名 +5）', '💪 Volunteers: crew is full, they hand out flyers instead (+5 signups)'), 'good'); }
    } },
  { id: 'bento', phase: 'late', icon: '🍱',
    name: { zh: '便當廠商加菜', en: 'Bento Upgrade' },
    desc: { zh: '口碑小加分！', en: 'Word of mouth gets tastier!' },
    apply() { const d = dice(1); S.reg += sum(d); clampReg(); log(L(`🍱 便當加菜：報名 +${sum(d)}`, `🍱 Bento upgrade: +${sum(d)} signups`), 'good'); } },
  { id: 'cancel', phase: 'late', icon: '😱', cond: () => S.roster.length > 0,
    name: { zh: '講者臨時取消', en: 'Speaker Cancellation' },
    desc: { zh: '', en: '' }, apply() {} },
  /* ── v1.2 新主事件 ── */
  { id: 'quiz_visit', phase: 'any', kind: 'good', icon: '🎭', weight: 3, cond: () => S.speakerPool.length > 0,
    name: { zh: '神秘講者來訪', en: 'A Mystery Speaker Drops By' },
    desc: { zh: '有位講者路過會場，想看看你這個總召夠不夠了解社群……猜出他是誰，他就答應站台！',
            en: "A speaker drops by to size you up — guess who they are, and they'll join your lineup!" } },
  { id: 'apple_framework', phase: 'any', kind: 'good', icon: '🍏',
    name: { zh: 'Apple 突然發表新框架', en: 'Apple Ships a Surprise Framework' },
    desc: { zh: 'Apple 半夜丟出新框架，時間線全在討論——趁這波！', en: 'Apple ships a surprise framework overnight — ride the hype!' },
    apply() { S.promoBoost = true; log(L('🍏 新框架話題延燒：下次宣傳 ×2', '🍏 Framework hype: next promo ×2'), 'good'); } },
  { id: 'venue_change', phase: ['early', 'mid'], kind: 'bad', icon: '🏗',
    name: { zh: '場地方通知換廳', en: 'The Venue Reassigns Your Hall' },
    desc: { zh: '場地方：「不好意思，你們那廳要整修……」全員搬家中。', en: "Venue: 'So... your hall needs renovation.' Everyone's moving boxes." },
    apply() { S.ap = Math.max(0, S.ap - 1); log(L('🏗 換廳搬家：本週行動點 −1', '🏗 Hall reassigned: −1 AP this week'), 'bad'); } },
  { id: 'price_drama', phase: 'mid', kind: 'neutral', icon: '💸',
    name: { zh: '網友批評票價', en: 'Netizens Slam the Ticket Price' },
    desc: { zh: '有網友發文：「這票價是在收什麼？」底下吵起來了。', en: 'Someone posts: "What am I even paying for?" — the replies erupt.' },
    choices: () => {
      const arr = [];
      if (S.ap >= 1) arr.push({ label: { zh: '💬 花 1 AP 誠懇長文回應', en: '💬 Spend 1 AP on a heartfelt reply' },
        run() { S.ap = Math.max(0, S.ap - 1); const d = dice(1); S.reg += sum(d); clampReg();
          log(L(`💬 誠懇回應化解疑慮：報名 +${sum(d)}`, `💬 A sincere reply wins them over: +${sum(d)} signups`), 'good'); } });
      arr.push({ label: { zh: '🙈 已讀不回', en: '🙈 Leave it on read' }, ghost: true,
        run() { const d = dice(1); S.reg -= sum(d); clampReg();
          log(L(`🙈 已讀不回，風波發酵：報名 −${sum(d)}`, `🙈 Left on read, the drama festers: −${sum(d)} signups`), 'bad'); } });
      return arr;
    } },
];

/* ═══════════ v1.2 輕事件（快訊軌）——一句話、無選項、效果 ≤ ±2d6 或 ±1 AP ═══════════ */
const LIGHT_EVENTS = [
  // ── 人文 ──
  { id: 'lt_coffee', phase: 'any', kind: 'good', text: { zh: '☕ 前總召約你喝咖啡，傳授了幾招。', en: '☕ A former Chief buys you coffee and drops a few tricks.' },
    apply() { S.ap += 1; log(L('☕ 前總召傳授心法：本週行動點 +1', '☕ Wisdom from a former Chief: +1 AP this week'), 'good'); } },
  { id: 'lt_nostalgia', phase: 'early', kind: 'good', text: { zh: '📸 有人翻出第一屆 iPlayground 老照片，回憶殺瘋傳。', en: '📸 Someone digs up first-ever iPlayground photos — the nostalgia goes viral.' },
    apply() { const d = dice(2); S.reg += sum(d); clampReg(); log(L(`📸 回憶殺瘋傳：報名 +${sum(d)}`, `📸 Nostalgia goes viral: +${sum(d)} signups`), 'good'); } },
  { id: 'lt_studygroup', phase: ['mid', 'late'], kind: 'good', cond: () => S.roster.some(r => r.announced),
    text: { zh: '📚 已公布的講者們自發組了讀書會，社群羨慕炸了。', en: '📚 Your announced speakers start a study group — the community is so jealous.' },
    apply() { const d = dice(1); S.reg += sum(d); clampReg(); log(L(`📚 講者讀書會發酵：報名 +${sum(d)}`, `📚 Speaker study group buzz: +${sum(d)} signups`), 'good'); } },
  { id: 'lt_uni_group', phase: 'mid', kind: 'good', text: { zh: '🎓 某大學 iOS 社團整團報名！', en: '🎓 A university iOS club signs up as a whole squad!' },
    apply() { const d = dice(2); S.reg += sum(d); clampReg(); log(L(`🎓 大學社團整團報名：報名 +${sum(d)}`, `🎓 Uni club signs up together: +${sum(d)} signups`), 'good'); } },
  { id: 'lt_threads_slides', phase: 'late', kind: 'good', text: { zh: '🧵 講者在 Threads 曬投影片進度，期待值拉滿。', en: '🧵 A speaker teases their slides on Threads — hype maxed out.' },
    apply() { const d = dice(1); S.reg += sum(d); clampReg(); log(L(`🧵 投影片預告拉滿期待：報名 +${sum(d)}`, `🧵 Slide teaser hype: +${sum(d)} signups`), 'good'); } },
  { id: 'lt_volunteer_fight', phase: 'late', kind: 'bad', text: { zh: '😤 志工群組為了動線圖吵起來，你花了一晚滅火。', en: '😤 Volunteers feud over the floor plan — you spend a night putting out fires.' },
    apply() { S.ap = Math.max(0, S.ap - 1); log(L('😤 志工滅火耗了一晚：本週行動點 −1', '😤 A night of volunteer drama: −1 AP this week'), 'bad'); } },
  { id: 'lt_scam', phase: 'late', kind: 'bad', text: { zh: '🎫 出現假票券詐騙，緊急發澄清文。', en: '🎫 Fake tickets show up — you rush out a warning post.' },
    apply() { const d = dice(1); S.reg -= sum(d); clampReg(); log(L(`🎫 假票詐騙澄清：報名 −${sum(d)}`, `🎫 Fake-ticket scare: −${sum(d)} signups`), 'bad'); } },
  { id: 'lt_interview_video', phase: 'mid', kind: 'good', text: { zh: '🎙 講者專訪影片上線，好評如潮！', en: '🎙 A speaker interview video drops — rave reviews!' },
    apply() { const d = dice(2); S.reg += sum(d); clampReg(); log(L(`🎙 專訪影片好評如潮：報名 +${sum(d)}`, `🎙 Interview video wins raves: +${sum(d)} signups`), 'good'); } },
  { id: 'lt_speaker_cue', phase: ['mid', 'late'], kind: 'good', cond: () => S.roster.filter(r => r.announced).length >= 2,
    text: { zh: '🤝 兩位講者在社群互 cue 準備彩蛋，大家開始腦補。', en: '🤝 Two speakers hint at a collab online — everyone starts speculating.' },
    apply() { const d = dice(1); S.reg += sum(d); clampReg(); log(L(`🤝 講者互 cue 彩蛋：報名 +${sum(d)}`, `🤝 Speaker collab teaser: +${sum(d)} signups`), 'good'); } },
  { id: 'lt_company_tickets', phase: 'late', kind: 'good', text: { zh: '🏢 講者的公司直接包了一排票挺自家人。', en: '🏢 A speaker\'s company books a whole row to cheer them on.' },
    apply() { const d = dice(2); S.reg += sum(d); clampReg(); log(L(`🏢 講者公司包場相挺：報名 +${sum(d)}`, `🏢 A company block-books tickets: +${sum(d)} signups`), 'good'); } },
  // ── 環境 ──
  { id: 'lt_heatwave', phase: 'mid', kind: 'bad', text: { zh: '🥵 熱浪來襲，大家連滑手機的力氣都沒有。', en: '🥵 A heatwave hits — nobody has the energy to even scroll.' },
    apply() { const d = dice(1); S.reg -= sum(d); clampReg(); log(L(`🥵 熱浪讓人懶洋洋：報名 −${sum(d)}`, `🥵 Heatwave saps everyone: −${sum(d)} signups`), 'bad'); } },
  { id: 'lt_mrt', phase: 'any', kind: 'good', text: { zh: '🚇 會場附近捷運新站開通，交通瞬間變方便。', en: '🚇 A new metro station opens by the venue — getting there just got easy.' },
    apply() { const d = dice(2); S.reg += sum(d); clampReg(); log(L(`🚇 捷運新站開通：報名 +${sum(d)}`, `🚇 New metro station opens: +${sum(d)} signups`), 'good'); } },
  { id: 'lt_rain', phase: 'any', kind: 'neutral', text: { zh: '🌧 午後雷陣雨。就只是下雨，沒事。', en: '🌧 Afternoon thundershowers. Just rain. Nothing to see here.' },
    apply() { log(L('🌧 午後雷陣雨——純氛圍，沒有影響。', '🌧 Afternoon rain — pure vibes, no effect.')); } },
  { id: 'lt_fire_drill', phase: 'any', kind: 'bad', text: { zh: '🚨 場地消防安檢日，陪檢一整天。', en: '🚨 Fire-safety inspection day at the venue — you tag along all day.' },
    apply() { S.ap = Math.max(0, S.ap - 1); log(L('🚨 陪消防安檢一整天：本週行動點 −1', '🚨 A full day of fire inspection: −1 AP this week'), 'bad'); } },
  { id: 'lt_sunny', phase: 'early', kind: 'good', text: { zh: '☀️ 久違的放晴日，心情跟報名一起升溫。', en: '☀️ A rare sunny day — moods and signups warm up together.' },
    apply() { const d = dice(1); S.reg += sum(d); clampReg(); log(L(`☀️ 放晴好心情：報名 +${sum(d)}`, `☀️ Sunny-day mood: +${sum(d)} signups`), 'good'); } },
  { id: 'lt_idol_crowd', phase: 'mid', kind: 'good', text: { zh: '🎤 隔壁展場偶像簽售，路過人潮順手掃了你的 QR。', en: '🎤 An idol signing next door — passersby scan your QR on their way by.' },
    apply() { const d = dice(1); S.reg += sum(d); clampReg(); log(L(`🎤 隔壁人潮順手掃碼：報名 +${sum(d)}`, `🎤 Spillover crowd scans your QR: +${sum(d)} signups`), 'good'); } },
  { id: 'lt_github_down', phase: 'any', kind: 'good', text: { zh: '🐙 GitHub 大當機——工程師閒著沒事全在滑社群。', en: '🐙 GitHub goes down — idle engineers flood social media.' },
    apply() { const d = dice(2); S.reg += sum(d); clampReg(); log(L(`🐙 GitHub 當機工程師都在滑社群：報名 +${sum(d)}`, `🐙 GitHub outage, engineers doomscroll: +${sum(d)} signups`), 'good'); } },
  { id: 'lt_apple_store', phase: 'any', kind: 'good', text: { zh: '🍎 Apple Store 新品開賣排隊潮，科技話題升溫。', en: '🍎 New Apple Store launch lines form — tech buzz heats up.' },
    apply() { const d = dice(1); S.reg += sum(d); clampReg(); log(L(`🍎 新品排隊科技話題升溫：報名 +${sum(d)}`, `🍎 Launch-day buzz: +${sum(d)} signups`), 'good'); } },
  { id: 'lt_makeup_day', phase: 'any', kind: 'bad', text: { zh: '😮‍💨 颱風假補班日，時間線一片哀嚎沒人理宣傳。', en: '😮‍💨 A typhoon make-up workday — timelines groan, nobody reads promos.' },
    apply() { const d = dice(1); S.reg -= sum(d); clampReg(); log(L(`😮‍💨 補班日沒人理宣傳：報名 −${sum(d)}`, `😮‍💨 Make-up workday kills the mood: −${sum(d)} signups`), 'bad'); } },
];

function setForced(type, reason) {
  S.forcedType = type; S.forcedReason = reason;
  log(L(`🎯 ${reason}：下一抽鎖定「${typeL(type)}」`, `🎯 ${reason}: next draw locked to "${typeL(type)}"`), 'good');
}
function eventPhase() { return S.week <= 3 ? 'early' : S.week <= 6 ? 'mid' : 'late'; }

/* 難度：加權事件機率（低=好事多壞事少、高=反之） */
let difficulty = localStorage.getItem('ipg_diff') || 'normal';
const EVENT_KIND = {
  sponsor: 'good', self_submit: 'good', boost_share: 'good', earlybird: 'good',
  viral: 'good', volunteer: 'good', bento: 'good', designate: 'good',
  quiet: 'neutral', drama: 'neutral',
  cfp_cold: 'bad', rival: 'bad', ticket_down: 'bad', flu: 'bad',
  typhoon: 'bad', refund: 'bad', cancel: 'bad',
};
/* 事件 kind：新事件（主/輕）自帶 ev.kind；舊主事件沿用 EVENT_KIND 表 */
function eventKind(ev) { return ev.kind || EVENT_KIND[ev.id] || 'neutral'; }
/* phase 可為 'any' / 單一字串 / 陣列（多階段），對照當前 eventPhase() */
function eventPhaseMatch(evPhase, cur) {
  if (evPhase === 'any') return true;
  if (Array.isArray(evPhase)) return evPhase.includes(cur);
  return evPhase === cur;
}
function eventWeight(ev) {
  const kind = eventKind(ev);
  const w = ev.weight || 1;   // 個別事件出現率加成（招牌事件用；預設 1）
  if (difficulty === 'easy') return (kind === 'good' ? 2 : kind === 'bad' ? 0.5 : 1) * w;
  if (difficulty === 'hard') return (kind === 'good' ? 0.5 : kind === 'bad' ? 2 : 1) * w;
  return w;
}
function diffName() { return { easy: L('低', 'Easy'), normal: L('中', 'Normal'), hard: L('高', 'Hard') }[difficulty]; }

function pickEvent() {
  const cur = eventPhase();
  const pool = EVENTS.filter(e =>
    eventPhaseMatch(e.phase, cur) && e.id !== S.lastEventId && (!e.cond || e.cond()));
  const total = pool.reduce((s, e) => s + eventWeight(e), 0);
  let roll = Math.random() * total;
  for (const e of pool) {
    roll -= eventWeight(e);
    if (roll <= 0) return e;
  }
  return pool[pool.length - 1];
}
/* 輕事件挑選：分池、獨立去重（lastLightEventId ＋ 同局不重複 usedLightIds） */
function pickLightEvent() {
  const cur = eventPhase();
  const pool = LIGHT_EVENTS.filter(e =>
    eventPhaseMatch(e.phase, cur) && e.id !== S.lastLightEventId &&
    !S.usedLightIds.includes(e.id) && (!e.cond || e.cond()));
  if (!pool.length) return null;
  const total = pool.reduce((s, e) => s + eventWeight(e), 0);
  let roll = Math.random() * total;
  for (const e of pool) {
    roll -= eventWeight(e);
    if (roll <= 0) return e;
  }
  return pool[pool.length - 1];
}
async function runLightEventNarrative(le) {
  S.lastLightEventId = le.id;
  S.usedLightIds.push(le.id);
  sceneOverride = null;
  currentEventArt = EVENT_IMAGES[le.id] ? le.id : null;   // 有圖切換場景，缺圖維持季節場景
  renderScene();
  const reg0 = S.reg, ap0 = S.ap;
  if (le.apply) le.apply();          // 先套用（含 log），才能把影響一併寫進快訊
  const dReg = S.reg - reg0, dAp = S.ap - ap0;
  const sign = n => (n > 0 ? '+' : '−') + Math.abs(n);
  let fx = '';
  if (dReg !== 0) fx = L(`報名 ${sign(dReg)}`, `${sign(dReg)} signups`);
  else if (dAp !== 0) fx = L(`本週行動點 ${sign(dAp)}`, `${sign(dAp)} AP`);
  const flavor = le.text[lang] || le.text.zh;
  const msg = fx ? (lang === 'zh' ? `${flavor}（${fx}）` : `${flavor} (${fx})`) : flavor;
  await say(msg, { tag: L(`第 ${S.week} 週 · 快訊`, `Week ${S.week} · Flash`) });
  currentEventArt = null;   // 快訊結束回季節場景
  renderScene(); render();
}

/* 講者取消（純文字版，走訊息窗） */
function runCancelEventPlain() {
  const ri = Math.floor(Math.random() * S.roster.length);
  const victim = S.roster[ri];
  const vCard = SPEAKER_CARDS[victim.idx];
  const vType = vCard.types.includes('workshop') ? 'workshop' : vCard.types.includes('lightning') ? 'lightning' : 'regular';
  const backup = S.roster.find(r => r !== victim && !r.announced && SPEAKER_CARDS[r.idx].types.includes(vType));

  S.roster.splice(ri, 1);
  let msg = L(`講者「${nm(vCard)}」臨時有要事，無法出席……`, `Speaker "${nm(vCard)}" can no longer make it...`);
  let refund = 0;
  if (victim.announced) { const d = dice(2); refund = sum(d); S.reg -= refund; clampReg(); }

  if (backup) {
    const bName = nm(SPEAKER_CARDS[backup.idx]);
    if (victim.announced) {
      backup.announced = true;
      msg += L(`失望退票 −${refund}。好在「${bName}」臨危受命救場，緊急公布遞補，議程效應不中斷！`,
               ` Refunds: −${refund}. But "${bName}" steps up as the emergency replacement — the agenda effect continues!`);
      log(L(`😱 ${esc(nm(vCard))} 取消（退票 −${refund}）→ ${esc(bName)} 備援救場`, `😱 ${esc(nm(vCard))} cancelled (−${refund}) → ${esc(bName)} saves the day`), 'good');
    } else {
      msg += L(`好在還有「${bName}」可以補位，議程沒有開天窗。`, ` Luckily "${bName}" can fill the slot — no gap in the program.`);
      log(L(`😱 ${esc(nm(vCard))} 取消，${esc(bName)} 補位`, `😱 ${esc(nm(vCard))} cancelled, ${esc(bName)} fills in`), 'bad');
    }
  } else {
    msg += victim.announced
      ? L(`沒有備援講者……失望退票 −${refund}，之後也少了他的每週發酵。`, ` No backup speaker... −${refund} refunds, and their weekly buzz is gone too.`)
      : L('沒有備援講者，只能默默把議程表改掉。', ' No backup available — quietly edit the schedule and move on.');
    log(L(`😱 講者取消：失去 ${esc(nm(vCard))}${victim.announced ? `（退票 −${refund}）` : ''}`,
          `😱 Cancellation: lost ${esc(nm(vCard))}${victim.announced ? ` (−${refund} refunds)` : ''}`), 'bad');
  }
  return msg;
}

async function runEventNarrative(ev) {
  S.lastEventId = ev.id;
  const tag = L(`第 ${S.week} 週 · 事件`, `Week ${S.week} · Event`);
  const name = ev.name[lang] || ev.name.zh;
  if (ev.id === 'quiz_visit') { await runQuizVisitEvent(ev, tag, name); return; }
  currentEventArt = EVENT_IMAGES[ev.id] ? ev.id : null;   // 事件敘事期間切換場景圖
  if (ev.id === 'cancel') {
    const text = runCancelEventPlain();
    renderScene();
    await say(`${ev.icon} ${name}——${text}`, { tag });
  } else if (ev.choices) {
    renderScene();
    const choicesRaw = typeof ev.choices === 'function' ? ev.choices() : ev.choices;
    await say(`${ev.icon} ${name}——${ev.desc[lang] || ev.desc.zh}`, {
      tag,
      choices: choicesRaw.map(ch => ({ label: ch.label[lang] || ch.label.zh, ghost: ch.ghost, run: ch.run })),
    });
  } else {
    renderScene();
    await say(`${ev.icon} ${name}——${ev.desc[lang] || ev.desc.zh}`, { tag });
    ev.apply();
  }
  currentEventArt = null;   // 事件結束回到季節場景
  renderScene(); render();
}

/* ── 神秘講者來訪：剪影 → 四選一 → 答對免費入手／答錯公布正解 ── */
function buildQuizNameOptions(targetIdx) {
  const target = SPEAKER_CARDS[targetIdx];
  const others = SPEAKER_CARDS.map((_, i) => i).filter(i => i !== targetIdx);
  const sameTag = others.filter(i => SPEAKER_CARDS[i].cats.some(k => target.cats.includes(k)));
  const sameIntl = others.filter(i => SPEAKER_CARDS[i].intl === target.intl);
  const distractors = [];
  const pushFrom = arr => shuffle(arr).forEach(i => { if (distractors.length < 3 && !distractors.includes(i)) distractors.push(i); });
  pushFrom(sameTag); pushFrom(sameIntl); pushFrom(others);   // 同 tag → 同 intl → 全池
  return shuffle([targetIdx, ...distractors.slice(0, 3)]);
}
async function runQuizVisitEvent(ev, tag, name) {
  sceneOverride = null;
  currentEventArt = EVENT_IMAGES['quiz_visit'] ? 'quiz_visit' : null;   // 開場封面（有圖才顯示，缺圖走季節場景）
  renderScene();
  await say(`${ev.icon} ${name}——${ev.desc[lang] || ev.desc.zh}`, { tag });

  const targetIdx = pickCard(S.speakerPool, i => isSelfSpeaker(SPEAKER_CARDS[i]));
  const target = SPEAKER_CARDS[targetIdx];
  const options = buildQuizNameOptions(targetIdx);

  // 場景切成全黑剪影
  sceneOverride = `<img class="scene-sil" src="${esc(target.photo || '')}" alt="">`;
  renderScene();

  let chosen = null;
  await say(L('👤 這位神秘講者是誰？猜對他就答應站台！', '👤 Who is this mystery speaker? Guess right and they join!'), {
    tag,
    choices: options.map(idx => ({ label: nm(SPEAKER_CARDS[idx]), run() { chosen = idx; } })),
  });

  // 剪影 0.4s 過渡點亮
  msgBusy = true; render();
  sceneOverride = `<img class="scene-reveal" src="${esc(target.photo || '')}" alt="">`;
  renderScene();
  await wait(650);
  const correct = chosen === targetIdx;
  if (correct) {
    S.speakerPool = S.speakerPool.filter(i => i !== targetIdx);
    S.roster.push({ idx: targetIdx, announced: false, contrib: 0, interviewed: false });
    log(L(`🎭 神秘講者 <b>${esc(nm(target))}</b> 加入陣容！（免費、不佔上限）`,
          `🎭 Mystery speaker <b>${esc(nm(target))}</b> joins the lineup! (free, no limit)`), 'good');
    if (isSelfSpeaker(target)) log(L('🪞 而且竟然就是總召本人！公布後每週報名 ×2', '🪞 ...and it turns out to be the Chief! ×2 weekly signups once announced'), 'good');
    await say(L(`🎉 答對了！${nm(target)} 二話不說加入你的陣容——免費、不佔本週上限！`,
                `🎉 Correct! ${nm(target)} joins on the spot — free, and it doesn't use your weekly limit!`), { tag });
    sceneOverride = null; currentEventArt = null; renderScene(); render();
    showSpeakerCard(target);
  } else {
    await say(L(`🙈 他笑著搖搖頭離開了——原來是 ${nm(target)}。（沒有懲罰，但可以認識一下他）`,
                `🙈 They smile, shake their head, and leave — it was ${nm(target)}. (No penalty — but get to know them.)`), { tag });
    sceneOverride = null; currentEventArt = null; renderScene(); render();
    showSpeakerCard(target, null, true);   // 卡冊檢視模式：讓玩家看到正解卡面
  }
}

/* ═══════════ v1.3 深度專訪 ═══════════ */
/* 可專訪對象＝已入手、未升級、且非本人卡 */
function eligibleInterviewTargets() {
  return S.roster.map((r, i) => i).filter(i => !S.roster[i].interviewed && !isSelfSpeaker(SPEAKER_CARDS[S.roster[i].idx]));
}
function canInterview() {
  return !S.over && !spinning && !msgBusy && !S.interviewDone && eligibleInterviewTargets().length > 0;
}
/* 題型可用性防呆 */
function plainIntro(c) { return ((lang === 'en' && c.intro_en) ? c.intro_en : (c.intro || '')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function maskName(text, c) {
  const cands = [c.name, c.name_en, ...nameTokens(c.name), ...nameTokens(c.name_en)].filter(s => s && s.length >= 2);
  [...new Set(cands)].sort((a, b) => b.length - a.length).forEach(s => {
    text = text.replace(new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '███');
  });
  return text;
}
function introExcerpt(c) {
  const m = maskName(plainIntro(c), c);
  return m.length > 60 ? m.slice(0, 60).trim() + '…' : m;
}
function interviewTypes(c) {
  const t = [];
  if (tk(c)) t.push('talk');
  if (c.cats && c.cats.length && (CAT_KEYS.length - c.cats.length) >= 3) t.push('cat');
  if (plainIntro(c).length >= 8) t.push('intro');
  if (c.sessions && c.sessions.length) t.push('session');
  return t;
}
const DAY_OPTS = [
  { key: 'Day 1',    label: { zh: 'Day 1', en: 'Day 1' } },
  { key: 'Day 2',    label: { zh: 'Day 2', en: 'Day 2' } },
  { key: 'WS Day 1', label: { zh: 'Workshop Day 1', en: 'Workshop Day 1' } },
  { key: 'WS Day 2', label: { zh: 'Workshop Day 2', en: 'Workshop Day 2' } },
];
function distractorLabels(c, mapFn, correctLabel) {
  const others = SPEAKER_CARDS.filter(o => o !== c);
  const sameTag = shuffle(others.filter(o => o.cats.some(k => c.cats.includes(k))));
  const rest = shuffle(others);
  const out = [];
  for (const o of [...sameTag, ...rest]) {
    const t = mapFn(o);
    if (t && t !== correctLabel && !out.includes(t)) out.push(t);
    if (out.length >= 3) break;
  }
  return out;
}
function buildChoiceQ(prompt, correctLabel, distractors) {
  const opts = [{ label: correctLabel, correct: true }, ...distractors.slice(0, 3).map(l => ({ label: l, correct: false }))];
  return { prompt, options: shuffle(opts), answerText: correctLabel };
}
function buildInterviewQuestion(c, type) {
  if (type === 'cat') {
    const correctCat = shuffle(c.cats)[0];
    const wrong = shuffle(CAT_KEYS.filter(k => !c.cats.includes(k))).slice(0, 3).map(catL);
    return buildChoiceQ(L(`${nm(c)} 的議程屬於哪個主題分類？`, `Which topic tag is ${nm(c)}'s talk?`), catL(correctCat), wrong);
  }
  if (type === 'intro') {
    const correct = introExcerpt(c);
    return buildChoiceQ(L(`哪一段自介是 ${nm(c)} 的？（名字已遮罩）`, `Which bio belongs to ${nm(c)}? (name masked)`),
      correct, distractorLabels(c, introExcerpt, correct));
  }
  if (type === 'session') {
    const daySet = new Set((c.sessions || []).map(s => s.day));
    const opts = DAY_OPTS.map(d => ({ label: d.label[lang] || d.label.zh, correct: daySet.has(d.key) }));
    const answerText = DAY_OPTS.filter(d => daySet.has(d.key)).map(d => d.label[lang] || d.label.zh).join(' / ');
    return { prompt: L(`${nm(c)} 在哪個場次登場？`, `On which day does ${nm(c)} take the stage?`), options: shuffle(opts), answerText };
  }
  // talk（預設）
  const correct = tk(c);
  return buildChoiceQ(L(`以下哪個是 ${nm(c)} 的議程題目？`, `Which talk title is ${nm(c)}'s?`),
    correct, distractorLabels(c, tk, correct));
}
function buildInterviewQuestions(c) {
  const types = shuffle(interviewTypes(c));
  let chosen;
  if (types.length >= 2) chosen = types.slice(0, 2);
  else if (types.length === 1) chosen = [types[0], types[0]];   // 候選 <2 → 同型兩題（不同干擾）
  else chosen = ['talk', 'talk'];
  return chosen.map(t => buildInterviewQuestion(c, t));
}
function openInterviewPanel() {
  if (!canInterview()) return;
  renderInterviewPanel();
  $('interviewOverlay').classList.add('show');
}
function renderInterviewPanel() {
  const grid = $('interviewGrid');
  grid.innerHTML = S.roster.map((r, i) => {
    const c = SPEAKER_CARDS[r.idx];
    const acc = accentOf(c);
    const self = isSelfSpeaker(c);
    const locked = self || r.interviewed;
    const note = self ? L('🪞 不用訪，你最懂你自己', '🪞 No need — you know yourself best')
      : r.interviewed ? L('⭐ 已深度專訪', '⭐ Interviewed') : L('可專訪', 'Available');
    return `<div class="mini ${acc ? 'acc-' + acc : ''}${locked ? ' iv-locked' : ''}${r.interviewed ? ' iv-done' : ''}${self ? ' iv-self' : ''}" ${locked ? '' : `data-i="${i}"`}>
      ${r.interviewed ? '<div class="iv-star">⭐</div>' : ''}${miniPh(c.photo, nm(c))}
      <div class="nm">${esc(nm(c))}</div>
      <div class="st2 ${locked ? 'ivnote' : ''}">${note}</div>
    </div>`;
  }).join('');
  const none = eligibleInterviewTargets().length === 0;
  $('interviewEmpty').style.display = none ? '' : 'none';
  $('interviewEmpty').textContent = L('目前沒有可專訪的對象（都升級了或只剩本人卡）。', 'No one left to interview (all done, or only your own card remains).');
}
$('interviewGrid').addEventListener('click', e => {
  const m = e.target.closest('.mini[data-i]'); if (!m) return;
  const i = +m.dataset.i;
  $('interviewOverlay').classList.remove('show');
  runInterview(i);
});
async function runInterview(ri) {
  const r = S.roster[ri]; if (!r || r.interviewed) return;
  const c = SPEAKER_CARDS[r.idx];
  S.interviewDone = true;   // 一次嘗試（成功或失敗都算用掉）
  sceneOverride = INTERVIEW_IMAGE ? `<img src="${INTERVIEW_IMAGE}" alt="">` : null;   // 場景切成 quiz show 背景
  currentEventArt = null;
  renderScene(); render();
  const tag = L(`🎙 深度專訪 · ${nm(c)}`, `🎙 Interview · ${nm(c)}`);
  const qs = buildInterviewQuestions(c);
  await say(L(`🎙 你把 ${nm(c)} 請來坐下深聊。答對 ${qs.length} 題證明你真的懂他，他就願意為你多拼一點！`,
              `🎙 You sit ${nm(c)} down for a deep chat. Ace all ${qs.length} questions to prove you truly know them — and they'll go the extra mile!`), { tag });
  let allCorrect = true;
  for (let qi = 0; qi < qs.length; qi++) {
    const q = qs[qi];
    let picked = null;
    await say(`Q${qi + 1}. ${q.prompt}`, { tag, choices: q.options.map(o => ({ label: o.label, run() { picked = o; } })) });
    const ok = !!(picked && picked.correct);
    if (!ok) allCorrect = false;
    await say(ok ? L('✅ 答對！', '✅ Correct!') : L(`❌ 正解是：「${q.answerText}」`, `❌ The answer: "${q.answerText}"`), { tag });
  }
  if (allCorrect) {
    r.interviewed = true;
    log(L(`⭐ 深度專訪成功：${esc(nm(c))} 升級！公布後每週發酵 +${INTERVIEW_BONUS}`,
          `⭐ Interview aced: ${esc(nm(c))} leveled up! +${INTERVIEW_BONUS} signups/week once announced`), 'good');
    await say(L(`⭐ 完美！${nm(c)} 大受感動，答應為你多拼一點——公布後每週發酵 +${INTERVIEW_BONUS}！`,
                `⭐ Perfect! ${nm(c)} is genuinely moved and commits to more — +${INTERVIEW_BONUS} weekly signups once announced!`), { tag });
    sceneOverride = null; renderScene(); render();   // 回季節場景
    showSpeakerCard(c, r);
    if (!reducedMotion) { burstConfetti(); setTimeout(burstConfetti, 550); }   // ⭐ 成功慶祝（不另生圖）
  } else {
    log(L(`🎙 深度專訪失敗：${esc(nm(c))} 婉拒了（下週可再試同一位）`,
          `🎙 Interview flopped: ${esc(nm(c))} passed (retry next week)`), 'bad');
    if (INTERVIEW_FAIL_IMAGE) { sceneOverride = `<img src="${INTERVIEW_FAIL_IMAGE}" alt="">`; renderScene(); }   // 場景切到「講者婉拒」圖
    await say(L('🙇 訪綱沒做好，講者婉拒了……下週可以再試一次。', '🙇 Your prep fell short — they politely declined. You can try again next week.'), { tag });
    sceneOverride = null; renderScene(); render();   // 回季節場景
  }
}

/* ═══════════ 每週流程 ═══════════ */
const WEEK_FLAVOR = [
  { zh: '總召上任第一週。窗外下著梅雨，售票頁還是一片空白……先從邀請講者開始吧。', en: 'Week one on the job. Rainy season drizzles outside, and the ticket page is a blank slate... time to invite some speakers.' },
  { zh: '雨還在下。信箱裡開始出現講者的回信了。', en: 'Still raining. Speaker replies are starting to land in the inbox.' },
  { zh: '梅雨尾聲。社群裡開始有人問「今年 iPlayground 什麼時候？」', en: 'Rainy season is winding down. People are asking "when is iPlayground this year?"' },
  { zh: '出梅了！天氣放晴，售票的黃金期開始。', en: 'The rain has cleared! Prime ticket-selling season begins.' },
  { zh: '初夏的風。其他研討會也開始搶講者了，動作要快。', en: 'Early-summer breeze. Other conferences are hunting speakers too — move fast.' },
  { zh: '天氣越來越熱，報名數字是唯一的降溫方式。', en: 'It keeps getting hotter. Watching signups climb is the only way to cool down.' },
  { zh: '盛夏蟬鳴。剩三週，該補的洞要補了。', en: 'Midsummer cicadas. Three weeks left — plug the gaps now.' },
  { zh: '倒數兩週，社群的期待感肉眼可見。最後衝刺！', en: 'Two weeks out. You can feel the community buzzing. Final sprint!' },
  { zh: '活動前夜週。命運都寫在這一週了……', en: 'The final week before showtime. Everything comes down to this...' },
];

async function startWeek() {
  S.ap = weeklyApBase();
  S.drawsThisWeek = 0;
  S.speakerDrawLimit = 3;
  S.interviewDone = false;   // 深度專訪：每週限 1 次嘗試，跨週重置
  S.promoHalved = S.promoHalvedNextWeek;
  S.promoHalvedNextWeek = false;

  const gain = agendaTick(L(`第 ${S.week} 週議程效應`, `Week ${S.week} agenda effect`));

  if (S.week >= 7 && !S.forcedType) {
    if (countType('workshop') === 0 && S.speakerPool.some(i => SPEAKER_CARDS[i].types.includes('workshop'))) {
      setForced('workshop', L('議程組緊急協調', 'Program team scramble'));
    } else if (countType('lightning') === 0 && S.speakerPool.some(i => SPEAKER_CARDS[i].types.includes('lightning'))) {
      setForced('lightning', L('議程組緊急協調', 'Program team scramble'));
    }
  }

  renderScene(); render();
  let flavor = WEEK_FLAVOR[S.week - 1][lang] || WEEK_FLAVOR[S.week - 1].zh;
  if (gain > 0) flavor += L(`（議程效應：報名 +${gain}！）`, ` (Agenda effect: +${gain} signups!)`);
  await say(flavor, { tag: L(`第 ${S.week} 週`, `Week ${S.week}`) });
  if (S.week >= 2) {
    await runEventNarrative(pickEvent());
    if (Math.random() < 0.5) {                    // 主事件結束後 50% 追加一則輕事件快訊
      const le = pickLightEvent();
      if (le) await runLightEventNarrative(le);
    }
  }
  say(L('本週要做什麼呢？', 'What should we do this week?'), { tag: L(`第 ${S.week} 週 · 待命`, `Week ${S.week} · Standing by`), wait: false });
}

function endWeek() {
  if (spinning || S.over || msgBusy) return;
  if (S.week >= TOTAL_WEEKS) { finale(); return; }
  S.week += 1;
  startWeek();
}

/* ═══════════ 行動 ═══════════ */
function canInvite() {
  return !S.over && !spinning && !msgBusy && S.speakerPool.length > 0 &&
    (S.freeDraws > 0 || (S.ap >= 1 && S.drawsThisWeek < S.speakerDrawLimit));
}
function actInvite() {
  if (!canInvite()) return;
  const usedFree = S.freeDraws > 0;
  if (usedFree) S.freeDraws -= 1; else { S.ap -= 1; S.drawsThisWeek += 1; }

  let candidates = S.speakerPool;
  if (S.forcedType) {
    const sub = S.speakerPool.filter(i => SPEAKER_CARDS[i].types.includes(S.forcedType));
    if (sub.length) candidates = sub;
    S.forcedType = null; S.forcedReason = '';
  }
  const winnerIdx = pickCard(candidates, i => isSelfSpeaker(SPEAKER_CARDS[i]));
  spinWheel('speaker', winnerIdx, () => {
    S.speakerPool = S.speakerPool.filter(i => i !== winnerIdx);
    S.roster.push({ idx: winnerIdx, announced: false, contrib: 0, interviewed: false });
    const c = SPEAKER_CARDS[winnerIdx];
    log(L(`🎤 邀請成功：<b>${esc(nm(c))}</b>（${typeBadges(c)}）${usedFree ? ' · 免費' : ''}`,
          `🎤 Invited: <b>${esc(nm(c))}</b> (${typeBadges(c)})${usedFree ? ' · free' : ''}`), 'good');
    if (isSelfSpeaker(c)) {
      log(L('🪞 講者就是總召本人！號召力驚人，公布後每週報名 ×2', '🪞 The speaker IS the Chief! Star power: ×2 weekly signups once announced'), 'good');
    }
    showSpeakerCard(c);
    render();
  });
  render();
}

function canStaff() { return !S.over && !spinning && !msgBusy && S.ap >= 1 && S.staffPool.length > 0; }
function actStaff() {
  if (!canStaff()) return;
  S.ap -= 1;
  const winnerIdx = pickCard(S.staffPool, i => isSelfName(STAFF_CARDS[i].name));
  spinWheel('staff', winnerIdx, () => {
    S.staffPool = S.staffPool.filter(i => i !== winnerIdx);
    S.staff.push(winnerIdx);
    const c = STAFF_CARDS[winnerIdx];
    log(L(`🙋 招募成功：<b>${esc(c.name)}</b>（工作人員 ${S.staff.length} 位）`,
          `🙋 Recruited: <b>${esc(c.name)}</b> (${S.staff.length} staff)`), 'good');
    if (isSelfName(c.name)) {
      S.ap += 1;
      log(L('🪞 總召親自下場！行動點立刻 +1，之後每週固定 +1', '🪞 The Chief joins the crew! +1 AP now, and +1 every week from now on'), 'good');
    }
    showStaffCard(c);
    render();
  });
  render();
}

function canPromo() { return !S.over && !spinning && !msgBusy && S.ap >= 1; }
function actPromo() {
  if (!canPromo()) return;
  S.ap -= 1;
  const d = dice(2);
  const announced = S.roster.filter(r => r.announced).length;
  let gain = sum(d) + 2 * announced;
  let note = L(`2d6（${d.join('+')}）＋ 已公布講者 ${announced}×2`, `2d6 (${d.join('+')}) + announced ${announced}×2`);
  if (S.promoBoost) { gain *= 2; note += L(' · 大神轉發 ×2', ' · repost ×2'); S.promoBoost = false; }
  if (S.promoHalved) { gain = Math.floor(gain / 2); note += L(' · 撞檔減半', ' · rival halved'); }
  S.reg += gain; clampReg();
  log(L(`📣 宣傳售票：報名 +${gain}（${note}）`, `📣 Promo: +${gain} signups (${note})`), 'good');
  showPromoResult(gain, note);
  renderScene(); render();
}

function canAnnounce() { return !S.over && !spinning && !msgBusy && S.ap >= 1 && S.roster.some(r => !r.announced); }
function actAnnounce() {
  if (!canAnnounce()) return;
  S.ap -= 1;
  const batch = S.roster.filter(r => !r.announced);
  batch.forEach(r => { r.announced = true; });

  let covLine = '';
  if (!S.covBonusGiven && regularCats().size === CAT_KEYS.length) {
    S.covBonusGiven = true;
    covLine = L('🌈 主題多樣性爆棚！6 大 tag 全湊齊：議程效應永久 ×1.2', '🌈 Full topic diversity! All 6 tags covered: agenda effect ×1.2 forever');
    log(covLine, 'good');
  }

  const annCount = S.roster.filter(r => r.announced).length;
  const est = estimateWeekly();
  const remainTicks = TOTAL_WEEKS - S.week + 1;
  log(L(`📋 公布議程：${batch.length} 位講者亮相（陣容 ${annCount} 位）→ 每週約 +${est} 報名開始發酵`,
        `📋 Agenda announced: ${batch.length} speaker(s) revealed (lineup ${annCount}) → ~+${est} signups/week`), 'good');
  showAnnounceModal(batch, est, remainTicks, covLine);
  render();
}

/* ═══════════ 行動結果視覺 ═══════════ */
function artInto(el, imgKey, fallbackSVG) {
  const img = ACTION_IMAGES[imgKey];
  el.innerHTML = img ? `<img src="${img}" alt="">` : fallbackSVG;
}
function promoFallbackSVG() {
  return `<svg viewBox="0 0 460 130" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="130" fill="#17201a"/>
    <rect x="24" y="26" width="180" height="78" rx="8" fill="#1A1A1A" stroke="#D7FF00" stroke-width="2"/>
    <text x="114" y="60" text-anchor="middle" font-size="15" font-weight="700" fill="#D7FF00" font-family="sans-serif">iPlayground</text>
    <text x="114" y="82" text-anchor="middle" font-size="11" fill="#D9D9D9" font-family="sans-serif">${L('售票中！', 'Tickets on sale!')}</text>
    <path d="M 250 78 L 300 52 L 300 104 Z" fill="#FFB800"/><rect x="296" y="64" width="60" height="28" rx="6" fill="#FFB800"/>
    <circle cx="390" cy="46" r="9" fill="#F0997B"/><rect x="383" y="53" width="14" height="20" rx="4" fill="#F0997B" opacity="0.75"/>
    <circle cx="420" cy="56" r="9" fill="#85B7EB"/><rect x="413" y="63" width="14" height="20" rx="4" fill="#85B7EB" opacity="0.75"/>
    <circle cx="404" cy="88" r="9" fill="#F4C0D1"/><rect x="397" y="95" width="14" height="20" rx="4" fill="#F4C0D1" opacity="0.75"/></svg>`;
}
function announceFallbackSVG() {
  return `<svg viewBox="0 0 460 110" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="110" fill="#141826"/>
    <rect x="40" y="22" width="380" height="30" rx="6" fill="#D7FF00"/>
    <text x="230" y="42" text-anchor="middle" font-size="14" font-weight="700" fill="#26215C" font-family="sans-serif">${L('議程公布！', 'AGENDA IS LIVE!')}</text>
    <rect x="70" y="66" width="90" height="26" rx="5" fill="#1A1A1A" stroke="#FFB800"/>
    <rect x="185" y="66" width="90" height="26" rx="5" fill="#1A1A1A" stroke="#7DD3FC"/>
    <rect x="300" y="66" width="90" height="26" rx="5" fill="#1A1A1A" stroke="#C084FC"/></svg>`;
}
function finaleFallbackSVG(kind) {
  if (kind === 'success') {
    let conf = '';
    for (let i = 0; i < 18; i++) conf += `<rect x="${(i * 67) % 440}" y="${(i * 29) % 70}" width="7" height="3" rx="1" fill="${['#D7FF00', '#F0997B', '#85B7EB', '#F4C0D1'][i % 4]}" transform="rotate(${i * 41} ${(i * 67) % 440} ${(i * 29) % 70})"/>`;
    return `<svg viewBox="0 0 460 120" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="120" fill="#17201a"/>${conf}
      ${crowdFigs(16, 62)}<rect x="140" y="26" width="180" height="20" rx="10" fill="#D7FF00"/>
      <text x="230" y="40" text-anchor="middle" font-size="12" font-weight="700" fill="#26215C" font-family="sans-serif">iPlayground</text></svg>`;
  }
  if (kind === 'fail_gap') {
    return `<svg viewBox="0 0 460 120" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="120" fill="#1a1418"/>
      <rect x="110" y="30" width="240" height="60" rx="8" fill="#111" stroke="#333"/>
      <text x="230" y="58" text-anchor="middle" font-size="13" fill="#666" font-family="sans-serif">${L('議程表', 'AGENDA')}</text>
      <text x="230" y="80" text-anchor="middle" font-size="18" fill="#FF5D5D" font-family="sans-serif">？？？</text></svg>`;
  }
  return `<svg viewBox="0 0 460 120" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="120" fill="#131720"/>
    <rect x="60" y="70" width="40" height="24" rx="4" fill="#242424"/><rect x="130" y="70" width="40" height="24" rx="4" fill="#242424"/>
    <rect x="200" y="70" width="40" height="24" rx="4" fill="#242424"/><rect x="270" y="70" width="40" height="24" rx="4" fill="#242424"/>
    <rect x="340" y="70" width="40" height="24" rx="4" fill="#242424"/>
    <circle cx="230" cy="40" r="10" fill="#7F77DD"/><rect x="222" y="48" width="16" height="22" rx="4" fill="#534AB7"/>
    <text x="252" y="38" font-size="12" fill="#666" font-family="sans-serif">${L('好安靜……', 'so quiet...')}</text></svg>`;
}
function showPromoResult(gain, note) {
  $('promoEyebrow').textContent = L('📣 宣傳售票', '📣 Ticket Promo');
  $('promoTitle').textContent = L('宣傳出去了！', 'The word is out!');
  artInto($('promoArt'), 'promo', promoFallbackSVG());
  $('promoNum').className = 'big-num';
  $('promoNum').textContent = L(`報名 +${gain} 人`, `+${gain} signups`);
  $('promoNote').textContent = note;
  $('promoOk').textContent = L('讚 →', 'Nice →');
  $('promoOverlay').classList.add('show');
}
$('promoOk').addEventListener('click', () => $('promoOverlay').classList.remove('show'));

function showAnnounceModal(batch, est, remainTicks, covLine) {
  $('annEyebrow').textContent = L('📋 議程公布', '📋 Agenda Announced');
  $('annTitle').textContent = L('講者陣容亮相！', 'The lineup goes live!');
  artInto($('annArt'), 'announce', announceFallbackSVG());
  $('annTotalL').textContent = L('議程效應', 'Agenda effect');
  $('annOk').textContent = L('太好了 →', 'Awesome →');
  $('annRows').innerHTML = batch.map(r => {
    const c = SPEAKER_CARDS[r.idx];
    const acc = accentOf(c);
    const bCls = acc === 'dual' ? 'b-dual' : acc === 'w' ? 'b-w' : acc === 'lt' ? 'b-lt' : acc === 'intl' ? 'b-intl' : '';
    return `<div class="ann-row"><span class="nm"><span class="badge ${bCls}">${acc === 'dual' ? L('雙棲', 'Dual') : typeL(primaryType(c))}</span> ${esc(nm(c))}</span><span class="vl">${L('每週', '/wk')} +${WEEKLY_RANGE[typeKey(c)]}${isSelfSpeaker(c) ? ' ×2 🪞' : ''}</span></div>`;
  }).join('');
  $('annTotal').textContent = L(`約 +${est}／週`, `~+${est}/week`);
  let note = L(`陣容乘數 ×${lineupMult().toFixed(2)}，之後每週開始時持續進帳，還有 ${remainTicks} 次發酵機會（含活動日湧入）。`,
               `Lineup multiplier ×${lineupMult().toFixed(2)} — ticks at the start of every week, ${remainTicks} tick(s) left (incl. event-day rush).`);
  if (remainTicks <= 2) note += L(' 有點晚了……能吃到的複利不多！', ' Cutting it close... not much compounding left!');
  else note += L(' 陣容越大、每週越多——繼續邀人再公布也會疊上去。', ' Bigger lineup = bigger weekly gains — keep inviting and announcing to stack it.');
  if (covLine) note += ` ${covLine}`;
  $('annNote').textContent = note;
  $('annOverlay').classList.add('show');
}
$('annOk').addEventListener('click', () => $('annOverlay').classList.remove('show'));

/* ═══════════ modal：抽卡結果 ═══════════ */
/* 大卡照片：依序試高清 URL → 本機縮圖 → 字母縮寫 */
function fillPhoto(el, name, ...sources) {
  el.querySelectorAll('img, .monogram').forEach(x => x.remove());
  const srcs = sources.filter(Boolean);
  if (!srcs.length) return mono();
  let i = 0;
  const img = document.createElement('img');
  img.alt = name;
  img.onerror = () => { i += 1; if (i < srcs.length) img.src = srcs[i]; else { img.remove(); mono(); } };
  img.src = srcs[0];
  el.appendChild(img);
  function mono() {
    const m = document.createElement('div');
    m.className = 'monogram'; m.textContent = [...(name || '?')][0].toUpperCase();
    el.appendChild(m);
  }
}
/* intro 摺疊（過長時預設 3 行，點擊展開） */
function setCardIntro(text) {
  const el = $('cardIntro'), more = $('introMore');
  if (!text) { el.style.display = 'none'; more.style.display = 'none'; return; }
  el.style.display = ''; el.textContent = text;
  if (text.length > 80) {
    el.classList.add('clamp');
    more.style.display = ''; more.textContent = L('展開介紹 ▾', 'Read more ▾');
  } else {
    el.classList.remove('clamp'); more.style.display = 'none';
  }
}
function toggleIntro() {
  const el = $('cardIntro');
  const expanded = !el.classList.contains('clamp');
  el.classList.toggle('clamp', expanded);
  $('introMore').textContent = expanded ? L('展開介紹 ▾', 'Read more ▾') : L('收合 ▴', 'Show less ▴');
}
$('cardIntro').addEventListener('click', toggleIntro);
$('introMore').addEventListener('click', toggleIntro);

function showSpeakerCard(c, rosterEntry, preview) {
  const fromColl = !!rosterEntry;
  const acc = accentOf(c);
  const isSelf = isSelfSpeaker(c);
  $('cardModal').className = isSelf ? 'speaker-card diamond' : `speaker-card${acc ? ' acc-' + acc : ''}`;
  $('cardEyebrow').textContent = isSelf ? L('💎 本人卡！', '💎 It\'s You!')
    : preview ? L('📇 講者卡 · 正解', '📇 Speaker Card · Answer')
    : fromColl ? L('📇 講者卡', '📇 Speaker Card') : L('🎉 抽中講者卡', '🎉 Speaker Card Drawn!');
  fillPhoto($('cardPhoto'), nm(c), c.photo, c.photo_hd);
  $('cardName').textContent = nm(c);
  $('cardTitle').style.display = tt(c) ? '' : 'none';
  $('cardTitle').textContent = tt(c);
  const badges = c.types.map(t => `<span class="badge ${t === 'workshop' ? 'b-w' : t === 'lightning' ? 'b-lt' : ''}">${typeL(t)}</span>`);
  if (acc === 'dual') badges.unshift(`<span class="badge b-dual">${L('🌗 雙棲', '🌗 Dual')}</span>`);
  if (isSelf) badges.unshift(`<span class="badge b-dual">${L('🪞 本人卡 · 總召親自登台', '🪞 It\'s You · The Chief on stage')}</span>`);
  if (rosterEntry && rosterEntry.interviewed) badges.unshift(`<span class="badge b-dual">${L('⭐ 已深度專訪', '⭐ Interviewed')}</span>`);
  c.cats.forEach(k => badges.push(`<span class="badge">${catL(k)}</span>`));
  if (c.intl) badges.push(`<span class="badge b-intl">${L('🌐 國際講者', '🌐 International')}</span>`);
  $('cardBadges').innerHTML = badges.join('');
  setCardIntro((lang === 'en' && c.intro_en) ? c.intro_en : c.intro);
  const sessions = c.sessions || [{ day: '', time: '', title: c.talk, title_en: c.talk_en }];
  $('cardSessions').style.display = '';
  $('cardSessions').innerHTML = sessions.map(s => `
    <div class="card-session">${s.day ? `<span class="d">${esc(s.day)}</span>` : ''}${s.time ? `<span class="tm">${esc(s.time)}</span>` : ''}<span class="t">${esc((lang === 'en' && s.title_en) ? s.title_en : s.title)}</span></div>`).join('');
  const dual = c.types.length > 1 ? L('（雙棲卡：同時計入兩種講者名額！）', ' (Dual card: counts for both speaker slots!)') : '';
  const selfNote = isSelf ? L('　🪞 本人加成：每週報名 ×2！', ' 🪞 Self bonus: ×2 weekly signups!') : '';
  const ivNote = (rosterEntry && rosterEntry.interviewed) ? L(`　⭐ 已深度專訪 · 每週發酵 +${INTERVIEW_BONUS}`, ` ⭐ Interviewed · +${INTERVIEW_BONUS} signups/week`) : '';
  $('cardEffect').textContent = (fromColl
    ? (rosterEntry.announced
        ? L(`✓ 已公布 · 至今帶來 ${rosterEntry.contrib} 名報名${dual}`, `✓ Announced · ${rosterEntry.contrib} signups so far${dual}`)
        : L(`尚未公布 · ${announceHint(c)}${dual}`, `Not announced yet · ${announceHint(c)}${dual}`))
    : announceHint(c) + dual) + selfNote + ivNote;
  $('cardOk').textContent = (fromColl || preview) ? L('關閉', 'Close') : L('收下 →', 'Take it →');
  $('cardOverlay').classList.add('show');
}
function showStaffCard(c, fromColl) {
  // 彩蛋：抽到跟總召同名的工作人員（名字任一 token 命中）→ 鑽石卡
  const isSelf = isSelfName(c.name);
  $('cardModal').className = isSelf ? 'speaker-card diamond' : 'speaker-card';
  $('cardEyebrow').textContent = isSelf ? L('💎 本人卡！', '💎 It\'s You!')
    : fromColl ? L('📇 工作人員卡', '📇 Staff Card') : L('🙌 招募到工作人員', '🙌 Staff Recruited!');
  fillPhoto($('cardPhoto'), c.name, c.photo, c.photo_hd);
  $('cardName').textContent = c.name;
  $('cardTitle').style.display = 'none';
  $('cardBadges').innerHTML = isSelf
    ? `<span class="badge intl">${L('🪞 本人卡 · 總召親自下場', '🪞 It\'s You · The Chief in person')}</span>`
    : `<span class="badge">${L('🙋 工作人員', '🙋 Staff')}</span>`;
  setCardIntro(isSelf ? L('「等等，這不是我自己嗎？」——你抽到了你自己。', '"Wait, isn\'t that... me?" — You drew yourself.') : '');
  $('cardSessions').style.display = 'none';
  const bonus = Math.floor(S.staff.length / 3);
  const next = 3 - (S.staff.length % 3);
  $('cardEffect').textContent = (fromColl ? '' : L('戰力 +1！', 'Crew +1! ')) +
    L(`目前 ${S.staff.length} 位 → 每週行動點 +${bonus}`, `${S.staff.length} staff → +${bonus} AP per week`) +
    (S.staff.length % 3 ? L(`（再 ${next} 位再 +1）`, ` (${next} more for another +1)`) : '') +
    (isSelf ? L('　🪞 本人加成：行動點立刻 +1，每週再固定 +1！', ' 🪞 Self bonus: +1 AP now, +1 every week!') : '');
  $('cardOk').textContent = fromColl ? L('關閉', 'Close') : L('收下 →', 'Take it →');
  $('cardOverlay').classList.add('show');
}
$('cardOk').addEventListener('click', () => $('cardOverlay').classList.remove('show'));
$('cardClose').addEventListener('click', () => $('cardOverlay').classList.remove('show'));
$('cardOverlay').addEventListener('click', e => { if (e.target === $('cardOverlay')) $('cardOverlay').classList.remove('show'); });

/* ═══════════ 卡冊 ═══════════ */
function miniPh(photo, name) {
  return `<div class="ph">${photo ? `<img src="${photo}" alt="" loading="lazy">` : `<div class="mono">${esc([...name][0].toUpperCase())}</div>`}</div>`;
}
function renderCollection() {
  $('collSpCount').textContent = S.roster.length ? `×${S.roster.length}` : '';
  $('collStCount').textContent = S.staff.length ? `×${S.staff.length}` : '';
  $('collSpeakers').innerHTML = S.roster.map((r, i) => {
    const c = SPEAKER_CARDS[r.idx];
    const acc = accentOf(c);
    return `<div class="mini ${acc ? 'acc-' + acc : ''}${r.interviewed ? ' iv-done' : ''}" data-i="${i}">
      ${r.interviewed ? '<div class="iv-star">⭐</div>' : ''}${miniPh(c.photo, nm(c))}
      <div class="nm">${esc(nm(c))}</div>
      <div class="st2 ${r.announced ? 'pub' : ''}">${r.announced ? L('✓ 已公布', '✓ Announced') : L('未公布', 'Unannounced')}</div>
    </div>`;
  }).join('') || `<div class="coll-empty">${L('還沒抽到講者卡——快去邀請講者！', 'No speaker cards yet — go invite some!')}</div>`;
  $('collStaff').innerHTML = S.staff.map((idx, i) => {
    const c = STAFF_CARDS[idx];
    return `<div class="mini staffc" data-i="${i}">
      ${miniPh(c.photo, c.name)}
      <div class="nm">${esc(c.name)}</div>
    </div>`;
  }).join('') || `<div class="coll-empty">${L('還沒招募到工作人員', 'No staff recruited yet')}</div>`;
}
$('collSpeakers').addEventListener('click', e => {
  const m = e.target.closest('.mini'); if (!m) return;
  const r = S.roster[+m.dataset.i]; if (r) showSpeakerCard(SPEAKER_CARDS[r.idx], r);
});
$('collStaff').addEventListener('click', e => {
  const m = e.target.closest('.mini'); if (!m) return;
  const idx = S.staff[+m.dataset.i]; if (idx != null) showStaffCard(STAFF_CARDS[idx], true);
});

/* ═══════════ 成就（對照 iOS 版 earnedAchievements） ═══════════ */
function earnedAchievements() {
  const out = [];
  if (S.reg > REG_CAP) out.push('soldOut');
  if (STAFF_CARDS.length && S.staff.length === STAFF_CARDS.length) out.push('allStaff');
  const rosterSet = new Set(S.roster.map(r => r.idx));
  const hasAll = t => {
    const all = SPEAKER_CARDS.map((c, i) => c.types.includes(t) ? i : -1).filter(i => i >= 0);
    return all.length > 0 && all.every(i => rosterSet.has(i));
  };
  if (hasAll('workshop')) out.push('allWorkshop');
  if (hasAll('lightning')) out.push('allLightning');
  if (hasAll('regular')) out.push('allRegular');
  if (rosterSet.size === SPEAKER_CARDS.length) out.push('allSpeakers');
  return out;
}
function achievementLabel(a) {
  switch (a) {
    case 'soldOut': return L(`🏆 爆場！突破 ${REG_CAP} 人滿員（最終 ${S.reg} 人）`, `🏆 Sold out and beyond! Past ${REG_CAP} (final: ${S.reg})`);
    case 'allStaff': return L('🙌 全員到齊：蒐集全部工作人員！', '🙌 Full crew: every staff member collected!');
    case 'allWorkshop': return L('🛠 Workshop 大滿貫：蒐集全部 Workshop 講者！', '🛠 Workshop grand slam: every workshop speaker collected!');
    case 'allLightning': return L('⚡ Lightning 大滿貫：蒐集全部 Lightning 講者！', '⚡ Lightning grand slam: every lightning speaker collected!');
    case 'allRegular': return L('🎤 一般講者大滿貫：蒐集全部一般講者！', '🎤 Regular grand slam: every regular speaker collected!');
    case 'allSpeakers': return L('👑 傳說收藏家：蒐集所有講者！（這真的發生了？！）', '👑 Legendary collector: EVERY speaker collected! (How?!)');
  }
}

/* ═══════════ 結算 ═══════════ */
function finale() {
  agendaTick(L('活動日湧入', 'Event-day rush'));
  S.over = true;
  renderScene();
  const reg = S.reg, regular = countType('regular'), ws = countType('workshop'), lt = countType('lightning');
  const cov = regularCats().size, intl = intlCount();
  const fin = $('finaleOverlay');
  const rows = [];
  $('finEyebrow').textContent = L('活動日', 'Event Day');
  $('finRestart').textContent = L('回到首頁 →', 'Back to title →');
  $('finAchievements').innerHTML = earnedAchievements()
    .map(a => `<div class="fin-ach">${achievementLabel(a)}</div>`).join('');

  const reqOk = regular >= 3 && ws >= 1 && lt >= 1;
  const firstFail = localStorage.getItem('ipg_boost') !== '1';
  const boostNote = firstFail
    ? L('<br><br>💪 籌委會痛定思痛，追加了預算——下一輪起每週基礎行動點 3 點！', '<br><br>💪 The committee learns its lesson and adds budget — from the next run, base AP is 3 per week!')
    : '';

  if (!reqOk) {
    $('finTitle').textContent = L('議程開天窗……', 'Gaps in the program...');
    artInto($('finArt'), 'fail_gap', finaleFallbackSVG('fail_gap'));
    $('finGrade').textContent = 'FAIL';
    $('finGrade').className = 'grade fail';
    $('finDesc').innerHTML = L(`講者陣容沒湊齊，活動辦不起來。<br>一般講者 ${regular}/3 · Workshop ${ws}/1 · Lightning ${lt}/1`,
                               `The lineup never came together.<br>Regular ${regular}/3 · Workshop ${ws}/1 · Lightning ${lt}/1`) + boostNote;
    $('finScores').innerHTML = '';
    $('finSlogan').textContent = L('明年捲土重來……', 'There\'s always next year...');
    localStorage.setItem('ipg_boost', '1');
  } else if (reg < REG_FAIL) {
    $('finTitle').textContent = L('現場冷冷清清……', 'The venue feels... empty');
    artInto($('finArt'), 'fail_quiet', finaleFallbackSVG('fail_quiet'));
    $('finGrade').textContent = 'FAIL';
    $('finGrade').className = 'grade fail';
    $('finDesc').innerHTML = L(`只來了 <b>${reg}</b> 人（及格線 ${REG_FAIL}）。講者很棒，但世界還不知道。`,
                               `Only <b>${reg}</b> signups (needed ${REG_FAIL}). Great speakers — the world just never heard about them.`) + boostNote;
    $('finScores').innerHTML = '';
    $('finSlogan').textContent = L('宣傳，宣傳，宣傳……', 'Promote, promote, promote...');
    localStorage.setItem('ipg_boost', '1');
  } else {
    const covPts = cov * 10, intlPts = intl * 15;
    const score = reg + covPts + intlPts;
    const grade = score >= 430 ? 'S' : score >= 360 ? 'A' : score >= 290 ? 'B' : 'C';
    $('finTitle').textContent = reg >= REG_CAP ? L('350 人滿員成功！🎉', 'Sold out at 350! 🎉') : L('活動順利落幕！', 'The event is a wrap!');
    artInto($('finArt'), 'success', finaleFallbackSVG('success'));
    $('finGrade').textContent = grade;
    $('finGrade').className = 'grade';
    $('finDesc').textContent = L(`${playerName} 總召——`, `Chief ${playerName} — `) + ({
      S: L('傳說級的一屆！連走廊都是精彩的討論。', 'a legendary edition! Even the hallway track was on fire.'),
      A: L('賓主盡歡，社群都在敲碗明年。', 'everyone went home happy, and the community is already asking about next year.'),
      B: L('穩穩的一場好活動，還有進步空間。', 'a solid event, with room to grow.'),
      C: L('驚險過關！明年會更好。', 'a close call — next year will be better!'),
    })[grade];
    rows.push(`<div><span>${L('報名人數', 'Signups')}</span><b>${reg}</b></div>`);
    rows.push(`<div><span>${L(`Tag 多樣性（${cov}/6 × 10）`, `Tag diversity (${cov}/6 × 10)`)}</span><b>${covPts}</b></div>`);
    rows.push(`<div><span>${L(`國際講者（${intl} × 15）`, `International speakers (${intl} × 15)`)}</span><b>${intlPts}</b></div>`);
    rows.push(`<div><span>${L('總分', 'Total score')}</span><b>${score}</b></div>`);
    $('finScores').innerHTML = rows.join('');
    $('finSlogan').textContent = L('「我們 iPlayground 見！」', '"See you at iPlayground!"');
    burstConfetti(); setTimeout(burstConfetti, 600); setTimeout(burstConfetti, 1200);
  }
  fin.classList.add('show');
}
$('finRestart').addEventListener('click', () => location.reload());

/* ═══════════ 轉盤（移植自講者抽抽樂） ═══════════ */
const wheelCanvas = $('wheel');
const ctx = wheelCanvas.getContext('2d');
let wheelMode = 'speaker';
let rotation = 0;
let spinning = false;
let highlightIdx = -1;
const POINTER_ANGLE = -Math.PI / 2;

function currentPool() { return wheelMode === 'speaker' ? S.speakerPool : S.staffPool; }
function poolName(i) { return wheelMode === 'speaker' ? nm(SPEAKER_CARDS[i]) : STAFF_CARDS[i].name; }
function segFill(i, poolIdx) {
  if (wheelMode === 'staff') return i % 2 ? '#1A1A1A' : '#111111';
  const a = accentOf(SPEAKER_CARDS[poolIdx]);
  if (a) return ACCENT_FILL[a];
  return i % 2 ? '#1A1A1A' : '#111111';
}
function labelColor(poolIdx) {
  if (wheelMode === 'staff') return '#FFFFFF';
  const a = accentOf(SPEAKER_CARDS[poolIdx]);
  return a ? ACCENT_INK[a] : '#FFFFFF';
}
function sizeCanvas() {
  const rect = wheelCanvas.getBoundingClientRect();
  if (!rect.width) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  wheelCanvas.width = rect.width * dpr;
  wheelCanvas.height = rect.height * dpr;
  drawWheel();
}
function drawWheel() {
  const w = wheelCanvas.width, h = wheelCanvas.height;
  const cx = w / 2, cy = h / 2;
  const R = Math.min(cx, cy) - 6;
  ctx.clearRect(0, 0, w, h);
  const pool = currentPool();
  const n = pool.length;
  if (n === 0) {
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = '#111111'; ctx.fill();
    ctx.strokeStyle = 'rgba(215,255,0,0.28)'; ctx.lineWidth = 2; ctx.stroke();
    return;
  }
  const seg = (Math.PI * 2) / n;
  for (let i = 0; i < n; i++) {
    const a0 = rotation + i * seg;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, a0, a0 + seg); ctx.closePath();
    ctx.fillStyle = i === highlightIdx ? '#D7FF00' : segFill(i, pool[i]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(215,255,0,0.22)'; ctx.lineWidth = 1; ctx.stroke();
  }
  const base = Math.max(11, R * 0.055);
  for (let i = 0; i < n; i++) {
    const mid = rotation + (i + 0.5) * seg;
    const name = poolName(pool[i]);
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(mid);
    let normalized = mid % (Math.PI * 2);
    if (normalized < 0) normalized += Math.PI * 2;
    const flipped = normalized > Math.PI / 2 && normalized < Math.PI * 1.5;
    if (flipped) { ctx.rotate(Math.PI); ctx.textAlign = 'left'; } else { ctx.textAlign = 'right'; }
    ctx.textBaseline = 'middle';
    let fs = base;
    ctx.font = `700 ${fs}px ${'-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, "PingFang TC", sans-serif'}`;
    const maxW = R * 0.52;
    const tw = ctx.measureText(name).width;
    if (tw > maxW) {
      fs = Math.max(9, fs * maxW / tw);
      ctx.font = `700 ${fs}px ${'-apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, "PingFang TC", sans-serif'}`;
    }
    ctx.fillStyle = i === highlightIdx ? '#000000' : labelColor(pool[i]);
    ctx.fillText(name, flipped ? -R * 0.94 : R * 0.94, 0);
    ctx.restore();
  }
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(215,255,0,0.45)'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#000000'; ctx.fill();
}
function nextFrame(cb) {
  let done = false;
  const raf = requestAnimationFrame(() => { if (!done) { done = true; clearTimeout(to); cb(performance.now()); } });
  const to = setTimeout(() => { if (!done) { done = true; cancelAnimationFrame(raf); cb(performance.now()); } }, 60);
}
function poolPosAtPointer() {
  const n = currentPool().length;
  const seg = (Math.PI * 2) / n;
  let a = (POINTER_ANGLE - rotation) % (Math.PI * 2);
  if (a < 0) a += Math.PI * 2;
  return Math.floor(a / seg) % n;
}
function spinWheel(mode, winnerIdx, onDone) {
  if (spinning) return;
  wheelMode = mode;
  highlightIdx = -1;
  const pool = currentPool();
  const winner = pool.indexOf(winnerIdx);
  const n = pool.length;
  const seg = (Math.PI * 2) / n;
  const card = mode === 'speaker' ? SPEAKER_CARDS[winnerIdx] : STAFF_CARDS[winnerIdx];
  if (card.photo) new Image().src = card.photo;

  const jitter = (Math.random() * 0.7 - 0.35) * seg;
  const target = POINTER_ANGLE - (winner + 0.5) * seg + jitter;
  const turns = reducedMotion ? 1 : 4 + Math.floor(Math.random() * 2);
  let final = target;
  while (final < rotation + turns * Math.PI * 2) final += Math.PI * 2;

  const start = rotation, delta = final - start;
  const dur = reducedMotion ? 500 : 2400 + Math.random() * 600;
  let lastTickPos = poolPosAtPointer();

  spinning = true;
  $('wheelMode').innerHTML = mode === 'speaker'
    ? L(`正在邀請 <b>講者</b>……（池內剩 ${n} 位）`, `Inviting a <b>speaker</b>… (${n} left in pool)`)
    : L(`正在招募 <b>工作人員</b>……（池內剩 ${n} 位）`, `Recruiting <b>staff</b>… (${n} left in pool)`);
  $('wheelOverlay').classList.add('show');
  sizeCanvas();
  render();

  let t0 = null;
  function frame(now) {
    if (t0 === null) t0 = now;
    const t = Math.min(1, (now - t0) / dur);
    const ease = 1 - Math.pow(1 - t, 3.2);
    rotation = start + delta * ease;
    drawWheel();
    const p = poolPosAtPointer();
    if (p !== lastTickPos) { tick(); lastTickPos = p; }
    if (t < 1) { nextFrame(frame); }
    else {
      rotation = final % (Math.PI * 2);
      spinning = false;
      highlightIdx = winner;
      drawWheel();
      fanfare();
      if (!reducedMotion) burstConfetti();
      setTimeout(() => {
        highlightIdx = -1;
        $('wheelOverlay').classList.remove('show');
        onDone();
      }, reducedMotion ? 0 : 700);
    }
  }
  setTimeout(() => nextFrame(frame), reducedMotion ? 0 : 350);
}

/* ═══════════ 音效 ═══════════ */
let actx = null;
function audio() { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); return actx; }
function tick() {
  try {
    const a = audio(), o = a.createOscillator(), g = a.createGain();
    o.type = 'square'; o.frequency.value = 1600;
    g.gain.setValueAtTime(0.03, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.03);
    o.connect(g).connect(a.destination);
    o.start(); o.stop(a.currentTime + 0.035);
  } catch (e) {}
}
function fanfare() {
  try {
    const a = audio();
    [523.25, 659.25, 880].forEach((f, i) => {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'triangle'; o.frequency.value = f;
      const t = a.currentTime + i * 0.09;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
      o.connect(g).connect(a.destination);
      o.start(t); o.stop(t + 0.45);
    });
  } catch (e) {}
}

/* ═══════════ 彩帶 ═══════════ */
const confettiCanvas = $('confetti');
const cctx = confettiCanvas.getContext('2d');
let particles = [], confettiRunning = false;
function sizeConfetti() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  confettiCanvas.width = innerWidth * dpr;
  confettiCanvas.height = innerHeight * dpr;
  cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function burstConfetti() {
  sizeConfetti();
  const colors = ['#D7FF00', '#FFFFFF', '#D9D9D9', '#9DBB00'];
  const rect = wheelCanvas.getBoundingClientRect();
  const wheelVisible = rect.width > 0 && $('wheelOverlay').classList.contains('show');
  const ox = wheelVisible ? rect.left + rect.width / 2 : innerWidth / 2;
  const oy = wheelVisible ? rect.top + rect.height / 2 : innerHeight / 2;
  for (let i = 0; i < 120; i++) {
    const ang = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9;
    particles.push({ x: ox, y: oy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 3,
      w: 4 + Math.random() * 6, h: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      c: colors[Math.floor(Math.random() * colors.length)], life: 1 });
  }
  if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(confettiFrame); }
}
function confettiFrame() {
  cctx.clearRect(0, 0, innerWidth, innerHeight);
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.22; p.vx *= 0.99;
    p.rot += p.vr; p.life -= 0.011;
    cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.rot);
    cctx.globalAlpha = Math.max(0, p.life);
    cctx.fillStyle = p.c;
    cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    cctx.restore();
  }
  if (particles.length) requestAnimationFrame(confettiFrame);
  else { confettiRunning = false; cctx.clearRect(0, 0, innerWidth, innerHeight); }
}

/* ═══════════ render ═══════════ */
function render() {
  $('timeL').innerHTML = L(`⏳ 時間 · 第 <b>${S.week}</b> / ${TOTAL_WEEKS} 週`, `⏳ Time · Week <b>${S.week}</b> / ${TOTAL_WEEKS}`);
  $('timeFill').style.width = `${(S.week / TOTAL_WEEKS) * 100}%`;
  $('crowdL').innerHTML = L(`🎟 會眾 · <b>${S.reg}</b>（及格線 ${REG_FAIL}）`, `🎟 Crowd · <b>${S.reg}</b> (pass: ${REG_FAIL})`);
  $('crowdFill').style.width = `${Math.min(100, (S.reg / REG_CAP) * 100)}%`;
  $('apL').textContent = L('行動點', 'AP');
  const base = Math.max(weeklyApBase(), S.ap);
  $('apPips').innerHTML = Array.from({ length: base }, (_, i) =>
    `<span class="pip ${i < S.ap ? '' : 'used'}"></span>`).join('') + `<span class="ap-num">${S.ap}</span>`;

  const g = [
    { label: L(`一般講者 ${countType('regular')}/3`, `Regular ${countType('regular')}/3`), ok: countType('regular') >= 3 },
    { label: `Workshop ${countType('workshop')}/1`, ok: countType('workshop') >= 1 },
    { label: `Lightning ${countType('lightning')}/1`, ok: countType('lightning') >= 1 },
    { label: L(`🌐 國際講者 ×${intlCount()}`, `🌐 International ×${intlCount()}`), ok: intlCount() > 0 },
  ];
  $('goals').innerHTML = g.map(x => `<span class="goal ${x.ok ? 'ok' : ''}">${x.label}</span>`).join('');
  const cov = regularCats();
  $('cats').innerHTML = CAT_KEYS.map(k => `<span class="cat ${cov.has(k) ? 'on' : ''}">${catL(k)}</span>`).join('');
  renderCollection();
  const bonus = Math.floor(S.staff.length / 3);
  $('staffLine').innerHTML = L(
    `🙋 工作人員 <b>${S.staff.length}</b> 位${bonus ? ` → 每週行動點 +${bonus}` : ''}${S.staff.length % 3 ? `（再 ${3 - S.staff.length % 3} 位再 +1）` : ''}`,
    `🙋 Staff: <b>${S.staff.length}</b>${bonus ? ` → +${bonus} AP/week` : ''}${S.staff.length % 3 ? ` (${3 - S.staff.length % 3} more for +1)` : ''}`);
  const annCount = S.roster.filter(r => r.announced).length;
  $('agendaLine').innerHTML = annCount
    ? L(`📈 議程效應：每週約 <b>+${estimateWeekly()}</b>（陣容 ${annCount} 位 × ${lineupMult().toFixed(2)}${S.covBonusGiven ? ' · 🌈已含多樣性加成' : ''}）`,
        `📈 Agenda effect: ~<b>+${estimateWeekly()}</b>/week (lineup ${annCount} × ${lineupMult().toFixed(2)}${S.covBonusGiven ? ' · 🌈 diversity incl.' : ''})`)
    : L('📈 議程效應：尚未公布議程——講者公布後才會每週帶來報名', '📈 Agenda effect: nothing announced yet — speakers only draw signups once announced');

  $('actInvite').disabled = !canInvite();
  $('actStaff').disabled = !canStaff();
  $('actPromo').disabled = !canPromo();
  $('actAnnounce').disabled = !canAnnounce();
  $('actInterview').disabled = !canInterview();
  $('interviewSub').textContent = S.interviewDone ? L('本週已專訪', 'used this week') : L('每週 1 次', '1× per week');
  $('endWeek').disabled = spinning || S.over || msgBusy;
  const sideLock = msgBusy || spinning;   // 專訪/事件敘事期間鎖側欄——做功課要在行動前
  $('sbBinder').disabled = sideLock;
  $('sbLineup').disabled = sideLock;
  $('sbLog').disabled = sideLock;
  $('endWeekL').textContent = S.week >= TOTAL_WEEKS ? L('🎪 迎接活動日', '🎪 Event day!') : L('⏭ 結束本週', '⏭ End week');
  $('endWeekSub').textContent = S.week >= TOTAL_WEEKS ? L('結算！', 'Final tally!') : L(`第 ${S.week} 週`, `week ${S.week}`);
  const remain = S.speakerDrawLimit - S.drawsThisWeek;
  $('inviteSub').textContent = S.freeDraws > 0 ? L(`免費抽卡 ×${S.freeDraws}！`, `Free draw ×${S.freeDraws}!`) : L(`本週剩 ${Math.max(0, remain)} 次`, `${Math.max(0, remain)} left`);
  const unann = S.roster.filter(r => !r.announced).length;
  $('announceSub').textContent = unann ? L(`${unann} 位待公布`, `${unann} to announce`) : L('沒有待公布', 'none pending');
  $('pityHint').innerHTML = S.forcedType
    ? `<span class="warn">🎯 ${esc(S.forcedReason)}${L('：下一抽鎖定「', ': next draw locked to "')}${typeL(S.forcedType)}${L('」', '"')}</span>`
    : (S.week >= 7 && (countType('workshop') === 0 || countType('lightning') === 0))
      ? `<span class="warn">${L('⚠️ 還缺必要講者類型！', '⚠️ Missing a required speaker type!')}</span>` : '';
  $('roleTag').innerHTML = L(`總召 <b>${esc(playerName || '???')}</b> · 距離活動日 ${TOTAL_WEEKS - S.week + 1} 週`,
                             `Chief <b>${esc(playerName || '???')}</b> · ${TOTAL_WEEKS - S.week + 1} wk to showtime`);
}

/* ═══════════ 靜態文案 ═══════════ */
function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = L('iPlayground 主辦模擬器', 'iPlayground Organizer Sim');
  $('langToggle').textContent = L('EN', '中文');
  $('introLang').textContent = L('EN', '中文');
  $('sbBinderL').textContent = L('卡冊', 'Binder');
  $('sbLineupL').textContent = L('講者陣容', 'Lineup');
  $('sbLogL').textContent = L('籌備日誌', 'Log');
  $('actInviteL').textContent = L('🎤 邀請講者', '🎤 Invite');
  $('actStaffL').textContent = L('🙋 招募人手', '🙋 Recruit');
  $('actPromoL').textContent = L('📣 宣傳售票', '📣 Promote');
  $('actAnnounceL').textContent = L('📋 公布議程', '📋 Announce');
  $('actInterviewL').textContent = L('🎙 深度專訪', '🎙 Interview');
  $('staffSub').textContent = L('每 3 位 +1 AP', 'every 3 → +1 AP');
  $('promoSub').textContent = L('2d6＋公布加成', '2d6 + bonus');
  $('interviewT').textContent = L('🎙 深度專訪 · 選擇對象', '🎙 Deep Interview · Choose a Speaker');
  $('interviewHint').textContent = L('免費、每週 1 次。答對 2 題就讓他升 ⭐——公布後每週發酵 +2。翻卡冊做功課要趁現在！',
    'Free, once per week. Ace 2 questions to earn a ⭐ — +2 weekly signups once announced. Do your homework in the Binder first!');
  $('interviewClose').textContent = L('關閉', 'Close');
  $('binderT').textContent = L('🃏 卡冊（點卡片看詳情）', '🃏 Card Binder (tap to view)');
  const legendHTML =
    `<span class="lg-w">Workshop</span>` +
    `<span class="lg-lt">Lightning</span>` +
    `<span class="lg-intl">${L('國際講者', 'International')}</span>` +
    `<span class="lg-dual">${L('雙棲', 'Dual')}</span>`;
  $('legendBinder').innerHTML = legendHTML;
  $('legendLineup').innerHTML = legendHTML;
  $('lineupT').textContent = L('🎤 講者陣容', '🎤 Speaker Lineup');
  $('logT').textContent = L('📓 籌備日誌', '📓 Organizer Log');
  $('binderClose').textContent = L('關閉', 'Close');
  $('lineupClose').textContent = L('關閉', 'Close');
  $('logClose').textContent = L('關閉', 'Close');
  $('tagDivL').textContent = L('一般講者 Tag 多樣性（全亮 = 議程效應 ×1.2）', 'Regular-speaker tag diversity (all lit = agenda ×1.2)');
  $('collSpL').innerHTML = L('🎤 講者卡 ', '🎤 Speaker cards ') + '<span id="collSpCount"></span>';
  $('collStL').innerHTML = L('🙋 工作人員卡 ', '🙋 Staff cards ') + '<span id="collStCount"></span>';
  $('rotateMsg').textContent = L('請將手機轉成橫向遊玩體驗最佳！', 'Rotate your phone to landscape for the best experience!');
  $('rotateDismiss').textContent = L('仍要直式繼續', 'Continue in portrait anyway');
  // 首頁
  $('tTitle').innerHTML = L('關於我轉生成 <span class="neon">iPlayground</span><br>總召這件事', 'That Time I Got Reincarnated<br>as the <span class="neon">iPlayground</span> Organizer');
  $('tSub').textContent = L('肉鴿抽卡 × 研討會主辦模擬', 'A roguelike deck-drawing conference organizer sim');
  $('tStart').textContent = L('▶ 開始', '▶ Start');
  $('tLang').textContent = L('🌐 中 / EN', '🌐 中 / EN');
  $('tDiff').textContent = L(`⚙️ 難度：${diffName()}`, `⚙️ Difficulty: ${diffName()}`);
  $('dEasy').innerHTML = L('低<small>好事件變多、壞事件變少——輕鬆辦一場</small>', 'Easy<small>More good events, fewer bad ones — a gentle ride</small>');
  $('dNormal').innerHTML = L('中<small>標準機率——總召的日常</small>', 'Normal<small>Standard odds — an organizer\'s everyday life</small>');
  $('dHard').innerHTML = L('高<small>壞事件變多、好事件變少——地獄籌備期</small>', 'Hard<small>More bad events, fewer good ones — organizer hell</small>');
  $('tDiffBack').textContent = L('← 返回', '← Back');
  ['dEasy', 'dNormal', 'dHard'].forEach((id, i) => {
    $(id).classList.toggle('sel', ['easy', 'normal', 'hard'][i] === difficulty);
  });
  $('ctaTicket').textContent = L('🎟️ 想去現場玩？立即購票', '🎟️ Ready for the real thing? Get tickets');
  $('ctaSite').textContent = L('想知道更多 → 官網走起', 'Learn more → official site');
  $('finTicket').textContent = L('🎟️ 來參加真的 iPlayground！立即購票', '🎟️ Join the real iPlayground — get tickets');
  $('finSite').textContent = L('想知道更多 → 官網走起', 'Learn more → official site');
  $('introArt').innerHTML = INTRO_IMAGE ? `<img src="${INTRO_IMAGE}" alt="">` : '';
  $('iEyebrow1').textContent = L('iPlayground 籌備委員會', 'iPlayground Organizing Committee');
  $('iTitle1').textContent = L('恭喜（？）你被推選為本屆總召 🫡', 'Congrats(?) — you\'re this year\'s Chief Organizer 🫡');
  $('iDesc1').textContent = L('距離活動日還有 9 週。先請教總召大名：', 'Nine weeks to event day. First, your name, Chief:');
  $('nameInput').placeholder = L('輸入你的名字', 'Enter your name');
  $('nameOk').textContent = L('就是我 →', 'That\'s me →');
  $('briefLead').textContent = L('這次的目標，需要完成的事項如下：', 'Here\'s what needs to happen:');
  $('goalList').innerHTML = [
    L('🎤 一般講者至少 <b>3</b> 位', '🎤 At least <b>3</b> regular speakers'),
    L('🛠 Workshop 講者至少 <b>1</b> 位', '🛠 At least <b>1</b> workshop speaker'),
    L('⚡ Lightning Talk 講者至少 <b>1</b> 位', '⚡ At least <b>1</b> lightning talk speaker'),
    L('🌈 講者主題湊滿 <b>6 大 tag</b>（有報名加成）', '🌈 Cover all <b>6 topic tags</b> (signup bonus)'),
    L('🎟 報名衝上 <b>350 滿員</b>——低於 200 人就失敗', '🎟 Fill the house at <b>350</b> — under 200 means failure'),
  ].map(x => `<li>${x}</li>`).join('');
  $('c200').innerHTML = L('⚠️ 人數至少要過 <b>200 位</b>喔！', '⚠️ You need at least <b>200 attendees</b>!');
  $('cTags').innerHTML = L('🌈 要盡量湊齊<b>不同屬性講者</b>喔！', '🌈 Mix up your <b>speaker topics</b> as much as you can!');
  $('apNote').innerHTML = apBaseStart() === 3
    ? L('💪 籌委會追加了預算：每週基礎行動點 <b>3</b> 點！', '💪 Extra budget this year: base <b>3</b> AP per week!')
    : L('📌 每週基礎行動點只有 <b>2</b> 點——第一屆總是比較辛苦……', '📌 Only <b>2</b> base AP per week — year one is always rough...');
  $('briefDesc').innerHTML = L('每週用行動點邀講者、招募工作人員、宣傳售票、公布議程。<b>公布議程後，講者陣容會「每週持續」帶來報名</b>——越早公布、發酵的週數越多（複利）；但陣容越大、每週的加成數字越高。抓好時機！每週還會發生一個事件。',
    'Spend AP to invite speakers, recruit staff, promote tickets, and announce the agenda. <b>Once announced, your lineup keeps bringing signups every single week</b> — announce early to compound longer, but a bigger lineup means bigger weekly gains. Timing is everything! An event pops every week too.');
  $('introStart').textContent = L('開始籌備 →', 'Start organizing →');
  // 操作說明
  $('helpEyebrow').textContent = L('操作說明', 'How to play');
  $('helpTitle').textContent = L('開工前 30 秒看懂玩法 👀', '30 seconds before you start 👀');
  $('helpRows').innerHTML = [
    [ '💬', L('劇情都在<span class="neon">訊息欄</span>', 'The story lives in the <span class="neon">message box</span>'),
      L('場景下方的黑框會逐字打出劇情與事件——看到「▼」就<b>點一下訊息欄</b>繼續，選項也會出現在裡面。訊息沒走完，按鈕會先鎖住。', 'The box under the scene types out the story — when you see “▼”, <b>tap the box</b> to continue. Choices appear there too. Buttons stay locked until the message finishes.') ],
    [ '🎛', L('底部按鈕＝花行動點做事', 'Bottom buttons = spend AP'),
      L('邀講者、招募人手、宣傳、公布議程。行動點用完就按「結束本週」進下一週。', 'Invite, recruit, promote, announce. Out of AP? Hit “End week” to move on.') ],
    [ '🃏', L('右側三顆隨時查', 'Side buttons = quick reference'),
      L('卡冊看抽到的卡、講者陣容看目標進度、籌備日誌看流水帳。', 'Binder for your cards, Lineup for goal progress, Log for the history.') ],
    [ '⏳', L('上方進度條', 'Top bars'),
      L('9 週內把報名衝過 200 人及格線，目標 350 滿員！', 'Pass 200 signups within 9 weeks — 350 is a full house!') ],
  ].map(([icon, title, desc]) => `<div class="help-row"><span class="hi">${icon}</span><div><b>${title}</b><p>${desc}</p></div></div>`).join('');
  $('helpOk').textContent = L('知道了，開工！→', 'Got it, let\'s go! →');
  if (playerName) {
    $('greetTitle').textContent = L(`${playerName} 總召您好！`, `Hello, Chief ${playerName}!`);
    $('cheerLine').textContent = L(`${playerName} 總召麻煩你了，相信你可以！`, `We're counting on you, Chief ${playerName} — you've got this!`);
  }
  renderScene();
  renderTitleBg();
  render();
}

/* ═══════════ 綁定 & 啟動 ═══════════ */
let playerName = '';
$('actInvite').addEventListener('click', actInvite);
$('actStaff').addEventListener('click', actStaff);
$('actPromo').addEventListener('click', actPromo);
$('actAnnounce').addEventListener('click', actAnnounce);
$('actInterview').addEventListener('click', openInterviewPanel);
$('endWeek').addEventListener('click', endWeek);
$('sbBinder').addEventListener('click', () => { if (!msgBusy && !spinning) $('binderOverlay').classList.add('show'); });
$('sbLineup').addEventListener('click', () => { if (!msgBusy && !spinning) $('lineupOverlay').classList.add('show'); });
$('sbLog').addEventListener('click', () => { if (!msgBusy && !spinning) $('logOverlay').classList.add('show'); });
$('binderClose').addEventListener('click', () => $('binderOverlay').classList.remove('show'));
$('lineupClose').addEventListener('click', () => $('lineupOverlay').classList.remove('show'));
$('logClose').addEventListener('click', () => $('logOverlay').classList.remove('show'));
$('interviewClose').addEventListener('click', () => $('interviewOverlay').classList.remove('show'));
['binderOverlay', 'lineupOverlay', 'logOverlay', 'interviewOverlay'].forEach(id => {
  $(id).addEventListener('click', e => { if (e.target === $(id)) $(id).classList.remove('show'); });
});

function toggleLang() {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('ipg_lang', lang);
  applyLang();
}
$('langToggle').addEventListener('click', toggleLang);
$('introLang').addEventListener('click', toggleLang);

/* 首頁 */
$('tStart').addEventListener('click', () => {
  $('titleOverlay').classList.remove('show');
  $('introOverlay').classList.add('show');
  $('nameInput').focus();
});
$('tLang').addEventListener('click', toggleLang);
$('tDiff').addEventListener('click', () => {
  $('tMenu').style.display = 'none';
  $('tDiffMenu').style.display = '';
});
$('tDiffBack').addEventListener('click', () => {
  $('tDiffMenu').style.display = 'none';
  $('tMenu').style.display = '';
});
[['dEasy', 'easy'], ['dNormal', 'normal'], ['dHard', 'hard']].forEach(([id, d]) => {
  $(id).addEventListener('click', () => {
    difficulty = d;
    localStorage.setItem('ipg_diff', d);
    applyLang();   // 更新難度標籤與選取狀態
    $('tDiffMenu').style.display = 'none';
    $('tMenu').style.display = '';
  });
});

function submitName() {
  playerName = $('nameInput').value.trim() || L('神秘', 'Mystery');
  $('greetTitle').textContent = L(`${playerName} 總召您好！`, `Hello, Chief ${playerName}!`);
  $('cheerLine').textContent = L(`${playerName} 總召麻煩你了，相信你可以！`, `We're counting on you, Chief ${playerName} — you've got this!`);
  $('introStep1').style.display = 'none';
  $('introStep2').style.display = '';
}
$('nameOk').addEventListener('click', submitName);
$('nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') submitName(); });
$('introStart').addEventListener('click', async () => {
  $('introOverlay').classList.remove('show');
  if (window.innerWidth < 820) {
    try {
      if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape');
    } catch (e) {}
  }
  $('helpOverlay').classList.add('show');   // 開工前先看操作說明
});
$('helpOk').addEventListener('click', () => {
  $('helpOverlay').classList.remove('show');
  startWeek();
});
$('rotateDismiss').addEventListener('click', () => $('rotateHint').classList.add('dismissed'));
window.addEventListener('resize', () => {
  if ($('wheelOverlay').classList.contains('show')) sizeCanvas();
});

newGame();
applyLang();
say(L('（輸入你的名字，開始你的總召之旅……）', '(Enter your name to begin your journey as Chief Organizer...)'), { tag: L('序章', 'Prologue'), wait: false });
$('nameInput').focus();
