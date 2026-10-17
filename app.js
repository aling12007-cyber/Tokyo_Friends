import { firebaseConfig } from './firebase-config.js';
import { T, LANGS_UI, HTML_LANG, AREA_GROUPS, INTERESTS, ACTIVITIES, LANGS, WANTS, YEARS, INTEREST_GROUPS, ACTIVITY_GROUPS, LIFESTYLES, FREE_TIMES, FREE_TIME_DEFAULTS } from './i18n.js';

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

const ALL_OPTIONS = [...INTERESTS, ...ACTIVITIES, ...LANGS, ...WANTS, ...YEARS, ...LIFESTYLES, ...FREE_TIMES, ...AREA_GROUPS.flatMap((g) => g.items)];
const OPTION_MAP = new Map(ALL_OPTIONS.map((o) => [o[0], o]));
// 有翻譯就翻譯，沒有（例如自己填寫的區域）就原樣顯示
function label(id) { const o = OPTION_MAP.get(id); return o ? o[LI()] : id; }
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
  let verifier = null;
  let confirmation = null;

  return {
    setLang(l) { auth.languageCode = { zh: 'zh-TW', ja: 'ja', en: 'en' }[l]; },
    onUser(cb) { authMod.onAuthStateChanged(auth, (u) => cb(u ? { uid: u.uid } : null)); },
    async sendCode(phone) {
      if (!verifier) verifier = new authMod.RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      confirmation = await authMod.signInWithPhoneNumber(auth, phone, verifier);
    },
    async verify(code) {
      if (!confirmation) throw new Error('no-confirmation');
      await confirmation.confirm(code);
    },
    async getProfile(uid) {
      const snap = await fs.getDoc(fs.doc(db, 'users', uid));
      return snap.exists() ? snap.data() : null;
    },
    async saveProfile(uid, profile) {
      await fs.setDoc(fs.doc(db, 'users', uid), { ...profile, updatedAt: fs.serverTimestamp() });
    },
    async getGroup(uid) {
      const q = fs.query(fs.collection(db, 'groups'), fs.where('memberUids', 'array-contains', uid), fs.limit(1));
      const res = await fs.getDocs(q);
      return res.empty ? null : res.docs[0].data();
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
  return {
    setLang() {},
    onUser(cb) { listener = cb; const s = read(); cb(s.uid ? { uid: s.uid } : null); },
    async sendCode() { await new Promise((r) => setTimeout(r, 400)); },
    async verify(code) {
      if (code !== '123456') { const e = new Error('bad'); e.code = 'auth/invalid-verification-code'; throw e; }
      const s = read(); s.uid = 'demo-user'; write(s); listener({ uid: s.uid });
    },
    async getProfile() { return read().profile || null; },
    async saveProfile(uid, profile) { const s = read(); s.profile = profile; write(s); },
    async getAvatar(uid) { return uid === 'demo-user' ? read().avatar || null : null; },
    async saveAvatar(uid, img) { const s = read(); if (img) s.avatar = img; else delete s.avatar; write(s); },
    async getGroup() {
      const p = read().profile;
      if (!p) return null;
      const metas = t('demoMembers');
      return {
        members: [
          { uid: 'demo-user', nick: lang === 'en' ? `${p.nick} (${t('you')})` : `${p.nick}（${t('you')}）`, meta: `${label(p.years)}・${labels(p.langs)}` },
          { nick: 'Kenta', meta: metas[0] },
          { nick: 'Ana', meta: metas[1] },
          { nick: 'Jiwoo', meta: metas[2] }
        ],
        common: [...p.interests.slice(0, 2), ...(p.activities || []).slice(0, 1), p.area],
        meet: t('demoMeet', { area: label(p.area) }),
        chatUrl: ''
      };
    },
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
const picked = { interests: new Set(), activities: new Set(), langs: new Set(), wants: new Set(), freeTime: new Set() };

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

function renderChips(containerId, options, selected, max) {
  const box = $(containerId);
  box.innerHTML = '';
  addChips(box, options, selected, max, containerId);
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

function renderAllChips() {
  renderChipGroups('chips-interests', INTEREST_GROUPS, INTERESTS, picked.interests, MAX_INTERESTS);
  renderChipGroups('chips-activities', ACTIVITY_GROUPS, ACTIVITIES, picked.activities);
  renderChips('chips-langs', LANGS, picked.langs);
  renderChips('chips-wants', WANTS, picked.wants);
  renderChips('chips-free', FREE_TIMES, picked.freeTime);
  updateInterestCount();
}

// 切換語言時：保留已輸入的值，只換文字
function refreshProfileOptions() {
  const areaVal = $('area').value === AREA_OTHER ? ($('area-other').value || AREA_OTHER) : $('area').value;
  const otherText = $('area-other').value;
  const yearsVal = $('years').value;
  const lifeVal = $('lifestyle').value;
  fillLifestyle(lifeVal);
  fillAreaSelect(areaVal);
  if ($('area').value === AREA_OTHER) $('area-other').value = otherText;
  fillYears(yearsVal);
  renderAllChips();
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
  picked.freeTime = new Set(p?.freeTime || []);
  picked.interests = new Set(p?.interests || []);
  picked.activities = new Set(p?.activities || []);
  picked.langs = new Set(p?.langs || []);
  picked.wants = new Set(p?.wants || []);
  renderAllChips();
  $('activity-other').value = p?.activityOther || '';
  avatarData = avatar || null;
  avatarChanged = false;
  setAvatarPreview(avatarData);
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
    [t('sumArea'), label(p.area)], [t('sumInterests'), labels(p.interests)], [t('sumTodo'), todo || '—'],
    [t('sumFree'), [label(p.lifestyle), labels(p.freeTime)].filter(Boolean).join(lang === 'en' ? ': ' : '・')],
    [t('sumLangs'), labels(p.langs)], [t('sumWants'), labels(p.wants)], [t('sumYears'), label(p.years)]
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
    text.appendChild(el('div', 'member-meta', m.meta || ''));
    li.append(makeAvatar(m.nick, i, avatars[i]), text);
    ul.appendChild(li);
  });
  const tags = $('common-tags');
  tags.innerHTML = '';
  for (const tag of g.common || []) tags.appendChild(el('span', 'tag', label(tag)));
  $('meet-text').textContent = g.meet || t('meetDefault');
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
  if (code.includes('invalid-phone-number')) return t('errBadPhone');
  if (code.includes('too-many-requests')) return t('errTooMany');
  if (code.includes('invalid-verification-code')) return t('errBadCode');
  if (code.includes('code-expired')) return t('errExpired');
  return t('errGeneric');
}

function normalizePhone(country, raw) {
  let digits = raw.replace(/[^\d]/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  return country + digits;
}

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
    if (!user) { $('phone-form').hidden = false; $('code-form').hidden = true; show('register'); return; }
    [currentProfile, currentAvatar] = await Promise.all([
      backend.getProfile(user.uid).catch(() => null),
      backend.getAvatar(user.uid).catch(() => null)
    ]);
    if (currentProfile) showMatch(user.uid, currentProfile);
    else { loadProfileForm(null, currentAvatar); show('profile'); }
  });

  $('phone-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    $('register-error').textContent = '';
    const raw = $('phone').value.trim();
    if (raw.replace(/[^\d]/g, '').length < 8) { $('register-error').textContent = t('errPhoneEmpty'); return; }
    const btn = $('send-code');
    btn.disabled = true; btn.textContent = t('sending');
    try {
      await backend.sendCode(normalizePhone($('country').value, raw));
      $('phone-form').hidden = true;
      $('code-form').hidden = false;
      $('code').focus();
    } catch (e) {
      $('register-error').textContent = authErrorText(e);
    } finally {
      btn.disabled = false; btn.textContent = t('sendCode');
    }
  });

  $('code-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    $('register-error').textContent = '';
    const code = $('code').value.trim();
    if (!/^\d{6}$/.test(code)) { $('register-error').textContent = t('errCode6'); return; }
    try { await backend.verify(code); } catch (e) { $('register-error').textContent = authErrorText(e); }
  });

  $('change-phone').addEventListener('click', () => {
    $('code-form').hidden = true; $('phone-form').hidden = false; $('code').value = '';
  });

  $('area').addEventListener('change', () => {
    const isOther = $('area').value === AREA_OTHER;
    $('area-other').hidden = !isOther;
    if (isOther) $('area-other').focus();
  });

  // 選了生活型態、而且還沒選時段時，自動先勾常見的時段
  $('lifestyle').addEventListener('change', () => {
    const v = $('lifestyle').value;
    if (v && picked.freeTime.size === 0) {
      for (const id of FREE_TIME_DEFAULTS[v] || []) picked.freeTime.add(id);
      renderChips('chips-free', FREE_TIMES, picked.freeTime);
    }
  });

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
      area: areaSel === AREA_OTHER ? $('area-other').value.trim().slice(0, 30) : areaSel,
      interests: [...picked.interests],
      activities: [...picked.activities],
      activityOther: $('activity-other').value.trim().slice(0, 40),
      langs: [...picked.langs],
      wants: [...picked.wants],
      lifestyle: $('lifestyle').value,
      freeTime: [...picked.freeTime],
      years: $('years').value
    };
    if (!profile.nick) return void (err.textContent = t('errNick'));
    if (!profile.area) return void (err.textContent = areaSel === AREA_OTHER ? t('errAreaOther') : t('errArea'));
    if (!profile.interests.length) return void (err.textContent = t('errInterest'));
    if (!profile.activities.length && !profile.activityOther) return void (err.textContent = t('errActivity'));
    if (!profile.langs.length) return void (err.textContent = t('errLang'));
    if (!profile.wants.length) return void (err.textContent = t('errWant'));
    if (!profile.lifestyle) return void (err.textContent = t('errLifestyle'));
    if (!profile.freeTime.length) return void (err.textContent = t('errFreeTime'));
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
