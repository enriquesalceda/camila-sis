// Homework notebook enemy. Walks side to side. Flips when it would walk
// off a ledge or into a wall. Stomp from above to defeat it.

import { ENEMY_WALK_SPEED, TILE } from '../config.js'

export function makeNotebook(x, y) {
  const w = 28
  const h = 28
  const e = add([
    rect(w, h),
    color(255, 250, 240),
    outline(2, rgb(40, 40, 40)),
    pos(x, y),
    anchor('bot'),
    area(),
    body(),
    'enemy',
    'notebook',
    { dir: -1, kind: 'notebook' },
  ])

  // The "HOMEWORK" label so it's clear what this enemy is.
  e.onDraw(() => {
    drawText({
      text: 'HW',
      size: 10,
      pos: vec2(0, -h / 2 + 2),
      anchor: 'top',
      color: rgb(180, 30, 30),
    })
  })

  e.onUpdate(() => {
    e.move(e.dir * ENEMY_WALK_SPEED, 0)

    // If there's no ground in front of us, turn around.
    // We sample the world a bit beyond our front foot, just below ground level.
    const probeX = e.pos.x + e.dir * (w / 2 + 2)
    const probeY = e.pos.y + 4
    const groundAhead = get('solid').some((g) => {
      const gw = g.width  ?? TILE
      const gh = g.height ?? TILE
      const gx = g.pos.x
      const gy = g.pos.y
      return probeX >= gx && probeX <= gx + gw && probeY >= gy && probeY <= gy + gh
    })
    if (!groundAhead) e.dir *= -1
  })

  // Bumping into walls also flips us.
  e.onCollide('solid', (other, col) => {
    if (col && col.isLeft()) e.dir = 1
    else if (col && col.isRight()) e.dir = -1
  })

  return e
}
