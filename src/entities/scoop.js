// Ice cream scoop projectile. Pink/white sphere sprite + 1px sparkle trail.

import { GRAVITY, SCOOP_SPEED, SCOOP_GRAVITY_SCALE } from '../config.js'

export function makeScoop(x, y, dir) {
  const s = add([
    sprite('scoop', { width: 16, height: 16 }),
    pos(x, y),
    anchor('center'),
    area(),
    body(),
    'scoop',
    { dir, _sparkleTimer: 0 },
  ])

  s.onUpdate(() => {
    s.move(s.dir * SCOOP_SPEED, 0)
    s.vel.y -= GRAVITY * (1 - SCOOP_GRAVITY_SCALE) * dt()

    // Sparkle trail — drop a 2×2 white speck every couple of frames.
    s._sparkleTimer += dt()
    if (s._sparkleTimer > 0.05) {
      s._sparkleTimer = 0
      const sp = add([
        sprite('sparkle', { width: 3, height: 3 }),
        pos(s.pos.x - s.dir * 8, s.pos.y),
        anchor('center'),
        opacity(0.9),
        z(2),
        lifespan(0.3, { fade: 0.3 }),
      ])
      sp.onUpdate(() => { sp.opacity -= dt() * 3 })
    }

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
