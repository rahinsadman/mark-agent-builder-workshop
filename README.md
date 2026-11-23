# Mark Agent Builder Workshop

An interactive, self-paced version of the Optimizely FDE-led agent builder workshop. It covers phases 4 to 9 of building a specialized agent in **Optimizely Mark** (formerly Opal): Plan, Prepare, Build, Test, Quality and Share.

**Live site:** https://rahinsadman.github.io/mark-agent-builder-workshop/

## What's inside
- 6 modules (28 lessons), a primer, 4 hands-on labs and 7 knowledge checks
- Reference sections, a glossary and printable handouts (PDF)
- Progress is saved only in your own browser (`localStorage`). Nothing is sent to a server.

> This site is a teaching guide. It does not build, store or run agents. Build your agents in Mark itself, and see the [official Mark documentation](https://docs.optimizely.com/agent-platform/docs).

## Repository layout
| Path | Purpose |
|---|---|
| `site/` | Production build (static HTML, CSS and ES modules, with no dependencies) |
| `site/**/*.b64` | Fonts and PDFs stored base64-encoded, decoded at deploy time |
| `site/SHA256SUMS` | Checksums used to check that every file is restored byte-for-byte |
| `.github/workflows/deploy-pages.yml` | Decodes, verifies and publishes `site/` to the `gh-pages` branch |

## Deploying
Every push to `main` that touches `site/` republishes the site. To trigger it by hand: **Actions → Deploy workshop to GitHub Pages → Run workflow**.

GitHub Pages serves the `gh-pages` branch from the root (**Settings → Pages → Deploy from a branch → gh-pages / (root)**).

## Tested
173 automated end-to-end checks (routes, accessibility, components, global behaviour and responsive layouts from 360 to 1440 px) passed with no console or network errors.
