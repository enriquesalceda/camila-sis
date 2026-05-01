// Mario-style dead-zone camera. The camera sits still while Camila roams
// inside a small band around the screen-center; only when she crosses the
// edge does the camera scroll to follow her. Plus the existing left/right
// clamp so we never show beyond the level edges.
//
// Tunable:
//   deadZone — half-width of the band, in pixels. Larger = camera moves less.
//   lerp     — smoothing between the desired and actual camera X. 1 = snap,
//              smaller = floatier. 0.2 feels good on iPad.

export function makeDeadZoneCamera({ target, levelWidth, deadZone = 80, lerp = 0.2 }) {
  let camX = target.pos.x
  return {
    update() {
      const off = target.pos.x - camX
      if (off > deadZone)        camX = target.pos.x - deadZone
      else if (off < -deadZone)  camX = target.pos.x + deadZone

      const halfW = width() / 2
      const halfH = height() / 2
      const clamped = Math.min(
        Math.max(camX, halfW),
        Math.max(halfW, levelWidth - halfW),
      )

      const cur = camPos()
      const newX = cur.x + (clamped - cur.x) * lerp
      camPos(newX, halfH)
    },
  }
}
