# Super Camila Sis — v0.1 Bootstrap Plan

## Context

This is a from-scratch bootstrap of a 2D Mario-homage platformer the user is building with his 10-year-old daughter Camila to demo in her classroom on iPad over school wifi. The repo at `/Users/enriquesalceda/fun/camila-sis/` currently contains only `claude.md` (stack), `instructions/one.md` (game spec), `media/{normal,power,tall,dead}.png` (Camila's face photos, ~5MB each), and `.git`. The user is a senior Go/AWS engineer new to game dev; the daughter is the co-editor and the primary success metric is that **she can tweak `config.js` and `levels/level1.js` and see results**, not architectural cleanliness. Stack is locked per `claude.md`: Vite + Kaplay + vanilla JS, no TypeScript, no React, no external runtime deps. Goal is something playable tonight: title screen → one side-scrolling level (cook-themed: chicken nuggets, ice cream, homework + insects, pots) → win/lose loop. iPad Safari is the demo target so touch + landscape must work.

## Decisions made (override before approving if you disagree)

1. **Image pre-resize**: copy `media/*.png` to `public/sprites/camila/*.png` resized to 256x256 via `sips -Z 256` (macOS built-in). Originals in `media/` stay untouched. Rationale: 4 × 5MB = 20MB of photos on school wifi is a bad first impression for the demo, and resizing to 256 still gives crisp 32x32 in-game faces.
2. **SFX**: synthesize procedurally via WebAudio (square waves, oscillator arpeggios, noise bursts) instead of sourcing CC0 samples. Rationale: same-night ship, zero network dependency, zero attribution overhead. README documents how to swap in real WAVs later — that becomes the obvious follow-up if Camila says they sound weird.
3. **Pots, not pipes** for level obstacles (cooking theme; spec said "your call").
4. **Procedural body** under the photo face (rect chef apron + legs), no Kenney art pack — fewer deps, more kid-tweakable.
5. **Kicked-insect-ball damages Camila** on side contact (matches SMB Koopa rules).
6. **Solid platforms** in v0.1 (no jumping up through `-` from below). One-way platforms listed in README "what's next."
7. **Procedural pixel-block logo** for the title (rect letters in red+yellow with offset shadow). No font file. Spec said "do NOT copy SMB logo, font, or color treatment exactly — make our own."

## Key Kaplay facts (verified)

- Package: `kaplay`, pinned to `^3001.0.19`. `4000.0.0-alpha` is incompatible — do not auto-bump.
- Init signature: `kaplay({ canvas, width, height, letterbox, background, global, pixelDensity, touchToMouse, debug })`. **Gravity is global** — `setGravity(N)` after init, not a `body()` option.
- Scene state passes via `go("level1", { lives: 2 })` → received as the scene callback's argument.
- Camera follow has no built-in component in v3001; set `camPos(player.pos.x, height()/2)` inside `onUpdate`, clamped to level edges.
- Audio on iOS Safari requires unlocking the `AudioContext` from a user gesture — wire `ctx.resume()` to the menu's first input handler.

## File tree

```
/Users/enriquesalceda/fun/camila-sis/
├── claude.md                       (existing, keep)
├── instructions/one.md             (existing, keep)
├── media/                          (existing — leave originals alone)
├── package.json                    NEW
├── vite.config.js                  NEW
├── index.html                      NEW
├── .gitignore                      NEW
├── README.md                       NEW
├── public/
│   ├── sprites/camila/{normal,power,tall,dead}.png   COPIED + RESIZED from media/
│   └── sounds/                     (empty placeholder)
└── src/
    ├── main.js                     init Kaplay, setGravity, loadAssets, register scenes, go("menu")
    ├── config.js                   ALL tunables (constants only, no logic) — Camila's tweak file
    ├── loader.js                   loadSprite() calls + registerSounds()
    ├── sounds.js                   WebAudio SFX synthesis + play(name)
    ├── input.js                    input bus: left/right flags, consumeJump/consumeScoop pulses
    ├── touch.js                    HTML overlay button wiring (touch devices only) + setScoopVisible
    ├── scenes/
    │   ├── menu.js                 procedural rect logo + "Press Space / Tap to start"
    │   ├── level1.js               gameplay scene; calls parseLevel, owns HUD + camera + win/lose
    │   ├── win.js                  "You Win!" + Play Again
    │   └── gameover.js             "Press Space to Restart"
    ├── levels/level1.js            ASCII string + LEGEND + parseLevel(ascii, makers)
    └── entities/
        ├── camila.js               makeCamila(x, y, { lives }) — composite parent + face/hat/apron/leg children, setState/takeHit/dance
        ├── notebook.js             makeNotebook(x, y) — walking enemy, edge-flip, "HOMEWORK" label
        ├── insect.js               makeInsect(x, y) — three states: walking → stunned → kicked
        └── scoop.js                makeScoop(x, y, dir) — projectile with light gravity
```

## Critical implementation notes

### `src/main.js`
```
kaplay({
  canvas: document.getElementById("game"),
  width: 1024, height: 576,           // 16:9; letterboxes on iPad landscape
  letterbox: true,
  background: [135, 206, 235],
  global: true,                        // expose add/scene/go etc as globals — kid-readable
  pixelDensity: 1,
  touchToMouse: false,                 // we use HTML overlay buttons; don't double-fire
})
setGravity(GRAVITY)
loadAssets()
registerScenes()
go("menu")
```

### `src/config.js` — full tunable list
```
GRAVITY = 1600              // bigger = falls faster
RUN_SPEED = 220              // Camila's horizontal speed, px/s
JUMP_FORCE = 700             // upward velocity on jump, px/s
TILE = 32                    // every level glyph = this many px

CAMILA_FACE_SCALE = 0.125    // source 256 → 32 in-game
CAMILA_SMALL_HEIGHT = 48
CAMILA_TALL_HEIGHT  = 64
INVULN_MS = 1000             // post-hit flicker duration
POWERUP_FLASH_MS = 800       // nugget transformation wiggle length

SCOOP_SPEED = 480
SCOOP_GRAVITY_SCALE = 0.3    // multiplier on top of GRAVITY
SCOOP_COOLDOWN_MS = 350      // throttle on X presses

ENEMY_WALK_SPEED = 60
INSECT_KICK_SPEED = 380

LIVES_AT_START = 3
```
Every constant gets a one-line plain-English comment beside it. README's "Tweak the physics" section walks Camila through these.

### Camila composite (entities/camila.js)
- Parent: `pos`, `area({ shape: new Rect(vec2(0,-32), 24, h) })`, `body()`, `anchor("bot")`, tag `"player"`. Owns physics.
- Children (added via `parent.add([...])`, render in parent transform, no physics):
  - face: `sprite("camila-normal")`, `scale(CAMILA_FACE_SCALE)`, anchor center, top.
  - chef hat: white rect above face.
  - apron body: light-grey rect with red stripe (rect child).
  - two legs: brown rects, swap Y by 2px on a `WALK_FRAME_MS` timer when `vel.x !== 0 && isGrounded()`.
- `setState(name)`: sets `parent.state`, swaps face sprite via `face.use(sprite("camila-"+name))`, resizes parent area for tall/small.
- Power-up flash: 200ms × 4 alternating `power` ↔ `normal`, then settle on `tall`.
- Invuln: `loop(0.1, …)` toggling face opacity for `INVULN_MS`.
- Death: `setState("dead")`, `parent.unuse("body")`, `vel.y = -400`, watch `pos.y > height()+100`.
- Dance at flag: 6-frame loop bobbing `pos.y` and toggling arm-rect children up/down.

### Level parsing (levels/level1.js)
Legend is exported as a `LEGEND` object so README can pull from it. Glyphs: `=` ground (solid), `-` platform, `?` nugget, `i` ice cream, `n` notebook, `b` insect, `F` flag, `S` Camila spawn, `.` empty. `parseLevel(ascii, makers)` walks rows, dispatches each glyph to a maker function, returns `{ spawn, levelWidth }`. Tolerates unknown glyphs with `console.warn` so Camila's typos don't crash.

Initial layout: ~70 cols × 6 rows, 8-12 nuggets, 1-2 ice creams, 4-6 enemies, flag at right edge.

### Combat matrix (level1.js collision handlers)
- player + nugget → destroy nugget, `play("powerup")`, `flashPowerUp` if small.
- player + icecream → destroy, `play("powerup")`, `hasScoop=true`, `setScoopVisible(true)`.
- player + enemy → check stomp (`vel.y > 0 && player.bottom < enemy.top + 6`):
  - stomped notebook → destroy + bounce.
  - stomped walking insect → state `stunned`.
  - stomped stunned insect → state `kicked`, dir away from player.
  - side-hit while invuln → ignore.
  - side-hit + tall + hasScoop → drop scoop, stay tall, invuln.
  - side-hit + tall + !hasScoop → revert to small, invuln.
  - side-hit + small → death (lives--, scene reload OR gameover).
- kicked-shell + enemy → destroy enemy, shell continues.
- kicked-shell + solid (side) → bounce (dir *= -1).
- kicked-shell + player (side) → treats as enemy hit on player.
- scoop + enemy → destroy both, `play("stomp")`.

### Touch overlay (index.html + touch.js)
HTML buttons absolutely positioned over canvas, 88x88px. Detect touch with `('ontouchstart' in window) || navigator.maxTouchPoints > 0`. `pointerdown`/`pointerup` handlers, `e.preventDefault()`, flip `input.js` flags. `setScoopVisible(bool)` toggles the 4th button's `hidden` attr. CSS: `touch-action: manipulation`, `user-select: none`, `-webkit-tap-highlight-color: transparent`.

### Landscape on iPad
Cannot reliably `screen.orientation.lock` from a non-PWA Safari URL. Ship a CSS-only overlay shown when `@media (orientation: portrait)`: full-screen black with "📱↻ Rotate to landscape!" README points users to "Add to Home Screen" for fullscreen demo-day use.

### SFX (sounds.js) — recipes
- `jump`: square 220→660Hz over 80ms, gain 0.15.
- `coin`: square arpeggio 988→1318Hz, 50+80ms, envelope 0→0.2→0.
- `stomp`: lowpass-filtered (200Hz) white noise, 100ms, gain 0.3.
- `powerup`: square arpeggio C-E-G-C (523-659-784-1046), 60ms each.
- `death`: sawtooth 800→100Hz over 600ms, gain 0.25.
- `win`: ascending two-octave arpeggio + held final note.
- `scoop`: highpass-filtered (800Hz) noise burst, 200ms, gain 0.15.

`AudioContext` created lazily on first user input. Menu's first space/tap call calls `ctx.resume()`.

### Lives + flow
Lives in scene-arg closure: `scene("level1", ({ lives }) => { let livesLeft = lives; ... })`. Death → `livesLeft--`, scene reload via `go("level1", { lives: livesLeft })` for a fresh respawn. `livesLeft === 0` → `go("gameover")`. HUD: `add([ text("3UP"), pos(width()-80, 16), fixed(), z(100) ])` — `fixed()` keeps it screen-locked through camera scroll.

## Image copy step (bootstrap shell)
```
mkdir -p public/sprites/camila
for f in normal power tall dead; do
  sips -Z 256 -s format png "media/$f.png" --out "public/sprites/camila/$f.png"
done
```
Verify all four exist before wiring `loadSprite()` calls.

## Existing code to reuse
**None** — repo has no source files yet. Only `claude.md` (read at start), `instructions/one.md` (read at start), and the four PNGs in `media/`.

## Critical files (modified during execution)
- /Users/enriquesalceda/fun/camila-sis/package.json (NEW)
- /Users/enriquesalceda/fun/camila-sis/vite.config.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/index.html (NEW)
- /Users/enriquesalceda/fun/camila-sis/.gitignore (NEW)
- /Users/enriquesalceda/fun/camila-sis/README.md (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/main.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/config.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/loader.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/sounds.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/input.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/touch.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/scenes/menu.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/scenes/level1.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/scenes/win.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/scenes/gameover.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/levels/level1.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/entities/camila.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/entities/notebook.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/entities/insect.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/src/entities/scoop.js (NEW)
- /Users/enriquesalceda/fun/camila-sis/public/sprites/camila/{normal,power,tall,dead}.png (COPIED + RESIZED)

## Verification

End-to-end smoke test the implementor must run before declaring done:

1. `node -v` ≥ 18, `npm install` succeeds.
2. `npm run dev` opens `http://localhost:5173`. Menu's "SUPER CAMILA SIS" logo renders.
3. Press Space → level1, Camila visible at spawn `S`, ground beneath her, HUD says "3UP".
4. Walk left/right → camera follows, stops at level edges.
5. Eat `?` → power flash + grow tall + power-up SFX.
6. Side-hit `n` → revert to small with flicker invuln + reverse-jump knockback. Walk into `n` again during flicker → ignored. After flicker → walk into `n` → die. HUD reads "2UP", scene reloads.
7. Lose all 3 lives → game-over scene. Press Space → menu.
8. From menu, restart → eat `i` → fourth touch button (or X key) fires scoop forward → defeats next enemy on contact.
9. Stomp insect twice → walking → stunned → kicked. Kicked ball slides, defeats other enemies, bounces off walls.
10. Touch flag → freeze + dance + win SFX → "You Win!" → "Play Again?" → restart.
11. Chrome DevTools → device toolbar → iPad Pro 11" landscape → reload → confirm canvas letterboxed, all 4 touch buttons render and fire.
12. Same DevTools session → portrait → confirm rotate-prompt overlay shows.
13. Real iPad over LAN (`npm run dev -- --host`, point Safari at `http://<mac-lan-ip>:5173/`): repeat 3-10. Specifically test simultaneous touches (hold left + tap jump while throwing scoop) and audio unlock-on-first-tap.
14. `npm run build && npm run preview` → production bundle works, JS bundle < 1MB, images ~200KB total.
15. (Optional, post-approval) Deploy to Vercel: `npx vercel` → preview URL. Smoke test on real iPad over school-wifi-equivalent (DevTools "3G" throttle).

Then commit (small kid-friendly message per claude.md workflow) and produce the 2-sentence read-aloud summary the user asked for in `instructions/one.md` output expectation #5.

## Risks to watch during implementation

- **Kaplay v3001 API drift**: gravity is global now. `body()` no longer takes a `gravity` option. `fixed()` may have been renamed — check `kaplayjs.com/docs` if a screen-locked HUD doesn't stick. `face.use(sprite(...))` for runtime sprite swap may behave differently than older Kaboom — fallback is to use spritesheet frames via `loadSprite("camila", path, { sliceX: 4 })` and swap `frame`.
- **iOS audio unlock**: silent SFX is an easy bug to ship. Test the very first tap actually plays a sound on a real device.
- **iPad multi-touch**: simultaneous-touch on different buttons can drop a `pointerdown`. If reproducible on hardware, fall back to `touchstart`/`touchend` with `Touch.identifier` tracking.
- **Synthesized SFX vibe**: chiptune-toy, not Mario-y. Likely the first thing Camila wants to change. README's "what's next" should call this out so it's already on her menu.
