## Context
I'm starting a vibe-coding project with my 8-year-old daughter Camila:
a 2D platformer that's a loving homage to Super Mario Bros, starring her.
I'm a senior engineer (Go/AWS background) but new to game dev. She'll
demo this in her class on an iPad via a public URL. Read CLAUDE.md
before doing anything — it has the stack and constraints.

## Goal
Bootstrap a playable v0.1 we can run locally tonight: a single-level
platformer called "Super Camila Sis" where Camila is a cook who
collects chicken nuggets and ice cream while dodging homework and
insects, and dances at the goal.

### Game spec
- **Title:** "Super Camila Sis" — title screen with a chunky pixel-art
  logo in red/yellow that evokes classic 80s platformer logos
  (think NES-era arcade style). Do NOT copy the Super Mario Bros
  logo, font, or color treatment exactly — make our own that has
  the same energy.
- **Character:** Camila, a cook (chef hat). Use these images for her
  face/state — copy them from my local machine into
  /public/sprites/camila/ at project setup:
    - normal.png  → small/default state
                    (source: /Users/enriquesalceda/fun/camila-sis/media/normal.png)
    - power.png   → brief transition frame when she eats a nugget or ice cream
                    (source: /Users/enriquesalceda/fun/camila-sis/media/power.png)
    - tall.png    → tall/powered-up state
                    (source: /Users/enriquesalceda/fun/camila-sis/media/tall.png)
    - dead.png    → death state
                    (source: /Users/enriquesalceda/fun/camila-sis/media/dead.png)
  Build the body sprite procedurally (chef apron + legs) under the
  face image, or use a Kenney character base recolored — your call,
  pick whichever looks better at 16x16 / 32x32.
- **Lives:** Camila starts with 3 lives ("3UP" displayed top-right).
  Losing all lives → Game Over screen with "Press Space to Restart".
- **Power-ups:**
    - 🍗 **Chicken nugget** (replaces mushroom): small Camila → tall Camila.
      Tall Camila can take one hit and revert to small instead of dying.
    - 🍦 **Ice cream cone** (replaces fire flower): grants ice-scoop
      throwing. Press X (or tap a "scoop" button on touch) to throw
      an ice cream scoop projectile that defeats enemies on contact.
      Lost when hit.
- **Enemies:**
    - 📓 **Homework notebook** (replaces Goomba): walks side to side,
      flips at edges/walls. Stomp from above to defeat. The notebook
      cover should clearly read "HOMEWORK".
    - 🐛 **Insect** (replaces Koopa): walks side to side; stomping
      stuns it into a shell-like ball that Camila can kick. Kicked
      ball slides and defeats other enemies it touches. Hits a wall
      → bounces back.
- **Level:** ONE level only. Side-scrolling, ground + floating
  platforms, pipes (or a cooking-themed equivalent like big pots —
  your call), 8-12 nuggets/coins to collect, 1-2 ice creams, 4-6
  enemies, and a **goal flag** at the right end. Define the layout
  as an ASCII string in `levels/level1.js` so Camila can edit it.
  Suggested legend:
    `=` ground, `-` platform, `?` nugget, `i` ice cream,
    `n` notebook enemy, `b` insect, `F` flag, `.` empty
- **Win condition:** Touch the flag → camera locks, music shifts to
  a victory jingle, Camila plays a 4-6 frame **dance animation**
  (bobbing up and down, arms up, simple sprite swap is fine), then
  "You Win!" overlay with "Play Again?".
- **Sounds:** Mario-*style* palette only — short coin "ping", jump
  "boing", stomp thud, power-up arpeggio, death descending tone,
  win jingle. Source from freesound.org / OpenGameArt under CC0 or
  CC-BY (attribute in README). Do NOT use ripped Nintendo audio.

### Controls
- Keyboard: arrow keys to move, Space to jump, X to throw ice cream
- Touch (iPad): on-screen left/right/jump buttons that only render
  on touch devices. When ice cream power is active, a fourth "scoop"
  button appears.

### Tunables
All physics constants (player run speed, jump force, gravity, scoop
speed, scoop cooldown, enemy walk speed) at the top of the relevant
file as named constants with comments explaining what each does in
plain English. Camila will tweak these.

## Constraints
- Stack per CLAUDE.md: Vite + Kaplay + vanilla JS, no TypeScript,
  no React, no Tailwind.
- No paid assets; CC0 / CC-BY only, attribution in README.
- Must run in iPad Safari — verify touch controls and landscape
  orientation work.
- This is a homage/parody, not a clone: do not reproduce Nintendo
  branding, the SMB logo, the SMB font, ripped sprites, or ripped
  audio. Original art and sounds in the same *spirit* are the goal.
- Don't build polish we didn't ask for (multiple levels, scoring
  leaderboards, particle effects, etc.). Just the loop above.

## Output Expectations
1. Working project: `npm install && npm run dev` runs immediately.
2. Camila's 4 face images copied from the source paths into
   /public/sprites/camila/ during setup. Confirm they exist before
   wiring them up.
3. README with: how to run, how to deploy to Vercel, how to edit
   the level ASCII, how to tweak the physics constants, asset
   attribution list.
4. A "what's next" list of 5-10 ideas for future sessions (extra
   levels, boss fight, more power-up foods, music tracks, etc.) —
   I'll let Camila pick which to do first.
5. After you finish, give me a 2-sentence summary I can read out
   loud to Camila about what her game does right now.
