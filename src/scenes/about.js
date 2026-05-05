// About screen — credits, attribution, and a BACK button. Reached from the
// title screen's ABOUT button. Plays the welcome music loop while open, so
// players who detour through here also get the audio experience.
//
// Camila — edit the CREDITS lines below to update what shows up on this page.

import { playMusic, fadeMusicIn, fadeMusicOut } from '../music.js'
import { makeButton } from '../ui/button.js'

const TITLE = 'ABOUT'

const CREDITS = [
  'Made by Camila & her dad Quique.',
  '',
  'Sprites: Kenney pixel-platformer pack (CC0).',
  'Music & sound effects: original chiptune (no files,',
  'just math!).',
  '',
  'Built with Kaplay + Vite. Plays in the browser on',
  'iPad, laptop, and phone.',
]

export function registerAboutScene() {
  scene('about', () => {
    setGravity(0)

    // ===== Background — same sky gradient as the title screen =====
    add([ rect(width(), height() * 0.65), color(135, 200, 240), pos(0, 0),                fixed(), z(-100) ])
    add([ rect(width(), height() * 0.35), color(180, 220, 240), pos(0, height() * 0.65),  fixed(), z(-100) ])

    // Soft hill silhouette so the page feels like part of the title screen.
    const horizonY = Math.round(height() * 0.78)
    add([
      pos(0, 0), fixed(), z(-80),
      {
        draw() {
          const humps = [
            { x: width() * 0.20, r: 100 },
            { x: width() * 0.55, r: 130 },
            { x: width() * 0.85, r: 90 },
          ]
          for (const h of humps) {
            drawCircle({ pos: vec2(h.x, horizonY), radius: h.r, color: rgb(150, 175, 200) })
          }
          drawRect({ pos: vec2(0, horizonY), width: width(), height: height(), color: rgb(180, 220, 240) })
        },
      },
    ])

    // ===== A few drifting clouds for life =====
    const CLOUD_FRAMES = [8, 9, 10]
    for (let i = 0; i < 3; i++) {
      const speed = rand(15, 30)
      const c = add([
        sprite('backgrounds', { frame: CLOUD_FRAMES[i % 3] }),
        pos(rand(0, width()), rand(40, 180)),
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

    // ===== Title (3-layer pixel text, same recipe as the menu logo) =====
    const titleY = Math.round(height() * 0.18)
    const titleX = Math.round(width() / 2)
    const titleLayers = [
      { dx: 6, dy: 6, c: [ 20,  20,  60] },
      { dx: 4, dy: 4, c: [180,  30,  30] },
      { dx: 0, dy: 0, c: [255, 220,   0] },
    ]
    titleLayers.forEach((L) => {
      add([
        text(TITLE, { font: 'press', size: 36, align: 'center' }),
        pos(titleX + L.dx, titleY + L.dy),
        anchor('center'),
        color(...L.c),
        fixed(),
        z(20),
      ])
    })

    // ===== Credits block =====
    const startY = Math.round(height() * 0.36)
    const lineH  = 22
    CREDITS.forEach((line, i) => {
      add([
        text(line, { font: 'press', size: 12, align: 'center' }),
        pos(titleX, startY + i * lineH),
        anchor('center'),
        color(40, 40, 60),
        fixed(),
        z(20),
      ])
    })

    // ===== BACK button =====
    makeButton(width() / 2, height() - 80, 'BACK', () => {
      fadeMusicOut(0.4)
      wait(0.4, () => go('menu'))
    })

    // Keyboard escape hatch.
    onKeyPress('escape', () => {
      fadeMusicOut(0.4)
      wait(0.4, () => go('menu'))
    })
    onKeyPress('space', () => {
      fadeMusicOut(0.4)
      wait(0.4, () => go('menu'))
    })

    // ===== Music =====
    // Whoever navigated here just tapped a button, which calls unlockAudio()
    // and primes the WebAudio context, so the welcome loop plays right away.
    playMusic({ tune: 'menu' })
    fadeMusicIn(1.0, 0.4)
  })
}
