// Gameplay scene. This file owns:
//   - building the level from the ASCII map
//   - reading the player's input and driving Camila
//   - all collision rules between Camila and the world
//   - the camera follow (dead-zone)
//   - HUD + lives/nugget counters and the win/lose transitions

import {
  GRAVITY, TILE, JUMP_FORCE, SCOOP_COOLDOWN_MS, LIVES_AT_START, DEAD_ZONE,
} from '../config.js'
import {
  input, consumeJump, consumeScoop, resetInput,
  pressLeft, releaseLeft, pressRight, releaseRight, queueJump, queueScoop,
} from '../input.js'
import { LEVEL_1, parseLevel } from '../levels/level1.js'
import { makeCamila } from '../entities/camila.js'
import { makeNotebook } from '../entities/notebook.js'
import { makeInsect } from '../entities/insect.js'
import { makeScoop } from '../entities/scoop.js'
import { makeCastle } from '../entities/castle.js'
import {
  BRAND_NAME, BRAND_LETTER_STYLE, MASCOT,
} from './celebration.js'
import { play } from '../sounds.js'
import { setScoopVisible } from '../touch.js'
import { TILE_FRAMES } from '../loader.js'
import { spawnParallax } from '../parallax.js'
import { makeDeadZoneCamera } from '../camera.js'
import { mountHUD } from '../hud.js'

// Pseudo-random tile picker so the floor doesn't repeat the same tile across.
function pick(opts, x, y) {
  const h = (x * 73856093) ^ (y * 19349663)
  return opts[((h % opts.length) + opts.length) % opts.length]
}

export function registerLevel1Scene() {
  scene('level1', (arg) => {
    const startingLives = (arg && arg.lives) ?? LIVES_AT_START
    let livesLeft = startingLives
    let nuggetCount = 0
    let lastScoopAt = -Infinity
    let won = false
    let dying = false
    const sceneStartTime = time()
    let nuggetTotal = 0   // counted as the level is parsed below
    // Scene-local mirror of Camila's scoop power. Kept here so it survives any
    // sprite-component swap on Camila (e.g. when she grows tall) — we read
    // from this flag in the input handler, not from camila.hasScoop directly.
    let canScoop = false

    setGravity(GRAVITY)
    resetInput()
    setScoopVisible(false)

    // ---- World makers ----

    // Track which (col, row) cells already have ground so we can pick
    // grass-top tiles only where there's empty sky directly above.
    const groundCells = new Set()
    const cellKey = (x, y) => `${x}|${y}`

    const makers = {
      ground: (x, y) => {
        groundCells.add(cellKey(x, y))
        const aboveHasGround = groundCells.has(cellKey(x, y - TILE))
        const frame = aboveHasGround
          ? pick([TILE_FRAMES.DIRT_BODY_A, TILE_FRAMES.DIRT_BODY_B, TILE_FRAMES.DIRT_BODY_C], x, y)
          : TILE_FRAMES.GRASS_TOP_MID
        return add([
          sprite('tiles', { frame, width: TILE, height: TILE }),
          pos(x, y),
          area(),
          body({ isStatic: true }),
          'solid',
        ])
      },
      platform: (x, y) => add([
        sprite('tiles', { frame: TILE_FRAMES.BRICK_BLOCK, width: TILE, height: TILE }),
        pos(x, y),
        area(),
        body({ isStatic: true }),
        'solid',
      ]),
      nugget: (x, y) => {
        const e = add([
          sprite('nugget', { width: 24, height: 18 }),
          pos(x, y),
          anchor('center'),
          area(),
          'nugget',
          { _baseY: y, _t: Math.random() * Math.PI * 2 },
        ])
        e.onUpdate(() => { e._t += dt() * 4; e.pos.y = e._baseY + Math.sin(e._t) * 2 })
        return e
      },
      iceCream: (x, y) => {
        const e = add([
          sprite('ice-cream', { width: 20, height: 28 }),
          pos(x, y),
          anchor('center'),
          area(),
          'icecream',
          { _baseY: y, _t: 0 },
        ])
        e.onUpdate(() => { e._t += dt() * 4; e.pos.y = e._baseY + Math.sin(e._t) * 2 })
        return e
      },
      notebook: makeNotebook,
      insect:   makeInsect,
      castle: (x, y) => makeCastle(x, y, {
        letterStyle: BRAND_LETTER_STYLE,
        mascot:      MASCOT,
        brandName:   BRAND_NAME,
      }),
    }

    // Pin the bottom row of the ASCII map to the bottom of the camera.
    const rows = LEVEL_1.split('\n').length
    const offsetY = height() - rows * TILE
    const { spawn, levelWidth } = parseLevel(LEVEL_1, makers, { offsetY })
    nuggetTotal = (LEVEL_1.match(/\?/g) || []).length

    // Hidden killzone below the visible camera.
    const killzoneY = height() + 200

    // ---- Parallax background ----
    spawnParallax({ levelWidth })

    // ---- Camila ----
    const camila = makeCamila(spawn.x, spawn.y - 1)

    // Visible "scoop ready" indicator that floats above Camila's hat whenever
    // she has the ice-cream power. Empty otherwise.
    const scoopHint = add([
      sprite('ice-cream', { width: 14, height: 18 }),
      pos(camila.pos.x, camila.pos.y - 80),
      anchor('center'),
      opacity(0),
      z(50),
    ])
    onUpdate(() => {
      scoopHint.pos.x = camila.pos.x
      scoopHint.pos.y = camila.pos.y - (camila.state === 'tall' ? 96 : 80)
      scoopHint.opacity = canScoop ? 1 : 0
    })

    // ---- HUD ----
    mountHUD({
      levelName: 'WORLD 1-1: KITCHEN ROAD',
      getNuggets: () => nuggetCount,
      getLives:   () => livesLeft,
    })

    // ---- Keyboard input ----
    onKeyPress('left',     pressLeft)
    onKeyRelease('left',   releaseLeft)
    onKeyPress('right',    pressRight)
    onKeyRelease('right',  releaseRight)
    onKeyPress('a',        pressLeft)
    onKeyRelease('a',      releaseLeft)
    onKeyPress('d',        pressRight)
    onKeyRelease('d',      releaseRight)
    onKeyPress('space',    queueJump)
    onKeyPress('up',       queueJump)
    onKeyPress('w',        queueJump)
    // Throw key — Z (or C as a backup). We key on event.code so caps lock and
    // shift never matter: 'KeyZ' is the physical Z key, period. Capture-phase
    // listener so we see the press before Kaplay's canvas handler.
    const domThrowHandler = (e) => {
      if (e.code === 'KeyZ' || e.code === 'KeyC') queueScoop()
    }
    window.addEventListener('keydown', domThrowHandler, { capture: true })
    onSceneLeave(() => window.removeEventListener('keydown', domThrowHandler, { capture: true }))

    // ---- Per-frame: input → Camila ----
    camila.onUpdate(() => {
      if (dying || won || camila.frozen) {
        if (camila.frozen && !won) camila.vel.x = 0
        return
      }
      const dx = (input.left ? -1 : 0) + (input.right ? 1 : 0)
      camila.driveX(dx)
      if (consumeJump() && camila.isGrounded()) {
        camila.jump(JUMP_FORCE)
        play('jump')
      }
      const wantScoop = consumeScoop()
      if (wantScoop && canScoop) {
        const now = time() * 1000
        if (now - lastScoopAt > SCOOP_COOLDOWN_MS) {
          lastScoopAt = now
          const off = camila.facing * 18
          makeScoop(camila.pos.x + off, camila.pos.y - 28, camila.facing)
          play('scoop')
        }
      }
    })

    // ---- Camera dead-zone follow ----
    const cam = makeDeadZoneCamera({ target: camila, levelWidth, deadZone: DEAD_ZONE })
    onUpdate(() => cam.update())

    // ---- Death by falling off the world ----
    onUpdate(() => {
      if (!dying && camila.pos.y > killzoneY) startDeath()
    })

    // ---- Pickups ----
    onCollide('player', 'nugget', (p, n) => {
      destroy(n)
      nuggetCount += 1
      play('coin')
      if (p.state === 'small') {
        play('powerup')
        p.flashPowerUp()
      }
    })

    onCollide('player', 'icecream', (p, i) => {
      destroy(i)
      play('powerup')
      p.hasScoop = true
      canScoop = true
      setScoopVisible(true)
    })

    onCollide('player', 'castle-door', () => {
      if (won) return
      won = true
      camila.frozen = true
      camila.vel.x = 0
      // Auto-walk Camila INTO the door — small rightward nudge plus a fade
      // to white over 0.7 s, then we hand off to the celebration scene.
      const walkIn = onUpdate(() => { camila.pos.x += 24 * dt() })
      wait(0.5, () => walkIn.cancel())
      play('ding')

      // Full-screen white wash that grows from invisible to opaque.
      const wash = add([
        rect(width(), height()),
        pos(0, 0), color(255, 255, 255), opacity(0),
        fixed(), z(1000),
      ])
      wash.onUpdate(() => { wash.opacity = Math.min(1, wash.opacity + dt() / 0.7) })

      wait(1.0, () => go('celebration', {
        nuggets: nuggetCount,
        total: nuggetTotal,
        time: time() - sceneStartTime,
      }))
    })

    // ---- Combat ----
    onCollide('player', 'enemy', (p, e) => {
      if (won || dying || p.invuln) return

      const isShell = e.is && e.is('kicked-shell')
      const isStunned = e.kind === 'insect' && e.state === 'stunned'

      if (isStunned) {
        const dirAway = p.pos.x < e.pos.x ? 1 : -1
        e.setKicked(dirAway)
        play('stomp')
        p.vel.y = -JUMP_FORCE * 0.3
        return
      }

      const stomped = !isShell && p.vel.y > 50
      if (stomped) {
        if (e.kind === 'notebook') { destroy(e); play('stomp') }
        else if (e.kind === 'insect') { e.setStunned(); play('stomp') }
        p.vel.y = -JUMP_FORCE * 0.55
        return
      }

      damagePlayer(p)
    })

    onCollide('kicked-shell', 'enemy', (shell, target) => {
      if (target === shell) return
      if (target.is && target.is('kicked-shell')) return
      destroy(target)
      play('stomp')
    })

    function damagePlayer(p) {
      if (p.state === 'tall') {
        if (p.hasScoop) {
          p.hasScoop = false
          canScoop = false
          setScoopVisible(false)
        } else {
          p.setState('small')
        }
        play('death')
        p.startInvuln()
        return
      }
      startDeath()
    }

    function startDeath() {
      if (dying) return
      dying = true
      camila.frozen = true
      camila.setState('dead')
      camila.markDying()                       // triggers spin in entities/camila.js
      camila.vel.x = 0
      camila.vel.y = -480
      camila.unuse('area')
      play('death')

      const watcher = onUpdate(() => {
        if (camila.pos.y > height() + 220) {
          watcher.cancel()
          livesLeft -= 1
          if (livesLeft > 0) go('level1', { lives: livesLeft })
          else go('gameover')
        }
      })
    }
  })
}
