# Project: CAMILA SIS

A 2D Mario-style platformer built with my 10-year-old daughter.
Will be demoed in her classroom on iPad via a public URL.

## Stack
- Kaplay (game engine, vanilla JS — no TypeScript)
- Vite (dev server + build)
- Deployed to Vercel as a static site
- Art: Kenney pixel-platformer pack (CC0)
- Sounds: freesound.org / OpenGameArt (CC0/CC-BY only, attribute in README)

## Audience constraints
- My daughter co-edits this. Code must be readable by a curious kid:
  - Plain function names, no clever abstractions
  - Game tunables (speeds, jump height, gravity, level layouts) live in a single `config.js` or top-of-file constants block so she can tweak numbers and see results
  - Levels defined as ASCII-art strings, not JSON or programmatic builders
  - Comments explain *why*, in plain English, on any non-obvious line

## Platform constraints
- Must work on iPad Safari (latest) — this is the demo target
- Keyboard controls (arrows + space) AND on-screen touch controls (left, right, jump) that only appear on touch devices
- Lock orientation to landscape, or design for both
- No external runtime dependencies beyond Kaplay — no analytics, fonts from CDNs, etc. (school wifi is unreliable; bundle everything)

## Conventions
- One file per scene (`scenes/menu.js`, `scenes/level1.js`, etc.)
- Sprites loaded centrally in `loader.js`
- No build-time magic; `npm run dev` and `npm run build` are the only commands she needs to know
- Don't introduce new libraries without asking

## Workflow
- Small, frequent commits with kid-friendly messages
- After any change, summarize what's new in 1-2 sentences I can read to her
