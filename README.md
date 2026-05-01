# Super Camila Sis

A 2D platformer made by Camila and her dad. Camila is a cook who eats
chicken nuggets and ice cream, dodges homework and insects, and dances
at the goal. It's a loving homage to classic 80s platformers — none of
the art, sounds, or words come from any other game.

## Run it on your computer

```sh
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To play it on an iPad or phone on the same wifi:

```sh
npm run dev -- --host
```

Vite prints a second URL like `http://192.168.x.x:5173`. Open that on
the iPad in Safari. Tap **Share → Add to Home Screen** and you'll get
a fullscreen icon — that's the demo-day setup.

## Deploy to the internet (Vercel)

The fastest path is the Vercel CLI:

```sh
npx vercel        # follow the prompts; it picks up Vite automatically
```

Or build locally and drag `dist/` to vercel.com:

```sh
npm run build
# then drop the `dist/` folder onto https://vercel.com/new
```

## Edit the level

Open [`src/levels/level1.js`](src/levels/level1.js). The level is just
text! Each letter is one square:

| Letter | What it is |
| :-: | --- |
| `=` | ground (hard) |
| `-` | floating platform (also hard) |
| `?` | chicken nugget (makes Camila tall) |
| `i` | ice cream (lets Camila throw scoops with X) |
| `n` | homework notebook (enemy — jump on its head) |
| `b` | insect (enemy — jump twice to kick its shell) |
| `F` | goal flag (touch to win) |
| `S` | where Camila starts |
| `.` | empty sky |

Save the file and your browser will reload by itself.

## Tweak the physics

Open [`src/config.js`](src/config.js). Every number has a comment
saying what it does in plain English. Try these to start:

- `GRAVITY = 1600` — bigger = falls faster, smaller = moon-jump
- `JUMP_FORCE = 700` — bigger = jumps higher
- `RUN_SPEED = 220` — bigger = Camila runs faster
- `ENEMY_WALK_SPEED = 60` — bigger = enemies are scarier

## How to play

| Key | What it does |
| --- | --- |
| ← / → (or A / D) | Walk |
| Space (or ↑ / W) | Jump |
| Z | Throw an ice cream scoop (after eating an 🍦) |

On a touch device (iPad), four buttons appear over the canvas:
left, right, jump, and (after eating ice cream) a 🍦 throw button.

## Asset attribution

All artwork in this game is original — Camila's face photos belong to
her family, and every other element (apron, hat, legs, nugget, ice
cream, enemies, flag, logo) is drawn live from rectangles and circles.

All sound effects are synthesized in real time by the browser using
the Web Audio API — no recordings are bundled. To swap in real
samples later, drop CC0/CC-BY `.wav` files into `public/sounds/` and
update `src/sounds.js` to play them with Kaplay's `loadSound` and
`play()` instead of the procedural recipes.

## Known iPad quirks

- Audio stays silent until the first tap (Safari rule). The menu's
  "tap to start" handles that.
- If Safari's address bar keeps popping up, "Add to Home Screen"
  removes it.
- The game expects landscape orientation. If the iPad is portrait,
  you'll see a "Rotate to landscape!" overlay.

## What's next

Pick the one that sounds most fun and we'll build it together:

1. More levels — `level2.js`, `level3.js`, level select on the menu.
2. A boss fight at the end of level 1 (the Math Test?).
3. New power-up foods: tacos for double jump, water bottle for
   running underwater.
4. Real music in the background (a CC0 chiptune loop).
5. A score counter that saves your best run with `localStorage`.
6. Animated parallax background (clouds + mountains scrolling at
   different speeds).
7. One-way platforms you can jump up through but not fall through.
8. Two-player mode: Camila and a friend share the keyboard.
9. A custom level editor — Camila clicks tiles and exports the ASCII.
10. New sound design: swap the synthesized SFX for real CC0 samples.

## File map

```
camila-sis/
├── public/
│   ├── sprites/camila/   ← Camila's face photos
│   └── sounds/           ← (empty for now; drop WAVs here later)
└── src/
    ├── main.js           ← starts the game
    ├── config.js         ← all the numbers Camila can tweak
    ├── input.js          ← keyboard + touch input bus
    ├── loader.js         ← loads sprite images
    ├── sounds.js         ← live-synthesized sound effects
    ├── touch.js          ← touch-button overlay (iPad)
    ├── levels/
    │   └── level1.js     ← ASCII level + map parser
    ├── entities/
    │   ├── camila.js     ← Camila herself
    │   ├── notebook.js   ← homework enemy
    │   ├── insect.js     ← bouncy bug enemy
    │   └── scoop.js      ← thrown ice cream
    └── scenes/
        ├── menu.js       ← title screen
        ├── level1.js     ← gameplay
        ├── win.js        ← "You Win!" screen
        └── gameover.js   ← "Game Over" screen
```
