// Insect enemy. Three states: walking (anim) / stunned (single frame) /
// kicked (single frame). Sprite-based — colors come from src/art/insect.js.

import { ENEMY_WALK_SPEED, INSECT_KICK_SPEED, INSECT_STUN_MS, TILE } from '../config.js'

export function makeInsect(x, y) {
  const w = TILE - 4
  const h = TILE - 8
  const e = add([
    sprite('insect', { width: w, height: h }),
    pos(x, y),
    anchor('bot'),
    area(),
    body(),
    'enemy',
    'insect',
    {
      dir: -1,
      kind: 'insect',
      state: 'walking',
      stunTimer: 0,
      setStunned() {
        this.state = 'stunned'
        this.stunTimer = INSECT_STUN_MS / 1000
        this.stop(); this.frame = 2  // 'stunned' frame
      },
      setKicked(dirFromPlayer) {
        this.state = 'kicked'
        this.dir = dirFromPlayer >= 0 ? 1 : -1
        this.stop(); this.frame = 3  // 'kicked' frame
        this.use('kicked-shell')
      },
    },
  ])
  e.play('walk')

  e.onUpdate(() => {
    if (e.state === 'walking') {
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
    } else if (e.state === 'stunned') {
      e.stunTimer -= dt()
      if (e.stunTimer <= 0) {
        e.state = 'walking'
        e.play('walk')
      }
    } else if (e.state === 'kicked') {
      e.move(e.dir * INSECT_KICK_SPEED, 0)
    }
  })

  e.onCollide('solid', (other, col) => {
    if (!col) return
    if (e.state === 'walking' || e.state === 'kicked') {
      if (col.isLeft())  e.dir = 1
      if (col.isRight()) e.dir = -1
    }
  })

  return e
}
