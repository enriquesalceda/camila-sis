// CAMILA — this file is your level. The picture below is your level map.
// Each letter is one square. To change the level, just change letters!
//
// Legend:
//   =  ground (hard, you can stand on it)
//   -  floating platform (also hard)
//   ?  chicken nugget (makes you tall!)
//   i  ice cream (lets you throw scoops with X)
//   n  homework notebook (enemy — jump on its head)
//   b  insect (enemy — jump twice to kick its shell)
//   F  goal flag (touch it to win)
//   S  where Camila starts the level
//   .  empty sky (nothing there)

import { TILE } from '../config.js'

export const LEGEND = {
  '=': 'ground',
  '-': 'platform',
  '?': 'nugget',
  'i': 'ice cream',
  'n': 'notebook enemy',
  'b': 'insect enemy',
  'F': 'goal flag',
  'S': 'spawn point',
  '.': 'empty sky',
}

// Bottom row of this string is the bottom of the world. Now ~160 chars wide
// — about four screens at TILE=32 — so the camera dead-zone has room to scroll.
export const LEVEL_1 = [
  '................................................................................................................................................................',
  '................................................................................................................................................................',
  '........................?....................?.....................?..............?......?......................?...............?...........................',
  '.............................................................................................................................................................',
  '....?....i.------.........?....---------.............?------.i............-----------..............---------?.............-------......?.......-----.........',
  '...............................................................................................................................................F............',
  '...............................................................................................................................................F............',
  'S......n.........b...........n.....?....b...........n.........?......b.....?......n........?......b.........n.....?......b........n......?....F............',
  '================================================================================================================================================================',
].join('\n')

// Walks the ASCII map row by row and calls a maker for each non-empty glyph.
// `makers` is an object whose keys are functions that build the actual game
// objects (we get those from level1.js scene). `offsetY` shifts every tile
// vertically so we can pin the level to the bottom of the camera.
export function parseLevel(ascii, makers, { offsetX = 0, offsetY = 0 } = {}) {
  const lines = ascii.split('\n')
  const rows = lines.length
  let levelWidth = 0
  let spawn = { x: TILE + offsetX, y: TILE * (rows - 2) + offsetY }

  for (let r = 0; r < rows; r++) {
    const line = lines[r]
    if (line.length > levelWidth) levelWidth = line.length
    for (let c = 0; c < line.length; c++) {
      const ch = line[c]
      const x = c * TILE + offsetX
      const y = r * TILE + offsetY
      switch (ch) {
        case '=': makers.ground(x, y);                 break
        case '-': makers.platform(x, y);               break
        case '?': makers.nugget(x + TILE/2, y + TILE/2);   break
        case 'i': makers.iceCream(x + TILE/2, y + TILE/2); break
        case 'n': makers.notebook(x + TILE/2, y + TILE);   break
        case 'b': makers.insect(x + TILE/2, y + TILE);     break
        case 'F': makers.flag(x + TILE/2, y + TILE);       break
        case 'S': spawn = { x: x + TILE/2, y: y + TILE };  break
        case '.': case ' ': /* sky */                    break
        default:
          // Camila might mistype something. Don't crash — just say what we saw.
          // eslint-disable-next-line no-console
          console.warn(`Unknown level character "${ch}" at row ${r}, col ${c}`)
      }
    }
  }

  return { spawn, levelWidth: levelWidth * TILE, levelHeight: rows * TILE }
}
