// Camila herself. We draw her from rectangles and one face photo so it's
// easy to tweak her costume — change the colors below to repaint her apron,
// hat, or legs without touching anything else.

import {
  CAMILA_SMALL_HEIGHT, CAMILA_TALL_HEIGHT,
  RUN_SPEED, JUMP_FORCE,
  INVULN_MS, POWERUP_FLASH_MS, WALK_FRAME_MS,
} from '../config.js'

// Body proportions for small vs tall. Everything is in pixels relative to
// Camila's feet (which is local 0,0 because we anchor the parent at "bot").
function bodyShape(state) {
  if (state === 'tall') {
    return {
      h: CAMILA_TALL_HEIGHT, w: 28,
      faceSize: 28, hatW: 26, hatH: 8,
      apronW: 24, apronH: 26, apronOffsetY: 32,
      stripeW: 14, stripeOffsetY: 42,
      legW: 6, legH: 10,
    }
  }
  return {
    h: CAMILA_SMALL_HEIGHT, w: 24,
    faceSize: 24, hatW: 22, hatH: 6,
    apronW: 20, apronH: 18, apronOffsetY: 24,
    stripeW: 10, stripeOffsetY: 32,
    legW: 6, legH: 8,
  }
}

export function makeCamila(x, y) {
  // Kaplay's `rgb` global only exists after the engine boots, which is why
  // these are inside the factory and not at module top.
  const HAT_COLOR    = rgb(255, 255, 255)
  const APRON_COLOR  = rgb(240, 240, 235)
  const STRIPE_COLOR = rgb(220, 40, 40)
  const LEG_COLOR    = rgb(80, 50, 30)
  const OUTLINE_COL  = rgb(40, 40, 40)

  const startBody = bodyShape('small')

  const c = add([
    pos(x, y),
    area({ shape: new Rect(vec2(-startBody.w / 2, -startBody.h), startBody.w, startBody.h) }),
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
      _legPhase: 0,
      _legAccum: 0,
      _danceAccum: 0,
      _danceFrame: 0,
    },
  ])

  function applyShape() {
    const b = bodyShape(c.state)
    c.area.shape = new Rect(vec2(-b.w / 2, -b.h), b.w, b.h)
  }

  c.setState = (next) => {
    c.state = next
    if (next === 'tall')      c.face = 'tall'
    else if (next === 'dead') c.face = 'dead'
    else                      c.face = 'normal'
    applyShape()
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

  // Brief invulnerability after a hit — flicker the whole player.
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

  // Walk-cycle leg swap and dance frame counter live in onUpdate.
  c.onUpdate(() => {
    if (c.dancing) {
      c._danceAccum += dt() * 1000
      if (c._danceAccum >= 150) {
        c._danceAccum = 0
        c._danceFrame = (c._danceFrame + 1) % 4
      }
    }
    if (Math.abs(c.vel.x) > 1 && c.isGrounded()) {
      c._legAccum += dt() * 1000
      if (c._legAccum >= WALK_FRAME_MS) {
        c._legAccum = 0
        c._legPhase = 1 - c._legPhase
      }
    } else {
      c._legPhase = 0
    }
  })

  // Custom drawing — hat, apron, legs, face.
  c.onDraw(() => {
    const b = bodyShape(c.state)

    // Legs (skip when dead so the death pose looks limp).
    if (c.state !== 'dead') {
      const legBaseY = -b.legH
      const liftL = c._legPhase === 0 ? 0 : -2
      const liftR = c._legPhase === 1 ? 0 : -2
      drawRect({ pos: vec2(-b.w / 2 + 2,         legBaseY + liftL), width: b.legW, height: b.legH - liftL, color: LEG_COLOR })
      drawRect({ pos: vec2( b.w / 2 - 2 - b.legW, legBaseY + liftR), width: b.legW, height: b.legH - liftR, color: LEG_COLOR })
    }

    // Apron body
    drawRect({
      pos: vec2(-b.apronW / 2, -b.h + b.apronOffsetY - 4),
      width: b.apronW, height: b.apronH,
      color: APRON_COLOR,
      outline: { width: 2, color: OUTLINE_COL },
    })
    // Apron stripe
    drawRect({
      pos: vec2(-b.stripeW / 2, -b.h + b.stripeOffsetY),
      width: b.stripeW, height: 3,
      color: STRIPE_COLOR,
    })

    // Face photo
    const danceBob = c.dancing ? (c._danceFrame % 2 === 0 ? -2 : 2) : 0
    drawSprite({
      sprite: 'camila-' + c.face,
      pos: vec2(0, -b.h + 2 + danceBob),
      width: b.faceSize,
      height: b.faceSize,
      anchor: 'top',
      flipX: c.facing < 0,
    })

    // Chef hat (drawn last so it sits on top of the face).
    drawRect({
      pos: vec2(-b.hatW / 2, -b.h - b.hatH + 2 + danceBob),
      width: b.hatW, height: b.hatH,
      color: HAT_COLOR,
      outline: { width: 2, color: OUTLINE_COL },
    })
    // Hat puff
    drawCircle({
      pos: vec2(0, -b.h - b.hatH + danceBob),
      radius: b.hatH * 0.9,
      color: HAT_COLOR,
      outline: { width: 2, color: OUTLINE_COL },
    })

    // Dance arms — only during the win dance.
    if (c.dancing) {
      const armUp = c._danceFrame % 2 === 0
      const armY = armUp ? -b.h + 8 : -b.h + 18
      drawRect({ pos: vec2(-b.w / 2 - 6, armY), width: 5, height: 16, color: APRON_COLOR })
      drawRect({ pos: vec2( b.w / 2 + 1, armY), width: 5, height: 16, color: APRON_COLOR })
    }
  })

  // Apply a manual horizontal velocity each frame from the level scene.
  c.driveX = (dir) => {
    if (c.frozen) { c.vel.x = 0; return }
    if (dir !== 0) c.facing = dir
    c.vel.x = dir * RUN_SPEED
  }

  c.tryJump = () => {
    if (c.frozen) return
    if (c.isGrounded()) {
      c.jump(JUMP_FORCE)
    }
  }

  return c
}
