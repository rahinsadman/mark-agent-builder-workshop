import { comp, tip, mistakes, thinking, misconception, think, tech, example, term, callout, ui, docLink } from '../core.js';
const D = 'https://docs.optimizely.com/agent-platform/docs/';

export const LESSONS_B = {
  'm3/builder-anatomy': (params) => ({
    learn: ['Where the agent builder is', 'What each of the 18 settings does', 'Which 7 matter for a first agent'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Where it is', html: `<p>In Mark, go to <b>Agents → Your Agents → Add Agent → Specialized Agent</b>. You'll see about 17 settings (plus multi-turn settings that only appear when multi-turn is on). A first agent only needs 7 of them.</p>${thinking('What if I set something up wrong?', 'New agents are private until you share them, and every save creates a version you can restore.')}` },
      { id: 'explore', kicker: 'Explore', title: 'Click any setting', html: `<p>This is a replica of the Mark agent builder, filled in with the example agent. Click a numbered setting to learn about it, turn on <b>First-agent view</b> to see what matters, or take the <b>Guided tour</b>.</p>${comp('replica', { tiers: params.get('tiers') === 'on', field: params.get('field') || null })}` },
      { id: 'tips', kicker: 'From the field', title: 'Tips', html: `${tip('Fill in the 7 Must fields, set Inference Level and Impact, and leave everything else at its default until testing says otherwise.')}<div style="height:10px"></div>${mistakes(['Turning on optional settings "just in case"', 'Naming a tool in the prompt without adding it under Tools', 'Variable names that don\'t match the prompt'])}` }
    ],
    notes: { talk: ['Most anxiety comes from seeing 17 settings. Show the tier toggle.', 'Must: Name, Id, Description, Prompt Template, Variables, Tools, Output.'], demo: 'Switch to Mark → Add Agent. Point at each Must field.', ask: '"Which setting looks scariest?"', questions: ['"Do I need Skills?" Not for a first agent.'] },
    related: [{ route: '/reference/builder', title: 'Field encyclopedia' }],
    docs: [{ href: D + 'create-a-specialized-agent', text: 'Create a specialized agent' }]
  }),

  'm3/clear-prompts': () => ({
    learn: ['The five parts of CLEAR', 'How to write top to bottom', 'Two symbols you\'ll use'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'The CLEAR structure', html: `<p>Optimizely recommends five parts, written top to bottom in the order things happen: <b>C</b>ontext (role and goal), <b>L</b>ogic (rules), <b>E</b>xamples, <b>A</b>ction (numbered steps using variables and tools) and <b>R</b>esult (the exact output format). Don't refer back to earlier parts ("as mentioned above").</p>` },
      { id: 'show', kicker: 'Show', title: 'The example prompt, part by part', html: `<p>Click a part to see why it's written that way.</p>${comp('clear', { bands: [
        { L: 'C', name: 'Context: role and goal', body: 'You are a senior SEO copywriter for our B2B software brand. You write meta descriptions that make people want to click our pages in search results.', why: 'Sets the role and the goal, so every later instruction has a purpose.' },
        { L: 'L', name: 'Logic: rules', body: '- Each description must be 155 characters or fewer.\n- Use the target keyword naturally if one is provided.\n- Never use superlatives like "best" or "#1".\n- End with a benefit or a soft call to action.', why: 'Every rule is checkable. These become evaluation criteria later.' },
        { L: 'E', name: 'Examples', body: 'Great: "Plan, test and launch campaigns faster with one AI-powered workspace built for marketing teams. See how it works."\nAvoid: "The BEST marketing platform ever!!! Click here now."', why: 'One good and one bad example show tone and length quickly.' },
        { L: 'A', name: 'Action: numbered steps', body: '1. Use `browse_web_html` to read the page at [[url]].\n2. Identify the main product, audience and primary benefit.\n3. If [[target_keyword]] is provided, use it. Otherwise infer the most relevant keyword.\n4. Write 3 distinct meta descriptions.\n5. Count the characters in each and rewrite any option over 155.\nIf you cannot open [[url]], say exactly what failed and stop. Do not guess the page content.', why: 'Steps in order, the variables in [[ ]], the tool named in the step where it\'s used, and the failure rule.' },
        { L: 'R', name: 'Result: exact format', body: 'A table with columns: Option | Meta description | Character count | Keyword used (Y/N).\nThen one sentence recommending the strongest option and why.', why: 'Precise enough that two people would draw the same thing.' }
      ] })}${callout('info', 'The tool name <code>browse_web_html</code> is used by Optimizely\'s Experiment Planning agent. Use the exact tool name shown in your own <b>Add tool</b> list.')}` },
      { id: 'explore', kicker: 'Explore', title: 'Put these in CLEAR order', html: `${comp('order', { slots: ['C · Context', 'L · Logic', 'E · Examples', 'A · Action', 'R · Result'], items: [
        { t: 'You are an editor who turns meeting transcripts into action lists.', pos: 0 },
        { t: 'Never invent owners or dates. Maximum 5 decisions.', pos: 1 },
        { t: 'Great action item: "Priya: send the brief to legal by Friday."', pos: 2 },
        { t: '1. Read [[transcript]]. 2. List decisions. 3. List action items.', pos: 3 },
        { t: 'Return two sections: Decisions (bullets), Action items (table).', pos: 4 }
      ] })}` },
      { id: 'symbols', kicker: 'Remember', title: 'Two symbols', html: `<div class="green"><p style="margin:0 0 6px"><code>[[url]]</code>: an input (variable). Case-sensitive, and must match the Variables list.</p><p style="margin:0"><code>\`tool_name\`</code>: a tool, written in backticks for clarity. The tool must also be added under Tools.</p></div><div style="height:10px"></div>${tip('Say what kind of ID an ID variable holds: <code>Task: [[task_id]]</code>, not just <code>[[task_id]]</code>. It helps Mark find the right item.')}` }
    ],
    notes: { talk: ['CLEAR, top to bottom.', 'Variables are case-sensitive.'], demo: 'Paste the example prompt into a real builder.', ask: '"Which part is missing from most prompts you\'ve seen?"', questions: ['"Is CLEAR mandatory?" No, but it\'s Optimizely\'s recommended structure.'] },
    related: [{ route: '/reference/builder?field=prompt-template', title: 'Field: Prompt Template' }],
    docs: [{ href: D + 'specialized-agents-fundamentals-and-best-practices', text: 'Prompt template best practices' }]
  }),

  'm3/fix-this-prompt': () => ({
    learn: ['How to read a prompt critically', 'The most common prompt problems', 'A checklist you can use on your own prompts'],
    blocks: [
      { id: 'explore', kicker: 'Explore', title: 'Spot the problems', html: `<p>Each sample prompt has hidden problems. Click any line you think is wrong.</p>${comp('spot', { prompts: [
        { name: 'Prompt 1: Meta descriptions', vars: 'Variables defined: url · Tools added: none', lines: [
          { t: 'You are a helpful assistant that writes good meta descriptions.', p: 'Vague: "helpful" and "good". State the role and the goal.' },
          { t: 'Read the page at [[URL]] and figure out what it\'s about.', p: 'Variable spelled [[URL]], but the variable is url. Spelling must match exactly.' },
          { t: 'Use the SEO tool to check keywords.', p: 'A tool is mentioned but none is added under Tools.' },
          { t: 'Write some options, etc.', p: 'Vague: "some" and "etc." Say exactly how many.' },
          { t: 'Follow the rules as mentioned above.', p: 'Backward reference, and there are no rules above.' },
          { t: 'Make them engaging.', p: 'No output format and no failure rule anywhere in this prompt.' }
        ], fixed: 'C: You are a senior SEO copywriter. Your descriptions help people click our pages in search results.\nL: 155 characters or fewer. Never use "best" or "#1".\nE: Great: "Plan, test and launch campaigns faster…"\nA: 1. Use `browse_web_html` to read [[url]]. 2. Write 3 options. 3. Check the length.\nIf you can\'t open [[url]], say what failed and stop.\nR: A table: Option | Meta description | Character count.' },
        { name: 'Prompt 2: Meeting notes', vars: 'Variables defined: transcript · Tools added: none', lines: [
          { t: 'You are an editor who turns meeting transcripts into action lists.' },
          { t: 'Summarize [[transcript]] and list the action items.', p: 'Two tasks in one step with no order. Number the steps: decisions first, then actions.' },
          { t: 'Add owners and dates for each action.', p: 'Will invent owners and dates. Add "only if they\'re mentioned".' },
          { t: 'Keep it short.' , p: 'Vague. Say "maximum 5 decisions" or a word limit.' },
          { t: 'Use the format from the example.', p: 'There\'s no example in the prompt. Add one, or describe the format.' },
          { t: 'Return a table.' }
        ], fixed: 'C: You are an editor who turns meeting transcripts into action lists.\nL: Maximum 5 decisions. Only include owners and dates that are mentioned.\nE: Great action item: "Priya: send the brief to legal by Friday."\nA: 1. Read [[transcript]]. 2. List decisions. 3. List action items.\nIf the text isn\'t a meeting transcript, say so and stop.\nR: Decisions (bullets), then Action items (table: Action | Owner | Due).' },
        { name: 'Prompt 3: Page checker', vars: 'Variables defined: page_url · Tools added: browse_web_html', lines: [
          { t: 'You are a content reviewer for our website.' },
          { t: 'Use `browse_web_html` to read [[url]].', p: 'The variable is called page_url, not url.' },
          { t: 'Check it against the checklist.', p: 'No checklist is attached or included. Attach it as a file and refer to it by name.' },
          { t: 'Do this for [[id]].', p: 'An undefined variable, and an ID with no type label. Remove it, or define it and write "Task: [[task_id]]".' },
          { t: 'If anything fails, rewrite the page.', p: 'A second task (rewrite). This agent should check, not rewrite.' },
          { t: 'Return a table with Item, Pass/Fail and Evidence.' }
        ], fixed: 'C: You are a content reviewer for our website.\nL: Check every item on the attached checklist. Quote page text as evidence. Don\'t rewrite.\nA: 1. Use `browse_web_html` to read [[page_url]]. 2. Check each item in "content-checklist.pdf".\nIf you can\'t open the page, say what failed and stop.\nR: A table: Item | Pass/Fail | Evidence.' }
      ] })}` },
      { id: 'checklist', kicker: 'Resource', title: 'Prompt quality checklist', html: `<div class="soft"><div class="grid2 small"><div>☐ Every [[variable]] is defined</div><div>☐ Spelling matches exactly</div><div>☐ Tools named are added</div><div>☐ An "if it can't" rule is present</div><div>☐ Steps are numbered</div><div>☐ The output format is described</div><div>☐ No vague words (good, some, etc.)</div><div>☐ No backward references</div><div>☐ ID variables are labeled</div><div>☐ At least one example</div><div>☐ One task only</div><div>☐ A sensible length</div></div><div class="row" style="margin-top:12px"><a class="btn sm secondary" href="assets-3b8ff24439/downloads/prompt-quality-checklist.pdf" download>${ui('dl', 16)} Download the checklist (PDF)</a></div></div>${callout('info', 'Use the checklist on your own prompts in Mark. This site doesn\'t check your prompts; it teaches you what to look for.')}` }
    ],
    notes: { talk: ['Make it a game: who finds all six first?'], demo: 'Reveal the fixed version side by side.', ask: '"Which problem do you think is most common?"', questions: [] },
    related: [{ route: '/m3/clear-prompts', title: 'The CLEAR prompt structure' }],
    docs: [{ href: D + 'prompts-for-specialized-agents', text: 'Prompt details for specialized agents' }]
  }),

  'm3/inference-level': () => ({
    learn: ['What inference level controls', 'Which level to start with', 'When to change the LLM provider'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Depth vs. speed and credits', html: `<p>${term('inference-level', 'Inference level')} controls how much reasoning Mark does before answering. Higher levels are deeper, but slower and use more credits. Move the slider to compare.</p>` },
      { id: 'explore', kicker: 'Explore', title: 'Compare the levels', html: `${comp('slider', { start: 1, stops: [
        { name: 'Quick', best: 'Very short, simple outputs', example: '5 headline ideas', speed: 5, credits: 1 },
        { name: 'Standard', best: 'Most first agents. Start here', example: 'Summarize notes into bullets', speed: 4, credits: 2, rec: true },
        { name: 'Balanced', best: 'Tasks that need some reasoning', example: 'Spot risks in a contract summary', speed: 3, credits: 3 },
        { name: 'Complex', best: 'Planning and analysis', example: 'An A/B test plan with metrics', speed: 2, credits: 4 },
        { name: 'Pro', best: 'The hardest, most nuanced tasks', example: 'A trade-off analysis across many factors', speed: 1, credits: 5 },
        { name: 'Code', best: 'Writing, explaining or fixing code', example: 'A JavaScript snippet', speed: 3, credits: 3 }
      ] })}<p class="small">Speed and credit meters are relative and illustrative, not exact credit numbers.</p>` },
      { id: 'provider', kicker: 'Also in the builder', title: 'LLM Provider', html: `<p>Choose Anthropic Claude, Google Gemini or OpenAI GPT, or leave it on your admin's default. Change it only if testing shows a clear difference for this task.</p>${misconception('Higher is always better.', 'Pro is slower and uses more credits. Move up one level only if answers are too shallow.')}` }
    ],
    notes: { talk: ['Standard is the default recommendation.'], demo: 'Show the dropdown in the builder.', ask: '"What would make you move up a level?"', questions: ['"Which model is behind each level?" It changes; see the Inference level doc.'] },
    related: [{ route: '/reference/builder?field=inference-level', title: 'Field: Inference Level' }],
    docs: [{ href: D + 'inference-level', text: 'Inference level' }]
  }),

  'm3/two-ways-to-create': () => ({
    learn: ['Two ways to create an agent', 'What the Review Agent card does', 'Why you still review every field'],
    blocks: [
      { id: 'explain', kicker: 'Explain', title: 'Form or chat', html: `<div class="grid2"><div class="card"><div class="row">${'<span class="h4">Fill in the form</span>'}</div><p class="small" style="margin:8px 0">Agents → Your Agents → Add Agent → Specialized Agent. Full control of every field. Best when you want to understand each setting.</p><div class="row"><span class="chip">About 20–30 min</span><span class="chip">No extra setup</span></div></div><div class="card"><div class="h4">Ask Mark chat to draft it</div><p class="small" style="margin:8px 0">Describe the agent in chat. Mark returns a <b>Review Agent</b> card, can flag vague wording, suggest missing tools and generate evaluation samples. You review it, then click <b>Create Agent</b>.</p><div class="row"><span class="chip">About 10 min</span><span class="chip b">Needs <code>create_or_edit_agent</code> enabled</span></div></div></div>` },
      { id: 'show', kicker: 'Show', title: 'A sample chat request', html: `<div class="row" style="margin-bottom:8px"><span class="chip">Example of how to ask</span></div><div class="codebox">Help me create a specialized agent.
Name: Meta Description Writer. Id: meta_description_writer.
Purpose: Writes 3 search-friendly meta descriptions for a product page.
Inputs: url (text, required); target_keyword (text, optional).
Steps: 1) Read the page. 2) Find the product, audience and main benefit. 3) Write 3 options. 4) Check the length.
Rules: 155 characters or fewer; no superlatives; end with a benefit.
If stuck: if the page can't be read, say what failed and stop.
Output: a table (Option | Meta description | Character count | Keyword used), then one recommendation.
Please flag anything ambiguous and suggest any missing tools.</div>` },
      { id: 'card', kicker: 'Show', title: 'An annotated Review Agent card', html: `${comp('annotated', { title: 'Replica: Review Agent card', body: `<div class="card"><p style="margin:0 0 6px"><b>Review Agent</b> · Meta Description Writer</p><p class="small" style="margin:0 0 4px">Name, Id, Description, Prompt, Variables, Tools, Output <button type="button" class="pin" data-pin="a">a</button></p><p class="small" style="margin:0 0 4px">Flagged: "brand voice" is ambiguous <button type="button" class="pin" data-pin="b">b</button></p><p class="small" style="margin:0 0 8px">Suggested tool: a web page reading tool <button type="button" class="pin" data-pin="c">c</button></p><div class="row"><span class="chip">Edit</span><span class="chip g">Create Agent</span> <button type="button" class="pin" data-pin="d">d</button></div></div>`, notes: { a: 'Every field Mark drafted. Compare each one with your plan.', b: 'Mark points out vague wording. Replace it with specific rules.', c: 'Suggested tools. Add only what the prompt actually uses.', d: 'Nothing is created until you click Create Agent. You can edit first.' } })}${tip('Even when Mark drafts it, read every field on the card. You know what good looks like.')}` }
    ],
    notes: { talk: ['Both paths are valid. Chat is faster if enabled.'], demo: 'Paste the sample request into Mark chat.', ask: '"Which path would you choose, and why?"', questions: ['"No Review Agent card?" The create_or_edit_agent tool isn\'t enabled.'] },
    related: [{ route: '/reference/troubleshooting', title: 'Troubleshooting: no Review Agent card' }],
    docs: [{ href: D + 'use-mark-to-create-or-edit-a-specialized-agent-automatically', text: 'Use Mark to create or edit a specialized agent' }]
  })
};
