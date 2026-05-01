// Insect enemy. Three states:
//   walking — same as a notebook
//   stunned — sits in place after one stomp; touch from the side to kick
//   kicked  — slides fast, defeats other enemies, bounces off walls
//
// On Camila's side, level1.js handles the player-vs-insect collision and
// flips state via setStunned / setKicked.

import { ENEMY_WALK_SPEED, INSECT_KICK_SPEED, INSECT_STUN_MS, TILE } from '../config.js'

export function makeInsect(x, y) {
  const w = 26
  const h = 22
  const e = add([
    rect(w, h),
    color(120, 180, 80),
    outline(2, rgb(40, 80, 30)),
    pos(x, y),
    anchor('bot'),
    area(),
    body(),
    'enemy',
    'insect',
    {
      dir: -1,
      kind: 'insect',
      state: 'walking',          // 'walking' | 'stunned' | 'kicked'
      stunTimer: 0,
      setStunned() {
        this.state = 'stunned'
        this.stunTimer = INSECT_STUN_MS / 1000
        this.color = rgb(160, 200, 110)
      },
      setKicked(dirFromPlayer) {
        this.state = 'kicked'
        this.dir = dirFromPlayer >= 0 ? 1 : -1
        this.color = rgb(80, 200, 130)
        this.use('kicked-shell')
      },
    },
  ])

  e.onUpdate(() => {
    if (e.state === 'walking') {
      e.move(e.dir * ENEMY_WALK_SPEED, 0)
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
        e.color = rgb(120, 180, 80)
      }
    } else if (e.state === 'kicked') {
      e.move(e.dir * INSECT_KICK_SPEED, 0)
    }
  })

  e.onCollide('solid', (other, col) => {
    if (!col) return
    if (e.state === 'walking') {
      if (col.isLeft())  e.dir = 1
      if (col.isRight()) e.dir = -1
    } else if (e.state === 'kicked') {
      if (col.isLeft())  e.dir = 1
      if (col.isRight()) e.dir = -1
    }
  })

  return e
}
