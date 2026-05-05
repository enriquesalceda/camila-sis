// Reusable pixel button — yellow rect with red shadow + black outline.
// Hit-tested via the global onMousePress because Kaplay's touchToMouse is
// disabled, so per-entity onClick handlers don't fire on iPad Safari.
//
// Usage:
//   makeButton(x, y, 'PLAY', () => go('level1'))
//   makeButton(x, y, 'BACK', () => go('menu'), { width: 160, height: 40 })

import { unlockAudio, play } from '../sounds.js'

export function makeButton(x, y, label, onClick, opts = {}) {
  const w = opts.width  ?? 220
  const h = opts.height ?? 48
  const fontSize = opts.fontSize ?? 12

  const btn = add([
    rect(w, h),
    pos(x, y),
    color(255, 220, 0),
    anchor('center'),
    outline(3, rgb(26, 26, 26)),
    area(),
    fixed(),
    z(60),
  ])
  btn.add([
    text(label, { font: 'press', size: fontSize }),
    pos(0, 0), anchor('center'), color(120, 30, 30),
  ])

  // unlockAudio() on every press so the first tap on a fresh page resumes
  // the WebAudio context — required by Safari/Chrome autoplay policy.
  btn.click = () => { unlockAudio(); play('coin'); onClick() }

  onMousePress(() => {
    if (!btn.exists()) return
    const m = mousePos()
    const dx = Math.abs(m.x - btn.pos.x)
    const dy = Math.abs(m.y - btn.pos.y)
    if (dx <= w / 2 && dy <= h / 2) btn.click()
  })

  // Subtle bob so it feels alive on touch and mouse.
  btn.onUpdate(() => { btn.pos.y = y + Math.sin(time() * 3 + x) * 1 })

  return btn
}
