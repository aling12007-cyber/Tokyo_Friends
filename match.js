// 自動配對演算法（在管理者的瀏覽器裡執行，不需要伺服器）
//
// 1. 必要條件（不符合就不會放在同一組）
//    - 住的地方不能太遠：東京 23 區可以和任何地區同組；只有埼玉×神奈川、埼玉×多摩這種太遠的組合不會放一起
//    - 至少有一個共同語言（「初學」程度不算）
//    - 至少有一個共同的空閒時段（「不固定（看排班）」視為都可以）
//    - 年齡層：雙方都在對方想認識的年齡層內（選「不在意年齡」就都可以）
//    - 聚會人數喜好不衝突（只要小團體的人不會被放進多人組，反之亦然）
// 2. 相似度分數：共同興趣、想做的事、同一區、共同時段、氛圍、頻率等越多分數越高
// 3. 從最難配的人開始，一個一個加入分數最高的人，湊滿 4 人（小團體）或 5 人（多人）

import { AREA_GROUPS } from './i18n.js';

const FREE_SLOTS = ['weekday-day', 'weekday-night', 'sat', 'sun', 'holiday'];
const AREA_REGION = new Map();
AREA_GROUPS.forEach((g, gi) => { for (const it of g.items) AREA_REGION.set(it[0], gi); });

// AREA_GROUPS 的順序：0 東京 23 區、1 多摩、2 埼玉、3 神奈川
const FAR = new Set(['1-2', '2-1', '2-3', '3-2']);
function tooFar(a, b) {
  const ra = regionOf(a), rb = regionOf(b);
  if (ra === 'other' || rb === 'other') return false;
  return FAR.has(`${ra}-${rb}`);
}

export function regionOf(u) {
  return AREA_REGION.has(u.area) ? AREA_REGION.get(u.area) : 'other';
}

export function sizeType(u) {
  const p = new Set(u.prefs || []);
  const small = p.has('size-small') || p.has('size-pair');
  const large = p.has('size-large');
  if (small && !large) return 'small';
  if (large && !small) return 'large';
  return 'any';
}

function slots(u) {
  const f = u.freeTime || [];
  if (f.includes('irregular')) return new Set(FREE_SLOTS); // 排班制：視為什麼時間都有可能
  return new Set(f.filter((x) => FREE_SLOTS.includes(x)));
}

function ageOk(a, b) {
  const want = (x) => new Set(x.ageWant || []);
  const accepts = (x, y) => { const w = want(x); return w.size === 0 || w.has('age-any') || !y.age || w.has(y.age); };
  return accepts(a, b) && accepts(b, a);
}

// 能用來聊天的語言：「初學」不算（還沒辦法聊）；沒填程度的舊資料當作可以
function langs(u) {
  const lv = u.langLevels || {};
  return new Set((u.langs || []).filter((l) => l !== 'other' && lv[l] !== 'beginner'));
}
const GOOD = new Set(['native', 'fluent']);
const lvOf = (u, l) => (u.langLevels || {})[l];

const overlap = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n; };
const S = (arr) => new Set(arr || []);

export function pairScore(a, b) {
  let s = 0;
  s += 2 * overlap(S(a.interests), S(b.interests));
  s += 2 * overlap(S(a.activities), S(b.activities));
  if (a.area && a.area === b.area) s += 6;
  else if (regionOf(a) === regionOf(b) && regionOf(a) !== 'other') s += 4;
  s += 1.5 * overlap(slots(a), slots(b));
  s += overlap(S(a.wants), S(b.wants));
  if (a.lifestyle && a.lifestyle === b.lifestyle) s += 1;
  if (a.age && a.age === b.age) s += 2;
  const pa = S(a.prefs), pb = S(b.prefs);
  for (const k of ['vibe-quiet', 'vibe-lively', 'vibe-themed', 'vibe-slow', 'vibe-longterm']) if (pa.has(k) && pb.has(k)) s += 1;
  for (const k of ['freq-weekly', 'freq-monthly', 'freq-casual']) if (pa.has(k) && pb.has(k)) s += 2;
  // 想認識日本人 × 對方是日本人；想練日文／英文 × 對方會說
  if (pa.has('who-jp') && b.years === 'local') s += 2;
  if (pb.has('who-jp') && a.years === 'local') s += 2;
  // 想練日文／英文 × 對方說得很好（母語或流利）加更多分
  for (const [want, l] of [['talk-ja', 'ja'], ['talk-en', 'en']]) {
    if (pa.has(want) && langs(b).has(l)) s += GOOD.has(lvOf(b, l)) ? 2 : 1;
    if (pb.has(want) && langs(a).has(l)) s += GOOD.has(lvOf(a, l)) ? 2 : 1;
  }
  // 共同語言兩個人都說得很好，聊天比較順
  for (const l of langs(a)) if (langs(b).has(l) && GOOD.has(lvOf(a, l)) && GOOD.has(lvOf(b, l))) { s += 1; break; }
  return s;
}

function sizeOk(type, u) {
  const t = sizeType(u);
  if (type === 'small') return t !== 'large';
  if (type === 'large') return t !== 'small';
  return true;
}

// 檢查 u 能不能加入這組
export function canJoin(group, u, type) {
  if (!sizeOk(type, u)) return false;
  for (const m of group) {
    if (tooFar(m, u)) return false;
    if (overlap(langs(m), langs(u)) === 0) return false;
    if (!ageOk(m, u)) return false;
  }
  const common = groupSlots([...group, u]);
  return common.size > 0;
}

export function groupSlots(group) {
  let common = null;
  for (const m of group) {
    const s = slots(m);
    common = common ? new Set([...common].filter((x) => s.has(x))) : s;
  }
  return common || new Set();
}

export function groupScore(group) {
  if (group.length < 2) return 0;
  let total = 0, n = 0;
  for (let i = 0; i < group.length; i++) for (let j = i + 1; j < group.length; j++) { total += pairScore(group[i], group[j]); n++; }
  return Math.round(total / n);
}

// 回傳 { groups: [[user...]...], leftover: [user...] }
export function autoMatch(users) {
  let pool = [...users];
  const groups = [];
  const leftover = [];

  while (pool.length >= 3) {
    // 先處理「最難配」的人：可以跟他同組的人最少
    let seed = null, seedCount = Infinity;
    for (const u of pool) {
      const type = sizeType(u) === 'large' ? 'large' : 'small';
      const c = pool.filter((v) => v !== u && canJoin([u], v, type)).length;
      if (c < seedCount) { seed = u; seedCount = c; }
    }
    const type = sizeType(seed) === 'large' ? 'large' : 'small';
    const target = type === 'large' ? 5 : 4;
    const group = [seed];
    pool = pool.filter((u) => u !== seed);

    while (group.length < target) {
      let best = null, bestScore = -Infinity;
      for (const u of pool) {
        if (!canJoin(group, u, type)) continue;
        const sc = group.reduce((acc, m) => acc + pairScore(m, u), 0) / group.length;
        if (sc > bestScore) { best = u; bestScore = sc; }
      }
      if (!best) break;
      group.push(best);
      pool = pool.filter((u) => u !== best);
    }

    if (group.length >= 3) { group.type = type; groups.push(group); }
    else leftover.push(...group);
  }

  // 剩下的人：試著塞進還有空位、條件合得來的組（小團體最多 4 人、多人聚會最多 6 人）
  for (const u of [...pool, ...leftover.splice(0)]) {
    let best = null, bestScore = -Infinity;
    for (const g of groups) {
      const cap = g.type === 'large' ? 6 : 4;
      if (g.length >= cap) continue;
      if (!canJoin(g, u, g.type)) continue;
      const sc = g.reduce((acc, m) => acc + pairScore(m, u), 0) / g.length;
      if (sc > bestScore) { best = g; bestScore = sc; }
    }
    if (best) best.push(u); else leftover.push(u);
  }

  return { groups, leftover };
}

// 小組的共同點：至少一半的人都選了的興趣／想做的事，最多 4 個
export function commonTags(group) {
  const count = new Map();
  for (const m of group) for (const id of [...(m.interests || []), ...(m.activities || [])]) count.set(id, (count.get(id) || 0) + 1);
  const need = Math.max(2, Math.ceil(group.length / 2));
  return [...count.entries()].filter(([, n]) => n >= need).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([id]) => id);
}

// 建議見面地點：組裡最多人選的區域
export function commonArea(group) {
  const count = new Map();
  for (const m of group) if (m.area) count.set(m.area, (count.get(m.area) || 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}

// 檢查一組有沒有問題（給手動調整後提醒用）
export function groupWarnings(group) {
  const w = [];
  if (group.length < 3) w.push('人數少於 3 人');
  if (group.length > 6) w.push('人數超過 6 人');
  let langOk = true;
  for (let i = 0; i < group.length; i++) for (let j = i + 1; j < group.length; j++) if (overlap(langs(group[i]), langs(group[j])) === 0) langOk = false;
  if (!langOk) w.push('有人沒有共同語言');
  let ageAll = true;
  for (let i = 0; i < group.length; i++) for (let j = i + 1; j < group.length; j++) if (!ageOk(group[i], group[j])) ageAll = false;
  if (!ageAll) w.push('有人不在對方想認識的年齡層');
  if (groupSlots(group).size === 0) w.push('沒有共同的空閒時間');
  let far = false;
  for (let i = 0; i < group.length; i++) for (let j = i + 1; j < group.length; j++) if (tooFar(group[i], group[j])) far = true;
  if (far) w.push('有人住得太遠');
  const types = new Set(group.map(sizeType));
  if (group.length >= 5 && types.has('small')) w.push('有人只想參加小團體');
  if (group.length <= 4 && types.has('large')) w.push('有人只想參加多人聚會');
  return w;
}
