// Sound effects, made on the fly with the browser's WebAudio.
// No files to download — every "ping" and "boing" is built from sine, square,
// and noise generators. To swap in real WAV files later, drop them into
// /public/sounds and replace the recipes here with `new Audio(...)` calls.

let ctx = null

// iOS Safari blocks audio until the user has tapped/clicked once. We call
// this from the menu's first input handler.
export function unlockAudio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
}

function tone({ type = 'square', startFreq, endFreq, duration, gain = 0.2, when = 0 }) {
  if (!ctx) return
  const t0 = ctx.currentTime + when
  const t1 = t0 + duration
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(startFreq, t0)
  if (endFreq != null) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), t1)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t1)
  osc.connect(g).connect(ctx.destination)
  osc.start(t0); osc.stop(t1 + 0.02)
}

function noiseBurst({ duration, gain = 0.2, filterType = 'lowpass', cutoff = 1000, when = 0 }) {
  if (!ctx) return
  const t0 = ctx.currentTime + when
  const t1 = t0 + duration
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const filt = ctx.createBiquadFilter()
  filt.type = filterType
  filt.frequency.value = cutoff
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.005)
  g.gain.exponentialRampToValueAtTime(0.0001, t1)
  src.connect(filt).connect(g).connect(ctx.destination)
  src.start(t0); src.stop(t1)
}

const recipes = {
  jump:    () => tone({ type: 'square',   startFreq: 220, endFreq: 660, duration: 0.08, gain: 0.15 }),
  coin:    () => { tone({ startFreq: 988,  duration: 0.05, gain: 0.18 })
                   tone({ startFreq: 1318, duration: 0.08, gain: 0.18, when: 0.05 }) },
  stomp:   () => noiseBurst({ duration: 0.10, gain: 0.30, filterType: 'lowpass',  cutoff: 200 }),
  powerup: () => {
    const notes = [523, 659, 784, 1046] // C E G C
    notes.forEach((f, i) => tone({ startFreq: f, duration: 0.07, gain: 0.18, when: i * 0.06 }))
  },
  death:   () => tone({ type: 'sawtooth', startFreq: 800, endFreq: 100, duration: 0.6, gain: 0.25 }),
  win:     () => {
    const notes = [523, 659, 784, 1046, 1318, 1568, 2093]
    notes.forEach((f, i) => tone({ startFreq: f, duration: 0.10, gain: 0.18, when: i * 0.10 }))
    tone({ startFreq: 2093, duration: 0.5, gain: 0.18, when: 0.7 })
  },
  scoop:   () => noiseBurst({ duration: 0.20, gain: 0.15, filterType: 'highpass', cutoff: 800 }),

  // Celebration scene SFX.
  'firework-whoosh': () => noiseBurst({ duration: 0.30, gain: 0.18,
                                        filterType: 'bandpass', cutoff: 1500 }),
  'firework-pop':    () => {
    noiseBurst({ duration: 0.12, gain: 0.30, filterType: 'lowpass', cutoff: 3000 })
    tone({ type: 'square', startFreq: 1800, endFreq: 600,
           duration: 0.10, gain: 0.10, when: 0.02 })
  },
  'confetti-rustle': () => noiseBurst({ duration: 1.20, gain: 0.05,
                                        filterType: 'highpass', cutoff: 4000 }),
  ding:    () => {
    tone({ type: 'sine', startFreq: 1318, duration: 0.18, gain: 0.20 })
    tone({ type: 'sine', startFreq: 2093, duration: 0.30, gain: 0.18, when: 0.10 })
  },
  'mascot-yay': () => {
    const notes = [659, 784, 988, 1318]
    notes.forEach((f, i) => tone({ type: 'square', startFreq: f,
                                   duration: 0.08, gain: 0.16, when: i * 0.07 }))
  },
}

export function play(name) {
  if (!ctx) return
  const r = recipes[name]
  if (r) r()
}
