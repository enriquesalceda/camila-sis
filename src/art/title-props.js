// Title-screen-only prop art. Hand-drawn pixel by pixel. Same '.' = transparent
// trick as camila-body.js — Camila, change the chars below to repaint anything.
//
// Exports:
//   potFrames / potPalette          — single-frame cooking pot (16 × 14)
//   titleSparkleFrames / palette    — 3-frame logo sparkle (5 × 5): big star,
//                                     small star, dot. Plays once per spawn.

const potPalette = {
  '.': null,
  '#': '#1a1a1a',   // dark outline
  'D': '#3a3a3a',   // pot body (dark gray)
  'd': '#222222',   // pot shadow
  'L': '#5a5a5a',   // lid + body highlight
  'H': '#7a7a7a',   // lid knob highlight
  'B': '#cc6a1a',   // bubbling broth (orange)
  'b': '#a04a10',   // broth shadow
}

// 16 × 14, single frame.
const potFrame = [
  '................',   //  0
  '................',   //  1
  '......####......',   //  2 lid knob top
  '.....#LLLL#.....',   //  3 lid knob body
  '..############..',   //  4 lid edge
  '.#LLLLLLLLLLLL#.',   //  5 lid top
  '.##LLLLLLLLLL##.',   //  6 lid base
  '#DDBBbBbBBbBBDD#',   //  7 broth surface (bubbles)
  '#DLDDDDDDDDDDLD#',   //  8 pot rim with handle hints
  '#DLDDDDDDDDDDLD#',   //  9 pot body
  '#DLDDDDDDDDDDLD#',   // 10
  '#DdDDDDDDDDDDdD#',   // 11
  '.#DdDDDDDDDDdD#.',   // 12 pot base taper
  '..############..',   // 13 pot bottom
]

export const potFrames = [potFrame]
export { potPalette }

// ---------- 3-frame sparkle for the logo ----------

const titleSparklePalette = {
  '.': null,
  'W': '#ffffff',
  'Y': '#fff4a8',   // pale gold core
}

// 5 × 5 frames. Frame 0: big 4-point star. Frame 1: small +. Frame 2: single dot.
const sparkleBig = [
  '..W..',
  '.WYW.',
  'WYYYW',
  '.WYW.',
  '..W..',
]
const sparkleSmall = [
  '.....',
  '..W..',
  '.WYW.',
  '..W..',
  '.....',
]
const sparkleDot = [
  '.....',
  '.....',
  '..Y..',
  '.....',
  '.....',
]

export const titleSparkleFrames = [sparkleBig, sparkleSmall, sparkleDot]
export { titleSparklePalette }
