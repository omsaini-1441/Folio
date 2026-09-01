# Folio — Om Saini's Portfolio

A dark, editorial single-page portfolio built with heavy attention to motion design: preloader, lens-effect custom cursor, magnetic buttons, smooth scrolling, page-wipe transitions, scroll-linked text reveals and parallax project cards.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · [Motion](https://motion.dev) · [Lenis](https://lenis.darkroom.engineering)

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint
```

## Deploying to Vercel

The repo ships with `vercel.json` (framework preset, security headers, asset caching), so deployment needs no extra configuration.

### Option A — Vercel dashboard (recommended)

1. Push to GitHub (already done: `omsaini-1441/Folio`).
2. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
3. **Import** the `Folio` repository. Vercel auto-detects Vite; leave build command (`npm run build`) and output directory (`dist`) as-is.
4. Expand **Environment Variables** and add both (Production, Preview and Development):

   | Name | Value |
   | --- | --- |
   | `VITE_SITE_URL` | your final URL, e.g. `https://omsaini.vercel.app` (no trailing slash) |
   | `VITE_WEB3FORMS_KEY` | your Web3Forms access key |

5. Click **Deploy**. Every future `git push` to `main` redeploys automatically.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel          # preview deployment
vercel --prod   # production deployment
```

### After the first deploy

Vercel assigns your real domain (or you add a custom one). Point these at it so social previews and search indexing are correct:

1. `VITE_SITE_URL` in the Vercel environment variables, then redeploy.
2. The `Sitemap:` line in `public/robots.txt`.
3. The `<loc>` value in `public/sitemap.xml`.

Then verify the share card by pasting the URL into [opengraph.xyz](https://www.opengraph.xyz).

## Contact form

The footer form posts to [Web3Forms](https://web3forms.com), which relays submissions to `omsaini.tech@gmail.com`.

- The access key is read from `VITE_WEB3FORMS_KEY`. It is public by design — it only permits sending mail to the address it was issued for — and is protected by a hidden honeypot field against bots.
- If the key is ever missing, the form degrades gracefully: it opens the visitor's mail app with the message pre-filled and logs a console warning.

## Editing content

All copy lives in **one file**: `src/data/portfolio.ts`

- `profile` — name, role, location, email, hero text, about paragraph, social links
- `stats` — the animated counters in the About section
- `skillGroups` — the "Arsenal" section
- `projects` — project cards (title, description, stack, image, accent color)
- `experience` / `education` — the work history section

### Accent highlights

Wrap any phrase in asterisks to paint it in the accent colour:

```ts
heroBlurb: 'I ship *production event-driven systems*: message pipelines and more.'
```

This works in `heroBlurb`, `aboutIntro`, project descriptions and experience descriptions. In the About section the highlight rides along with the scroll-linked word reveal.

## Images

Project screenshots live in `public/projects/` as WebP (~80 KB each, down from ~1.7 MB PNGs). To re-optimize after adding new artwork:

```bash
npm i -D sharp
node scripts/optimize-images.mjs
npm uninstall sharp
```

The script converts any PNG in `public/projects/` to WebP at 1400px wide, regenerates the favicons from `public/icon-512.png`, and rebuilds the 1200×630 social card `public/og.jpg`.

## Structure

```
public/                 static assets, icons, robots.txt, sitemap.xml
scripts/
  optimize-images.mjs   image pipeline (WebP + icons + OG card)
src/
  data/portfolio.ts     ← all content lives here
  components/
    PageWipe.tsx        full-page paint transition + scroll jump
    Preloader.tsx       counter + curtain reveal
    Cursor.tsx          lens cursor (inverts content behind it)
    Magnetic.tsx        magnetic-hover wrapper
    Navbar.tsx          fixed nav + fullscreen mobile menu
    Hero.tsx            headline reveal + parallax
    Marquee.tsx         infinite tech-stack strip
    About.tsx           scroll-linked word reveal + counters
    Skills.tsx          grouped skill rows
    Projects.tsx        parallax project cards
    Experience.tsx      timeline + education
    Contact.tsx         fill-in-the-blanks form + footer
```

## Accessibility

Respects `prefers-reduced-motion`: animations, the marquee, smooth scrolling and the custom cursor are all disabled for users who ask for reduced motion. Form fields carry ARIA labels and the topic selector is an ARIA radio group.
