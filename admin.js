import { firebaseConfig } from './firebase-config.js';
import {
  INTERESTS, ACTIVITIES, LANGS, WANTS, YEARS, LIFESTYLES, FREE_TIMES, PREF_GROUPS, AGES, AGE_ANY, AREA_GROUPS, FREE_TIME_DEFAULTS, LANG_LEVELS, NATIONALITIES, NATIONALITY_NONE
} from './i18n.js';
import { autoMatch, groupScore, commonTags, commonArea, groupSlots, groupWarnings, sizeType } from './match.js';

const $ = (id) => document.getElementById(id);
const DEMO = !firebaseConfig.apiKey;

// 後台只用中文顯示
const ALL = [...INTERESTS, ...ACTIVITIES, ...LANGS, ...WANTS, ...YEARS, ...LIFESTYLES, ...FREE_TIMES, ...AGES, AGE_ANY, ...LANG_LEVELS, ...NATIONALITIES, NATIONALITY_NONE,
  ...PREF_GROUPS.flatMap((g) => g.items), ...AREA_GROUPS.flatMap((g) => g.items)];
const NAME = new Map(ALL.map((o) => [o[0], o[1]]));
const zh = (id) => NAME.get(id) || id || '';
const zhs = (ids) => (ids || []).map(zh).join('、');
const zhLangs = (u) => (u.langs || []).map((l) => (u.langLevels && u.langLevels[l] ? `${zh(l)}(${zh(u.langLevels[l])})` : zh(l))).join('、');

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

// ---------- 後端 ----------
async function makeFirebaseAdmin() {
  const V = '10.12.2';
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`);
  const authMod = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`);
  const fs = await import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`);
  const app = initializeApp(firebaseConfig);
  const auth = authMod.getAuth(app);
  const db = fs.getFirestore(app);
  return {
    waitUser: () => new Promise((res) => { const off = authMod.onAuthStateChanged(auth, (u) => { off(); res(u); }); }),
    async isAdmin(uid) { try { return (await fs.getDoc(fs.doc(db, 'admins', uid))).exists(); } catch { return false; } },
    async listUsers() {
      const snap = await fs.getDocs(fs.collection(db, 'users'));
      return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
    },
    async listGroups(week) {
      const snap = await fs.getDocs(fs.query(fs.collection(db, 'groups'), fs.where('week', '==', week)));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    async createGroup(doc) { await fs.addDoc(fs.collection(db, 'groups'), { ...doc, createdAt: fs.serverTimestamp() }); },
    async updateGroup(id, patch) { await fs.updateDoc(fs.doc(db, 'groups', id), patch); },
    async deleteGroup(id) { await fs.deleteDoc(fs.doc(db, 'groups', id)); }
  };
}

// 示範模式：24 位假的報名者
function makeDemoAdmin() {
  const KEY = 'tokyo-friends-admin-demo';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* 忽略 */ } };
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const some = (arr, min, max) => {
    const n = min + Math.floor(rnd() * (max - min + 1));
    return [...arr].sort(() => rnd() - 0.5).slice(0, n);
  };
  const nicks = ['Mochi', 'Kenta', 'Ana', 'Jiwoo', 'Yuki', 'Leo', 'Mei', 'Haru', 'Sofia', 'Tom', 'Rin', 'Ivy', 'Daniel', 'Sakura', 'Wei', 'Nina', 'Kai', 'Momo', 'Lucas', 'Aya', 'Chen', 'Emma', 'Sho', 'Lily'];
  const areas = ['shinjuku', 'shinjuku', 'shibuya', 'shibuya', 'ikebukuro', 'ueno', 'nakano', 'ebisu', 'kichijoji', 'omiya', 'yokohama', 'kawasaki'];
  const users = nicks.map((nick, i) => {
    const lifestyle = pick(['office', 'office', 'student', 'shift', 'freelance']);
    const native = pick(['zh', 'zh', 'ja', 'en', 'ko']);
    const r = rnd();
    const size = r < 0.55 ? ['size-small'] : r < 0.8 ? ['size-large'] : ['size-small', 'size-large'];
    return {
      uid: `demo-${i}`,
      nationality: { zh: pick(['tw', 'tw', 'cn', 'hk']), ja: 'jp', en: pick(['us', 'gb', 'au', 'ca']), ko: 'kr' }[native] || 'none',
      nick,
      age: pick(AGES)[0],
      ageWant: rnd() < 0.65 ? ['age-any'] : some(AGES.map((a) => a[0]), 3, 5),
      area: pick(areas),
      interests: some(INTERESTS.map((x) => x[0]), 3, 7),
      activities: some(ACTIVITIES.map((x) => x[0]), 2, 4),
      ...(() => {
        const ls = [...new Set([native, pick(['ja', 'ja', 'en', 'zh'])])];
        const lv = {};
        for (const l of ls) lv[l] = l === native ? 'native' : pick(['fluent', 'conv', 'conv', 'basic', 'beginner']);
        return { langs: ls, langLevels: lv };
      })(),
      wants: some(WANTS.map((x) => x[0]), 1, 2),
      prefs: [...size, pick(['freq-weekly', 'freq-monthly', 'freq-casual']), ...some(['vibe-quiet', 'vibe-lively', 'vibe-themed', 'vibe-slow'], 1, 2)],
      lifestyle,
      freeTime: FREE_TIME_DEFAULTS[lifestyle],
      years: native === 'ja' ? 'local' : pick(['new', '2y', '5y', '5y+'])
    };
  });
  return {
    waitUser: async () => ({ uid: 'demo-admin' }),
    isAdmin: async () => true,
    listUsers: async () => users,
    listGroups: async (week) => read().filter((g) => g.week === week),
    async createGroup(doc) { const all = read(); all.push({ ...doc, id: `g${Date.now()}${Math.floor(rnd() * 1000)}` }); write(all); },
    async updateGroup(id, patch) { write(read().map((g) => g.id === id ? { ...g, ...patch } : g)); },
    async deleteGroup(id) { write(read().filter((g) => g.id !== id)); }
  };
}

// ---------- 狀態 ----------
let api;
let users = [];
let saved = [];        // 這個月已建立的小組
let suggestions = [];  // [{ members: [user], chatUrl, meet }]
let pool = [];         // 還沒分組的人

function thisWeek() {
  const d = new Date(); const day = (d.getDay() + 6) % 7; d.setDate(d.getDate() - day + 3);
  const first = new Date(d.getFullYear(), 0, 4); const fd = (first.getDay() + 6) % 7; first.setDate(first.getDate() - fd + 3);
  return `${d.getFullYear()}-W${String(1 + Math.round((d - first) / 604800000)).padStart(2, '0')}`;
}

function msg(text) { $('admin-msg').textContent = text; }

async function loadMonth() {
  const week = $('week').value;
  saved = await api.listGroups(week);
  const taken = new Set(saved.flatMap((g) => g.memberUids || []));
  pool = users.filter((u) => !taken.has(u.uid));
  suggestions = [];
  render();
}

function runMatch() {
  const all = [...pool, ...suggestions.flatMap((s) => s.members)];
  const { groups, leftover } = autoMatch(all);
  suggestions = groups.map((members) => ({ members, chatUrl: '', meet: '' }));
  pool = leftover;
  msg(`排好了 ${suggestions.length} 組。可以用每個人旁邊的選單換組，確認後按「建立」。`);
  render();
}

function moveUser(user, fromIdx, toIdx) {
  // fromIdx / toIdx：小組編號；-1 = 未分組；'new' = 新的一組
  if (fromIdx === -1) pool = pool.filter((u) => u !== user);
  else suggestions[fromIdx].members = suggestions[fromIdx].members.filter((u) => u !== user);
  if (toIdx === 'new') suggestions.push({ members: [user], chatUrl: '', meet: '' });
  else if (toIdx === -1) pool.push(user);
  else suggestions[toIdx].members.push(user);
  suggestions = suggestions.filter((s) => s.members.length > 0);
  render();
}

function buildDoc(s) {
  const members = s.members;
  const times = [...groupSlots(members)];
  const doc = {
    week: $('week').value,
    status: 'published',
    meetupsCompleted: 0,
    memberUids: members.map((u) => u.uid),
    members: members.map((u) => ({ uid: u.uid, nick: u.nick, nationality: u.nationality || '', years: u.years || '', langs: u.langs || [], langLevels: u.langLevels || {} })),
    common: commonTags(members),
    meetTimes: times.length ? times : ['irregular'],
    meetArea: commonArea(members),
    chatUrl: /^https:\/\//.test(s.chatUrl.trim()) ? s.chatUrl.trim() : ''
  };
  if (s.meet.trim()) doc.meet = s.meet.trim().slice(0, 100);
  return doc;
}

async function saveSuggestion(i) {
  const s = suggestions[i];
  if (s.members.length < 3 || s.members.length > 4) { msg('每組必須是 3–4 人，請先調整人數。'); return; }
  try {
    await api.createGroup(buildDoc(s));
    suggestions.splice(i, 1);
    await reloadSaved();
    msg('已建立，組員重新整理網頁就會看到小組。');
  } catch (e) {
    msg('建立失敗：請確認你有管理者權限，並已發布最新的資料庫規則。');
  }
}

async function saveAll() {
  const list = [...suggestions];
  let ok = 0;
  for (const s of list) {
    if (s.members.length < 3 || s.members.length > 4) continue;
    try { await api.createGroup(buildDoc(s)); suggestions = suggestions.filter((x) => x !== s); ok++; } catch { /* 留著讓管理者再試 */ }
  }
  await reloadSaved();
  msg(`已建立 ${ok} 組。`);
}

async function reloadSaved() {
  saved = await api.listGroups($('week').value);
  render();
}

async function removeSaved(g) {
  if (!confirm(`確定要解散「${(g.members || []).map((m) => m.nick).join('、')}」這組嗎？組員會回到未分組。`)) return;
  try {
    await api.deleteGroup(g.id);
    await loadMonth();
    msg('已解散。');
  } catch {
    msg('解散失敗，請稍後再試。');
  }
}

// ---------- 畫面 ----------
function personRow(u, fromIdx) {
  const row = el('div', 'person');
  const top = el('div', 'person-top');
  top.append(el('span', 'person-name', u.nick || '（無暱稱）'), el('span', 'person-area', zh(u.area)));
  if (u.nationality && u.nationality !== 'none') top.appendChild(el('span', 'person-nat', zh(u.nationality)));
  const meta = el('div', 'person-meta', [
    zh(u.age), zh(u.lifestyle), zhs(u.freeTime), zhLangs(u),
    sizeType(u) === 'small' ? '小團體' : sizeType(u) === 'large' ? '多人' : '人數不拘'
  ].filter(Boolean).join('｜'));
  const likes = el('div', 'person-likes', zhs([...(u.interests || []).slice(0, 5), ...(u.activities || []).slice(0, 2)]));

  const sel = el('select', 'move');
  sel.setAttribute('aria-label', `把 ${u.nick} 移到`);
  sel.add(new Option(fromIdx === -1 ? '加入…' : '移到…', ''));
  suggestions.forEach((_, i) => { if (i !== fromIdx) sel.add(new Option(`第 ${i + 1} 組`, String(i))); });
  sel.add(new Option('新的一組', 'new'));
  if (fromIdx !== -1) sel.add(new Option('未分組', '-1'));
  sel.addEventListener('change', () => {
    const v = sel.value;
    if (!v) return;
    moveUser(u, fromIdx, v === 'new' ? 'new' : Number(v));
  });

  row.append(top, meta, likes, sel);
  return row;
}

function suggestionCard(s, i) {
  const card = el('article', 'card group-card');
  const head = el('div', 'group-head');
  head.append(el('h3', null, `第 ${i + 1} 組（${s.members.length} 人）`), el('span', 'score', `契合度 ${groupScore(s.members)}`));
  card.appendChild(head);

  const warns = groupWarnings(s.members);
  if (warns.length) {
    const w = el('div', 'warn');
    w.textContent = `⚠ ${warns.join('、')}`;
    card.appendChild(w);
  }

  const common = commonTags(s.members);
  const times = [...groupSlots(s.members)];
  card.appendChild(el('div', 'group-common', `共同點：${zhs(common) || '—'}`));
  card.appendChild(el('div', 'group-common', `可見面：${zhs(times) || '時間再討論'}・${zh(commonArea(s.members))}附近`));

  for (const u of s.members) card.appendChild(personRow(u, i));

  const chat = el('input');
  chat.type = 'url';
  chat.placeholder = 'LINE 群組連結（選填，https://…）';
  chat.value = s.chatUrl;
  chat.setAttribute('aria-label', `第 ${i + 1} 組的聊天連結`);
  chat.addEventListener('input', () => { s.chatUrl = chat.value; });
  const meet = el('input');
  meet.type = 'text';
  meet.placeholder = '自訂見面時間地點（選填，例：11/8（六）14:00 新宿）';
  meet.value = s.meet;
  meet.setAttribute('aria-label', `第 ${i + 1} 組的見面時間地點`);
  meet.addEventListener('input', () => { s.meet = meet.value; });

  const btn = el('button', 'btn btn-primary btn-small', '建立這組');
  btn.type = 'button';
  btn.addEventListener('click', () => saveSuggestion(i));
  card.append(chat, meet, btn);
  return card;
}

function savedCard(g) {
  const card = el('article', 'card group-card saved-card');
  card.appendChild(el('h3', null, (g.members || []).map((m) => m.nick).join('、')));
  card.appendChild(el('div', 'group-common', `共同點：${zhs(g.common) || '—'}`));
  card.appendChild(el('div', 'group-common', g.meet || `可見面：${zhs(g.meetTimes)}・${zh(g.meetArea)}附近`));
  const done = Math.max(0, Math.min(1, Number(g.meetupsCompleted) || 0));
  card.appendChild(el('div', 'group-common', `聚會進度：${done}/1 次`));
  if (done < 2) { const b = el('button', 'btn btn-outline btn-small', `記錄已完成聚會`); b.type = 'button'; b.addEventListener('click', async () => { try { await api.updateGroup(g.id, { meetupsCompleted: done + 1, lastMeetupRecordedAt: new Date().toISOString() }); await reloadSaved(); msg('已更新聚會進度。'); } catch { msg('更新失敗：請確認管理者權限與資料庫規則。'); } }); card.appendChild(b); }
  else card.appendChild(el('div', 'group-common', '已完成至少一次聚會的目標。'));
  if (g.chatUrl) card.appendChild(el('div', 'group-common', '已設定聊天連結'));
  const del = el('button', 'btn-link', '解散這組');
  del.type = 'button';
  del.addEventListener('click', () => removeSaved(g));
  card.appendChild(del);
  return card;
}

function render() {
  const taken = saved.reduce((n, g) => n + (g.memberUids || []).length, 0);
  $('stats').textContent = `報名 ${users.length} 人｜這個月已分組 ${taken} 人｜還沒分組 ${users.length - taken} 人`;

  const sg = $('suggestions');
  sg.innerHTML = '';
  suggestions.forEach((s, i) => sg.appendChild(suggestionCard(s, i)));
  if (!suggestions.length) sg.appendChild(el('p', 'muted small', '按「自動配對」產生建議。'));
  $('sugg-count').textContent = suggestions.length ? `${suggestions.length} 組` : '';
  $('save-all').hidden = suggestions.length === 0;

  const pl = $('pool');
  pl.innerHTML = '';
  pool.forEach((u) => pl.appendChild(personRow(u, -1)));
  if (!pool.length) pl.appendChild(el('p', 'muted small', '沒有人了。'));
  $('pool-count').textContent = `${pool.length} 人`;

  const sv = $('saved');
  sv.innerHTML = '';
  saved.forEach((g) => sv.appendChild(savedCard(g)));
  if (!saved.length) sv.appendChild(el('p', 'muted small', '還沒有。'));
  $('saved-count').textContent = saved.length ? `${saved.length} 組` : '';
}

// ---------- 啟動 ----------
async function start() {
  $('demo-banner').hidden = !DEMO;
  const gate = $('gate');
  try {
    api = DEMO ? makeDemoAdmin() : await makeFirebaseAdmin();
  } catch {
    gate.hidden = false; gate.textContent = '無法連線，請重新整理頁面。';
    return;
  }
  const user = await api.waitUser();
  if (!user) {
    gate.hidden = false;
    gate.append(el('p', null, '請先到首頁登入（要完成 Email 認證），再回到這一頁。'));
    const a = el('a', 'btn btn-primary', '前往首頁登入');
    a.href = 'index.html';
    gate.appendChild(a);
    return;
  }
  if (!(await api.isAdmin(user.uid))) {
    gate.hidden = false;
    gate.append(
      el('p', null, '你還不是管理者。請到 Firebase 主控台 → Firestore → 新增集合「admins」，文件 ID 填下面這串，欄位隨意（例如 name: 你的名字）。'),
      el('code', 'uid', user.uid)
    );
    return;
  }

  $('console').hidden = false;
  $('week').value = thisWeek();
  users = await api.listUsers();
  await loadMonth();

  $('week').addEventListener('change', loadMonth);
  $('run').addEventListener('click', runMatch);
  $('save-all').addEventListener('click', saveAll);
}

start();
