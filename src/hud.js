// Heads-up display. Three big counters pinned to the top of the screen plus
// the level-name banner that fades in then out at the start of every life.
//
//   top-left   — Camila face × <lives>
//   top-right  — nugget    × <count>     (gold)
//                ice-cream × <count>     (pink)
//   top-center — level name, fades after 2 seconds
//
// Every glyph and icon is drawn with a navy outline (8 stamp copies) plus a
// soft drop shadow so the HUD reads against sky, dirt, or sunset. Each
// outlined element lives under a single parent game object so we can pop /
// shake / rotate the whole group with one transform.
//
// `mountHUD()` returns an API the gameplay scene calls when the player picks
// something up, loses a life, or earns a 1UP. Animation lives entirely here
// — gameplay code never touches HUD internals.

// ===== HUD TUNABLES (Camila — change these to play with the look) =====

// Layout
const HUD_PAD          = 24    // pixels from the screen edge
const HUD_ICON         = 64    // icon size (was 22-24)
const HUD_TEXT_SIZE    = 56    // count digits height
const HUD_MULT_SIZE    = 36    // size of the × symbol
const HUD_GAP          = 8     // gap between icon, ×, number
const HUD_GROUP_GAP    = 12    // gap between nugget row and ice-cream row

// Readability — belt + suspenders against the pale-blue sky.
const HUD_OUTLINE_PX        = 4                 // dark outline thickness
const HUD_OUTLINE_RGB       = [26, 26, 58]      // navy "#1a1a3a"
const HUD_DROP_SHADOW_PX    = 6                 // shadow drop distance
const HUD_DROP_SHADOW_ALPHA = 0.5

// Color coding so each counter reads at a glance.
const HUD_LIVES_RGB    = [255, 255, 255]   // white
const HUD_NUGGET_RGB   = [245, 197, 24]    // gold "#F5C518"
const HUD_ICECREAM_RGB = [255, 107, 157]   // pink "#FF6B9D"

// Pickup → HUD ghost-fly.
const HUD_GHOST_DURATION = 0.4

// Counter pop on +1.
const HUD_POP_SCALE     = 1.4
const HUD_POP_SCALE_BIG = 1.6   // 1UP gets a bigger pop
const HUD_POP_DURATION  = 0.25

// Floating "+1" / "-1".
const HUD_FLOAT_DISTANCE = 32
const HUD_FLOAT_DURATION = 0.5

// Life-lost shake.
const HUD_SHAKE_INTENSITY = 8

// ===== End tunables =====

const FONT = 'press'
const Z_VIGNETTE = 99
const Z_HUD      = 100
const Z_GHOST    = 101
const Z_FLOAT    = 102

// World → screen helper. Camera centers on camPos() in world space, so a
// world point lands at world - camPos + screen-center.
function worldToScreen(p) {
  const c = camPos()
  return vec2(p.x - c.x + width() / 2, p.y - c.y + height() / 2)
}

// 8 outline stamps around the center (corners + cardinals at the same
// offset). Cheap, no shaders.
const OUTLINE_OFFSETS = [
  [-1, -1], [ 0, -1], [ 1, -1],
  [-1,  0],           [ 1,  0],
  [-1,  1], [ 0,  1], [ 1,  1],
]

function lerp(a, b, t) { return a + (b - a) * t }
function lerpRGB(a, b, t) {
  return [Math.round(lerp(a[0], b[0], t)),
          Math.round(lerp(a[1], b[1], t)),
          Math.round(lerp(a[2], b[2], t))]
}

// Ease-in-out quad — gentle accel and decel. Used for ghost flight.
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

// Run a per-frame ramp for `duration` seconds, calling onTick(t) where t
// goes 0 → 1. Calls onDone() at the end. Matches the codebase's existing
// tween style (entities/camila.js startSquash).
function ramp(duration, onTick, onDone) {
  const t0 = time()
  const upd = onUpdate(() => {
    const t = (time() - t0) / duration
    if (t >= 1) {
      onTick(1)
      upd.cancel()
      if (onDone) onDone()
      return
    }
    onTick(t)
  })
  return upd
}

// Build an outlined text group. The parent owns position / scale / rotate,
// and a shadow stamp + 8 outline stamps + a fill child sit underneath. The
// `fill` child is the one whose `text` and `color` we change as the count
// updates; outline stamps mirror the text via setText().
function makeOutlinedText({ str, size, rgb: fillRGB, anchorAt, posAt, zAt }) {
  const parent = add([
    pos(posAt.x, posAt.y),
    rotate(0),
    scale(1),
    fixed(),
    z(zAt ?? Z_HUD),
    { _parts: [], _baseRGB: fillRGB, _strSize: size },
  ])

  // Shadow (soft, slightly transparent, sits below the outline).
  const shadow = parent.add([
    text(str, { font: FONT, size }),
    pos(0, HUD_DROP_SHADOW_PX),
    anchor(anchorAt),
    color(0, 0, 0),
    opacity(HUD_DROP_SHADOW_ALPHA),
    z(-2),
  ])
  parent._parts.push(shadow)

  // Navy outline stamps (8 copies, each at ±HUD_OUTLINE_PX).
  for (const [dx, dy] of OUTLINE_OFFSETS) {
    const stamp = parent.add([
      text(str, { font: FONT, size }),
      pos(dx * HUD_OUTLINE_PX, dy * HUD_OUTLINE_PX),
      anchor(anchorAt),
      color(...HUD_OUTLINE_RGB),
      z(-1),
    ])
    parent._parts.push(stamp)
  }

  // Center fill — this is the "main" object whose color/text we tween.
  const fill = parent.add([
    text(str, { font: FONT, size }),
    pos(0, 0),
    anchor(anchorAt),
    color(...fillRGB),
    z(0),
  ])
  parent._parts.push(fill)
  parent.fill = fill
  return parent
}

function makeOutlinedSprite({ spriteKey, w, h, anchorAt, posAt, zAt }) {
  const parent = add([
    pos(posAt.x, posAt.y),
    rotate(0),
    scale(1),
    fixed(),
    z(zAt ?? Z_HUD),
    { _parts: [], _spriteKey: spriteKey, _w: w, _h: h },
  ])
  const shadow = parent.add([
    sprite(spriteKey, { width: w, height: h }),
    pos(0, HUD_DROP_SHADOW_PX),
    anchor(anchorAt),
    color(0, 0, 0),
    opacity(HUD_DROP_SHADOW_ALPHA),
    z(-2),
  ])
  parent._parts.push(shadow)
  for (const [dx, dy] of OUTLINE_OFFSETS) {
    const stamp = parent.add([
      sprite(spriteKey, { width: w, height: h }),
      pos(dx * HUD_OUTLINE_PX, dy * HUD_OUTLINE_PX),
      anchor(anchorAt),
      color(...HUD_OUTLINE_RGB),
      z(-1),
    ])
    parent._parts.push(stamp)
  }
  const fill = parent.add([
    sprite(spriteKey, { width: w, height: h }),
    pos(0, 0),
    anchor(anchorAt),
    z(0),
  ])
  parent._parts.push(fill)
  parent.fill = fill
  return parent
}

function setOutlinedText(group, str) {
  for (const p of group._parts) p.text = str
}

export function mountHUD({ levelName, getNuggets, getIceCreams, getLives }) {
  // -- Top-left: Lives (Camila face × N) ---------------------------------
  const livesIconPos = vec2(HUD_PAD + HUD_ICON / 2, HUD_PAD + HUD_ICON / 2)
  const livesIcon = makeOutlinedSprite({
    spriteKey: 'camila-normal',
    w: HUD_ICON, h: HUD_ICON,
    anchorAt: 'center',
    posAt: livesIconPos,
  })
  const livesMultPos = vec2(
    livesIconPos.x + HUD_ICON / 2 + HUD_GAP + HUD_MULT_SIZE / 2,
    livesIconPos.y,
  )
  const livesMult = makeOutlinedText({
    str: '×', size: HUD_MULT_SIZE,
    rgb: HUD_LIVES_RGB,
    anchorAt: 'center',
    posAt: livesMultPos,
  })
  const livesNumPos = vec2(
    livesMultPos.x + HUD_MULT_SIZE / 2 + HUD_GAP + HUD_TEXT_SIZE / 2,
    livesIconPos.y,
  )
  const livesNum = makeOutlinedText({
    str: String(getLives()), size: HUD_TEXT_SIZE,
    rgb: HUD_LIVES_RGB,
    anchorAt: 'center',
    posAt: livesNumPos,
  })

  // -- Top-right: Nuggets (row 1) and Ice Creams (row 2) -----------------
  const rightX = width() - HUD_PAD                          // anchor right edge
  const nuggetRowY = HUD_PAD + HUD_ICON / 2
  const iceRowY    = nuggetRowY + HUD_ICON + HUD_GROUP_GAP

  // Each row laid out from the right: number, ×, icon. Number anchored right
  // so growing digits don't shove the icon left.
  function buildCounterRow({ y, spriteKey, rgb }) {
    const numPos = vec2(rightX - HUD_TEXT_SIZE / 2, y)
    const num = makeOutlinedText({
      str: '0', size: HUD_TEXT_SIZE, rgb,
      anchorAt: 'center',
      posAt: numPos,
    })
    // Reserve a fixed slot of ~2 digits worth so × doesn't move when the
    // count goes from 9 to 10. Counter caps at well under 100 in this game.
    const numSlot = HUD_TEXT_SIZE * 1.1
    const multPos = vec2(rightX - numSlot - HUD_GAP, y)
    const mult = makeOutlinedText({
      str: '×', size: HUD_MULT_SIZE, rgb,
      anchorAt: 'center',
      posAt: multPos,
    })
    const iconCenterX = multPos.x - HUD_MULT_SIZE / 2 - HUD_GAP - HUD_ICON / 2
    const iconPos = vec2(iconCenterX, y)
    const icon = makeOutlinedSprite({
      spriteKey, w: HUD_ICON, h: HUD_ICON,
      anchorAt: 'center',
      posAt: iconPos,
    })
    return { num, mult, icon, y, rgb, iconPos }
  }

  const nuggetRow = buildCounterRow({
    y: nuggetRowY, spriteKey: 'nugget', rgb: HUD_NUGGET_RGB,
  })
  const iceRow = buildCounterRow({
    y: iceRowY, spriteKey: 'ice-cream', rgb: HUD_ICECREAM_RGB,
  })

  setOutlinedText(nuggetRow.num, String(getNuggets()))
  setOutlinedText(iceRow.num,    String(getIceCreams()))

  // -- Top-center: level name banner (fades after 2 s) -------------------
  // Smaller than the counters so it doesn't crowd them; it's only on screen
  // for 2 s anyway.
  const banner = makeOutlinedText({
    str: levelName, size: 24,
    rgb: [255, 230, 80],
    anchorAt: 'top',
    posAt: vec2(width() / 2, HUD_PAD),
  })
  wait(2.0, () => fadeOutAndDestroy(banner, 0.5))

  // -- Per-frame: keep counter text in sync with current values ----------
  // Cheap, and means gameplay code only updates a number — HUD picks it up.
  onUpdate(() => {
    const ln = String(getLives())
    if (livesNum.fill.text !== ln) setOutlinedText(livesNum, ln)
    const nn = String(getNuggets())
    if (nuggetRow.num.fill.text !== nn) setOutlinedText(nuggetRow.num, nn)
    const inn = String(getIceCreams())
    if (iceRow.num.fill.text !== inn) setOutlinedText(iceRow.num, inn)
  })

  // ====================================================================
  // Public API
  // ====================================================================

  function flyToCounter(kind, worldPos) {
    const target = kind === 'nugget' ? nuggetRow
                 : kind === 'icecream' ? iceRow
                 : null
    if (!target) return

    const startScreen = worldToScreen(worldPos)
    const endScreen = vec2(target.iconPos.x, target.iconPos.y)
    const ghost = add([
      sprite(target.icon._spriteKey, { width: HUD_ICON, height: HUD_ICON }),
      pos(startScreen),
      anchor('center'),
      scale(1),
      fixed(), z(Z_GHOST),
    ])
    ramp(HUD_GHOST_DURATION, (t) => {
      const e = easeInOutQuad(t)
      ghost.pos.x = lerp(startScreen.x, endScreen.x, e)
      ghost.pos.y = lerp(startScreen.y, endScreen.y, e)
      // 1.0 → 1.2 (mid) → 0.8 (arrival), so it punctuates the landing.
      const s = t < 0.5
        ? lerp(1.0, 1.2, t * 2)
        : lerp(1.2, 0.8, (t - 0.5) * 2)
      ghost.scale = vec2(s, s)
    }, () => {
      destroy(ghost)
      popGroup(target.num, HUD_POP_SCALE)
      shimmerGroup(target.icon)
      flashTint(target.num, target.rgb)
      floatLabel({ x: target.num.pos.x, y: target.y, label: '+1', rgb: target.rgb })
    })
  }

  function notifyLifeLost() {
    shakeGroupX(livesNum, HUD_SHAKE_INTENSITY, 0.4)
    flashRedThenBack(livesNum, HUD_LIVES_RGB, 3, 0.4)
    floatLabel({ x: livesNum.pos.x, y: livesNum.pos.y, label: '−1', rgb: [255, 80, 80] })
    redVignette()
  }

  function notifyExtraLife() {
    popGroup(livesNum, HUD_POP_SCALE_BIG)
    sparkleBurst(livesIconPos)
    floatLabel({
      x: livesNum.pos.x, y: livesNum.pos.y,
      label: '1UP!', rgb: [255, 230, 80], sizeBoost: true,
    })
    flashTint(livesIcon.fill, [255, 255, 200], { isSprite: true })
  }

  return { flyToCounter, notifyLifeLost, notifyExtraLife }

  // ====================================================================
  // Animation helpers (closure over the rows above)
  // ====================================================================

  function fadeOutAndDestroy(group, dur) {
    // Each part has its own base opacity (shadow 0.5, others 1).
    const bases = group._parts.map(p => p.opacity ?? 1)
    ramp(dur, (t) => {
      group._parts.forEach((p, i) => { p.opacity = bases[i] * (1 - t) })
    }, () => destroy(group))
  }

  function popGroup(group, peakScale) {
    const half = HUD_POP_DURATION / 2
    ramp(half, (t) => {
      const s = lerp(1, peakScale, t)
      group.scale = vec2(s, s)
    }, () => {
      ramp(half, (t) => {
        const s = lerp(peakScale, 1, t)
        group.scale = vec2(s, s)
      })
    })
  }

  function shimmerGroup(group) {
    const dur = 0.2
    ramp(dur, (t) => {
      // One full sine cycle: 0 → +5° → 0 → -5° → 0.
      group.angle = Math.sin(t * Math.PI * 2) * 5
    }, () => { group.angle = 0 })
  }

  function flashTint(group, baseRGB, opts = {}) {
    // Tween the fill child's color toward white, then back.
    const peak = lerpRGB(baseRGB, [255, 255, 255], 0.4)
    const half = HUD_POP_DURATION / 2
    const target = opts.isSprite ? group : group.fill
    ramp(half, (t) => {
      const c = lerpRGB(baseRGB, peak, t)
      target.color = rgb(c[0], c[1], c[2])
    }, () => {
      ramp(half, (t) => {
        const c = lerpRGB(peak, baseRGB, t)
        target.color = rgb(c[0], c[1], c[2])
      })
    })
  }

  function floatLabel({ x, y, label, rgb: rgbColor, sizeBoost }) {
    const size = sizeBoost ? HUD_TEXT_SIZE : Math.round(HUD_TEXT_SIZE * 0.7)
    const startY = y
    const group = makeOutlinedText({
      str: label, size, rgb: rgbColor,
      anchorAt: 'center',
      posAt: vec2(x, y),
      zAt: Z_FLOAT,
    })
    const baseOpacities = group._parts.map(p => p.opacity ?? 1)
    ramp(HUD_FLOAT_DURATION, (t) => {
      group.pos.y = startY - HUD_FLOAT_DISTANCE * t
      group._parts.forEach((p, i) => { p.opacity = baseOpacities[i] * (1 - t) })
    }, () => destroy(group))
  }

  function shakeGroupX(group, intensity, dur) {
    const baseX = group.pos.x
    ramp(dur, (t) => {
      // 4 wiggles over the duration, decaying toward the end.
      const wig = Math.sin(t * Math.PI * 8) * intensity * (1 - t)
      group.pos.x = baseX + wig
    }, () => { group.pos.x = baseX })
  }

  function flashRedThenBack(group, baseRGB, count, dur) {
    const red = [255, 64, 64]
    const step = dur / (count * 2)
    for (let i = 0; i < count; i++) {
      const phase = i * 2
      wait(phase * step,       () => group.fill.color = rgb(...red))
      wait((phase + 1) * step, () => group.fill.color = rgb(...baseRGB))
    }
  }

  function redVignette() {
    const v = add([
      rect(width(), height()),
      pos(0, 0),
      color(255, 30, 30),
      opacity(0),
      fixed(), z(Z_VIGNETTE),
    ])
    const dur = 0.5
    ramp(dur, (t) => {
      v.opacity = t < 0.5 ? lerp(0, 0.4, t * 2) : lerp(0.4, 0, (t - 0.5) * 2)
    }, () => destroy(v))
  }

  function sparkleBurst(centerScreen) {
    const cx = centerScreen.x, cy = centerScreen.y
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2
      const spd = 80 + Math.random() * 40
      const dx = Math.cos(angle) * spd
      const dy = Math.sin(angle) * spd
      const sp = add([
        circle(4),
        pos(cx, cy),
        color(255, 230, 80),
        opacity(1),
        fixed(), z(Z_FLOAT),
      ])
      const life = 0.6
      ramp(life, (t) => {
        sp.pos.x = cx + dx * t
        sp.pos.y = cy + dy * t
        sp.opacity = 1 - t
      }, () => destroy(sp))
    }
  }
}
