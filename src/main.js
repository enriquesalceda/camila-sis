// Entry point. Set up Kaplay, register all scenes, mount touch controls,
// then jump to the menu.

import kaplay from 'kaplay'

import { GRAVITY } from './config.js'
import { loadAssets } from './loader.js'
import { mountTouchControls } from './touch.js'
import { registerMenuScene }     from './scenes/menu.js'
import { registerLevel1Scene }   from './scenes/level1.js'
import { registerWinScene }      from './scenes/win.js'
import { registerGameOverScene } from './scenes/gameover.js'

// Boot Kaplay. With `global: true` its helpers (add, scene, go, drawRect,
// vec2, Rect, ...) become globals on window — that's why every other file
// can use them without an import.
kaplay({
  canvas: document.getElementById('game'),
  width: 1024,
  height: 576,
  letterbox: true,
  background: [135, 206, 235],
  global: true,
  pixelDensity: 1,
  touchToMouse: false,
  debug: false,
})

setGravity(GRAVITY)
loadAssets()
mountTouchControls()

registerMenuScene()
registerLevel1Scene()
registerWinScene()
registerGameOverScene()

go('menu')
