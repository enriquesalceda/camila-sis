// Victory celebration scene. Camila has walked into the MR M'S castle and
// won. We fade in over a sunset gradient, plant her on top of the castle
// next to the giant M, surround her with dancing guests, and shoot
// fireworks while confetti rains down.
//
// =====================================================================
// CAMILA — TWEAKABLES
// All the things you can change to customize the party. Save the file and
// the browser reloads. The brand here is FICTIONAL — please don't put a
// real fast-food chain's name in BRAND_NAME.
// =====================================================================

// What to call the fictional fast-food brand on the castle.
export const BRAND_NAME = "MR M'S"

// Which big-M art to use: 'blocky' | 'chefhat' | 'fries' | 'burger'.
export const BRAND_LETTER_STYLE = 'blocky'

// Which mascot peeks from the castle window AND dances on the rooftop.
// 'burger' | 'fries' | 'shake' | 'nugget' | 'icecream' | 'chef'
export const MASCOT = 'burger'

// Friends who join Camila on the rooftop (4–6 of these strings).
export const CELEBRATION_GUESTS = [
  'notebook-party',
  'insect-party',
  'nugget-dance',
  'icecream-dance',
  'mascot',
]

// How many firework bursts go off during the celebration.
export const FIREWORK_COUNT = 6

// Optional CC0 music file in public/sounds/. Leave '' to use the synth loop.
export const MUSIC_TRACK = ''

// =====================================================================
// (You probably don't need to edit below here.)
// =====================================================================

import { LIVES_AT_START } from '../config.js'
import { play } from '../sounds.js'
import { playMusic, fadeMusicIn, fadeMusicOut } from '../music.js'
import { spawnFirework } from '../celebration/fireworks.js'
import { spawnConfetti } from '../celebration/confetti.js'
import { makeMascot }    from '../entities/mascot.js'

export function registerCelebrationScene() {
  scene('celebration', (arg = {}) => {
    setGravity(0)

    const W = width()
    const H = height()
    const screen = { width: W, height: H, bottom: H, top: 0 }

    // ---- Sky: tweens from daytime blue to sunset pink/orange over 1 s ----
    const sky = add([
      rect(W, H), pos(0, 0), color(135, 206, 235), fixed(), z(-100),
      { _t: 0 },
    ])
    const sunsetTop    = [255, 170,  90]
    const sunsetBottom = [255, 110, 140]
    const dayTop       = [135, 206, 235]
    sky.onUpdate(() => {
      sky._t = Math.min(1, sky._t + dt())
      const k = sky._t
      const r = dayTop[0] + (sunsetTop[0] - dayTop[0]) * k
      const g = dayTop[1] + (sunsetTop[1] - dayTop[1]) * k
      const b = dayTop[2] + (sunsetTop[2] - dayTop[2]) * k
      sky.color = rgb(r, g, b)
    })
    // Lower-band gradient for the horizon.
    const horizon = add([
      rect(W, H * 0.4), pos(0, H * 0.6),
      color(sunsetBottom[0], sunsetBottom[1], sunsetBottom[2]),
      fixed(), z(-99), opacity(0),
    ])
    horizon.onUpdate(() => { horizon.opacity = sky._t })

    // ---- Castle silhouette in the foreground (decorative; bottom-half) ----
    // We draw a simplified silhouette so Camila is on top of "the castle"
    // visually. Anchored bottom-center at (W/2, H + 16) so just the top of
    // the building shows.
    const castleX = W / 2
    const castleTopY = H * 0.45        // where the rooftop line sits
    const castleBaseY = H + 20
    add([
      pos(castleX, 0), fixed(), z(-40),
      {
        draw() {
          const bw = 380
          // Wall body — yellow with red roof band.
          drawRect({ pos: vec2(-bw / 2, castleTopY),
                     width: bw, height: castleBaseY - castleTopY,
                     color: rgb(255, 206, 46),
                     outline: { width: 4, color: rgb(26, 26, 26) } })
          drawRect({ pos: vec2(-bw / 2, castleTopY),
                     width: bw, height: 22,
                     color: rgb(221, 34, 51) })
          // Two squat arches in the lower half (purely decorative).
          for (const ax of [-90, 90]) {
            drawRect({ pos: vec2(ax - 36, castleTopY + 60),
                       width: 72, height: 140,
                       color: rgb(255, 206, 46),
                       outline: { width: 3, color: rgb(26, 26, 26) } })
            drawRect({ pos: vec2(ax - 22, castleTopY + 92),
                       width: 44, height: 100,
                       color: rgb(60, 30, 20) })
          }
        },
      },
    ])

    // ---- Big M on the rooftop (matches the in-level castle) ----
    const bigMW = 130
    const bigMH = 100
    const bigMY = castleTopY - bigMH / 2 - 6
    const bigM = add([
      sprite(`castle-bigm-${BRAND_LETTER_STYLE}`, { width: bigMW, height: bigMH }),
      pos(castleX, bigMY),
      anchor('center'),
      fixed(),
      z(-30),
    ])
    bigM.onUpdate(() => {
      bigM.pos.y = bigMY + Math.sin(time() * (Math.PI * 2 / 1.5)) * 2
    })

    // Wordmark banner just above the M for context.
    add([
      rect(160, 22), pos(castleX, bigMY - bigMH / 2 - 24),
      color(221, 34, 51), anchor('center'),
      outline(2, rgb(26, 26, 26)),
      fixed(), z(-29),
    ])
    add([
      text(BRAND_NAME, { font: 'press', size: 12 }),
      pos(castleX, bigMY - bigMH / 2 - 24),
      anchor('center'), color(255, 255, 255), fixed(), z(-28),
    ])

    // ---- Rooftop Camila ----
    const camilaX = castleX
    const camilaY = castleTopY + 4
    const camila = add([
      sprite('camila-dance', { width: 56, height: 84, frame: 0 }),
      pos(camilaX, camilaY),
      anchor('bot'),
      fixed(),
      z(10),
    ])
    camila.play('dance')
    // Face PNG overlay so the rooftop Camila reads as "her" — she swaps to
    // the power face for the win pose.
    camila.onDraw(() => {
      const yOff = -56 + Math.sin(time() * 6) * 1.5
      drawCircle({
        pos: vec2(0, yOff),
        radius: 18,
        color: rgb(255, 245, 220),
        outline: { width: 2, color: rgb(180, 130, 60) },
      })
      drawSprite({
        sprite: 'camila-power',
        pos: vec2(0, yOff),
        width: 32, height: 32,
        anchor: 'center',
      })
    })

    // ---- Guests on the rooftop ----
    const guests = CELEBRATION_GUESTS.slice(0, 6)
    const guestSpacing = 90
    const lineupCenter = castleX
    const totalSpan = (guests.length - 1) * guestSpacing
    guests.forEach((g, i) => {
      const gx = lineupCenter - totalSpan / 2 + i * guestSpacing
      const gy = castleTopY + 4
      // Skip the slot directly under Camila's body.
      if (Math.abs(gx - camilaX) < 32) return
      if (g === 'mascot') {
        makeMascot(gx, gy, MASCOT)
        return
      }
      const sprName = `cast-${g}`
      const e = add([
        sprite(sprName, { width: 40, height: 44, frame: 0 }),
        pos(gx, gy),
        anchor('bot'),
        fixed(),
        z(9),
        { _t: Math.random() * 2 },
      ])
      e.onUpdate(() => {
        e._t += dt() * 6
        e.frame = Math.floor(e._t) % 4
        e.pos.y = gy + Math.sin(time() * 4 + i) * 2
      })
    })

    // ---- Fireworks ----
    play('mascot-yay')
    let firedSoFar = 0
    const fireDelay = 0.6
    loop(fireDelay, () => {
      if (firedSoFar >= FIREWORK_COUNT) return
      firedSoFar++
      const fx = 80 + Math.random() * (W - 160)
      const fy = 60 + Math.random() * (H * 0.35)
      spawnFirework(fx, fy, screen)
    })
    // After the first batch, keep them sparkling at half rate for the rest
    // of the scene.
    wait(fireDelay * FIREWORK_COUNT + 1.0, () => {
      loop(1.4, () => {
        const fx = 80 + Math.random() * (W - 160)
        const fy = 60 + Math.random() * (H * 0.35)
        spawnFirework(fx, fy, screen)
      })
    })

    // ---- Confetti ----
    spawnConfetti(30, screen)

    // ---- Music ----
    playMusic({ track: MUSIC_TRACK })
    fadeMusicIn(1.0)

    // ---- After 2 s: WINS banner + buttons + stats ----
    wait(2.0, () => {
      // Drop shadow + main banner text — same recipe as the title.
      add([
        text('CAMILA WINS!', { font: 'press', size: 40 }),
        pos(W/2 + 4, H * 0.18 + 4), anchor('center'),
        color(20, 30, 60), fixed(), z(50),
      ])
      add([
        text('CAMILA WINS!', { font: 'press', size: 40 }),
        pos(W/2 + 2, H * 0.18 + 2), anchor('center'),
        color(180, 30, 30), fixed(), z(51),
      ])
      add([
        text('CAMILA WINS!', { font: 'press', size: 40 }),
        pos(W/2, H * 0.18), anchor('center'),
        color(255, 220, 0), fixed(), z(52),
      ])

      // Stats line.
      const nugs = arg.nuggets ?? 0
      const total = arg.total ?? 0
      const secs = Math.floor(arg.time ?? 0)
      const mm = Math.floor(secs / 60).toString().padStart(1, '0')
      const ss = (secs % 60).toString().padStart(2, '0')
      add([
        text(`NUGGETS: ${nugs} / ${total}    TIME: ${mm}:${ss}`,
             { font: 'press', size: 12 }),
        pos(W/2, H * 0.27), anchor('center'),
        color(255, 255, 255), fixed(), z(50),
      ])

      // Buttons.
      const btnY = H - 110
      const playBtn = makeButton(W/2 - 130, btnY, 'PLAY AGAIN', () => {
        fadeMusicOut(1.0)
        wait(0.6, () => go('level1', { lives: LIVES_AT_START }))
      })
      const menuBtn = makeButton(W/2 + 130, btnY, 'MAIN MENU', () => {
        fadeMusicOut(1.0)
        wait(0.6, () => go('menu'))
      })

      // Keyboard shortcuts.
      onKeyPress('space', () => playBtn.click())
      onKeyPress('escape', () => menuBtn.click())
    })
  })
}

// Small reusable pixel button — yellow rect with red shadow + black outline.
function makeButton(x, y, label, onClick) {
  const w = 220
  const h = 48
  const btn = add([
    rect(w, h), pos(x, y), color(255, 220, 0), anchor('center'),
    outline(3, rgb(26, 26, 26)),
    area(),
    fixed(),
    z(60),
  ])
  btn.add([
    text(label, { font: 'press', size: 12 }),
    pos(0, 0), anchor('center'), color(120, 30, 30),
  ])
  btn.click = () => { play('coin'); onClick() }
  // iPad Safari doesn't fire canvas-entity onClick handlers when Kaplay is
  // initialized with touchToMouse:false, so we hit-test on the global
  // onMousePress instead — same pattern menu.js and gameover.js use.
  onMousePress(() => {
    if (!btn.exists()) return
    const m = mousePos()
    const dx = Math.abs(m.x - btn.pos.x)
    const dy = Math.abs(m.y - btn.pos.y)
    if (dx <= w / 2 && dy <= h / 2) btn.click()
  })
  // Hover-ish nudge so it feels alive on touch / mouse.
  btn.onUpdate(() => { btn.pos.y = y + Math.sin(time() * 3 + x) * 1 })
  return btn
}
