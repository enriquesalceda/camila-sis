// Chicken nugget. Golden-brown lumpy outline. 14 wide × 10 tall, 1 frame.
// The bobbing animation is added in the level1 maker via pos.y += sin(time)*2.

const palette = {
  '.': null,
  '#': '#5a3010',       // dark brown outline
  'B': '#cc8a2a',       // base golden brown
  'L': '#e6a948',       // light highlight
  'D': '#7a4a18',       // dark underside
}

const frame0 = [
  '...####.####..',
  '..#LLBB##LBLB#',
  '.#LLLLBLLLLLB#',
  '#LLLBBLLLLBLB#',
  '#BLBBBBBBBLLB#',
  '#BBBBBLLBBBBB#',
  '#BBBBBBBBBBBB#',
  '.#DDDDDDDDDD#.',
  '..##########..',
  '..............',
]

export const nuggetFrames  = [frame0]
export const nuggetPalette = palette
