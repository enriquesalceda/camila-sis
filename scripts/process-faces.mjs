// Pre-processes Camila's 4 face PNGs to remove the white photo background and
// crop them to a circle. Reads from /public/sprites/camila/*.png (the resized
// photos), writes to /public/sprites/camila/processed/*.png. The originals are
// not touched — re-running this is safe (it skips files that are already up
// to date).
//
// Run manually with `npm run process-faces`, or it runs automatically before
// `npm run dev` and `npm run build` via the predev/prebuild hooks.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const inDir    = join(repoRoot, 'public', 'sprites', 'camila')
const outDir   = join(inDir, 'processed')
const sources  = ['normal.png', 'power.png', 'tall.png', 'dead.png']

// Tunables — tweak if her edges look chewed (raise fuzz) or haloed (lower it).
const FUZZ_PCT = 6     // % around white that counts as "background"
const FEATHER  = 0.7   // gaussian sigma on the alpha channel (1-2 px feather)

// First pass: figure out what (if anything) needs regeneration. We defer the
// ImageMagick availability check until we know there's actual work, so CI
// builds (Vercel) can succeed off the committed processed/*.png without
// needing magick installed.
const todo = []
for (const file of sources) {
  const src = join(inDir, file)
  const dst = join(outDir, file)

  if (!existsSync(src)) {
    console.warn(`[process-faces] skipping ${file} — source missing`)
    continue
  }

  // Idempotent: skip if processed file is newer than its source.
  if (existsSync(dst) && statSync(dst).mtimeMs >= statSync(src).mtimeMs) {
    console.log(`[process-faces] ${file} — up to date, skipping`)
    continue
  }

  todo.push({ file, src, dst })
}

if (todo.length === 0) {
  console.log('[process-faces] all files up to date.')
  console.log('[process-faces] done.')
  process.exit(0)
}

// We have real work — now ImageMagick is required.
try {
  execFileSync('magick', ['-version'], { stdio: 'ignore' })
} catch {
  console.error('[process-faces] ERROR: ImageMagick `magick` not found on PATH.')
  console.error('[process-faces]   Install with `brew install imagemagick`.')
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })

for (const { file, src, dst } of todo) {

  // 1) Knock out near-white pixels with -fuzz + -transparent.
  // 2) Soften the alpha edge by 1-2 px so the cutout doesn't look jagged.
  //    The portrait frame in src/entities/camila.js draws a tan ring
  //    around the face and hides any leftover edge artefacts.
  const args = [
    src,
    '-fuzz', `${FUZZ_PCT}%`,
    '-transparent', 'white',
    '-channel', 'A',
    '-blur', `0x${FEATHER}`,
    '+channel',
    dst,
  ]

  execFileSync('magick', args, { stdio: 'inherit' })

  // Sample a corner pixel as a sanity check — corner should be transparent.
  const corner = execFileSync('magick', [
    dst, '-format', '%[pixel:p{0,0}]', 'info:',
  ]).toString().trim()
  const ok = corner.includes(',0)')   // alpha 0 in srgba(R,G,B,A) format
  console.log(`[process-faces] ${file} → processed/${file} corner=${corner} ${ok ? 'ok' : 'WARNING: corner not transparent'}`)
}

console.log('[process-faces] done.')
