// Tiny music driver. Two modes:
//   1. If MUSIC_TRACK is a non-empty filename, we load it from /public/sounds
//      and loop it via an HTML5 <audio> element.
//   2. Otherwise we synthesize a chiptune victory loop on the fly using the
//      same WebAudio context as src/sounds.js. No bundled binary needed.
//
// Both modes support fade-in and fade-out via fadeMusic().

import { unlockAudio } from './sounds.js'

let audioEl = null
let synthState = null   // { ctx, master, scheduler, stop }

// Two named tunes live in TUNES below. Camila — search for `TUNES.menu` or
// `TUNES.fanfare` to find the note lists and tweak frequencies/durations.
//   - `fanfare`: triumphant rising arpeggio for the celebration scene.
//   - `menu`:    gentle stepwise welcome loop for the title screen.
// Each tune is { lead: [...], bass: [...] }. The scheduler queues one
// "lead bar" at a time; the bass plays alongside and loops independently.
const TUNES = {
  fanfare: {
    lead: [
      // bar 1 — rising fanfare
      { f: 523,  d: 0.2 },  // C5
      { f: 659,  d: 0.2 },  // E5
      { f: 784,  d: 0.2 },  // G5
      { f: 1046, d: 0.2 },  // C6
      { f: 880,  d: 0.2 },  // A5
      { f: 1046, d: 0.2 },
      { f: 1318, d: 0.2 },  // E6
      { f: 1568, d: 0.4 },  // G6 (held)
      // bar 2 — answering call
      { f: 1318, d: 0.2 },
      { f: 1046, d: 0.2 },
      { f: 880,  d: 0.2 },
      { f: 784,  d: 0.2 },
      { f: 659,  d: 0.2 },
      { f: 784,  d: 0.2 },
      { f: 988,  d: 0.2 },  // B5
      { f: 1046, d: 0.4 },  // C6 resolve
    ],
    // Tonic-dominant pulses on a lower triangle wave.
    bass: [
      { f: 130, d: 0.4 },   // C3
      { f: 130, d: 0.4 },
      { f: 196, d: 0.4 },   // G3
      { f: 196, d: 0.4 },
      { f: 130, d: 0.4 },
      { f: 130, d: 0.4 },
      { f: 196, d: 0.4 },
      { f: 196, d: 0.4 },
    ],
  },

  menu: {
    lead: [
      // bar 1 — friendly "hello" rise
      { f: 523, d: 0.35 },  // C5
      { f: 587, d: 0.35 },  // D5
      { f: 659, d: 0.35 },  // E5
      { f: 784, d: 0.45 },  // G5 (held)
      { f: 880, d: 0.35 },  // A5
      { f: 784, d: 0.35 },  // G5
      // bar 2 — gentle answer and resolve
      { f: 659, d: 0.35 },  // E5
      { f: 587, d: 0.35 },  // D5
      { f: 523, d: 0.35 },  // C5
      { f: 587, d: 0.35 },  // D5
      { f: 659, d: 0.45 },  // E5 (held)
      { f: 523, d: 0.55 },  // C5 resolve
    ],
    // Slower pulse: tonic-dominant-subdominant for a warm welcome.
    bass: [
      { f: 130, d: 0.8 },   // C3
      { f: 130, d: 0.8 },
      { f: 196, d: 0.8 },   // G3
      { f: 174, d: 0.8 },   // F3 (sub-dominant)
      { f: 130, d: 0.8 },
    ],
  },
}

function totalDuration(phrase) { return phrase.reduce((s, n) => s + n.d, 0) }

function scheduleSynthBar(ctx, master, startAt, tune) {
  // Lead.
  let t = startAt
  for (const n of tune.lead) {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'square'
    osc.frequency.value = n.f
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.10, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + n.d * 0.95)
    osc.connect(g).connect(master)
    osc.start(t); osc.stop(t + n.d + 0.05)
    t += n.d
  }
  // Bass.
  let bt = startAt
  for (const n of tune.bass) {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = n.f
    g.gain.setValueAtTime(0.0001, bt)
    g.gain.exponentialRampToValueAtTime(0.07, bt + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, bt + n.d * 0.95)
    osc.connect(g).connect(master)
    osc.start(bt); osc.stop(bt + n.d + 0.05)
    bt += n.d
  }
}

function startSynthLoop(tuneName) {
  unlockAudio()
  const tune = TUNES[tuneName] || TUNES.fanfare
  // Reuse the global audio context used by sounds.js. We do that by creating
  // a brand-new one here only if the user hasn't tapped yet.
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()

  const master = ctx.createGain()
  master.gain.value = 0.0001       // start silent; fadeMusicIn ramps it up
  master.connect(ctx.destination)

  const barLen = totalDuration(tune.lead)
  let nextBarAt = ctx.currentTime + 0.05

  // Schedule one bar ahead at all times via a setInterval scheduler.
  const scheduler = setInterval(() => {
    while (nextBarAt < ctx.currentTime + 0.5) {
      scheduleSynthBar(ctx, master, nextBarAt, tune)
      nextBarAt += barLen
    }
  }, 100)

  return {
    ctx, master, scheduler,
    stop() { clearInterval(scheduler); master.disconnect() },
  }
}

export function playMusic({ track, tune } = {}) {
  unlockAudio()
  if (track && track.length > 0) {
    audioEl = new Audio(`./sounds/${track}`)
    audioEl.loop = true
    audioEl.volume = 0
    audioEl.play().catch(() => { /* ignored — Safari needs a user gesture */ })
    return
  }
  if (synthState) synthState.stop()
  synthState = startSynthLoop(tune ?? 'fanfare')
}

export function fadeMusicIn(seconds = 1, target = 0.6) {
  if (audioEl) {
    const start = performance.now()
    const audioTarget = Math.min(1.0, target / 0.6)  // scale relative to fanfare default
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / (seconds * 1000))
      audioEl.volume = t * audioTarget
      if (t < 1) requestAnimationFrame(tick)
    }
    tick()
    return
  }
  if (synthState) {
    const ctx = synthState.ctx
    const g = synthState.master.gain
    g.cancelScheduledValues(ctx.currentTime)
    g.setValueAtTime(0.0001, ctx.currentTime)
    g.exponentialRampToValueAtTime(target, ctx.currentTime + seconds)
  }
}

export function fadeMusicOut(seconds = 1, andStop = true) {
  if (audioEl) {
    const start = performance.now()
    const startVol = audioEl.volume
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / (seconds * 1000))
      audioEl.volume = startVol * (1 - t)
      if (t < 1) requestAnimationFrame(tick)
      else if (andStop) { audioEl.pause(); audioEl.src = ''; audioEl = null }
    }
    tick()
    return
  }
  if (synthState) {
    const s = synthState
    const ctx = s.ctx
    const g = s.master.gain
    g.cancelScheduledValues(ctx.currentTime)
    g.exponentialRampToValueAtTime(0.0001, ctx.currentTime + seconds)
    if (andStop) {
      const toStop = s
      synthState = null
      setTimeout(() => toStop.stop(), seconds * 1000 + 50)
    }
  }
}

export function stopMusic() {
  if (audioEl) { audioEl.pause(); audioEl.src = ''; audioEl = null }
  if (synthState) { synthState.stop(); synthState = null }
}
