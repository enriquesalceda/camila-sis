// Camila — these are all the numbers you can change to make the game feel
// different. Save the file and the browser will reload by itself.

// ---------- Physics ----------
export const GRAVITY     = 1600   // how fast Camila falls. Bigger = falls faster. Try 800 to feel like the moon.
export const RUN_SPEED   = 220    // how fast Camila runs left/right (pixels per second).
export const JUMP_FORCE  = 700    // how high she jumps. Bigger = jumps higher.

// ---------- Tile size ----------
export const TILE        = 32     // every letter in the level map is this many pixels wide.

// ---------- Camila's body ----------
export const CAMILA_FACE_SCALE   = 0.125 // her face image is 256px, this shrinks it to 32px.
export const CAMILA_SMALL_HEIGHT = 48    // how tall small Camila is.
export const CAMILA_TALL_HEIGHT  = 64    // how tall she gets after eating a chicken nugget.
export const INVULN_MS           = 1000  // after a hit, she flickers and can't be hurt for this many ms.
export const POWERUP_FLASH_MS    = 800   // how long the sparkle wiggle lasts when she eats a nugget.
export const WALK_FRAME_MS       = 120   // her legs swap this often when walking.

// ---------- Ice cream scoop ----------
export const SCOOP_SPEED         = 480   // how fast a thrown scoop flies.
export const SCOOP_GRAVITY_SCALE = 0.3   // 0 = floats, 1 = falls just as fast as Camila. Smaller floats more.
export const SCOOP_COOLDOWN_MS   = 350   // smallest gap between throws.

// ---------- Enemies ----------
export const ENEMY_WALK_SPEED    = 60    // how fast notebooks and insects walk.
export const INSECT_KICK_SPEED   = 380   // how fast a kicked insect-shell slides.
export const INSECT_STUN_MS      = 5000  // how long the insect stays stunned before waking up.

// ---------- Lives ----------
export const LIVES_AT_START      = 3     // how many tries Camila gets before Game Over.
