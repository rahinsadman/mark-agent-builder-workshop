import { ui, esc, LOGO, mountAll, resetRegistry, toast, announce, focusTrap } from './core.js';
import './components.js';
import { closeDrawer } from './components.js';
import { store } from './state.js';
import { MODULES, modById, moduleItems, allItems } from './data/curriculum.js';
import { BUILDER_FIELDS, SURFACES } from './data/fields.js';
import { GLOSSARY, glossaryByKey, PRACTICES, FAQ, TROUBLE, EXAMPLES } from './data/reference.js';
import * as P from './pages.js';

const app = document.getElementById('app');
let current = null; let timerHandle = null; let firstRender = true;

/* ---------------- Shell ---------------- */
function shell() {
  app.innerHTML = `<a class="skip-link" href="#main-content" data-skip>Skip to content</a>
  <header class="site-header"><a class="brand-link" href="#/" aria-label="Optimizely Agent Builder Workshop, home"><img src="${LOGO}" alt="Optimizely" width="88" height="30"><span class="brand-title">Agent Builder Workshop</span></a>
  <nav class="main-nav" aria-label="Main"><a class="nav-link" href="#/workshop" data-nav="workshop">Workshop</a><a class="nav-link" href="#/reference" data-nav="reference">Reference</a></nav>
  <div class="header-tools"><button class="search-btn" type="button" data-search aria-label="Search the workshop">${ui('search', 16)}<span class="label">Search the workshop</span><span class="kbd" data-kbd>Ctrl K</span></button>
  <a class="ring-wrap" href="#/workshop" aria-label="Workshop progress" data-ring><span class="ring"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" fill="none" stroke="#E4F0DA" stroke-width="4"/><circle data-ring-arc cx="18" cy="18" r="15" fill="none" stroke="#3AB533" stroke-width="4" stroke-linecap="round" stroke-dasharray="94.25" stroke-dashoffset="94.25"/></svg><span data-ring-txt>0%</span></span></a>
  <button class="fac-toggle" type="button" role="switch" aria-checked="false" data-fac><span class="lbl-txt">Facilitator</span><span class="switch" aria-hidden="true"></span><span class="sr-only">Facilitator mode</span></button>
  <button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mobile-nav" data-menu>${ui('menu', 20)}</button></div></header>
  <nav class="mobile-nav" id="mobile-nav" hidden aria-label="Mobile"><a href="#/workshop" data-nav="workshop">${ui('grid', 18)} Workshop</a><a href="#/reference" data-nav="reference">${ui('book', 18)} Reference</a><a href="#/facilitator">${ui('present', 18)} Facilitator mode</a></nav>
  <div id="fac-banner"></div>
  <div id="view"></div>
  <footer class="site-footer"><img src="${LOGO}" alt="Optimizely" style="height:24px;width:auto"><span>Mark Agent Builder Workshop · An interactive guide. You build in Mark.</span><span class="grow"></span><a href="https://docs.optimizely.com/agent-platform/docs" target="_blank" rel="noopener noreferrer">Official Mark docs<span class="sr-only"> (opens in a new tab)</span></a><a href="${P.ACADEMY}" target="_blank" rel="noopener noreferrer">Optimizely Academy<span class="sr-only"> (opens in a new tab)</span></a><a href="#/facilitator">Facilitator mode</a><span class="mono xs">Verified against Mark docs · 16 Nov 2026</span></footer>
  <button class="btn sm secondary fab" type="button" data-refcard aria-expanded="false" aria-label="Reference card">${ui('book', 16)}<span class="fab-txt">Reference card</span></button>
  <div id="live-region" class="sr-only" aria-live="polite"></div>`;
  if (/Mac|iPhone|iPad/.test(navigator.platform)) app.querySelector('[data-kbd]').textContent = '⌘ K';
}

/* ---------------- Router ---------------- */
function parse() {
  const h = location.hash.replace(/^#/, '') || '/';
  const [path, qs] = h.split('?'); return { path: path.replace(/\/+$/, '') || '/', params: new URLSearchParams(qs || '') };
}
function resolve(path, params) {
  const seg = path.split('/').filter(Boolean);
  if (!seg.length) return P.home();
  if (seg[0] === 'workshop') return P.workshop();
  if (seg[0] === 'primer') { const m = modById('primer'); return P.lessonPage(m, m.lessons[0], params); }
  if (seg[0] === 'wrap-up') return P.wrapUp();
  if (seg[0] === 'facilitator') return P.facilitatorPage();
  if (seg[0] === 'reference') {
    const r = seg[1];
    if (!r) return P.referenceHub();
    if (r === 'builder') return P.builderRef(params);
    if (r === 'practices') return P.practices();
    if (r === 'glossary') return P.glossary(params);
    if (r === 'examples') return P.examples();
    if (r === 'troubleshooting') return P.troubleshooting(null);
    if (r === 'faq') return P.troubleshooting('sec-faq');
    return P.notFound();
  }
  const mod = modById(seg[0]);
  if (mod && mod.id !== 'primer') {
    if (!seg[1]) return P.moduleLanding(mod);
    if (seg[1] === 'check' && seg.length === 2) return P.checkPage(mod);
    if (seg[1] === 'lab' && mod.lab && seg.length === 2) return P.labPage(mod);
    const l = mod.lessons.find(x => x.slug === seg[1]);
    if (l && seg.length === 2) return P.lessonPage(mod, l, params);
    // Links from before Module 4 was added (old /m4–/m6): find the lesson by its slug and fix the URL.
    const moved = seg.length === 2 && MODULES.find(m => m.id !== 'primer' && m.lessons.some(x => x.slug === seg[1]));
    if (moved) { const qs = params.toString(); history.replaceState(null, '', `#/${moved.id}/${seg[1]}${qs ? '?' + qs : ''}`); return P.lessonPage(moved, moved.lessons.find(x => x.slug === seg[1]), params); }
  }
  return P.notFound();
}
function render(keepScroll = false) {
  const { path, params } = parse();
  closeDrawer(true); closeSearch(true); hidePopover(true); closeRefcard(true); closeMobileNav();
  if (params.get('present') === '1' && !store.get().facilitator) store.set({ facilitator: true });
  resetRegistry();
  let page;
  try { page = resolve(path, params); } catch (e) { console.error(e); page = P.notFound(); }
  current = { ...page, path };
  const y = window.scrollY;
  const oldView = document.getElementById('view');
  const view = oldView.cloneNode(false); oldView.replaceWith(view); // fresh node: drops listeners from the previous page
  view.innerHTML = page.html;
  const isLesson = !!view.querySelector('.lesson-layout');
  if (!isLesson) { const wrap = view.firstElementChild; if (wrap && !wrap.id) { wrap.id = 'main-content'; wrap.setAttribute('tabindex', '-1'); wrap.setAttribute('role', 'main'); } }
  mountAll(view);
  if (page.mount) page.mount(view);
  document.title = `${page.title} · Mark Agent Builder Workshop`;
  app.querySelectorAll('[data-nav]').forEach(a => { const sec = path.startsWith('/reference') ? 'reference' : (path === '/workshop' || /^\/(primer|m\d|wrap-up)/.test(path)) ? 'workshop' : ''; a.toggleAttribute('aria-current', a.dataset.nav === sec); if (a.dataset.nav === sec) a.setAttribute('aria-current', 'page'); });
  if (page.itemId && page.itemId !== 'wrap-up') store.visit(path, page.title);
  updateRing(); applyFacilitator();
  bindLesson(view);
  if (!keepScroll) window.scrollTo(0, 0); else window.scrollTo(0, y);
  if (!firstRender && !keepScroll) { const h = view.querySelector('#page-title'); if (h) h.focus({ preventScroll: true }); announce(`${page.title} page`); }
  firstRender = false;
}
P.setRerender(keep => render(keep));

/* ---------------- Progress ring ---------------- */
function updateRing() {
  const p = P.overallProgress();
  const arc = app.querySelector('[data-ring-arc]'); if (arc) arc.setAttribute('stroke-dashoffset', String(94.25 * (1 - p.pct / 100)));
  const t = app.querySelector('[data-ring-txt]'); if (t) t.textContent = p.pct + '%';
  const r = app.querySelector('[data-ring]'); if (r) r.setAttribute('aria-label', `Workshop progress: ${p.pct}% (${p.done} of ${p.total} items). Open workshop overview`);
}

/* ---------------- Lesson bindings: complete, next, on-this-page, rail drawer ---------------- */
function bindLesson(view) {
  const layout = view.querySelector('.lesson-layout'); if (!layout) return;
  const io = new IntersectionObserver(entries => { entries.forEach(en => { if (en.isIntersecting) { view.querySelectorAll('[data-goto]').forEach(b => b.classList.toggle('active', b.dataset.goto === en.target.id.replace('sec-', ''))); } }); }, { rootMargin: '-30% 0px -60% 0px' });
  view.querySelectorAll('.block').forEach(b => io.observe(b));
}
document.addEventListener('click', e => {
  const t = e.target;
  const complete = t.closest('[data-complete]'); if (complete) { const id = complete.dataset.complete; store.toggle(id); const done = store.isDone(id); render(true); toast(done ? 'Lesson marked complete' : 'Lesson marked as not complete'); document.querySelector('[data-complete]')?.focus(); return; }
  const next = t.closest('[data-next]'); if (next) { store.complete(next.dataset.next); }
  const go = t.closest('[data-goto]'); if (go) { const el = document.getElementById('sec-' + go.dataset.goto); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); const h = el.querySelector('h2'); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } return; }
  if (t.closest('[data-skip]')) { e.preventDefault(); const m = document.getElementById('main-content'); if (m) m.focus(); return; }
  if (t.closest('[data-rail-open]')) { openRail(); return; }
  if (t.closest('[data-rail-close]')) { closeRail(); return; }
  if (t.closest('[data-bookmark]')) { const { path } = parse(); const added = store.toggleBookmark(path, current?.title || path); render(true); toast(added ? 'Bookmarked' : 'Bookmark removed'); document.querySelector('[data-bookmark]')?.focus(); return; }
  if (t.closest('[data-refcard]')) { toggleRefcard(); return; }
  if (t.closest('[data-search]')) { openSearch(); return; }
  if (t.closest('[data-fac]')) { toggleFacilitator(); return; }
  if (t.closest('[data-menu]')) { toggleMobileNav(); return; }
  const mode = t.closest('[data-mode]'); if (mode) store.set({ mode: mode.dataset.mode });
  if (t.closest('[data-slide-prev]')) { slide(-1); return; }
  if (t.closest('[data-slide-next]')) { slide(1); return; }
  const term = t.closest('.term'); if (term) { e.preventDefault(); showPopover(term, true); return; }
  if (popover && !t.closest('.popover')) hidePopover(true);
  if (refOpen && !t.closest('.refcard') && !t.closest('[data-refcard]')) closeRefcard(true);
});
function openRail() { const r = document.getElementById('rail'); if (!r) return; r.classList.add('open'); document.querySelector('.rail-backdrop')?.classList.add('open'); document.querySelector('[data-rail-open]')?.setAttribute('aria-expanded', 'true'); r.querySelector('a')?.focus(); }
function closeRail() { const r = document.getElementById('rail'); if (!r || !r.classList.contains('open')) return; r.classList.remove('open'); document.querySelector('.rail-backdrop')?.classList.remove('open'); const b = document.querySelector('[data-rail-open]'); if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); } }

/* ---------------- Mobile nav ---------------- */
function toggleMobileNav() { const n = document.getElementById('mobile-nav'); const b = app.querySelector('[data-menu]'); const open = n.hidden; n.hidden = !open; b.setAttribute('aria-expanded', String(open)); if (open) n.querySelector('a').focus(); }
function closeMobileNav() { const n = document.getElementById('mobile-nav'); if (n && !n.hidden) { n.hidden = true; app.querySelector('[data-menu]').setAttribute('aria-expanded', 'false'); } }

/* ---------------- Reference card ---------------- */
let refOpen = false;
function toggleRefcard() { refOpen ? closeRefcard() : openRefcard(); }
function openRefcard() {
  const el = document.createElement('div'); el.className = 'refcard'; el.id = 'refcard'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Reference card');
  el.innerHTML = `<div class="row" style="margin-bottom:8px"><h2 class="h4" style="flex:1" tabindex="-1">Reference card</h2><button class="icon-btn" data-ref-close aria-label="Close reference card">${ui('x', 16)}</button></div>
  <div class="lbl" style="margin-bottom:6px">Every specialized agent</div><div class="mini-flow"><span class="chip">Inputs · Variables</span>${ui('arrow', 14)}<span class="chip">Instructions · Prompt</span>${ui('arrow', 14)}<span class="chip">Tools</span>${ui('arrow', 14)}<span class="chip">Output</span></div>
  <div class="lbl" style="margin:12px 0 6px">Three facts</div><ol class="small" style="margin:0 0 10px"><li>It only does what the instructions say.</li><li>It only uses the tools you add.</li><li>It doesn't improve by itself. You improve it.</li></ol>
  <div class="lbl" style="margin-bottom:6px">Two symbols</div><p class="small" style="margin:0 0 4px"><code>[[url]]</code> an input (variable), case-sensitive</p><p class="small" style="margin:0 0 10px"><code>\`tool_name\`</code> a tool, named for clarity</p>
  <div class="lbl" style="margin-bottom:6px">The 7 Must fields</div><p class="small" style="margin:0 0 10px">Name · Id · Description · Prompt Template · Variables · Tools · Output</p>
  <div class="lbl" style="margin-bottom:6px">Every workflow agent</div><div class="mini-flow"><span class="chip">Trigger</span>${ui('arrow', 14)}<span class="chip">Agent steps</span>${ui('arrow', 14)}<span class="chip">Logic · condition, loop, code</span></div>`;
  document.body.appendChild(el); refOpen = true;
  document.querySelectorAll('[data-refcard]').forEach(b => { b.setAttribute('aria-expanded', 'true'); b.setAttribute('aria-controls', 'refcard'); });
  el.querySelector('[data-ref-close]').addEventListener('click', () => closeRefcard());
  el.querySelector('h2').focus();
}
function closeRefcard(silent) { const el = document.getElementById('refcard'); if (!el) return; el.remove(); refOpen = false; document.querySelectorAll('[data-refcard]').forEach(b => { b.setAttribute('aria-expanded', 'false'); b.removeAttribute('aria-controls'); }); if (!silent) document.querySelector('.fab')?.focus(); }

/* ---------------- Hover cards (C17) ---------------- */
let popover = null; let popTimer = null; let popPinned = false;
function showPopover(btn, pin) {
  const g = glossaryByKey(btn.dataset.term); if (!g) return;
  if (popover && popover.dataset.for === btn.dataset.term && pin) { popPinned = true; popover.querySelector('a')?.focus(); return; }
  hidePopover(true);
  const el = document.createElement('div'); el.className = 'popover'; el.id = 'popover'; el.dataset.for = btn.dataset.term; el.setAttribute('role', pin ? 'dialog' : 'tooltip'); el.setAttribute('aria-label', g.term);
  el.innerHTML = `<div class="h4">${esc(g.term)}</div><p style="margin:0 0 8px">${esc(g.plain)}</p><a href="#/reference/glossary?term=${g.key}" class="small">Open in glossary</a>`;
  document.body.appendChild(el); popover = el; popPinned = !!pin; btn.setAttribute('aria-describedby', 'popover'); popover._btn = btn;
  const r = btn.getBoundingClientRect(); const w = el.offsetWidth;
  let left = r.left + window.scrollX; left = Math.max(10, Math.min(left, window.scrollX + document.documentElement.clientWidth - w - 10));
  let top = r.bottom + window.scrollY + 8; if (r.bottom + el.offsetHeight + 12 > window.innerHeight) top = r.top + window.scrollY - el.offsetHeight - 8;
  el.style.left = left + 'px'; el.style.top = top + 'px';
  el.addEventListener('mouseenter', () => clearTimeout(popTimer)); el.addEventListener('mouseleave', () => { if (!popPinned) schedHide(); });
  if (pin) el.querySelector('a').focus();
}
function schedHide() { clearTimeout(popTimer); popTimer = setTimeout(() => hidePopover(true), 180); }
function hidePopover(silent) { clearTimeout(popTimer); if (!popover) return; const b = popover._btn; b?.removeAttribute('aria-describedby'); popover.remove(); popover = null; if (!silent && b) b.focus(); }
document.addEventListener('mouseover', e => { const t = e.target.closest?.('.term'); if (t && (!popover || popover.dataset.for !== t.dataset.term)) { clearTimeout(popTimer); popTimer = setTimeout(() => showPopover(t, false), 150); } });
document.addEventListener('mouseout', e => { const t = e.target.closest?.('.term'); if (t && !popPinned && !(e.relatedTarget && e.relatedTarget.closest?.('.popover'))) schedHide(); });
document.addEventListener('focusin', e => { const t = e.target.closest?.('.term'); if (t && !popPinned) showPopover(t, false); });
document.addEventListener('focusout', e => { const t = e.target.closest?.('.term'); if (t && !popPinned) schedHide(); });

/* ---------------- Search (C20) ---------------- */
let searchEl = null; let INDEX = null; let sel = 0; let results = [];
function strip(h) { return String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function buildIndex() {
  const I = [];
  MODULES.forEach(m => moduleItems(m).forEach(it => I.push({ g: 'Lessons', t: it.title, s: `${m.label} · ${it.type === 'lesson' ? it.lesson.summary : it.type === 'lab' ? 'Optional hands-on lab' : 'Knowledge check'}`, route: it.route, body: `${m.title} ${it.lesson?.summary || ''} ${it.lesson?.format || ''}` })));
  MODULES.filter(m => m.id !== 'primer').forEach(m => I.push({ g: 'Lessons', t: `${m.label}: ${m.title}`, s: m.goal, route: '/' + m.id, body: m.goal }));
  BUILDER_FIELDS.forEach(f => I.push({ g: 'Builder fields', t: f.label, s: strip(f.plain), route: `/reference/builder?field=${f.key}`, body: strip(f.plain + ' ' + f.first + ' ' + f.change) }));
  SURFACES.forEach(s => s.items.forEach(x => I.push({ g: 'Builder fields', t: `${x.label} (${s.label})`, s: strip(x.plain), route: `/reference/builder?surface=${s.key}&item=${x.key}`, body: strip(x.plain) })));
  GLOSSARY.forEach(g => I.push({ g: 'Glossary', t: g.term, s: g.plain, route: `/reference/glossary?term=${g.key}`, body: g.plain }));
  PRACTICES.forEach(p => I.push({ g: 'Best practices', t: p.t, s: p.why, route: p.route, body: p.why + ' ' + p.how + ' ' + p.tag }));
  FAQ.forEach(f => I.push({ g: 'FAQ and troubleshooting', t: f.q, s: f.a, route: '/reference/faq', body: f.a }));
  TROUBLE.forEach(f => I.push({ g: 'FAQ and troubleshooting', t: f.q, s: f.fix, route: '/reference/troubleshooting', body: f.a + ' ' + f.fix }));
  EXAMPLES.forEach(x => I.push({ g: 'Lessons', t: `Example: ${x.name}`, s: x.task, route: '/reference/examples', body: x.task }));
  return I.map(x => ({ ...x, tl: x.t.toLowerCase(), bl: (x.s + ' ' + x.body).toLowerCase() }));
}
function search(q) {
  INDEX = INDEX || buildIndex();
  const toks = q.toLowerCase().split(/\s+/).filter(Boolean); if (!toks.length) return [];
  const out = [];
  INDEX.forEach(x => {
    let sc = 0;
    for (const tk of toks) { const re = new RegExp('(^|[^a-z0-9])' + tk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); const inT = re.test(x.tl); const inB = re.test(x.bl); if (!inT && !inB) return; sc += (inT ? 3 : 0) + (inB ? 1 : 0); }
    if (x.tl.includes(q.toLowerCase())) sc += 4;
    out.push({ ...x, sc });
  });
  out.sort((a, b) => b.sc - a.sc);
  const groups = {}; out.forEach(r => { (groups[r.g] = groups[r.g] || []); if (groups[r.g].length < 6) groups[r.g].push(r); });
  return Object.keys(groups).sort((a, b) => groups[b][0].sc - groups[a][0].sc).flatMap(g => groups[g]);
}
function openSearch() {
  if (searchEl) return;
  const opener = document.activeElement;
  searchEl = document.createElement('div'); searchEl.className = 'modal-backdrop';
  searchEl.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="Search the workshop"><div class="modal-search">${ui('search', 20)}<label class="sr-only" for="sq">Search</label><input id="sq" type="search" placeholder="Search lessons, builder fields, terms…" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="sres" aria-autocomplete="list"><button class="icon-btn" data-sclose aria-label="Close search">${ui('x', 16)}</button></div><div class="modal-results" id="sres" role="listbox" aria-label="Results"><p class="empty small">Try "variables", "inference", "guardrails" or "share".</p></div></div>`;
  document.body.appendChild(searchEl); searchEl._opener = opener;
  const input = searchEl.querySelector('input'); input.focus();
  const draw = () => {
    const box = searchEl.querySelector('#sres'); const q = input.value.trim();
    if (!q) { box.innerHTML = '<p class="empty small">Try "variables", "inference", "guardrails" or "share".</p>'; results = []; input.removeAttribute('aria-activedescendant'); return; }
    results = search(q); sel = 0;
    if (!results.length) { box.innerHTML = `<p class="empty">No results for "${esc(q)}".</p>`; input.removeAttribute('aria-activedescendant'); return; }
    let lastG = ''; box.innerHTML = results.map((r, i) => { const head = r.g !== lastG ? `<div class="res-group lbl" role="presentation">${esc(r.g)}</div>` : ''; lastG = r.g; return `${head}<a class="res-item" id="sr-${i}" role="option" aria-selected="${i === sel}" href="#${r.route}" data-ri="${i}"><b>${esc(r.t)}</b><span class="s">${esc(r.s.slice(0, 110))}${r.s.length > 110 ? '…' : ''}</span></a>`; }).join('');
    input.setAttribute('aria-activedescendant', 'sr-0');
  };
  const move = d => { if (!results.length) return; sel = (sel + d + results.length) % results.length; searchEl.querySelectorAll('.res-item').forEach((a, i) => a.setAttribute('aria-selected', String(i === sel))); const a = searchEl.querySelector('#sr-' + sel); a?.scrollIntoView({ block: 'nearest' }); input.setAttribute('aria-activedescendant', 'sr-' + sel); };
  input.addEventListener('input', draw);
  input.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); move(1); } if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); } if (e.key === 'Enter' && results[sel]) { e.preventDefault(); const r = results[sel]; closeSearch(true); location.hash = '#' + r.route; } });
  searchEl.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); closeSearch(); } else focusTrap(searchEl, e); });
  searchEl.addEventListener('click', e => { if (e.target === searchEl || e.target.closest('[data-sclose]')) closeSearch(); if (e.target.closest('.res-item')) closeSearch(true); });
}
function closeSearch(silent) { if (!searchEl) return; const o = searchEl._opener; searchEl.remove(); searchEl = null; if (!silent && o && document.contains(o)) o.focus(); }

/* ---------------- Facilitator / presenter mode (S34) ---------------- */
function toggleFacilitator() { store.set({ facilitator: !store.get().facilitator }); applyFacilitator(); document.dispatchEvent(new CustomEvent('mabw:facilitator')); toast(store.get().facilitator ? 'Facilitator mode on' : 'Facilitator mode off'); if (current?.path === '/facilitator') render(true); }
document.addEventListener('mabw:toggle-facilitator', toggleFacilitator);
let slideIdx = 0; let slideStart = 0;
function applyFacilitator() {
  const on = !!store.get().facilitator; const view = document.getElementById('view');
  document.body.classList.toggle('facilitator', on);
  const sw = app.querySelector('[data-fac]'); sw.setAttribute('aria-checked', String(on));
  const presentable = on && current?.presentable && view.querySelector('.lesson-layout');
  document.body.classList.toggle('presenting', !!presentable);
  const banner = document.getElementById('fac-banner');
  banner.innerHTML = on && !presentable ? `<div class="fac-banner">${ui('present', 16)}<span>Facilitator mode is on. Open any lesson to present it.</span><a href="#/primer">Present the Primer</a><button class="link-btn" data-fac>Turn off</button></div>` : '';
  clearInterval(timerHandle);
  if (presentable) {
    slideIdx = 0; slideStart = Date.now(); showSlide();
    const mins = current.lessonMins || 5;
    timerHandle = setInterval(() => { const t = document.querySelector('[data-timer]'); if (!t) return clearInterval(timerHandle); const s = Math.floor((Date.now() - slideStart) / 1000); const mm = String(Math.floor(s / 60)).padStart(2, '0'); const ss = String(s % 60).padStart(2, '0'); t.innerHTML = `${ui('timer', 14)} ${mm}:${ss} / ${String(mins).padStart(2, '0')}:00${s > mins * 60 ? ' · over time' : ''}`; }, 1000);
  } else { document.querySelectorAll('.block').forEach(b => b.classList.remove('slide-on')); }
}
function showSlide() {
  const blocks = [...document.querySelectorAll('.lesson-main .block')]; if (!blocks.length) return;
  slideIdx = Math.max(0, Math.min(slideIdx, blocks.length - 1));
  blocks.forEach((b, i) => b.classList.toggle('slide-on', i === slideIdx));
  const c = document.querySelector('[data-slide-count]'); if (c) c.textContent = `SECTION ${slideIdx + 1} OF ${blocks.length} · ARROW KEYS TO ADVANCE`;
  const pv = document.querySelector('[data-slide-prev]'); const nx = document.querySelector('[data-slide-next]');
  if (pv) pv.disabled = slideIdx === 0;
  if (nx) { const last = slideIdx === blocks.length - 1; const n = document.querySelector('[data-next]'); nx.innerHTML = last ? (n ? `Next lesson ${ui('chev', 16)}` : `Done ${ui('check', 16)}`) : `Next ${ui('chev', 16)}`; nx.disabled = last && !n; }
}
function slide(d) {
  const blocks = document.querySelectorAll('.lesson-main .block');
  if (d > 0 && slideIdx === blocks.length - 1) { const n = document.querySelector('[data-next]'); if (n) { store.complete(n.dataset.next); location.hash = n.getAttribute('href'); } return; }
  slideIdx += d; showSlide(); window.scrollTo(0, 0); announce(`Section ${slideIdx + 1} of ${blocks.length}`);
}

/* ---------------- Global keys ---------------- */
document.addEventListener('keydown', e => {
  if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); searchEl ? closeSearch() : openSearch(); return; }
  if (e.key === 'Escape') {
    if (popover) { hidePopover(); return; }
    if (refOpen) { closeRefcard(); return; }
    const r = document.getElementById('rail'); if (r?.classList.contains('open')) { closeRail(); return; }
    const n = document.getElementById('mobile-nav'); if (n && !n.hidden) { closeMobileNav(); app.querySelector('[data-menu]').focus(); return; }
  }
  if (document.body.classList.contains('presenting') && !searchEl && !document.querySelector('.drawer')) {
    const tag = (e.target.tagName || '').toLowerCase(); if (['input', 'textarea', 'select'].includes(tag) || e.target.isContentEditable) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); slide(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); slide(-1); }
  }
});

/* ---------------- Boot ---------------- */
shell();
window.addEventListener('hashchange', () => render(false));
store.subscribe(() => updateRing());
render(false);
window.__mabw = { store, render, version: '1.1.0' };
