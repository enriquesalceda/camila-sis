// Camila's body sprite, hand-drawn pixel by pixel. The face image goes on
// top of these via an overlay child in entities/camila.js — so rows 4-13
// stay empty here, that's where her face shows through.
//
// To repaint Camila's costume, change the colors in `palette` below or move
// pixels around in the `frames` arrays. Each character in the string is one
// pixel. '.' is transparent, '#' is dark outline, 'W' is white, etc.

const palette = {
  '.': null,            // transparent
  '#': '#2a2a2a',       // dark outline
  'W': '#ffffff',       // chef coat / hat white
  'R': '#d22b3a',       // red neckerchief
  'B': '#1a1a1a',       // coat buttons
  'N': '#283c70',       // dark navy pants
  'S': '#5a3a1a',       // brown shoes
}

// Small Camila — 16 wide × 24 tall. Face PNG overlays rows 4-13.
const smallStand = [
  '.....######.....',
  '....#WWWWWW#....',
  '...#WWWWWWWW#...',
  '..##WWWWWWWW##..',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '...#WWWRRWWW#...',
  '..#WWWRRRRWWW#..',
  '..#WWWWWWWWWWW#.',
  '..#WBWWWWWWBW#..',
  '..#WWWWWWWWWW#..',
  '..#WWWWWWWWWW#..',
  '..#NNNNNNNNNN#..',
  '..#NNNNNNNNNN#..',
  '..#NNNN##NNNN#..',
  '..#SSS#..#SSS#..',
]

// Walk frame — slight foot lift on the right, weight on the left.
const smallWalk = [
  '.....######.....',
  '....#WWWWWW#....',
  '...#WWWWWWWW#...',
  '..##WWWWWWWW##..',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '...#WWWRRWWW#...',
  '..#WWWRRRRWWW#..',
  '..#WWWWWWWWWWW#.',
  '..#WBWWWWWWBW#..',
  '..#WWWWWWWWWW#..',
  '..#WWWWWWWWWW#..',
  '..#NNNNNNNNNN#..',
  '..#NNNNNNNNNN#..',
  '..#NNN####NNN#..',
  '..#SS#....#SSS#.',
]

// Tall Camila — 16 wide × 32 tall. Coat extended 8 rows. Same hat + face area.
const tallStand = [
  '.....######.....',
  '....#WWWWWW#....',
  '...#WWWWWWWW#...',
  '..##WWWWWWWW##..',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '...#WWWRRWWW#...',
  '..#WWWRRRRWWW#..',
  '..#WWWWWWWWWWW#.',
  '..#WBWWWWWWBW#..',
  '..#WWWWWWWWWW#..',
  '..#WWWWWWWWWW#..',
  '..#WWWWWWWWWW#..',
  '..#WWWWBWWBWW#..',
  '..#WWWWWWWWWW#..',
  '..#WWWWWWWWWW#..',
  '..#WWWWWWWWWW#..',
  '..#NNNNNNNNNN#..',
  '..#NNNNNNNNNN#..',
  '..#NNNNNNNNNN#..',
  '..#NNNNNNNNNN#..',
  '..#NNNN##NNNN#..',
  '..#SSS#..#SSS#..',
  '..############..',
]

const tallWalk = [
  '.....######.....',
  '....#WWWWWW#....',
  '...#WWWWWWWW#...',
  '..##WWWWWWWW##..',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '...#WWWRRWWW#...',
  '..#WWWRRRRWWW#..',
  '..#WWWWWWWWWWW#.',
  '..#WBWWWWWWBW#..',
  '..#WWWWWWWWWW#..',
  '..#WWWWWWWWWW#..',
  '..#WWWWWWWWWW#..',
  '..#WWWWBWWBWW#..',
  '..#WWWWWWWWWW#..',
  '..#WWWWWWWWWW#..',
  '..#WWWWWWWWWW#..',
  '..#NNNNNNNNNN#..',
  '..#NNNNNNNNNN#..',
  '..#NNNNNNNNNN#..',
  '..#NNNNNNNNNN#..',
  '..#NNN####NNN#..',
  '..#SS#....#SSS#.',
  '..############..',
]

export const camilaSmallFrames = [smallStand, smallWalk]
export const camilaTallFrames  = [tallStand,  tallWalk]
export const camilaPalette     = palette
