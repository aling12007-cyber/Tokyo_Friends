import { firebaseConfig } from './firebase-config.js';
import { T, LANGS_UI, HTML_LANG, AREA_GROUPS, INTERESTS, ACTIVITIES, LANGS, WANTS, YEARS, INTEREST_GROUPS, ACTIVITY_GROUPS, LIFESTYLES, FREE_TIMES, FREE_TIME_DEFAULTS, PREF_GROUPS, AGES, AGE_ANY, LANG_LEVELS, GENDER_WANTS, NATIONALITIES, NATIONALITY_NONE } from './i18n.js';

const $ = (id) => document.getElementById(id);
const DEMO = !firebaseConfig.apiKey;
const MAX_INTERESTS = 8;
const AVATAR_SIZE = 256;
const AREA_OTHER = '__other';

// ---------- 語言 ----------
const LANG_KEY = 'tokyo-friends-lang';
function initialLang() {
  try { const saved = localStorage.getItem(LANG_KEY); if (LANGS_UI.includes(saved)) return saved; } catch { /* 無法讀取時忽略 */ }
  const nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('ja')) return 'ja';
  if (nav.startsWith('zh')) return 'zh';
  return 'en';
}
let lang = initialLang();
const LI = () => ({ zh: 1, ja: 2, en: 3 }[lang]);

function t(key, vars) {
  let s = T[lang][key] ?? T.zh[key] ?? key;
  if (vars && typeof s === 'string') for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
}

const ALL_OPTIONS = [...INTERESTS, ...ACTIVITIES, ...LANGS, ...WANTS, ...YEARS, ...LIFESTYLES, ...FREE_TIMES, ...PREF_GROUPS.flatMap((g) => g.items), ...AGES, AGE_ANY, ...LANG_LEVELS, ...GENDER_WANTS, ...NATIONALITIES, NATIONALITY_NONE, ...AREA_GROUPS.flatMap((g) => g.items)];
const OPTION_MAP = new Map(ALL_OPTIONS.map((o) => [o[0], o]));
// 有翻譯就翻譯，沒有（例如自己填寫的區域）就原樣顯示
function label(id) { const o = OPTION_MAP.get(id); return o ? o[LI()] : id; }
// 「日文（流利）、中文（母語）」
function langsText(ids, levels) {
  const lv = levels || {};
  const wrap = (x) => (lang === 'en' ? ` (${x})` : `（${x}）`);
  return (ids || []).map((id) => (lv[id] ? label(id) + wrap(label(lv[id])) : label(id))).join(lang === 'en' ? ', ' : '、');
}
function labels(ids) { return (ids || []).map(label).join(lang === 'en' ? ', ' : '、'); }

// ---------- 後端：Firebase 或示範模式 ----------
let backend;

async function makeFirebaseBackend() {
  const V = '10.12.2';
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
  const authMod = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`);
  const fs = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`);

  const app = initializeApp(firebaseConfig);
  const auth = authMod.getAuth(app);
  const db = fs.getFirestore(app);
  // 認證信裡的連結點完會回到這個網站
  const verifySettings = () => ({ url: location.origin + location.pathname });
  const toUser = (u) => (u ? { uid: u.uid, email: u.email, verified: u.emailVerified } : null);

  return {
    setLang(l) { auth.languageCode = { zh: 'zh-TW', ja: 'ja', en: 'en' }[l]; },
    onUser(cb) { authMod.onAuthStateChanged(auth, (u) => cb(toUser(u))); },
    async signup(email, password) {
      const cred = await authMod.createUserWithEmailAndPassword(auth, email, password);
      await authMod.sendEmailVerification(cred.user, verifySettings());
    },
    async login(email, password) { await authMod.signInWithEmailAndPassword(auth, email, password); },
    async resendVerify() { await authMod.sendEmailVerification(auth.currentUser, verifySettings()); },
    // 重新讀取帳號狀態；也更新登入憑證，讓資料庫規則看到「已認證」
    async refreshUser() {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      return toUser(auth.currentUser);
    },
    async resetPassword(email) { await authMod.sendPasswordResetEmail(auth, email, verifySettings()); },
    async getProfile(uid) {
      const snap = await fs.getDoc(fs.doc(db, 'users', uid));
      return snap.exists() ? snap.data() : null;
    },
    async saveProfile(uid, profile) {
      await fs.setDoc(fs.doc(db, 'users', uid), { ...profile, updatedAt: fs.serverTimestamp() });
    },
    async getGroup(uid) {
      const q = fs.query(fs.collection(db, 'groups'), fs.where('memberUids', 'array-contains', uid));
      const res = await fs.getDocs(q);
      const list = res.docs.map((d) => d.data()).sort((a, b) => String(b.week || b.month || '').localeCompare(String(a.week || a.month || '')));
      return list[0] || null;
    },
    // 頭像存在 avatars/{uid}，縮成 256px 的小圖，不需要 Firebase Storage
    async getAvatar(uid) {
      const snap = await fs.getDoc(fs.doc(db, 'avatars', uid));
      return snap.exists() ? snap.data().img : null;
    },
    async saveAvatar(uid, img) {
      const ref = fs.doc(db, 'avatars', uid);
      if (img) await fs.setDoc(ref, { img }); else await fs.deleteDoc(ref);
    },
    async logout() { await authMod.signOut(auth); }
  };
}

function makeDemoBackend() {
  const KEY = 'tokyo-friends-demo-v2';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* 無法儲存時忽略 */ } };
  let listener = () => {};
  const me = () => { const s = read(); return s.uid ? { uid: s.uid, email: s.email || '', verified: !!s.verified } : null; };
  return {
    setLang() {},
    // 示範模式：不寄信，按「我已經完成認證」就算通過
    onUser(cb) { listener = cb; cb(me()); },
    async signup(email) {
      await new Promise((r) => setTimeout(r, 300));
      const s = read(); s.uid = 'demo-user'; s.email = email; s.verified = false; s.verifyClicks = 0; write(s); listener(me());
    },
    async login(email) {
      await new Promise((r) => setTimeout(r, 300));
      const s = read(); s.uid = 'demo-user'; s.email = email; if (s.verified === undefined) s.verified = true; write(s); listener(me());
    },
    async resendVerify() {},
    async refreshUser() { const s = read(); s.verified = true; write(s); return me(); },
    async resetPassword() {},
    async getProfile() { return read().profile || null; },
    async saveProfile(uid, profile) { const s = read(); s.profile = profile; write(s); },
    async getAvatar(uid) { return uid === 'demo-user' ? read().avatar || null : null; },
    async saveAvatar(uid, img) { const s = read(); if (img) s.avatar = img; else delete s.avatar; write(s); },
    async getGroup() { return null; },
    async logout() { const s = read(); delete s.uid; write(s); listener(null); }
  };
}

// ---------- 套用翻譯 ----------
function applyI18n() {
  document.documentElement.lang = HTML_LANG[lang];
  document.title = `${t('brand')}｜Tokyo Friends`;
  for (const n of document.querySelectorAll('[data-i18n]')) n.textContent = t(n.dataset.i18n);
  for (const n of document.querySelectorAll('[data-i18n-html]')) n.innerHTML = t(n.dataset.i18nHtml); // 來源是 i18n.js 的固定文字
  for (const n of document.querySelectorAll('[data-i18n-ph]')) n.placeholder = t(n.dataset.i18nPh);
  for (const n of document.querySelectorAll('[data-i18n-aria]')) n.setAttribute('aria-label', t(n.dataset.i18nAria));
  for (const b of document.querySelectorAll('.lang-btn')) b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
  const ul = $('rules-list');
  ul.innerHTML = '';
  for (const r of t('rulesList')) { const li = document.createElement('li'); li.textContent = r; ul.appendChild(li); }
  $('loading').textContent = t('loading');
  if (backend) backend.setLang(lang);
}

function setLang(l) {
  lang = l;
  try { localStorage.setItem(LANG_KEY, l); } catch { /* 無法儲存時忽略 */ }
  applyI18n();
  // 重畫跟語言有關的動態內容，保留目前輸入
  setAuthMode(authMode);
  if (currentUser && !currentUser.verified) $('verify-text').textContent = t('verifyText', { email: currentUser.email || '' });
  if (!$('screen-profile').hidden) refreshProfileOptions();
  if (!$('screen-match').hidden && currentUser && currentProfile) showMatch(currentUser.uid, currentProfile);
}

// ---------- 畫面切換 ----------
function show(name) {
  for (const id of ['screen-register', 'screen-profile', 'screen-match']) $(id).hidden = id !== `screen-${name}`;
  $('loading').hidden = true;
  window.scrollTo(0, 0);
}

// ---------- 標籤選擇 ----------
const picked = { interests: new Set(), activities: new Set(), langs: new Set(), wants: new Set(), freeTime: new Set(), prefs: new Set(), ageWant: new Set() };
let genderWant = 'any';
const availabilityPicked = new Set();
const AVAILABILITY_BLOCKS = [['morning','10:00–12:00'],['afternoon','13:00–16:00'],['evening','18:00–21:00']];
const JP_HOLIDAYS = new Map([
  ['2026-11-03','文化の日'],['2026-11-23','勤労感謝の日'],
  ['2027-01-01','元日'],['2027-01-11','成人の日'],['2027-02-11','建国記念の日'],
  ['2027-02-23','天皇誕生日'],['2027-03-21','春分の日'],['2027-03-22','振替休日'],
  ['2027-04-29','昭和の日'],['2027-05-03','憲法記念日'],['2027-05-04','みどりの日'],
  ['2027-05-05','こどもの日'],['2027-07-19','海の日'],['2027-08-11','山の日'],
  ['2027-09-20','敬老の日'],['2027-09-23','秋分の日'],['2027-10-11','スポーツの日']
]);
function dateKey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function availabilityAllowed(day, block, freeTime) {
  const weekday = day.getDay() >= 1 && day.getDay() <= 5;
  const weekend = day.getDay() === 0 || day.getDay() === 6;
  const daytime = block === 'morning' || block === 'afternoon';
  const selected = freeTime instanceof Set ? freeTime : new Set(freeTime || []);
  // Calendar availability is governed by the user's explicit "usually free" choices.
  const allowed = [];
  if (selected.has('weekday-day') && weekday && daytime) allowed.push(true);
  else if (selected.has('weekday-night') && weekday && block === 'evening') allowed.push(true);
  if (selected.has('sat') && day.getDay() === 6) allowed.push(true);
  if (selected.has('sun') && day.getDay() === 0) allowed.push(true);
  if (selected.has('holiday') && JP_HOLIDAYS.has(dateKey(day))) allowed.push(true);
  if (selected.has('irregular')) allowed.push(true);
  return allowed.length > 0;
}
function applyAvailabilityRestrictions() {
  const freeTime = picked.freeTime;
  for (const slot of [...availabilityPicked]) {
    const [date, block] = slot.split('|');
    const day = new Date(date + 'T12:00:00');
    if (!availabilityAllowed(day, block, freeTime)) availabilityPicked.delete(slot);
  }
}
function renderAvailabilityCalendar() {
  const box = $('availability-calendar'); if (!box) return;
  applyAvailabilityRestrictions();
  box.innerHTML = '';
  const start = new Date(); start.setHours(0,0,0,0); start.setDate(start.getDate()+1);
  const end = new Date(); end.setHours(0,0,0,0); end.setMonth(end.getMonth()+1);
  let week = null, row = null;
  for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
    const monday = new Date(d); monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
    const weekKey = dateKey(monday);
    if (weekKey !== week) { week = weekKey; row = el('section','calendar-week'); row.appendChild(el('h3','calendar-week-title',`${d.getFullYear()}/${d.getMonth()+1}・第 ${Math.ceil(d.getDate()/7)} 週`)); box.appendChild(row); }
    const day = new Date(d); const key = dateKey(day);
    const dayCard = el('div','calendar-day');
    const holiday = JP_HOLIDAYS.get(key);
    const labelText = `${['日','一','二','三','四','五','六'][day.getDay()]}・${day.getMonth()+1}/${day.getDate()}`;
    const dateLabel = el('div','calendar-date');
    dateLabel.appendChild(el('span',null,labelText));
    if (holiday) dateLabel.appendChild(el('span','holiday-label',holiday));
    dayCard.appendChild(dateLabel);
    if (holiday) dayCard.classList.add('calendar-day-holiday');
    const blocks = el('div','calendar-blocks');
    for (const [id,time] of AVAILABILITY_BLOCKS) {
      const slot = `${key}|${id}`;
      const labelEl = el('label','calendar-slot');
      const input = el('input'); input.type='checkbox';
      input.disabled = !availabilityAllowed(day, id, picked.freeTime);
      input.checked = availabilityPicked.has(slot) && !input.disabled;
      if (input.disabled) labelEl.classList.add('calendar-slot-disabled');
      input.addEventListener('change',()=>{ if(input.checked) availabilityPicked.add(slot); else availabilityPicked.delete(slot); updateAvailabilityCount(); });
      labelEl.append(input, el('span',null,time)); blocks.appendChild(labelEl);
    }
    dayCard.appendChild(blocks); row.appendChild(dayCard);
  }
  updateAvailabilityCount();
}
function updateAvailabilityCount() { const n=$('availability-count'); if(n) n.textContent=`已選 ${availabilityPicked.size} 個時段`; }
function slotLabel(slot) { const [date,block]=String(slot).split('|'); const d=new Date(`${date}T12:00:00`); const times=Object.fromEntries(AVAILABILITY_BLOCKS); return `${d.getMonth()+1}/${d.getDate()} ${times[block]||block}`; }
let langLevels = {};   // { ja: 'fluent', zh: 'native' }

// 兩層選擇：先列出大分類，點開才看到裡面的小項目（一次只開一個）
const openCat = {};   // 每個區塊目前打開的分類 index

function renderChipGroups(containerId, groups, options, selected, max) {
  const byId = new Map(options.map((o) => [o[0], o]));
  const box = $(containerId);
  box.innerHTML = '';
  const parts = [];

  groups.forEach((g, gi) => {
    const wrap = document.createElement('div');
    wrap.className = 'chip-group';
    wrap.dataset.c = String(gi % 6);

    const panelId = `${containerId}-panel-${gi}`;
    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'cat-head';
    head.setAttribute('aria-controls', panelId);
    const name = document.createElement('span');
    name.className = 'cat-name';
    name.textContent = g.label[LI() - 1];
    const badge = document.createElement('span');
    badge.className = 'cat-count';
    const arrow = document.createElement('span');
    arrow.className = 'cat-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    head.append(name, badge, arrow);

    const panel = document.createElement('div');
    panel.className = 'chips cat-panel';
    panel.id = panelId;

    const updateBadge = () => {
      const n = g.ids.filter((id) => selected.has(id)).length;
      badge.textContent = n ? String(n) : '';
      badge.hidden = !n;
      wrap.classList.toggle('has-picked', n > 0);
    };
    addChips(panel, g.ids.map((id) => byId.get(id)).filter(Boolean), selected, max, containerId, updateBadge);
    updateBadge();

    wrap.append(head, panel);
    box.appendChild(wrap);
    parts.push({ head, panel, wrap });
    head.addEventListener('click', () => {
      openCat[containerId] = openCat[containerId] === gi ? -1 : gi;
      sync();
    });
  });

  function sync() {
    parts.forEach((p, i) => {
      const open = openCat[containerId] === i;
      p.head.setAttribute('aria-expanded', open ? 'true' : 'false');
      p.panel.hidden = !open;
      p.wrap.classList.toggle('open', open);
    });
  }
  sync();
}

// 交友傾向：每一類一個小標題；「single」的類別只能選一個
function renderPrefs() {
  const box = $('prefs-box');
  box.innerHTML = '';
  for (const g of PREF_GROUPS) {
    const head = el('span', 'sub-label', g.label[LI() - 1]);
    const row = el('div', 'chips');
    const buttons = [];
    for (const opt of g.items) {
      const id = opt[0];
      const b = el('button', 'chip', opt[LI()]);
      b.type = 'button';
      b.setAttribute('aria-pressed', picked.prefs.has(id) ? 'true' : 'false');
      b.addEventListener('click', () => {
        const on = picked.prefs.has(id);
        if (g.single) for (const o of g.items) picked.prefs.delete(o[0]);
        if (on) picked.prefs.delete(id); else picked.prefs.add(id);
        for (const [bid, btn] of buttons) btn.setAttribute('aria-pressed', picked.prefs.has(bid) ? 'true' : 'false');
      });
      buttons.push([id, b]);
      row.appendChild(b);
    }
    box.append(head, row);
  }
}

function renderChips(containerId, options, selected, max, onChange) {
  const box = $(containerId);
  box.innerHTML = '';
  addChips(box, options, selected, max, containerId, onChange);
}

function addChips(box, options, selected, max, containerId, onChange) {
  for (const opt of options) {
    const id = opt[0];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = opt[LI()];
    b.setAttribute('aria-pressed', selected.has(id) ? 'true' : 'false');
    b.addEventListener('click', () => {
      if (selected.has(id)) selected.delete(id);
      else if (!max || selected.size < max) selected.add(id);
      b.setAttribute('aria-pressed', selected.has(id) ? 'true' : 'false');
      if (containerId === 'chips-interests') updateInterestCount();
      if (onChange) onChange();
    });
    box.appendChild(b);
  }
}

function updateInterestCount() { $('interest-count').textContent = t('selectedN', { n: picked.interests.size }); }

const NAT_OTHER = '__other';
function fillNationality(value) {
  const sel = $('nationality');
  sel.innerHTML = '';
  sel.add(new Option(t('nationalityPick'), ''));
  for (const o of NATIONALITIES) sel.add(new Option(o[LI()], o[0]));
  sel.add(new Option(t('nationalityOther'), NAT_OTHER));
  sel.add(new Option(NATIONALITY_NONE[LI()], NATIONALITY_NONE[0]));
  const known = new Set([...NATIONALITIES.map((o) => o[0]), NATIONALITY_NONE[0]]);
  const other = $('nationality-other');
  if (value && value !== NAT_OTHER && !known.has(value)) { sel.value = NAT_OTHER; other.value = value; }
  else sel.value = value || '';
  other.hidden = sel.value !== NAT_OTHER;
}

function fillAge(value) {
  const sel = $('age');
  sel.innerHTML = '';
  sel.add(new Option(t('agePick'), ''));
  for (const o of AGES) sel.add(new Option(o[LI()], o[0]));
  sel.value = value || '';
}

// 想認識的年齡層：選「不在意年齡」會清掉其他；選其他會取消「不在意」
function renderAgeWant() {
  const box = $('chips-agewant');
  box.innerHTML = '';
  const buttons = [];
  for (const opt of [...AGES, AGE_ANY]) {
    const id = opt[0];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = opt[LI()];
    b.addEventListener('click', () => {
      const set = picked.ageWant;
      if (set.has(id)) set.delete(id);
      else {
        if (id === AGE_ANY[0]) set.clear(); else set.delete(AGE_ANY[0]);
        set.add(id);
      }
      for (const [bid, btn] of buttons) btn.setAttribute('aria-pressed', set.has(bid) ? 'true' : 'false');
    });
    b.setAttribute('aria-pressed', picked.ageWant.has(id) ? 'true' : 'false');
    buttons.push([id, b]);
    box.appendChild(b);
  }
}

// 每個選了的語言，下面出現一個程度選單
function renderLangLevels() {
  const box = $('lang-levels');
  box.innerHTML = '';
  for (const opt of LANGS) {
    const id = opt[0];
    if (!picked.langs.has(id)) continue;
    const row = document.createElement('div');
    row.className = 'lang-level';
    const lab = document.createElement('label');
    lab.htmlFor = `lv-${id}`;
    lab.textContent = opt[LI()];
    const sel = document.createElement('select');
    sel.id = `lv-${id}`;
    sel.add(new Option(t('langLevelPick'), ''));
    for (const lv of LANG_LEVELS) sel.add(new Option(lv[LI()], lv[0]));
    sel.value = langLevels[id] || '';
    sel.addEventListener('change', () => { if (sel.value) langLevels[id] = sel.value; else delete langLevels[id]; });
    row.append(lab, sel);
    box.appendChild(row);
  }
}

function fillLifestyle(value) {
  const sel = $('lifestyle');
  sel.innerHTML = '';
  sel.add(new Option(t('lifestylePick'), ''));
  for (const o of LIFESTYLES) sel.add(new Option(o[LI()], o[0]));
  sel.value = value || '';
}

function fillYears(value) {
  const sel = $('years');
  sel.innerHTML = '';
  sel.add(new Option(t('yearsPick'), ''));
  for (const o of YEARS) sel.add(new Option(o[LI()], o[0]));
  sel.value = value || '';
}

function fillAreaSelect(value) {
  const sel = $('area');
  sel.innerHTML = '';
  sel.add(new Option(t('areaPick'), ''));
  const known = new Set();
  for (const g of AREA_GROUPS) {
    const og = document.createElement('optgroup');
    og.label = g.label[LI() - 1];
    for (const item of g.items) { og.appendChild(new Option(item[LI()], item[0])); known.add(item[0]); }
    sel.appendChild(og);
  }
  sel.add(new Option(t('areaOther'), AREA_OTHER));
  const other = $('area-other');
  if (value && value !== AREA_OTHER && !known.has(value)) { sel.value = AREA_OTHER; other.value = value; }
  else sel.value = value || '';
  other.hidden = sel.value !== AREA_OTHER;
}

function renderGenderWant() {
  const box = $('chips-genderwant');
  if (!box) return;
  box.innerHTML = '';
  for (const opt of GENDER_WANTS) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = opt[LI()];
    b.setAttribute('aria-pressed', genderWant === opt[0] ? 'true' : 'false');
    b.addEventListener('click', () => {
      genderWant = opt[0];
      for (const btn of box.querySelectorAll('.chip')) btn.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-pressed', 'true');
    });
    box.appendChild(b);
  }
}

function renderAllChips() {
  renderChipGroups('chips-interests', INTEREST_GROUPS, INTERESTS, picked.interests, MAX_INTERESTS);
  renderChipGroups('chips-activities', ACTIVITY_GROUPS, ACTIVITIES, picked.activities);
  renderChips('chips-langs', LANGS, picked.langs, 0, renderLangLevels);
  renderLangLevels();
  renderChips('chips-wants', WANTS, picked.wants);
  renderChips('chips-free', FREE_TIMES, picked.freeTime);
  renderAvailabilityCalendar();
  renderPrefs();
  renderAgeWant();
  renderGenderWant();
  updateInterestCount();
}

// 切換語言時：保留已輸入的值，只換文字
function refreshProfileOptions() {
  const areaVal = $('area').value === AREA_OTHER ? ($('area-other').value || AREA_OTHER) : $('area').value;
  const otherText = $('area-other').value;
  const yearsVal = $('years').value;
  const lifeVal = $('lifestyle').value;
  fillLifestyle(lifeVal);
  fillAge($('age').value);
  { const nv = $('nationality').value === NAT_OTHER ? ($('nationality-other').value || NAT_OTHER) : $('nationality').value; const nt = $('nationality-other').value; fillNationality(nv); if ($('nationality').value === NAT_OTHER) $('nationality-other').value = nt; }
  fillAreaSelect(areaVal);
  if ($('area').value === AREA_OTHER) $('area-other').value = otherText;
  fillYears(yearsVal);
  renderAllChips();
  renderAvailabilityCalendar();
}

let avatarData = null;
let avatarChanged = false;

function setAvatarPreview(img) {
  $('avatar-img').hidden = !img;
  $('avatar-placeholder').hidden = !!img;
  $('avatar-remove').hidden = !img;
  if (img) $('avatar-img').src = img; else $('avatar-img').removeAttribute('src');
}

function loadProfileForm(p, avatar) {
  $('nick').value = p?.nick || '';
  fillAreaSelect(p?.area);
  fillYears(p?.years);
  fillLifestyle(p?.lifestyle);
  fillAge(p?.age);
  fillNationality(p?.nationality);
  picked.ageWant = new Set(p?.ageWant || []);
  genderWant = p?.genderWant || 'any';
  picked.freeTime = new Set(p?.freeTime || []);
  availabilityPicked.clear();
  for (const slot of (p?.availabilitySlots || [])) availabilityPicked.add(slot);
  picked.prefs = new Set(p?.prefs || []);
  picked.interests = new Set(p?.interests || []);
  picked.activities = new Set(p?.activities || []);
  picked.langs = new Set(p?.langs || []);
  langLevels = { ...(p?.langLevels || {}) };
  picked.wants = new Set(p?.wants || []);
  renderAllChips();
  renderAvailabilityCalendar();
  $('activity-other').value = p?.activityOther || '';
  avatarData = avatar || null;
  avatarChanged = false;
  setAvatarPreview(avatarData);
  $('line-id').value = p?.lineId || '';
  $('line-share-consent').checked = !!p?.lineShareConsent;
  $('agree').checked = !!p;
  $('profile-error').textContent = '';
}

// 把照片裁成正方形、縮成 256px 的 JPEG（約 20～40KB）
function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - side) / 2;
      const sy = (img.naturalHeight - side) / 2;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = AVATAR_SIZE;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
      ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
      URL.revokeObjectURL(url);
      let q = 0.85;
      let out = canvas.toDataURL('image/jpeg', q);
      while (out.length > 120000 && q > 0.4) { q -= 0.15; out = canvas.toDataURL('image/jpeg', q); }
      resolve(out);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad-image')); };
    img.src = url;
  });
}

// ---------- 配對頁 ----------
const AVATAR_COLORS = [['#FFE0EE', '#8C2453'], ['#DCF0FF', '#1D4F7A'], ['#D6F7E8', '#1E5E47'], ['#EDE4FF', '#4B2F86'], ['#FFF5C4', '#6B5410']];

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function isSafeImage(src) {
  return typeof src === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(src);
}

function makeAvatar(nick, i, img) {
  const av = el('div', 'avatar');
  av.setAttribute('aria-hidden', 'true');
  if (isSafeImage(img)) {
    const im = document.createElement('img');
    im.src = img; im.alt = '';
    av.appendChild(im);
  } else {
    av.textContent = (nick || '?').trim().charAt(0).toUpperCase();
    const [bg, fg] = AVATAR_COLORS[i % AVATAR_COLORS.length];
    av.style.background = bg; av.style.color = fg;
  }
  return av;
}

function renderSummary(p, avatar) {
  const box = $('my-summary');
  box.innerHTML = '';
  const head = el('div', 'summary-head');
  const big = makeAvatar(p.nick, 0, avatar);
  big.classList.add('avatar-lg');
  head.append(big, el('div', 'member-name', p.nick));
  box.appendChild(head);
  const dl = el('dl');
  const todo = [labels(p.activities), p.activityOther].filter(Boolean).join(lang === 'en' ? ', ' : '、');
  const rows = [
    [t('sumNationality'), label(p.nationality) || '—'], [t('sumArea'), label(p.area)], [t('sumInterests'), labels(p.interests)], [t('sumTodo'), todo || '—'],
    [t('sumAge'), `${label(p.age)} → ${labels(p.ageWant)}`],
    [t('sumGenderWant'), label(p.genderWant) || '—'],
    [t('sumStyle'), labels(p.prefs) || '—'],
    [t('sumFree'), [label(p.lifestyle), labels(p.freeTime), (p.availabilitySlots || []).map(slotLabel).join('、')].filter(Boolean).join(lang === 'en' ? ': ' : '・')],
    [t('sumLangs'), langsText(p.langs, p.langLevels)], [t('sumWants'), labels(p.wants)], [t('sumYears'), label(p.years)]
  ];
  for (const [k, v] of rows) { dl.appendChild(el('dt', null, k)); dl.appendChild(el('dd', null, v)); }
  box.appendChild(dl);
}

async function renderGroup(g) {
  const members = g.members || [];
  const avatars = await Promise.all(members.map((m) => (m.uid ? backend.getAvatar(m.uid).catch(() => null) : null)));
  const ul = $('members');
  ul.innerHTML = '';
  members.forEach((m, i) => {
    const li = el('li', 'member');
    const text = el('div');
    text.appendChild(el('div', 'member-name', m.nick));
    if (m.lineId) { const line = el('div', 'member-line-id', `LINE ID：${m.lineId}`); text.appendChild(line); }
    const nat = m.nationality && m.nationality !== 'none' ? label(m.nationality) : '';
    const meta = m.meta || [nat, label(m.years), langsText(m.langs, m.langLevels)].filter(Boolean).join('・');
    text.appendChild(el('div', 'member-meta', meta));
    li.append(makeAvatar(m.nick, i, avatars[i]), text);
    ul.appendChild(li);
  });
  const tags = $('common-tags');
  tags.innerHTML = '';
  for (const tag of g.common || []) tags.appendChild(el('span', 'tag', label(tag)));
  const meetTimesText = (g.meetTimes || []).some((x) => String(x).includes('|')) ? g.meetTimes.map(slotLabel).join('、') : labels(g.meetTimes);
  const auto = g.meetTimes || g.meetArea ? t('meetAuto', { when: meetTimesText || '—', area: label(g.meetArea) || '—' }) : '';
  $('meet-text').textContent = g.meet || auto || t('meetDefault');
  let progress = $('meetup-progress');
  if (!progress) { progress = el('p', 'muted small meetup-progress'); progress.id = 'meetup-progress'; const meetCard = document.querySelector('#group .meet'); if (meetCard) meetCard.insertBefore(progress, meetCard.firstChild); }
  const completed = Math.max(0, Math.min(1, Number(g.meetupsCompleted) || 0));
  progress.textContent = lang === 'ja' ? `交流会の実施状況：${completed}/1 回完了` : lang === 'en' ? `Meetup progress: ${completed}/1 completed` : `聚會進度：已完成 ${completed}/1 次（至少舉辦一次）`;
  const link = $('chat-link');
  const safeUrl = typeof g.chatUrl === 'string' && /^https:\/\//.test(g.chatUrl) ? g.chatUrl : '';
  link.hidden = !safeUrl;
  if (safeUrl) link.href = safeUrl;
}

let currentUser = null;
let currentProfile = null;
let currentAvatar = null;

async function showMatch(uid, profile) {
  show('match');
  const group = await backend.getGroup(uid).catch(() => null);
  $('group').hidden = !group;
  $('waiting').hidden = !!group;
  if (group) await renderGroup(group); else renderSummary(profile, currentAvatar);
}

// ---------- 錯誤訊息 ----------
function authErrorText(e) {
  const code = e?.code || '';
  if (code.includes('email-already-in-use')) return t('errEmailInUse');
  if (code.includes('invalid-email')) return t('errEmail');
  if (code.includes('weak-password')) return t('errPassword');
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found') || code.includes('invalid-login')) return t('errLoginFail');
  if (code.includes('too-many-requests')) return t('errTooMany');
  return t('errGeneric');
}

// ---------- 註冊／登入 ----------
let authMode = 'signup';
let resendAt = 0;

function setAuthMode(mode) {
  authMode = mode;
  for (const b of document.querySelectorAll('.auth-tab')) b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false');
  $('auth-submit').textContent = t(mode === 'signup' ? 'signupBtn' : 'loginBtn');
  $('password-label').textContent = t(mode === 'signup' ? 'passwordLabel' : 'passwordLabelLogin');
  $('password').autocomplete = mode === 'signup' ? 'new-password' : 'current-password';
  $('forgot').hidden = mode !== 'login';
  $('register-error').textContent = '';
  $('register-info').textContent = '';
}

function showAuth(user) {
  const needVerify = !!user && !user.verified;
  $('auth-form').hidden = needVerify;
  document.querySelector('.auth-tabs').hidden = needVerify;
  $('verify-box').hidden = !needVerify;
  if (needVerify) $('verify-text').textContent = t('verifyText', { email: user.email || '' });
  show('register');
}

const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// ---------- 啟動 ----------
async function start() {
  applyI18n();
  $('demo-banner').hidden = !DEMO;

  for (const b of document.querySelectorAll('.lang-btn')) b.addEventListener('click', () => setLang(b.dataset.lang));

  // 「社群守則」連結（翻譯後會重新產生，所以用委派）
  const dialog = $('rules-dialog');
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('.open-rules');
    if (a) { ev.preventDefault(); dialog.showModal(); }
  });

  try {
    backend = DEMO ? makeDemoBackend() : await makeFirebaseBackend();
    backend.setLang(lang);
  } catch {
    $('loading').textContent = t('errConn');
    return;
  }

  backend.onUser(async (user) => {
    currentUser = user;
    if (!user || !user.verified) { showAuth(user); return; }
    [currentProfile, currentAvatar] = await Promise.all([
      backend.getProfile(user.uid).catch(() => null),
      backend.getAvatar(user.uid).catch(() => null)
    ]);
    if (currentProfile) showMatch(user.uid, currentProfile);
    else { loadProfileForm(null, currentAvatar); show('profile'); }
  });

  for (const b of document.querySelectorAll('.auth-tab')) b.addEventListener('click', () => setAuthMode(b.dataset.mode));
  setAuthMode('signup');
  renderAvailabilityCalendar();

  $('auth-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    $('register-error').textContent = '';
    $('register-info').textContent = '';
    const email = $('email').value.trim();
    const password = $('password').value;
    if (!validEmail(email)) { $('register-error').textContent = t('errEmail'); return; }
    if (password.length < 8) { $('register-error').textContent = t('errPassword'); return; }
    const btn = $('auth-submit');
    btn.disabled = true; btn.textContent = t('working');
    try {
      if (authMode === 'signup') { await backend.signup(email, password); resendAt = Date.now() + 60000; }
      else await backend.login(email, password);
      $('password').value = '';
    } catch (e) {
      $('register-error').textContent = authErrorText(e);
    } finally {
      btn.disabled = false; btn.textContent = t(authMode === 'signup' ? 'signupBtn' : 'loginBtn');
    }
  });

  $('forgot').addEventListener('click', async () => {
    const email = $('email').value.trim();
    $('register-error').textContent = '';
    if (!validEmail(email)) { $('register-error').textContent = t('errNeedEmail'); $('email').focus(); return; }
    try { await backend.resetPassword(email); $('register-info').textContent = t('resetSent'); }
    catch (e) {
      // 不透露這個 Email 有沒有註冊過
      if ((e?.code || '').includes('user-not-found')) $('register-info').textContent = t('resetSent');
      else $('register-error').textContent = authErrorText(e);
    }
  });

  $('verify-done').addEventListener('click', async () => {
    $('register-error').textContent = '';
    $('register-info').textContent = '';
    try {
      const u = await backend.refreshUser();
      if (u && u.verified) {
        currentUser = u;
        [currentProfile, currentAvatar] = await Promise.all([
          backend.getProfile(u.uid).catch(() => null),
          backend.getAvatar(u.uid).catch(() => null)
        ]);
        if (currentProfile) showMatch(u.uid, currentProfile);
        else { loadProfileForm(null, currentAvatar); show('profile'); }
      } else $('register-error').textContent = t('verifyNotYet');
    } catch (e) { $('register-error').textContent = authErrorText(e); }
  });

  $('verify-resend').addEventListener('click', async () => {
    $('register-error').textContent = '';
    const wait = Math.ceil((resendAt - Date.now()) / 1000);
    if (wait > 0) { $('register-info').textContent = t('verifyWait', { n: wait }); return; }
    try { await backend.resendVerify(); resendAt = Date.now() + 60000; $('register-info').textContent = t('verifyResent'); }
    catch (e) { $('register-error').textContent = authErrorText(e); }
  });

  $('logout-0').addEventListener('click', () => backend.logout());

  $('nationality').addEventListener('change', () => {
    const isOther = $('nationality').value === NAT_OTHER;
    $('nationality-other').hidden = !isOther;
    if (isOther) $('nationality-other').focus();
  });

  $('area').addEventListener('change', () => {
    const isOther = $('area').value === AREA_OTHER;
    $('area-other').hidden = !isOther;
    if (isOther) $('area-other').focus();
  });

  // 選了生活型態、而且還沒選時段時，自動先勾常見的時段
  $('lifestyle').addEventListener('change', () => {
    applyAvailabilityRestrictions();
    renderAvailabilityCalendar();
    const v = $('lifestyle').value;
    if (v && picked.freeTime.size === 0) {
      for (const id of FREE_TIME_DEFAULTS[v] || []) picked.freeTime.add(id);
      renderChips('chips-free', FREE_TIMES, picked.freeTime);
    }
    renderAvailabilityCalendar();
  });
  $('chips-free').addEventListener('click', () => { setTimeout(renderAvailabilityCalendar, 0); });

  $('avatar-file').addEventListener('change', async (ev) => {
    const file = ev.target.files && ev.target.files[0];
    ev.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { $('profile-error').textContent = t('errNotImage'); return; }
    try {
      avatarData = await resizeImage(file);
      avatarChanged = true;
      setAvatarPreview(avatarData);
      $('profile-error').textContent = '';
    } catch {
      $('profile-error').textContent = t('errBadImage');
    }
  });

  $('avatar-remove').addEventListener('click', () => {
    avatarData = null;
    avatarChanged = true;
    setAvatarPreview(null);
  });

  $('profile-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const err = $('profile-error');
    const areaSel = $('area').value;
    const profile = {
      nick: $('nick').value.trim().slice(0, 20),
      lineId: $('line-id').value.trim().slice(0, 100),
      lineShareConsent: $('line-share-consent').checked,
      nationality: $('nationality').value === NAT_OTHER ? $('nationality-other').value.trim().slice(0, 30) : $('nationality').value,
      area: areaSel === AREA_OTHER ? $('area-other').value.trim().slice(0, 30) : areaSel,
      interests: [...picked.interests],
      activities: [...picked.activities],
      activityOther: $('activity-other').value.trim().slice(0, 40),
      langs: [...picked.langs],
      langLevels: Object.fromEntries([...picked.langs].filter((id) => langLevels[id]).map((id) => [id, langLevels[id]])),
      wants: [...picked.wants],
      genderWant,
      age: $('age').value,
      ageWant: [...picked.ageWant],
      prefs: [...picked.prefs],
      lifestyle: $('lifestyle').value,
      freeTime: [...picked.freeTime],
      availabilitySlots: [...availabilityPicked].sort(),
      years: $('years').value
    };
    if (!profile.nick) return void (err.textContent = t('errNick'));
    if (!profile.lineId) return void (err.textContent = t('errLineId'));
    if (!profile.lineShareConsent) return void (err.textContent = t('errLineConsent'));
    if (!profile.nationality) return void (err.textContent = t('errNationality'));
    if (!profile.area) return void (err.textContent = areaSel === AREA_OTHER ? t('errAreaOther') : t('errArea'));
    if (!profile.interests.length) return void (err.textContent = t('errInterest'));
    if (!profile.activities.length && !profile.activityOther) return void (err.textContent = t('errActivity'));
    if (!profile.langs.length) return void (err.textContent = t('errLang'));
    if (profile.langs.some((id) => !profile.langLevels[id])) return void (err.textContent = t('errLangLevel'));
    if (!profile.wants.length) return void (err.textContent = t('errWant'));
    if (!profile.genderWant) return void (err.textContent = t('errGenderWant'));
    if (!profile.age) return void (err.textContent = t('errAge'));
    if (!profile.ageWant.length) return void (err.textContent = t('errAgeWant'));
    if (!profile.prefs.some((id) => id.startsWith('size-'))) return void (err.textContent = t('errPrefSize'));
    if (!profile.lifestyle) return void (err.textContent = t('errLifestyle'));
    if (!profile.availabilitySlots.length) return void (err.textContent = t('errCalendar'));
    if (!profile.years) return void (err.textContent = t('errYears'));
    if (!$('agree').checked) return void (err.textContent = t('errAgree'));
    err.textContent = '';
    try {
      await backend.saveProfile(currentUser.uid, profile);
      if (avatarChanged) {
        await backend.saveAvatar(currentUser.uid, avatarData);
        currentAvatar = avatarData;
        avatarChanged = false;
      }
      currentProfile = profile;
      showMatch(currentUser.uid, profile);
    } catch {
      err.textContent = t('errSave');
    }
  });

  $('edit-profile').addEventListener('click', () => { loadProfileForm(currentProfile, currentAvatar); show('profile'); });
  for (const id of ['logout-1', 'logout-2']) $(id).addEventListener('click', () => backend.logout());
}

start();
