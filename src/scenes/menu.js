// Title screen. Big chunky "SUPER CAMILA SIS" logo in red+yellow with an
// offset shadow, plus a "press space / tap to start" prompt. Tapping
// anywhere unlocks the audio (iOS Safari rule) and starts the level.

import { LIVES_AT_START } from '../config.js'
import { unlockAudio, play } from '../sounds.js'

export function registerMenuScene() {
  scene('menu', () => {
    setGravity(0)

    add([ rect(width(), height()), color(120, 180, 230), pos(0, 0), fixed(), z(-100) ])

    // Logo: same red/yellow trick, now in pixel-font for crispness.
    add([
      text('SUPER CAMILA SIS', { font: 'press', size: 36, align: 'center' }),
      pos(width() / 2 + 4, height() / 2 - 80 + 4),
      anchor('center'),
      color(180, 30, 30),
      fixed(),
    ])
    add([
      text('SUPER CAMILA SIS', { font: 'press', size: 36, align: 'center' }),
      pos(width() / 2, height() / 2 - 80),
      anchor('center'),
      color(255, 220, 0),
      fixed(),
    ])

    add([
      sprite('camila-normal'),
      pos(width() / 2, height() / 2 + 30),
      anchor('center'),
      scale(0.5),
      fixed(),
    ])

    add([
      text('TAP OR PRESS SPACE TO START', { font: 'press', size: 14 }),
      pos(width() / 2, height() - 80),
      anchor('center'),
      color(255, 255, 255),
      fixed(),
    ])

    add([
      text('Arrows + Space. Z throws ice cream.', { font: 'press', size: 10 }),
      pos(width() / 2, height() - 40),
      anchor('center'),
      color(220, 220, 220),
      fixed(),
    ])

    const start = () => {
      unlockAudio()
      play('coin')
      go('level1', { lives: LIVES_AT_START })
    }

    onKeyPress('space', start)
    onMousePress(start)
  })
}
