// Loads all sprites into Kaplay. With `global: true` in main.js, `loadSprite`
// is available as a global. Sounds aren't loaded here — they're synthesized
// in src/sounds.js. To use real WAVs later, add `loadSound(...)` calls and
// wire up Kaplay's `play()` in src/sounds.js.

export function loadAssets() {
  loadSprite('camila-normal', './sprites/camila/normal.png')
  loadSprite('camila-power',  './sprites/camila/power.png')
  loadSprite('camila-tall',   './sprites/camila/tall.png')
  loadSprite('camila-dead',   './sprites/camila/dead.png')
}
