// MR M'S castle — a giant fictional fast-food restaurant entity that sits at
// the right end of level 1. Walking into the front door wins the game.
//
// The castle is composed of many small sprite/rect children all anchored to
// a single parent so the level scene only has to spawn ONE thing. Each
// piece animates independently in its own onUpdate.
//
// Design notes (see docs/spec): blocky pixel arches (NOT parabolic), a big
// pixel M with a configurable style, ripple-wave wordmark banner, blinking
// neon OPEN sign, smoke-puffing straw chimney, peeking mascot, chef-hat
// flag on top, drive-thru window with menu board, play tube, double doors.

import { makeMascot } from './mascot.js'

// All sizes are in world pixels (the level uses TILE=32). The castle is
// anchored at the BOTTOM-CENTER of its footprint, so castle.pos is the
// point on the ground where the doorway meets the floor.
const W            = 200    // building width
const H            = 220    // building height (~4× small Camila)

// Door (collision target) — sized so Camila walks through cleanly.
const DOOR_W       = 56
const DOOR_H       = 70

export function makeCastle(x, y, opts = {}) {
  const letterStyle = opts.letterStyle ?? 'blocky'
  const mascotKind  = opts.mascot      ?? 'burger'
  const brandName   = opts.brandName   ?? "MR M'S"

  const c = add([
    pos(x, y),
    'castle',
    { doorX: x, doorY: y - DOOR_H / 2 },
  ])

  // ============== Static building body (drawn each frame) ==============
  // We use onDraw rather than child rect()s so we can layer fills, outlines,
  // window highlights, and bricks in one place.
  c.onDraw(() => {
    // Wall body: yellow with red trim and a thick black outline.
    drawRect({ pos: vec2(-W/2, -H), width: W, height: H,
               color: rgb(255, 206, 46), outline: { width: 3, color: rgb(26, 26, 26) } })
    // Red roof band along the top.
    drawRect({ pos: vec2(-W/2, -H), width: W, height: 18,
               color: rgb(221, 34, 51), outline: { width: 2, color: rgb(26, 26, 26) } })
    // A second floor stripe (red) where the banner sits.
    drawRect({ pos: vec2(-W/2, -H + 60), width: W, height: 12,
               color: rgb(221, 34, 51) })

    // ----- Decorative pixel-style square windows along the upper floor -----
    // We draw 3 little windows. The middle one is reserved for the mascot
    // (we leave it blank so the mascot child sprite shows through).
    const winY = -H + 90
    for (let i = 0; i < 3; i++) {
      const wx = -W/2 + 30 + i * 70
      drawRect({ pos: vec2(wx, winY), width: 24, height: 24,
                 color: i === 1 ? rgb(60, 30, 20) : rgb(140, 200, 240),
                 outline: { width: 2, color: rgb(26, 26, 26) } })
      if (i !== 1) {
        // Window cross.
        drawRect({ pos: vec2(wx + 11, winY), width: 2, height: 24, color: rgb(26, 26, 26) })
        drawRect({ pos: vec2(wx, winY + 11), width: 24, height: 2, color: rgb(26, 26, 26) })
      }
    }

    // ----- Drive-thru window on the right side -----
    drawRect({ pos: vec2(W/2 - 56, -54), width: 40, height: 30,
               color: rgb(140, 200, 240),
               outline: { width: 2, color: rgb(26, 26, 26) } })
    // Speaker box just below the window (gray box with grille).
    drawRect({ pos: vec2(W/2 - 50, -22), width: 18, height: 18,
               color: rgb(80, 80, 80), outline: { width: 2, color: rgb(26, 26, 26) } })
    for (let g = 0; g < 3; g++) {
      drawRect({ pos: vec2(W/2 - 47 + g * 4, -18), width: 2, height: 10,
                 color: rgb(30, 30, 30) })
    }

    // ----- Menu board (dark with bright text rendered as a child) -----
    drawRect({ pos: vec2(W/2 - 12, -100), width: 56, height: 44,
               color: rgb(30, 30, 30), outline: { width: 2, color: rgb(255, 206, 46) } })

    // ----- Play tube poking out the LEFT side -----
    // Yellow translucent tube with a black outline; tiny dots inside
    // suggest pixel kids.
    drawRect({ pos: vec2(-W/2 - 32, -30), width: 36, height: 30,
               color: rgb(255, 230, 100), outline: { width: 2, color: rgb(26, 26, 26) } })
    drawCircle({ pos: vec2(-W/2 - 22, -15), radius: 3, color: rgb(255, 100, 150) })
    drawCircle({ pos: vec2(-W/2 - 8, -18), radius: 3, color: rgb(100, 200, 100) })
    drawCircle({ pos: vec2(-W/2 - 14, -22), radius: 2, color: rgb(100, 100, 220) })

    // ----- Bunting strung in front of arches (drawn over the wall) -----
    // 12 little triangle flags spaced across the doorway.
    const buntColors = [
      rgb(221, 34, 51), rgb(255, 206, 46), rgb(34, 170, 68),
      rgb(80, 140, 240), rgb(255, 102, 187),
    ]
    for (let i = 0; i < 12; i++) {
      const bx = -W/2 + 20 + i * (W - 40) / 11
      const by = -H + 110 + Math.sin(i * 0.7) * 4
      drawTriangle({
        p1: vec2(bx - 4, by),
        p2: vec2(bx + 4, by),
        p3: vec2(bx, by + 8),
        color: buntColors[i % buntColors.length],
      })
    }

    // ----- Doormat in front of the door so it reads as the entrance -----
    drawRect({ pos: vec2(-DOOR_W/2 - 8, -6), width: DOOR_W + 16, height: 6,
               color: rgb(120, 60, 30) })

    // ----- Smoke-straw chimney on the roof (red and white striped) -----
    const chX = W/2 - 32
    const chTop = -H - 14
    drawRect({ pos: vec2(chX, chTop), width: 12, height: 18,
               color: rgb(255, 255, 255),
               outline: { width: 2, color: rgb(26, 26, 26) } })
    drawRect({ pos: vec2(chX, chTop + 4), width: 12, height: 4, color: rgb(221, 34, 51) })
    drawRect({ pos: vec2(chX, chTop + 12), width: 12, height: 4, color: rgb(221, 34, 51) })
  })

  // ============== Two arches (sprite, blocky NOT parabolic) ==============
  const archW = 64
  const archH = 110
  c.add([
    sprite('castle-arch', { width: archW, height: archH }),
    pos(-50, -H + 95),
    anchor('top'),
    z(2),
  ])
  c.add([
    sprite('castle-arch', { width: archW, height: archH }),
    pos(50, -H + 95),
    anchor('top'),
    z(2),
  ])

  // ============== Big M (bouncing) ==============
  const bigM = c.add([
    sprite(`castle-bigm-${letterStyle}`, { width: 110, height: 84 }),
    pos(0, -H + 4),
    anchor('top'),
    z(3),
  ])
  bigM.onUpdate(() => {
    bigM.pos.y = (-H + 4) + Math.sin(time() * (Math.PI * 2 / 1.5)) * 2
  })

  // If 'chefhat' style, draw a tiny chef-hat sprite above the M.
  if (letterStyle === 'chefhat') {
    const hat = c.add([
      sprite('castle-chef-flag', { width: 28, height: 24, frame: 0 }),
      pos(0, -H - 4),
      anchor('bot'),
      z(4),
    ])
    hat.onUpdate(() => { hat.pos.y = (-H - 4) + Math.sin(time() * (Math.PI * 2 / 1.5)) * 2 })
  }

  // ============== Wordmark banner (waving) ==============
  // Red banner background as a rect, brand text as a child. We tween the
  // banner's local x slightly so it feels rippled by the wind.
  const bannerW = 130
  const bannerH = 22
  const bannerY = -H + 96
  const banner = c.add([
    pos(0, bannerY),
    anchor('center'),
    z(5),
  ])
  banner.onDraw(() => {
    drawRect({ pos: vec2(-bannerW/2, -bannerH/2), width: bannerW, height: bannerH,
               color: rgb(221, 34, 51), outline: { width: 2, color: rgb(26, 26, 26) } })
    // Pennant tails on each end.
    drawTriangle({
      p1: vec2(-bannerW/2 - 8, -bannerH/2),
      p2: vec2(-bannerW/2,     -bannerH/2),
      p3: vec2(-bannerW/2,      bannerH/2),
      color: rgb(163, 21, 28),
    })
    drawTriangle({
      p1: vec2(bannerW/2,     -bannerH/2),
      p2: vec2(bannerW/2 + 8, -bannerH/2),
      p3: vec2(bannerW/2,      bannerH/2),
      color: rgb(163, 21, 28),
    })
  })
  banner.add([
    text(brandName, { font: 'press', size: 10 }),
    pos(0, 0),
    anchor('center'),
    color(255, 255, 255),
  ])
  banner.onUpdate(() => {
    banner.pos.y = bannerY + Math.sin(time() * 3) * 1
  })

  // ============== "OPEN" neon sign (blinking) ==============
  const openY = -H + 30
  const openSign = c.add([
    pos(-W/2 + 12, openY),
    z(6),
    opacity(1),
  ])
  openSign.onDraw(() => {
    drawRect({ pos: vec2(0, 0), width: 44, height: 16,
               color: rgb(255, 120, 30),
               outline: { width: 2, color: rgb(26, 26, 26) } })
  })
  openSign.add([
    text('OPEN', { font: 'press', size: 8 }),
    pos(22, 8),
    anchor('center'),
    color(255, 255, 255),
  ])
  openSign.onUpdate(() => {
    // Blink: full brightness for ~0.6 s, dim for ~0.4 s.
    const t = (time() % 1.0)
    openSign.opacity = t < 0.6 ? 1 : 0.35
  })

  // ============== Menu board text (drawn over the dark rect) ==============
  c.add([
    text("TODAY'S\nSPECIAL\nNUGGETS\nICE CREAM\n   $$",
         { font: 'press', size: 4 }),
    pos(W/2 + 16, -78),
    anchor('center'),
    color(255, 206, 46),
    z(6),
  ])

  // ============== Front door (collision target) ==============
  // The doors are visually drawn here too — two halves with porthole windows
  // and a "PUSH" sign.
  const door = c.add([
    rect(DOOR_W, DOOR_H),
    pos(0, -DOOR_H/2),
    anchor('center'),
    color(140, 90, 50),
    outline(3, rgb(26, 26, 26)),
    area(),
    z(4),
    'castle-door',
  ])
  door.onDraw(() => {
    // Vertical seam between the two doors.
    drawRect({ pos: vec2(-1, -DOOR_H/2), width: 2, height: DOOR_H,
               color: rgb(26, 26, 26) })
    // Two porthole windows.
    drawCircle({ pos: vec2(-DOOR_W/4, -DOOR_H/2 + 18), radius: 6,
                 color: rgb(140, 200, 240),
                 outline: { width: 2, color: rgb(26, 26, 26) } })
    drawCircle({ pos: vec2( DOOR_W/4, -DOOR_H/2 + 18), radius: 6,
                 color: rgb(140, 200, 240),
                 outline: { width: 2, color: rgb(26, 26, 26) } })
    // Door handles.
    drawCircle({ pos: vec2(-4, -DOOR_H/2 + 36), radius: 2, color: rgb(255, 220, 80) })
    drawCircle({ pos: vec2( 4, -DOOR_H/2 + 36), radius: 2, color: rgb(255, 220, 80) })
  })
  door.add([
    text('PUSH', { font: 'press', size: 5 }),
    pos(0, DOOR_H/2 - 9),
    anchor('center'),
    color(255, 255, 255),
  ])

  // ============== Mascot peeking from middle window ==============
  const mascot = c.add([
    sprite(`mascot-${mascotKind}`, { width: 28, height: 34, frame: 0 }),
    pos(-W/2 + 100 + 12, -H + 105),  // ≈ middle window
    anchor('bot'),
    z(5),
    opacity(0),
    { _mode: 'hidden', _t: 0 },
  ])
  // Cycle: hide 2s → peek up 0.4s → wave 1.4s → drop 0.4s → repeat.
  mascot.onUpdate(() => {
    mascot._t += dt()
    const cycle = mascot._t % 4.2
    if (cycle < 2.0) {
      mascot.opacity = 0
    } else if (cycle < 2.4) {
      const k = (cycle - 2.0) / 0.4
      mascot.opacity = k
      mascot.frame = 0
    } else if (cycle < 3.8) {
      mascot.opacity = 1
      // Wave: alternate frames 2/3.
      mascot.frame = (Math.floor((cycle - 2.4) * 4) % 2) === 0 ? 2 : 3
    } else {
      const k = 1 - (cycle - 3.8) / 0.4
      mascot.opacity = Math.max(0, k)
    }
  })

  // ============== Chef-hat flag on top of the M ==============
  const flag = c.add([
    sprite('castle-chef-flag', { width: 32, height: 28 }),
    pos(W/2 - 60, -H - 30),
    anchor('bot'),
    z(2),
  ])
  flag.play('wave')

  // ============== Smoke puffs from the chimney-straw ==============
  // Spawn a new smoke sprite every 0.6 s rising from the chimney top.
  const chimneySpawn = c.add([ pos(W/2 - 26, -H - 16), z(1), { _t: 0 } ])
  chimneySpawn.onUpdate(() => {
    chimneySpawn._t += dt()
    if (chimneySpawn._t > 0.6) {
      chimneySpawn._t = 0
      // Spawn at the parent's world coordinates so the puff drifts
      // independently of the castle's transform.
      const wx = c.pos.x + W/2 - 26
      const wy = c.pos.y - H - 16
      const puff = add([
        sprite('castle-smoke', { width: 16, height: 16, frame: 0 }),
        pos(wx, wy),
        anchor('center'),
        opacity(1),
        z(1),
        lifespan(1.4, { fade: 0.5 }),
        { _vy: -22, _t: 0 },
      ])
      puff.onUpdate(() => {
        puff._t += dt()
        puff.pos.y += puff._vy * dt()
        puff.pos.x += Math.sin(puff._t * 4) * 0.4
        puff.frame = Math.min(3, Math.floor(puff._t * 3))
      })
    }
  })

  return c
}
