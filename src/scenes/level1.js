// Gameplay scene. This file owns:
//   - building the level from the ASCII map
//   - reading the player's input each frame and driving Camila
//   - all collision rules between Camila and the world
//   - the camera follow
//   - the lives counter and the win/lose transitions
//
// Most of the *numbers* live in src/config.js. Most of the *visuals* live
// in src/entities/*.js. This scene is the glue that wires them together.

import {
  GRAVITY, TILE, JUMP_FORCE, SCOOP_COOLDOWN_MS, LIVES_AT_START,
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
import { play } from '../sounds.js'
import { setScoopVisible } from '../touch.js'

export function registerLevel1Scene() {
  scene('level1', (arg) => {
    const startingLives = (arg && arg.lives) ?? LIVES_AT_START
    let livesLeft = startingLives
    let lastScoopAt = -Infinity
    let won = false
    let dying = false

    setGravity(GRAVITY)
    resetInput()
    setScoopVisible(false)

    // ---- World makers (called by parseLevel for each ASCII glyph) ----

    const groundColor   = rgb(160, 100, 60)
    const platformColor = rgb(110, 180, 90)

    const makeBlock = (x, y, col) => add([
      rect(TILE, TILE),
      color(col),
      outline(2, rgb(40, 30, 20)),
      pos(x, y),
      area(),
      body({ isStatic: true }),
      'solid',
    ])

    const makers = {
      ground:   (x, y) => makeBlock(x, y, groundColor),
      platform: (x, y) => makeBlock(x, y, platformColor),
      nugget: (x, y) => add([
        rect(18, 14),
        color(220, 170, 90),
        outline(2, rgb(120, 60, 20)),
        pos(x, y),
        anchor('center'),
        area(),
        'nugget',
      ]),
      iceCream: (x, y) => {
        // Cone (triangle approximated with a small rect) under a scoop circle.
        const e = add([ pos(x, y), anchor('center'), area({ shape: new Rect(vec2(-8, -12), 16, 24) }), 'icecream' ])
        e.onDraw(() => {
          drawTriangle({
            p1: vec2(-8, 0), p2: vec2(8, 0), p3: vec2(0, 12),
            color: rgb(200, 150, 90),
            outline: { width: 2, color: rgb(110, 70, 30) },
          })
          drawCircle({
            pos: vec2(0, -2),
            radius: 8,
            color: rgb(255, 220, 235),
            outline: { width: 2, color: rgb(180, 80, 120) },
          })
        })
        return e
      },
      notebook: makeNotebook,
      insect:   makeInsect,
      flag: (x, y) => {
        // Flag pole with a triangle at the top.
        const pole = add([
          rect(4, TILE * 4),
          color(230, 230, 230),
          outline(2, rgb(60, 60, 60)),
          pos(x, y),
          anchor('bot'),
          area(),
          'flag',
        ])
        const top = pole.pos.y - TILE * 4
        add([
          pos(x + 2, top + 6),
          z(2),
          {
            draw() {
              drawTriangle({
                p1: vec2(0, 0),
                p2: vec2(28, 8),
                p3: vec2(0, 16),
                color: rgb(220, 30, 30),
                outline: { width: 2, color: rgb(80, 10, 10) },
              })
            },
          },
        ])
        return pole
      },
    }

    // Pin the bottom row of the ASCII map to the bottom of the camera.
    const rows = LEVEL_1.split('\n').length
    const offsetY = height() - rows * TILE
    const { spawn, levelWidth, levelHeight } = parseLevel(LEVEL_1, makers, { offsetY })

    // Hidden killzone below the visible camera so falling off counts as death.
    const killzoneY = height() + 200

    // ---- Camila ----
    const camila = makeCamila(spawn.x, spawn.y - 1)

    // ---- HUD ----
    const livesLabel = add([
      text(`${livesLeft}UP`, { size: 28 }),
      pos(width() - 90, 16),
      fixed(),
      z(100),
      color(255, 255, 255),
      outline(3, rgb(20, 20, 20)),
    ])
    function refreshLives() { livesLabel.text = `${livesLeft}UP` }

    // ---- Keyboard input ----
    onKeyPress('left',  pressLeft)
    onKeyRelease('left',  releaseLeft)
    onKeyPress('right', pressRight)
    onKeyRelease('right', releaseRight)
    onKeyPress('a',     pressLeft)
    onKeyRelease('a',     releaseLeft)
    onKeyPress('d',     pressRight)
    onKeyRelease('d',     releaseRight)
    onKeyPress('space', queueJump)
    onKeyPress('up',    queueJump)
    onKeyPress('w',     queueJump)
    onKeyPress('x',     queueScoop)

    // ---- Per-frame: input → Camila ----
    camila.onUpdate(() => {
      if (dying || won || camila.frozen) {
        if (camila.frozen && !won) camila.vel.x = 0
        return
      }
      const dx = (input.left ? -1 : 0) + (input.right ? 1 : 0)
      camila.driveX(dx)
      if (consumeJump()) {
        if (camila.isGrounded()) {
          camila.jump(JUMP_FORCE)
          play('jump')
        }
      }
      if (consumeScoop() && camila.hasScoop) {
        const now = time() * 1000
        if (now - lastScoopAt > SCOOP_COOLDOWN_MS) {
          lastScoopAt = now
          const off = camila.facing * 18
          makeScoop(camila.pos.x + off, camila.pos.y - 28, camila.facing)
          play('scoop')
        }
      }
    })

    // ---- Camera follow with end-of-level clamp ----
    onUpdate(() => {
      const halfW = width() / 2
      const halfH = height() / 2
      const camX = Math.min(Math.max(camila.pos.x, halfW), Math.max(halfW, levelWidth - halfW))
      camPos(camX, halfH)
    })

    // ---- Death by falling off the world ----
    onUpdate(() => {
      if (!dying && camila.pos.y > killzoneY) startDeath()
    })

    // ---- Pickups ----
    onCollide('player', 'nugget', (p, n) => {
      destroy(n)
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
      setScoopVisible(true)
    })

    onCollide('player', 'flag', () => {
      if (won) return
      won = true
      camila.startDance()
      play('win')
      wait(2.2, () => go('win'))
    })

    // ---- Combat ----
    onCollide('player', 'enemy', (p, e) => {
      if (won || dying || p.invuln) return

      // A "kicked shell" hurts on contact regardless of direction.
      const isShell = e.is && e.is('kicked-shell')
      const isStunned = e.kind === 'insect' && e.state === 'stunned'

      // Touching a stunned insect kicks it.
      if (isStunned) {
        const dirAway = p.pos.x < e.pos.x ? 1 : -1
        e.setKicked(dirAway)
        play('stomp')
        // Small bounce so we don't immediately re-collide.
        p.vel.y = -JUMP_FORCE * 0.3
        return
      }

      // Stomp check: falling fast enough = stomp.
      const stomped = !isShell && p.vel.y > 50
      if (stomped) {
        if (e.kind === 'notebook') {
          destroy(e)
          play('stomp')
        } else if (e.kind === 'insect') {
          e.setStunned()
          play('stomp')
        }
        p.vel.y = -JUMP_FORCE * 0.55
        return
      }

      // Side-hit — Camila takes damage.
      damagePlayer(p)
    })

    // Kicked-shell sweeps through other enemies.
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
      camila.vel.x = 0
      camila.vel.y = -480
      // Drop collisions so she falls through the floor and off-screen.
      camila.unuse('area')
      play('death')

      // Watch for off-screen, then either respawn or game-over.
      const watcher = onUpdate(() => {
        if (camila.pos.y > height() + 220) {
          watcher.cancel()
          livesLeft -= 1
          refreshLives()
          if (livesLeft > 0) go('level1', { lives: livesLeft })
          else go('gameover')
        }
      })
    }
  })
}
