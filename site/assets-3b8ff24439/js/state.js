// Progress store (browser only). Never stores agent content.
const KEY = 'mabw.progress';
const VERSION = '2.0';
const DEFAULTS = () => ({
  schemaVersion: VERSION,
  mode: 'guided',
  lessonsCompleted: [],
  lastVisited: null,
  checks: {},
  labsDone: [],
  labSteps: {},
  beforeStart: {},
  bookmarks: [],
  confidence: { start: null, end: null },
  understanding: null,
  facilitator: false
});
let memory = null;
let storageOk = true;
function load() {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    memory = raw ? { ...DEFAULTS(), ...JSON.parse(raw) } : DEFAULTS();
    if (memory.schemaVersion !== VERSION) { memory = migrate(memory); try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch (e) { storageOk = false; } }
  } catch (e) { storageOk = false; memory = DEFAULTS(); }
  return memory;
}
function migrate(old) {
  // v1.x (AgentSpec builder) is retired; keep only progress-style fields.
  const d = DEFAULTS();
  d.lessonsCompleted = Array.isArray(old.lessonsCompleted) ? old.lessonsCompleted : [];
  d.mode = old.mode === 'explore' ? 'explore' : 'guided';
  return d;
}
const listeners = new Set();
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch (e) { storageOk = false; }
  listeners.forEach(fn => { try { fn(memory); } catch (e) { console.error(e); } });
}
export const store = {
  get: () => load(),
  storageOk: () => { load(); return storageOk; },
  subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); },
  set(patch) { Object.assign(load(), patch); save(); },
  isDone: id => load().lessonsCompleted.includes(id),
  complete(id) { const s = load(); if (!s.lessonsCompleted.includes(id)) { s.lessonsCompleted.push(id); save(); } },
  uncomplete(id) { const s = load(); s.lessonsCompleted = s.lessonsCompleted.filter(x => x !== id); save(); },
  toggle(id) { store.isDone(id) ? store.uncomplete(id) : store.complete(id); },
  visit(route, title) { const s = load(); s.lastVisited = { route, title }; save(); },
  saveCheck(id, score, of) {
    const s = load(); const prev = s.checks[id];
    s.checks[id] = { score: Math.max(score, prev?.score || 0), of, attempts: (prev?.attempts || 0) + 1, last: score };
    if (!s.lessonsCompleted.includes(id)) s.lessonsCompleted.push(id);
    save();
  },
  labStep(lab, i, val) { const s = load(); s.labSteps[lab] = s.labSteps[lab] || {}; s.labSteps[lab][i] = val; save(); },
  labDone(lab, val = true) { const s = load(); s.labsDone = s.labsDone.filter(x => x !== lab); if (val) s.labsDone.push(lab); save(); },
  toggleBookmark(route, title) {
    const s = load(); const i = s.bookmarks.findIndex(b => b.route === route);
    if (i >= 0) s.bookmarks.splice(i, 1); else s.bookmarks.push({ route, title });
    save(); return i < 0;
  },
  isBookmarked: route => load().bookmarks.some(b => b.route === route),
  reset() { memory = DEFAULTS(); save(); }
};
