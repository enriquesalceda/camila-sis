// Pixel firework — a rising streak that explodes into a radial burst, then
// fades. Triggers a screen shake and a pop sound when it explodes.

import { play } from '../sounds.js'

const COLORS = [
  [255,  90,  90],
  [255, 200,  40],
  [110, 220, 255],
  [255, 130, 220],
  [120, 255, 130],
  [255, 255, 255],
]

export function spawnFirework(targetX, targetY, screen) {
  // Rising streak — a small bright dot that climbs from below screen up to
  // the target altitude.
  const startY = screen.bottom + 20
  const streak = add([
    rect(2, 8),
    pos(targetX, startY),
    color(255, 255, 255),
    anchor('center'),
    z(40),
    { _t: 0, _life: 0.55 },
  ])
  play('firework-whoosh')

  streak.onUpdate(() => {
    streak._t += dt()
    const k = streak._t / streak._life
    streak.pos.y = startY + (targetY - startY) * k
    if (k >= 1) {
      destroy(streak)
      explode(targetX, targetY)
    }
  })
}

function explode(x, y) {
  play('firework-pop')
  shake(2)
  const col = COLORS[Math.floor(Math.random() * COLORS.length)]
  // 16 sparks fly out in a circle, fading out as they go.
  const SPARKS = 16
  for (let i = 0; i < SPARKS; i++) {
    const angle = (i / SPARKS) * Math.PI * 2
    const speed = 110 + Math.random() * 40
    const spark = add([
      rect(3, 3),
      pos(x, y),
      color(col[0], col[1], col[2]),
      anchor('center'),
      opacity(1),
      z(40),
      lifespan(0.7, { fade: 0.4 }),
      { _vx: Math.cos(angle) * speed, _vy: Math.sin(angle) * speed },
    ])
    spark.onUpdate(() => {
      spark.pos.x += spark._vx * dt()
      spark.pos.y += spark._vy * dt()
      spark._vy += 120 * dt()  // gravity on sparks
    })
  }
}
