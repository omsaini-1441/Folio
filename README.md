# Folio — Creative Developer Portfolio

A dark, editorial portfolio for a MERN full-stack developer, built with heavy attention to motion design: preloader, custom cursor, magnetic buttons, smooth scrolling, scroll-linked text reveals, parallax project cards, and an infinite marquee.

## Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** — styling and design tokens
- **Motion** (motion.dev) — all animations and scroll effects
- **Lenis** — smooth scrolling

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Contact form email delivery

The contact form in the footer sends messages straight to your inbox via [Web3Forms](https://web3forms.com) (free):

1. Go to web3forms.com and enter `omsaini.tech@gmail.com` to get an access key (arrives by email, no signup).
2. Paste the key into `contactFormAccessKey` in `src/data/portfolio.ts`.

Until the key is set, the form falls back to opening the visitor's email app with the message pre-filled, so it still works out of the box.

## Editing your content

All resume content lives in **one file**: `src/data/portfolio.ts`

- `profile` — name, role, location, email, hero text, about paragraph, social links
- `stats` — the animated counters in the About section
- `skillGroups` — the skills/"Arsenal" section
- `projects` — project cards (title, description, stack, gradient colors, links)
- `experience` — the work-history timeline

Change values there and every section updates automatically.

## Structure

```
src/
  data/portfolio.ts     ← all content (edit this)
  components/
    Preloader.tsx       counter + curtain reveal
    Cursor.tsx          custom cursor with hover states
    Magnetic.tsx        magnetic-hover wrapper
    Navbar.tsx          fixed nav with smooth-scroll anchors
    Hero.tsx            headline reveal + parallax
    Marquee.tsx         infinite tech-stack strip
    About.tsx           scroll-linked word reveal + counters
    Skills.tsx          grouped skill rows
    Projects.tsx        parallax project cards
    Experience.tsx      timeline rows
    Contact.tsx         big CTA footer + live clock
```
