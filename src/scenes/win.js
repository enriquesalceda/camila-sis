import { LIVES_AT_START } from '../config.js'

export function registerWinScene() {
  scene('win', () => {
    setGravity(0)
    add([ rect(width(), height()), color(20, 30, 60), pos(0, 0), fixed(), z(-100) ])

    add([
      text('YOU WIN!', { font: 'press', size: 48 }),
      pos(width() / 2 + 4, height() / 2 - 60 + 4),
      anchor('center'),
      color(180, 30, 30),
      fixed(),
    ])
    add([
      text('YOU WIN!', { font: 'press', size: 48 }),
      pos(width() / 2, height() / 2 - 60),
      anchor('center'),
      color(255, 220, 0),
      fixed(),
    ])

    add([
      sprite('camila-tall'),
      pos(width() / 2, height() / 2 + 60),
      anchor('center'),
      scale(0.4),
      fixed(),
    ])

    add([
      text('Play Again?  Space / Tap', { font: 'press', size: 14 }),
      pos(width() / 2, height() - 80),
      anchor('center'),
      color(255, 255, 255),
      fixed(),
    ])

    const restart = () => go('level1', { lives: LIVES_AT_START })
    onKeyPress('space', restart)
    onMousePress(restart)
  })
}
