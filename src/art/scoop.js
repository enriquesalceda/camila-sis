// Ice cream scoop projectile. Small pink/white sphere. 8×8, 1 frame.
// Sparkle trail is spawned in entities/scoop.js as separate objects.

const palette = {
  '.': null,
  '#': '#aa5577',       // dark pink outline
  'P': '#ff80a8',       // pink ring
  'W': '#fff0f4',       // white core
}

const frame0 = [
  '..####..',
  '.#PWWP#.',
  '#PWWWWP#',
  '#WWWWWW#',
  '#WWWWWW#',
  '#PWWWWP#',
  '.#PWWP#.',
  '..####..',
]

export const scoopFrames  = [frame0]
export const scoopPalette = palette

// Tiny 1×1 white pixel for the sparkle trail.
export const sparkleFrames  = [['W']]
export const sparklePalette = { 'W': '#ffffff' }
