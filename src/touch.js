// Touch controls. We render real HTML <button>s on top of the canvas instead
// of drawing them inside Kaplay — that way the same button can stay visible
// across scene changes, and Safari handles all the gesture details for us.

import {
  pressLeft, releaseLeft,
  pressRight, releaseRight,
  queueJump, queueScoop,
} from './input.js'

const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0

export function mountTouchControls() {
  if (!isTouchDevice) return

  const root = document.getElementById('touch')
  root.dataset.touch = 'true'

  const wire = (selector, onDown, onUp) => {
    const el = root.querySelector(selector)
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); onDown() })
    if (onUp) {
      const release = (e) => { e.preventDefault(); onUp() }
      el.addEventListener('pointerup',     release)
      el.addEventListener('pointercancel', release)
      el.addEventListener('pointerleave',  release)
    }
  }

  wire('.t-left',  pressLeft,  releaseLeft)
  wire('.t-right', pressRight, releaseRight)
  wire('.t-jump',  queueJump,  null)
  wire('.t-scoop', queueScoop, null)
}

export function setScoopVisible(visible) {
  const btn = document.querySelector('#touch .t-scoop')
  if (!btn) return
  if (visible) btn.removeAttribute('hidden')
  else         btn.setAttribute('hidden', '')
}
