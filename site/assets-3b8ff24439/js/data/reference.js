// Glossary, best practices, FAQ, troubleshooting, worked examples
export const GLOSSARY = [
  { key: 'agent-directory', term: 'Agent Directory', plain: 'A catalog of ready-made agents that Agent Builders and admins can install into their Mark instance.' },
  { key: 'agent-library', term: 'Agent Library', plain: 'A browsable catalog of agents on the Mark chat home page that any Mark user can run.' },
  { key: 'credits', term: 'Credits', plain: 'Units Mark uses each time it calls an AI model, including agent runs and test runs.' },
  { key: 'description', term: 'Description', plain: 'A short summary of what an agent does and when to use it. People and Mark both read it.' },
  { key: 'execution-advisor', term: 'Execution Advisor', plain: 'Steps in during a run to recover from problems, retry failed tool calls and review sensitive tool calls.' },
  { key: 'execution-guardrails', term: 'Execution Guardrails', plain: 'Builds a baseline of normal runs, then flags (and later can stop) runs that look very different.', comparison: 'A smoke alarm that first learns what normal looks like in your kitchen.', limit: 'It only notices unusual behavior. It can\'t tell whether an answer is right.' },
  { key: 'execution-id', term: 'Execution ID', plain: 'A unique identifier for one run. Useful when asking for help with that run.' },
  { key: 'execution-memory', term: 'Execution Memory', plain: 'The record of each step and tool call in a run. Useful for finding out what went wrong.' },
  { key: 'files', term: 'Files', plain: 'Reference documents attached to one agent, like a template or checklist.' },
  { key: 'id', term: 'Id', plain: 'The unique handle people type in Mark chat to run an agent, for example @meta_description_writer.' },
  { key: 'impact', term: 'Impact', plain: 'The value of each run, for example 20 minutes saved, used in reports.', comparison: 'A timesheet entry for each run.', limit: null },
  { key: 'inference-level', term: 'Inference level', plain: 'How much reasoning Mark does before answering. Higher is deeper, slower and uses more credits.' },
  { key: 'input-guardrails', term: 'Input guardrails', plain: 'Rules that block certain requests before an agent starts. You write the rule in plain English, then train, test and activate it.' },
  { key: 'llm-provider', term: 'LLM provider', plain: 'Which AI model family runs an agent: Anthropic Claude, Google Gemini or OpenAI GPT.' },
  { key: 'multi-turn', term: 'Multi-turn', plain: 'An agent that stays active in chat for follow-up requests in the same session.', comparison: 'A working session.', limit: 'Memory lasts only for that chat session, and multi-turn agents run as single-turn inside workflows.' },
  { key: 'organization-skills', term: 'Organization skills', plain: 'Shared, reusable guidance (like brand voice) that agents and chats can use. Usually added by an administrator. Specialized agents can only use organization skills.', comparison: 'A shared style guide.', limit: 'Skills only apply when they are attached or matched. Agents don\'t know them automatically.' },
  { key: 'output', term: 'Output', plain: 'The format of an agent\'s result: Text, or JSON with an optional schema.' },
  { key: 'output-evaluation', term: 'Output Evaluation', plain: 'Automatically scores each run from 0 to 100% against criteria and examples you set.', comparison: 'A grading rubric.', limit: 'Scores come from an AI judge, so they\'re a strong signal, not a guarantee.' },
  { key: 'private-executions', term: 'Private executions', plain: 'Only the person who ran the agent can see that run\'s content. Others can still see that it ran.' },
  { key: 'prompt-template', term: 'Prompt template', plain: 'The written instructions Mark follows every time an agent runs.', comparison: 'A step-by-step checklist.', limit: 'The agent may phrase things differently, and fills gaps by guessing if a step isn\'t written.' },
  { key: 'sharing', term: 'Sharing (Can view, Can edit, Can manage)', plain: 'Who can run an agent, change it, or fully manage it. New agents are private until you share them.' },
  { key: 'single-turn', term: 'Single-turn', plain: 'An agent that runs once and returns a finished result. Each run starts fresh.' },
  { key: 'specialized-agent', term: 'Specialized agent', plain: 'A saved set of instructions, inputs, tools and output settings that Mark runs to do one task.', comparison: 'A saved recipe card.', limit: 'A recipe is followed exactly. An agent\'s wording varies a little each run.' },
  { key: 'test-run', term: 'Test Run', plain: 'A run you start from an agent\'s page to check results before sharing.', comparison: 'A practice run.', limit: 'Test runs use real credits and appear in logs.' },
  { key: 'tools', term: 'Tools', plain: 'Actions an agent can take, like reading a web page. An agent can only use the tools you add.', comparison: 'Apps installed on a work laptop.', limit: 'The agent decides when to use a tool based on your instructions, so say when.' },
  { key: 'trigger-from-chat', term: 'Trigger from Chat', plain: 'When on, people can find an agent and @mention it in Mark chat.' },
  { key: 'variables', term: 'Variables', plain: 'Inputs the person provides each time they run an agent, written in the prompt as [[name]].', comparison: 'Blank fields on a form.', limit: null },
  { key: 'version-history', term: 'Version history', plain: 'Every save creates a version you can view and restore.', comparison: 'Save points.', limit: 'Attached files may need re-uploading after a restore.' },
  { key: 'workflow-agent', term: 'Workflow agent', plain: 'An agent that connects several specialized agents with triggers, conditions and loops. Covered in a later version of this workshop.' }
];
export const glossaryByKey = k => GLOSSARY.find(g => g.key === k);

export const PRACTICES = [
  { t: 'Pick one task you can describe with one verb', m: [1], tag: 'Scope', why: 'Single-task agents are easier to test and fail less often.', how: 'Write the task as "verb + thing", for example "Summarize meeting notes".', route: '/m1/one-task-rule' },
  { t: 'Choose something frequent and boring for your first agent', m: [1], tag: 'Scope', why: 'Frequent tasks pay back quickly and give you lots of real test inputs.', how: 'List tasks you do weekly, then pick the most repetitive one.', route: '/m1/one-task-rule' },
  { t: 'Write the output section first', m: [1], tag: 'Planning', why: 'If you can\'t describe the result, the agent can\'t produce it consistently.', how: 'Describe format, sections and length before anything else.', route: '/m1/inputs-output' },
  { t: 'Keep inputs to 1–3', m: [1], tag: 'Planning', why: 'Every variable is something people must fill in each run.', how: 'Ask "does this change every run?" If not, it belongs in the prompt.', route: '/m1/inputs-output' },
  { t: 'Always include what to do when it can\'t complete the task', m: [1, 3], tag: 'Reliability', why: 'Without it, agents may fill gaps by guessing.', how: 'Add: "If you can\'t [do X], say what failed and stop."', route: '/m1/when-it-cant-finish' },
  { t: 'Make rules checkable', m: [1, 5], tag: 'Quality', why: 'Checkable rules turn straight into evaluation criteria.', how: 'Replace "engaging" with something measurable, like "end with a benefit".', route: '/m1/steps-and-rules' },
  { t: 'One great example teaches more than many rules', m: [1, 3], tag: 'Prompting', why: 'Examples show tone and format faster than descriptions.', how: 'Add one great example and one to avoid in the Examples section.', route: '/m3/clear-prompts' },
  { t: 'Put first-agent rules in the prompt template', m: [2], tag: 'Context', why: 'You don\'t have to wait for an admin-made skill.', how: 'Turn shared rules into an organization skill when a second agent needs them.', route: '/m2/where-info-goes' },
  { t: 'Agents with no tools are the easiest first build', m: [2], tag: 'Scope', why: 'Fewer moving parts means faster success.', how: 'Start with a paste-in task like summarizing or rewriting.', route: '/m2/tools-and-connectors' },
  { t: 'Only add tools the prompt actually uses', m: [3], tag: 'Tools', why: 'Extra tools make behavior less predictable.', how: 'Name each tool in the step where it\'s used, and add only those.', route: '/m3/builder-anatomy' },
  { t: 'Write prompts top to bottom with CLEAR', m: [3], tag: 'Prompting', why: 'A linear prompt is easier for the agent to follow.', how: 'Context, Logic, Examples, Action, Result. No "as mentioned above".', route: '/m3/clear-prompts' },
  { t: 'Label ID variables with their type', m: [3], tag: 'Prompting', why: 'It helps Mark find the right item.', how: 'Write "Task: [[task_id]]", not just "[[task_id]]".', route: '/m3/clear-prompts' },
  { t: 'Start at Standard inference', m: [3], tag: 'Settings', why: 'Higher levels are slower and use more credits.', how: 'Move up one level only if testing shows shallow answers.', route: '/m3/inference-level' },
  { t: 'Leave optional settings at their defaults', m: [3], tag: 'Settings', why: 'Every changed setting is one more thing to check when results look wrong.', how: 'Fill in the 7 Must fields and Impact. Change others only when testing says so.', route: '/m3/builder-anatomy' },
  { t: 'Read every field on Mark\'s Review Agent card', m: [3], tag: 'Building', why: 'You know what good looks like for your task.', how: 'Compare each field against your plan before clicking Create Agent.', route: '/m3/two-ways-to-create' },
  { t: 'Test 5 kinds of input, especially a broken one', m: [4], tag: 'Testing', why: 'Edge cases are where agents embarrass you.', how: 'Typical, second typical, large, minimum, broken.', route: '/m4/five-test-cases' },
  { t: 'Change one thing at a time', m: [4], tag: 'Testing', why: 'Otherwise you won\'t know which change helped.', how: 'Change, re-run the same input, compare.', route: '/m4/diagnose-and-fix' },
  { t: 'Use Execution Memory to see why a run went wrong', m: [4], tag: 'Testing', why: 'It shows each step and tool call.', how: 'Open it under the Test Run results.', route: '/m4/test-run-panel' },
  { t: '5–10 purposeful test runs is plenty', m: [4], tag: 'Cost', why: 'Every run uses credits.', how: 'Change something before you re-run.', route: '/m4/five-test-cases' },
  { t: 'Start with 3–5 criteria and an 80% passing score', m: [5], tag: 'Quality', why: 'Easy to maintain, and a fair bar for a new agent.', how: 'Turn your plan\'s rules into testable statements.', route: '/m5/good-criteria' },
  { t: 'Reject messy test runs from the guardrail baseline', m: [5], tag: 'Quality', why: 'Odd test runs can skew what counts as normal.', how: 'Reject them in the agent\'s Logs.', route: '/m5/how-guardrails-learn' },
  { t: 'Pilot with 2–3 people before sharing org-wide', m: [6], tag: 'Launch', why: 'Friendly testers catch problems privately.', how: 'Share with Can view for 3–5 days, then fix and widen.', route: '/m6/soft-launch' },
  { t: 'Give most people Can view, not Can edit', m: [6], tag: 'Launch', why: 'Can edit lets people change your prompt.', how: 'Keep Can edit for a trusted co-builder.', route: '/m6/visibility-and-access' },
  { t: 'Fill in Impact from day one', m: [3, 6], tag: 'ROI', why: 'It\'s how you show the agent\'s value later.', how: 'Add minutes saved per run in the builder.', route: '/m3/builder-anatomy' },
  { t: 'Watch your agent', m: [6], tag: 'Operations', why: 'You\'ll hear about failures and guardrail alerts quickly.', how: 'Use Watch on the agent after launch.', route: '/m6/soft-launch' }
];

export const FAQ = [
  { m: 'Site', q: 'Is this site connected to my Mark instance?', a: 'No. It\'s a self-paced guide. You build in Mark. The site only saves your progress (lessons, quiz scores, bookmarks) in your browser.' },
  { m: 'Site', q: 'Does the site save my work?', a: 'Only your progress, in this browser. It never asks for or stores your agent\'s details.' },
  { m: 'Site', q: 'Can I use this site to run a workshop for my team?', a: 'Yes. Turn on Facilitator mode in the header for a presenter view with notes, a timer and hidden quiz answers.' },
  { m: 'Module 1', q: 'Do I have to plan first? Can\'t I just build?', a: 'You can, but 20 minutes of planning saves an hour of fixing. Most agents that don\'t work were never clearly described.' },
  { m: 'Module 1', q: 'My manager wants it to do the whole process.', a: 'Build one task first. Once it works, build more agents and connect them later with a workflow agent.' },
  { m: 'Module 1', q: 'How many inputs should an agent have?', a: 'As few as possible, usually 1–3. Each variable is something people must fill in every time.' },
  { m: 'Module 2', q: 'Does the agent already know our brand and products?', a: 'Only what\'s in its prompt template, attached files, or an attached organization skill.' },
  { m: 'Module 2', q: 'Do I need IT or an admin?', a: 'Usually not for a first agent. You need an admin for the Agent Builder role, organization skills, turning tools on or connecting products.' },
  { m: 'Module 2', q: 'Why can\'t my agent use my personal skill?', a: 'Specialized agents only use organization skills, so everyone who runs the agent gets consistent results.' },
  { m: 'Module 3', q: 'What are the double brackets?', a: 'Variables: inputs people provide each time, like [[url]]. Each one needs a matching variable with the same spelling.' },
  { m: 'Module 3', q: 'Do I have to fill in the whole form?', a: 'No. Fill in the 7 Must fields and leave the rest at their defaults, or ask Mark chat to draft it for you.' },
  { m: 'Module 3', q: 'Which inference level should I pick?', a: 'Standard. Move up one level only if answers are too shallow.' },
  { m: 'Module 3', q: 'Single-turn or multi-turn?', a: 'Single-turn for a first agent. It\'s simpler to build and test, and each run starts fresh.' },
  { m: 'Module 3', q: 'Can other people see my agent while I build it?', a: 'No. New agents are private until you share them.' },
  { m: 'Module 4', q: 'Why is the wording different each time?', a: 'AI models vary their wording. Check that the structure, rules and quality stay consistent.' },
  { m: 'Module 4', q: 'Will it get better the more people use it?', a: 'Not by itself. It improves when you edit its instructions, tools or settings.' },
  { m: 'Module 4', q: 'Does testing cost anything?', a: 'Test runs use credits like any run. 5–10 purposeful tests is plenty.' },
  { m: 'Module 4', q: 'I made it worse. Can I undo?', a: 'Yes. Open version history and restore an earlier version. Re-upload any files afterwards.' },
  { m: 'Module 5', q: 'Will the guardrails block my agent right away?', a: 'No. They learn from the first 20 successful runs, flag unusual runs for the next 30, and can only stop runs after 50.' },
  { m: 'Module 5', q: 'Can Mark grade my agent automatically?', a: 'Yes. Output Evaluation scores every run against your criteria and examples.' },
  { m: 'Module 6', q: 'Should I share with everyone right away?', a: 'Start with 2–3 friendly testers, then share across your organization.' },
  { m: 'Module 6', q: 'What\'s the difference between Can view and Can edit?', a: 'Can view means they can run it. Can edit means they can change its instructions and share it.' },
  { m: 'Module 6', q: 'How do people use my agent?', a: 'In Mark chat, they type @your_agent_id and give it the inputs. A short usage guide helps.' }
];

export const TROUBLE = [
  { q: 'I can\'t see the Add Agent button', a: 'Usually a missing Agent Builder role, a plan that doesn\'t include it, or generative AI turned off in Opti ID.', fix: 'Ask your Mark administrator to assign the Agent Builder role in the Opti ID Admin Center and confirm generative AI is on.' },
  { q: 'Mark doesn\'t show a Review Agent card', a: 'The create_or_edit_agent tool isn\'t active or enabled in chat.', fix: 'Ask your admin to enable it, or fill in the builder form yourself.' },
  { q: 'The Id isn\'t available', a: 'Another agent already uses it.', fix: 'Add a word, for example your team name, or pick one of Mark\'s suggestions.' },
  { q: 'A variable says "Not in use"', a: 'The prompt template doesn\'t mention that variable.', fix: 'Add [[name]] to the prompt with the exact same spelling, or delete the variable.' },
  { q: 'The agent doesn\'t use a tool', a: 'The tool isn\'t added under Tools, isn\'t turned on, or the prompt doesn\'t say when to use it.', fix: 'Add it under Tools and name it in the step where it should be used. Check Execution Memory to confirm it ran.' },
  { q: 'The agent makes things up', a: 'No "if it can\'t" rule, or a tool failed silently.', fix: 'Add "Only use information from [source]. If you can\'t, say what failed and stop." Check Execution Memory.' },
  { q: 'My skill isn\'t in Choose skills', a: 'It\'s a personal skill, has no Shortcut, or is inactive.', fix: 'Ask your admin to make it an active organization skill with a Shortcut.' },
  { q: 'Files are gone after restoring a version', a: 'Expected: files aren\'t restored with a version.', fix: 'Re-upload the files.' },
  { q: 'A colleague can\'t find my agent', a: 'It isn\'t shared with them, or Trigger from Chat is off.', fix: 'Share it with Can view and make sure Trigger from Chat is on.' },
  { q: 'A shared link doesn\'t work for someone', a: 'Their access was removed or never granted.', fix: 'Share with them directly, or set General access to Anyone in your organization.' }
];

export const EXAMPLES = [
  { key: 'meta', name: 'Meta Description Writer', verb: 'Write', task: 'Reads a product page and writes 3 search-friendly meta descriptions in the brand voice.', vars: 'url (String, required) · target_keyword (String, optional)', tools: 'A web page reading tool', rules: '155 characters or fewer · no superlatives like "best" or "#1" · use the keyword naturally · end with a benefit or soft call to action', cant: 'If you can\'t open the page, say what failed and stop. Don\'t guess.', output: 'Table: Option, Meta description, Character count, Keyword used (Y/N); then one recommendation', settings: 'Single-turn · Standard · Text · 20 minutes per run', followAlong: true },
  { key: 'notes', name: 'Meeting Notes Summarizer', verb: 'Summarize', task: 'Turns a pasted meeting transcript into decisions and action items.', vars: 'transcript (String, required)', tools: 'None', rules: '5 bullets maximum for decisions · every action item has an owner and a date if mentioned · no speculation', cant: 'If the text isn\'t a meeting transcript, say so and stop.', output: 'Two sections: Decisions (bullets) and Action items (table: Action, Owner, Due)', settings: 'Single-turn · Standard · Text · 15 minutes per run' },
  { key: 'voice', name: 'Brand Voice Rewriter', verb: 'Rewrite', task: 'Rewrites pasted text in the brand voice for a chosen audience.', vars: 'text (String, required) · audience (String, optional)', tools: 'None (an organization skill for brand voice can be added later)', rules: 'Keep the meaning · sentences under 20 words · no jargon · keep product names exactly', cant: 'If the text is empty or not in English, say so and stop.', output: 'The rewritten text, then 3 bullets explaining the main changes', settings: 'Single-turn · Standard · Text · 10 minutes per run' },
  { key: 'themes', name: 'Feedback Theme Finder', verb: 'Group', task: 'Groups pasted customer comments into themes with counts.', vars: 'comments (String, required)', tools: 'None', rules: '3–7 themes · every comment counted once · quote one representative comment per theme', cant: 'If there are fewer than 5 comments, say there isn\'t enough to find themes.', output: 'Table: Theme, Count, Example quote; then the top theme in one sentence', settings: 'Single-turn · Balanced · Text · 30 minutes per run' },
  { key: 'social', name: 'Social Post Drafter', verb: 'Draft', task: 'Reads a blog post and drafts social posts for one channel.', vars: 'url (String, required) · channel (String, required: LinkedIn or X)', tools: 'A web page reading tool', rules: 'LinkedIn: up to 700 characters · X: up to 280 · one hashtag maximum · no claims that aren\'t in the post', cant: 'If you can\'t open the blog post, say what failed and stop.', output: '3 numbered drafts with character counts', settings: 'Single-turn · Standard · Text · 15 minutes per run' },
  { key: 'checker', name: 'Page Checker', verb: 'Check', task: 'Checks a web page against an attached content checklist.', vars: 'url (String, required)', tools: 'A web page reading tool · plus a checklist file', rules: 'Check every item on the checklist · quote the page text for every fail · no rewriting', cant: 'If you can\'t open the page, say what failed and stop.', output: 'Table: Checklist item, Pass/Fail, Evidence', settings: 'Single-turn · Standard · Text · 25 minutes per run' }
];
