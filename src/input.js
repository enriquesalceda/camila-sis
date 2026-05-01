// Tiny input bus. Both keyboard and on-screen touch buttons write into this,
// and the game scene reads from it. Keeping it in one place means the level
// scene doesn't care if the player is using a keyboard or an iPad.

export const input = {
  left: false,
  right: false,
  _jumpQueued: false,
  _scoopQueued: false,
}

export function pressLeft()    { input.left = true  }
export function releaseLeft()  { input.left = false }
export function pressRight()   { input.right = true }
export function releaseRight() { input.right = false }
export function queueJump()    { input._jumpQueued = true }
export function queueScoop()   { input._scoopQueued = true }

// Pulse helpers — return true exactly once per press, then reset.
export function consumeJump()  { const q = input._jumpQueued;  input._jumpQueued  = false; return q }
export function consumeScoop() { const q = input._scoopQueued; input._scoopQueued = false; return q }

// Reset everything (useful when entering / leaving a scene).
export function resetInput() {
  input.left = false
  input.right = false
  input._jumpQueued = false
  input._scoopQueued = false
}
