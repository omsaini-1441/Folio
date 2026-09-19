/**
 * Generates stylized cover images for projects that have no public UI
 * to screenshot (desktop apps, apps behind a login, no live deploy).
 * Run with: node scripts/make-covers.mjs
 */
import sharp from 'sharp'

const W = 1400
const H = 1050

const covers = [
  {
    file: 'public/projects/autopilot-ui.webp',
    index: '09',
    accent: '#6ee7ff',
    category: 'AI Job Outreach Studio',
    lines: ['AUTO', 'PILOT'],
    footer: 'NEXT.JS · PRISMA · GEMINI · TIPTAP',
  },
  {
    file: 'public/projects/fumeshelf-ui.webp',
    index: '10',
    accent: '#d98cff',
    category: 'Creator Perfume Shelves',
    lines: ['FUME', 'SHELF'],
    footer: 'NEXT.JS · PRISMA · POSTGRES · CLOUDINARY',
  },
  {
    file: 'public/projects/walli-ui.webp',
    index: '11',
    accent: '#3db8d4',
    category: 'Per-Monitor Wallpapers for Windows',
    lines: ['WALLI'],
    footer: 'C# · .NET · WPF · WINDOWS API',
  },
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function coverSvg({ index, accent, category, lines, footer }) {
  const gridLines = Array.from({ length: 13 }, (_, i) => {
    const x = (i + 1) * 100
    return `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="rgba(241,239,230,0.045)" stroke-width="1"/>`
  }).join('')

  const titleSize = lines.length > 1 ? 210 : 240
  const titleStart = lines.length > 1 ? 470 : 580
  const title = lines
    .map(
      (line, i) =>
        `<text x="90" y="${titleStart + i * (titleSize * 0.92)}" font-family="Arial, sans-serif" font-weight="900" font-size="${titleSize}" letter-spacing="-6" fill="#f1efe6">${esc(line)}</text>`,
    )
    .join('')

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="85%" cy="12%" r="75%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.34"/>
      <stop offset="45%" stop-color="${accent}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#0b0b0c"/>
  ${gridLines}
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="1330" y="985" text-anchor="end" font-family="Arial, sans-serif" font-weight="900" font-size="560" letter-spacing="-12" fill="none" stroke="rgba(241,239,230,0.14)" stroke-width="2">${index}</text>
  <rect x="90" y="118" width="46" height="6" fill="${accent}"/>
  <text x="90" y="188" font-family="Consolas, monospace" font-size="34" letter-spacing="7" fill="${accent}">${esc(category.toUpperCase())}</text>
  ${title}
  <text x="90" y="960" font-family="Consolas, monospace" font-size="28" letter-spacing="5" fill="#8f8d84">${esc(footer)}</text>
</svg>`
}

for (const cover of covers) {
  await sharp(Buffer.from(coverSvg(cover))).webp({ quality: 84 }).toFile(cover.file)
  console.log(`made ${cover.file}`)
}

// Forever-you has a real screenshot (png from microlink) - just convert it.
await sharp('public/projects/foreveryou-ui.png')
  .resize({ width: 1400, withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile('public/projects/foreveryou-ui.webp')
console.log('made public/projects/foreveryou-ui.webp')
