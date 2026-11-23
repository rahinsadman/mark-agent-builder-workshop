// Core helpers: icons, escaping, component registry, toast
const P = {
  search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  chevd: '<path d="M5 9l7 7 7-7"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 2"/>',
  book: '<path d="M5 5.5h6a2 2 0 012 2V19a2 2 0 00-2-2H5zM19 5.5h-6a2 2 0 00-2 2V19a2 2 0 012-2h6z"/>',
  bookmark: '<path d="M7 4.5h10v15l-5-3.5-5 3.5z"/>',
  info: '<circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8h.01"/>',
  drag: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"/>',
  lock: '<rect x="6" y="11" width="12" height="9" rx="2.5"/><path d="M8.5 11V8.5a3.5 3.5 0 017 0V11"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  copy: '<rect x="8" y="8" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A1.5 1.5 0 016.5 5H15"/>',
  link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
  user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1-3.5 4-5 7-5s6 1.5 7 5"/>',
  flag: '<path d="M6 20V5M6 5h10l-2 3.5 2 3.5H6"/>',
  bulb: '<path d="M9 17.5h6M10 20.5h4M12 3.5a5.5 5.5 0 00-3 10.1V15.5h6v-1.9a5.5 5.5 0 00-3-10.1z"/>',
  warn: '<path d="M12 4l9 15.5H3z"/><path d="M12 10v4M12 17h.01"/>',
  grid: '<rect x="4.5" y="4.5" width="6" height="6" rx="1.5"/><rect x="13.5" y="4.5" width="6" height="6" rx="1.5"/><rect x="4.5" y="13.5" width="6" height="6" rx="1.5"/><rect x="13.5" y="13.5" width="6" height="6" rx="1.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  dl: '<path d="M12 4.5v11M7 11l5 5 5-5M5 19.5h14"/>',
  menu: '<path d="M5 7h14M5 12h14M5 17h14"/>',
  timer: '<circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2.5 1.5M10 3.5h4"/>',
  restore: '<path d="M5 12a7 7 0 107-7c-2.5 0-4.4 1.2-5.6 3M5 4.5V8h3.5"/>',
  msg: '<path d="M5 6.5h14v9H10l-4 3.5v-3.5H5z"/>',
  ext: '<path d="M14 5h5v5M19 5l-8 8M17 14v4.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 015 18.5v-9A1.5 1.5 0 016.5 8H11"/>',
  people: '<circle cx="9" cy="9" r="3"/><circle cx="16.5" cy="10" r="2.5"/><path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5M14.5 15c2.6-.4 4.6.9 5.5 3.5"/>',
  present: '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M12 16v4M8 20h8"/>',
  reset: '<path d="M5 12a7 7 0 1 0 2.1-5M5 4.5V8h3.5"/>'
};
export function ui(name, size = 18, label = '') {
  const a = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="ui-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${a}>${P[name] || ''}</svg>`;
}
export const bicon = (name, size = 26) => `<img class="b-icon" src="assets-3b8ff24439/img/icons/${name}.svg" width="${size}" height="${size}" alt="" aria-hidden="true">`;
export const ill = (name, alt = '', cls = 'ill') => `<img class="${cls}" src="assets-3b8ff24439/img/ill/${name}.svg" alt="${esc(alt)}" ${alt ? '' : 'aria-hidden="true"'} loading="lazy">`;
export const LOGO = 'assets-3b8ff24439/img/optimizely-logo.svg';

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
export const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Component registry: pages call comp(type, config); after render mountAll(root)
const REG = new Map();
let seq = 0;
export function comp(type, config = {}, cls = '') {
  const id = 'c' + (++seq);
  REG.set(id, { type, config });
  return `<div class="comp comp-${type} ${cls}" data-cid="${id}"></div>`;
}
const MOUNTERS = {};
export function defineComponent(type, fn) { MOUNTERS[type] = fn; }
export function mountAll(root) {
  root.querySelectorAll('[data-cid]').forEach(el => {
    if (el.dataset.mounted) return;
    const entry = REG.get(el.dataset.cid);
    if (!entry) return;
    const fn = MOUNTERS[entry.type];
    if (!fn) { console.error('Unknown component', entry.type); return; }
    el.dataset.mounted = '1';
    fn(el, entry.config);
  });
}
export function resetRegistry() { REG.clear(); }

let toastTimer;
export function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}
export function announce(msg) {
  const r = document.getElementById('live-region');
  if (r) { r.textContent = ''; setTimeout(() => { r.textContent = msg; }, 30); }
}
export function focusTrap(container, e) {
  if (e.key !== 'Tab') return;
  const f = [...container.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
export function shuffleSeeded(arr, seed = 7) {
  const a = arr.slice(); let s = seed;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Callout / block helpers used by lesson content
export const callout = (type, html, icon) => {
  const ic = icon || { tip: 'bulb', mistakes: 'warn', thinking: 'msg', info: 'info', accuracy: 'info' }[type] || 'info';
  return `<div class="callout ${type}">${ui(ic, 18)}<div>${html}</div></div>`;
};
export const tip = html => callout('tip', `<b>FDE tip:</b> ${html}`);
export const mistakes = items => callout('mistakes', `<b>Common mistakes</b><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`);
export const thinking = (thought, answer) => callout('thinking', `<b>You might be thinking: "${thought}"</b><br>${answer}`);
export const misconception = (belief, truth) => callout('mistakes', `<b>Misconception:</b> "${belief}" ${truth}`, 'info');
export const accuracy = html => callout('accuracy', `<b>Accuracy note:</b> ${html}`);
export const think = (text, limit) => `<details class="think"><summary><span class="chev">${ui('chev', 16)}</span>Think of it like… <span class="xs muted" style="font-weight:400">(optional)</span></summary><div class="details-body"><p>${text}</p>${limit ? `<p><b>Where this comparison stops working:</b> ${limit}</p>` : ''}</div></details>`;
export const tech = html => `<details class="tech"><summary><span class="chev">${ui('chev', 16)}</span>Technical detail</summary><div class="details-body">${html}</div></details>`;
export const example = html => `<div class="card"><div class="row" style="margin-bottom:8px"><span class="chip">${ui('flag', 14)} In the example</span></div>${html}</div>`;
export const term = (key, text) => `<button type="button" class="term" data-term="${key}">${text}</button>`;
export const docLink = (href, text) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text} ${ui('ext', 14)}<span class="sr-only"> (opens in a new tab)</span></a>`;
