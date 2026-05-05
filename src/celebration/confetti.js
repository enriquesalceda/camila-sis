// Pixel confetti — small coloured rectangles drifting down across the
// screen with a sin-x sway. Cheap and cheerful.

const COLORS = [
  [255,  80,  80],
  [255, 200,  40],
  [110, 220, 255],
  [255, 130, 220],
  [120, 255, 130],
  [255, 255, 255],
]

export function spawnConfetti(count, screen) {
  for (let i = 0; i < count; i++) {
    const col = COLORS[i % COLORS.length]
    const startX = Math.random() * screen.width
    const startY = -Math.random() * screen.height
    const piece = add([
      rect(4, 6),
      pos(startX, startY),
      color(col[0], col[1], col[2]),
      anchor('center'),
      rotate(Math.random() * 360),
      z(30),
      {
        _vy: 30 + Math.random() * 40,
        _phase: Math.random() * Math.PI * 2,
        _swayAmp: 10 + Math.random() * 20,
        _swayHz: 0.7 + Math.random() * 0.6,
        _spin: -90 + Math.random() * 180,
        _baseX: startX,
      },
    ])
    piece.onUpdate(() => {
      piece.pos.y += piece._vy * dt()
      piece.pos.x = piece._baseX + Math.sin(time() * piece._swayHz + piece._phase) * piece._swayAmp
      piece.angle += piece._spin * dt()
      // Wrap to top when it falls off the bottom.
      if (piece.pos.y > screen.height + 20) {
        piece.pos.y = -20
        piece._baseX = Math.random() * screen.width
      }
    })
  }
}
