// Homework notebook enemy. Walks side to side, flips at edges/walls.
// Pixel-art sprite from src/art/notebook.js drives the look; the wobble
// is a 2-frame animation registered in loader.js.

import { ENEMY_WALK_SPEED, TILE } from '../config.js'

export function makeNotebook(x, y) {
  const w = TILE - 4   // collision a touch narrower so passes don't snag
  const h = TILE - 4
  const e = add([
    sprite('notebook', { width: w, height: h }),
    pos(x, y),
    anchor('bot'),
    area(),
    body(),
    'enemy',
    'notebook',
    { dir: -1, kind: 'notebook' },
  ])
  e.play('walk')

  e.onUpdate(() => {
    e.move(e.dir * ENEMY_WALK_SPEED, 0)
    e.flipX = e.dir < 0

    const probeX = e.pos.x + e.dir * (w / 2 + 2)
    const probeY = e.pos.y + 4
    const groundAhead = get('solid').some((g) => {
      const gw = g.width  ?? TILE
      const gh = g.height ?? TILE
      return probeX >= g.pos.x && probeX <= g.pos.x + gw &&
             probeY >= g.pos.y && probeY <= g.pos.y + gh
    })
    if (!groundAhead) e.dir *= -1
  })

  e.onCollide('solid', (other, col) => {
    if (col && col.isLeft())  e.dir = 1
    else if (col && col.isRight()) e.dir = -1
  })

  return e
}
