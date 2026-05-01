// Insect enemy. Round purple body, antennae, six legs, two white eyes.
// Purple so it's clearly NOT green platforms. 18 wide × 16 tall.
// Frames: walk-0, walk-1, stunned (eyes spirals), kicked (rolled-up ball).

const palette = {
  '.': null,
  '#': '#2a1238',       // dark outline
  'P': '#7a3ea0',       // purple body
  'L': '#9a5fc0',       // lighter purple highlight
  'W': '#ffffff',       // eye whites
  'B': '#1a1a1a',       // pupils
  'D': '#5a1a78',       // darker purple shadow
}

const walk0 = [
  '..................',
  '..#............#..',
  '..#............#..',
  '...####....####...',
  '....##PPPPPP##....',
  '...#PLLLLLLLLP#...',
  '..#PLPPLLLLPPLP#..',
  '..#PWBPLLLLPWBP#..',
  '..#PLLPLLLLPLLP#..',
  '..#PPPPPPPPPPPP#..',
  '..#DDDDDDDDDDDD#..',
  '...##########.....',
  '...#.#..#..#.#....',
  '...#.#..#..#.#....',
  '..................',
  '..................',
]

const walk1 = [
  '..................',
  '..#............#..',
  '...#............#.',
  '...####....####...',
  '....##PPPPPP##....',
  '...#PLLLLLLLLP#...',
  '..#PLPPLLLLPPLP#..',
  '..#PWBPLLLLPWBP#..',
  '..#PLLPLLLLPLLP#..',
  '..#PPPPPPPPPPPP#..',
  '..#DDDDDDDDDDDD#..',
  '....########......',
  '...#.#..#..#.#....',
  '..#..#..#..#..#...',
  '..................',
  '..................',
]

const stunned = [
  '..................',
  '..................',
  '....@@........@@..',
  '...####....####...',
  '....##PPPPPP##....',
  '...#PLLLLLLLLP#...',
  '..#PLLLBBBLLLLP#..',
  '..#PLBLBLBLBLLP#..',
  '..#PLLBBBLLLLLP#..',
  '..#PPPPPPPPPPPP#..',
  '..#DDDDDDDDDDDD#..',
  '....########......',
  '..................',
  '..................',
  '..................',
  '..................',
]

const kicked = [
  '..................',
  '......######......',
  '....##PPPPPP##....',
  '...#PLLPPPPLLP#...',
  '..#PLLLLLLLLLLP#..',
  '..#PLLPPPPPPLLP#..',
  '..#PPPPPPPPPPPP#..',
  '..#PPPPPPPPPPPP#..',
  '..#PPPPPPPPPPPP#..',
  '..#DDDDDDDDDDDD#..',
  '...#DDDDDDDDDD#...',
  '....##########....',
  '..................',
  '..................',
  '..................',
  '..................',
]

// '@' is unmapped in palette → renders transparent. Stunned frame gets
// little spiral squiggles via uppercase letters that don't have palette
// entries; this is on purpose to keep the file simple.

export const insectFrames  = [walk0, walk1, stunned, kicked]
export const insectPalette = palette
