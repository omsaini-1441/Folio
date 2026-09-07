/**
 * One-page resume PDF matching the site's dark editorial look.
 * The site ships the FlowCV export at public/om-saini-resume.pdf.
 * Re-run this only if you want a dark-theme poster PDF instead:
 *   curl.exe -sL -o public/om-saini-resume.pdf "https://app.flowcv.com/api/public/download_resume?token=fwtpdmusr9"
 */
import { writeFile } from 'node:fs/promises'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const PAGE = { w: 595.28, h: 841.89 }
const ink = rgb(0.043, 0.043, 0.047)
const ink2 = rgb(0.071, 0.071, 0.078)
const paper = rgb(0.945, 0.937, 0.902)
const muted = rgb(0.56, 0.553, 0.518)
const accent = rgb(0.8, 0.965, 0.333)
const line = rgb(0.945, 0.937, 0.902)

const M = 48

function wrap(font, text, size, max) {
  const words = text.split(/\s+/)
  const lines = []
  let cur = ''
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word
    if (font.widthOfTextAtSize(next, size) > max && cur) {
      lines.push(cur)
      cur = word
    } else {
      cur = next
    }
  }
  if (cur) lines.push(cur)
  return lines
}

function rule(page, y) {
  page.drawRectangle({ x: M, y, width: PAGE.w - M * 2, height: 0.6, color: line, opacity: 0.12 })
}

const doc = await PDFDocument.create()
doc.setTitle('Om Saini - Resume')
doc.setAuthor('Om Saini')
doc.setSubject('Full-Stack Developer')
doc.setCreator('folio')

const page = doc.addPage([PAGE.w, PAGE.h])
const sans = await doc.embedFont(StandardFonts.Helvetica)
const sansBold = await doc.embedFont(StandardFonts.HelveticaBold)

page.drawRectangle({ x: 0, y: 0, width: PAGE.w, height: PAGE.h, color: ink })
page.drawRectangle({ x: 0, y: 0, width: 8, height: PAGE.h, color: accent })

let y = PAGE.h - 52

page.drawText('OM SAINI', {
  x: M,
  y,
  size: 32,
  font: sansBold,
  color: paper,
})
const year = '2026'
page.drawText(year, {
  x: PAGE.w - M - sans.widthOfTextAtSize(year, 10),
  y: y + 8,
  size: 10,
  font: sans,
  color: accent,
})

y -= 18
page.drawText('Full-Stack Developer  ·  Chandigarh, India', {
  x: M,
  y,
  size: 10,
  font: sans,
  color: muted,
})

y -= 16
const contacts = [
  'omsaini.tech@gmail.com',
  '+91 77194 87204',
  'github.com/omsaini-1441',
  'linkedin.com/in/om-saini',
]
page.drawText(contacts.join('   ·   '), {
  x: M,
  y,
  size: 8,
  font: sans,
  color: paper,
  opacity: 0.85,
})

y -= 18
rule(page, y)
y -= 22

page.drawText('SUMMARY', {
  x: M,
  y,
  size: 8,
  font: sansBold,
  color: accent,
})
y -= 14

const summary =
  'Full-stack developer with 2+ years shipping production event-driven systems, RabbitMQ pipelines, Socket.IO / MongoDB change-stream sync, and data modeling for a high-availability ERP. Recently built OrchOrb, a multi-tenant Docker control plane with Traefik routing and CI-to-registry pipelines. Looking to bring that backend depth to a team building high-scale, reliable systems.'

for (const ln of wrap(sans, summary, 9.5, PAGE.w - M * 2)) {
  page.drawText(ln, { x: M, y, size: 9.5, font: sans, color: paper })
  y -= 13
}

y -= 10
rule(page, y)
y -= 20

page.drawText('EXPERIENCE', {
  x: M,
  y,
  size: 8,
  font: sansBold,
  color: accent,
})
y -= 18

const jobs = [
  {
    role: 'Full-Stack Developer',
    company: 'PSquare Company',
    dates: '07/2025 - Present',
    bullets: [
      'Architected backend services for Suryacon ERP across 12 domain modules, ~330 APIs and 7-role RBAC.',
      'Offline-first sync layer (Socket.IO + MongoDB change streams + PouchDB) across ~50 collections.',
      'RabbitMQ pipelines with durable queues, retry and dead-letter safety for notifications and fanout.',
      'Purchasing and inventory stack: cart negotiation, PO lifecycle, QR dispatch, site transfer, stock ledger.',
      'Cascading soft-delete and approval gates across a 5-layer nested task hierarchy.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Cloudberry Tech',
    dates: '12/2024 - 06/2025',
    bullets: [
      'Real-time copy-trading pipeline with multiplexed SSE, cutting server load by nearly a third.',
      'Drag-and-drop React email editor with nested component state and template serialization.',
      'Shipped the company site performance-first: lazy loading and motion work, 45% faster loads.',
    ],
  },
]

for (const job of jobs) {
  page.drawText(job.role, { x: M, y, size: 12, font: sansBold, color: paper })
  const datesW = sans.widthOfTextAtSize(job.dates, 8)
  page.drawText(job.dates, {
    x: PAGE.w - M - datesW,
    y: y + 1,
    size: 8,
    font: sans,
    color: muted,
  })
  y -= 13
  page.drawText(job.company, { x: M, y, size: 9, font: sans, color: muted })
  y -= 14
  for (const b of job.bullets) {
    page.drawCircle({ x: M + 2, y: y + 3, size: 2, color: accent })
    const lines = wrap(sans, b, 9, PAGE.w - M * 2 - 12)
    for (const ln of lines) {
      page.drawText(ln, { x: M + 12, y, size: 9, font: sans, color: paper })
      y -= 12
    }
    y -= 2
  }
  y -= 8
}

rule(page, y)
y -= 20

page.drawText('SELECTED WORK', {
  x: M,
  y,
  size: 8,
  font: sansBold,
  color: accent,
})
y -= 16

const works = [
  'OrchOrb - multi-tenant Docker control plane',
  'Suryacon ERP - construction ops platform',
  'TradeSync - real-time copy trading',
  'PeerPod - live focus gym with Redis leaderboards',
  'BitVault - zero-knowledge secrets vault',
  'Bonfire - on-device dark-pattern scanner',
]
const colW = (PAGE.w - M * 2 - 16) / 2
works.forEach((w, i) => {
  const col = i % 2
  const row = Math.floor(i / 2)
  page.drawText(w, {
    x: M + col * (colW + 16),
    y: y - row * 13,
    size: 9,
    font: sans,
    color: paper,
  })
})
y -= 13 * 3 + 8

rule(page, y)
y -= 20

const leftX = M
const rightX = PAGE.w / 2 + 8
const colMax = PAGE.w / 2 - M - 16

page.drawText('ARSENAL', {
  x: leftX,
  y,
  size: 8,
  font: sansBold,
  color: accent,
})
page.drawText('EDUCATION', {
  x: rightX,
  y,
  size: 8,
  font: sansBold,
  color: accent,
})
y -= 16

const skills = [
  ['Backend', 'Node.js, NestJS, TypeScript, REST, WebSockets, SSE, RabbitMQ'],
  ['Data', 'MongoDB, Redis, PostgreSQL, TypeORM, Change Streams'],
  ['Frontend', 'React, Next.js, Tailwind, Motion'],
  ['Infra', 'Docker, Traefik, PM2, Nginx, CI/CD'],
]

let sy = y
for (const [label, val] of skills) {
  page.drawText(label.toUpperCase(), { x: leftX, y: sy, size: 8, font: sansBold, color: paper })
  sy -= 11
  for (const ln of wrap(sans, val, 8, colMax)) {
    page.drawText(ln, { x: leftX, y: sy, size: 8, font: sans, color: muted })
    sy -= 11
  }
  sy -= 6
}

let ey = y
page.drawText('B.E. Computer Science', {
  x: rightX,
  y: ey,
  size: 10,
  font: sansBold,
  color: paper,
})
ey -= 13
page.drawText('Chitkara University, Punjab', {
  x: rightX,
  y: ey,
  size: 8,
  font: sans,
  color: muted,
})
ey -= 11
page.drawText('2020 - 2024  ·  CGPA 9.81 / 10', {
  x: rightX,
  y: ey,
  size: 8,
  font: sans,
  color: muted,
})
ey -= 18
page.drawText('Higher Secondary (Non-Medical)', {
  x: rightX,
  y: ey,
  size: 9,
  font: sansBold,
  color: paper,
})
ey -= 12
page.drawText('MIA DAV Public School  ·  2020', {
  x: rightX,
  y: ey,
  size: 8,
  font: sans,
  color: muted,
})

page.drawRectangle({
  x: 0,
  y: 0,
  width: PAGE.w,
  height: 28,
  color: ink2,
})
page.drawText('omsaini.tech@gmail.com   ·   Open to opportunities', {
  x: M,
  y: 11,
  size: 8,
  font: sans,
  color: muted,
})

const bytes = await doc.save()
await writeFile('public/om-saini-resume.pdf', bytes)
console.log(`wrote public/om-saini-resume.pdf (${Math.round(bytes.length / 1024)} KB)`)
