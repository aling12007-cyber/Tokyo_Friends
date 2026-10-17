import { firebaseConfig } from './firebase-config.js';

// ---------- 選項 ----------
const AREA_GROUPS = [
  ['東京 23 區', ['新宿・新大久保', '澀谷・原宿・表參道', '池袋・高田馬場', '上野・淺草・秋葉原', '東京站・銀座・日本橋', '品川・目黑・五反田', '惠比壽・中目黑・自由之丘', '六本木・麻布・赤坂', '中野・高圓寺', '下北澤・三軒茶屋', '錦糸町・押上・龜戶', '北千住・赤羽', '豐洲・月島・台場', '蒲田・大森']],
  ['東京 多摩', ['吉祥寺・三鷹', '立川・國立', '八王子・高尾', '町田', '調布・府中']],
  ['埼玉', ['大宮', '浦和', '川口・蕨・西川口', '所澤', '川越', '越谷・草加', '和光・朝霞・志木', '春日部']],
  ['神奈川', ['橫濱站周邊', '港未來・關內・中華街', '新橫濱・日吉', '川崎・武藏小杉', '溝之口・登戶', '相模原・橋本', '湘南・藤澤・茅崎', '鎌倉・逗子', '橫須賀・三浦', '厚木・海老名']]
];
const AREA_OTHER = '__other';
const INTERESTS = [
  '咖啡廳', '美食探店', '居酒屋', '甜點', '料理', '烘焙',
  '登山健行', '露營', '溫泉旅行', '國內旅行', '海外旅行', '散步・街拍',
  '攝影', '畫畫', '手作', '寫作',
  '讀書', '電影', '日劇・韓劇', '動漫', '遊戲', '桌遊', '密室逃脫',
  '音樂・Live', 'K-POP', '卡拉 OK', '樂器',
  '運動', '健身', '跑步', '瑜伽', '游泳', '球類運動', '滑雪・滑板',
  '日本傳統文化', '神社・寺院', '祭典・花火', '茶道・花道', '和服',
  '美術館・展覽', '時尚', '寵物', '程式・科技', '投資理財', '語言學習'
];
const ACTIVITIES = [
  '喝咖啡聊天', '一起吃飯', '喝一杯', '逛街', '逛美術館・展覽',
  '爬山・健行', '去溫泉', '一日小旅行', '賞花・賞楓', '看祭典・花火',
  '參拜神社・寺院', '唱 KTV', '玩桌遊', '看電影', '去 Live・演唱會',
  '一起運動', '讀書會', '一起讀書・自習', '語言交換', '一起做料理'
];
const LANGS = ['中文', '日文', '英文', '韓文', '其他'];
const WANTS = ['聊天朋友', '一起出去玩', '語言交換', '生活互助'];
const YEARS = ['剛來（半年內）', '半年～2 年', '2～5 年', '5 年以上'];
const MAX_INTERESTS = 8;
const AVATAR_SIZE = 256;

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
    async getAvatar() { return read().avatar || null; },
    async saveAvatar(uid, img) { const s = read(); if (img) s.avatar = img; else delete s.avatar; write(s); },
    async getGroup() {
      const p = read().profile;
      if (!p) return null;
      return {
        members: [
          { uid: 'demo-user', nick: `${p.nick}（你）`, meta: `${p.years}・${p.langs.join('、')}` },
          { nick: 'Kenta', meta: '日本人・日文、英文・想練中文' },
          { nick: 'Ana', meta: '在日半年・英文、葡萄牙文' },
          { nick: 'Jiwoo', meta: '在日 1 年・韓文、日文' }
        ],
        common: [...p.interests.slice(0, 2), ...(p.activities || []).slice(0, 1), p.area],
        meet: `週末白天・${p.area.split('・').slice(-2).join('・')}附近的咖啡廳（公開場所）`,
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

function fillAreaSelect(value) {
  const sel = $('area');
  sel.length = 1;
  for (const g of [...sel.querySelectorAll('optgroup')]) g.remove();
  const known = new Set();
  for (const [label, items] of AREA_GROUPS) {
    const og = document.createElement('optgroup');
    og.label = label;
    for (const a of items) {
      const v = `${label === '東京 23 區' || label === '東京 多摩' ? '東京' : label}・${a}`;
      og.appendChild(new Option(a, v));
      known.add(v);
    }
    sel.appendChild(og);
  }
  sel.appendChild(new Option('其他（自己填寫）', AREA_OTHER));
  const other = $('area-other');
  if (value && !known.has(value)) { sel.value = AREA_OTHER; other.value = value; }
  else { sel.value = value || ''; other.value = ''; }
  other.hidden = sel.value !== AREA_OTHER;
}

const picked = { interests: new Set(), activities: new Set(), langs: new Set(), wants: new Set() };
let avatarData = null;      // 目前表單上的頭像（data URL）
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
  fillSelect('years', YEARS, p?.years);
  picked.interests = new Set(p?.interests || []);
  picked.activities = new Set(p?.activities || []);
  picked.langs = new Set(p?.langs || []);
  picked.wants = new Set(p?.wants || []);
  renderChips('chips-interests', INTERESTS, picked.interests, MAX_INTERESTS);
  renderChips('chips-activities', ACTIVITIES, picked.activities);
  renderChips('chips-langs', LANGS, picked.langs);
  renderChips('chips-wants', WANTS, picked.wants);
  $('activity-other').value = p?.activityOther || '';
  $('interest-count').textContent = `已選 ${picked.interests.size} 個`;
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
      ctx.fillStyle = '#FBF8F1';
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
// 藍・朱・抹茶・藤・黄土
const AVATAR_COLORS = [['#E3E9EF', '#1A3550'], ['#F5E4DC', '#8A2A17'], ['#E6EBDD', '#3F5228'], ['#ECE6F0', '#4E3A66'], ['#F1E9D6', '#6A5220']];

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
  const todo = [...(p.activities || []), p.activityOther].filter(Boolean).join('、');
  const rows = [['區域', p.area], ['興趣', p.interests.join('、')], ['想一起', todo || '—'], ['語言', p.langs.join('、')], ['想找', p.wants.join('、')], ['在日', p.years]];
  for (const [k, v] of rows) { dl.appendChild(el('dt', null, k)); dl.appendChild(el('dd', null, v)); }
  box.appendChild(dl);
}

async function renderGroup(g) {
  const ul = $('members');
  ul.innerHTML = '';
  const members = g.members || [];
  const avatars = await Promise.all(members.map((m) => (m.uid ? backend.getAvatar(m.uid).catch(() => null) : null)));
  members.forEach((m, i) => {
    const li = el('li', 'member');
    const av = makeAvatar(m.nick, i, avatars[i]);
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
    [currentProfile, currentAvatar] = await Promise.all([
      backend.getProfile(user.uid).catch(() => null),
      backend.getAvatar(user.uid).catch(() => null)
    ]);
    if (currentProfile) showMatch(user.uid, currentProfile);
    else { loadProfileForm(null, currentAvatar); show('profile'); }
  });

  $('area').addEventListener('change', () => {
    const isOther = $('area').value === AREA_OTHER;
    $('area-other').hidden = !isOther;
    if (isOther) $('area-other').focus();
  });

  $('avatar-file').addEventListener('change', async (ev) => {
    const file = ev.target.files && ev.target.files[0];
    ev.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { $('profile-error').textContent = '請選擇圖片檔。'; return; }
    try {
      avatarData = await resizeImage(file);
      avatarChanged = true;
      setAvatarPreview(avatarData);
      $('profile-error').textContent = '';
    } catch {
      $('profile-error').textContent = '這張照片讀不出來，換一張試試。';
    }
  });

  $('avatar-remove').addEventListener('click', () => {
    avatarData = null;
    avatarChanged = true;
    setAvatarPreview(null);
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
    const areaSel = $('area').value;
    const profile = {
      nick: $('nick').value.trim().slice(0, 20),
      area: areaSel === AREA_OTHER ? $('area-other').value.trim().slice(0, 30) : areaSel,
      interests: [...picked.interests],
      activities: [...picked.activities],
      activityOther: $('activity-other').value.trim().slice(0, 40),
      langs: [...picked.langs],
      wants: [...picked.wants],
      years: $('years').value
    };
    if (!profile.nick) return void (err.textContent = '請填寫暱稱。');
    if (!profile.area) return void (err.textContent = areaSel === AREA_OTHER ? '請填寫你的區域。' : '請選擇區域。');
    if (!profile.interests.length) return void (err.textContent = '請至少選一個興趣。');
    if (!profile.activities.length && !profile.activityOther) return void (err.textContent = '請至少選一件想一起做的事。');
    if (!profile.langs.length) return void (err.textContent = '請至少選一個語言。');
    if (!profile.wants.length) return void (err.textContent = '請選擇想找的朋友類型。');
    if (!profile.years) return void (err.textContent = '請選擇來日本多久。');
    if (!$('agree').checked) return void (err.textContent = '請先同意社群守則。');
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
    } catch (e) {
      err.textContent = '儲存失敗，請稍後再試。';
    }
  });

  $('edit-profile').addEventListener('click', () => { loadProfileForm(currentProfile, currentAvatar); show('profile'); });
  for (const id of ['logout-1', 'logout-2']) $(id).addEventListener('click', () => backend.logout());

  const dialog = $('rules-dialog');
  for (const id of ['open-rules', 'open-rules-2']) {
    $(id).addEventListener('click', (ev) => { ev.preventDefault(); dialog.showModal(); });
  }
}

start();
