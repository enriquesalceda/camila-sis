// Camila — pixel-art chef body sprite plus the face PNG composited on top of
// the head region. Physics, state machine, and helper methods are unchanged
// from v0.1; the only thing that's different is what gets drawn.

import {
  CAMILA_SMALL_HEIGHT, CAMILA_TALL_HEIGHT,
  RUN_SPEED, JUMP_FORCE,
  INVULN_MS, POWERUP_FLASH_MS,
} from '../config.js'

// Body width matches both the sprite and the collision box. Native sprite is
// 16 wide so we render at scale 2 to land on a clean 32 px collision box.
const BODY_WIDTH = 32
// Face PNG overlay size + offset within the body, in object-local coords
// (anchor 'bot', so y=0 is at feet, y goes negative upward).
const FACE_SIZE = 22
const FACE_Y_SMALL = -32
const FACE_Y_TALL  = -50

export function makeCamila(x, y) {
  const c = add([
    sprite('camila-small', { width: BODY_WIDTH, height: CAMILA_SMALL_HEIGHT }),
    pos(x, y),
    area(),
    body(),
    anchor('bot'),
    opacity(1),
    'player',
    {
      state: 'small',          // 'small' | 'tall' | 'dead'
      face: 'normal',          // 'normal' | 'tall' | 'power' | 'dead'
      facing: 1,               // 1 = right, -1 = left
      hasScoop: false,
      invuln: false,
      frozen: false,
      dancing: false,
      _danceAccum: 0,
      _danceFrame: 0,
    },
  ])
  c.play('idle')

  function bodySprite() {
    return c.state === 'tall' ? 'camila-tall-body' : 'camila-small'
  }

  function bodyHeight() {
    return c.state === 'tall' ? CAMILA_TALL_HEIGHT : CAMILA_SMALL_HEIGHT
  }

  c.setState = (next) => {
    c.state = next
    if (next === 'tall')      c.face = 'tall'
    else if (next === 'dead') c.face = 'dead'
    else                      c.face = 'normal'
    if (next !== 'dead') {
      c.use(sprite(bodySprite(), { width: BODY_WIDTH, height: bodyHeight() }))
      c.play(Math.abs(c.vel.x) > 1 ? 'walk' : 'idle')
    }
  }

  c.flashPowerUp = (onDone) => {
    let flips = 0
    const t = loop(POWERUP_FLASH_MS / 1000 / 8, () => {
      flips++
      c.face = (flips % 2 === 0) ? 'normal' : 'power'
      if (flips >= 7) {
        t.cancel()
        c.setState('tall')
        if (onDone) onDone()
      }
    })
  }

  c.startInvuln = () => {
    c.invuln = true
    let elapsed = 0
    const flick = loop(0.08, () => {
      c.opacity = c.opacity === 1 ? 0.3 : 1
      elapsed += 80
      if (elapsed >= INVULN_MS) {
        flick.cancel()
        c.opacity = 1
        c.invuln = false
      }
    })
  }

  c.startDance = () => {
    c.dancing = true
    c.frozen = true
  }

  // Walk animation tracking + dance frame counter.
  c.onUpdate(() => {
    if (c.dancing) {
      c._danceAccum += dt() * 1000
      if (c._danceAccum >= 150) {
        c._danceAccum = 0
        c._danceFrame = (c._danceFrame + 1) % 4
      }
    }
    // Sync walk anim with grounded movement.
    if (c.state !== 'dead') {
      const moving = Math.abs(c.vel.x) > 5 && c.isGrounded()
      if (moving && c.curAnim() !== 'walk') c.play('walk')
      else if (!moving && c.curAnim() === 'walk') { c.stop(); c.frame = 0 }
    }
    // Mirror sprite when facing left.
    c.flipX = c.facing < 0
  })

  // Face PNG overlay — drawn on top of the body sprite each frame, snapped
  // to the head region of whichever body sprite is current.
  c.onDraw(() => {
    const yOffset = c.state === 'tall' ? FACE_Y_TALL : FACE_Y_SMALL
    const danceBob = c.dancing ? (c._danceFrame % 2 === 0 ? -2 : 2) : 0
    drawSprite({
      sprite: 'camila-' + c.face,
      pos: vec2(0, yOffset + danceBob),
      width: FACE_SIZE, height: FACE_SIZE,
      anchor: 'center',
      flipX: c.facing < 0,
    })
  })

  c.driveX = (dir) => {
    if (c.frozen) { c.vel.x = 0; return }
    if (dir !== 0) c.facing = dir
    c.vel.x = dir * RUN_SPEED
  }

  c.tryJump = () => {
    if (c.frozen) return
    if (c.isGrounded()) c.jump(JUMP_FORCE)
  }

  return c
}
