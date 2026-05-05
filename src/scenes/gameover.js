import { LIVES_AT_START } from '../config.js'

export function registerGameOverScene() {
  scene('gameover', () => {
    setGravity(0)
    add([ rect(width(), height()), color(0, 0, 0), pos(0, 0), fixed(), z(-100) ])
    add([
      text('GAME OVER', { font: 'press', size: 40 }),
      pos(width() / 2, height() / 2 - 40),
      anchor('center'),
      color(220, 30, 30),
      fixed(),
    ])
    add([
      text('Press Space to Restart', { font: 'press', size: 14 }),
      pos(width() / 2, height() / 2 + 50),
      anchor('center'),
      color(255, 255, 255),
      fixed(),
    ])

    const restart = () => go('level1', { lives: LIVES_AT_START })
    onKeyPress('space', restart)
    onMousePress(restart)
  })
}
