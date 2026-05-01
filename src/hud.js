// HUD widget. Three zones, all `fixed()` so they stay locked to the camera.
//   top-left   — nugget icon × <count>
//   top-right  — Camila-head icon × <lives>
//   top-center — level name, fades after 2 seconds
//
// Callers pass `getNuggets` and `getLives` getters and the HUD updates each
// frame from those (cheaper than wiring events for two integers).

const FONT = 'press'

export function mountHUD({ levelName, getNuggets, getLives }) {
  // -- Top-left: nugget counter --
  add([
    sprite('nugget', { width: 24, height: 18 }),
    pos(16, 16),
    fixed(), z(100),
  ])
  const nuggetText = add([
    text(`x ${getNuggets()}`, { font: FONT, size: 14 }),
    pos(48, 18),
    fixed(), z(100),
    color(255, 255, 255),
  ])

  // -- Top-right: lives counter, Camila-head icon --
  add([
    sprite('camila-normal', { width: 22, height: 22 }),
    pos(width() - 96, 14),
    fixed(), z(100),
  ])
  const livesText = add([
    text(`x ${getLives()}`, { font: FONT, size: 14 }),
    pos(width() - 64, 18),
    fixed(), z(100),
    color(255, 255, 255),
  ])

  // -- Top-center: level name banner that fades --
  const banner = add([
    text(levelName, { font: FONT, size: 16 }),
    pos(width() / 2, 24),
    anchor('top'),
    opacity(1),
    fixed(), z(100),
    color(255, 230, 80),
  ])
  wait(2.0, () => {
    let a = 1
    const fade = onUpdate(() => {
      a -= dt() * 2  // fades over ~0.5 s
      banner.opacity = Math.max(0, a)
      if (a <= 0) { fade.cancel(); destroy(banner) }
    })
  })

  // Refresh tickers — cheap, and they handle every count change for free.
  onUpdate(() => {
    nuggetText.text = `x ${getNuggets()}`
    livesText.text  = `x ${getLives()}`
  })
}
