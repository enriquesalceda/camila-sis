// Three-layer parallax background. Each layer is a screen-space `fixed()`
// sprite (or strip of sprites) whose pos.x is recalculated each frame as a
// fraction of the camera's world X. Sky is locked, clouds drift, hills move
// at half speed.

import { BG_FRAMES } from './loader.js'

export function spawnParallax({ levelWidth }) {
  const W = width()
  const H = height()
  const TILE_BG = 24

  // ---- Sky: tile a single sky-blue background tile across the canvas ----
  // Stays put — no parallax. Just a backdrop.
  for (let x = 0; x < W; x += TILE_BG) {
    add([
      sprite('backgrounds', { frame: BG_FRAMES.SKY_LIGHT, width: TILE_BG, height: H }),
      pos(x, 0),
      fixed(),
      z(-100),
    ])
  }

  // ---- Clouds: 4 cloud sprites at fixed Y, moving at 0.25× camera speed ----
  const cloudFrames = [BG_FRAMES.CLOUD_A, BG_FRAMES.CLOUD_B, BG_FRAMES.CLOUD_C]
  const cloudY = [40, 90, 60, 110]
  const cloudBaseX = [120, 380, 700, 940]
  const cloudFactor = 0.25
  for (let i = 0; i < 4; i++) {
    const baseX = cloudBaseX[i]
    const c = add([
      sprite('backgrounds', { frame: cloudFrames[i % cloudFrames.length], width: 96, height: 48 }),
      pos(baseX, cloudY[i]),
      fixed(),
      z(-50),
      opacity(0.95),
    ])
    c.onUpdate(() => {
      const camX = camPos().x - W / 2  // top-left of camera in world coords
      // Wrap so clouds re-enter the screen instead of drifting forever.
      const span = W + 200
      const drift = (baseX - camX * cloudFactor) % span
      c.pos.x = drift < 0 ? drift + span : drift
    })
  }

  // ---- Hills: silhouette tiles tiled across the bottom 3rd, 0.5× camera ----
  const hillFrames = [BG_FRAMES.HILL_A, BG_FRAMES.HILL_B, BG_FRAMES.HILL_C]
  const hillFactor = 0.5
  const hillY = H - 96 - 96   // sit just above the foreground ground row
  const hillTiles = []
  // Cover roughly twice the screen so we have wrap-around room.
  for (let i = 0; i < 16; i++) {
    const baseX = i * 96
    const f = hillFrames[i % hillFrames.length]
    const h = add([
      sprite('backgrounds', { frame: f, width: 96, height: 96 }),
      pos(baseX, hillY),
      fixed(),
      z(-25),
      opacity(0.85),
    ])
    h.baseX = baseX
    hillTiles.push(h)
  }
  // Single shared updater so we don't pay the per-object cost 16×.
  add([
    {
      update() {
        const camX = camPos().x - W / 2
        const span = 16 * 96
        for (const h of hillTiles) {
          let x = h.baseX - camX * hillFactor
          x = ((x % span) + span) % span
          if (x > W) x -= span
          h.pos.x = x
        }
      },
    },
  ])
}
