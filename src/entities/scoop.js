// Ice cream scoop projectile. Camila throws it with X (or the 🍦 button).
// It flies in `dir` (1 = right, -1 = left) and falls a little — gravity is
// reduced via the SCOOP_GRAVITY_SCALE constant in config.

import { GRAVITY, SCOOP_SPEED, SCOOP_GRAVITY_SCALE } from '../config.js'

export function makeScoop(x, y, dir) {
  const s = add([
    rect(10, 10),
    color(255, 240, 245),
    outline(2, rgb(120, 60, 90)),
    pos(x, y),
    anchor('center'),
    area(),
    body(),
    'scoop',
    { dir },
  ])

  s.onUpdate(() => {
    s.move(s.dir * SCOOP_SPEED, 0)
    // We have body() → world gravity acts on us. Cancel out part of it so
    // the scoop floats further than a normal falling object.
    s.vel.y -= GRAVITY * (1 - SCOOP_GRAVITY_SCALE) * dt()

    // Despawn once we're well off camera or below the world.
    const cam = camPos()
    if (s.pos.x < cam.x - width()  ||
        s.pos.x > cam.x + width()  ||
        s.pos.y > height() * 2) {
      destroy(s)
    }
  })

  s.onCollide('solid', () => destroy(s))
  s.onCollide('enemy', (e) => {
    destroy(e)
    destroy(s)
  })

  return s
}
