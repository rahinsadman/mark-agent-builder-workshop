import { comp, tip, mistakes, thinking, misconception, think, tech, example, term, callout, accuracy, ui } from '../core.js';
import { PRIMER_CHECK } from './curriculum.js';
const D = 'https://docs.optimizely.com/agent-platform/docs/';

export const LESSONS_A = {
  'primer/how-agents-work': () => ({
    learn: ['What a specialized agent is', 'The four parts of every agent', 'Three facts that prevent most first-agent mistakes'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'One sentence to remember', html: `<p class="lead">A ${term('specialized-agent', 'specialized agent')} is a saved set of instructions that Mark follows every time someone runs it. You decide what people give it, which tools it can use, and what it gives back.</p><p>Specialized agents do <b>one</b> task. Later, ${term('workflow-agent', 'workflow agents')} can connect several of them, and you'll see how in Module 4.</p>` },
      { id: 'explore', kicker: 'Explore', title: 'The four parts of every agent', html: `<p>Click each part to see what it does, where it lives in the Mark agent builder, and how it looks in the example agent.</p>${comp('diagram', { nodes: [
        { key: 'inputs', kicker: 'Inputs', label: 'Variables', where: 'Variables section of the builder', plain: 'What the person provides each time they run the agent, like a page URL or pasted text.', example: 'url (required) and target_keyword (optional)', whatIf: { q: 'What happens if the agent has no variables?', a: 'It can still run, but it does the same thing every time. Most useful agents take at least one input.' } },
        { key: 'instructions', kicker: 'Instructions', label: 'Prompt template', where: 'Prompt Template, plus optional skills and files', plain: 'The written instructions Mark follows on every run. If something isn\'t written down, the agent will guess or leave it out.', example: 'Read the page, find the main benefit, write 3 options, check the length.', whatIf: { q: 'What happens if the instructions are vague?', a: 'Results vary a lot between runs, and the agent fills gaps by guessing.' } },
        { key: 'tools', kicker: 'Tools', label: 'Tools', where: 'Tools section of the builder', plain: 'Actions the agent can take, like reading a web page. It can only use the tools you add.', example: 'A web page reading tool', whatIf: { q: 'What happens if the Tools part is empty?', a: 'The agent can\'t read the page. It may say so, or guess, unless the instructions say what to do when it can\'t.' } },
        { key: 'output', kicker: 'Output', label: 'Text or JSON', where: 'Output section of the builder', plain: 'The format of the result. Describe it precisely in the prompt, too.', example: 'A table with 3 options and character counts, then one recommendation', whatIf: { q: 'What happens if the output isn\'t described?', a: 'The format changes from run to run, which makes results hard to use and hard to test.' } }
      ] })}` },
      { id: 'facts', kicker: 'Remember', title: 'Three facts', html: `<div class="grid3"><div class="green"><b>1. It only does what the instructions say.</b><p class="small" style="margin:6px 0 0">If something isn't written down, the agent will guess or leave it out.</p></div><div class="green"><b>2. It only uses the tools you add.</b><p class="small" style="margin:6px 0 0">Unless you turn on automatic tool prediction.</p></div><div class="green"><b>3. It doesn't improve by itself.</b><p class="small" style="margin:6px 0 0">Single-turn agents don't remember earlier runs. You improve it by editing it.</p></div></div>` },
      { id: 'where', kicker: 'Context', title: 'Where agents run', html: `<p>People run specialized agents by typing the agent's <code>@id</code> in Mark chat, by choosing it from the ${term('agent-library', 'Agent Library')}, and later inside workflow agents.</p>${think('A saved recipe card: ingredients (inputs), method (instructions), equipment (tools), and how to serve it (output).', 'A recipe gives the same result every time. An agent\'s wording varies a little between runs.')}` },
      { id: 'check', kicker: 'Check', title: 'Quick check', html: comp('quiz', { id: 'primer/quick', questions: PRIMER_CHECK, inline: true }) }
    ],
    notes: { talk: ['Lead with the one-sentence definition.', 'The three facts prevent most first-agent mistakes. Spend time here.'], demo: 'Show one existing agent in Mark and point at its four parts.', ask: '"What do you think happens if an agent has no tools but is asked to read a web page?"', questions: ['"Is this like ChatGPT?" Mark chat is general; a specialized agent is a saved, repeatable task.'] },
    related: [{ route: '/reference/glossary?term=specialized-agent', title: 'Glossary: Specialized agent' }, { route: '/reference/examples', title: 'Worked example gallery' }],
    docs: [{ href: D + 'specialized-agents-overview', text: 'Specialized agents overview' }]
  }),

  'm1/one-task-rule': () => ({
    learn: ['Why good first agents do one task', 'How to spot a task that\'s too big', 'How to split it'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'One task, one verb', html: `<p>Good first agents do <b>one</b> task you can describe with <b>one verb</b>: summarize, rewrite, check, draft. If it takes several verbs, split it into separate agents. You can connect them later with a workflow agent (Module 4).</p><div class="grid2"><div class="soft3"><div class="lbl">Three tasks</div><p style="margin:6px 0 0">"Research competitors, write a brief, and email it to the team."</p></div><div class="green"><div class="lbl">One task</div><p style="margin:6px 0 0">"Summarize a competitor's product page."</p></div></div>` },
      { id: 'explore', kicker: 'Explore', title: 'Try it: sort these ideas', html: `${comp('sorter', { id: 'm1-ideas', instructions: 'Select an idea, then choose where it belongs. You can also drag ideas into a column.', buckets: [{ key: 'good', title: 'Good first agent', sub: 'One task, done often' }, { key: 'big', title: 'Too big: split it', sub: 'Several tasks, or too vague' }, { key: 'nofit', title: 'Not a fit yet', sub: 'Needs a custom tool' }], items: [
        { t: 'Summarize meeting notes', b: 'good', why: 'One verb, one input, done every week.' },
        { t: 'Rewrite text in our brand voice', b: 'good', why: 'One task. The rules can go in the prompt.' },
        { t: 'Plan, write and send the newsletter', b: 'big', why: 'Three tasks. Build "Draft the newsletter intro" first.' },
        { t: 'Fix all our SEO', b: 'big', why: 'Too vague to be one task. Try "Write meta descriptions for one product page".' },
        { t: 'Update records in our internal ERP', b: 'nofit', why: 'Mark can\'t reach an internal system without a custom tool, which needs developers.' },
        { t: 'Translate a blog post into German', b: 'good', why: 'One verb, clear input and output.' },
        { t: 'Run our whole campaign end to end', b: 'big', why: 'A whole process. Split it into separate agents.' },
        { t: 'Check a page against our content checklist', b: 'good', why: 'One verb (check). Attach the checklist as a file.' }
      ] })}` },
      { id: 'example', kicker: 'In the example', title: 'The worked example', html: example('<p style="margin:0">"Write 3 meta descriptions for a product page." The verb is <b>Write</b>. One input (a page), one output (3 options).</p>') },
      { id: 'tips', kicker: 'From the field', title: 'Tips and mistakes', html: `${tip('Teams that ship fastest pick something boring and frequent. Boring is good for a first agent.')}<div style="height:10px"></div>${mistakes(['Describing a whole process instead of one task', 'Picking a task that needs an internal system Mark can\'t reach', 'Picking something done once a quarter'])}${think('Scoping a first agent is like writing one clear brief for one deliverable.', 'A person can ask clarifying questions. A single-turn agent can\'t, so the scope must be clear up front.')}` }
    ],
    notes: { talk: ['Use the one-verb rule. Ask people to say their idea as verb + thing.', 'Split big ideas live.'], demo: 'Write a multi-task idea on the whiteboard and split it with the room.', ask: '"What\'s one task you do every week that you\'d happily hand off?"', questions: ['"Can it do the whole process?" Not as one agent. Build pieces, connect later.'] },
    related: [{ route: '/reference/practices', title: 'Best practices: Scope' }, { route: '/reference/examples', title: 'Worked example gallery' }],
    docs: [{ href: D + 'specialized-agents-fundamentals-and-best-practices', text: 'Specialized agents fundamentals and best practices' }]
  }),

  'm1/inputs-output': () => ({
    learn: ['How inputs become variables', 'How to describe an output precisely', 'How many inputs to ask for'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Inputs and output', html: `<p><b>Inputs</b> become ${term('variables', 'variables')}: what someone gives the agent each time it runs. <b>Output</b> is what it gives back. Keep inputs to 1–3, and describe the output so precisely that two people would picture the same thing.</p>` },
      { id: 'explore', kicker: 'Explore', title: 'Compare vague and precise', html: `${comp('compare', { pairs: [
        { key: 'output', label: 'Output', vague: { text: '"A good summary."', why: 'Doesn\'t say how long, which sections or what format. Results will vary every run.', sample: 'A few paragraphs one time, a bulleted list the next, sometimes with a title.' }, precise: { text: '"A table with columns Option, Meta description, Character count, Keyword used (Y/N). Then one sentence recommending the strongest option."', why: 'Says the format, the columns and what comes after. Easy to test.', sample: 'The same 4-column table every run, followed by one recommendation.' } },
        { key: 'inputs', label: 'Inputs', vague: { text: '"Whatever information you have about the page."', why: 'People won\'t know what to provide, and the agent won\'t know what to expect.', sample: 'Some people paste text, some paste a URL, some paste nothing.' }, precise: { text: '"url (required): the product page URL. target_keyword (optional): the keyword to include."', why: 'Two named inputs, each with a clear purpose and whether it\'s required.', sample: 'Every run gets a URL, and sometimes a keyword.' } },
        { key: 'destination', label: 'Destination', vague: { text: '"Give me the results."', why: 'Doesn\'t say where or in what form the results go.', sample: 'Sometimes a file, sometimes a chat message.' }, precise: { text: '"Return the table in Mark chat."', why: 'Clear and simple. For a first agent, results almost always go back to Mark chat.', sample: 'The table appears in the chat every time.' } }
      ] })}` },
      { id: 'example', kicker: 'In the example', title: 'The worked example', html: example('<div class="row"><span class="chip"><code>[[url]]</code> required</span><span class="chip"><code>[[target_keyword]]</code> optional</span></div><p style="margin:10px 0 0">Output: a 4-column table, then one recommendation, returned in Mark chat.</p>') },
      { id: 'tips', kicker: 'From the field', title: 'Tips and mistakes', html: `${tip('Write the output section first. If you can\'t describe the result, you\'re not ready to build.')}<div style="height:10px"></div>${mistakes(['Too many inputs', '"A good summary" as the output', 'Not saying where the result goes'])}` }
    ],
    notes: { talk: ['Variables are the inputs people type each run.', 'Precision in the output drives consistency.'], demo: 'Flip the vague/precise toggle live.', ask: '"How would you describe the output of your idea in one sentence?"', questions: ['"Can I have 6 inputs?" You can, but every input is effort for the user.'] },
    related: [{ route: '/reference/builder?field=variables', title: 'Field: Variables' }, { route: '/reference/builder?field=output', title: 'Field: Output' }],
    docs: [{ href: D + 'create-a-specialized-agent', text: 'Create a specialized agent' }]
  }),

  'm1/steps-and-rules': () => ({
    learn: ['How to write steps in order', 'How to write rules that can be checked', 'Why examples matter'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Steps, rules and examples', html: `<p><b>Steps</b> are the order of work, as a numbered list. <b>Rules</b> are the always and never constraints. <b>Examples</b> show what good (and bad) looks like. One great example often teaches more than many rules.</p>` },
      { id: 'show', kicker: 'Show', title: 'An annotated plan', html: `${comp('annotated', { title: 'Meta Description Writer: plan', body: `<p><b>Steps</b></p><ol><li>Read the page at the URL <button type="button" class="pin" data-pin="a">a</button></li><li>Find the product, audience and main benefit</li><li>Use the keyword if given, or infer one</li><li>Write 3 options</li><li>Check the length and rewrite any option over 155 characters <button type="button" class="pin" data-pin="b">b</button></li></ol><p><b>Rules</b></p><ul><li>155 characters or fewer</li><li>No superlatives like "best" or "#1" <button type="button" class="pin" data-pin="c">c</button></li><li>End with a benefit or a soft call to action</li></ul><p><b>Example</b>: "Plan, test and launch campaigns faster with one AI-powered workspace built for marketing teams. See how it works." <button type="button" class="pin" data-pin="d">d</button></p>`, notes: { a: 'The first step names the source. Later, in the prompt, this step also names the tool to use.', b: 'A self-check step. Asking the agent to check its own work catches easy mistakes like length.', c: 'A rule anyone can check. "No superlatives" is testable; "sound humble" isn\'t.', d: 'One concrete example sets the tone and length better than a paragraph of description.' } })}` },
      { id: 'explore', kicker: 'Explore', title: 'Spot the rules that can\'t be checked', html: `<p>Click every rule that's too vague to check.</p>${comp('flags', { items: [
        { t: '155 characters or fewer', vague: false, note: 'Checkable: count the characters.' },
        { t: 'Make it engaging', vague: true, note: 'Rewrite: "End with a benefit or a soft call to action."' },
        { t: 'No superlatives like "best" or "#1"', vague: false, note: 'Checkable: look for those words.' },
        { t: 'Sound professional', vague: true, note: 'Rewrite: "No slang, no exclamation marks, no emoji."' },
        { t: 'Use the target keyword', vague: false, note: 'Checkable: is the keyword there?' },
        { t: 'Be creative', vague: true, note: 'Rewrite: "Write 3 options that each lead with a different benefit."' }
      ] })}` },
      { id: 'tips', kicker: 'From the field', title: 'Tips', html: `${tip('Checkable rules become your evaluation criteria in Module 6, so writing them well now saves time later.')}` }
    ],
    notes: { talk: ['Steps = order. Rules = constraints. Examples = tone and format.'], demo: 'Open the annotated plan and walk through callouts a–d.', ask: '"Which of your rules would two people disagree about?"', questions: ['"How many rules?" Enough to describe good output; usually 3–6.'] },
    related: [{ route: '/m6/good-criteria', title: 'Module 6: Writing good evaluation criteria' }],
    docs: [{ href: D + 'prompts-for-specialized-agents', text: 'Prompt details for specialized agents' }]
  }),

  'm1/when-it-cant-finish': () => ({
    learn: ['Why every agent needs a failure rule', 'How to write one'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Always say what to do when it can\'t', html: `<p>Always tell the agent what to do when it can't complete the task. For example: <i>"If you can't open the page, say what failed and stop. Don't guess."</i> Without this, agents may make something up.</p>` },
      { id: 'show', kicker: 'Show', title: 'Same broken URL, two prompts', html: `<div class="grid2"><div class="soft3"><div class="lbl">Without the rule</div><p style="margin:8px 0 0">"Our award-winning platform, trusted by thousands of brands, helps teams plan campaigns faster…"</p><p class="small" style="margin:8px 0 0"><b>Problem:</b> the page couldn't be read, so the agent invented a description.</p></div><div class="green"><div class="lbl">With the rule</div><p style="margin:8px 0 0">"I couldn't open the page (404 Not Found). Please check the URL and try again."</p><p class="small" style="margin:8px 0 0"><b>Result:</b> honest, useful, and easy to act on.</p></div></div>` },
      { id: 'mis', kicker: 'Correct a belief', title: 'A common misconception', html: misconception('If it says something, it must have checked.', 'Agents can make things up unless the instructions say what to do when information is missing.') },
      { id: 'tips', kicker: 'From the field', title: 'Tip', html: tip('In workshops this is the single most common thing missing from first prompts. Add it before you do anything else.') }
    ],
    notes: { talk: ['This is the most-missed line in first prompts.'], demo: 'Show the before/after outputs.', ask: '"What could go wrong for your agent? What should it do then?"', questions: [] },
    related: [{ route: '/m5/five-test-cases', title: 'Module 5: The five test cases' }],
    docs: [{ href: D + 'specialized-agents-fundamentals-and-best-practices', text: 'Specialized agents best practices' }]
  }),

  'm1/single-or-multi-turn': () => ({
    learn: ['The difference between single-turn and multi-turn', 'Which to choose for a first agent'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Two interaction modes', html: `<div class="grid2"><div class="card"><div class="h4">${term('single-turn', 'Single-turn')}</div><p class="small" style="margin:6px 0 0">Runs once and returns a result. Each run starts fresh. Best for repeatable tasks and for use inside workflows.</p></div><div class="card"><div class="h4">${term('multi-turn', 'Multi-turn')}</div><p class="small" style="margin:6px 0 0">Stays active in chat for follow-ups during the session, like "make it punchier". Runs as single-turn inside workflow agents.</p></div></div>` },
      { id: 'explore', kicker: 'Explore', title: 'Decision helper', html: `${comp('decision', { questions: [
        { q: 'Do people usually ask for changes after the first result?', opts: [{ t: 'No', next: 1 }, { t: 'Yes', result: 'multi' }] },
        { q: 'Will this agent run inside an automated workflow later?', opts: [{ t: 'No', result: 'single' }, { t: 'Yes', result: 'single-wf' }] }
      ], results: {
        single: { title: 'Single-turn', text: 'Simpler to build and test, and each run starts fresh. The right choice for most first agents.' },
        'single-wf': { title: 'Single-turn', text: 'Workflow agents run specialized agents in single-turn mode anyway, so single-turn keeps behavior the same in both places.' },
        multi: { title: 'Multi-turn', text: 'Good for iterative drafting or exploration. Remember: memory lasts only for that chat session, and you\'ll set a memory limit.' }
      } })}` },
      { id: 'tips', kicker: 'From the field', title: 'Tip', html: tip('Start single-turn. You can switch to multi-turn later if people keep asking for follow-ups.') }
    ],
    notes: { talk: ['Default to single-turn for a first agent.'], demo: 'Run the decision helper with one person\'s idea.', ask: '"Would your users want to refine the result in chat?"', questions: ['"Does multi-turn remember last week\'s chat?" No, only the current session.'] },
    related: [{ route: '/reference/builder?field=multi-turn', title: 'Field: Support multi-turn conversation' }],
    docs: [{ href: D + 'specialized-agents-fundamentals-and-best-practices', text: 'Interaction modes' }]
  }),

  'm2/where-info-goes': () => ({
    learn: ['The four places information can go', 'Which place fits which kind of information'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Four places for information', html: `<p>An agent only knows what you give it. There are four places to put information:</p><ul><li><b>Variables</b>: things that change every run, like a URL.</li><li><b>Prompt template</b>: rules just for this agent.</li><li><b>Files</b>: a template or checklist just for this agent.</li><li><b>${term('organization-skills', 'Organization skills')}</b>: guidance many agents share, like brand voice.</li></ul>` },
      { id: 'explore', kicker: 'Explore', title: 'Try it: put each item where it belongs', html: `${comp('sorter', { id: 'm2-places', instructions: 'Select an item, then choose where it belongs. You can also drag items.', buckets: [{ key: 'var', title: 'Variables', sub: 'Changes every run' }, { key: 'prompt', title: 'Prompt template', sub: 'Rules for this agent' }, { key: 'file', title: 'Files', sub: 'Reference for this agent' }, { key: 'skill', title: 'Organization skills', sub: 'Shared by many agents' }], items: [
        { t: 'A product page URL', b: 'var', why: 'It changes every run.' },
        { t: 'A pasted meeting transcript', b: 'var', why: 'Different every run.' },
        { t: 'Never say "best"', b: 'prompt', why: 'A rule for this agent.' },
        { t: 'Return a table', b: 'prompt', why: 'Part of the output instructions.' },
        { t: 'A checklist PDF only this agent uses', b: 'file', why: 'A reference document for one agent.' },
        { t: 'An output template for this agent', b: 'file', why: 'A reference document for one agent.' },
        { t: 'Company brand voice guide', b: 'skill', why: 'Many agents need it. For a first agent, the rules can sit in the prompt until a skill exists.' },
        { t: 'Target personas', b: 'skill', why: 'Shared context many agents can use.' },
        { t: "Today's target keyword", b: 'var', why: 'It changes each run.' },
        { t: 'Product terminology list used across teams', b: 'skill', why: 'Shared across many agents.' }
      ] })}` },
      { id: 'mis', kicker: 'Correct a belief', title: 'A common misconception', html: misconception('It already knows our brand voice.', 'Only if you give it that guidance in the prompt, an attached file or an attached organization skill.') },
      { id: 'tips', kicker: 'From the field', title: 'Tip', html: tip('First agent? Put rules in the prompt. Make a shared skill when a second agent needs them.') }
    ],
    notes: { talk: ['Four places. The prompt is fine for a first agent.'], demo: 'Do the sorter with the room calling out answers.', ask: '"Where would your brand guidelines go today?"', questions: ['"Can I upload our brand guide?" Yes, as a file on the agent.'] },
    related: [{ route: '/reference/glossary?term=organization-skills', title: 'Glossary: Organization skills' }],
    docs: [{ href: D + 'create-an-organization-wide-skill', text: 'Create an organization-wide skill' }]
  }),

  'm2/skills-explained': () => ({
    learn: ['What organization skills are', 'Three ways skills get applied', 'Why personal skills don\'t apply to agents'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Skills are reusable guidance', html: `<p>Skills give Mark extra context about how to behave. Specialized agents can use <b>organization skills only</b>, not personal skills. Organization skills are usually created by a Mark administrator under <b>Context → Skills</b>. A skill needs a <b>Shortcut</b> to appear in the agent's <b>Choose skills</b> picker.</p>` },
      { id: 'explore', kicker: 'Explore', title: 'Three ways skills get applied', html: `${comp('tabs', { tabs: [
        { label: 'Match the prompt', html: '<p><b>Automatically select skills matching the prompt.</b> Mark applies organization skills whose "When to use" matches what the agent is asked to do.</p><p class="small">Flexible, but less predictable.</p>' },
        { label: 'Match the tools', html: '<p><b>Automatically select skills matching the tools.</b> Mark applies organization skills linked to the tools the agent uses.</p><p class="small">The safer automatic option, according to Optimizely\'s docs.</p>' },
        { label: 'Insert with /', html: '<p><b>Insert a skill directly.</b> Type <code>/</code> (or <code>{</code>) in the prompt template and pick from <b>Choose skills</b>.</p><p class="small">Most explicit. You decide exactly where the skill applies.</p>' }
      ] })}` },
      { id: 'tips', kicker: 'From the field', title: 'Mistakes to avoid', html: mistakes(['Expecting a personal skill to work in an agent', 'A skill without a Shortcut (it won\'t appear in the picker)', 'Waiting days for a skill instead of putting the rules in the prompt for now']) }
    ],
    notes: { talk: ['Organization skills only. Shortcut needed for the picker.'], demo: 'Open Context → Skills and the Choose skills picker.', ask: '"Who owns your brand voice guidance today?"', questions: ['"Can I make an org skill?" Usually admins do.'] },
    related: [{ route: '/reference/builder?field=skills', title: 'Field: Skills' }],
    docs: [{ href: D + 'manage-skills', text: 'Manage skills' }]
  }),

  'm2/tools-and-connectors': () => ({
    learn: ['What tools are', 'Which tools your agent needs', 'Where tools come from'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Tools are actions', html: `<p>A ${term('tools', 'tool')} is an action the agent can take: read a web page, look up a CMP task, query data. Agents only use the tools you add. Some tools need a <b>connector</b> (a linked account), and custom tools need developers.</p>` },
      { id: 'explore', kicker: 'Explore', title: 'Decision tree: "My agent needs to…"', html: `${comp('choice', { options: [
        { t: 'Work with pasted text', title: 'No tool needed', text: 'The easiest first build. You paste something in and get a result back.', tone: 'g' },
        { t: 'Read a web page', title: 'A web page reading tool', text: 'Check it appears in the builder\'s Add tool list. Most instances have one.' },
        { t: 'Use an Optimizely product', title: 'That product\'s tools', text: 'The product must be connected to Mark. If you\'re not sure, ask your admin.' },
        { t: 'Use a third-party account', title: 'A connector', text: 'Link your account under Connectors, then add its tools.' },
        { t: 'Use an internal system', title: 'A custom tool (developers)', text: 'Mark can\'t reach it without a custom tool. For your first agent, pick a different task.', tone: 'b' }
      ] })}` },
      { id: 'tips', kicker: 'From the field', title: 'Tip', html: tip('Agents with no tools are the easiest first build. You paste something in and get a result back.') }
    ],
    notes: { talk: ['Tools = actions. Only the ones you add.'], demo: 'Open Add tool in the builder and browse categories.', ask: '"Does your idea need a tool at all?"', questions: ['"Can it read our intranet?" Only with a custom tool.'] },
    related: [{ route: '/reference/builder?field=tools', title: 'Field: Tools' }],
    docs: [{ href: D + 'tools-overview', text: 'Tools overview' }]
  }),

  'm2/do-i-need-an-admin': () => ({
    learn: ['When you need an admin', 'How to ask'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Usually not', html: `<p>Most first agents need nothing from an admin. You need one for:</p><ul><li>The <b>Agent Builder</b> role</li><li>Creating <b>organization skills</b></li><li>Turning <b>tools</b> on, or connecting <b>products</b></li><li>Enabling the <code>create_or_edit_agent</code> tool, so Mark chat can draft agents for you</li></ul>` },
      { id: 'show', kicker: 'Show', title: 'Example admin request', html: `<div class="card"><div class="row" style="margin-bottom:8px"><span class="chip">Sample text</span></div><p style="margin:0">"Hi! I'm building my first Mark agent. Could you help with: (1) confirming I have the Agent Builder role, (2) confirming the web page reading tool is turned on for our instance, and (3) making sure the <code>create_or_edit_agent</code> tool is active and enabled in chat? Thank you!"</p></div><p class="small" style="margin-top:8px">A read-only example. Adapt the wording for your own message.</p>` },
      { id: 'tips', kicker: 'From the field', title: 'Tip', html: tip('Ask for everything in one message. Admins prefer one clear checklist to several small requests.') }
    ],
    notes: { talk: ['Most first agents don\'t need an admin.'], demo: '', ask: '"Who is your Mark admin?"', questions: [] },
    related: [{ route: '/reference/troubleshooting', title: 'Troubleshooting' }],
    docs: [{ href: D + 'get-started-with-agent-platform-for-agent-builders', text: 'Get started for agent builders' }]
  })
};
