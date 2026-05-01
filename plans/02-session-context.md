# Session 1 — Bootstrap context (2026-05-01)

This file is a snapshot of what got built, what calls I made along the way, and
what's still loose at the end of the session — so a future session (or a
future me) can pick up without re-reading the whole conversation.

The plan we worked from is in [`01-original-plan.md`](01-original-plan.md).

---

## What got built

- Vite + Kaplay + vanilla JS project skeleton: `package.json`, `vite.config.js`,
  `index.html`, `.gitignore`, `README.md`.
- `kaplay@^3001.0.19`, `vite@^5.4` — the only deps.
- Four face PNGs resized from ~5 MB → ~70 KB via `sips -Z 256` and copied
  from `media/` into `public/sprites/camila/`. Originals untouched.
- Source layout under `src/`:
  - `main.js` — entry, calls `kaplay()`, registers scenes, jumps to menu.
  - `config.js` — every tunable, plain-English comments. **Camila's edit file.**
  - `loader.js` — `loadAssets()`, sprite registration.
  - `sounds.js` — WebAudio-synthesized SFX (jump, coin, stomp, powerup, death,
    win, scoop). Lazy `AudioContext` unlocked on first user gesture.
  - `input.js` — input bus with `left`/`right` flags + `consumeJump`/`consumeScoop`
    pulses. Both keyboard and touch write into it.
  - `touch.js` — HTML overlay button wiring (touch devices only). Buttons in
    `index.html`, hidden by default, revealed via `data-touch="true"`.
  - `scenes/menu.js` — title, chunky red+yellow rect-text logo with offset shadow.
  - `scenes/level1.js` — gameplay; owns parsing, camera follow, HUD, collisions,
    win/lose. The fattest file in the project.
  - `scenes/win.js` — "YOU WIN!" + Play Again.
  - `scenes/gameover.js` — "Game Over — Press Space".
  - `levels/level1.js` — ASCII level + `parseLevel(ascii, makers, { offsetY })`.
    **Camila's other edit file.**
  - `entities/camila.js` — composite player factory.
  - `entities/notebook.js` — homework enemy (walks, edge-flips, "HW" label).
  - `entities/insect.js` — three-state insect (`walking` → `stunned` → `kicked`).
  - `entities/scoop.js` — projectile.

Production build: 19 modules, 205 KB JS (75 KB gzipped). Well under the 1 MB target.

---

## Decisions made (not from the plan, made during execution)

1. **Image pre-resize to 256×256** via `sips -Z 256` during bootstrap — kept
   `public/` total under ~300 KB instead of ~20 MB. (Was already in plan; confirmed.)
2. **Procedural WebAudio SFX** instead of CC0 samples — same-night ship,
   no network, no attribution overhead. README documents the swap-in path.
3. **Pots vs pipes**: spec said "your call." I picked pots conceptually but
   **never actually drew them** — current level has no obstacle props beyond
   ground + platforms. Probably the first cleanup.
4. **Procedural body**: rect chef apron + legs + face PNG, no Kenney art pack.
5. **Solid platforms** in v0.1 (no jumping up through `-` from below).
6. **Procedural pixel-block logo** for the title, not a font file.
7. **Kicked insect-shell damages Camila** on side contact (SMB Koopa rules).
8. **Level pinned to bottom of camera** via `offsetY = height() - rows * TILE`
   — needed so the level doesn't float in the upper half of the canvas.
9. **Static imports + register-functions for scenes**, not dynamic `await import`
   — clean ordering between `kaplay()` and scene registration.
10. **No anchor-on-area-shape**: see "Bugs hit" below.

---

## Bugs hit during the session (and how they were fixed)

### `rgb is not defined` at module load
`camila.js` had `const HAT_COLOR = rgb(...)` at the top of the file. Kaplay's
`rgb` helper is set as a global only after `kaplay()` runs, so a top-level call
exploded during module evaluation. **Fix**: moved the color constants inside the
`makeCamila` factory.

### `Cannot access 'OUTLINE_COL' before initialization`
A blunt `Edit replace_all` rewrote my own definition `const OUTLINE_COL = rgb(40, 40, 40)`
into `const OUTLINE_COL = OUTLINE_COL`. **Fix**: re-typed the rgb call.

### Camila standing inside the floor
Originally Camila used `anchor('bot')` plus a custom `area({ shape: new Rect(vec2(-w/2, -h), w, h) })`.
In real-browser runs (the user's machine) Kaplay's anchor was getting applied to
the custom shape *on top of* the manual offset, dropping Camila's collision box
roughly a full body-height below where the rendered body was drawn — gravity
pulled her into the ground. Headless Chrome with SwiftShader did *not* reproduce.
**Fix**: replaced the manual shape with a `rect(w, h)` component and plain `area()`,
letting Kaplay auto-derive the collision box. The visual rect is colored to be
the apron base; legs/stripe/face/hat overdraw it via `onDraw`. Commit `3878a82`.

---

## Verification done

- `npm install` → clean.
- `npm run build` → 19 modules transformed, 75 KB gzipped JS, no warnings.
- Headless Chrome (`--enable-unsafe-swiftshader`) screenshot of menu → renders
  red+yellow logo, Camila's face, "Tap or Press Space" prompt.
- Headless screenshot of level scene (via temporary `?autostart=1` hook in
  `menu.js`, since reverted) → all entities render, HUD shows 3UP, ground/
  platforms/nuggets/ice cream/notebooks/insects all paint correctly.
- **Not yet tested in real-browser interactive play** by me. The user reported
  the floor-positioning bug and confirmed the fix.

---

## What's loose / known-but-not-fixed

1. **No pots/pipes drawn** — spec calls for "pipes (or a cooking-themed
   equivalent like big pots)". Currently the level has only ground + platforms.
   Easy follow-up: add a `p` glyph to the legend and `makers.pot(x, y)` factory.
2. **One-way platforms not implemented** — `-` platforms are fully solid;
   Camila bonks her head jumping up through them. Listed in README "what's next."
3. **Synthesized SFX, not CC0 samples** — chiptune-toy vibe. README has the
   swap-in instructions.
4. **No background art** beyond a flat sky color. No clouds, mountains, parallax.
5. **No level-end success polish** beyond the dance + transition — no fireworks,
   no score, no time bonus.
6. **iPad multi-touch not real-device-tested** — works in Chrome iPad emulator
   but not physically verified on hardware.
7. **The `media/` source PNGs are committed** alongside the resized copies in
   `public/sprites/camila/`. Slightly redundant (~20 MB), but kept as the
   archival originals per spec.
8. **`instructions/one.md` shows up dirty** in `git status` because the user
   edited "8-year-old" → "10-year-old" before the session. Not staged in any
   of my commits — that's the user's own pending change.

---

## Commits added this session (mine)

- `4b023e6` — first playable build of Super Camila Sis
- `3878a82` — keep Camila standing on top of the floor instead of inside it

The `9631b53 first iteration:` commit between those two is the user's own
(they swapped the throw key from X to Z).

---

## How to pick this back up next session

1. Run `npm install && npm run dev` from the repo root.
2. Open `http://localhost:5173`. Press space, play through level 1, hit the flag.
3. The single-source-of-truth files for changes Camila wants:
   - **gameplay numbers** → `src/config.js`
   - **level layout** → `src/levels/level1.js`
   - **costume colors** → constants at the top of `makeCamila` in
     `src/entities/camila.js`
4. The most likely next asks (from the README's "what's next" list and the
   loose-ends list above): real CC0 sound samples, level 2, a boss, a score
   counter, custom level editor.
