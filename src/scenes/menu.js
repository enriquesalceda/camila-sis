// Title screen — hero splash with full-body chef Camila on a tiny grass patch,
// parallax clouds, distant hills, a bubbling pot, a floating nugget, a
// notebook patrolling the bottom of the screen, and a sparkly bobbing logo.
//
// Camila — the three constants right below are for you. Change WHISK to SPOON
// or ICE_CREAM_CONE to swap the thing in your raised hand. Edit SUBTITLE_TEXT
// or VERSION_TAG and the title will update next time you reload.

import { LIVES_AT_START } from '../config.js'
import { unlockAudio, play } from '../sounds.js'

// ---- Camila-tunable constants ----
const HERO_PROP     = 'WHISK'                     // 'SPOON' | 'WHISK' | 'ICE_CREAM_CONE'
const SUBTITLE_TEXT = 'A GAME BY CAMILA & HER DAD (QUIQUE)'
const VERSION_TAG   = 'v0.1'
const SHOW_INSECT   = true                        // tag-along bug behind the notebook

export function registerMenuScene() {
  scene('menu', () => {
    setGravity(0)

    // ===== Background — sky gradient =====
    // Two stacked rects: light-blue top, slightly warmer cyan near the horizon.
    add([ rect(width(), height() * 0.65), color(135, 200, 240), pos(0, 0),                fixed(), z(-100) ])
    add([ rect(width(), height() * 0.35), color(180, 220, 240), pos(0, height() * 0.65),  fixed(), z(-100) ])

    // ===== Distant hill silhouettes (drawn behind the ground for depth) =====
    // Three soft rounded humps along the horizon, in a desaturated cool tone
    // so the foreground sprites pop.
    const horizonY = Math.round(height() * 0.78)
    add([
      pos(0, 0), fixed(), z(-80),
      {
        draw() {
          const humps = [
            { x: width() * 0.15, r: 90 },
            { x: width() * 0.40, r: 120 },
            { x: width() * 0.70, r: 100 },
            { x: width() * 0.92, r: 80 },
          ]
          for (const h of humps) {
            drawCircle({ pos: vec2(h.x, horizonY), radius: h.r, color: rgb(150, 175, 200) })
          }
          // Cap the hills below the horizon so they read as half-domes.
          drawRect({ pos: vec2(0, horizonY), width: width(), height: height(), color: rgb(180, 220, 240) })
        },
      },
    ])

    // ===== Parallax clouds — 4 of them, each at its own speed =====
    const CLOUD_FRAMES = [8, 9, 10]
    for (let i = 0; i < 4; i++) {
      const speed = rand(15, 35)             // px/sec
      const c = add([
        sprite('backgrounds', { frame: CLOUD_FRAMES[i % 3] }),
        pos(rand(0, width()), rand(40, 200)),
        scale(rand(2.0, 3.0)),
        anchor('center'),
        fixed(),
        z(-60),
      ])
      c.onUpdate(() => {
        c.pos.x += speed * dt()
        if (c.pos.x > width() + 80) c.pos.x = -80
      })
    }

    // ===== Ground patch (3 grass tiles + dirt row underneath) =====
    const tileScale = 3
    const tileSize  = 18 * tileScale          // 54
    const groundY   = Math.round(height() * 0.78)
    const groundX   = Math.round(width() / 2)
    for (let i = 0; i < 3; i++) {
      const grassFrame = i === 0 ? 0 : i === 2 ? 2 : 1
      const dirtFrame  = i === 0 ? 20 : i === 2 ? 22 : 21
      add([
        sprite('tiles', { frame: grassFrame }),
        pos(groundX + (i - 1) * tileSize, groundY),
        scale(tileScale), anchor('center'), fixed(), z(-20),
      ])
      add([
        sprite('tiles', { frame: dirtFrame }),
        pos(groundX + (i - 1) * tileSize, groundY + tileSize),
        scale(tileScale), anchor('center'), fixed(), z(-20),
      ])
    }

    // ===== Camila hero =====
    // Container so breathing scales the whole stack at once.
    const cScale  = 4
    const feetY   = groundY - Math.round(tileSize / 2)
    const FACE_Y     = -30 * cScale / 2     // mirrors the gameplay entity's offset, scaled
    const FACE_SIZE  = 28 * cScale / 2      // 56
    const RING_R    = FACE_SIZE / 2 + 2

    const camila = add([
      pos(groundX, feetY),
      scale(1, 1),
      fixed(),
      z(0),
      { winking: false },
    ])

    const body = camila.add([
      sprite('camila-small', { frame: 0, width: 16 * cScale, height: 24 * cScale }),
      pos(0, 0),
      anchor('bot'),
      rotate(0),
    ])

    // Face + portrait ring drawn on the body so they inherit the hat-sway angle.
    body.onDraw(() => {
      drawCircle({
        pos: vec2(0, FACE_Y),
        radius: RING_R,
        color: rgb(255, 245, 220),
        outline: { width: 2, color: rgb(180, 130, 60) },
      })
      drawSprite({
        sprite: camila.winking ? 'camila-power' : 'camila-normal',
        pos: vec2(0, FACE_Y),
        width: FACE_SIZE, height: FACE_SIZE,
        anchor: 'center',
      })
    })

    // Hero prop floating near her raised right hand. Tilts ±3° on a 1.5 s sine.
    // Position: 24 px right of center, 50 px above her feet — reads as "held aloft".
    const propX = 28
    const propY = -52
    const prop = camila.add([
      pos(propX, propY),
      anchor('center'),
      rotate(0),
      z(1),
    ])
    prop.onUpdate(() => {
      prop.angle = Math.sin(time() * (Math.PI * 2 / 1.5)) * 3
    })
    prop.onDraw(() => drawHeroProp(HERO_PROP))

    // Idle breathing — ±1.5 % over 1 s.
    camila.onUpdate(() => {
      const breath = Math.sin(time() * 2 * Math.PI) * 0.015
      camila.scale.y = 1 + breath
      // Hat sway — tiny ±2° rotation on the body, 1.5 s period.
      body.angle = Math.sin(time() * (Math.PI * 2 / 1.5)) * 2
    })

    // Wink loop — every 4 s, swap to power face for 200 ms.
    loop(4, () => {
      camila.winking = true
      wait(0.2, () => { camila.winking = false })
    })

    // ===== Cooking pot (left of Camila) with a steam puff on a 2 s loop =====
    const potX = groundX - tileSize - 20
    const potY = groundY - 4
    add([
      sprite('title-pot'),
      pos(potX, potY),
      scale(3),
      anchor('bot'),
      fixed(),
      z(-5),
    ])
    loop(2, () => {
      const puff = add([
        circle(3),
        pos(potX, potY - 14 * 3),
        color(255, 255, 255),
        opacity(0.9),
        fixed(),
        z(-4),
        lifespan(1.5, { fade: 1.0 }),
        { vy: -22 },
      ])
      puff.onUpdate(() => { puff.pos.y += puff.vy * dt() })
    })

    // ===== Floating nugget (right of Camila), 1 s bob =====
    const nuggetHomeY = groundY - tileSize - 18
    const nuggetX     = groundX + tileSize + 28
    const nugget = add([
      sprite('nugget'),
      pos(nuggetX, nuggetHomeY),
      scale(2.5),
      anchor('center'),
      fixed(),
      z(-5),
    ])
    nugget.onUpdate(() => {
      nugget.pos.y = nuggetHomeY + Math.sin(time() * 2 * Math.PI) * 3
    })

    // ===== Notebook patrol (bottom of screen, 15 s round trip) =====
    const noteY  = height() - 56
    const noteW  = 24 * 2
    const noteL  = -noteW
    const noteR  = width() + noteW
    const note = add([
      sprite('notebook'),
      pos(noteL, noteY),
      scale(2),
      anchor('center'),
      fixed(),
      z(5),
      { dir: 1 },
    ])
    note.play('walk')
    const noteSpeed = (noteR - noteL) / 7.5
    note.onUpdate(() => {
      note.pos.x += note.dir * noteSpeed * dt()
      if (note.pos.x > noteR && note.dir > 0) { note.dir = -1; note.flipX = true  }
      if (note.pos.x < noteL && note.dir < 0) { note.dir =  1; note.flipX = false }
    })

    // Optional insect tag-along — walks 30 px behind the notebook.
    if (SHOW_INSECT) {
      const bug = add([
        sprite('insect'),
        pos(noteL - 30, noteY + 12),
        scale(2),
        anchor('center'),
        fixed(),
        z(5),
      ])
      bug.play('walk')
      bug.onUpdate(() => {
        bug.pos.x = note.pos.x - note.dir * 30
        bug.flipX = note.dir < 0
      })
    }

    // ===== Logo block =====
    // 3-layer text (deep navy → red shadow → yellow fill) wrapped in a parent
    // that bobs ±2 px on a 1.2 s sine.
    const logoY  = Math.round(height() * 0.18)
    const logoX  = Math.round(width() / 2)
    const logo = add([ pos(logoX, logoY), fixed(), z(20) ])
    const logoLayers = [
      { dx: 6, dy: 6, c: [ 20,  20,  60] },   // deep navy drop shadow
      { dx: 4, dy: 4, c: [180,  30,  30] },   // red mid shadow
      { dx: 0, dy: 0, c: [255, 220,   0] },   // yellow fill
    ]
    logoLayers.forEach((L) => {
      logo.add([
        text('SUPER CAMILA SIS', { font: 'press', size: 36, align: 'center' }),
        pos(L.dx, L.dy),
        anchor('center'),
        color(...L.c),
      ])
    })
    logo.onUpdate(() => {
      logo.pos.y = logoY + Math.sin(time() * (Math.PI * 2 / 1.2)) * 2
    })

    // Sparkles: spawn a fresh 3-frame star at a random spot near the logo on a
    // randomized 0.5–2.0 s interval. The play()-once anim auto-fades on the
    // last frame via lifespan.
    function spawnSparkle() {
      const sx = logoX + rand(-260, 260)
      const sy = logoY + rand(-30,  30)
      const s = add([
        sprite('title-sparkle'),
        pos(sx, sy),
        scale(rand(2, 3)),
        anchor('center'),
        opacity(1),
        fixed(),
        z(21),
        lifespan(0.6, { fade: 0.2 }),
      ])
      s.play('twinkle')
      wait(rand(0.5, 2.0), spawnSparkle)
    }
    spawnSparkle()

    // Subtitle below the logo.
    add([
      text(SUBTITLE_TEXT, { font: 'press', size: 12, align: 'center' }),
      pos(logoX, logoY + 36),
      anchor('center'),
      color(140, 90, 10),
      fixed(),
      z(20),
    ])

    // ===== Prompt block =====
    const cta = add([
      text('TAP OR PRESS SPACE TO START', { font: 'press', size: 14 }),
      pos(width() / 2, height() - 80),
      anchor('center'),
      color(255, 255, 255),
      opacity(1),
      fixed(),
      z(30),
    ])
    cta.onUpdate(() => {
      cta.opacity = 0.75 + 0.25 * Math.sin(time() * Math.PI * 2)
    })

    add([
      text('Arrows + Space. Z, Enter or click throws ice cream.', { font: 'press', size: 10 }),
      pos(width() / 2, height() - 40),
      anchor('center'),
      color(140, 90, 10),
      fixed(),
      z(30),
    ])

    add([
      text(VERSION_TAG, { font: 'press', size: 8 }),
      pos(width() - 12, height() - 8),
      anchor('botright'),
      color(150, 150, 150),
      fixed(),
      z(30),
    ])

    // ===== Start handler =====
    const start = () => {
      unlockAudio()
      play('coin')
      go('level1', { lives: LIVES_AT_START })
    }

    onKeyPress('space', start)
    onMousePress(start)

    if (typeof location !== 'undefined' && location.search.includes('autostart')) {
      setTimeout(start, 100)
    }
  })
}

// Hand-drawn prop in Camila's raised hand. Three styles, drawn with primitive
// shapes so we don't need a separate sprite for each.
function drawHeroProp(kind) {
  if (kind === 'SPOON') {
    // Wooden spoon — brown handle + oval bowl.
    drawRect({ pos: vec2(-2, -2), width: 4, height: 22, color: rgb(120, 70, 30) })
    drawCircle({ pos: vec2(0, -10), radius: 7, color: rgb(160, 100, 50),
                 outline: { width: 1, color: rgb(60, 30, 10) } })
  } else if (kind === 'ICE_CREAM_CONE') {
    drawSprite({ sprite: 'ice-cream', pos: vec2(0, -4), width: 16, height: 16, anchor: 'center' })
    drawSprite({ sprite: 'scoop',     pos: vec2(0, -16), width: 18, height: 18, anchor: 'center' })
  } else {
    // WHISK — silver handle + 3 wire loops drawn as ovals.
    drawRect({ pos: vec2(-2, -4), width: 4, height: 18, color: rgb(180, 180, 195) })
    for (let i = 0; i < 3; i++) {
      drawCircle({ pos: vec2(0, -12), radius: 7 - i * 1.5, color: rgb(0, 0, 0, 0),
                   outline: { width: 1, color: rgb(220, 220, 230) } })
    }
    drawCircle({ pos: vec2(0, -3), radius: 2.5, color: rgb(140, 140, 160) })
  }
}
