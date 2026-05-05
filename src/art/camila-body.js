// Camila's body sprite, hand-drawn pixel by pixel. Camila — to repaint her,
// change the colours below or move pixels around in the frame strings. Each
// character is one pixel: '.' is transparent, '#' is dark outline, 'W' is
// white, etc. (See `palette` for the full key.)
//
// Layout for SMALL (16w × 24h):
//   rows  0–4  chef hat: white puff with creases + red band w/ highlights
//   rows  5–10 face area (transparent — the photo PNG composites on top)
//   rows 11–12 red neckerchief with a small dark-red knot (knot flutters
//              left/right between walk frames)
//   rows 13–16 chef coat: shoulders w/ shading, double-breasted buttons,
//              arms (cols 0-1 + 14-15) ending in skin-tone hands at row 16
//   rows 17–18 white apron: top edge + horizontal pocket-stitch line
//   rows 19–21 navy pants: top w/ side highlight + tapered ankle
//   rows 22–23 brown chef clogs + dark soles
//
// Tall Camila keeps the same head/hat (made a touch taller and prouder),
// then a longer coat with three button rows, longer apron, longer pants —
// hand-authored frame by frame so it isn't just a stretched small Camila.
//
// Frame indices used by src/loader.js:
//   0 = idle, 1–4 = walk cycle (foot-up / planted / foot-up / planted),
//   5 = jump pose (hat tilted right, hands raised, legs tucked).

const palette = {
  '.': null,
  '#': '#2a2a2a',   // dark outline
  'W': '#ffffff',   // chef coat / hat white
  'w': '#bbbbbb',   // hat creases / coat shading on the lit side
  'A': '#fafafa',   // apron white (a touch brighter than coat)
  'a': '#d0d0d0',   // apron shadow (used inside pocket)
  'R': '#d22b3a',   // neckerchief, hat band
  'r': '#7a0e1c',   // dark red (knot)
  'h': '#cc1f30',   // hat band highlight (between R and r)
  'B': '#1a1a1a',   // coat buttons
  'N': '#283c70',   // navy pants
  'n': '#1c2a4d',   // pants shadow (lifted-leg shading)
  'p': '#3a4d80',   // pants highlight (lit side)
  'S': '#5a3a1a',   // brown clog
  's': '#3a2410',   // clog shadow / sole
  'T': '#e5b78f',   // skin tone (hand pixels)
}

// ---------- SMALL CAMILA — 16 × 24, 6 frames (idle, walk0..3, jump) ----------

// Frame 0: idle — arms at sides, both feet planted, knot centered.
const smallIdle = [
  '....######......',  //  0 hat top tip
  '...#WWWWWW#.....',  //  1 hat puff
  '..#WWwWWwWW#....',  //  2 hat creases
  '..#WWWWWWWW#....',  //  3 hat puff base
  '...RRhRRhRR.....',  //  4 red band w/ 2 highlight pixels
  '................',  //  5 face starts (transparent — photo composites here)
  '................',  //  6
  '................',  //  7
  '................',  //  8
  '................',  //  9
  '................',  // 10
  '....#RRRRRR#....',  // 11 neckerchief
  '......#rr#......',  // 12 knot centered
  'WW#WWwWWWWWWW#WW',  // 13 shoulders + arms (cols 0-1 + 14-15) + coat shading
  'WW#WWWBWWBWWW#WW',  // 14 button row (cols 6, 9)
  'WW#WWWWWWWWWW#WW',  // 15 plain coat
  'TT#WWWWWWWWWW#TT',  // 16 skin-tone hands at sleeve ends
  '..#AAAAAAAAAA#..',  // 17 apron top edge
  '..#AA######AA#..',  // 18 pocket horizontal stitch line
  '..#pNNNNNNNNn#..',  // 19 pants top w/ left highlight + right shadow
  '..#NNNNNNNNNN#..',  // 20 pants middle
  '..#NNN####NNN#..',  // 21 pants ankle (dark seam between legs)
  '..#SSS#..#SSS#..',  // 22 clogs (split with toe gap)
  '..#sss#..#sss#..',  // 23 clog soles
]

// Frame 1: walk-0 — left foot forward, right arm forward, knot LEFT.
const smallWalk0 = [
  '....######......',
  '...#WWWWWW#.....',
  '..#WWwWWwWW#....',
  '..#WWWWWWWW#....',
  '...RRhRRhRR.....',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....#RRRRRR#....',
  '.....#rr#.......',  // 12 knot shifted LEFT 1 px (flutter)
  'WW#WWwWWWWWWW#WW',
  'WW#WWWBWWBWWW#WW',
  '..#WWWWWWWWWW#TT',  // 15 right hand SWUNG UP (TT moves to row 15 right)
  'TT#WWWWWWWWWW#..',  // 16 left hand DROPPED (TT only on left)
  '..#AAAAAAAAAA#..',
  '..#AA######AA#..',
  '..#pNNNNNNNNn#..',
  '..#NNNNNNN#nn#..',  // 20 right leg lifted (gap + shadow)
  '..#NNNN###NN#...',  // 21 left foot forward
  '..#SSSS#..#SS#..',  // 22 left clog forward, right clog tucked
  '..#####....##S#.',  // 23 left sole, right clog small
]

// Frame 2: walk-1 — both feet planted neutral pose, hands at chest height.
const smallWalk1 = [
  '....######......',
  '...#WWWWWW#.....',
  '..#WWwWWwWW#....',
  '..#WWWWWWWW#....',
  '...RRhRRhRR.....',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....#RRRRRR#....',
  '.....#rr#.......',  // 12 knot still LEFT (matches walk0)
  'WW#WWwWWWWWWW#WW',
  'WW#WWWBWWBWWW#WW',
  'TT#WWWWWWWWWW#TT',  // 15 both hands raised to chest level
  '..#WWWWWWWWWW#..',  // 16
  '..#AAAAAAAAAA#..',
  '..#AA######AA#..',
  '..#pNNNNNNNNn#..',
  '..#NNNNNNNNNN#..',  // 20 pants middle (no leg lift)
  '..#NNN####NNN#..',  // 21 pants ankle (centered)
  '..#SSS#..#SSS#..',
  '..#sss#..#sss#..',
]

// Frame 3: walk-2 — right foot forward, left arm forward, knot RIGHT (mirror of walk-0).
const smallWalk2 = [
  '....######......',
  '...#WWWWWW#.....',
  '..#WWwWWwWW#....',
  '..#WWWWWWWW#....',
  '...RRhRRhRR.....',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....#RRRRRR#....',
  '.......#rr#.....',  // 12 knot shifted RIGHT 1 px (flutter)
  'WW#WWwWWWWWWW#WW',
  'WW#WWWBWWBWWW#WW',
  'TT#WWWWWWWWWW#..',  // 15 left hand SWUNG UP (TT on left at row 15)
  '..#WWWWWWWWWW#TT',  // 16 right hand DROPPED
  '..#AAAAAAAAAA#..',
  '..#AA######AA#..',
  '..#pNNNNNNNNn#..',
  '..#nn#NNNNNNN#..',  // 20 left leg lifted
  '..#NN###NNNN#...',  // 21 right foot forward
  '..#SS#..#SSSS#..',  // 22 right clog forward
  '..#S##....#####.',  // 23 right sole, left tucked
]

// Frame 4: walk-3 — planted contact pose mirroring walk-1, knot RIGHT.
const smallWalk3 = [
  '....######......',
  '...#WWWWWW#.....',
  '..#WWwWWwWW#....',
  '..#WWWWWWWW#....',
  '...RRhRRhRR.....',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....#RRRRRR#....',
  '.......#rr#.....',  // 12 knot still RIGHT
  'WW#WWwWWWWWWW#WW',
  'WW#WWWBWWBWWW#WW',
  'TT#WWWWWWWWWW#TT',
  '..#WWWWWWWWWW#..',
  '..#AAAAAAAAAA#..',
  '..#AA######AA#..',
  '..#pNNNNNNNNn#..',
  '..#NNNNNNNNNN#..',
  '..#NNN####NNN#..',
  '..#SSS#..#SSS#..',
  '..#sss#..#sss#..',
]

// Frame 5: jump pose — hat tilted right 1 px, hands up, legs tucked together.
// Engine plays this when she's not on the ground (see src/entities/camila.js).
const smallJump = [
  '.....######.....',  //  0 hat top shifted RIGHT 1 px
  '....#WWWWWW#....',  //  1
  '...#WWwWWwWW#...',  //  2
  '...#WWWWWWWW#...',  //  3
  '....RRhRRhRR....',  //  4 hat band shifted with hat
  '................',  //  5 face
  '................',
  '................',
  '................',
  '................',
  '................',
  '....#RRRRRR#....',  // 11 neckerchief
  '......#rr#......',  // 12 knot centered (no flutter mid-jump)
  'WW#WWwWWWWWWW#WW',
  'TT#WWWBWWBWWW#TT',  // 14 hands raised to button-row level (anticipation)
  '..#WWWWWWWWWW#..',  // 15
  '..#WWWWWWWWWW#..',  // 16 (no hands at sleeve end in jump)
  '..#AAAAAAAAAA#..',  // 17 apron
  '..#AA######AA#..',  // 18 pocket
  '..#pNNNNNNNNn#..',  // 19 pants top
  '..#NNNNNNNNNN#..',  // 20 pants middle
  '....#NNNNNN#....',  // 21 legs tucked (8 wide together)
  '....#SSSSSS#....',  // 22 clogs tucked
  '....########....',  // 23 sole bar
]

// ---------- TALL CAMILA — 16 × 32, 6 frames, hand-authored ----------
// Same head/hat as small (a touch prouder — extra puff row), then a longer
// coat with three button rows, longer apron, longer pants — hand-authored
// so it isn't just a stretched small Camila.

// Frame 0: tall idle.
const tallIdle = [
  '....######......',  //  0 hat top tip
  '...#WWWWWW#.....',  //  1 hat upper puff
  '..#WWWWWWWW#....',  //  2 hat upper puff broader (extra row — taller, prouder)
  '..#WWwWWwWW#....',  //  3 hat creases
  '..#WWWWWWWW#....',  //  4 hat puff base
  '...RRhRRhRR.....',  //  5 red band
  '................',  //  6 face starts (transparent)
  '................',  //  7
  '................',  //  8
  '................',  //  9
  '................',  // 10
  '................',  // 11
  '................',  // 12
  '....#RRRRRR#....',  // 13 neckerchief
  '......#rr#......',  // 14 knot centered
  'WW#WWwWWWWWWW#WW',  // 15 shoulders + arms + shading
  'WW#WWWBWWBWWW#WW',  // 16 button row 1
  'WW#WWWWWWWWWW#WW',  // 17 plain coat
  'WW#WWWBWWBWWW#WW',  // 18 button row 2
  'TT#WWWWWWWWWW#TT',  // 19 hands at sleeve ends (5-row arms)
  '..#WWWBWWBWWW#..',  // 20 button row 3 (sleeves ended)
  '..#WWWWWWWWWW#..',  // 21 coat hem (tucked under apron)
  '..#AAAAAAAAAA#..',  // 22 apron top
  '..#AA######AA#..',  // 23 apron pocket horizontal stitch
  '..#AAAAAAAAAA#..',  // 24 apron
  '..#AAAAAAAAAA#..',  // 25 apron
  '..#AAAAAAAAAA#..',  // 26 apron hem
  '..#pNNNNNNNNn#..',  // 27 pants top w/ highlights
  '..#NNNNNNNNNN#..',  // 28 pants middle
  '..#NNN####NNN#..',  // 29 pants ankle
  '..#SSS#..#SSS#..',  // 30 clogs
  '..#sss#..#sss#..',  // 31 clog soles
]

// Frame 1: tall walk-0 — left foot forward, right arm forward, knot LEFT.
const tallWalk0 = [
  '....######......',
  '...#WWWWWW#.....',
  '..#WWWWWWWW#....',
  '..#WWwWWwWW#....',
  '..#WWWWWWWW#....',
  '...RRhRRhRR.....',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....#RRRRRR#....',
  '.....#rr#.......',  // 14 knot LEFT
  'WW#WWwWWWWWWW#WW',
  'WW#WWWBWWBWWW#WW',
  'WW#WWWWWWWWWW#WW',
  '..#WWWBWWBWWW#TT',  // 18 right hand SWUNG UP to row 18 (button row 2 still visible)
  'TT#WWWWWWWWWW#..',  // 19 left hand DROPPED to row 19
  '..#WWWBWWBWWW#..',  // 20 button row 3
  '..#WWWWWWWWWW#..',  // 21
  '..#AAAAAAAAAA#..',
  '..#AA######AA#..',
  '..#AAAAAAAAAA#..',
  '..#AAAAAAAAAA#..',
  '..#AAAAAAAAAA#..',
  '..#pNNNNNNNNn#..',
  '..#NNNNNNN#nn#..',  // 28 right leg lifted
  '..#NNNN###NN#...',  // 29 left foot forward
  '..#SSSS#..#SS#..',  // 30 left clog forward
  '..#####....##S#.',  // 31
]

// Frame 2: tall walk-1 — neutral planted pose, hands raised.
const tallWalk1 = [
  '....######......',
  '...#WWWWWW#.....',
  '..#WWWWWWWW#....',
  '..#WWwWWwWW#....',
  '..#WWWWWWWW#....',
  '...RRhRRhRR.....',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....#RRRRRR#....',
  '.....#rr#.......',  // 14 knot still LEFT
  'WW#WWwWWWWWWW#WW',
  'WW#WWWBWWBWWW#WW',
  'WW#WWWWWWWWWW#WW',
  'TT#WWWBWWBWWW#TT',  // 18 both hands raised to row 18
  '..#WWWWWWWWWW#..',  // 19
  '..#WWWBWWBWWW#..',
  '..#WWWWWWWWWW#..',
  '..#AAAAAAAAAA#..',
  '..#AA######AA#..',
  '..#AAAAAAAAAA#..',
  '..#AAAAAAAAAA#..',
  '..#AAAAAAAAAA#..',
  '..#pNNNNNNNNn#..',
  '..#NNNNNNNNNN#..',
  '..#NNN####NNN#..',
  '..#SSS#..#SSS#..',
  '..#sss#..#sss#..',
]

// Frame 3: tall walk-2 — right foot forward, left arm forward, knot RIGHT.
const tallWalk2 = [
  '....######......',
  '...#WWWWWW#.....',
  '..#WWWWWWWW#....',
  '..#WWwWWwWW#....',
  '..#WWWWWWWW#....',
  '...RRhRRhRR.....',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....#RRRRRR#....',
  '.......#rr#.....',  // 14 knot RIGHT
  'WW#WWwWWWWWWW#WW',
  'WW#WWWBWWBWWW#WW',
  'WW#WWWWWWWWWW#WW',
  'TT#WWWBWWBWWW#..',  // 18 left hand UP, right side empty
  '..#WWWWWWWWWW#TT',  // 19 right hand DROPPED
  '..#WWWBWWBWWW#..',
  '..#WWWWWWWWWW#..',
  '..#AAAAAAAAAA#..',
  '..#AA######AA#..',
  '..#AAAAAAAAAA#..',
  '..#AAAAAAAAAA#..',
  '..#AAAAAAAAAA#..',
  '..#pNNNNNNNNn#..',
  '..#nn#NNNNNNN#..',  // 28 left leg lifted
  '..#NN###NNNN#...',  // 29 right foot forward
  '..#SS#..#SSSS#..',  // 30 right clog forward
  '..#S##....#####.',  // 31
]

// Frame 4: tall walk-3 — planted neutral pose, knot RIGHT.
const tallWalk3 = [
  '....######......',
  '...#WWWWWW#.....',
  '..#WWWWWWWW#....',
  '..#WWwWWwWW#....',
  '..#WWWWWWWW#....',
  '...RRhRRhRR.....',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....#RRRRRR#....',
  '.......#rr#.....',  // 14 knot still RIGHT
  'WW#WWwWWWWWWW#WW',
  'WW#WWWBWWBWWW#WW',
  'WW#WWWWWWWWWW#WW',
  'TT#WWWBWWBWWW#TT',
  '..#WWWWWWWWWW#..',
  '..#WWWBWWBWWW#..',
  '..#WWWWWWWWWW#..',
  '..#AAAAAAAAAA#..',
  '..#AA######AA#..',
  '..#AAAAAAAAAA#..',
  '..#AAAAAAAAAA#..',
  '..#AAAAAAAAAA#..',
  '..#pNNNNNNNNn#..',
  '..#NNNNNNNNNN#..',
  '..#NNN####NNN#..',
  '..#SSS#..#SSS#..',
  '..#sss#..#sss#..',
]

// Frame 5: tall jump — hat tilted right, hands raised, legs tucked.
const tallJump = [
  '.....######.....',  //  0 hat shifted RIGHT
  '....#WWWWWW#....',  //  1
  '...#WWWWWWWW#...',  //  2
  '...#WWwWWwWW#...',  //  3
  '...#WWWWWWWW#...',  //  4
  '....RRhRRhRR....',  //  5 band shifted with hat
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '....#RRRRRR#....',  // 13 neckerchief
  '......#rr#......',  // 14 knot centered
  'WW#WWwWWWWWWW#WW',
  'WW#WWWBWWBWWW#WW',
  'TT#WWWWWWWWWW#TT',  // 17 hands raised one row from idle (row 17 instead of 19)
  '..#WWWBWWBWWW#..',  // 18
  '..#WWWWWWWWWW#..',  // 19
  '..#WWWBWWBWWW#..',  // 20
  '..#WWWWWWWWWW#..',  // 21
  '..#AAAAAAAAAA#..',
  '..#AA######AA#..',
  '..#AAAAAAAAAA#..',
  '..#AAAAAAAAAA#..',
  '..#AAAAAAAAAA#..',
  '..#pNNNNNNNNn#..',
  '..#NNNNNNNNNN#..',
  '....#NNNNNN#....',  // 29 legs tucked
  '....#SSSSSS#....',  // 30 clogs together
  '....########....',  // 31 sole bar
]

// ---------- DANCE — 6-frame loop (small only, used at the goal flag) ----------
// During the dance the hat sits 2 rows lower than usual (rows 2-6); on the
// final hop frame it snaps back up to its idle position (rows 0-4), reading
// as a little "hat hop" motion.

function danceFrame(armState, hatHopped = false) {
  // Shoulder row variants — the 'TT' end on each side is a hand at shoulder
  // height instead of hanging down to row 16. With both hands up we get the
  // arms-raised dance pose; with only one up we get the alternating wave.
  const armUp    = 'TT#WWwWWWWWWW#TT'   // both hands at shoulders
  const armSide  = 'WW#WWwWWWWWWW#WW'   // both arms hanging
  const armLeft  = 'TT#WWwWWWWWWW#WW'   // left up, right at side
  const armRight = 'WW#WWwWWWWWWW#TT'   // right up, left at side

  const shoulder = ({ both: armUp, left: armLeft, right: armRight, none: armSide })[armState]

  const hat0 = hatHopped ? '....######......' : '................'
  const hat1 = hatHopped ? '...#WWWWWW#.....' : '................'
  const hat2 = hatHopped ? '..#WWwWWwWW#....' : '....######......'
  const hat3 = hatHopped ? '..#WWWWWWWW#....' : '...#WWWWWW#.....'
  const hat4 = hatHopped ? '...RRhRRhRR.....' : '..#WWwWWwWW#....'
  const hat5 = hatHopped ? '................' : '..#WWWWWWWW#....'
  const hat6 = hatHopped ? '................' : '...RRhRRhRR.....'

  return [
    hat0,                                   //  0
    hat1,                                   //  1
    hat2,                                   //  2
    hat3,                                   //  3
    hat4,                                   //  4
    hat5,                                   //  5
    hat6,                                   //  6
    '................',                     //  7 face
    '................',                     //  8
    '................',                     //  9
    '................',                     // 10
    '....#RRRRRR#....',                     // 11 neckerchief
    '......#rr#......',                     // 12 knot
    shoulder,                               // 13 shoulder row with arm state
    'WW#WWWBWWBWWW#WW',                     // 14 buttons
    'WW#WWWWWWWWWW#WW',                     // 15
    armState === 'none' ? 'TT#WWWWWWWWWW#TT' : '..#WWWWWWWWWW#..',  // 16 hands at hip when arms down
    '..#AAAAAAAAAA#..',                     // 17 apron top
    '..#AA######AA#..',                     // 18 apron pocket
    '..#pNNNNNNNNn#..',                     // 19 pants top
    '..#NNNNNNNNNN#..',                     // 20 pants middle
    '..#NNN####NNN#..',                     // 21 pants ankle
    '..#SSS#..#SSS#..',                     // 22 clogs
    '..#sss#..#sss#..',                     // 23 clog soles
  ]
}

// 6-frame dance: arms-down, left-up, both-up, right-up, both-up, hat-hop.
const smallDance0 = danceFrame('none')
const smallDance1 = danceFrame('left')
const smallDance2 = danceFrame('both')
const smallDance3 = danceFrame('right')
const smallDance4 = danceFrame('both')
const smallDance5 = danceFrame('none', true)   // hat-hop frame

// ---------- Exports ----------

export const camilaSmallFrames = [smallIdle, smallWalk0, smallWalk1, smallWalk2, smallWalk3, smallJump]
export const camilaTallFrames  = [tallIdle,  tallWalk0,  tallWalk1,  tallWalk2,  tallWalk3,  tallJump]
export const camilaDanceFrames = [smallDance0, smallDance1, smallDance2, smallDance3, smallDance4, smallDance5]
export const camilaPalette     = palette
