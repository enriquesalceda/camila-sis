// Goal flag. Tall pole with a triangular flag at the top, with a tiny chef
// hat icon inside the flag. 24 wide × 80 tall, 3 frames for the wave.
// All three frames share the same pole; only the flag area changes.

const palette = {
  '.': null,
  '#': '#2a2a2a',       // outline
  'P': '#aaaaaa',       // pole grey
  'p': '#777777',       // pole shadow
  'R': '#cc2233',       // flag red
  'r': '#992233',       // flag dark red
  'W': '#ffffff',       // chef hat white
  'B': '#1a1a1a',       // chef hat band
}

// Each frame: 4-px pole on the left, flag on the right (varies per frame).
function buildFrame(flagRows) {
  // Stack 64 rows of pole (top), then a 16-row flag at the very top.
  // Actually we want the FLAG at the TOP of the sprite and the POLE going
  // down — so the bottom of the sprite is the bottom of the pole.
  const out = []
  for (let r = 0; r < 16; r++) out.push(flagRows[r] || '#PPp..................'.padEnd(24, '.'))
  // Pole-only rows for the rest:
  const poleRow = '#Pp.....................'
  for (let r = 16; r < 80; r++) out.push(poleRow)
  return out
}

// 16-row flag region — pole on cols 0-2, flag on cols 3-22.
// Frame 0: flag stretched right.
const flag0 = [
  '#Pp#####################',
  '#PpRRRRRRRRRRRRRRRRRRRR#',
  '#PpRRWWWWWWWWWWWWWWWWRR#',
  '#PpRWWBBBBBBBBBBBBBBWWR#',
  '#PpRWBWWWWWWWWWWWWWWBWR#',
  '#PpRWBWWWWWWWWWWWWWWBWR#',
  '#PpRWWWWWWWWWWWWWWWWWWR#',
  '#PpRWWBWWBWWBWWBWWBWWWR#',
  '#PpRWWWWWWWWWWWWWWWWWWR#',
  '#PpRRRRRRRRRRRRRRRRRRRR#',
  '#PprrrrrrrrrrrrrrrrrrR#.',
  '#Pp#####################',
  '#Pp.....................',
  '#Pp.....................',
  '#Pp.....................',
  '#Pp.....................',
]

// Frame 1: flag mid-wave (slight curl on right edge).
const flag1 = [
  '#Pp#####################',
  '#PpRRRRRRRRRRRRRRRRRR##.',
  '#PpRRWWWWWWWWWWWWWWWR#..',
  '#PpRWWBBBBBBBBBBBBBWR#..',
  '#PpRWBWWWWWWWWWWWWBWR#..',
  '#PpRWBWWWWWWWWWWWWBWR#..',
  '#PpRWWWWWWWWWWWWWWWWR#.',
  '#PpRWWBWWBWWBWWBWWWWR#.',
  '#PpRWWWWWWWWWWWWWWWWWR#',
  '#PpRRRRRRRRRRRRRRRRRRR#',
  '#PprrrrrrrrrrrrrrrrrrR#',
  '#Pp#####################',
  '#Pp.....................',
  '#Pp.....................',
  '#Pp.....................',
  '#Pp.....................',
]

// Frame 2: flag curled left (drawing the left edge stronger).
const flag2 = [
  '#Pp###################..',
  '#PpRRRRRRRRRRRRRRRRR#...',
  '#PpRRWWWWWWWWWWWWWWR#...',
  '#PpRWWBBBBBBBBBBBBWR#...',
  '#PpRWBWWWWWWWWWWWBWR#...',
  '#PpRWBWWWWWWWWWWWBWR#...',
  '#PpRWWWWWWWWWWWWWWWR#..',
  '#PpRWWBWWBWWBWWBWWWR#..',
  '#PpRWWWWWWWWWWWWWWWWR#.',
  '#PpRRRRRRRRRRRRRRRRRR#.',
  '#PprrrrrrrrrrrrrrrrrR#.',
  '#Pp#####################',
  '#Pp.....................',
  '#Pp.....................',
  '#Pp.....................',
  '#Pp.....................',
]

export const flagFrames  = [buildFrame(flag0), buildFrame(flag1), buildFrame(flag2)]
export const flagPalette = palette
