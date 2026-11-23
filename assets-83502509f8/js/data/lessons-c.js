import { comp, tip, mistakes, thinking, misconception, think, tech, example, term, callout, accuracy, ui } from '../core.js';
const D = 'https://docs.optimizely.com/agent-platform/docs/';

export const LESSONS_C = {
  'm5/what-working-means': () => ({
    learn: ['Why wording varies between runs', 'What should stay consistent', 'Why running more doesn\'t improve an agent'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Consistent, not identical', html: `<p>AI models vary their wording between runs. What should stay the same is the <b>structure</b>, the <b>rules</b> and the <b>quality</b>. And an agent doesn't get better by being run more often. It improves when you change its instructions, tools or settings.</p>` },
      { id: 'show', kicker: 'Show', title: 'Same input, three runs', html: `<div class="grid3">${[['Run 1', 'Plan, test and launch campaigns faster in one AI-powered workspace. See how teams ship more.', 142], ['Run 2', 'One workspace to plan, test and launch every campaign, with AI built in. Start your free tour.', 139], ['Run 3', 'Launch campaigns faster with AI-powered planning and testing in one place. See it in action.', 137]].map(([r, t, c]) => `<div class="card"><div class="lbl">${r}</div><p class="small" style="margin:6px 0">${t}</p><span class="chip">${c} characters</span></div>`).join('')}</div>` },
      { id: 'check', kicker: 'Check', title: 'Is this consistent?', html: comp('quiz', { id: 'm5/consistency', inline: true, questions: [{ q: 'The three runs above use different words. Are they consistent?', options: [{ t: 'Yes', ok: true, why: 'Same structure, every option under 155 characters, no superlatives, each ends with a call to action. Different words are expected.' }, { t: 'No', ok: false, why: 'Different words are normal. They follow the same rules and format, so they\'re consistent.' }] }] }) },
      { id: 'mis', kicker: 'Correct a belief', title: 'Two misconceptions', html: `${misconception('The same input should give the exact same words.', 'Wording varies; structure, rules and quality should stay consistent.')}<div style="height:10px"></div>${misconception('It learns from use.', 'Quality only changes when you edit the agent.')}` }
    ],
    notes: { talk: ['Set expectations: wording varies.'], demo: 'Run the same input twice in Mark.', ask: '"What would make you call a result inconsistent?"', questions: [] },
    related: [{ route: '/m5/five-test-cases', title: 'The five test cases' }],
    docs: [{ href: D + 'test-a-specialized-agent', text: 'Test a specialized agent' }]
  }),

  'm5/test-run-panel': () => ({
    learn: ['How to run a test', 'What the results show', 'How Execution Memory helps'],
    blocks: [
      { id: 'explore', kicker: 'Explore', title: 'The Test Run panel', html: `<p>This replica shows a completed test for the example agent. Click any numbered area to learn what it does.</p>${comp('testrun', {})}` },
      { id: 'facts', kicker: 'Good to know', title: 'Facts about test runs', html: `${callout('mistakes', '<b>Good to know:</b> test runs use credits and appear in logs. Running more doesn\'t improve the agent; editing does.', 'info')}<div style="height:10px"></div>${tip('When something\'s off, open Execution Memory first. It shows <i>why</i>, for example a tool that was never called.')}` }
    ],
    notes: { talk: ['Execution Memory is the debugging view.'], demo: 'Run a real test and expand Execution Memory.', ask: '"What would you look for first in a bad result?"', questions: [] },
    related: [{ route: '/reference/builder?surface=test-run', title: 'Reference: Test Run panel' }],
    docs: [{ href: D + 'test-a-specialized-agent', text: 'Test a specialized agent' }]
  }),

  'm5/five-test-cases': () => ({
    learn: ['The five kinds of input to test', 'What each one checks', 'How many runs is enough'],
    blocks: [
      { id: 'explore', kicker: 'Explore', title: 'Flip each card', html: `<p>Test with five kinds of input before you share. Flip each card to see a sample result for the example agent.</p>${comp('flip', { cards: [
        { n: 1, t: 'Typical', tryit: 'A normal product page', checks: 'Basic quality', out: 'Option 1: Plan, test and launch campaigns faster… (142 characters). Recommendation: Option 1.', verdict: 'Pass', ok: true },
        { n: 2, t: 'Second typical', tryit: 'A different product page', checks: 'Consistency', out: 'Same table format, 3 options, all under 155 characters.', verdict: 'Pass', ok: true },
        { n: 3, t: 'Large or complex', tryit: 'A very long page', checks: 'Copes with more', out: 'One option is 171 characters.', verdict: 'Fails a rule: go to Diagnose and fix', ok: false },
        { n: 4, t: 'Minimum', tryit: 'URL only, no keyword', checks: 'Sensible without extras', out: 'Keyword inferred: "campaign planning". Table complete.', verdict: 'Pass', ok: true },
        { n: 5, t: 'Broken', tryit: 'A URL that doesn\'t exist', checks: 'Says so and stops', out: 'I couldn\'t open the page (404 Not Found). Please check the URL and try again.', verdict: 'Pass: failed gracefully', ok: true }
      ] })}` },
      { id: 'tips', kicker: 'From the field', title: 'Tips', html: `${tip('Case 5 is the one that saves you from embarrassment. Never skip it.')}<div style="height:10px"></div>${callout('info', '5–10 purposeful runs is plenty. Each run uses credits, so change something before you re-run.')}` }
    ],
    notes: { talk: ['Five kinds of input; case 5 matters most.'], demo: 'Run case 5 live with a broken URL.', ask: '"What\'s the broken input for your agent?"', questions: [] },
    related: [{ route: '/m5/lab', title: 'Lab: run the five test cases' }],
    docs: [{ href: D + 'test-a-specialized-agent', text: 'Test a specialized agent' }]
  }),

  'm5/diagnose-and-fix': () => ({
    learn: ['How to find the likely cause of a problem', 'Which prompt section to change', 'The one-change rule'],
    blocks: [
      { id: 'explore', kicker: 'Explore', title: 'Diagnose this output', html: `${comp('diagnose', { scenarios: [
        { title: 'Invented facts', output: '"<mark>Our award-winning platform, trusted by 10,000 brands</mark>, helps teams plan campaigns faster…"', context: 'The page mentions neither awards nor customer numbers.', options: [{ t: 'The inference level is too low', ok: false, why: 'Inference level affects depth, not whether facts are invented.' }, { t: 'The prompt doesn\'t say to use only the page\'s information, and has no failure rule', ok: true, why: 'Correct.' }, { t: 'The output type should be JSON', ok: false, why: 'The format isn\'t the problem here.' }], fix: 'L (Rules): "Only use information from the page. Never invent facts, awards or numbers."', check: 'The web page reading tool is added, and Execution Memory shows it ran.' },
        { title: 'Wrong format', output: 'Three paragraphs of text, with no table and no character counts.', context: 'The plan asks for a 4-column table.', options: [{ t: 'The Result section doesn\'t describe the format precisely', ok: true, why: 'Correct.' }, { t: 'A tool is missing', ok: false, why: 'Tools affect data, not layout.' }, { t: 'The agent needs to be multi-turn', ok: false, why: 'Interaction mode doesn\'t control format.' }], fix: 'R (Result): describe the exact columns, and add an example of the table.', check: 'Re-run the same input and compare.' },
        { title: 'A skipped step', output: 'Three options, one at 171 characters.', context: 'The plan includes "check the length and rewrite any option over 155".', options: [{ t: 'Steps aren\'t numbered, or the check step is buried', ok: true, why: 'Correct.' }, { t: 'The passing score is too low', ok: false, why: 'Passing score affects evaluation, not how the agent works.' }, { t: 'The LLM provider is wrong', ok: false, why: 'Fix the prompt before changing models.' }], fix: 'A (Action): number every step and make "check the length" its own step at the end.', check: 'Test case 3 (large input) again.' },
        { title: 'An ignored rule', output: '"The best way to plan campaigns, period."', context: 'The rules say never use superlatives.', options: [{ t: 'The rule is only implied, or buried in a paragraph', ok: true, why: 'Correct.' }, { t: 'The agent needs more tools', ok: false, why: 'Tools don\'t affect word choice.' }, { t: 'Test runs are too short', ok: false, why: 'Run length isn\'t the issue.' }], fix: 'L (Rules): state it plainly ("Never use \'best\' or \'#1\'") and add an "avoid" example.', check: 'Re-run with the same input.' },
        { title: 'Too shallow', output: 'Generic options that could describe any product.', context: 'The page has a clear, specific benefit.', options: [{ t: 'The task needs a bit more reasoning, or more specific steps', ok: true, why: 'Correct.' }, { t: 'There are too many variables', ok: false, why: 'Two variables is fine.' }, { t: 'Private executions is on', ok: false, why: 'Privacy settings don\'t affect quality.' }], fix: 'First, add a step: "Identify the single most specific benefit." If still shallow, raise inference one level (Standard to Balanced).', check: 'Compare with a previous run.' },
        { title: 'Varies too much', output: 'Run 1 is a table, run 2 is a list, run 3 has 5 options.', context: 'Same input every time.', options: [{ t: 'Rules and output format aren\'t specific enough', ok: true, why: 'Correct.' }, { t: 'This is normal variation', ok: false, why: 'Wording can vary; structure shouldn\'t.' }, { t: 'The Id is wrong', ok: false, why: 'The Id only affects how people run it.' }], fix: 'L and R: add specific rules ("exactly 3 options") and one more example.', check: 'Run the same input 3 times.' }
      ] })}` },
      { id: 'reference', kicker: 'Reference', title: 'Symptom → fix', html: `<div class="table-wrap"><table class="t"><thead><tr><th>If the output…</th><th>Try this</th></tr></thead><tbody>
<tr><td>Is in the wrong format</td><td>Describe the exact format in Result, and add an example</td></tr>
<tr><td>Contains made-up information</td><td>Add "only use information from…" and a failure rule. Check the tool is added</td></tr>
<tr><td>Skips a step</td><td>Number the steps and keep them in order</td></tr>
<tr><td>Ignores a rule</td><td>Move it into Rules, state it plainly, add an "avoid" example</td></tr>
<tr><td>Is too shallow</td><td>Add a specific step, then raise inference one level</td></tr>
<tr><td>Is slow or uses many credits</td><td>Lower inference, remove unused tools, shorten files</td></tr>
<tr><td>Varies too much</td><td>More specific rules and one more example</td></tr>
<tr><td>Uses the wrong item for an ID</td><td>Write <code>Task: [[task_id]]</code>, not <code>[[task_id]]</code></td></tr>
<tr><td>Ignores brand voice (with an org skill attached)</td><td>Insert the skill directly with <code>/</code></td></tr></tbody></table></div>${callout('thinking', '<b>The one-change rule:</b> change one thing, re-run the same input, compare.', 'info')}` }
    ],
    notes: { talk: ['Diagnose, change one thing, re-run.'], demo: 'Fix one real problem live.', ask: '"What would you change first?"', questions: [] },
    related: [{ route: '/reference/troubleshooting', title: 'Troubleshooting' }],
    docs: [{ href: D + 'specialized-agent-logs', text: 'Specialized agent logs' }]
  }),

  'm5/versions': () => ({
    learn: ['How versions work', 'How to restore', 'What "good enough" means'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Every save is a version', html: `<p>Every save creates a version. If a change makes things worse, restore an earlier one. You can also duplicate a version into a new agent to experiment safely.</p>` },
      { id: 'explore', kicker: 'Explore', title: 'Try restoring a version', html: `${comp('versions', { versions: [
        { v: 'v1', d: 'Created', t: 'Mon 10:02' }, { v: 'v2', d: 'Added failure rule', t: 'Mon 10:20' }, { v: 'v3', d: 'Raised inference to Balanced', t: 'Mon 10:41' }, { v: 'v4', d: 'Back to Standard + new example', t: 'Mon 11:05' }
      ] })}${callout('mistakes', '<b>Good to know:</b> re-upload attached files after restoring a version.', 'info')}` },
      { id: 'enough', kicker: 'Remember', title: 'When is it "good enough"?', html: `<div class="green"><p style="margin:0 0 6px">✓ Cases 1–4 pass &nbsp; ✓ Case 5 fails gracefully &nbsp; ✓ Structure and quality are consistent</p><p style="margin:0"><b>80% right with a human check is a real win for a first agent.</b></p></div><div style="height:10px"></div>${thinking('Once it\'s shared, I can\'t change it.', 'You can edit, restore and change access at any time.')}` }
    ],
    notes: { talk: ['Versions remove the fear of breaking things.'], demo: 'Open version history in Mark.', ask: '"What would make you restore a version?"', questions: [] },
    related: [{ route: '/reference/builder?surface=versions', title: 'Reference: Version history' }],
    docs: [{ href: D + 'specialized-agent-versions', text: 'Specialized agent versions' }]
  }),

  'm6/quality-tab': () => ({
    learn: ['The three parts of the Quality tab', 'What each one does'],
    blocks: [
      { id: 'explore', kicker: 'Explore', title: 'Tour of the Quality tab', html: `<p>Switch between the three parts and click the numbered areas.</p>${comp('quality', {})}` },
      { id: 'summary', kicker: 'Summary', title: 'In one line each', html: `<div class="grid3"><div class="soft"><b>${term('output-evaluation', 'Output Evaluation')}</b><p class="small" style="margin:6px 0 0">Scores every run from 0 to 100% against your criteria and examples.</p></div><div class="soft"><b>${term('execution-guardrails', 'Execution Guardrails')}</b><p class="small" style="margin:6px 0 0">Learns what normal runs look like, then flags or stops unusual ones.</p></div><div class="soft"><b>${term('execution-advisor', 'Execution Advisor')}</b><p class="small" style="margin:6px 0 0">Steps in during runs to recover, retry failed tool calls and review sensitive ones.</p></div></div>` }
    ],
    notes: { talk: ['Three parts; Output Evaluation is where you spend setup time.'], demo: 'Open the Quality tab of a real agent.', ask: '"How would you know your agent got worse?"', questions: [] },
    related: [{ route: '/reference/builder?surface=quality', title: 'Reference: Quality tab' }],
    docs: [{ href: D + 'quality-tab-overview', text: 'Quality tab overview' }]
  }),

  'm6/good-criteria': () => ({
    learn: ['What a good criterion looks like', 'How to turn rules into criteria', 'Sensible starting values'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Criteria two people agree on', html: `<p>A criterion is a statement an AI judge uses to score each run. Good criteria are ones two people would agree on. You can add up to 10 per agent; start with 3–5. A built-in rubric (accuracy, completeness, format consistency, usefulness) also applies, and your criteria take priority if they conflict.</p>` },
      { id: 'explore', kicker: 'Explore', title: 'Sort: good criterion or too vague?', html: `${comp('sorter', { id: 'm6-criteria', instructions: 'Select a criterion, then choose a column. You can also drag.', buckets: [{ key: 'good', title: 'Good criterion', sub: 'Anyone would agree on a pass' }, { key: 'vague', title: 'Too vague', sub: 'People could disagree' }], items: [
        { t: 'Includes exactly 3 options', b: 'good', why: 'Countable.' },
        { t: 'No option exceeds 155 characters', b: 'good', why: 'Measurable.' },
        { t: 'Says what failed if the page can\'t be read', b: 'good', why: 'Clear pass or fail.' },
        { t: 'Is high quality', b: 'vague', why: 'Rewrite with specific rules, like length and format.' },
        { t: 'Sounds on-brand', b: 'vague', why: 'Rewrite: "No superlatives; ends with a benefit."' },
        { t: 'Is helpful', b: 'vague', why: 'Rewrite: "Recommends one option and explains why."' },
        { t: 'The output includes a table with the four required columns', b: 'good', why: 'Checkable at a glance.' },
        { t: 'Is engaging', b: 'vague', why: 'Rewrite: "Each option leads with a different benefit."' }
      ] })}` },
      { id: 'show', kicker: 'Show', title: 'From rules to criteria', html: `<div class="table-wrap"><table class="t"><thead><tr><th>Rule in the plan</th><th>Testable criterion</th></tr></thead><tbody><tr><td>Is short enough</td><td>Each meta description is 155 characters or fewer.</td></tr><tr><td>Avoids hype</td><td>No description contains superlatives such as "best" or "#1".</td></tr><tr><td>Uses the keyword</td><td>If a target keyword was provided, every description includes it.</td></tr><tr><td>If it can't, stop</td><td>If the page could not be read, the output says so and contains no invented descriptions.</td></tr></tbody></table></div>` },
      { id: 'tips', kicker: 'From the field', title: 'Tips', html: `${tip('If two people could disagree about whether a run passed, the criterion is too vague.')}<div style="height:10px"></div>${callout('info', 'Start with 3–5 criteria and an 80% passing score (you can choose 75–95%). Scores come from an AI judge, so spot-check runs too.')}` }
    ],
    notes: { talk: ['Criteria come straight from your rules.'], demo: 'Add a criterion in the Quality tab.', ask: '"What\'s one criterion for your agent?"', questions: [] },
    related: [{ route: '/m1/steps-and-rules', title: 'Module 1: Steps and rules' }],
    docs: [{ href: D + 'configure-output-evaluation', text: 'Configure Output Evaluation' }]
  }),

  'm6/how-guardrails-learn': () => ({
    learn: ['The three guardrail modes', 'The default settings', 'How to keep the baseline clean'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'A baseline from successful runs', html: `<p>${term('execution-guardrails', 'Execution Guardrails')} build a baseline from successful runs, then flag, and later can stop, runs that look very different. Drag the marker to see each mode.</p>` },
      { id: 'explore', kicker: 'Explore', title: 'Learning, Watching, Enforcing', html: comp('guardrails', {}) },
      { id: 'facts', kicker: 'Good to know', title: 'Defaults and baseline', html: `<div class="grid2"><div class="soft"><b>Defaults</b><p class="small" style="margin:6px 0 0">Sensitivity 1 (Lenient) on a 1–5 scale. Automatically stop runs that breach guardrails: On (it only acts in Enforcing mode).</p></div><div class="soft"><b>Keep the baseline clean</b><p class="small" style="margin:6px 0 0">Only successful runs count. Reject messy test runs in the agent's Logs. New versions inherit the baseline.</p></div></div><div style="height:10px"></div>${accuracy('guardrails watch <i>how</i> a run behaves, not whether the answer is right. That\'s Output Evaluation\'s job.')}${think('A smoke alarm that first learns what normal looks like in your kitchen.', 'It only notices unusual behavior. It can\'t tell whether an answer is right.')}` }
    ],
    notes: { talk: ['20 learning, 30 watching, then enforcing.'], demo: 'Open Execution Guardrails on an agent with runs.', ask: '"Why reject test runs from the baseline?"', questions: [] },
    related: [{ route: '/reference/glossary?term=execution-guardrails', title: 'Glossary: Execution Guardrails' }],
    docs: [{ href: D + 'configure-execution-guardrails', text: 'Configure Execution Guardrails' }]
  }),

  'm6/input-guardrails-and-privacy': () => ({
    learn: ['What input guardrails do', 'What private executions do', 'When you need them'],
    blocks: [
      { id: 'input', kicker: 'Explain', title: 'Input guardrails', html: `<p>${term('input-guardrails', 'Input guardrails')} block certain requests before the agent starts, for example "Block requests for legal advice". You write the rule in plain English, then train it, test it with sample messages, and activate it for your whole instance or one agent.</p><div class="row"><span class="chip">1 Write the rule</span>${ui('arrow', 16)}<span class="chip">2 Train</span>${ui('arrow', 16)}<span class="chip">3 Test</span>${ui('arrow', 16)}<span class="chip g">4 Activate</span></div><p class="small" style="margin-top:10px">Optional for an internal first agent. Consider it if the agent handles sensitive topics. Your admin may need to help.</p>` },
      { id: 'private', kicker: 'Explain', title: 'Private executions', html: `<p>When ${term('private-executions', 'Private executions')} is on, only the person who ran the agent can see that run's content. Others, including admins, can see that it ran, but not what was in it. Turn it on if people will paste sensitive information into the agent.</p>` },
      { id: 'check', kicker: 'Check', title: 'Which one fits?', html: comp('quiz', { id: 'm6/which-fits', inline: true, questions: [{ q: 'People will paste customer emails into your agent. What should you consider?', options: [{ t: 'Private executions', ok: true, why: 'It keeps each run\'s content visible only to the person who ran it.' }, { t: 'A higher inference level', ok: false, why: 'Inference level affects reasoning depth, not privacy.' }, { t: 'Multi-turn', ok: false, why: 'Interaction mode doesn\'t affect who can see runs.' }] }] }) }
    ],
    notes: { talk: ['Both are optional for a first internal agent.'], demo: '', ask: '"Does your agent handle anything sensitive?"', questions: ['"Can Agent Builders create input guardrails?" Check with your admin.'] },
    related: [{ route: '/reference/builder?field=private-executions', title: 'Field: Private executions' }],
    docs: [{ href: D + 'input-guardrails-overview', text: 'Input guardrails overview' }]
  }),

  'm7/visibility-and-access': () => ({
    learn: ['Private, Shared and Organization', 'Access levels', 'How to share safely'],
    blocks: [
      { id: 'explore', kicker: 'Explore', title: 'Try the Share dialog', html: `<p>This simulator works like Mark's Share dialog. Nothing is actually shared.</p>${comp('share', {})}` },
      { id: 'facts', kicker: 'Good to know', title: 'Facts', html: `<ul><li>New agents are <b>Private</b> by default.</li><li>Each agent has exactly one <b>Owner</b>. Only the owner can grant Can manage.</li><li><b>Copy link</b> respects access settings: if someone's access is removed, the link stops working for them.</li></ul>${tip('Give most people Can view. Can edit lets them change your prompt.')}` }
    ],
    notes: { talk: ['Private by default; Can view for most.'], demo: 'Open the Share dialog in Mark.', ask: '"Who would be in your pilot group?"', questions: [] },
    related: [{ route: '/reference/builder?surface=share', title: 'Reference: Share dialog' }],
    docs: [{ href: D + 'share-agents-and-manage-visibility', text: 'Share agents and manage visibility' }]
  }),

  'm7/soft-launch': () => ({
    learn: ['The soft launch playbook', 'How to collect feedback', 'How to share widely'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Start small', html: `${thinking('What if it embarrasses me in front of everyone?', 'That\'s why you start with a soft launch: 2–3 friendly colleagues for a few days. They\'ll catch anything you missed, privately.')}` },
      { id: 'explore', kicker: 'Explore', title: 'The playbook', html: `${comp('stepper', { steps: [
        { t: 'Pilot', d: 'Share with 2–3 friendly colleagues with Can view.', more: 'Open the agent → Share → add people → Can view → Send. The badge changes from Private to Shared.' },
        { t: 'Collect feedback', d: 'Ask for honest feedback for 3–5 days.', more: 'Use the pilot feedback checklist. Ask what they typed, what they got, and what they expected.' },
        { t: 'Fix', d: 'One change at a time, then re-test.', more: 'Use your 5 test cases again after each change.' },
        { t: 'Share org-wide', d: 'General access → Anyone in your organization → Can view.', more: 'The badge changes to Organization.' },
        { t: 'Make it findable', d: 'Keep Trigger from Chat on and polish the Description.', more: 'The Description is what people and Mark read to decide whether to use it.' },
        { t: 'Watch it', d: 'Get notified about changes, failures and guardrail alerts.', more: 'Use Watch on the agent.' }
      ] })}<div class="row" style="margin-top:12px"><a class="btn sm secondary" href="assets-83502509f8/downloads/pilot-feedback-checklist.pdf" download>${ui('dl', 16)} Pilot feedback checklist (PDF)</a></div>` }
    ],
    notes: { talk: ['Pilot first.'], demo: '', ask: '"How long would your pilot be?"', questions: [] },
    related: [{ route: '/m7/lab', title: 'Lab: share with one colleague' }],
    docs: [{ href: D + 'share-agents-and-manage-visibility', text: 'Share agents' }]
  }),

  'm7/usage-guide': () => ({
    learn: ['What a usage guide includes', 'Why each part matters'],
    blocks: [
      { id: 'show', kicker: 'Show', title: 'An annotated usage guide', html: `${comp('annotated', { title: 'Example usage guide', body: `<div class="card"><p style="margin:0 0 6px"><b>New agent: Meta Description Writer</b> <button type="button" class="pin" data-pin="1">1</button></p><p class="small" style="margin:0 0 4px"><b>What it does:</b> writes 3 search-friendly meta descriptions for any product page, in our brand voice. <button type="button" class="pin" data-pin="2">2</button></p><p class="small" style="margin:0 0 4px"><b>How to use it:</b> in Mark chat, type <code>@meta_description_writer</code>, then give it the page URL (and a keyword, if you have one). <button type="button" class="pin" data-pin="3">3</button></p><p class="small" style="margin:0 0 4px"><b>What you'll get:</b> a table with 3 options and character counts, plus a recommendation.</p><p class="small" style="margin:0 0 4px"><b>Limits:</b> it can't read pages behind a login. Always review the final pick before publishing. <button type="button" class="pin" data-pin="4">4</button></p><p class="small" style="margin:0"><b>Feedback:</b> tell the owner so the instructions can be improved. <button type="button" class="pin" data-pin="5">5</button></p></div>`, notes: { 1: 'A clear title with the agent\'s name, so people can search for it later.', 2: 'One sentence on what it does. Lead with the verb.', 3: 'Exactly what to type. Most people won\'t guess the @id.', 4: 'Stating limits builds trust and prevents misuse.', 5: 'A feedback route. It\'s how the agent gets better, because people tell you what to change.' } })}<p class="small">A sample to learn from. Write your own in your team's usual tone.</p>` }
    ],
    notes: { talk: ['Five parts; limits build trust.'], demo: '', ask: '"Where will you post yours?"', questions: [] },
    related: [{ route: '/m7/driving-adoption', title: 'Driving adoption' }],
    docs: [{ href: D + 'agent-library-overview', text: 'Agent Library overview' }]
  }),

  'm7/driving-adoption': () => ({
    learn: ['Where to announce', 'What success looks like'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Post where your team already talks', html: `<p>Post the usage guide in your team channel, newsletter or stand-up. Include one real example of the output: seeing a result beats any description.</p>` },
      { id: 'finish', kicker: 'Remember', title: 'The real finish line', html: `<div class="green"><p style="margin:0;font-size:18px"><b>A colleague used your agent without asking you anything.</b></p></div><div style="height:10px"></div>${tip('Keep Impact filled in. After a month, multiply runs by minutes saved, and you have your value story.')}` }
    ],
    notes: { talk: ['Adoption is the goal, not launch.'], demo: '', ask: '"How will you know it\'s working?"', questions: [] },
    related: [{ route: '/wrap-up', title: 'Wrap-up' }],
    docs: [{ href: D + 'agent-impact-reporting', text: 'Agent impact reporting' }]
  })
};

export const LABS = {
  m3: { intro: 'Build the Meta Description Writer in your own instance.', steps: [
    { t: 'Open the builder', d: 'Agents → Your Agents → Add Agent → Specialized Agent' },
    { t: 'Fill in the 7 Must fields', d: 'Use the example values on this page (or lesson 3.2 for the prompt).' },
    { t: 'Leave everything else at its default', d: 'Check the First-agent view in lesson 3.1 if unsure.' },
    { t: 'Save', d: 'Check the Private badge appears.' },
    { t: 'Optional: Test Run once', d: 'Try a real product page URL.' }
  ], values: [['Name', 'Meta Description Writer'], ['Id', 'meta_description_writer'], ['Description', 'Writes 3 search-friendly meta descriptions for a product page.'], ['Variables', 'url (String, required) · target_keyword (String)'], ['Tools', 'A web page reading tool'], ['Output', 'Text'], ['Prompt', 'See lesson 3.2'], ['Inference Level', 'Standard'], ['Impact', '20 minutes']],
    self: ['Saved with a Private badge', 'No "Not in use" warnings', 'Tool added under Tools', 'Impact filled in'], alt: { route: '/reference/examples', text: 'Prefer no tools? Build the Meeting Notes Summarizer instead.' } },
  m5: { intro: 'Run the five test cases on your agent.', steps: [
    { t: 'Prepare five inputs', d: 'Typical, second typical, large, minimum (required only) and broken.' },
    { t: 'Run each one from Test Run', d: 'Read each result against your rules.' },
    { t: 'Open Execution Memory on any failure', d: 'Find out why it failed.' },
    { t: 'Make one change', d: 'Use the symptom → fix table in lesson 5.4.' },
    { t: 'Re-run the same input and compare', d: 'Save if it improved; restore if it didn\'t.' }
  ], values: [['Case 1', 'A normal product page'], ['Case 2', 'A different product page'], ['Case 3', 'A very long page'], ['Case 4', 'URL only, no keyword'], ['Case 5', 'A URL that doesn\'t exist']],
    self: ['Cases 1–4 pass', 'Case 5 fails gracefully', 'You changed one thing at a time'] },
  m6: { intro: 'Add quality checks to your agent.', steps: [
    { t: 'Open the Quality tab', d: 'Agent → Quality → Output Evaluation' },
    { t: 'Add 3 criteria', d: 'Turn your plan\'s rules into testable statements.' },
    { t: 'Save 2 examples', d: 'Use your best test runs.' },
    { t: 'Set the passing score to 80%', d: 'You can raise it later.' },
    { t: 'Look at Execution Guardrails', d: 'Leave the defaults. Note which mode it\'s in.' }
  ], values: [['Criterion 1', 'Each meta description is 155 characters or fewer.'], ['Criterion 2', 'No description contains superlatives such as "best" or "#1".'], ['Criterion 3', 'The output includes a table with the four required columns.'], ['Passing score', '80%']],
    self: ['3 criteria added', '2 examples saved', 'Passing score set'] },
  m7: { intro: 'Share your agent with one colleague.', steps: [
    { t: 'Open the Share dialog', d: 'Agent → Share' },
    { t: 'Add one colleague with Can view', d: 'Click Send.' },
    { t: 'Check the badge says Shared', d: 'It was Private before.' },
    { t: 'Send them a usage guide', d: 'Use lesson 7.3 as a model.' },
    { t: 'Ask for feedback in 3–5 days', d: 'Use the pilot feedback checklist.' }
  ], values: [['Access', 'Can view'], ['General access', 'Only invited users'], ['Badge', 'Shared']],
    self: ['Shared with one colleague', 'Usage guide sent', 'Feedback date set'] }
};
