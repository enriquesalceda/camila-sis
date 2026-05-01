## Context
I'm starting a vibe-coding project with my 10-year-old daughter: a
2D Mario-style platformer. I'm a senior engineer (Go/AWS background)
but new to game dev. She'll demo this in her class on an iPad via a
public URL. Read CLAUDE.md before doing anything — it has the stack
and constraints.

## Goal
Bootstrap a playable v0.1 we can run locally tonight:
- Vite + Kaplay project, vanilla JS
- A title screen ("Press Space / Tap to Start") with a placeholder game name
- One level with:
  - A player sprite that runs left/right and jumps with gravity
  - Solid ground + 2-3 floating platforms
  - 5 coins to collect (score counter top-left)
  - 1 walking enemy (Goomba-style) — jumping on it defeats it,
    touching it from the side resets the level
  - A goal flag at the right end that triggers a "You Win!" screen
- Keyboard controls (arrow keys + space)
- On-screen touch buttons (left, right, jump) visible only on touch devices
- Use Kenney's Pixel Platformer pack for sprites — download a small
  subset and commit them to /public/sprites
- Level defined as an ASCII string in level1.js (e.g. '=' = ground,
  '?' = coin, 'g' = goomba, 'F' = flag) so my daughter can edit it
- All tunables (player speed, jump force, gravity) at the top of
  the player file as named constants with comments

## Constraints
- No TypeScript, no React, no Tailwind — keep the dependency tree
  minimal so a kid can read package.json and understand it
- No paid assets; CC0 only, attribution in README where required
- Must run in iPad Safari — test that touch controls work in your
  head before finishing
- Don't build all the polish (lives system, multiple levels, music,
  particle effects) yet. Just the loop above. We'll iterate.

## Output Expectations
1. Working project I can `npm install && npm run dev` immediately
2. README with: how to run, how to deploy to Vercel, how to edit
   the level ASCII, asset attribution
3. A short "what's next" list of 5-10 things we could add in
   future sessions (extra levels, power-ups, music, etc.) — I'll
   let my daughter pick which to do first
4. After you finish, give me a 2-sentence summary I can read out
   loud to her about what the game does right now
