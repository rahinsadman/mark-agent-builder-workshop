# Mark Agent Builder Workshop

An interactive, self-paced version of the Optimizely FDE-led agent builder workshop. It covers phases 4 to 9 of building agents in **Optimizely Mark** (formerly Opal): Plan, Prepare, Build, Workflows, Test, Quality and Share.

**Live site:** https://rahinsadman.github.io/mark-agent-builder-workshop/

## What's inside
- A primer and 7 modules (35 lessons), 5 hands-on labs and 8 knowledge checks
- **Module 4: Connect agents with workflow agents**: triggers, the workflow builder, passing data between steps, conditions, loops and code steps, testing and execution logs
- Reference sections (Field encyclopedia, glossary, best practices, FAQ and troubleshooting) and 5 printable handouts (PDF)
- Progress is saved only in your own browser (`localStorage`). Nothing is sent to a server.

> This site is a teaching guide. It does not build, store or run agents. Build your agents in Mark itself, and see the [official Mark documentation](https://docs.optimizely.com/agent-platform/docs). Workflow agents are in private GA and not available in every Mark instance yet.

## Repository layout
| Path | Purpose |
|---|---|
| `site/` | Production build (static HTML, CSS and ES modules, with no dependencies) |
| `site/**/*.b64` | Fonts and PDFs stored base64-encoded, decoded at deploy time |
| `site/SHA256SUMS` | The manifest: only these files are published, and each is checked byte-for-byte |
| `.github/workflows/deploy-pages.yml` | Decodes, verifies, removes older build files and publishes `site/` to the `gh-pages` branch |

## Deploying
Every push to `main` that touches `site/` republishes the site. To trigger it by hand: **Actions → Deploy workshop to GitHub Pages → Run workflow**.

GitHub Pages serves the `gh-pages` branch from the root (**Settings → Pages → Deploy from a branch → gh-pages / (root)**).

## Tested
200 automated end-to-end checks (routes, accessibility, components, global behaviour, progress migration and responsive layouts from 360 to 1440 px) passed with no console or network errors.
