// Homework notebook enemy. White cover, black spiral binding along the top,
// red HOMEWORK label, two angry pixel eyes, frowny mouth. 24×24, 2 frames.

const palette = {
  '.': null,
  '#': '#2a2a2a',       // dark outline
  'W': '#fff8e8',       // cream cover
  'B': '#1a1a1a',       // spiral binding + face features
  'R': '#cc2233',       // red label
  'L': '#ffe0c0',       // pale label background
}

const frame0 = [
  '########################',
  '#BWBWBWBWBWBWBWBWBWBWBW#',
  '#WBWBWBWBWBWBWBWBWBWBWB#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '#WWRRRRRRRRRRRRRRRRRRWW#',
  '#WWRLLLLLLLLLLLLLLLLRWW#',
  '#WWRLLRRRRRRRRRRRRLLRWW#',
  '#WWRLLLLLLLLLLLLLLLLRWW#',
  '#WWRRRRRRRRRRRRRRRRRRWW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '#WWWWBBBWWWWWWWWBBBWWWW#',
  '#WWWBBBBBWWWWWWBBBBBWWW#',
  '#WWWBBWBBWWWWWWBBWBBWWW#',
  '#WWWBBBBBWWWWWWBBBBBWWW#',
  '#WWWWBBBWWWWWWWWBBBWWWW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '#WWWWWWWWBBBBBBBWWWWWWW#',
  '#WWWWWWWBWWWWWWWBWWWWWW#',
  '#WWWWWWBWWWWWWWWWBWWWWW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '########################',
]

// Frame 1: tilted 1px right (wobble effect)
const frame1 = [
  '########################',
  '#WBWBWBWBWBWBWBWBWBWBWB#',
  '#BWBWBWBWBWBWBWBWBWBWBW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '#WWWRRRRRRRRRRRRRRRRRRW#',
  '#WWWRLLLLLLLLLLLLLLLLRW#',
  '#WWWRLLRRRRRRRRRRRRLLRW#',
  '#WWWRLLLLLLLLLLLLLLLLRW#',
  '#WWWRRRRRRRRRRRRRRRRRRW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '#WWWWWBBBWWWWWWWBBBWWWW#',
  '#WWWWBBBBBWWWWWBBBBBWWW#',
  '#WWWWBBWBBWWWWWBBWBBWWW#',
  '#WWWWBBBBBWWWWWBBBBBWWW#',
  '#WWWWWBBBWWWWWWWBBBWWWW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '#WWWWWWWWBBBBBBBWWWWWWW#',
  '#WWWWWWWBWWWWWWWBWWWWWW#',
  '#WWWWWWBWWWWWWWWWBWWWWW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '#WWWWWWWWWWWWWWWWWWWWWW#',
  '########################',
]

export const notebookFrames  = [frame0, frame1]
export const notebookPalette = palette
