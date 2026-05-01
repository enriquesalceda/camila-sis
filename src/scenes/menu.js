// Title screen. Big chunky "SUPER CAMILA SIS" logo in red+yellow with an
// offset shadow, plus a "press space / tap to start" prompt. Tapping
// anywhere unlocks the audio (iOS Safari rule) and starts the level.

import { LIVES_AT_START } from '../config.js'
import { unlockAudio, play } from '../sounds.js'

export function registerMenuScene() {
  scene('menu', () => {
    setGravity(0)

    // Sky gradient — back rectangle covers the whole canvas in pinker blue.
    add([ rect(width(), height()), color(120, 180, 230), pos(0, 0), fixed(), z(-100) ])

    // Logo: draw the same text twice, the back copy in red and offset by a
    // few pixels to make a chunky drop-shadow.
    add([
      text('SUPER CAMILA SIS', { size: 72, align: 'center' }),
      pos(width() / 2 + 6, height() / 2 - 80 + 6),
      anchor('center'),
      color(180, 30, 30),
      fixed(),
    ])
    add([
      text('SUPER CAMILA SIS', { size: 72, align: 'center' }),
      pos(width() / 2, height() / 2 - 80),
      anchor('center'),
      color(255, 220, 0),
      fixed(),
    ])

    // A friendly Camila portrait under the logo so kids see her right away.
    add([
      sprite('camila-normal'),
      pos(width() / 2, height() / 2 + 30),
      anchor('center'),
      scale(0.5),
      fixed(),
    ])

    add([
      text('TAP OR PRESS SPACE TO START', { size: 24 }),
      pos(width() / 2, height() - 80),
      anchor('center'),
      color(255, 255, 255),
      outline(2, rgb(40, 40, 40)),
      fixed(),
    ])

    add([
      text('Arrows + Space to play. Z to throw ice cream.', { size: 16 }),
      pos(width() / 2, height() - 40),
      anchor('center'),
      color(220, 220, 220),
      fixed(),
    ])

    const start = () => {
      unlockAudio()
      play('coin') // tiny click confirms audio is alive
      go('level1', { lives: LIVES_AT_START })
    }

    onKeyPress('space', start)
    onMousePress(start)
  })
}
