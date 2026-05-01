// Tiny pixel-art helper. You give it a 2D string grid and a palette, it gives
// back a <canvas> Kaplay can load as a sprite. Kid-readable: every "pixel" is
// a single character in the rows array, mapped to a colour through the
// palette dict. Use '.' for transparent.
//
// Example:
//   makePixelCanvas([
//     '..##..',
//     '.####.',
//     '######',
//   ], { '.': null, '#': '#ff0000' })

export function makePixelCanvas(rows, palette) {
  if (!rows || rows.length === 0) throw new Error('makePixelCanvas: empty rows')
  const h = rows.length
  const w = rows[0].length

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  for (let y = 0; y < h; y++) {
    const row = rows[y]
    for (let x = 0; x < w; x++) {
      const ch = row[x]
      const colour = palette[ch]
      if (!colour) continue   // null, undefined, '' all mean transparent
      ctx.fillStyle = colour
      ctx.fillRect(x, y, 1, 1)
    }
  }
  return canvas
}

// Stitch N same-sized frame grids into one horizontal strip canvas. Pair with
// loadSprite("name", strip, { sliceX: N, anims: { ... } }) for animations.
export function makePixelStrip(frames, palette) {
  if (!frames || frames.length === 0) throw new Error('makePixelStrip: empty frames')
  const frameH = frames[0].length
  const frameW = frames[0][0].length

  const canvas = document.createElement('canvas')
  canvas.width = frameW * frames.length
  canvas.height = frameH
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  for (let f = 0; f < frames.length; f++) {
    const rows = frames[f]
    for (let y = 0; y < frameH; y++) {
      const row = rows[y]
      for (let x = 0; x < frameW; x++) {
        const ch = row[x]
        const colour = palette[ch]
        if (!colour) continue
        ctx.fillStyle = colour
        ctx.fillRect(f * frameW + x, y, 1, 1)
      }
    }
  }
  return canvas
}
