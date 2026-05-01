// Loads every sprite, font, and hand-authored asset into Kaplay. Called once
// from main.js after kaplay() is initialised.

import { makePixelStrip } from './pixel-art.js'

import { camilaSmallFrames, camilaTallFrames, camilaPalette } from './art/camila-body.js'
import { notebookFrames, notebookPalette } from './art/notebook.js'
import { insectFrames,   insectPalette   } from './art/insect.js'
import { nuggetFrames,   nuggetPalette   } from './art/nugget.js'
import { flagFrames,     flagPalette     } from './art/flag.js'
import { scoopFrames,    scoopPalette,
         sparkleFrames,  sparklePalette  } from './art/scoop.js'
import { iceCreamFrames, iceCreamPalette } from './art/ice-cream.js'

// Frame indices into the Kenney `tiles` sheet (20 cols × 9 rows of 18×18 tiles).
// Camila — these numbers pick which little square of art to use for each
// thing. Open public/sprites/kenney/Preview.png to see them all in a grid.
export const TILE_FRAMES = {
  GRASS_TOP_LEFT:    0,
  GRASS_TOP_MID:     1,
  GRASS_TOP_RIGHT:   2,
  DIRT_MID_LEFT:    20,
  DIRT_MID_PLAIN:   21,
  DIRT_MID_RIGHT:   22,
  DIRT_BODY_A:      40,
  DIRT_BODY_B:      41,
  DIRT_BODY_C:      42,
  BRICK_BLOCK:      30,   // brown wooden block — used for floating platforms
  HEART:            44,
  COIN:            151,
  GEM:              67,
  MUSHROOM:        128,
  BUSH_A:          124,
  BUSH_B:          125,
  CACTUS:          127,
}

// Frame indices into the Kenney `backgrounds` sheet (8×3, 24×24 tiles).
export const BG_FRAMES = {
  SKY_LIGHT:    0,
  SKY_HORIZON:  1,
  CLOUD_A:      8,
  CLOUD_B:      9,
  CLOUD_C:     10,
  HILL_A:      16,
  HILL_B:      17,
  HILL_C:      18,
}

export function loadAssets() {
  // Existing face PNGs — left over from v0.1, still used for face overlay.
  loadSprite('camila-normal', './sprites/camila/normal.png')
  loadSprite('camila-power',  './sprites/camila/power.png')
  loadSprite('camila-tall',   './sprites/camila/tall.png')
  loadSprite('camila-dead',   './sprites/camila/dead.png')

  // Kenney sheets — 1px gutter between tiles in the packed sheets.
  loadSprite('tiles',       './sprites/kenney/tiles.png',       { sliceX: 20, sliceY: 9, gridWidth: 18, gridHeight: 18, spacing: 1 })
  loadSprite('backgrounds', './sprites/kenney/backgrounds.png', { sliceX: 8,  sliceY: 3, gridWidth: 24, gridHeight: 24, spacing: 1 })

  // Hand-authored sprites built from the JS pixel arrays in src/art/. Each
  // returns a <canvas> we can hand straight to loadSprite.
  loadSprite('camila-small', makePixelStrip(camilaSmallFrames, camilaPalette), {
    sliceX: 2,
    anims: { idle: 0, walk: { from: 0, to: 1, loop: true, speed: 6 } },
  })
  loadSprite('camila-tall-body', makePixelStrip(camilaTallFrames, camilaPalette), {
    sliceX: 2,
    anims: { idle: 0, walk: { from: 0, to: 1, loop: true, speed: 6 } },
  })
  loadSprite('notebook', makePixelStrip(notebookFrames, notebookPalette), {
    sliceX: 2,
    anims: { walk: { from: 0, to: 1, loop: true, speed: 4 } },
  })
  loadSprite('insect', makePixelStrip(insectFrames, insectPalette), {
    sliceX: 4,
    anims: { walk: { from: 0, to: 1, loop: true, speed: 8 }, stunned: 2, kicked: 3 },
  })
  loadSprite('nugget',    makePixelStrip(nuggetFrames,    nuggetPalette))
  loadSprite('ice-cream', makePixelStrip(iceCreamFrames, iceCreamPalette))
  loadSprite('flag', makePixelStrip(flagFrames, flagPalette), {
    sliceX: 3,
    anims: { wave: { from: 0, to: 2, loop: true, speed: 6 } },
  })
  loadSprite('scoop',   makePixelStrip(scoopFrames,   scoopPalette))
  loadSprite('sparkle', makePixelStrip(sparkleFrames, sparklePalette))

  // Pixel font, bundled locally — never fetched from a CDN.
  loadFont('press', './fonts/press-start-2p.ttf')
}
