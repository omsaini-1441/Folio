/**
 * Converts source screenshots into web-ready assets.
 * Run with: node scripts/optimize-images.mjs
 * (requires `npm i -D sharp`)
 */
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const PROJECTS_DIR = 'public/projects'
const kb = (bytes) => `${Math.round(bytes / 1024)} KB`

const files = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith('.png'))

for (const file of files) {
  const input = join(PROJECTS_DIR, file)
  const output = input.replace(/\.png$/, '.webp')
  const before = (await stat(input)).size

  await sharp(input).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 80 }).toFile(output)

  const after = (await stat(output)).size
  console.log(`${file}: ${kb(before)} -> ${kb(after)}`)
}

// Favicons + PWA icons, derived from the 512px monogram
await sharp('public/icon-512.png').resize(32, 32).png({ compressionLevel: 9 }).toFile('public/favicon-32.png')
await sharp('public/icon-512.png').resize(180, 180).png({ compressionLevel: 9 }).toFile('public/apple-touch-icon.png')

// Social share card (1200x630) cropped from the OrchOrb dashboard
await sharp('public/projects/orchorb-ui.webp')
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82 })
  .toFile('public/og.jpg')

for (const f of ['favicon-32.png', 'apple-touch-icon.png', 'og.jpg']) {
  console.log(`${f}: ${kb((await stat(join('public', f))).size)}`)
}
