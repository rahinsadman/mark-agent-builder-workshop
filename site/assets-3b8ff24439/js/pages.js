import { ui, bicon, ill, esc, comp, tip, callout, think, docLink, LOGO, toast, announce } from './core.js';
import { store } from './state.js';
import { MODULES, PATH_ORDER, modById, moduleItems, allItems, requiredItems, CHECKS, UNDERSTANDING_CHECK, lessonRoute } from './data/curriculum.js';
import { BUILDER_FIELDS, SURFACES, TIER_LABEL } from './data/fields.js';
import { GLOSSARY, PRACTICES, FAQ, TROUBLE, EXAMPLES } from './data/reference.js';
import { LESSONS_A } from './data/lessons-a.js';
import { LESSONS_B } from './data/lessons-b.js';
import { LESSONS_C, LABS } from './data/lessons-c.js';
const LESSONS = { ...LESSONS_A, ...LESSONS_B, ...LESSONS_C };
const DOCS = 'https://docs.optimizely.com/agent-platform/docs/';
export const ACADEMY = 'https://academy.optimizely.com/student/collection/2591332-optimizely-agent-platform';

/* ---------- progress helpers ---------- */
export function overallProgress() {
  const req = requiredItems(); const done = req.filter(i => store.isDone(i.id)).length;
  return { done, total: req.length, pct: Math.round(done / req.length * 100) };
}
export function moduleProgress(mod) {
  const items = moduleItems(mod).filter(i => !i.optional); const done = items.filter(i => store.isDone(i.id)).length;
  return { done, total: items.length, pct: items.length ? Math.round(done / items.length * 100) : 0 };
}
function neighbors(itemId) {
  const all = allItems(); const i = all.findIndex(x => x.id === itemId);
  return { prev: i > 0 ? all[i - 1] : null, next: i >= 0 && i < all.length - 1 ? all[i + 1] : null };
}

/* ---------- Home (S01) ---------- */
export function home() {
  const s = store.get(); const op = overallProgress();
  const cards = PATH_ORDER.map(id => { const m = modById(id); const mp = moduleProgress(m); return `<a class="mod-card ${mp.pct === 100 ? 'done' : ''}" href="#${id === 'primer' ? '/primer' : '/' + id}"><div class="top">${bicon(m.icon, 28)}<span class="mono xs">${m.mins} min</span></div><span class="lbl">${esc(m.label)}</span><span class="t">${esc(m.title)}</span><div class="prog" role="progressbar" aria-label="${esc(m.title)} progress" aria-valuenow="${mp.pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${Math.max(mp.pct, 3)}%"></i></div>${mp.pct === 100 ? `<span class="chip g" style="align-self:flex-start">${ui('check', 14)} Done</span>` : ''}</a>`; }).join('');
  const lessonsCount = allItems().filter(i => i.type === 'lesson').length;
  const cont = s.lastVisited && op.done < op.total ? `<div class="banner">${ui('restore', 20)}<span class="grow"><b>Welcome back.</b> You were on ${esc(s.lastVisited.title)}.</span><a class="btn sm" href="#${s.lastVisited.route}">Continue ${ui('chev', 16)}</a></div>` : '';
  const done = op.done === op.total;
  return { title: 'Home', html: `<div class="page">
    <section class="hero" aria-labelledby="page-title"><div><p class="lbl">Self-paced workshop · about 2.5 hours · no setup needed</p><h1 class="h1" id="page-title" tabindex="-1" style="margin-top:10px">${done ? 'Revisit any lesson, any time' : 'Learn to build Mark agents, one clear step at a time'}</h1>
    <p class="lead">The same workshop our FDEs run with customer teams, now interactive. Click around, practice on examples, then build in Mark when you're ready.</p>
    <div class="hero-actions"><a class="btn secondary" href="#/workshop" data-mode="guided">Start the workshop ${ui('arrow', 18)}</a><a class="btn secondary" style="background:var(--lf)" href="#/reference" data-mode="explore">Explore on my own</a></div></div>${ill('guide', 'An open guide book')}</section>
    ${cont}
    <div class="section-title"><h2 class="h3">The workshop</h2><span class="lbl">${PATH_ORDER.length} parts · ${lessonsCount} lessons</span></div>
    <nav aria-label="Workshop modules"><div class="module-cards">${cards}</div></nav>
    <div class="outcomes">${['plan a one-task agent', 'recognize every builder setting', 'test and fix it with confidence', 'share it safely with your team'].map(t => `<div class="soft" style="padding:14px"><div class="h4">${ui('check', 16)} You'll be able to</div><p class="small" style="margin:4px 0 0">${t}</p></div>`).join('')}</div>
    <div class="grid2" style="margin-top:24px"><div class="card"><div class="h4">What this site is</div><p class="small" style="margin:6px 0 0">An interactive guide to building specialized agents in Mark. It teaches; you build in your own Mark instance. It isn't connected to Mark and never stores your agent.</p></div><div class="card"><div class="h4">Running a workshop?</div><p class="small" style="margin:6px 0 10px">Facilitator mode turns every lesson into a presenter view with notes, a timer and hidden quiz answers.</p><a class="btn sm secondary" href="#/facilitator">${ui('present', 16)} How Facilitator mode works</a></div></div>
  </div>` };
}

/* ---------- Workshop overview (S02) ---------- */
export function workshop() {
  const s = store.get();
  const rows = PATH_ORDER.map(id => { const m = modById(id); const mp = moduleProgress(m); return `<li><a href="#${id === 'primer' ? '/primer' : '/' + id}"><span class="chip ${mp.pct === 100 ? 'g' : 'n3'}" style="width:66px;justify-content:center">${m.id === 'primer' ? 'Primer' : m.label.replace('Module ', '')}</span><span class="t">${esc(m.title)}</span><span class="f">${esc(m.lessons.map(l => l.format.split(' · ')[0].split(':')[0]).slice(0, 3).join(' · '))}</span><span class="m">${m.mins} min</span></a></li>`; }).join('') + `<li><a href="#/wrap-up"><span class="chip n3" style="width:66px;justify-content:center">W</span><span class="t">Wrap-up and what's next</span><span class="f">Recap · Completion</span><span class="m">5 min</span></a></li>`;
  const bs = s.beforeStart || {};
  const chk = (k, t) => `<label class="row" style="gap:10px;flex-wrap:nowrap;align-items:flex-start;cursor:pointer"><input type="checkbox" data-bs="${k}" ${bs[k] ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--fir);margin-top:3px;flex:none"> <span>${t}</span></label>`;
  return { title: 'Workshop overview', html: `<div class="page">
    <div class="crumb"><a href="#/">Home</a> / Workshop</div>
    <div class="row" style="align-items:flex-end"><h1 class="h1" id="page-title" tabindex="-1">Workshop overview</h1><span class="chip">${ui('clock', 14)} About 2.5 hours + optional labs</span></div>
    <div class="split" style="margin-top:22px">
      <div><h2 class="h3" style="margin-bottom:8px">Agenda</h2><div class="card" style="padding:4px 2px"><ol class="lesson-rows">${rows}</ol></div>
      <div class="row" style="margin-top:16px"><a class="btn" href="#/primer">Start with the Primer ${ui('arrow', 18)}</a><a class="btn secondary" href="assets-3b8ff24439/downloads/agent-planning-worksheet.pdf" download>${ui('dl', 18)} Blank planning worksheet (PDF)</a></div></div>
      <div class="stack"><div><h2 class="h3" style="margin-bottom:8px" id="mode-h">How do you want to learn?</h2>
        <div class="stack" role="radiogroup" aria-labelledby="mode-h">
        ${[['guided', 'Guided workshop', 'Follow the modules in order. We\'ll suggest the next lesson each time.', true], ['explore', 'Explore', 'Jump to any topic. Great if you already know the basics.']].map(([k, t, d, rec]) => `<button class="card" role="radio" aria-checked="${s.mode === k}" data-setmode="${k}" style="text-align:left;background:${s.mode === k ? 'var(--lf)' : 'var(--n1)'}"><span class="row"><span class="radio-dot ${s.mode === k ? 'on' : ''}" aria-hidden="true"></span><b>${t}</b>${rec ? '<span class="tag" style="margin-left:auto">RECOMMENDED</span>' : ''}</span><span class="small" style="display:block;margin-top:6px">${d}</span></button>`).join('')}</div></div>
        <div class="soft"><h2 class="h4" style="margin-bottom:10px">Before you start</h2><div class="stack" style="gap:10px">${chk('access', 'I can see Agents → Your Agents → Add Agent in Mark')}${chk('library', 'I checked the Agent Library for an existing agent that already does my task')}${chk('task', 'I have a repetitive task in mind (or I\'ll use the example)')}</div>
        <details style="margin-top:12px"><summary class="small"><span class="chev">${ui('chev', 14)}</span>Can't see Add Agent? What to ask your admin</summary><div class="details-body small"><p>"Please assign me the Agent Builder role for Mark in the Opti ID Admin Center, and confirm generative AI is turned on for our organization."</p><p style="margin:0">You can still do Modules 1 and 2 while you wait. They don't need Mark access.</p></div></details></div>
        <div class="card"><h2 class="h4" id="conf-h">How confident do you feel building agents today?</h2><p class="small" style="margin:4px 0 10px">1 = not at all, 5 = very. We'll ask again at the end.</p><div class="conf" role="radiogroup" aria-labelledby="conf-h">${[1, 2, 3, 4, 5].map(n => `<button role="radio" aria-checked="${s.confidence.start === n}" data-conf="start" data-v="${n}" aria-label="${n} of 5">${n}</button>`).join('')}</div></div>
      </div></div></div>`,
    mount(root) {
      root.addEventListener('change', e => { const k = e.target.dataset.bs; if (k) { const bs2 = { ...store.get().beforeStart, [k]: e.target.checked }; store.set({ beforeStart: bs2 }); } });
      root.addEventListener('click', e => {
        const m = e.target.closest('[data-setmode]'); if (m) { store.set({ mode: m.dataset.setmode }); rerender(); announce(`${m.dataset.setmode === 'guided' ? 'Guided workshop' : 'Explore'} mode selected`); }
        const c = e.target.closest('[data-conf]'); if (c) { store.set({ confidence: { ...store.get().confidence, [c.dataset.conf]: +c.dataset.v } }); rerender(); }
      });
    } };
}
let rerenderFn = () => {};
export const setRerender = fn => { rerenderFn = fn; };
const rerender = () => rerenderFn(true);

/* ---------- Module landing (S04) ---------- */
export function moduleLanding(mod) {
  const items = moduleItems(mod); const mp = moduleProgress(mod);
  const firstUndone = items.find(i => !i.optional && !store.isDone(i.id)) || items[0];
  const rows = items.map(i => `<li><a href="#${i.route}"><span class="cb ${store.isDone(i.id) ? 'on' : ''}" aria-hidden="true">${store.isDone(i.id) ? ui('check', 12) : ''}</span><span class="t">${esc(i.title)}${i.optional ? ' <span class="tag">OPTIONAL</span>' : ''}</span><span class="f">${esc(i.type === 'check' ? `${i.qcount} questions` : i.type === 'lab' ? 'Hands-on in your Mark instance' : i.lesson.format)}</span><span class="m">${i.type === 'check' ? i.qcount + 'q' : i.mins + 'm'}</span><span class="sr-only">${store.isDone(i.id) ? '(completed)' : ''}</span></a></li>`).join('');
  return { title: mod.title, html: `<div class="page">
    <section class="hero n3"><div><div class="crumb"><a href="#/">Home</a> / <a href="#/workshop">Workshop</a> / ${esc(mod.label)} · ${esc(mod.phase)}</div><h1 class="h1" id="page-title" tabindex="-1">${esc(mod.title)}</h1><p class="lead"><b>Module goal:</b> ${esc(mod.goal)}</p>
    <div class="row" style="margin-top:14px"><span class="chip">${ui('clock', 14)} ${mod.mins} min</span><span class="chip">${mod.lessons.length} lessons</span>${CHECKS[mod.id] ? '<span class="chip">1 knowledge check</span>' : ''}${mod.lab ? '<span class="chip">1 optional lab</span>' : ''}${['m1', 'm2'].includes(mod.id) ? '<span class="chip">No Mark access needed</span>' : ''}</div></div>${ill(mod.ill, '')}</section>
    <div class="split split-wide" style="margin-top:22px">
      <div><div class="row" style="margin-bottom:8px"><h2 class="h3" style="flex:1">Lessons</h2><span class="lbl">${mp.done} of ${mp.total} done</span></div><div class="card" style="padding:4px 2px"><ul class="lesson-rows">${rows}</ul></div>
      <div class="row" style="margin-top:14px"><a class="btn" href="#${firstUndone.route}">${mp.done ? 'Continue' : 'Start module'}: ${esc(firstUndone.title)} ${ui('arrow', 18)}</a></div></div>
      <div class="stack">${mod.objectives ? `<div class="soft"><h2 class="h4">What you'll learn</h2><ul class="small" style="margin:8px 0 0">${mod.objectives.map(o => `<li>${esc(o)}</li>`).join('')}</ul></div>` : ''}
      <div class="card"><h2 class="h4">The example we'll follow</h2><p class="small" style="margin:6px 0 8px"><b>Meta Description Writer:</b> reads a product page and writes 3 search-friendly meta descriptions.</p><a class="small" href="#/reference/examples">See it fully dissected</a></div>
      ${mod.handout ? `<div class="blue"><h2 class="h4">Handout</h2><p class="small" style="margin:4px 0 10px">${esc(mod.handout.note)}</p><a class="btn sm secondary" href="assets-3b8ff24439/downloads/${mod.handout.file}" download>${ui('dl', 16)} ${esc(mod.handout.title)} (PDF)</a></div>` : ''}
      ${mod.lab ? `<div class="blue"><h2 class="h4">Optional lab</h2><p class="small" style="margin:4px 0 10px">${esc(mod.lab.title)} · about ${mod.lab.mins} min</p><a class="btn sm secondary" href="#/${mod.id}/lab">Open the lab ${ui('chev', 16)}</a></div>` : ''}</div></div></div>` };
}

/* ---------- Lesson shell ---------- */
function railHtml(mod, currentId) {
  const items = moduleItems(mod); const mp = moduleProgress(mod); const bm = store.get().bookmarks;
  return `<nav class="rail" id="rail" aria-label="${esc(mod.title)} lessons"><div class="lbl">Workshop path</div><div class="rail-mod"><a href="#${mod.id === 'primer' ? '/workshop' : '/' + mod.id}" style="text-decoration:none">${esc(mod.label)} · ${esc(mod.title)}</a></div>
  <ul class="rail-list">${items.map(i => `<li><a href="#${i.route}" ${i.id === currentId ? 'aria-current="page"' : ''}><span class="cb ${store.isDone(i.id) ? 'on' : ''}" aria-hidden="true">${store.isDone(i.id) ? ui('check', 12) : ''}</span><span>${esc(i.title)}</span><span class="m">${i.type === 'check' ? i.qcount + 'q' : i.mins + 'm'}</span><span class="sr-only">${store.isDone(i.id) ? ' (completed)' : ''}</span></a></li>`).join('')}</ul>
  <div class="lbl">Module progress</div><div class="prog" role="progressbar" aria-label="Module progress" aria-valuenow="${mp.pct}" aria-valuemin="0" aria-valuemax="100" style="margin-top:6px"><i style="width:${Math.max(mp.pct, 3)}%"></i></div><p class="xs" style="margin:6px 0 0">${mp.done} of ${mp.total} done</p>
  <div class="rail-links"><button type="button" data-refcard>${ui('book', 16)} Reference card</button><button type="button" data-bookmark>${ui('bookmark', 16)} <span data-bm-label>${store.isBookmarked(location.hash.slice(1).split('?')[0]) ? 'Remove bookmark' : 'Bookmark this page'}</span></button>
  <details><summary class="small" style="font-weight:500">${ui('bookmark', 16)} Bookmarks (${bm.length})</summary><div class="details-body">${bm.length ? `<ul style="list-style:none;padding:0;margin:0">${bm.map(b => `<li><a class="small" href="#${b.route}">${esc(b.title)}</a></li>`).join('')}</ul>` : '<p class="xs" style="margin:0">No bookmarks yet.</p>'}</div></details>
  <a href="#/workshop">${ui('grid', 16)} Workshop overview</a></div></nav><div class="rail-backdrop" data-rail-close></div>`;
}
function asideHtml(blocks, related, docs) {
  return `<aside class="aside" aria-label="On this page"><div class="lbl">On this page</div><ul>${blocks.map(b => `<li><button type="button" data-goto="${b.id}">${esc(b.title)}</button></li>`).join('')}</ul>
  ${related?.length ? `<div class="lbl">Related</div><ul>${related.map(r => `<li><a href="#${r.route}">${esc(r.title)}</a></li>`).join('')}</ul>` : ''}
  ${docs?.length ? `<div class="lbl">Official docs</div><ul>${docs.map(d => `<li>${docLink(d.href, esc(d.text))}</li>`).join('')}</ul>` : ''}</aside>`;
}
function notesHtml(notes, mod) {
  if (!notes) return '';
  const agenda = PATH_ORDER.map(id => { const m = modById(id); const p = moduleProgress(m); return `${esc(m.short)} ${m.mins}m${p.pct === 100 ? ' ✓' : ''}`; }).join(' · ');
  return `<aside class="fac-notes" aria-label="Facilitator notes"><div class="h3">Facilitator notes</div><div class="lbl" style="margin:2px 0 12px">Hidden from learners</div>
  ${notes.talk?.length ? `<p style="margin:0 0 4px"><b>Talking points</b></p><ul>${notes.talk.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
  ${notes.demo ? `<p style="margin:0 0 4px"><b>Demo cue</b></p><p>${esc(notes.demo)}</p>` : ''}
  ${notes.ask ? `<p style="margin:0 0 4px"><b>Ask the room</b></p><p>${esc(notes.ask)}</p>` : ''}
  ${notes.questions?.length ? `<p style="margin:0 0 4px"><b>Common questions</b></p><ul>${notes.questions.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
  <div class="card" style="padding:12px;margin-top:12px"><div class="h4">Agenda</div><p class="small" style="margin:4px 0 0">${agenda}</p></div>
  <div class="card" style="padding:12px;margin-top:10px"><div class="h4">Knowledge checks</div><p class="small" style="margin:4px 0 0">Answers stay hidden until you turn on "Reveal answers to the room" on each question.</p></div></aside>`;
}
function footerHtml(itemId, mod) {
  const { prev, next } = neighbors(itemId); const s = store.get(); const done = store.isDone(itemId);
  const explore = s.mode === 'explore';
  return `<div class="lesson-footer">${prev ? `<a class="btn sm secondary" href="#${prev.route}">${ui('left', 16)} <span class="prev-label">${esc(prev.title)}</span><span class="sr-only">Previous: ${esc(prev.title)}</span></a>` : ''}
  ${explore ? `<a class="btn sm secondary" href="#/reference">${ui('book', 16)} <span class="prev-label">Browse reference</span><span class="sr-only">Browse reference</span></a>` : ''}
  <button class="complete" type="button" data-complete="${itemId}" role="switch" aria-checked="${done}"><span class="cb ${done ? 'on' : ''}" aria-hidden="true">${done ? ui('check', 12) : ''}</span><span class="txt">Mark lesson complete</span><span class="sr-only">Mark lesson complete</span></button>
  ${next ? `<a class="btn sm next ${explore ? 'secondary' : ''}" href="#${next.route}" data-next="${itemId}"><span class="next-label">Next: ${esc(next.title)}</span><span class="next-short" aria-hidden="true">Next</span><span class="sr-only">Next: ${esc(next.title)}</span> ${ui('chev', 16)}</a>` : ''}</div>`;
}
function lessonShell({ mod, itemId, crumb, title, mins, learn, blocks, notes, related, docs, kind = 'Lesson' }) {
  const blocksHtml = blocks.map((b, i) => `<section class="block" id="sec-${b.id}" data-slide="${i}" aria-labelledby="h-${b.id}"><div class="block-title">${b.kicker ? `<span class="block-kicker">${esc(b.kicker)}</span>` : ''}<h2 class="h3" id="h-${b.id}">${esc(b.title)}</h2></div>${b.html}</section>`).join('');
  return `<div class="lesson-layout">${railHtml(mod, itemId)}
  <main class="lesson-main" id="main-content" tabindex="-1"><div class="lesson-inner">
    <button type="button" class="chip module-chip" data-rail-open aria-controls="rail" aria-expanded="false">${ui('menu', 14)} ${esc(mod.short)} · lessons</button>
    <div class="lesson-head"><div class="crumb"><a href="#/">Home</a> / <a href="#${mod.id === 'primer' ? '/workshop' : '/' + mod.id}">${esc(mod.label)}</a> / ${esc(crumb)}${mins ? ` · ${mins} min` : ''}</div><h1 class="h1" id="page-title" tabindex="-1">${esc(title)}</h1>
    ${learn?.length ? `<div class="learn-list" aria-label="What you'll learn"><span class="lbl" style="align-self:center">What you'll learn</span>${learn.map(l => `<span class="chip n">${esc(l)}</span>`).join('')}</div>` : ''}</div>
    ${blocksHtml}
    ${footerHtml(itemId, mod)}
  </div></main>
  ${asideHtml(blocks, related, docs)}${notesHtml(notes, mod)}</div>
  <div class="present-bar" aria-label="Presenter controls"><button class="btn sm secondary" data-slide-prev>${ui('left', 16)} Prev</button><span class="mono xs" data-slide-count></span><span class="chip" data-timer>${ui('timer', 14)} 00:00 / ${String(mins || 5).padStart(2, '0')}:00</span><button class="btn sm" data-slide-next style="margin-left:auto">Next ${ui('chev', 16)}</button></div>`;
}

/* ---------- Lesson page ---------- */
export function lessonPage(mod, lesson, params) {
  const id = `${mod.id}/${lesson.slug}`; const L = LESSONS[id](params);
  const idx = mod.lessons.indexOf(lesson);
  const crumb = mod.id === 'primer' ? 'Primer' : `Lesson ${mod.id.slice(1)}.${idx + 1}`;
  return { title: lesson.title, lessonMins: lesson.mins, itemId: id, presentable: true, html: lessonShell({ mod, itemId: id, crumb, title: lesson.title, mins: lesson.mins, learn: L.learn, blocks: L.blocks, notes: L.notes, related: L.related, docs: L.docs }) };
}

/* ---------- Knowledge check page (S08) ---------- */
export function checkPage(mod) {
  const id = `${mod.id}/check`; const best = store.get().checks[id]; const items = moduleItems(mod); const nx = neighbors(id).next;
  const blocks = [{ id: 'quiz', kicker: 'Check', title: `${CHECKS[mod.id].length} questions`, html: `<p>Every answer comes with an explanation, right or wrong. Retry as often as you like; only your best score is kept.${best ? ` <b>Best so far: ${best.score} of ${best.of}.</b>` : ''}</p>${comp('quiz', { id, questions: CHECKS[mod.id], next: nx ? { route: nx.route, label: 'Next: ' + nx.title } : null })}` }];
  return { title: `${mod.label} knowledge check`, itemId: id, presentable: true, lessonMins: 3, html: lessonShell({ mod, itemId: id, crumb: 'Knowledge check', title: 'Check your understanding', mins: 3, blocks, notes: { talk: ['Use the questions as a live poll.'], ask: '"Hands up for each option."', questions: [] }, related: CHECKS[mod.id].map(q => q.review).filter((v, i, a) => v && a.indexOf(v) === i).map(r => ({ route: r, title: 'Review: ' + (allItems().find(x => x.route === r)?.title || r) })), docs: [] }) };
}

/* ---------- Lab page (S18) ---------- */
export function labPage(mod) {
  const lab = LABS[mod.id]; const id = `${mod.id}/lab`; const steps = store.get().labSteps[id] || {}; const done = store.get().labsDone.includes(id);
  const blocks = [
    { id: 'boundary', kicker: 'Before you start', title: 'Do this in Mark', html: callout('thinking', `Do this lab in your own Mark instance. This site isn't connected to Mark and doesn't see what you build. It only remembers which steps you tick.`, 'info') + `<p style="margin-top:12px">${esc(lab.intro)}</p>` },
    { id: 'steps', kicker: 'Steps', title: 'Steps', html: `<div class="card" style="padding:6px 16px">${lab.steps.map((s, i) => `<div class="lab-step"><input type="checkbox" id="ls-${i}" data-labstep="${i}" ${steps[i] ? 'checked' : ''}><label for="ls-${i}"><b>${i + 1}. ${esc(s.t)}</b><br><span class="small">${esc(s.d)}</span></label></div>`).join('')}</div>` },
    { id: 'values', kicker: 'Reference', title: 'Example values (to read)', html: `<div class="soft"><div class="table-wrap"><table class="t"><tbody>${lab.values.map(([k, v]) => `<tr><td style="width:34%"><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div><p class="small" style="margin:10px 0 0">Shown as reading material for the example agent. Type your own values in Mark.</p></div>` },
    { id: 'self', kicker: 'Self-check', title: 'Check your work', html: `<div class="green"><ul style="list-style:none;padding:0;margin:0 0 12px">${lab.self.map(s => `<li class="row" style="gap:8px">${ui('check', 16)} ${esc(s)}</li>`).join('')}</ul><button class="btn sm secondary" style="background:var(--n1)" data-labdone role="switch" aria-checked="${done}"><span class="cb ${done ? 'on' : ''}" aria-hidden="true">${done ? ui('check', 12) : ''}</span> I've done this lab</button></div>${lab.alt ? `<p class="small" style="margin-top:10px"><a href="#${lab.alt.route}">${esc(lab.alt.text)}</a></p>` : ''}<p class="small"><a href="#/reference/troubleshooting">Stuck? Troubleshooting</a></p>` }
  ];
  return { title: mod.lab.title, itemId: id, presentable: true, lessonMins: mod.lab.mins, html: lessonShell({ mod, itemId: id, crumb: 'Lab · optional', title: mod.lab.title, mins: mod.lab.mins, blocks, notes: { talk: ['Hands-on time. Walk the room.'], demo: 'Start a countdown and circulate.', ask: '"Who has saved their agent?"', questions: ['"No Add Agent button?" They need the Agent Builder role.'] }, related: [{ route: '/reference/troubleshooting', title: 'Troubleshooting' }], docs: [{ href: DOCS + 'create-a-specialized-agent', text: 'Create a specialized agent' }] }),
    mount(root) {
      root.addEventListener('change', e => { const i = e.target.dataset.labstep; if (i != null) store.labStep(id, +i, e.target.checked); });
      root.addEventListener('click', e => { if (e.target.closest('[data-labdone]')) { store.labDone(id, !store.get().labsDone.includes(id)); rerender(); toast(store.get().labsDone.includes(id) ? 'Lab marked as done' : 'Lab marked as not done'); } });
    } };
}

/* ---------- Wrap-up (S28) ---------- */
export function wrapUp() {
  const s = store.get(); const op = overallProgress();
  const recap = PATH_ORDER.map(id => { const m = modById(id); const mp = moduleProgress(m); const c = s.checks[`${id}/check`]; return `<li class="row" style="padding:8px 0;border-bottom:1px solid var(--n3);flex-wrap:nowrap"><span class="cb ${mp.pct === 100 ? 'on' : ''}" aria-hidden="true">${mp.pct === 100 ? ui('check', 12) : ''}</span><a href="#${id === 'primer' ? '/primer' : '/' + id}" style="flex:1">${esc(m.label)} · ${esc(m.title)}</a><span class="mono xs">${c ? `${c.score}/${c.of}` : `${mp.done}/${mp.total}`}</span></li>`; }).join('');
  const conf = s.confidence;
  return { title: 'Wrap-up', itemId: 'wrap-up', html: `<div class="page">
    <section class="hero"><div><div class="crumb"><a href="#/">Home</a> / Wrap-up</div><h1 class="h1" id="page-title" tabindex="-1">${op.done >= op.total - 1 ? 'You\'ve finished the workshop' : 'Wrap-up and what\'s next'}</h1><p class="lead">You planned, built, tested and shared an agent, at least on paper. Here's what you covered, and where to go next.</p></div>${ill('arrows-up', '')}</section>
    <div class="grid3" style="margin-top:22px;align-items:start">
      <div class="card"><h2 class="h4">Your recap</h2><p class="small" style="margin:4px 0 6px">${op.done} of ${op.total} items complete</p><ul style="list-style:none;padding:0;margin:0">${recap}</ul></div>
      <div class="stack"><div class="soft"><h2 class="h4" id="conf-end-h">How confident do you feel now?</h2><div class="conf" role="radiogroup" aria-labelledby="conf-end-h" style="margin-top:10px">${[1, 2, 3, 4, 5].map(n => `<button role="radio" aria-checked="${conf.end === n}" data-conf="end" data-v="${n}" aria-label="${n} of 5">${n}</button>`).join('')}</div><p class="small" style="margin:8px 0 0" aria-live="polite">${conf.start ? `At the start you chose ${conf.start}.` : 'You didn\'t rate your confidence at the start.'}${conf.start && conf.end ? ` Now: ${conf.end} (${conf.end - conf.start >= 0 ? '+' : ''}${conf.end - conf.start}).` : ''}</p></div>
      <div class="soft"><h2 class="h4">Understanding check · 3 true/false</h2>${comp('quiz', { id: 'wrap/understanding', questions: UNDERSTANDING_CHECK, inline: true })}</div>
      <div class="card"><div class="row" style="flex-wrap:nowrap">${bicon('certificate', 34)}<div><h2 class="h4">Completion card</h2><p class="small" style="margin:2px 0 0">Your name, today's date and modules completed. Created in your browser; nothing is sent anywhere.</p></div></div>
      <label class="small" for="cc-name" style="display:block;margin:12px 0 4px;font-weight:500">Your name (optional)</label><input id="cc-name" class="filter-input" style="width:100%" maxlength="60" autocomplete="name">
      <button class="btn sm" style="margin-top:10px" data-cc>${ui('dl', 16)} Download completion card</button></div></div>
      <div class="stack"><h2 class="h4">What's next</h2>
        <a class="soft3" style="text-decoration:none;display:block" href="#/m1"><b>Build your second agent</b><span class="small" style="display:block">Restart Module 1 with a new idea</span></a>
        <a class="soft3" style="text-decoration:none;display:block" href="${DOCS}create-an-organization-wide-skill" target="_blank" rel="noopener noreferrer"><b>Organization skills ${ui('ext', 14)}</b><span class="small" style="display:block">Reuse brand rules across agents</span><span class="sr-only"> (opens in a new tab)</span></a>
        <a class="soft3" style="text-decoration:none;display:block" href="${DOCS}workflow-agents-overview" target="_blank" rel="noopener noreferrer"><b>Workflow agents ${ui('ext', 14)}</b> <span class="tag">COMING TO THIS WORKSHOP</span><span class="small" style="display:block">Connect agents with triggers, conditions and loops</span><span class="sr-only"> (opens in a new tab)</span></a>
        <a class="soft3" style="text-decoration:none;display:block" href="${DOCS}create-custom-tools" target="_blank" rel="noopener noreferrer"><b>Custom tools ${ui('ext', 14)}</b><span class="small" style="display:block">Connect agents to your own systems (developers)</span><span class="sr-only"> (opens in a new tab)</span></a>
        <a class="soft3" style="text-decoration:none;display:block" href="${ACADEMY}" target="_blank" rel="noopener noreferrer"><b>Optimizely Academy ${ui('ext', 14)}</b><span class="small" style="display:block">Mark Advanced · Mark for Practitioners</span><span class="sr-only"> (opens in a new tab)</span></a></div></div>
    <div class="row" style="margin-top:24px"><button class="btn" data-complete-wrap role="switch" aria-checked="${store.isDone('wrap-up')}"><span class="cb ${store.isDone('wrap-up') ? 'on' : ''}" aria-hidden="true" style="background:${store.isDone('wrap-up') ? 'var(--n1)' : ''}">${store.isDone('wrap-up') ? ui('check', 12) : ''}</span> Mark workshop complete</button></div></div>`,
    mount(root) {
      root.addEventListener('click', e => {
        const c = e.target.closest('[data-conf]'); if (c) { store.set({ confidence: { ...store.get().confidence, end: +c.dataset.v } }); rerender(); }
        if (e.target.closest('[data-cc]')) downloadCard(root.querySelector('#cc-name').value.trim());
        if (e.target.closest('[data-complete-wrap]')) { store.toggle('wrap-up'); rerender(); toast(store.isDone('wrap-up') ? 'Workshop marked complete' : 'Marked as not complete'); }
      });
    } };
}
async function downloadCard(name) {
  try {
    await Promise.all(['800 64px "VC Nudge"', '400 24px "Die Grotesk"', '700 24px "Die Grotesk"', '400 18px "Roboto Mono"'].map(f => document.fonts.load(f)));
    const c = document.createElement('canvas'); c.width = 1200; c.height = 630; const g = c.getContext('2d');
    g.fillStyle = '#ABFF44'; g.fillRect(0, 0, 1200, 630);
    g.fillStyle = '#FFFFFF'; roundRect(g, 640, 70, 490, 490, 36); g.fill(); g.strokeStyle = '#08251A'; g.lineWidth = 2; g.stroke();
    const logo = await loadImg(LOGO); g.drawImage(logo, 70, 60, 160, 160 * logo.height / logo.width || 55);
    const art = await loadImg('assets-3b8ff24439/img/ill/arrows-up.svg'); const s = Math.min(380 / art.width, 380 / art.height); g.drawImage(art, 885 - art.width * s / 2, 315 - art.height * s / 2, art.width * s, art.height * s);
    g.fillStyle = '#08251A'; g.font = '400 18px "Roboto Mono"'; g.fillText('COMPLETION CARD', 70, 200);
    g.font = '800 58px "VC Nudge"'; ['Mark Agent Builder', 'Workshop'].forEach((t, i) => g.fillText(t, 70, 275 + i * 62));
    g.font = '700 30px "Die Grotesk"'; g.fillText(name || 'Workshop participant', 70, 430);
    const op = overallProgress(); const modsDone = PATH_ORDER.filter(id => moduleProgress(modById(id)).pct === 100).length;
    g.font = '400 22px "Die Grotesk"'; g.fillText(`${modsDone} of ${PATH_ORDER.length} parts completed · ${op.done} of ${op.total} items`, 70, 472);
    g.font = '400 16px "Roboto Mono"'; g.fillText(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase(), 70, 560);
    const url = c.toDataURL('image/png'); const a = document.createElement('a'); a.href = url; a.download = 'mark-agent-builder-workshop-completion.png'; document.body.appendChild(a); a.click(); a.remove();
    window.__lastCard = url.length; toast('Completion card downloaded');
  } catch (e) { console.error(e); toast('Sorry, the card could not be created in this browser.'); }
}
function loadImg(src) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

/* ---------- Reference hub ---------- */
export function referenceHub() {
  const bm = store.get().bookmarks;
  const card = (route, icon, t, d) => `<a class="mod-card" href="#${route}" style="min-height:0"><div class="top">${bicon(icon, 28)}</div><span class="t">${t}</span><span class="small">${d}</span></a>`;
  return { title: 'Reference', html: `<div class="page"><div class="crumb"><a href="#/">Home</a> / Reference</div><h1 class="h1" id="page-title" tabindex="-1">Reference library</h1><p class="lead" style="max-width:640px;margin-top:10px">Everything from the workshop in one place. Look things up whenever you need them.</p>
    <div class="grid3" style="margin-top:20px">${card('/reference/builder', 'specialized-tools', 'Field encyclopedia', 'Every agent builder setting, plus the Test Run panel, Quality tab, Share dialog and version history.')}${card('/m3/builder-anatomy', 'visibility', 'Builder replica', 'Click through a replica of the agent builder.')}${card('/reference/practices', 'best-practice', 'Best practices', `${PRACTICES.length} tips from real FDE workshops.`)}${card('/reference/glossary', 'document', 'Glossary', 'Plain explanations of every Mark term.')}${card('/reference/examples', 'pre-built-agents', 'Worked examples', `${EXAMPLES.length} agents, fully dissected.`)}${card('/reference/troubleshooting', 'warning', 'Troubleshooting and FAQ', 'Symptom → cause → fix, plus common questions.')}</div>
    <div class="grid2" style="margin-top:24px;align-items:start"><div class="card"><h2 class="h4">Your bookmarks</h2>${bm.length ? `<ul style="margin:8px 0 0">${bm.map(b => `<li><a href="#${b.route}">${esc(b.title)}</a></li>`).join('')}</ul>` : '<p class="small" style="margin:6px 0 0">No bookmarks yet. Use "Bookmark this page" in any lesson\'s side menu.</p>'}</div>
    <div class="card"><h2 class="h4">Downloads</h2><ul class="small" style="margin:8px 0 0"><li><a href="assets-3b8ff24439/downloads/agent-planning-worksheet.pdf" download>Blank agent planning worksheet (PDF)</a></li><li><a href="assets-3b8ff24439/downloads/prompt-quality-checklist.pdf" download>Prompt quality checklist (PDF)</a></li><li><a href="assets-3b8ff24439/downloads/best-practices-one-pager.pdf" download>Best practices one-pager (PDF)</a></li><li><a href="assets-3b8ff24439/downloads/pilot-feedback-checklist.pdf" download>Pilot feedback checklist (PDF)</a></li></ul></div></div>
    <div class="soft" style="margin-top:24px"><h2 class="h4">Your progress</h2><p class="small" style="margin:6px 0 10px">Progress is saved only in this browser. Resetting clears lessons, scores, labs, bookmarks and confidence ratings.</p><button class="btn sm secondary" data-reset>${ui('reset', 16)} Reset my progress</button></div></div>`,
    mount(root) { root.addEventListener('click', e => { if (e.target.closest('[data-reset]')) { if (confirm('Reset all your workshop progress in this browser? This can\'t be undone.')) { store.reset(); rerender(); toast('Progress reset'); } } }); } };
}

/* ---------- Field encyclopedia (S29) ---------- */
export function builderRef(params) {
  const filters = [['all', 'All builder fields'], ['must', 'Must · 7'], ['rec', 'Recommended · 2'], ['leave', 'Leave for now · 9'], ...SURFACES.map(s => [s.key, s.label])];
  let f = params.get('surface') || params.get('tier') || 'all'; let q = ''; let open = params.get('field') || params.get('item') || null;
  if (open && !params.get('surface')) { const bf = BUILDER_FIELDS.find(x => x.key === open); if (bf) f = 'all'; }
  const entryB = x => `<div class="acc ${open === x.key ? 'open' : ''}" id="f-${x.key}"><h2><button class="acc-btn" aria-expanded="${open === x.key}" aria-controls="fp-${x.key}" data-acc="${x.key}"><span class="mk">${x.n}</span>${esc(x.label)}<span class="tag ${x.tier}">${TIER_LABEL[x.tier].toUpperCase()}</span>${ui(open === x.key ? 'chevd' : 'chev', 18)}</button></h2><div class="acc-panel" id="fp-${x.key}" ${open === x.key ? '' : 'hidden'}><p>${x.plain}</p><div class="grid3"><div><div class="lbl">First agent</div><p class="small" style="margin:4px 0 0">${x.first}</p></div><div><div class="lbl">Change when</div><p class="small" style="margin:4px 0 0">${x.change}</p></div><div><div class="lbl">In the example</div><p class="small" style="margin:4px 0 0">${esc(x.example)}</p></div></div><div style="height:10px"></div>${tip(x.tip)}<p class="small" style="margin:10px 0 0"><b>Common mistakes:</b> ${x.mistakes.join(' · ')}</p>${x.comparison ? think(x.comparison.text, x.comparison.limit) : ''}${x.tech ? `<p class="small"><b>Technical detail:</b> ${x.tech}</p>` : ''}<p class="small" style="margin:10px 0 0"><a href="#/m3/builder-anatomy?field=${x.key}">Open in the builder replica</a> · ${docLink(x.docs, 'Official docs')}</p></div></div>`;
  const entryS = (s, x, i) => `<div class="acc ${open === x.key ? 'open' : ''}" id="f-${x.key}"><h2><button class="acc-btn" aria-expanded="${open === x.key}" aria-controls="fp-${x.key}" data-acc="${x.key}"><span class="mk">${i + 1}</span>${esc(x.label)}<span class="tag">${esc(s.label.toUpperCase())}</span>${ui(open === x.key ? 'chevd' : 'chev', 18)}</button></h2><div class="acc-panel" id="fp-${x.key}" ${open === x.key ? '' : 'hidden'}><p>${x.plain}</p><div class="lbl">First agent</div><p class="small" style="margin:4px 0 10px">${x.first}</p>${tip(x.tip)}</div></div>`;
  const listHtml = () => {
    const ql = q.toLowerCase(); const match = x => !ql || (x.label + ' ' + x.plain).toLowerCase().includes(ql);
    let html = '';
    if (['all', 'must', 'rec', 'leave'].includes(f)) html = BUILDER_FIELDS.filter(x => (f === 'all' || x.tier === f) && match(x)).map(entryB).join('');
    else { const s = SURFACES.find(x => x.key === f); html = s.items.map((x, i) => match(x) ? entryS(s, x, i) : '').join(''); }
    return html || '<p class="empty">No matching entries.</p>';
  };
  return { title: 'Field encyclopedia', html: `<div class="page"><div class="crumb"><a href="#/">Home</a> / <a href="#/reference">Reference</a> / Field encyclopedia</div>
    <div class="row" style="align-items:flex-end"><h1 class="h1" id="page-title" tabindex="-1" style="flex:1">Field encyclopedia</h1><a class="btn sm secondary" href="#/m3/builder-anatomy">${ui('grid', 16)} View on the builder replica</a></div>
    <div class="split split-side" style="margin-top:10px"><div>
    <div class="filters" role="group" aria-label="Filter entries">${filters.map(([k, l]) => `<button class="chip" aria-pressed="${f === k}" data-filter="${k}">${esc(l)}</button>`).join('')}</div>
    <label class="sr-only" for="fe-q">Filter fields</label><input id="fe-q" class="filter-input" placeholder="Filter by name or description" style="margin-bottom:14px;width:100%;max-width:380px">
    <div id="fe-list" aria-live="polite">${listHtml()}</div></div>
    <div class="stack"><div class="soft small"><b>Every builder entry has</b><br>What it is · First-agent choice · When to change it · Example value · FDE tip · Common mistakes · Docs link</div><div class="blue small"><b>Same content, two views</b><br>This list and the builder replica's drawers share one source.</div><div class="card small"><b>Last verified</b><br><span class="mono xs">Against Mark docs · 16 Nov 2026</span></div></div></div></div>`,
    mount(root) {
      const list = root.querySelector('#fe-list'); const qi = root.querySelector('#fe-q');
      const redraw = () => { list.innerHTML = listHtml(); };
      qi.addEventListener('input', () => { q = qi.value; redraw(); });
      root.addEventListener('click', e => {
        const fb = e.target.closest('[data-filter]'); if (fb) { f = fb.dataset.filter; root.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === fb))); redraw(); }
        const a = e.target.closest('[data-acc]'); if (a) { open = open === a.dataset.acc ? null : a.dataset.acc; redraw(); root.querySelector(`[data-acc="${a.dataset.acc}"]`)?.focus(); }
      });
      if (open) setTimeout(() => root.querySelector('#f-' + open)?.scrollIntoView({ block: 'start' }), 30);
    } };
}

/* ---------- Best practices (S30) ---------- */
export function practices() {
  let mf = 'all'; let tf = 'all'; const open = {};
  const tags = [...new Set(PRACTICES.map(p => p.tag))];
  const cards = () => PRACTICES.map((p, i) => ({ p, i })).filter(({ p }) => (mf === 'all' || p.m.includes(+mf)) && (tf === 'all' || p.tag === tf)).map(({ p, i }) => `<div class="bp-card"><div class="row" style="justify-content:space-between"><span class="mono xs">BP${i + 1}</span>${bicon('best-practice', 18)}</div><div class="t">${esc(p.t)}</div><div class="row" style="gap:6px">${p.m.map(m => `<span class="tag leave">MODULE ${m}</span>`).join('')}<span class="tag">${esc(p.tag.toUpperCase())}</span></div><button class="link-btn small" aria-expanded="${!!open[i]}" aria-controls="bp-${i}" data-bp="${i}">${open[i] ? 'Hide details' : 'Why and how'}</button><div id="bp-${i}" ${open[i] ? '' : 'hidden'} class="small"><p style="margin:0 0 6px"><b>Why it matters:</b> ${esc(p.why)}</p><p style="margin:0 0 6px"><b>How:</b> ${esc(p.how)}</p><a href="#${p.route}">Go to the lesson</a></div></div>`).join('') || '<p class="empty">No practices match these filters.</p>';
  return { title: 'Best practices', html: `<div class="page"><div class="crumb"><a href="#/">Home</a> / <a href="#/reference">Reference</a> / Best practices</div>
    <div class="row" style="align-items:flex-end"><h1 class="h1" id="page-title" tabindex="-1" style="flex:1">Best practices from the field</h1><span class="chip">${PRACTICES.length} practices</span><a class="btn sm secondary" href="assets-3b8ff24439/downloads/best-practices-one-pager.pdf" download>${ui('dl', 16)} Printable one-pager</a></div>
    <div class="filters" role="group" aria-label="Filter by module"><span class="lbl">Module</span>${['all', 1, 2, 3, 4, 5, 6].map(m => `<button class="chip" aria-pressed="${String(mf) === String(m)}" data-mf="${m}">${m === 'all' ? 'All' : m}</button>`).join('')}</div>
    <div class="filters" role="group" aria-label="Filter by tag" style="margin-top:0"><span class="lbl">Tag</span>${['all', ...tags].map(t => `<button class="chip" aria-pressed="${tf === t}" data-tf="${t}">${t === 'all' ? 'All' : esc(t)}</button>`).join('')}</div>
    <div class="bp-grid" id="bp-list" aria-live="polite">${cards()}</div></div>`,
    mount(root) {
      const list = root.querySelector('#bp-list');
      root.addEventListener('click', e => {
        const m = e.target.closest('[data-mf]'); if (m) { mf = m.dataset.mf; root.querySelectorAll('[data-mf]').forEach(b => b.setAttribute('aria-pressed', String(b === m))); list.innerHTML = cards(); }
        const t = e.target.closest('[data-tf]'); if (t) { tf = t.dataset.tf; root.querySelectorAll('[data-tf]').forEach(b => b.setAttribute('aria-pressed', String(b === t))); list.innerHTML = cards(); }
        const b = e.target.closest('[data-bp]'); if (b) { const i = +b.dataset.bp; open[i] = !open[i]; list.innerHTML = cards(); list.querySelector(`[data-bp="${i}"]`)?.focus(); }
      });
    } };
}

/* ---------- Glossary (S31) ---------- */
export function glossary(params) {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term)); const hit = params.get('term'); let q = '';
  const entries = () => sorted.filter(g => !q || (g.term + ' ' + g.plain).toLowerCase().includes(q.toLowerCase())).map(g => `<div class="gl-entry ${g.key === hit ? 'hit' : ''}" id="g-${g.key}" data-letter="${g.term[0].toUpperCase()}"><h2 class="h4">${esc(g.term)}</h2><p style="margin:4px 0 6px">${esc(g.plain)}</p>${g.comparison ? `<details class="think" ${g.key === hit ? 'open' : ''}><summary><span class="chev">${ui('chev', 16)}</span>Think of it like…</summary><div class="details-body"><p>${esc(g.comparison)}</p>${g.limit ? `<p style="margin:0"><b>Where this comparison stops working:</b> ${esc(g.limit)}</p>` : ''}</div></details>` : ''}</div>`).join('') || '<p class="empty">No matching terms.</p>';
  const letters = new Set(sorted.map(g => g.term[0].toUpperCase()));
  return { title: 'Glossary', html: `<div class="page"><div class="crumb"><a href="#/">Home</a> / <a href="#/reference">Reference</a> / Glossary</div>
    <div class="row" style="align-items:flex-end"><h1 class="h1" id="page-title" tabindex="-1" style="flex:1">Glossary</h1><label class="sr-only" for="gl-q">Find a term</label><input id="gl-q" class="filter-input" placeholder="Find a term"></div>
    <nav class="az" aria-label="Jump to letter">${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => `<button data-letter-jump="${l}" ${letters.has(l) ? '' : 'disabled'} aria-label="Jump to ${l}">${l}</button>`).join('')}</nav>
    <div class="split split-wide"><div id="gl-list" aria-live="polite">${entries()}</div>
    <div class="stack"><div class="soft small"><b>Plain explanation first</b><br>Every entry leads with what the term means. Comparisons are optional, collapsed, and always say where they stop working.</div><div class="card small"><b>Also appears as hover cards</b><br>Underlined terms in lessons show these explanations inline.</div></div></div></div>`,
    mount(root) {
      const list = root.querySelector('#gl-list'); const qi = root.querySelector('#gl-q');
      qi.addEventListener('input', () => { q = qi.value; list.innerHTML = entries(); });
      root.addEventListener('click', e => { const l = e.target.closest('[data-letter-jump]'); if (l) { q = ''; qi.value = ''; list.innerHTML = entries(); const el = list.querySelector(`[data-letter="${l.dataset.letterJump}"]`); if (el) { el.scrollIntoView({ block: 'start' }); el.querySelector('h2').setAttribute('tabindex', '-1'); el.querySelector('h2').focus({ preventScroll: true }); } } });
      if (hit) setTimeout(() => root.querySelector('#g-' + hit)?.scrollIntoView({ block: 'start' }), 30);
    } };
}

/* ---------- Worked examples ---------- */
export function examples() {
  return { title: 'Worked examples', html: `<div class="page"><div class="crumb"><a href="#/">Home</a> / <a href="#/reference">Reference</a> / Worked examples</div><h1 class="h1" id="page-title" tabindex="-1">Worked example gallery</h1><p class="lead" style="max-width:680px;margin-top:10px">Six agents, each dissected the same way. They show variety: with and without tools, and different kinds of output.</p>
    <div class="grid2" style="margin-top:20px">${EXAMPLES.map(x => `<article class="card"><div class="row"><h2 class="h3" style="flex:1">${esc(x.name)}</h2>${x.followAlong ? '<span class="chip g">Follow-along example</span>' : ''}<span class="tag">${esc(x.verb.toUpperCase())}</span></div><p style="margin:8px 0 12px">${esc(x.task)}</p><div class="table-wrap"><table class="t"><tbody>${[['Variables', x.vars], ['Tools', x.tools], ['Rules', x.rules], ['If it can\'t finish', x.cant], ['Output', x.output], ['Settings', x.settings]].map(([k, v]) => `<tr><td style="width:30%"><b>${k}</b></td><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div></article>`).join('')}</div></div>` };
}

/* ---------- Troubleshooting & FAQ (S32) ---------- */
export function troubleshooting(scrollTo) {
  let mf = 'All'; const openT = {}; const openF = {};
  const groups = ['All', ...new Set(FAQ.map(f => f.m))];
  const tHtml = () => TROUBLE.map((t, i) => `<div class="acc ${openT[i] ? 'open' : ''}"><h3><button class="acc-btn" aria-expanded="${!!openT[i]}" aria-controls="tr-${i}" data-t="${i}">${esc(t.q)}${ui(openT[i] ? 'chevd' : 'chev', 18)}</button></h3><div class="acc-panel" id="tr-${i}" ${openT[i] ? '' : 'hidden'}><p style="margin:0 0 6px"><b>Likely cause:</b> ${esc(t.a)}</p><p style="margin:0"><b>Fix:</b> ${esc(t.fix)}</p></div></div>`).join('');
  const fHtml = () => FAQ.map((f, i) => ({ f, i })).filter(({ f }) => mf === 'All' || f.m === mf).map(({ f, i }) => `<div class="acc ${openF[i] ? 'open' : ''}"><h3><button class="acc-btn" aria-expanded="${!!openF[i]}" aria-controls="fq-${i}" data-f="${i}">${esc(f.q)}<span class="tag">${esc(f.m.toUpperCase())}</span>${ui(openF[i] ? 'chevd' : 'chev', 18)}</button></h3><div class="acc-panel" id="fq-${i}" ${openF[i] ? '' : 'hidden'}><p style="margin:0">${esc(f.a)}</p></div></div>`).join('');
  return { title: 'Troubleshooting and FAQ', html: `<div class="page"><div class="crumb"><a href="#/">Home</a> / <a href="#/reference">Reference</a> / Troubleshooting and FAQ</div>
    <div class="row" style="align-items:center"><h1 class="h1" id="page-title" tabindex="-1" style="flex:1">Troubleshooting and FAQ</h1><img src="assets-3b8ff24439/img/ill/traffic-cone.svg" alt="" aria-hidden="true" style="height:84px;width:auto"></div>
    <div class="grid2" style="margin-top:18px;align-items:start"><section id="sec-trouble" aria-labelledby="tr-h"><h2 class="h3" id="tr-h" style="margin-bottom:10px">Troubleshooting</h2><div id="t-list">${tHtml()}</div></section>
    <section id="sec-faq" aria-labelledby="fq-h"><div class="row" style="margin-bottom:10px"><h2 class="h3" id="fq-h" style="flex:1">FAQ</h2></div><div class="filters" role="group" aria-label="Filter questions" style="margin-top:0">${groups.map(g => `<button class="chip" aria-pressed="${g === mf}" data-mf="${g}">${esc(g)}</button>`).join('')}</div><div id="f-list" aria-live="polite">${fHtml()}</div>
    <p class="small" style="margin-top:12px">Still stuck? ${docLink(DOCS, 'Official Mark docs')} · or ask your Customer Success Manager.</p></section></div></div>`,
    mount(root) {
      root.addEventListener('click', e => {
        const t = e.target.closest('[data-t]'); if (t) { const i = +t.dataset.t; openT[i] = !openT[i]; root.querySelector('#t-list').innerHTML = tHtml(); root.querySelector(`[data-t="${i}"]`).focus(); }
        const f = e.target.closest('[data-f]'); if (f) { const i = +f.dataset.f; openF[i] = !openF[i]; root.querySelector('#f-list').innerHTML = fHtml(); root.querySelector(`[data-f="${i}"]`).focus(); }
        const m = e.target.closest('[data-mf]'); if (m) { mf = m.dataset.mf; root.querySelectorAll('[data-mf]').forEach(b => b.setAttribute('aria-pressed', String(b === m))); root.querySelector('#f-list').innerHTML = fHtml(); }
      });
      if (scrollTo) setTimeout(() => root.querySelector('#' + scrollTo)?.scrollIntoView({ block: 'start' }), 30);
    } };
}

/* ---------- Facilitator page (S34 intro) ---------- */
export function facilitatorPage() {
  const on = store.get().facilitator;
  return { title: 'Facilitator mode', html: `<div class="page"><div class="crumb"><a href="#/">Home</a> / Facilitator mode</div><h1 class="h1" id="page-title" tabindex="-1">Run this workshop live</h1><p class="lead" style="max-width:700px;margin-top:10px">Facilitator mode turns every lesson into a presenter view, so FDEs and CSMs can run the same content with a customer team. Attendees can revisit exactly what was shown, at the same links.</p>
    <div class="row" style="margin-top:16px"><button class="btn" data-fac-toggle role="switch" aria-checked="${on}"><span class="switch" aria-hidden="true"></span> ${on ? 'Facilitator mode is on' : 'Turn on Facilitator mode'}</button><a class="btn secondary" href="#/primer?present=1">${ui('present', 18)} Start presenting the Primer</a></div>
    <div class="grid3" style="margin-top:24px">${[['Presenter view', 'Larger type, side menus hidden, one lesson section at a time. Use the arrow keys or the Prev and Next buttons.'], ['Facilitator notes', 'Talking points, demo cues, questions for the room and common questions, beside every lesson. Hidden from learners.'], ['Hidden answers', 'Knowledge checks record the room\'s answer but keep it hidden until you turn on "Reveal answers to the room".'], ['Timer and agenda', 'A timer against each lesson\'s planned time, and the agenda with completed modules.'], ['Same URLs', 'Add ?present=1 to any lesson link to open it straight in presenter view.'], ['Leave-behinds', 'Share the planning worksheet, prompt checklist and best-practices one-pager after the session.']].map(([t, d]) => `<div class="soft"><div class="h4">${t}</div><p class="small" style="margin:6px 0 0">${d}</p></div>`).join('')}</div>
    <h2 class="h3" style="margin:28px 0 10px">Half-day agenda</h2><div class="table-wrap"><table class="t"><thead><tr><th>Part</th><th>Time</th><th>Hands-on</th></tr></thead><tbody>${PATH_ORDER.map(id => { const m = modById(id); return `<tr><td><a href="#${id === 'primer' ? '/primer' : '/' + id}">${esc(m.label)} · ${esc(m.title)}</a></td><td>${m.mins} min</td><td>${m.lab ? esc(m.lab.title.replace('Try it in Mark: ', '')) + ` (${m.lab.mins} min)` : '–'}</td></tr>`; }).join('')}<tr><td><a href="#/wrap-up">Wrap-up</a></td><td>5 min</td><td>Confidence check</td></tr></tbody></table></div></div>`,
    mount(root) { root.addEventListener('click', e => { if (e.target.closest('[data-fac-toggle]')) { document.dispatchEvent(new CustomEvent('mabw:toggle-facilitator')); } }); } };
}

export function notFound() {
  return { title: 'Page not found', html: `<div class="page" style="text-align:center;padding-top:60px"><img src="assets-3b8ff24439/img/ill/traffic-cone.svg" alt="" aria-hidden="true" style="height:140px;width:auto;margin:0 auto 20px"><h1 class="h1" id="page-title" tabindex="-1">We couldn't find that page</h1><p class="lead" style="margin:14px auto 22px;max-width:520px">The link may be out of date. Try the workshop overview or search.</p><div class="row" style="justify-content:center"><a class="btn" href="#/workshop">Workshop overview</a><a class="btn secondary" href="#/">Home</a></div></div>` };
}
export { LESSONS, lessonRoute };
