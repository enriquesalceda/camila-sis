// MR M'S castle pixel-art bundle.
//
// Camila — every piece of the giant restaurant on the right end of the level
// lives in this one file. Each art piece is a tiny grid of letters; the
// palette dict at the top of each section says what each letter means.
//
// The whole castle is drawn at scale 4× in the entity, so a 1-pixel here
// becomes 4 pixels in the game. That's why the grids look small.
//
// IMPORTANT: this is a fictional fast-food brand. The arches are blocky on
// purpose — NOT smooth parabolic arches.

// ---------- shared palette pieces ----------
// Y = bright cartoon yellow
// y = darker yellow shadow
// R = tomato red
// r = dark red shadow
// W = white (banner text bg, sign light)
// # = black/dark outline
// . = transparent

const Y = '#ffce2e'
const y = '#d99c12'
const R = '#dd2233'
const r = '#a3151c'
const W = '#ffffff'
const K = '#1a1a1a'
const O = '#ff8800'   // neon "OPEN" orange-glow
const G = '#33cc44'   // bunting green
const B = '#3388ff'   // bunting blue
const P = '#ff66bb'   // bunting pink

// ---------------- ARCH (one of two) ----------------
// 24 wide × 40 tall — a chunky, slightly wonky pixel arch. Kid's-drawing
// look. Bunting strung along the inner curve.
// 'b' = bunting flag rotates between G/B/P at draw time, so we use a single
// marker char here and the entity overlays bunting flags as separate dots.

export const archPalette = {
  '.': null,
  '#': K,
  'Y': Y,
  'y': y,
  'b': '#33cc44',   // bunting placeholder; entity will recolor
}

// Arch is 24w × 40h. Top-left/right corners stepped, big rectangular cutout
// in the middle (the doorway), thick yellow walls. Slight wonkiness on the
// right pillar so it doesn't look corporate.
export const archFrames = [[
  '....################....',
  '..####YYYYYYYYYYYY####..',
  '.##YYYYYYYYYYYYYYYYYY##.',
  '##YYYYYYYYYYYYYYYYYYYY##',
  '#YYYYYYYYYYYYYYYYYYYYYY#',
  '#YYYYY#############YYYY#',
  '#YYY##bbbbbbbbbbb###YYY#',
  '#YY##b...........b##yYY#',
  '#YY#b.............b#yYY#',
  '#Y##...............##YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#Y#.................#YY#',
  '#YY#...............##YY#',
  '#YYY#.............##YYY#',
  '#YYYY############YYYYYY#',
  '########################',
]]

// ---------------- BIG M VARIANTS ----------------
// 32 wide × 24 tall. Bright yellow with red pixel outline.

const mPaletteCommon = {
  '.': null,
  '#': K,
  'R': R,
  'Y': Y,
  'y': y,
  'W': W,
  'B': '#8b4513',   // burger bun brown
  'G': '#22aa44',   // lettuce green for burger
  'O': '#ff8800',   // fries orange-yellow
}

export const bigMPalette = mPaletteCommon

// 'blocky' — just the M letter
const M_BLOCKY = [
  '################################',
  '#RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR#',
  '#RYYYYRRRRRRRRRRRRRRRRRRRRYYYYR#',
  '#RYYYYYRRRRRRRRRRRRRRRRRRYYYYYR#',
  '#RYYYYYYRRRRRRRRRRRRRRRYYYYYYYR#',
  '#RYYYYYYYYRRRRRRRRRRRYYYYYYYYYR#',
  '#RYYYYYYYYYYRRRRRRYYYYYYYYYYYYR#',
  '#RYYYYYYYYYYYYYYYYYYYYYYYYYYYYR#',
  '#RYYYYYYYYYyyyyyyyyyyYYYYYYYYYR#',
  '#RYYYYYYYYYyyyyyyyyyyYYYYYYYYYR#',
  '#RYYYYYYYYYRRRRRRRRRRYYYYYYYYYR#',
  '#RYYYYYYYYRRRRRRRRRRRRYYYYYYYYR#',
  '#RYYYYYYYYRRRRRRRRRRRRYYYYYYYYR#',
  '#RYYYYYYYYRRRRRRRRRRRRYYYYYYYYR#',
  '#RYYYYYYYRRRRRRRRRRRRRRYYYYYYYR#',
  '#RYYYYYYRRRRRRRRRRRRRRRRYYYYYYR#',
  '#RYYYYYYRRRRRRRRRRRRRRRRYYYYYYR#',
  '#RYYYYYRRRRRRRRRRRRRRRRRRYYYYYR#',
  '#RYYYYYRRRRRRRRRRRRRRRRRRYYYYYR#',
  '#RYYYYRRRRRRRRRRRRRRRRRRRRYYYYR#',
  '#RYYYRRRRRRRRRRRRRRRRRRRRRRYYYR#',
  '#RYYRRRRRRRRRRRRRRRRRRRRRRRRYYR#',
  '#RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR#',
  '################################',
]

// 'chefhat' — same M with a chef hat on top (the hat is rendered separately
// by the entity using a small sprite, so this frame matches blocky).
const M_CHEFHAT = M_BLOCKY

// 'fries' — M with orange-yellow outline (fry color) instead of red, and a
// hint of fry-stripes near the legs. Same row width as the others (32).
const M_FRIES = [
  '################################',
  '#OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO#',
  '#OYYYYOOOOOOOOOOOOOOOOOOOOYYYYO#',
  '#OYYYYYOOOOOOOOOOOOOOOOOOYYYYYO#',
  '#OYYYYYYOOOOOOOOOOOOOOOYYYYYYYO#',
  '#OYYYYYYYYOOOOOOOOOOOYYYYYYYYYO#',
  '#OYYYYYYYYYYOOOOOOYYYYYYYYYYYYO#',
  '#OYYYYYYYYYYYYYYYYYYYYYYYYYYYYO#',
  '#OYYYYYYYYYyyyyyyyyyyYYYYYYYYYO#',
  '#OYYYYYYYYYyyyyyyyyyyYYYYYYYYYO#',
  '#OYYYYYYYYYOOOOOOOOOOYYYYYYYYYO#',
  '#OYYYYYYYYOOOOOOOOOOOOYYYYYYYYO#',
  '#OYYYYYYYYOyOyOyOyOyOOYYYYYYYYO#',
  '#OYYYYYYYYOOOOOOOOOOOOYYYYYYYYO#',
  '#OYYYYYYYOOOOOOOOOOOOOOYYYYYYYO#',
  '#OYYYYYYOOOOOOOOOOOOOOOOYYYYYYO#',
  '#OYYYYYYOyOyOyOyOyOyOyOOYYYYYYO#',
  '#OYYYYYOOOOOOOOOOOOOOOOOOYYYYYO#',
  '#OYYYYYOOOOOOOOOOOOOOOOOOYYYYYO#',
  '#OYYYYOOOOOOOOOOOOOOOOOOOOYYYYO#',
  '#OYYYOOOOOOOOOOOOOOOOOOOOOOYYYO#',
  '#OYYOOOOOOOOOOOOOOOOOOOOOOOOYYO#',
  '#OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO#',
  '################################',
]

// 'burger' — M with a burger as the crossbar (brown B + green G in middle)
const M_BURGER = [
  '################################',
  '#RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR#',
  '#RYYYYRRRRRRRRRRRRRRRRRRRRYYYYR#',
  '#RYYYYYRRRRRRRRRRRRRRRRRRYYYYYR#',
  '#RYYYYYYRRRRRRRRRRRRRRRYYYYYYYR#',
  '#RYYYYYYYYRRRRRRRRRRRYYYYYYYYYR#',
  '#RYYYYYYYYYYRRRRRRYYYYYYYYYYYYR#',
  '#RYYYYYYYYYYYYYYYYYYYYYYYYYYYYR#',
  '#RYYYYYYYYBBBBBBBBBBBBYYYYYYYYR#',
  '#RYYYYYYYBBBBBBBBBBBBBBYYYYYYYR#',
  '#RYYYYYYYGGGGGGGGGGGGGGYYYYYYYR#',
  '#RYYYYYYYRRRRRRRRRRRRRRYYYYYYYR#',
  '#RYYYYYYYBBBBBBBBBBBBBBYYYYYYYR#',
  '#RYYYYYYYBBBBBBBBBBBBBBYYYYYYYR#',
  '#RYYYYYYYBBBBBBBBBBBBBBYYYYYYYR#',
  '#RYYYYYYRRRRRRRRRRRRRRRRYYYYYYR#',
  '#RYYYYYYRRRRRRRRRRRRRRRRYYYYYYR#',
  '#RYYYYYRRRRRRRRRRRRRRRRRRYYYYYR#',
  '#RYYYYYRRRRRRRRRRRRRRRRRRYYYYYR#',
  '#RYYYYRRRRRRRRRRRRRRRRRRRRYYYYR#',
  '#RYYYRRRRRRRRRRRRRRRRRRRRRRYYYR#',
  '#RYYRRRRRRRRRRRRRRRRRRRRRRRRYYR#',
  '#RRRRRRRRRRRRRRRRRRRRRRRRRRRRRR#',
  '################################',
]

export const bigMVariants = {
  blocky:  [M_BLOCKY],
  chefhat: [M_CHEFHAT],
  fries:   [M_FRIES],
  burger:  [M_BURGER],
}

// ---------------- CHEF-HAT FLAG (3-frame wave) ----------------
// 16 wide × 14 tall, atop a thin pole drawn separately.
export const chefFlagPalette = {
  '.': null,
  '#': K,
  'W': W,
  'P': '#aaaaaa', // pole
}

const cf0 = [
  '..######........',
  '.########.......',
  'WWWWWWWWWW......',
  'WWWWWWWWWWW.....',
  'WWWWWWWWWWW.....',
  'W#W#W#W#W#W.....',
  '###########.....',
  'PPPPPPPPPPP.....',
  '.P..............',
  '.P..............',
  '.P..............',
  '.P..............',
  '.P..............',
  '.P..............',
]
const cf1 = [
  '...######.......',
  '..########......',
  '.WWWWWWWWWW.....',
  '.WWWWWWWWWWW....',
  '.WWWWWWWWWWW....',
  '.W#W#W#W#W#W....',
  '.###########....',
  'PPPPPPPPPPPP....',
  '.P..............',
  '.P..............',
  '.P..............',
  '.P..............',
  '.P..............',
  '.P..............',
]
const cf2 = [
  '....######......',
  '...########.....',
  '..WWWWWWWWWW....',
  '..WWWWWWWWWWW...',
  '..WWWWWWWWWWW...',
  '..W#W#W#W#W#W...',
  '..###########...',
  'PPPPPPPPPPPPP...',
  '.P..............',
  '.P..............',
  '.P..............',
  '.P..............',
  '.P..............',
  '.P..............',
]
export const chefFlagFrames = [cf0, cf1, cf2]

// ---------------- SMOKE PUFF (4-frame fade) ----------------
export const smokePalette = {
  '.': null,
  'a': '#ffffff',
  'b': '#dddddd',
  'c': '#bbbbbb',
}
const sp0 = [
  '..aa....',
  '.aaaa...',
  'aaaaaa..',
  '.aaaa...',
  '..aa....',
  '........',
  '........',
  '........',
]
const sp1 = [
  '.bbbb...',
  'bbbbbb..',
  'bbbbbbb.',
  'bbbbbb..',
  '.bbbb...',
  '..b.....',
  '........',
  '........',
]
const sp2 = [
  '.cccc...',
  'cccccc..',
  'cccccc..',
  'cccccc..',
  '.cccc...',
  '...c....',
  '........',
  '........',
]
const sp3 = [
  '..cc....',
  '.cccc...',
  '.cccc...',
  '..cc....',
  '........',
  '........',
  '........',
  '........',
]
export const smokeFrames = [sp0, sp1, sp2, sp3]
