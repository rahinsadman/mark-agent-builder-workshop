// Workshop structure: modules, lessons, labs, knowledge checks
export const MODULES = [
  { id: 'primer', short: 'Primer', label: 'Primer', title: 'How a specialized agent works', phase: 'Foundations', mins: 5, icon: 'search', ill: 'binoculars',
    goal: 'Understand what a specialized agent is, and what it can\'t do.',
    lessons: [{ slug: 'how-agents-work', title: 'How a specialized agent works', mins: 5, format: 'Explorable diagram · Quick check', summary: 'The four parts of every agent and three facts that prevent most first-agent mistakes.' }] },
  { id: 'm1', short: 'Plan', label: 'Module 1', title: 'Plan an agent', phase: 'Phase 4: Design', mins: 25, icon: 'ideation', ill: 'darts',
    goal: 'Turn a vague idea into a clear plan for a one-task agent, before you open the builder.',
    objectives: ['Narrow an idea to one task', 'Define inputs and a precise output', 'Write steps, rules and a failure rule', 'Choose single-turn or multi-turn'],
    handout: { file: 'agent-planning-worksheet.pdf', title: 'Blank agent planning worksheet', note: 'Use it alongside the lessons. The site never sees what you write on it.' },
    lessons: [
      { slug: 'one-task-rule', title: 'The one-task rule', mins: 5, format: 'Sorter: good first agent or too big?', summary: 'Good first agents do one task you can describe with one verb.' },
      { slug: 'inputs-output', title: 'Inputs and output', mins: 5, format: 'Vague vs. precise toggle', summary: 'Inputs become variables. Describe the output precisely.' },
      { slug: 'steps-and-rules', title: 'Steps and rules', mins: 5, format: 'Annotated plan · Spot the vague rule', summary: 'Numbered steps, checkable rules and examples.' },
      { slug: 'when-it-cant-finish', title: 'When it can\'t finish', mins: 3, format: 'Before and after', summary: 'Tell the agent what to do when it can\'t complete the task.' },
      { slug: 'single-or-multi-turn', title: 'Single-turn or multi-turn', mins: 4, format: 'Decision helper', summary: 'Choose how people will interact with the agent.' }
    ] },
  { id: 'm2', short: 'Prepare', label: 'Module 2', title: 'Prepare what it needs', phase: 'Phase 5: Prepare', mins: 15, icon: 'layers', ill: 'backpack',
    goal: 'Know where each piece of information belongs, and when you need help from an admin.',
    objectives: ['Choose between variables, prompt, files and organization skills', 'Understand how skills are applied', 'Decide which tools an agent needs', 'Know when to involve an admin'],
    lessons: [
      { slug: 'where-info-goes', title: 'Where information goes', mins: 5, format: 'Drag-and-drop sorter', summary: 'Variables, prompt template, files and organization skills.' },
      { slug: 'skills-explained', title: 'Skills, explained', mins: 4, format: 'Tabs', summary: 'How organization skills get applied to agents.' },
      { slug: 'tools-and-connectors', title: 'Tools and connectors', mins: 4, format: 'Decision tree', summary: 'Which tools your agent needs, and where they come from.' },
      { slug: 'do-i-need-an-admin', title: 'Do I need an admin?', mins: 2, format: 'Checklist · Sample request', summary: 'Usually not. Here\'s when you do.' }
    ] },
  { id: 'm3', short: 'Build', label: 'Module 3', title: 'Build in the agent builder', phase: 'Phase 6: Build', mins: 40, icon: 'specialized-tools', ill: 'browser',
    goal: 'Recognize every setting in the specialized agent builder, know which 7 matter for a first agent, and write a clear prompt template.',
    objectives: ['Find your way around the agent builder', 'Know the 7 Must fields and safe defaults', 'Write a prompt template with CLEAR', 'Choose an inference level'],
    lessons: [
      { slug: 'builder-anatomy', title: 'Tour of the agent builder', mins: 10, format: 'Interactive builder replica', summary: 'Click any of the 18 settings to learn what it does.' },
      { slug: 'clear-prompts', title: 'The CLEAR prompt structure', mins: 8, format: 'Annotated prompt · Order exercise', summary: 'Context, Logic, Examples, Action, Result.' },
      { slug: 'fix-this-prompt', title: 'Fix this prompt', mins: 7, format: 'Spot the problems', summary: 'Find the problems in sample prompts, then see the fixed versions.' },
      { slug: 'inference-level', title: 'Inference level and model choice', mins: 4, format: 'Slider explorer', summary: 'Depth of reasoning vs. speed and credits.' },
      { slug: 'two-ways-to-create', title: 'Two ways to create an agent', mins: 5, format: 'Comparison · Annotated card', summary: 'Fill in the form, or ask Mark chat to draft it.' }
    ],
    lab: { title: 'Try it in Mark: build the example agent', mins: 25 } },
  { id: 'm4', short: 'Test', label: 'Module 4', title: 'Test and improve', phase: 'Phase 7: Test & refine', mins: 30, icon: 'integrate-and-test', ill: 'experiment',
    goal: 'Test systematically, read results, and fix problems one change at a time.',
    objectives: ['Judge consistency, not identical wording', 'Use the Test Run panel and Execution Memory', 'Test with 5 kinds of input', 'Diagnose and fix common problems'],
    lessons: [
      { slug: 'what-working-means', title: 'What "working" means', mins: 4, format: 'Side-by-side runs', summary: 'Same structure, rules and quality, even when wording varies.' },
      { slug: 'test-run-panel', title: 'The Test Run panel', mins: 6, format: 'Interactive replica', summary: 'Run tests and read Execution Memory.' },
      { slug: 'five-test-cases', title: 'The five test cases', mins: 6, format: 'Flip cards', summary: 'Typical, second typical, large, minimum and broken.' },
      { slug: 'diagnose-and-fix', title: 'Diagnose and fix', mins: 8, format: 'Diagnose scenarios', summary: 'Find the likely cause, then change one thing.' },
      { slug: 'versions', title: 'Versions: your safety net', mins: 4, format: 'Version timeline', summary: 'Every save is a version you can restore.' }
    ],
    lab: { title: 'Try it in Mark: run the five test cases', mins: 20 } },
  { id: 'm5', short: 'Quality', label: 'Module 5', title: 'Quality and safety', phase: 'Phase 8: Quality & safety', mins: 20, icon: 'governance', ill: 'traffic-light',
    goal: 'Understand the Quality tab and write good evaluation criteria.',
    objectives: ['Know the three parts of the Quality tab', 'Write testable evaluation criteria', 'Understand how guardrails learn', 'Know when to use input guardrails and private executions'],
    lessons: [
      { slug: 'quality-tab', title: 'Tour of the Quality tab', mins: 4, format: 'Interactive replica', summary: 'Output Evaluation, Execution Guardrails and Execution Advisor.' },
      { slug: 'good-criteria', title: 'Writing good evaluation criteria', mins: 7, format: 'Criteria sorter', summary: 'Criteria two people would agree on.' },
      { slug: 'how-guardrails-learn', title: 'How guardrails learn what\'s normal', mins: 5, format: 'Interactive timeline', summary: 'Learning, Watching and Enforcing modes.' },
      { slug: 'input-guardrails-and-privacy', title: 'Input guardrails and private executions', mins: 4, format: 'Explainer', summary: 'Optional safety features, and when to use them.' }
    ],
    lab: { title: 'Try it in Mark: add quality checks', mins: 10 } },
  { id: 'm6', short: 'Share', label: 'Module 6', title: 'Share and launch', phase: 'Phase 9: Share & launch', mins: 15, icon: 'share', ill: 'newspaper',
    goal: 'Share safely and help your team adopt the agent.',
    objectives: ['Set visibility and access levels', 'Run a soft launch', 'Write a usage guide people will read', 'Know what success looks like'],
    handout: { file: 'pilot-feedback-checklist.pdf', title: 'Pilot feedback checklist', note: 'Give it to your pilot testers.' },
    lessons: [
      { slug: 'visibility-and-access', title: 'Visibility and access', mins: 5, format: 'Share dialog simulator', summary: 'Private, Shared and Organization, and who can do what.' },
      { slug: 'soft-launch', title: 'Soft launch playbook', mins: 4, format: 'Step-by-step playbook', summary: 'Pilot, feedback, fix, then share widely.' },
      { slug: 'usage-guide', title: 'Writing a usage guide', mins: 3, format: 'Annotated example', summary: 'What to tell people so they can use it without asking you.' },
      { slug: 'driving-adoption', title: 'Driving adoption', mins: 3, format: 'Explainer', summary: 'The real finish line is real use.' }
    ],
    lab: { title: 'Try it in Mark: share with one colleague', mins: 10 } }
];
export const PATH_ORDER = ['primer', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6'];
export const modById = id => MODULES.find(m => m.id === id);
export const lessonRoute = (mod, slug) => mod.id === 'primer' ? '/primer' : `/${mod.id}/${slug}`;

// Ordered items in a module (lessons, then lab, then check)
export function moduleItems(mod) {
  const items = mod.lessons.map(l => ({ type: 'lesson', id: `${mod.id}/${l.slug}`, route: lessonRoute(mod, l.slug), title: l.title, mins: l.mins, lesson: l }));
  if (mod.lab) items.push({ type: 'lab', id: `${mod.id}/lab`, route: `/${mod.id}/lab`, title: 'Lab: ' + mod.lab.title.replace('Try it in Mark: ', ''), mins: mod.lab.mins, optional: true });
  if (CHECKS[mod.id]) items.push({ type: 'check', id: `${mod.id}/check`, route: `/${mod.id}/check`, title: 'Knowledge check', mins: 3, qcount: CHECKS[mod.id].length });
  return items;
}
export function allItems() {
  const out = [];
  PATH_ORDER.forEach(id => moduleItems(modById(id)).forEach(it => out.push({ ...it, mod: id })));
  out.push({ type: 'wrap', id: 'wrap-up', route: '/wrap-up', title: 'Wrap-up and what\'s next', mod: 'wrap' });
  return out;
}
export const requiredItems = () => allItems().filter(i => !i.optional);

const q = (text, options, review) => ({ q: text, options, review });
const o = (t, ok, why) => ({ t, ok, why });
export const CHECKS = {
  m1: [
    q('Which is the best first agent?', [
      o('"Plan, write and publish our newsletter"', false, 'That\'s three tasks. Split it and build the first one.'),
      o('"Summarize meeting notes into action items"', true, 'One task, one verb (summarize), done often. A strong first agent.'),
      o('"Improve our marketing"', false, 'Too vague to plan or test. Pick one concrete task.')], '/m1/one-task-rule'),
    q('Why should a prompt say what to do when the agent can\'t complete the task?', [
      o('It makes the agent run faster', false, 'Speed isn\'t the reason. It\'s about honest results.'),
      o('It helps prevent made-up answers', true, 'Without a failure rule, an agent that can\'t read a page may fill the gap by guessing. Telling it to say what failed and stop keeps results honest.'),
      o('It\'s required before you can save', false, 'Mark lets you save without it, which is why it\'s easy to forget.'),
      o('It lets the agent ask the user questions', false, 'A single-turn agent can\'t ask questions during a run.')], '/m1/when-it-cant-finish'),
    q('People want to refine drafts back and forth in chat. Which mode fits?', [
      o('Single-turn', false, 'Single-turn runs once and returns a result. Follow-ups start fresh.'),
      o('Multi-turn', true, 'Multi-turn stays active in chat for follow-up requests during the session.')], '/m1/single-or-multi-turn')
  ],
  m2: [
    q('Where should brand voice rules go for your first agent?', [
      o('In the prompt template', true, 'For a first agent, put rules in the prompt. Turn them into an organization skill when a second agent needs them.'),
      o('In a variable', false, 'Variables are for things that change every run, like a URL.'),
      o('Nowhere: the agent already knows our brand', false, 'Agents only know what you give them in the prompt, files or attached organization skills.')], '/m2/where-info-goes'),
    q('Why doesn\'t a personal skill apply to a specialized agent?', [
      o('Personal skills are only for admins', false, 'Any user can create personal skills.'),
      o('Specialized agents only use organization skills', true, 'That keeps results consistent for everyone who runs the agent.'),
      o('Skills never apply to agents', false, 'Organization skills can be applied to specialized agents.')], '/m2/skills-explained'),
    q('Which agent needs no tools?', [
      o('One that reads a product page from a URL', false, 'Reading a page needs a web page reading tool.'),
      o('One that rewrites text you paste in', true, 'It works only with the pasted text, so no tools are needed. The easiest first build.'),
      o('One that updates a CMP task', false, 'Changing a CMP task needs CMP tools.')], '/m2/tools-and-connectors')
  ],
  m3: [
    q('Which of these is a Must field for a first agent?', [
      o('LLM Provider', false, 'Leave it on your admin\'s default.'),
      o('Prompt Template', true, 'The 7 Must fields are Name, Id, Description, Prompt Template, Variables, Tools and Output.'),
      o('Enable personal context', false, 'Leave it off for a first agent.')], '/m3/builder-anatomy'),
    q('What does [[url]] mean in a prompt template?', [
      o('A link the agent will always open', false, 'It\'s a placeholder, not a fixed link.'),
      o('A variable: an input the person provides each run', true, 'It must match a variable called url, with the same spelling.'),
      o('A tool name', false, 'Tools are added in the Tools section. Backticks are just a readability convention for naming them.')], '/m3/clear-prompts'),
    q('Which inference level should most first agents start with?', [
      o('Pro', false, 'Pro is slowest and uses the most credits.'),
      o('Standard', true, 'Start at Standard. Move up one level only if answers are too shallow.'),
      o('Quick', false, 'Quick suits very short, simple outputs.')], '/m3/inference-level')
  ],
  m4: [
    q('You run the same input twice and the wording differs. What does that mean?', [
      o('The agent is broken', false, 'AI models vary their wording between runs.'),
      o('Nothing, if the structure, rules and quality are consistent', true, 'Test for consistent structure and quality, not identical words.'),
      o('You need a higher inference level', false, 'Variation in wording is normal at any level.')], '/m4/what-working-means'),
    q('Which test case checks that the agent fails gracefully?', [
      o('Typical input', false, 'That checks basic quality.'),
      o('Minimum input', false, 'That checks behavior without optional inputs.'),
      o('Broken input', true, 'A broken URL or wrong file shows whether the agent says what went wrong and stops.')], '/m4/five-test-cases'),
    q('You changed three things and results improved. What\'s the problem?', [
      o('Nothing, it improved', false, 'You won\'t know which change helped, or which to undo if something breaks later.'),
      o('You can\'t tell which change helped', true, 'Change one thing at a time, then re-run the same input.')], '/m4/diagnose-and-fix')
  ],
  m5: [
    q('Which is a good evaluation criterion?', [
      o('"Is high quality"', false, 'Two people could easily disagree about this.'),
      o('"Includes exactly 3 options"', true, 'Testable: anyone would agree whether a run passed.'),
      o('"Sounds on-brand"', false, 'Too vague. Name the specific rules instead.')], '/m5/good-criteria'),
    q('When can Execution Guardrails start stopping runs?', [
      o('Immediately', false, 'They block nothing during Learning and Watching modes.'),
      o('After 50 successful runs, in Enforcing mode', true, 'Learning covers the first 20 successful runs, Watching the next 30.'),
      o('Never', false, 'In Enforcing mode, with auto-stop on, they can stop clearly unusual runs.')], '/m5/how-guardrails-learn'),
    q('What do Execution Guardrails watch?', [
      o('Whether the answer is correct', false, 'That\'s Output Evaluation.'),
      o('How a run behaves compared with normal runs', true, 'Unusual steps or tool calls, compared with the learned baseline.')], '/m5/how-guardrails-learn')
  ],
  m6: [
    q('What visibility does a new agent have?', [
      o('Organization', false, 'Nobody else can see it until you share it.'),
      o('Private', true, 'New agents are private by default.'),
      o('Shared', false, 'Shared means you\'ve invited specific people.')], '/m6/visibility-and-access'),
    q('What access level should most colleagues get?', [
      o('Can view', true, 'They can open and run it, but not change it.'),
      o('Can edit', false, 'Can edit lets them change your prompt and share it.'),
      o('Can manage', false, 'Can manage also lets them remove the agent. Only the owner can grant it.')], '/m6/visibility-and-access'),
    q('What\'s the real finish line for a launch?', [
      o('Sharing it org-wide', false, 'Sharing is a step, not the outcome.'),
      o('A colleague uses it without asking you anything', true, 'That means the agent and its usage guide work on their own.')], '/m6/driving-adoption')
  ]
};
export const PRIMER_CHECK = [
  q('"An agent gets better the more people use it."', [o('True', false, 'An agent doesn\'t improve by itself. It changes when you edit its instructions, tools or settings.'), o('False', true, 'Correct. You improve it by editing it.')]),
  q('"An agent can use any tool in Mark."', [o('True', false, 'It can only use the tools you add, unless automatic tool prediction is turned on.'), o('False', true, 'Correct. It only uses the tools you add.')])
];
export const UNDERSTANDING_CHECK = [
  q('"Personal skills apply to specialized agents."', [o('True', false, 'Specialized agents use organization skills only.'), o('False', true, 'Correct. Only organization skills apply.')]),
  q('"Test runs are free."', [o('True', false, 'Test runs use credits like any run.'), o('False', true, 'Correct. They use credits, so test with purpose.')]),
  q('"Once you share an agent, you can still change or unshare it."', [o('True', true, 'Correct. You can edit, restore versions and change access at any time.'), o('False', false, 'You can edit, restore versions and change access at any time.')])
];
