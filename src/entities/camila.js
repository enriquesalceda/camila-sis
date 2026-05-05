// Camila — pixel-art chef body sprite plus the face PNG composited on top of
// the head region. The face is the visual hero: drawn larger, framed with a
// tan portrait ring, and bilinear-filtered (via texFilter on its sprite load)
// so the photo doesn't go chunky-pixelated when scaled up.
//
// Animations (all live here as runtime tweens; the body sprite itself only
// supplies the walk frames + dance frames):
//   - idle breathing  : c.scale.y oscillates ±1.5 % over 1 s
//   - 4-frame walk    : driven by the body sprite's `walk` animation
//   - jump squash     : c.scale tween on takeoff, lock in air, squash on land
//   - power-up flash  : 7 face flips + 6-pixel sparkle burst
//   - death spin      : c.angle rotates as she falls off-screen
//   - victory dance   : swap to camila-dance sprite + portrait bob

import {
  CAMILA_SMALL_HEIGHT, CAMILA_TALL_HEIGHT,
  RUN_SPEED, JUMP_FORCE,
  INVULN_MS, POWERUP_FLASH_MS,
} from '../config.js'

// Body width matches both the sprite and the collision box. Native sprite is
// 16 wide so we render at scale 2 to land on a clean 32 px collision box.
const BODY_WIDTH = 32
// Face PNG overlay — sits inside the head region of the body sprite. We
// want the face to dominate (chibi look) without swallowing the chef hat
// above. With FACE_Y_* matching the centre of the body's transparent face
// region, this leaves a few pixels of hat visible at the top while the
// face fills most of what the eye reads as "her head".
const FACE_SIZE     = 28
const FACE_Y_SMALL  = -30
const FACE_Y_TALL   = -48
const FRAME_RADIUS  = FACE_SIZE / 2 + 1   // 15 px — cream ring just outside the photo
const FRAME_FILL    = [255, 245, 220]
const FRAME_OUTLINE = [180, 130, 60]
// Hand position in entity-local coords for the scoop-in-hand overlay (drawn
// only when c.hasScoop). x is mirrored by c.facing; y differs because tall
// Camila's hand sits higher up the body.
const SCOOP_HAND_X       = 12
const SCOOP_HAND_Y_SMALL = -14
const SCOOP_HAND_Y_TALL  = -22
const SCOOP_OVERLAY_SIZE = 12

// Squash-and-stretch tunables.
const SQUASH_TAKEOFF = { x: 1.15, y: 0.85, ms: 100 }
const SQUASH_AIR     = { x: 0.95, y: 1.05 }
const SQUASH_LAND    = { x: 1.20, y: 0.80, ms: 120 }

// Idle breathing tunable.
const BREATH_AMPLITUDE = 0.015     // 1.5 % over 1 s
const BREATH_HZ        = 1.0       // cycles per second

// Power-up sparkle burst tunable.
const SPARKLE_COUNT  = 6
const SPARKLE_SPEED  = 60
const SPARKLE_LIFE   = 0.5

// Death spin tunable.
const DEATH_SPIN_DEG_PER_SEC = 360

export function makeCamila(x, y) {
  const c = add([
    sprite('camila-small', { width: BODY_WIDTH, height: CAMILA_SMALL_HEIGHT }),
    pos(x, y),
    area(),
    body(),
    anchor('bot'),
    opacity(1),
    scale(1, 1),
    rotate(0),
    'player',
    {
      state: 'small',          // 'small' | 'tall' | 'dead'
      face: 'normal',          // 'normal' | 'tall' | 'power' | 'dead'
      facing: 1,               // 1 = right, -1 = left
      hasScoop: false,
      invuln: false,
      frozen: false,
      dying: false,
      dancing: false,
      _wasGrounded: true,
      _squashUntil: 0,         // ms timestamp of when the current squash ends
      _squashFrom: { x: 1, y: 1 },
      _squashTo:   { x: 1, y: 1 },
      _squashStart: 0,
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
    // Sparkle burst — 6 little white pixels arc out from her chest.
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const angle = (i / SPARKLE_COUNT) * Math.PI * 2
      const sp = add([
        sprite('sparkle', { width: 4, height: 4 }),
        pos(c.pos.x + Math.cos(angle) * 6, c.pos.y - 24 + Math.sin(angle) * 6),
        anchor('center'),
        opacity(1),
        z(60),
        lifespan(SPARKLE_LIFE, { fade: 0.3 }),
        { _vx: Math.cos(angle) * SPARKLE_SPEED, _vy: Math.sin(angle) * SPARKLE_SPEED },
      ])
      sp.onUpdate(() => { sp.pos.x += sp._vx * dt(); sp.pos.y += sp._vy * dt() })
    }
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
    c.use(sprite('camila-dance', { width: BODY_WIDTH, height: bodyHeight() }))
    c.play('dance')
  }

  // Helper to kick off a scale tween (used by jump squash + landing squash).
  function startSquash({ x, y, ms }) {
    c._squashFrom = { x: c.scale.x, y: c.scale.y }
    c._squashTo   = { x, y }
    c._squashStart = time() * 1000
    c._squashUntil = c._squashStart + ms
  }

  // Per-frame: walk anim sync, idle breathing, jump squash/stretch, facing.
  c.onUpdate(() => {
    const now = time() * 1000

    // --- Walk / jump / idle anim sync ---
    // In the air → frame 5 (jump pose, hat tilted). On the ground moving →
    // walk loop. On the ground still → idle frame 0.
    if (c.state !== 'dead' && !c.dancing) {
      const grounded = c.isGrounded()
      const moving = Math.abs(c.vel.x) > 5 && grounded
      if (!grounded && !c.dying) {
        if (c.curAnim()) c.stop()
        if (c.frame !== 5) c.frame = 5
      } else if (moving && c.curAnim() !== 'walk') {
        c.play('walk')
      } else if (grounded && !moving && c.curAnim() === 'walk') {
        c.stop(); c.frame = 0
      } else if (grounded && !moving && !c.curAnim() && c.frame !== 0) {
        c.frame = 0
      }
    }

    // --- Facing mirror ---
    c.flipX = c.facing < 0

    // --- Squash tween ---
    if (now < c._squashUntil) {
      const t = (now - c._squashStart) / (c._squashUntil - c._squashStart)
      c.scale.x = c._squashFrom.x + (c._squashTo.x - c._squashFrom.x) * t
      c.scale.y = c._squashFrom.y + (c._squashTo.y - c._squashFrom.y) * t
    } else if (!c.isGrounded() && !c.dying) {
      // In-air pose — slight stretch.
      c.scale.x = SQUASH_AIR.x
      c.scale.y = SQUASH_AIR.y
    } else if (!c.dancing && !c.dying && c.state !== 'dead') {
      // --- Idle breathing on the ground ---
      const breath = Math.sin(time() * BREATH_HZ * 2 * Math.PI) * BREATH_AMPLITUDE
      c.scale.x = 1
      c.scale.y = 1 + breath
    }

    // --- Jump take-off + landing squash transitions ---
    const groundedNow = c.isGrounded()
    if (c._wasGrounded && !groundedNow && c.vel.y < 0) {
      startSquash(SQUASH_TAKEOFF)
    } else if (!c._wasGrounded && groundedNow && !c.dying) {
      startSquash(SQUASH_LAND)
    }
    c._wasGrounded = groundedNow

    // --- Death spin ---
    if (c.dying) {
      c.angle = (c.angle ?? 0) + DEATH_SPIN_DEG_PER_SEC * dt()
    }
  })

  // Face PNG overlay — drawn on top of the body sprite each frame inside a
  // tan portrait ring (the ring also masks any leftover edge artefacts from
  // the white-removal pass on the source PNG).
  c.onDraw(() => {
    const yOffset = c.state === 'tall' ? FACE_Y_TALL : FACE_Y_SMALL
    const dancePop = c.dancing ? Math.sin(time() * 6) * 1.5 : 0
    drawCircle({
      pos: vec2(0, yOffset + dancePop),
      radius: FRAME_RADIUS,
      color: rgb(...FRAME_FILL),
      outline: { width: 2, color: rgb(...FRAME_OUTLINE) },
    })
    drawSprite({
      sprite: 'camila-' + c.face,
      pos: vec2(0, yOffset + dancePop),
      width: FACE_SIZE, height: FACE_SIZE,
      anchor: 'center',
      flipX: c.facing < 0,
    })
    // Ice-cream scoop in her front hand when she's holding one. Mirrored to
    // whichever side she's facing so it always sits at the leading sleeve.
    if (c.hasScoop && !c.dying && c.state !== 'dead') {
      const handY = c.state === 'tall' ? SCOOP_HAND_Y_TALL : SCOOP_HAND_Y_SMALL
      drawSprite({
        sprite: 'scoop',
        pos: vec2(c.facing * SCOOP_HAND_X, handY),
        width: SCOOP_OVERLAY_SIZE, height: SCOOP_OVERLAY_SIZE,
        anchor: 'center',
        flipX: c.facing < 0,
      })
    }
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

  // Allow the level scene to set Camila into the dying state. (level1.js
  // already sets c.frozen = true and unuses the area when a hit kills her.)
  c.markDying = () => { c.dying = true }

  return c
}
