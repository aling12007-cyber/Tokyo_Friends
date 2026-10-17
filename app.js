import { firebaseConfig } from './firebase-config.js';

// ---------- 選項 ----------
const AREAS = ['新宿・澀谷', '池袋・高田馬場', '上野・淺草', '品川・目黑', '吉祥寺・中央線沿線', '東京東部（錦糸町・葛西等）', '橫濱・川崎', '埼玉・千葉'];
const INTERESTS = ['咖啡廳', '登山健行', '美食探店', '桌遊', '攝影', '溫泉旅行', '運動', '動漫', '日本傳統文化', '音樂・Live', '讀書', '料理'];
const LANGS = ['中文', '日文', '英文', '韓文', '其他'];
const WANTS = ['聊天朋友', '一起出去玩', '語言交換', '生活互助'];
const YEARS = ['剛來（半年內）', '半年～2 年', '2～5 年', '5 年以上'];
const MAX_INTERESTS = 6;

const $ = (id) => document.getElementById(id);
const DEMO = !firebaseConfig.apiKey;

// ---------- 後端：Firebase 或示範模式 ----------
let backend;

async function makeFirebaseBackend() {
  const V = '10.12.2';
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
  const authMod = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`);
  const fs = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`);

  const app = initializeApp(firebaseConfig);
  const auth = authMod.getAuth(app);
  auth.languageCode = 'zh-TW';
  const db = fs.getFirestore(app);
  let verifier = null;
  let confirmation = null;

  return {
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
    async logout() { await authMod.signOut(auth); }
  };
}

function makeDemoBackend() {
  const KEY = 'tokyo-friends-demo';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* 無法儲存時忽略 */ } };
  let listener = () => {};
  return {
    onUser(cb) { listener = cb; const s = read(); cb(s.uid ? { uid: s.uid } : null); },
    async sendCode() { await new Promise((r) => setTimeout(r, 400)); },
    async verify(code) {
      if (code !== '123456') { const e = new Error('bad'); e.code = 'auth/invalid-verification-code'; throw e; }
      const s = read(); s.uid = 'demo-user'; write(s); listener({ uid: s.uid });
    },
    async getProfile() { return read().profile || null; },
    async saveProfile(uid, profile) { const s = read(); s.profile = profile; write(s); },
    async getGroup() {
      const p = read().profile;
      if (!p) return null;
      return {
        members: [
          { nick: `${p.nick}（你）`, meta: `${p.years}・${p.langs.join('、')}` },
          { nick: 'Kenta', meta: '日本人・日文、英文・想練中文' },
          { nick: 'Ana', meta: '在日半年・英文、葡萄牙文' },
          { nick: 'Jiwoo', meta: '在日 1 年・韓文、日文' }
        ],
        common: [...p.interests.slice(0, 2), p.area],
        meet: `週末白天・${p.area.split('・')[0]}的咖啡廳（公開場所）`,
        chatUrl: ''
      };
    },
    async logout() { const s = read(); delete s.uid; write(s); listener(null); }
  };
}

// ---------- 畫面切換 ----------
function show(name) {
  for (const id of ['screen-register', 'screen-profile', 'screen-match']) $(id).hidden = id !== `screen-${name}`;
  $('loading').hidden = true;
  window.scrollTo(0, 0);
}

// ---------- 標籤選擇 ----------
function renderChips(containerId, options, selected, max) {
  const box = $(containerId);
  box.innerHTML = '';
  for (const label of options) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = label;
    b.setAttribute('aria-pressed', selected.has(label) ? 'true' : 'false');
    b.addEventListener('click', () => {
      if (selected.has(label)) selected.delete(label);
      else if (!max || selected.size < max) selected.add(label);
      b.setAttribute('aria-pressed', selected.has(label) ? 'true' : 'false');
      if (containerId === 'chips-interests') $('interest-count').textContent = `已選 ${selected.size} 個`;
    });
    box.appendChild(b);
  }
}

function fillSelect(id, options, value) {
  const sel = $(id);
  sel.length = 1;
  for (const o of options) sel.add(new Option(o, o));
  if (value) sel.value = value;
}

const picked = { interests: new Set(), langs: new Set(), wants: new Set() };

function loadProfileForm(p) {
  $('nick').value = p?.nick || '';
  fillSelect('area', AREAS, p?.area);
  fillSelect('years', YEARS, p?.years);
  picked.interests = new Set(p?.interests || []);
  picked.langs = new Set(p?.langs || []);
  picked.wants = new Set(p?.wants || []);
  renderChips('chips-interests', INTERESTS, picked.interests, MAX_INTERESTS);
  renderChips('chips-langs', LANGS, picked.langs);
  renderChips('chips-wants', WANTS, picked.wants);
  $('interest-count').textContent = `已選 ${picked.interests.size} 個`;
  $('agree').checked = !!p;
  $('profile-error').textContent = '';
}

// ---------- 配對頁 ----------
// 藍・朱・抹茶・藤・黄土
const AVATAR_COLORS = [['#E3E9EF', '#1A3550'], ['#F5E4DC', '#8A2A17'], ['#E6EBDD', '#3F5228'], ['#ECE6F0', '#4E3A66'], ['#F1E9D6', '#6A5220']];

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function renderSummary(p) {
  const box = $('my-summary');
  box.innerHTML = '';
  const dl = el('dl');
  const rows = [['暱稱', p.nick], ['區域', p.area], ['興趣', p.interests.join('、')], ['語言', p.langs.join('、')], ['想找', p.wants.join('、')], ['在日', p.years]];
  for (const [k, v] of rows) { dl.appendChild(el('dt', null, k)); dl.appendChild(el('dd', null, v)); }
  box.appendChild(dl);
}

function renderGroup(g) {
  const ul = $('members');
  ul.innerHTML = '';
  (g.members || []).forEach((m, i) => {
    const li = el('li', 'member');
    const av = el('div', 'avatar', (m.nick || '?').trim().charAt(0).toUpperCase());
    const [bg, fg] = AVATAR_COLORS[i % AVATAR_COLORS.length];
    av.style.background = bg; av.style.color = fg;
    av.setAttribute('aria-hidden', 'true');
    const text = el('div');
    text.appendChild(el('div', 'member-name', m.nick));
    text.appendChild(el('div', 'member-meta', m.meta || ''));
    li.append(av, text);
    ul.appendChild(li);
  });
  const tags = $('common-tags');
  tags.innerHTML = '';
  for (const t of g.common || []) tags.appendChild(el('span', 'tag', t));
  if (g.meet) $('meet-text').textContent = g.meet;
  const link = $('chat-link');
  const safeUrl = typeof g.chatUrl === 'string' && /^https:\/\//.test(g.chatUrl) ? g.chatUrl : '';
  link.hidden = !safeUrl;
  if (safeUrl) link.href = safeUrl;
}

async function showMatch(uid, profile) {
  show('match');
  const group = await backend.getGroup(uid).catch(() => null);
  $('group').hidden = !group;
  $('waiting').hidden = !!group;
  if (group) renderGroup(group); else renderSummary(profile);
}

// ---------- 錯誤訊息 ----------
function authErrorText(e) {
  const code = e?.code || '';
  if (code.includes('invalid-phone-number')) return '手機號碼格式不正確，請確認後再試。';
  if (code.includes('too-many-requests')) return '嘗試次數太多，請稍後再試。';
  if (code.includes('invalid-verification-code')) return '驗證碼不正確。';
  if (code.includes('code-expired')) return '驗證碼已過期，請重新傳送。';
  return '發生錯誤，請稍後再試。';
}

function normalizePhone(country, raw) {
  let digits = raw.replace(/[^\d]/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  return country + digits;
}

// ---------- 啟動 ----------
let currentUser = null;
let currentProfile = null;

async function start() {
  $('demo-banner').hidden = !DEMO;
  try {
    backend = DEMO ? makeDemoBackend() : await makeFirebaseBackend();
  } catch (e) {
    $('loading').textContent = '無法連線，請重新整理頁面。';
    return;
  }

  backend.onUser(async (user) => {
    currentUser = user;
    if (!user) { $('phone-form').hidden = false; $('code-form').hidden = true; show('register'); return; }
    currentProfile = await backend.getProfile(user.uid).catch(() => null);
    if (currentProfile) showMatch(user.uid, currentProfile);
    else { loadProfileForm(null); show('profile'); }
  });

  $('phone-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    $('register-error').textContent = '';
    const raw = $('phone').value.trim();
    if (raw.replace(/[^\d]/g, '').length < 8) { $('register-error').textContent = '請輸入手機號碼。'; return; }
    const btn = $('send-code');
    btn.disabled = true; btn.textContent = '傳送中…';
    try {
      await backend.sendCode(normalizePhone($('country').value, raw));
      $('phone-form').hidden = true;
      $('code-form').hidden = false;
      $('code').focus();
    } catch (e) {
      $('register-error').textContent = authErrorText(e);
    } finally {
      btn.disabled = false; btn.textContent = '傳送驗證碼';
    }
  });

  $('code-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    $('register-error').textContent = '';
    const code = $('code').value.trim();
    if (!/^\d{6}$/.test(code)) { $('register-error').textContent = '請輸入 6 位數驗證碼。'; return; }
    try { await backend.verify(code); } catch (e) { $('register-error').textContent = authErrorText(e); }
  });

  $('change-phone').addEventListener('click', () => {
    $('code-form').hidden = true; $('phone-form').hidden = false; $('code').value = '';
  });

  $('profile-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const err = $('profile-error');
    const profile = {
      nick: $('nick').value.trim().slice(0, 20),
      area: $('area').value,
      interests: [...picked.interests],
      langs: [...picked.langs],
      wants: [...picked.wants],
      years: $('years').value
    };
    if (!profile.nick) return void (err.textContent = '請填寫暱稱。');
    if (!profile.area) return void (err.textContent = '請選擇區域。');
    if (!profile.interests.length) return void (err.textContent = '請至少選一個興趣。');
    if (!profile.langs.length) return void (err.textContent = '請至少選一個語言。');
    if (!profile.wants.length) return void (err.textContent = '請選擇想找的朋友類型。');
    if (!profile.years) return void (err.textContent = '請選擇來日本多久。');
    if (!$('agree').checked) return void (err.textContent = '請先同意社群守則。');
    err.textContent = '';
    try {
      await backend.saveProfile(currentUser.uid, profile);
      currentProfile = profile;
      showMatch(currentUser.uid, profile);
    } catch (e) {
      err.textContent = '儲存失敗，請稍後再試。';
    }
  });

  $('edit-profile').addEventListener('click', () => { loadProfileForm(currentProfile); show('profile'); });
  for (const id of ['logout-1', 'logout-2']) $(id).addEventListener('click', () => backend.logout());

  const dialog = $('rules-dialog');
  for (const id of ['open-rules', 'open-rules-2']) {
    $(id).addEventListener('click', (ev) => { ev.preventDefault(); dialog.showModal(); });
  }
}

start();
