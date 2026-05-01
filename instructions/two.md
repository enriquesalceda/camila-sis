## Context
The v0.1 art is placeholder rectangles — Camila and I just looked
at it and the graphics need a serious upgrade before her class
demo. See attached screenshot for current state. The original
CLAUDE.md said to use Kenney's Pixel Platformer pack, but the
current build draws shapes procedurally instead. We're fixing that
now.

## Goal
Replace all procedural shapes with proper pixel art and add visual
polish so the game looks intentional and playful, not like a
prototype. The face PNGs of Camila stay — everything else around
her gets redone.

### Art direction
- **Style:** 16x16 or 32x32 pixel art, NES/SNES era. Pick one tile
  size and stick to it across every sprite. Nearest-neighbor
  scaling only — no smoothing/antialiasing. Set Kaplay's
  `pixelDensity` and image rendering to crisp pixels.
- **Palette:** Warm, saturated, kid-friendly. Take cues from
  classic platformers but pick our own. No pure black outlines on
  everything — pixel art uses darker shades of the base color, not
  #000.
- **Source:** Download Kenney's "Pixel Platformer" pack
  (kenney.nl/assets/pixel-platformer, CC0) and commit the relevant
  tiles to /public/sprites/kenney/. List which tiles you used in
  the README.

### Specific assets to fix
1. **Ground:** Use Kenney's grass-top + dirt-bottom tiles. The top
   row has grass texture, rows below are dirt with little pebbles.
   Tile horizontally seamlessly.
2. **Platforms:** Floating platforms should be a distinct tile (not
   just green squares) — Kenney has "floating block" or "stone
   block" tiles that work. Or use the brick block from the pack.
3. **Background:** Replace flat sky with a layered parallax:
   - Far back: gradient sky (light blue top → warmer near horizon)
   - Mid: 2-3 cartoon clouds that drift slowly
   - Near back: hills or simple bushes silhouette
   The parallax layers should scroll at different speeds as the
   camera moves.
4. **Camila's body:** Replace the white rectangle. Build her as a
   proper sprite:
   - Chef hat on top (puffy white pixel-art hat with band, NOT a
     plain circle)
   - Face PNG fits inside a head-shaped sprite frame (small bg
     halo so it doesn't float disembodied)
   - Body: white chef coat with a red neckerchief, apron lines,
     two buttons
   - Legs: dark blue/black pants with little shoes, animated as a
     2-frame walk cycle (alternate frames every ~8 px of movement)
   - Tall Camila is the same character ~1.5x taller with longer
     coat
5. **Homework notebook enemy:** Make it look like an actual spiral
   notebook, not a box with text:
   - White/cream cover with a red "HOMEWORK" label
   - Black spiral binding pixels along the top
   - Two angry pixel eyes and a frowny mouth on the cover
   - 2-frame walk animation (slight wobble)
6. **Insect enemy:** Round body, antennae, 6 little legs in a
   2-frame walk. Pick a color that's NOT green (so it's
   distinguishable from platforms) — purple or red works.
7. **Chicken nugget power-up:** Golden-brown lumpy nugget shape
   with a subtle bob animation (sin-wave float, ±2 px).
8. **Ice cream power-up:** Cone with a pink scoop on top, also
   bobbing.
9. **Ice cream scoop projectile:** Small pink/white sphere with a
   1-frame sparkle trail.
10. **Goal flag:** Tall pole with a triangular flag at top — flag
    waves with a 3-frame animation. Put a chef hat icon on the
    flag instead of a generic symbol.
11. **Coins (if separate from nuggets):** Use Kenney's coin sprite
    with its built-in spin animation.

### UI fixes
- Replace the system font for "3UP" and any score with a pixel
  font. Use Kenney's "Kenney Pixel" or "Press Start 2P" (free,
  Google Fonts) — bundle locally, do NOT load from a CDN at
  runtime (school wifi).
- HUD: top-left = nugget count with a tiny nugget icon; top-right
  = "x3" lives with a tiny Camila-head icon; centered top = level
  name briefly on level start, then fades.

### Camera
- Camera should follow Camila with a small dead-zone in the middle
  of the screen (Mario-style). Right now the whole level fits on
  screen which kills the sense of exploration. Level should be
  ~3-4 screens wide.

## Constraints
- All new assets CC0 or CC-BY (attribute). No ripped Nintendo
  sprites.
- Don't refactor the game logic — only the rendering, sprite
  loading, and animation layers. Physics constants and level
  ASCII stay untouched.
- Keep the per-file tunables structure so Camila can still tweak
  numbers.
- iPad Safari must still work; verify pixel art renders crisply
  (check `image-rendering: pixelated` CSS on the canvas).

## Output Expectations
1. Updated project where every visual element is either a Kenney
   sprite or a hand-authored pixel sprite — no procedural
   rectangles remaining anywhere on screen.
2. README updated with full asset attribution list and links.
3. A 1-screen "before/after" note in the changelog explaining what
   changed visually, in plain English I can read to Camila.
4. Confirm the parallax background, walk animations, enemy
   animations, and coin/nugget bob are all running before you
   declare done.
