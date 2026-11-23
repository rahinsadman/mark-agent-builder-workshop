import { ui, esc, defineComponent, toast, announce, focusTrap, shuffleSeeded, think, docLink } from './core.js';
import { store } from './state.js';
import { BUILDER_FIELDS, SURFACES, TIER_LABEL } from './data/fields.js';

// Re-render helper that keeps keyboard focus on the element with the same data-k
function renderKeep(root, html) {
  const k = document.activeElement && root.contains(document.activeElement) ? document.activeElement.getAttribute('data-k') : null;
  root.innerHTML = html;
  if (k) { const el = root.querySelector(`[data-k="${CSS.escape(k)}"]`); if (el) el.focus({ preventScroll: true }); }
}
const on = (root, fn) => root.addEventListener('click', e => { const t = e.target.closest('[data-act]'); if (t && root.contains(t) && !t.disabled) fn(t.dataset.act, t, e); });
const facilitator = () => document.body.classList.contains('facilitator');

/* ---------------- Drawer (C03) ---------------- */
let drawerState = null;
export function openDrawer({ label, render, onClose }) {
  closeDrawer(true);
  const opener = document.activeElement;
  const back = document.createElement('div'); back.className = 'drawer-backdrop';
  const d = document.createElement('div'); d.className = 'drawer'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'drawer-title');
  document.body.append(back, d);
  const keyHandler = e => { if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); } else focusTrap(d, e); };
  document.addEventListener('keydown', keyHandler);
  back.addEventListener('click', () => closeDrawer());
  drawerState = { d, back, opener, keyHandler, onClose };
  const update = () => { d.innerHTML = render(); const c = d.querySelector('[data-close]'); if (c) c.addEventListener('click', () => closeDrawer()); };
  update();
  d.addEventListener('click', e => { const t = e.target.closest('[data-dact]'); if (t && drawerState?.onAction) drawerState.onAction(t.dataset.dact, t); });
  const t = d.querySelector('#drawer-title'); if (t) { t.setAttribute('tabindex', '-1'); t.focus(); }
  return { update: () => { update(); const tt = d.querySelector('#drawer-title'); if (tt) { tt.setAttribute('tabindex', '-1'); tt.focus(); } }, el: d, setAction: fn => { drawerState.onAction = fn; } };
}
export function closeDrawer(silent) {
  if (!drawerState) return;
  const { d, back, opener, keyHandler, onClose } = drawerState;
  document.removeEventListener('keydown', keyHandler);
  d.remove(); back.remove(); drawerState = null;
  if (onClose) onClose();
  if (!silent && opener && document.contains(opener)) opener.focus();
}
function surfaceDrawerBody(item, idx, total, surfaceLabel) {
  return `<div class="drawer-head"><span class="mk">${idx + 1}</span><span class="lbl">${esc(surfaceLabel)} · ${idx + 1} of ${total}</span><button class="icon-btn" style="margin-left:auto" data-close aria-label="Close">${ui('x', 18)}</button></div>
  <div class="drawer-body"><h2 class="h2" id="drawer-title">${esc(item.label)}</h2><p style="margin:0">${item.plain}</p>
  <div class="green"><div class="lbl">For a first agent</div><p style="margin:6px 0 0">${item.first}</p></div>
  <div class="callout tip">${ui('bulb', 18)}<div><b>FDE tip:</b> ${item.tip}</div></div></div>
  <div class="drawer-foot"><button class="btn sm secondary" data-dact="prev" ${idx === 0 ? 'disabled' : ''}>${ui('left', 16)} Previous</button><button class="btn sm" style="margin-left:auto" data-dact="next" ${idx === total - 1 ? 'disabled' : ''}>Next ${ui('chev', 16)}</button></div>`;
}
function openSurfaceDrawer(surfaceKey, startIdx, root) {
  const s = SURFACES.find(x => x.key === surfaceKey); let i = startIdx;
  const mark = () => root.querySelectorAll('[data-hs]').forEach(h => h.classList.toggle('focus', +h.dataset.hs === i));
  const dr = openDrawer({ render: () => surfaceDrawerBody(s.items[i], i, s.items.length, s.label), onClose: () => root.querySelectorAll('[data-hs]').forEach(h => h.classList.remove('focus')) });
  mark();
  dr.setAction(a => { if (a === 'prev' && i > 0) i--; if (a === 'next' && i < s.items.length - 1) i++; dr.update(); mark(); });
}

/* ---------------- C01 Diagram ---------------- */
defineComponent('diagram', (root, cfg) => {
  let sel = 2; const wi = {};
  const draw = () => {
    const n = cfg.nodes[sel];
    renderKeep(root, `<div class="diagram-flow" role="tablist" aria-label="The four parts of an agent">${cfg.nodes.map((x, i) => `${i ? `<div class="diagram-arrow" aria-hidden="true">${ui('arrow', 20)}</div>` : ''}<button class="diagram-node" role="tab" id="dn-${root.dataset.cid}-${i}" aria-selected="${i === sel}" aria-controls="dp-${root.dataset.cid}" tabindex="${i === sel ? 0 : -1}" data-act="node" data-i="${i}" data-k="node-${i}"><span class="lbl">${esc(x.kicker)}</span><b>${esc(x.label)}</b></button>`).join('')}</div>
    <div class="diagram-panel card" role="tabpanel" id="dp-${root.dataset.cid}" aria-labelledby="dn-${root.dataset.cid}-${sel}">
      <div class="row"><span class="h3">${esc(n.label)}</span><span class="chip">In Mark: ${esc(n.where)}</span></div>
      <p style="margin:10px 0">${n.plain}</p>
      <div class="soft" style="padding:12px"><button class="row link-btn" style="text-decoration:none;gap:10px;font-weight:700" data-act="whatif" data-k="whatif" aria-expanded="${!!wi[sel]}" aria-controls="wi-${root.dataset.cid}"><span class="switch ${wi[sel] ? 'on' : ''}" aria-hidden="true"></span>${esc(n.whatIf.q)}</button>
      <div id="wi-${root.dataset.cid}" ${wi[sel] ? '' : 'hidden'}><p style="margin:8px 0 0">${n.whatIf.a}</p></div></div>
      <p class="small" style="margin:10px 0 0"><span class="chip">${ui('flag', 14)} Example</span> ${esc(n.example)}</p></div>`);
  };
  on(root, (a, t) => { if (a === 'node') { sel = +t.dataset.i; draw(); } if (a === 'whatif') { wi[sel] = !wi[sel]; draw(); } });
  root.addEventListener('keydown', e => {
    if (!e.target.classList.contains('diagram-node')) return;
    const k = e.key; let ni = sel;
    if (k === 'ArrowRight' || k === 'ArrowDown') ni = (sel + 1) % cfg.nodes.length; else if (k === 'ArrowLeft' || k === 'ArrowUp') ni = (sel - 1 + cfg.nodes.length) % cfg.nodes.length; else if (k === 'Home') ni = 0; else if (k === 'End') ni = cfg.nodes.length - 1; else return;
    e.preventDefault(); sel = ni; draw(); root.querySelector(`[data-k="node-${ni}"]`).focus();
  });
  draw();
});

/* ---------------- C14 Quiz ---------------- */
defineComponent('quiz', (root, cfg) => {
  const Q = cfg.questions; let idx = 0; let ans = Array(Q.length).fill(null); let done = false; let reveal = false;
  const score = () => ans.reduce((s, a, i) => s + (a != null && Q[i].options[a].ok ? 1 : 0), 0);
  const draw = () => {
    if (done) {
      const sc = score(); const best = store.get().checks[cfg.id];
      renderKeep(root, `<div class="card"><div class="lbl">Results</div><p class="q-text" tabindex="-1" data-k="res">${sc} of ${Q.length} correct${sc === Q.length ? ' · well done' : ''}</p>
      <ul style="list-style:none;padding:0">${Q.map((q, i) => { const ok = Q[i].options[ans[i]]?.ok; return `<li class="row" style="padding:6px 0;border-bottom:1px solid var(--n3)"><span class="chip ${ok ? 'g' : 'b'}">${ok ? ui('check', 14) + ' Correct' : 'Not quite'}</span><span style="flex:1">${esc(q.q)}</span>${!ok && q.review ? `<a href="#${q.review}" class="small">Review lesson</a>` : ''}</li>`; }).join('')}</ul>
      ${best ? `<p class="small">Best score saved: ${best.score} of ${best.of}. Only your best score is kept.</p>` : ''}
      <div class="row"><button class="btn sm secondary" data-act="retry" data-k="retry">${ui('reset', 16)} Retry</button>${cfg.next ? `<a class="btn sm" href="#${cfg.next.route}">${esc(cfg.next.label)} ${ui('chev', 16)}</a>` : ''}</div></div>`);
      return;
    }
    const q = Q[idx]; const a = ans[idx]; const show = a != null && (!facilitator() || reveal);
    renderKeep(root, `<div class="${cfg.inline ? 'soft' : ''}" style="${cfg.inline ? '' : ''}">
      <div class="row" style="justify-content:space-between"><span class="lbl">Question ${idx + 1} of ${Q.length}</span>
      <div class="q-dots" aria-hidden="true">${Q.map((_, i) => `<span class="q-dot ${ans[i] != null && (!facilitator() || reveal || i !== idx) ? (Q[i].options[ans[i]].ok ? 'ok' : 'no') : ''} ${i === idx ? 'cur' : ''}"></span>`).join('')}</div></div>
      <p class="q-text" id="qt-${root.dataset.cid}">${esc(q.q)}</p>
      ${facilitator() ? `<button class="row link-btn" style="text-decoration:none;margin-bottom:10px" role="switch" aria-checked="${reveal}" data-act="reveal" data-k="reveal"><span class="switch" aria-hidden="true"></span> Reveal answers to the room</button>` : ''}
      <div class="q-opts" role="radiogroup" aria-labelledby="qt-${root.dataset.cid}">${q.options.map((o, i) => { const cls = show ? (o.ok ? 'ok' : (a === i ? 'no' : '')) : ''; return `<button class="q-opt ${cls}" role="radio" aria-checked="${a === i}" data-act="pick" data-i="${i}" data-k="opt-${i}" tabindex="${(a === i || (a == null && i === 0)) ? 0 : -1}" ${a != null && !facilitator() ? 'aria-disabled="true"' : ''}><span class="radio" aria-hidden="true"></span><span>${esc(o.t)}</span>${show && o.ok ? `<span class="verdict chip">${ui('check', 14)} Correct</span>` : ''}${show && a === i && !o.ok ? '<span class="verdict chip">Not quite</span>' : ''}</button>`; }).join('')}</div>
      <div class="q-explain" aria-live="polite">${show ? `<div class="${q.options[a].ok ? 'green' : 'blue'}" style="padding:14px"><div class="h4">${q.options[a].ok ? 'Correct' : 'Not quite'}. Why</div><p style="margin:6px 0 0">${q.options[a].why}</p>${!q.options[a].ok ? `<p class="small" style="margin:6px 0 0"><b>The answer:</b> ${esc(q.options.find(o => o.ok).t)}. ${q.options.find(o => o.ok).why}</p>` : ''}${!q.options[a].ok && q.review ? `<p class="small" style="margin:6px 0 0"><a href="#${q.review}">Review the lesson</a></p>` : ''}</div>` : (a != null ? '<p class="small">Answer recorded. Turn on "Reveal answers to the room" to show it.</p>' : '')}</div>
      <div class="row" style="margin-top:12px"><button class="btn sm secondary" data-act="back" data-k="back" ${idx === 0 ? 'disabled' : ''}>Back</button><button class="btn sm" data-act="next" data-k="next" ${a == null ? 'disabled' : ''}>${idx === Q.length - 1 ? 'See results' : 'Next question'} ${ui('chev', 16)}</button></div></div>`);
  };
  on(root, (act, t) => {
    if (act === 'pick') { if (ans[idx] != null && !facilitator()) return; ans[idx] = +t.dataset.i; draw(); const o = Q[idx].options[ans[idx]]; if (!facilitator()) announce(o.ok ? 'Correct' : 'Not quite'); }
    if (act === 'reveal') { reveal = !reveal; draw(); }
    if (act === 'next') { if (idx < Q.length - 1) { idx++; reveal = false; draw(); root.querySelector('.q-opt')?.focus(); } else { done = true; store.saveCheck(cfg.id, score(), Q.length); draw(); root.querySelector('[data-k="res"]')?.focus(); } }
    if (act === 'back' && idx > 0) { idx--; draw(); }
    if (act === 'retry') { idx = 0; ans = Array(Q.length).fill(null); done = false; reveal = false; draw(); root.querySelector('.q-opt')?.focus(); }
  });
  root.addEventListener('keydown', e => {
    if (!e.target.classList.contains('q-opt')) return;
    const opts = [...root.querySelectorAll('.q-opt')]; const i = opts.indexOf(e.target);
    if (['ArrowDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); opts[(i + 1) % opts.length].focus(); }
    if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); opts[(i - 1 + opts.length) % opts.length].focus(); }
  });
  document.addEventListener('mabw:facilitator', () => { if (document.contains(root)) draw(); });
  draw();
});

/* ---------------- C06 Sorter ---------------- */
defineComponent('sorter', (root, cfg) => {
  const items = shuffleSeeded(cfg.items.map((x, i) => ({ ...x, i })), cfg.items.length * 3 + 1);
  let placed = {}; let sel = null; let last = null;
  const draw = () => {
    const pool = items.filter(x => placed[x.i] == null);
    const correct = items.filter(x => placed[x.i] === x.b).length;
    const cols = Math.min(cfg.buckets.length, 4);
    renderKeep(root, `<div class="comp-head"><span class="h4">${esc(cfg.instructions || 'Select an item, then choose where it belongs.')}</span><span class="counter" aria-live="polite">${Object.keys(placed).length} of ${items.length} sorted · ${correct} correct</span><button class="btn sm secondary" data-act="reset" data-k="reset">${ui('reset', 16)} Reset</button></div>
    <div class="sort-buckets" style="--cols:${cols}">${cfg.buckets.map(b => `<div class="bucket" data-bucket="${b.key}"><div class="bucket-title">${esc(b.title)}</div><div class="bucket-sub">${esc(b.sub || '')}</div><div class="stack" style="gap:6px">${items.filter(x => placed[x.i] === b.key).map(x => { const ok = x.b === b.key; return `<div class="sort-item placed"><span>${esc(x.t)}</span><span class="res chip ${ok ? 'g' : 'b'}">${ok ? ui('check', 14) + ' Correct' : 'Not quite'}</span>${ok ? '' : `<button class="icon-btn" style="width:30px;height:30px" data-act="undo" data-i="${x.i}" data-k="undo-${x.i}" aria-label="Move '${esc(x.t)}' back to try again">${ui('reset', 14)}</button>`}</div>`; }).join('')}</div>
    <button class="btn sm secondary bucket-btn" data-act="place" data-b="${b.key}" data-k="place-${b.key}" ${sel == null ? 'disabled' : ''}>${sel == null ? 'Select an item first' : `Place here`}<span class="sr-only"> in ${esc(b.title)}</span></button></div>`).join('')}</div>
    <div class="feedback" aria-live="polite">${last ? `<div class="callout ${last.ok ? 'tip' : 'thinking'}">${ui(last.ok ? 'check' : 'info', 18)}<div><b>${last.ok ? 'Correct' : 'Not quite'}: "${esc(last.t)}".</b> ${esc(last.why)}</div></div>` : ''}${pool.length === 0 && correct === items.length ? `<div class="callout tip" style="margin-top:8px">${ui('check', 18)}<div><b>All sorted correctly.</b> Nice work.</div></div>` : ''}</div>
    ${pool.length ? `<div class="sort-items" role="group" aria-label="Items to sort"><span class="lbl">To sort</span>${pool.map(x => `<button class="sort-item" draggable="true" aria-pressed="${sel === x.i}" data-act="sel" data-i="${x.i}" data-k="item-${x.i}">${ui('drag', 14)}<span>${esc(x.t)}</span></button>`).join('')}</div>` : ''}`);
  };
  const place = (i, b) => { const x = items.find(y => y.i === i); placed[i] = b; sel = null; last = { ok: x.b === b, t: x.t, why: x.why }; draw(); const next = root.querySelector('.sort-items .sort-item'); (next || root.querySelector('[data-k="reset"]')).focus(); };
  on(root, (a, t) => {
    if (a === 'sel') { const i = +t.dataset.i; sel = sel === i ? null : i; draw(); }
    if (a === 'place' && sel != null) place(sel, t.dataset.b);
    if (a === 'undo') { delete placed[+t.dataset.i]; last = null; draw(); root.querySelector(`[data-k="item-${t.dataset.i}"]`)?.focus(); }
    if (a === 'reset') { placed = {}; sel = null; last = null; draw(); }
  });
  root.addEventListener('dragstart', e => { const t = e.target.closest('.sort-item[data-i]'); if (!t) return; e.dataTransfer.setData('text/plain', t.dataset.i); e.dataTransfer.effectAllowed = 'move'; });
  root.addEventListener('dragover', e => { const b = e.target.closest('.bucket'); if (b) { e.preventDefault(); b.classList.add('drop-ok'); } });
  root.addEventListener('dragleave', e => { const b = e.target.closest('.bucket'); if (b && !b.contains(e.relatedTarget)) b.classList.remove('drop-ok'); });
  root.addEventListener('drop', e => { const b = e.target.closest('.bucket'); if (!b) return; e.preventDefault(); const i = parseInt(e.dataTransfer.getData('text/plain'), 10); if (!Number.isNaN(i) && placed[i] == null) place(i, b.dataset.bucket); });
  draw();
});

/* ---------------- C05 Compare ---------------- */
defineComponent('compare', (root, cfg) => {
  let p = 0; let precise = true;
  const draw = () => {
    const pair = cfg.pairs[p]; const v = precise ? pair.precise : pair.vague;
    renderKeep(root, `<div class="comp-head">${cfg.pairs.length > 1 ? `<div class="seg" role="tablist" aria-label="Choose what to compare">${cfg.pairs.map((x, i) => `<button role="tab" aria-selected="${i === p}" data-act="pair" data-i="${i}" data-k="pair-${i}">${esc(x.label)}</button>`).join('')}</div>` : ''}<span style="flex:1"></span>
    <div class="seg" role="radiogroup" aria-label="Version"><button role="radio" aria-checked="${!precise}" data-act="mode" data-v="0" data-k="vague">Vague</button><button role="radio" aria-checked="${precise}" data-act="mode" data-v="1" data-k="precise">Precise</button></div></div>
    <div class="grid2" aria-live="polite"><div class="${precise ? 'green' : 'soft3'}"><div class="lbl">${esc(pair.label)} description · ${precise ? 'precise' : 'vague'}</div><p style="margin:8px 0 12px;font-size:17px">${esc(v.text)}</p><div class="lbl">${precise ? 'Why it works' : 'Why it\'s a problem'}</div><p style="margin:6px 0 0">${esc(v.why)}</p></div>
    <div class="card"><div class="lbl">What you tend to get</div><p style="margin:8px 0 0">${esc(v.sample)}</p></div></div>`);
  };
  on(root, (a, t) => { if (a === 'pair') { p = +t.dataset.i; draw(); } if (a === 'mode') { precise = t.dataset.v === '1'; draw(); } });
  draw();
});

/* ---------------- C08 Annotated ---------------- */
defineComponent('annotated', (root, cfg) => {
  root.innerHTML = `<div class="anno"><div class="card anno-body"><div class="lbl" style="margin-bottom:8px">${esc(cfg.title)}</div>${cfg.body}</div><div class="soft anno-note" aria-live="polite"><div class="lbl">Why it's written this way</div><p style="margin:8px 0 0">Click a marker to see the explanation.</p></div></div>`;
  const note = root.querySelector('.anno-note');
  root.querySelectorAll('.pin').forEach(p => { p.setAttribute('aria-expanded', 'false'); p.setAttribute('aria-label', `Explanation ${p.dataset.pin}`); });
  root.addEventListener('click', e => {
    const p = e.target.closest('.pin'); if (!p) return;
    root.querySelectorAll('.pin').forEach(x => x.setAttribute('aria-expanded', String(x === p)));
    note.innerHTML = `<div class="lbl">Marker ${esc(p.dataset.pin)}</div><p style="margin:8px 0 0">${cfg.notes[p.dataset.pin]}</p>`;
  });
});

/* ---------------- Flags (spot vague rules) ---------------- */
defineComponent('flags', (root, cfg) => {
  const f = {};
  const draw = () => {
    const vagueTotal = cfg.items.filter(x => x.vague).length; const found = cfg.items.filter((x, i) => x.vague && f[i]).length;
    renderKeep(root, `<div class="comp-head"><span class="counter" aria-live="polite">${found} of ${vagueTotal} vague rules found</span></div><div class="row">${cfg.items.map((x, i) => `<button class="chip ${f[i] ? (x.vague ? 'g' : 'b') : ''}" aria-pressed="${!!f[i]}" data-act="t" data-i="${i}" data-k="f-${i}">${esc(x.t)}${f[i] ? (x.vague ? ' · vague' : ' · checkable') : ''}</button>`).join('')}</div>
    <div class="stack" style="margin-top:12px" aria-live="polite">${cfg.items.map((x, i) => f[i] ? `<div class="callout ${x.vague ? 'tip' : 'thinking'}">${ui(x.vague ? 'check' : 'info', 18)}<div><b>${esc(x.t)}:</b> ${x.vague ? '' : 'not quite, this one is fine. '}${esc(x.note)}</div></div>` : '').join('')}${found === vagueTotal ? `<div class="callout tip">${ui('check', 18)}<div><b>All vague rules found.</b> These rewrites become checkable evaluation criteria later.</div></div>` : ''}</div>`);
  };
  on(root, (a, t) => { const i = +t.dataset.i; f[i] = !f[i]; draw(); });
  draw();
});

/* ---------------- C19 Decision helper ---------------- */
defineComponent('decision', (root, cfg) => {
  let step = 0; let result = null; const trail = [];
  const draw = () => {
    if (result) { const r = cfg.results[result]; renderKeep(root, `<div class="green"><div class="lbl">Recommendation</div><p class="h3" style="margin:6px 0" tabindex="-1" data-k="res">${esc(r.title)}</p><p style="margin:0 0 10px">${esc(r.text)}</p><p class="small" style="margin:0 0 10px">Your answers: ${trail.map(esc).join(' → ')}</p><button class="btn sm secondary" data-act="restart" data-k="restart" style="background:var(--n1)">${ui('reset', 16)} Start over</button></div>`); return; }
    const q = cfg.questions[step];
    renderKeep(root, `<div class="soft"><div class="lbl">Question ${step + 1}</div><p class="h4" style="margin:6px 0 10px" id="dq-${root.dataset.cid}">${esc(q.q)}</p><div class="row" role="group" aria-labelledby="dq-${root.dataset.cid}">${q.opts.map((o, i) => `<button class="btn sm secondary" data-act="opt" data-i="${i}" data-k="d-${step}-${i}">${esc(o.t)}</button>`).join('')}</div></div>`);
  };
  on(root, (a, t) => {
    if (a === 'opt') { const o = cfg.questions[step].opts[+t.dataset.i]; trail.push(`${cfg.questions[step].q.replace(/\?$/, '')}: ${o.t}`); if (o.result) result = o.result; else step = o.next; draw(); (root.querySelector('[data-k="res"]') || root.querySelector('button'))?.focus(); }
    if (a === 'restart') { step = 0; result = null; trail.length = 0; draw(); root.querySelector('button')?.focus(); }
  });
  draw();
});

/* ---------------- Tabs ---------------- */
defineComponent('tabs', (root, cfg) => {
  let s = 0; const id = root.dataset.cid;
  const draw = () => renderKeep(root, `<div class="tabs"><div role="tablist" aria-label="Options">${cfg.tabs.map((t, i) => `<button role="tab" id="t-${id}-${i}" aria-selected="${i === s}" aria-controls="p-${id}" tabindex="${i === s ? 0 : -1}" data-act="tab" data-i="${i}" data-k="tab-${i}">${esc(t.label)}</button>`).join('')}</div><div class="card" role="tabpanel" id="p-${id}" aria-labelledby="t-${id}-${s}">${cfg.tabs[s].html}</div></div>`);
  on(root, (a, t) => { s = +t.dataset.i; draw(); });
  root.addEventListener('keydown', e => { if (e.target.getAttribute('role') !== 'tab') return; let n = s; if (e.key === 'ArrowRight') n = (s + 1) % cfg.tabs.length; else if (e.key === 'ArrowLeft') n = (s - 1 + cfg.tabs.length) % cfg.tabs.length; else return; e.preventDefault(); s = n; draw(); root.querySelector(`[data-k="tab-${n}"]`).focus(); });
  draw();
});

/* ---------------- Choice (decision tree) ---------------- */
defineComponent('choice', (root, cfg) => {
  let s = null;
  const draw = () => { const o = s != null ? cfg.options[s] : null; renderKeep(root, `<div class="row" role="group" aria-label="My agent needs to…">${cfg.options.map((x, i) => `<button class="chip ${s === i ? 'g' : ''}" aria-pressed="${s === i}" data-act="c" data-i="${i}" data-k="c-${i}">${esc(x.t)}</button>`).join('')}</div><div aria-live="polite" style="margin-top:12px">${o ? `<div class="${o.tone === 'b' ? 'blue' : o.tone === 'g' ? 'green' : 'soft'}"><div class="lbl">You need</div><p class="h3" style="margin:6px 0">${esc(o.title)}</p><p style="margin:0">${esc(o.text)}</p></div>` : '<p class="small">Choose an option to see what your agent needs.</p>'}</div>`); };
  on(root, (a, t) => { s = +t.dataset.i; draw(); });
  draw();
});

/* ---------------- C02/C03/C04 Builder replica ---------------- */
defineComponent('replica', (root, cfg) => {
  let tiers = !!cfg.tiers; let tour = false;
  const F = BUILDER_FIELDS;
  const box = t => `<div class="mock-input" aria-hidden="true">${t}</div>`;
  const vis = {
    1: box('Meta Description Writer'), 2: `<div class="mock-input" aria-hidden="true" style="display:flex;justify-content:space-between">@meta_description_writer <span class="chip g" style="font-size:11px;padding:0 6px">Available</span></div>`,
    3: box('Writes 3 search-friendly meta descriptions for a product page…'), 4: `<div class="mock-row" aria-hidden="true"><span class="switch"></span> Off</div>`, 5: `<div class="mock-row" aria-hidden="true"><span class="switch on"></span> On</div>`,
    6: `<div class="mock-input mock-area" aria-hidden="true">C: You are a senior SEO copywriter…<br>A: 1. Use \`browse_web_html\` to read [[url]]…</div>`, 7: `<div class="small" aria-hidden="true">Appears only when multi-turn is on</div>`,
    8: `<div class="mock-row" aria-hidden="true"><span class="chip">url · String · Required</span><span class="chip">target_keyword · String</span></div>`, 9: `<div class="mock-row" aria-hidden="true"><span class="chip">browse_web_html</span><span class="chip">+ Add tool</span></div>`,
    10: `<div class="mock-row" aria-hidden="true"><span class="cb"></span></div>`, 11: `<div class="small" aria-hidden="true">☐ Match prompt · ☐ Match tools · or type / in the prompt</div>`, 12: `<div class="mock-row" aria-hidden="true"><span class="cb"></span></div>`,
    13: `<div class="mock-row" aria-hidden="true"><span class="switch"></span> <span class="mono xs">/workspace</span></div>`, 14: box('Default'), 15: box('Standard'), 16: `<div class="mock-row" aria-hidden="true"><span class="chip">+ Add File</span></div>`, 17: box('Text'), 18: box('20 · Minutes')
  };
  const tierCls = { must: 't-must', rec: 't-rec', leave: 't-leave' };
  const field = n => { const f = F[n - 1]; return `<button class="rf ${tierCls[f.tier]} ${n === 7 ? 'rf-dashed' : ''}" data-act="open" data-n="${n}" data-hs="${n}" data-k="rf-${n}" aria-label="Field ${n}: ${esc(f.label)}${tiers ? ', ' + TIER_LABEL[f.tier] : ''}. Open explanation"><span class="rf-head"><span class="mk">${n}</span><span>${esc(f.label)}</span><span class="tag ${f.tier === 'rec' ? 'rec' : f.tier}">${TIER_LABEL[f.tier].toUpperCase()}</span></span>${vis[n]}</button>`; };
  const draw = () => {
    renderKeep(root, `<div class="comp-head"><button class="btn sm" data-act="tour" data-k="tour">${ui('play', 16)} Guided tour</button><button class="btn sm secondary" role="switch" aria-checked="${tiers}" data-act="tiers" data-k="tiers"><span class="switch" aria-hidden="true"></span> First-agent view</button>${tiers ? `<div class="tier-legend"><span class="tag must">MUST · 7</span><span class="tag rec">RECOMMENDED · 2</span><span class="tag leave">LEAVE FOR NOW · 9</span></div>` : ''}<span style="flex:1"></span><a class="btn sm secondary" href="#/reference/builder">${ui('book', 16)} Field encyclopedia</a></div>
    <div class="replica ${tiers ? 'tiers' : ''}"><div class="replica-bar"><span class="lbl">Replica of Mark · Agents → Your Agents → Add Agent → Specialized Agent</span><span style="flex:1"></span><span class="chip" aria-hidden="true">Test Run</span><span class="chip g" aria-hidden="true">Save</span></div>
    <div class="replica-cols"><div>${[1, 2, 3, 4, 5, 6, 7].map(field).join('')}</div><div>${[8, 9, 10, 11, 12, 13].map(field).join('')}<div class="grid2" style="gap:6px">${field(14)}${field(15)}</div>${field(16)}<div class="grid2" style="gap:6px">${field(17)}${field(18)}</div></div></div>
    ${tiers ? `<div class="reassure">${ui('check', 16)} 7 + 2 is all a first agent needs. Keep the defaults until testing says otherwise.</div>` : ''}</div>
    <p class="small" style="margin-top:8px">This is a teaching replica: fields can't be typed into. Labels match Mark exactly.</p>`);
  };
  const openField = (n) => {
    let i = n - 1;
    const mark = () => root.querySelectorAll('.rf').forEach(el => el.classList.toggle('focus', +el.dataset.n === i + 1));
    const body = () => { const f = F[i]; return `<div class="drawer-head"><span class="mk">${f.n}</span><span class="lbl">${tour ? 'Guided tour · ' : ''}Field ${f.n} of ${F.length}</span><span class="tag ${f.tier}">${TIER_LABEL[f.tier].toUpperCase()}</span><button class="icon-btn" style="margin-left:auto" data-close aria-label="Close">${ui('x', 18)}</button></div>
      <div class="drawer-body"><h2 class="h2" id="drawer-title">${esc(f.label)}</h2><p style="margin:0">${f.plain}</p>
      <div class="green"><div class="lbl">For a first agent</div><p style="margin:6px 0 0">${f.first}</p></div>
      <div><div class="lbl">When to change it</div><p style="margin:6px 0 0">${f.change}</p></div>
      <div class="soft" style="padding:12px"><div class="lbl">In the example</div><p style="margin:6px 0 0">${esc(f.example)}</p></div>
      <div class="callout tip">${ui('bulb', 18)}<div><b>FDE tip:</b> ${f.tip}</div></div>
      <div class="callout mistakes">${ui('warn', 18)}<div><b>Common mistakes</b><ul>${f.mistakes.map(m => `<li>${m}</li>`).join('')}</ul></div></div>
      ${f.comparison ? think(f.comparison.text, f.comparison.limit) : ''}
      ${f.tech ? `<details class="tech"><summary><span class="chev">${ui('chev', 16)}</span>Technical detail</summary><div class="details-body">${f.tech}</div></details>` : ''}
      <p class="small" style="margin:0">${docLink(f.docs, 'Official docs')}</p></div>
      <div class="drawer-foot"><button class="btn sm secondary" data-dact="prev" ${i === 0 ? 'disabled' : ''}>${ui('left', 16)} ${i > 0 ? esc(F[i - 1].n + ' ' + shortL(F[i - 1].label)) : 'Previous'}</button><button class="btn sm" style="margin-left:auto" data-dact="next" ${i === F.length - 1 ? 'disabled' : ''}>${i < F.length - 1 ? esc(F[i + 1].n + ' ' + shortL(F[i + 1].label)) : 'Next'} ${ui('chev', 16)}</button></div>`; };
    const dr = openDrawer({ render: body, onClose: () => { tour = false; root.querySelectorAll('.rf').forEach(el => el.classList.remove('focus')); } });
    mark();
    dr.setAction(a => { if (a === 'prev' && i > 0) i--; if (a === 'next' && i < F.length - 1) i++; dr.update(); mark(); root.querySelector(`[data-n="${i + 1}"]`)?.scrollIntoView({ block: 'nearest' }); });
  };
  const shortL = l => l.length > 18 ? l.slice(0, 16) + '…' : l;
  on(root, (a, t) => { if (a === 'tiers') { tiers = !tiers; draw(); announce(tiers ? 'First-agent view on' : 'First-agent view off'); } if (a === 'open') openField(+t.dataset.n); if (a === 'tour') { tour = true; openField(1); } });
  draw();
  if (cfg.field) { const f = F.find(x => x.key === cfg.field); if (f) setTimeout(() => openField(f.n), 50); }
});

/* ---------------- CLEAR bands ---------------- */
defineComponent('clear', (root, cfg) => {
  let s = 3;
  const hlv = t => esc(t).replace(/\[\[([a-z_]+)\]\]/g, '<span class="hl">[[$1]]</span>').replace(/\n/g, '<br>');
  const draw = () => renderKeep(root, `<div class="anno"><div>${cfg.bands.map((b, i) => `<button class="band" aria-pressed="${i === s}" data-act="b" data-i="${i}" data-k="b-${i}"><span class="L" style="background:${i % 2 ? 'var(--lb)' : 'var(--lf)'}">${b.L}</span><span class="txt"><b>${esc(b.name)}</b>${hlv(b.body)}</span></button>`).join('')}</div><div class="soft" aria-live="polite" style="align-self:start"><div class="lbl">${esc(cfg.bands[s].L)} · selected</div><p class="h4" style="margin:6px 0">${esc(cfg.bands[s].name)}</p><p style="margin:0">${esc(cfg.bands[s].why)}</p></div></div>`);
  on(root, (a, t) => { s = +t.dataset.i; draw(); });
  draw();
});

/* ---------------- Order exercise ---------------- */
defineComponent('order', (root, cfg) => {
  const pool0 = shuffleSeeded(cfg.items.map((x, i) => ({ ...x, i })), 11);
  let slots = Array(cfg.slots.length).fill(null); let checked = false;
  const draw = () => {
    const used = new Set(slots.filter(x => x != null)); const pool = pool0.filter(x => !used.has(x.i));
    const allOk = checked && slots.every((x, si) => x != null && cfg.items[x].pos === si);
    renderKeep(root, `<div class="comp-head"><span class="h4">Click a fragment to place it in the next empty slot. Click a placed fragment to remove it.</span><button class="btn sm secondary" data-act="reset" data-k="reset">${ui('reset', 16)} Reset</button></div>
    <div class="grid2"><div class="order-slots" role="list" aria-label="CLEAR order">${cfg.slots.map((s, si) => { const x = slots[si]; const st = checked && x != null ? (cfg.items[x].pos === si ? 'ok' : 'bad') : ''; return `<div role="listitem" class="order-slot ${x != null ? 'filled' : ''} ${st}"><span class="tag">${esc(s)}</span>${x != null ? `<button class="link-btn" style="text-decoration:none;flex:1" data-act="unplace" data-s="${si}" data-k="slot-${si}" aria-label="Remove: ${esc(cfg.items[x].t)}">${esc(cfg.items[x].t)}</button>${st ? `<span class="chip">${st === 'ok' ? ui('check', 14) + ' Right' : 'Move it'}</span>` : ''}` : '<span class="small muted">Empty</span>'}</div>`; }).join('')}</div>
    <div class="stack" style="gap:6px" role="group" aria-label="Fragments to place">${pool.map(x => `<button class="sort-item" data-act="place" data-i="${x.i}" data-k="o-${x.i}">${ui('plus', 14)}<span>${esc(x.t)}</span></button>`).join('') || '<p class="small">All fragments placed.</p>'}</div></div>
    <div class="row" style="margin-top:10px"><button class="btn sm" data-act="check" data-k="check" ${slots.some(x => x == null) ? 'disabled' : ''}>Check order</button><span aria-live="polite">${checked ? (allOk ? `<span class="chip g">${ui('check', 14)} All in CLEAR order</span>` : '<span class="chip b">Not quite: fix the ones marked "Move it"</span>') : ''}</span></div>`);
  };
  on(root, (a, t) => {
    if (a === 'place') { const e = slots.indexOf(null); if (e >= 0) slots[e] = +t.dataset.i; checked = false; draw(); (root.querySelector('[data-act="place"]') || root.querySelector('[data-k="check"]'))?.focus(); }
    if (a === 'unplace') { slots[+t.dataset.s] = null; checked = false; draw(); }
    if (a === 'check') { checked = true; draw(); }
    if (a === 'reset') { slots = Array(cfg.slots.length).fill(null); checked = false; draw(); }
  });
  draw();
});

/* ---------------- C07 Spot the problem ---------------- */
defineComponent('spot', (root, cfg) => {
  let p = 0; let st = cfg.prompts.map(() => ({ hit: {}, misses: 0, all: false, fixed: false }));
  const draw = () => {
    const pr = cfg.prompts[p]; const s = st[p]; const total = pr.lines.filter(l => l.p).length; const found = pr.lines.filter((l, i) => l.p && (s.hit[i] || s.all)).length;
    renderKeep(root, `<div class="comp-head"><div class="seg" role="tablist" aria-label="Sample prompts">${cfg.prompts.map((x, i) => `<button role="tab" aria-selected="${i === p}" data-act="p" data-i="${i}" data-k="p-${i}">Prompt ${i + 1}</button>`).join('')}</div><span style="flex:1"></span><span class="chip ${found === total ? 'g' : ''}" aria-live="polite">${found} of ${total} found</span><button class="btn sm secondary" data-act="all" data-k="all" ${s.misses < 2 && found < total ? 'disabled title="Unlocks after 2 tries"' : ''}>Show all</button></div>
    <p class="h4" style="margin:0 0 4px">${esc(pr.name)}</p><p class="small mono" style="margin:0 0 10px">${esc(pr.vars)}</p>
    <div class="spot-lines">${pr.lines.map((l, i) => { const shown = s.hit[i] || (s.all && l.p); const cls = shown ? (l.p ? 'found' : 'miss') : ''; return `<button class="spot-line ${cls}" data-act="l" data-i="${i}" data-k="l-${i}" aria-pressed="${!!s.hit[i]}"><span class="ln">${i + 1}</span><code>${esc(l.t)}</code>${shown ? `<span class="spot-why">${l.p ? '<b>Found:</b> ' + esc(l.p) : 'This line is fine.'}</span>` : ''}</button>`; }).join('')}</div>
    ${s.misses < 2 && found < total ? `<p class="small" style="margin-top:8px">"Show all" unlocks after 2 tries on lines that are fine.</p>` : ''}
    <div class="row" style="margin-top:12px"><button class="btn sm secondary" data-act="fixed" data-k="fixed" aria-expanded="${s.fixed}">${s.fixed ? 'Hide' : 'See'} the fixed version</button></div>
    ${s.fixed ? `<div class="grid2" style="margin-top:10px"><div><div class="lbl" style="margin-bottom:6px">Original</div><div class="codebox">${esc(pr.lines.map(l => l.t).join('\n'))}</div></div><div><div class="lbl" style="margin-bottom:6px">Fixed, in CLEAR</div><div class="codebox" style="background:var(--n2)">${esc(pr.fixed)}</div></div></div>` : ''}`);
  };
  on(root, (a, t) => {
    const s = st[p];
    if (a === 'p') { p = +t.dataset.i; draw(); }
    if (a === 'l') { const i = +t.dataset.i; if (s.hit[i]) return; s.hit[i] = true; if (!cfg.prompts[p].lines[i].p) s.misses++; draw(); announce(cfg.prompts[p].lines[i].p ? 'Problem found' : 'This line is fine'); }
    if (a === 'all') { s.all = true; draw(); }
    if (a === 'fixed') { s.fixed = !s.fixed; draw(); }
  });
  draw();
});

/* ---------------- C09 Slider ---------------- */
defineComponent('slider', (root, cfg) => {
  let v = cfg.start || 0; const id = root.dataset.cid;
  const meter = n => `<span class="meter" aria-hidden="true">${[0, 1, 2, 3, 4].map(i => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
  const draw = () => {
    const s = cfg.stops[v];
    root.innerHTML = `<div class="card"><label class="lbl" for="rg-${id}">Inference level</label><div class="range-wrap"><input type="range" id="rg-${id}" min="0" max="${cfg.stops.length - 1}" step="1" value="${v}" aria-valuetext="${esc(s.name)}"></div>
    <div class="stops">${cfg.stops.map((x, i) => `<span class="${i === v ? 'on' : ''}">${esc(x.name)}</span>`).join('')}</div>
    <div class="row" style="justify-content:center;margin:10px 0">${s.rec ? '<span class="chip g">Start here for most first agents</span>' : `<span class="chip">${esc(s.name)}</span>`}</div>
    <div class="grid4" aria-live="polite"><div class="soft" style="padding:12px"><div class="lbl">Best for</div><p style="margin:4px 0 0">${esc(s.best)}</p></div><div class="soft" style="padding:12px"><div class="lbl">Example</div><p style="margin:4px 0 0">${esc(s.example)}</p></div><div class="soft" style="padding:12px"><div class="lbl">Speed</div><div style="margin-top:6px">${meter(s.speed)}</div><span class="sr-only">${s.speed} of 5</span></div><div class="soft" style="padding:12px"><div class="lbl">Credits</div><div style="margin-top:6px">${meter(s.credits)}</div><span class="sr-only">${s.credits} of 5</span></div></div></div>`;
    const r = root.querySelector('input'); r.addEventListener('input', () => { v = +r.value; draw(); root.querySelector('input').focus(); });
  };
  draw();
});

/* ---------------- Test Run replica ---------------- */
defineComponent('testrun', (root) => {
  const hs = (i, label, inner) => `<button class="rf" data-act="hs" data-hs="${i}" data-k="hs-${i}" aria-label="${i + 1}: ${esc(label)}. Open explanation"><span class="rf-head"><span class="mk">${i + 1}</span>${esc(label)}</span>${inner}</button>`;
  root.innerHTML = `<div class="replica"><div class="replica-bar"><span class="lbl">Replica of Mark · Agent → Test Run</span></div>
  <div class="replica-cols tr-cols"><div>
  ${hs(0, 'Variables', '<div aria-hidden="true"><div class="small">url *</div><div class="mock-input">https://www.example.com/product</div><div class="small" style="margin-top:6px">target_keyword</div><div class="mock-input">campaign planning</div></div>')}
  ${hs(1, 'Run as private execution', '<div class="mock-row" aria-hidden="true"><span class="switch"></span> Off</div>')}
  ${hs(2, 'Run / Stop Execution', '<div class="mock-row" aria-hidden="true"><span class="chip">Clear All</span><span class="chip g">Run</span></div>')}</div><div>
  ${hs(3, 'Status and Execution ID', '<div class="mock-row" aria-hidden="true"><span class="chip g">Completed</span><span class="mono xs">Execution ID 7f3c…a91</span></div>')}
  ${hs(4, 'Output', '<div aria-hidden="true" class="table-wrap"><table class="t" style="font-size:13px"><tr><th>Option</th><th>Meta description</th><th>Chars</th></tr><tr><td>1</td><td>Plan, test and launch campaigns faster…</td><td>142</td></tr><tr><td>2</td><td>One workspace to plan every campaign…</td><td>139</td></tr></table></div>')}
  ${hs(5, 'Execution Memory', '<div class="small" aria-hidden="true">① First message: prompt + variables · ② Tool call browse_web_html ✓ · ③ Last message</div>')}</div></div></div>`;
  on(root, (a, t) => { if (a === 'hs') openSurfaceDrawer('test-run', +t.dataset.hs, root); });
});

/* ---------------- C13 Flip cards ---------------- */
defineComponent('flip', (root, cfg) => {
  const f = {};
  const draw = () => renderKeep(root, `<div class="flip-grid">${cfg.cards.map((c, i) => `<button class="flip" aria-pressed="${!!f[i]}" data-act="f" data-i="${i}" data-k="fl-${i}" aria-label="Case ${c.n}: ${esc(c.t)}. ${f[i] ? 'Showing sample result. Press to flip back.' : 'Press to see a sample result.'}">${f[i] ? `<span class="lbl">Case ${c.n} · sample result</span><span class="codebox" style="font-size:12px">${esc(c.out)}</span><span class="chip ${c.ok ? '' : 'b'}" style="background:${c.ok ? 'var(--n1)' : ''}">${c.ok ? ui('check', 14) : ''} ${esc(c.verdict)}</span><span class="hint">${ui('restore', 14)} Flip back</span>` : `<span class="lbl">Case ${c.n}</span><span class="t">${esc(c.t)}</span><span><b>Try:</b> ${esc(c.tryit)}</span><span><b>Checks:</b> ${esc(c.checks)}</span><span class="hint">${ui('restore', 14)} Flip for a sample result</span>`}</button>`).join('')}</div>`);
  on(root, (a, t) => { const i = +t.dataset.i; f[i] = !f[i]; draw(); });
  draw();
});

/* ---------------- C12 Diagnose ---------------- */
defineComponent('diagnose', (root, cfg) => {
  let s = 0; const picks = {};
  const draw = () => {
    const sc = cfg.scenarios[s]; const pk = picks[s];
    renderKeep(root, `<div class="comp-head"><span class="h4">Scenario ${s + 1} of ${cfg.scenarios.length}: ${esc(sc.title)}</span><div class="q-dots" aria-hidden="true">${cfg.scenarios.map((x, i) => `<span class="q-dot ${picks[i] != null ? (x.options[picks[i]].ok ? 'ok' : 'no') : ''} ${i === s ? 'cur' : ''}"></span>`).join('')}</div></div>
    <div class="grid2"><div class="card"><div class="lbl">Sample output · Meta Description Writer</div><p style="margin:8px 0">${sc.output}</p><p class="small" style="margin:0"><b>Context:</b> ${esc(sc.context)}</p></div>
    <div><p class="h4" style="margin:0 0 8px" id="dg-${root.dataset.cid}">What's the most likely cause?</p><div class="q-opts" role="radiogroup" aria-labelledby="dg-${root.dataset.cid}">${sc.options.map((o, i) => `<button class="q-opt ${pk != null ? (o.ok ? 'ok' : pk === i ? 'no' : '') : ''}" role="radio" aria-checked="${pk === i}" data-act="pick" data-i="${i}" data-k="dp-${i}" style="font-size:15px"><span class="radio" aria-hidden="true"></span><span>${esc(o.t)}</span></button>`).join('')}</div></div></div>
    <div aria-live="polite" style="margin-top:12px">${pk != null ? (sc.options[pk].ok ? `<div class="green"><div class="h4">Correct. Here's the fix</div><p style="margin:6px 0 0"><b>Change:</b> ${esc(sc.fix)}</p><p style="margin:6px 0 0"><b>Then check:</b> ${esc(sc.check)}</p></div>` : `<div class="blue"><div class="h4">Not quite</div><p style="margin:6px 0 0">${esc(sc.options[pk].why)} Try another answer.</p></div>`) : ''}</div>
    <div class="row" style="margin-top:12px"><button class="btn sm secondary" data-act="prev" data-k="prev" ${s === 0 ? 'disabled' : ''}>${ui('left', 16)} Previous scenario</button><button class="btn sm" data-act="next" data-k="next" ${s === cfg.scenarios.length - 1 ? 'disabled' : ''}>Next scenario ${ui('chev', 16)}</button></div>`);
  };
  on(root, (a, t) => { if (a === 'pick') { picks[s] = +t.dataset.i; draw(); } if (a === 'prev' && s > 0) { s--; draw(); } if (a === 'next' && s < cfg.scenarios.length - 1) { s++; draw(); } });
  draw();
});

/* ---------------- C10 Versions ---------------- */
defineComponent('versions', (root, cfg) => {
  let live = cfg.versions.length - 1; let sel = live; let msg = '';
  const draw = () => renderKeep(root, `<div class="card"><div class="vt" role="group" aria-label="Version history">${cfg.versions.map((v, i) => `<button aria-pressed="${i === sel}" class="${i === live ? 'live' : ''}" data-act="sel" data-i="${i}" data-k="v-${i}" aria-label="${v.v}: ${esc(v.d)}, ${v.t}${i === live ? ', current version' : ''}"><span class="dot">${v.v}</span><b>${esc(v.d)}</b><br><span class="mono xs">${v.t}</span>${i === live ? '<br><span class="chip g" style="font-size:11px;margin-top:4px">Current</span>' : ''}</button>`).join('')}</div>
  <div class="row" style="justify-content:center;margin-top:12px"><span class="chip">${cfg.versions[sel].v} selected</span><button class="btn sm" data-act="restore" data-k="restore" ${sel === live ? 'disabled' : ''}>${ui('restore', 16)} Restore this version</button><button class="btn sm secondary" data-act="current" data-k="current" ${sel === live ? 'disabled' : ''}>Back to current</button><button class="btn sm secondary" data-act="dup" data-k="dup">Duplicate as new agent</button></div>
  <p class="small" aria-live="polite" style="text-align:center;margin:10px 0 0">${msg}</p></div>`);
  on(root, (a, t) => {
    if (a === 'sel') { sel = +t.dataset.i; msg = ''; draw(); }
    if (a === 'restore') { live = sel; msg = `Restored ${cfg.versions[sel].v}. It's now the current version. Remember to re-upload any attached files. (Simulated)`; draw(); }
    if (a === 'current') { sel = live; msg = ''; draw(); }
    if (a === 'dup') { msg = `Duplicated ${cfg.versions[sel].v} as a new agent to experiment on. (Simulated)`; draw(); }
  });
  draw();
});

/* ---------------- Quality tab replica ---------------- */
defineComponent('quality', (root) => {
  let tab = 0; const id = root.dataset.cid;
  const hs = (i, label, inner) => `<button class="rf" data-act="hs" data-hs="${i}" data-k="qh-${i}" aria-label="${i + 1}: ${esc(label)}. Open explanation"><span class="rf-head"><span class="mk">${i + 1}</span>${esc(label)}</span>${inner}</button>`;
  const panels = [
    () => `<div class="grid2"><div>${hs(0, 'Evaluation criteria · 3 of 10', '<div class="stack" style="gap:4px" aria-hidden="true"><div class="mock-input">Each meta description is 155 characters or fewer.</div><div class="mock-input">No description contains superlatives…</div><div class="mock-input">The output includes the four required columns.</div></div>')}</div><div>${hs(1, 'Output examples · 2 of 5', '<div class="stack" style="gap:4px" aria-hidden="true"><div class="mock-input">Example: SaaS pricing page</div><div class="mock-input">Example: product feature page</div></div>')}${hs(2, 'Passing score', '<div class="mock-row" aria-hidden="true">75% <span style="flex:1;height:3px;background:var(--fir);min-width:80px"></span> 95% <span class="chip g">80%</span></div>')}</div></div>`,
    () => `${hs(3, 'Execution Guardrails', '<div class="mock-row" aria-hidden="true"><span class="chip">Mode: Watching (34 runs)</span><span class="chip">Sensitivity 1 · Lenient</span><span class="chip">Auto-stop: On</span></div>')}<p class="small">See lesson 5.3 for how the modes work.</p>`,
    () => `${hs(4, 'Execution Advisor', '<div class="small" aria-hidden="true">Recovers anomalies · retries failed tool calls · reviews sensitive tool calls</div>')}<p class="small">Nothing to set up for a first agent.</p>`
  ];
  const names = ['Output Evaluation', 'Execution Guardrails', 'Execution Advisor'];
  const draw = () => renderKeep(root, `<div class="replica"><div class="replica-bar"><span class="lbl">Replica of Mark · Agent → Quality</span></div><div style="padding:12px 14px" class="tabs"><div role="tablist" aria-label="Quality tab sections">${names.map((n, i) => `<button role="tab" id="qt-${id}-${i}" aria-selected="${i === tab}" aria-controls="qp-${id}" tabindex="${i === tab ? 0 : -1}" data-act="tab" data-i="${i}" data-k="qt-${i}">${n}</button>`).join('')}</div><div role="tabpanel" id="qp-${id}" aria-labelledby="qt-${id}-${tab}">${panels[tab]()}</div></div></div>`);
  on(root, (a, t) => { if (a === 'tab') { tab = +t.dataset.i; draw(); } if (a === 'hs') openSurfaceDrawer('quality', +t.dataset.hs, root); });
  root.addEventListener('keydown', e => { if (e.target.getAttribute('role') !== 'tab') return; let n = tab; if (e.key === 'ArrowRight') n = (tab + 1) % 3; else if (e.key === 'ArrowLeft') n = (tab + 2) % 3; else return; e.preventDefault(); tab = n; draw(); root.querySelector(`[data-k="qt-${n}"]`).focus(); });
  draw();
});

/* ---------------- Guardrails timeline ---------------- */
defineComponent('guardrails', (root) => {
  let runs = 34; const id = root.dataset.cid;
  const mode = () => runs <= 20 ? 0 : runs <= 50 ? 1 : 2;
  const M = [['Learning mode', 'Mark records what normal runs look like. It doesn\'t block any runs.'], ['Watching mode', 'Mark flags unusual runs as warnings for you to review. It doesn\'t block any runs yet.'], ['Enforcing mode', 'Mark stops runs that look clearly unsafe compared with the baseline (if auto-stop is on) and alerts you.']];
  const draw = () => {
    const m = mode();
    root.innerHTML = `<div class="card"><div class="gr-bands" aria-hidden="true"><div class="l ${m === 0 ? 'cur' : ''}">Learning · runs 1–20</div><div class="w ${m === 1 ? 'cur' : ''}">Watching · runs 21–50</div><div class="e ${m === 2 ? 'cur' : ''}">Enforcing · 50+</div></div>
    <label class="lbl" for="gr-${id}" style="display:block;margin-top:14px">Successful runs: <span class="mono">${runs}</span></label><div class="range-wrap"><input id="gr-${id}" type="range" min="0" max="60" value="${runs}" aria-valuetext="${runs} successful runs, ${M[m][0]}"></div>
    <div class="${m === 2 ? 'blue' : m === 1 ? 'green' : 'soft'}" aria-live="polite" style="margin-top:6px"><b>${M[m][0]}</b><p style="margin:4px 0 0">${M[m][1]}</p></div></div>`;
    const r = root.querySelector('input'); r.addEventListener('input', () => { runs = +r.value; draw(); root.querySelector('input').focus(); });
  };
  draw();
});

/* ---------------- C11 Share simulator ---------------- */
defineComponent('share', (root) => {
  const PEOPLE = ['Alex P.', 'Sam R.', 'Jordan K.', 'Priya M.'];
  let invited = []; let general = 'invited'; let orgAccess = 'view'; let pick = PEOPLE[0]; let pickAccess = 'view';
  const AL = { view: 'Can view', edit: 'Can edit', manage: 'Can manage' };
  const badge = () => general === 'org' ? 'Organization' : invited.length ? 'Shared' : 'Private';
  const desc = () => general === 'org' ? `Anyone in your organization can find and run this agent (${AL[orgAccess]}).` : invited.length ? `You and ${invited.length} invited ${invited.length === 1 ? 'person' : 'people'} can find and run this agent.` : 'Only you can find and run this agent.';
  const draw = () => {
    const avail = PEOPLE.filter(p => !invited.some(x => x.name === p));
    if (!avail.includes(pick)) pick = avail[0];
    renderKeep(root, `<div class="sim"><div class="card"><div class="lbl">Simulator · replica of Mark's Share dialog</div><h3 class="h3" style="margin:6px 0 12px">Share "Meta Description Writer"</h3>
    <div class="h4" style="margin-bottom:6px">Share with</div>
    ${avail.length ? `<div class="row"><label class="sr-only" for="sp-${root.dataset.cid}">Colleague</label><select class="sel" id="sp-${root.dataset.cid}" data-k="pick">${avail.map(p => `<option ${p === pick ? 'selected' : ''}>${p}</option>`).join('')}</select><label class="sr-only" for="sa-${root.dataset.cid}">Access</label><select class="sel" id="sa-${root.dataset.cid}" data-k="pacc"><option value="view" ${pickAccess === 'view' ? 'selected' : ''}>Can view</option><option value="edit" ${pickAccess === 'edit' ? 'selected' : ''}>Can edit</option><option value="manage" ${pickAccess === 'manage' ? 'selected' : ''}>Can manage</option></select><button class="btn sm" data-act="send" data-k="send">Send</button></div>` : '<p class="small">Everyone in this sample has been invited.</p>'}
    <div class="h4" style="margin:14px 0 4px">Who has access</div>
    <div class="person">${ui('user', 16)}<span class="grow">You</span><b>Owner</b></div>
    ${invited.map((p, i) => `<div class="person">${ui('user', 16)}<span class="grow">${p.name}</span><label class="sr-only" for="pa-${root.dataset.cid}-${i}">Access for ${p.name}</label><select class="sel" id="pa-${root.dataset.cid}-${i}" data-k="pa-${i}" data-i="${i}">${Object.entries(AL).map(([k, v]) => `<option value="${k}" ${p.access === k ? 'selected' : ''}>${v}</option>`).join('')}</select><button class="link-btn small" data-act="remove" data-i="${i}" data-k="rm-${i}">Remove<span class="sr-only"> ${p.name}</span></button></div>`).join('')}
    <fieldset style="border:0;padding:0;margin:14px 0 0"><legend class="h4" style="margin-bottom:4px">General access</legend>
    <label class="radio-row"><input type="radio" name="ga-${root.dataset.cid}" value="invited" ${general === 'invited' ? 'checked' : ''} data-k="ga-i"> Only invited users</label>
    <label class="radio-row"><input type="radio" name="ga-${root.dataset.cid}" value="org" ${general === 'org' ? 'checked' : ''} data-k="ga-o"> Anyone in your organization</label>
    ${general === 'org' ? `<div class="row" style="margin-left:26px"><label for="oa-${root.dataset.cid}" class="small">Default access</label><select class="sel" id="oa-${root.dataset.cid}" data-k="oacc"><option value="view" ${orgAccess === 'view' ? 'selected' : ''}>Can view</option><option value="edit" ${orgAccess === 'edit' ? 'selected' : ''}>Can edit</option></select></div>` : ''}</fieldset>
    <div class="row" style="margin-top:14px;justify-content:space-between"><button class="btn sm secondary" data-act="copy" data-k="copy">${ui('link', 16)} Copy link</button><button class="btn sm secondary" data-act="save" data-k="save">Save</button></div></div>
    <div class="stack"><div class="green" aria-live="polite"><div class="lbl">Result</div><div class="badge-flow" style="margin-top:8px">${['Private', 'Shared', 'Organization'].map((b, i) => `${i ? ui('arrow', 16) : ''}<span class="chip ${b === badge() ? 'cur' : ''}">${b}${b === badge() ? ' · current' : ''}</span>`).join('')}</div><p style="margin:10px 0 0">${desc()}</p></div>
    <div class="card"><div class="h4" style="margin-bottom:8px">Who can do what</div><div class="table-wrap"><table class="t"><thead><tr><th></th><th>Run</th><th>Edit</th><th>Share</th><th>Remove</th></tr></thead><tbody><tr><td>Can view</td><td>✓</td><td>–</td><td>–</td><td>–</td></tr><tr><td>Can edit</td><td>✓</td><td>✓</td><td>✓</td><td>–</td></tr><tr><td>Can manage</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr><tr><td>Owner</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr></tbody></table></div><p class="small" style="margin:8px 0 0">Only the owner can grant Can manage. Each agent has one owner.</p></div></div></div>`);
  };
  on(root, (a, t) => {
    if (a === 'send' && pick) { invited.push({ name: pick, access: pickAccess }); toast(`Access granted to ${pick} (simulated)`); draw(); }
    if (a === 'remove') { const n = invited[+t.dataset.i].name; invited.splice(+t.dataset.i, 1); toast(`Removed ${n} (simulated)`); draw(); }
    if (a === 'copy') toast('Link copied (simulated). It respects the agent\'s access settings.');
    if (a === 'save') toast('Saved (simulated)');
  });
  root.addEventListener('change', e => {
    const k = e.target.dataset.k || '';
    if (k === 'pick') pick = e.target.value;
    else if (k === 'pacc') pickAccess = e.target.value;
    else if (k.startsWith('pa-')) invited[+e.target.dataset.i].access = e.target.value;
    else if (k === 'oacc') orgAccess = e.target.value;
    else if (e.target.name?.startsWith('ga-')) general = e.target.value;
    draw();
  });
  draw();
});

/* ---------------- Stepper ---------------- */
defineComponent('stepper', (root, cfg) => {
  const open = {};
  const draw = () => renderKeep(root, `<ol class="stack" style="list-style:none;padding:0;gap:8px">${cfg.steps.map((s, i) => `<li class="acc ${open[i] ? 'open' : ''}" style="margin:0"><button class="acc-btn" aria-expanded="${!!open[i]}" aria-controls="st-${root.dataset.cid}-${i}" data-act="t" data-i="${i}" data-k="st-${i}"><span class="mk">${String.fromCharCode(97 + i)}</span><span style="flex:1">${esc(s.t)}<span class="small" style="display:block;font-weight:400">${esc(s.d)}</span></span>${ui(open[i] ? 'chevd' : 'chev', 18)}</button><div class="acc-panel" id="st-${root.dataset.cid}-${i}" ${open[i] ? '' : 'hidden'}>${esc(s.more)}</div></li>`).join('')}</ol>`);
  on(root, (a, t) => { const i = +t.dataset.i; open[i] = !open[i]; draw(); });
  draw();
});
