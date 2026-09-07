import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import SectionHeading from './SectionHeading'
import { Highlight } from '../lib/highlight'
import { projects } from '../data/portfolio'

type Project = (typeof projects)[number]

const EASE = [0.22, 1, 0.36, 1] as const

const VERTICAL_A = projects.slice(0, 3)
const HORIZONTAL = projects.slice(3, 6)
const VERTICAL_B = projects.slice(6)

function usePinnedReel() {
  const [on, setOn] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 768px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setOn(mq.matches && !reduce.matches)
    update()
    mq.addEventListener('change', update)
    reduce.addEventListener('change', update)
    return () => {
      mq.removeEventListener('change', update)
      reduce.removeEventListener('change', update)
    }
  }, [])
  return on
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function ellipsePoint(cx: number, cy: number, rx: number, ry: number, deg: number) {
  const rad = (deg * Math.PI) / 180
  return { x: cx + rx * Math.cos(rad), y: cy + ry * Math.sin(rad) }
}

function orbitArc(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  clockwise: boolean,
) {
  const enter = ellipsePoint(cx, cy, rx, ry, -90)
  const sweep = clockwise ? 280 : -280
  const exit = ellipsePoint(cx, cy, rx, ry, -90 + sweep)
  const large = 1
  const flag = clockwise ? 1 : 0
  return {
    enter,
    exit,
    d: `A ${rx.toFixed(1)} ${ry.toFixed(1)} 0 ${large} ${flag} ${exit.x.toFixed(1)} ${exit.y.toFixed(1)}`,
  }
}

function connect(
  from: { x: number; y: number },
  to: { x: number; y: number },
  outward: number,
  bounds: { w: number; h: number; pad: number },
) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const swing = Math.min(48, Math.max(20, Math.abs(dx) * 0.1))
  const c1 = {
    x: clamp(from.x + dx * 0.32 + outward * swing, bounds.pad, bounds.w - bounds.pad),
    y: clamp(from.y + dy * 0.22, bounds.pad, bounds.h - bounds.pad),
  }
  const c2 = {
    x: clamp(to.x - dx * 0.22 + outward * swing * 0.4, bounds.pad, bounds.w - bounds.pad),
    y: clamp(to.y - dy * 0.22, bounds.pad, bounds.h - bounds.pad),
  }
  return `C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
}

type Orbit = { cx: number; cy: number; rx: number; ry: number; outward: number }

function fitOrbit(orbit: Orbit, w: number, h: number, pad: number): Orbit {
  const cx = clamp(orbit.cx, pad + 24, w - pad - 24)
  const cy = clamp(orbit.cy, pad + 24, h - pad - 24)
  const rx = Math.min(orbit.rx, cx - pad, w - pad - cx)
  const ry = Math.min(orbit.ry, cy - pad, h - pad - cy)
  return { ...orbit, cx, cy, rx: Math.max(18, rx), ry: Math.max(18, ry) }
}

function buildTrail(orbits: Orbit[], w: number, h: number) {
  if (!orbits.length) return ''
  const pad = 28
  const bounds = { w, h, pad }
  const fitted = orbits.map((o) => fitOrbit(o, w, h, pad))
  const parts: string[] = []
  let cursor: { x: number; y: number } | null = null
  fitted.forEach((orbit, i) => {
    const clockwise = i % 2 === 0
    const arc = orbitArc(orbit.cx, orbit.cy, orbit.rx, orbit.ry, clockwise)
    if (!cursor) {
      const start = {
        x: clamp(arc.enter.x, pad, w - pad),
        y: clamp(arc.enter.y - 40, pad, h - pad),
      }
      parts.push(`M ${start.x.toFixed(1)} ${start.y.toFixed(1)}`)
      parts.push(connect(start, arc.enter, orbit.outward, bounds))
    } else {
      parts.push(connect(cursor, arc.enter, orbit.outward, bounds))
    }
    parts.push(arc.d)
    cursor = arc.exit
  })
  return parts.join(' ')
}

function trailHeadColor(t: number) {
  const lerp = (a: number[], b: number[], p: number) =>
    a.map((v, i) => Math.round(v + (b[i] - v) * p))
  const green = [204, 246, 85]
  const white = [241, 239, 230]
  const [r, g, b] = t < 0.5 ? lerp(green, white, t * 2) : lerp(white, green, (t - 0.5) * 2)
  return `rgb(${r}, ${g}, ${b})`
}

function WorkThread({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>
}) {
  const pathRef = useRef<SVGPathElement>(null)
  const [d, setD] = useState('')
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [head, setHead] = useState({ x: 0, y: 0, t: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.15'],
  })
  const drawn = useSpring(scrollYProgress, { stiffness: 70, damping: 28, mass: 0.4 })

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const measure = () => {
      const rr = root.getBoundingClientRect()
      const orbits: Orbit[] = []

      ;[...root.querySelectorAll<HTMLElement>('[data-trail]')].forEach((node) => {
        const r = node.getBoundingClientRect()
        const kind = node.dataset.trail
        const outward = kind === 'right' || kind === 'span-right' ? 1 : -1

        if (kind === 'span') {
          const x = r.left - rr.left
          const y = r.top - rr.top
          const w = r.width
          const h = r.height
          const loopH = Math.min(h * 0.045, 120)
          orbits.push(
            { cx: x + w * 0.34, cy: y + h * 0.22, rx: w * 0.14, ry: loopH, outward: -1 },
            { cx: x + w * 0.66, cy: y + h * 0.5, rx: w * 0.14, ry: loopH, outward: 1 },
            { cx: x + w * 0.4, cy: y + h * 0.78, rx: w * 0.13, ry: loopH, outward: -1 },
          )
          return
        }

        orbits.push({
          cx: r.left - rr.left + r.width / 2,
          cy: r.top - rr.top + r.height / 2,
          rx: r.width * 0.34,
          ry: r.height * 0.36,
          outward,
        })
      })

      const w = root.offsetWidth
      const h = root.offsetHeight
      setSize({ w, h })
      setD(buildTrail(orbits, w, h))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    const imgs = [...root.querySelectorAll('img')]
    imgs.forEach((img) => img.addEventListener('load', measure))
    const late = window.setTimeout(measure, 900)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      imgs.forEach((img) => img.removeEventListener('load', measure))
      window.clearTimeout(late)
      window.removeEventListener('resize', measure)
    }
  }, [containerRef])

  useEffect(() => {
    const path = pathRef.current
    if (!path || !d) return
    const p = path.getPointAtLength(0)
    setHead({ x: p.x, y: p.y, t: 0 })
  }, [d])

  useMotionValueEvent(drawn, 'change', (v) => {
    const path = pathRef.current
    if (!path || !d) return
    const len = path.getTotalLength()
    if (!len) return
    const p = path.getPointAtLength(Math.max(0, Math.min(1, v)) * len)
    setHead({ x: p.x, y: p.y, t: v })
  })

  if (!d || size.w === 0) return null

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 z-0 hidden overflow-hidden md:block"
      width={size.w}
      height={size.h}
      aria-hidden
    >
      <defs>
        <linearGradient id="work-trail-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={size.h}>
          <stop offset="0%" stopColor="#ccf655" />
          <stop offset="50%" stopColor="#f1efe6" />
          <stop offset="100%" stopColor="#ccf655" />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="url(#work-trail-grad)"
        strokeOpacity="0.22"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="url(#work-trail-grad)"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="work-thread"
        style={{ pathLength: drawn }}
      />
      <circle cx={head.x} cy={head.y} r="3.2" fill={trailHeadColor(head.t)} />
    </svg>
  )
}

function ProjectCard({ project, flip }: { project: Project; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const visualY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <motion.article
      ref={ref}
      className={`relative z-10 grid items-center gap-8 md:grid-cols-2 md:gap-16 ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div
        data-hover
        data-trail={flip ? 'right' : 'left'}
        className="group relative block aspect-4/3 overflow-hidden rounded-2xl"
      >
        <motion.div
          className="absolute inset-[-10%] transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ y: visualY }}
        >
          <img
            src={project.image}
            alt={`${project.title} · ${project.category}`}
            className="h-full w-full object-cover brightness-90 transition duration-500 group-hover:brightness-50"
            width={1400}
            height={1050}
            sizes="(min-width: 768px) 50vw, 100vw"
            loading="lazy"
            decoding="async"
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-ink/20 transition-colors duration-500 group-hover:bg-ink/55" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />

        <span className="absolute left-5 top-5 font-mono text-xs uppercase tracking-widest text-white/80">
          {project.category}
        </span>
        <span className="absolute bottom-5 left-5 font-display text-3xl font-extrabold uppercase tracking-tight text-white opacity-0 drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)] transition-all duration-500 group-hover:opacity-100 md:text-4xl">
          {project.title}
        </span>
      </div>

      <div className="flex min-w-0 flex-col gap-5">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-mono text-sm text-accent">{project.index}</span>
          <h3 className="font-display text-3xl font-extrabold uppercase tracking-tight text-paper md:text-5xl">
            {project.title}
          </h3>
          <span className="ml-auto font-mono text-xs text-muted">{project.year}</span>
        </div>

        <p className="max-w-lg leading-relaxed text-muted">
          <Highlight text={project.description} />
        </p>

        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-ink-2 px-3 py-1 font-mono text-xs uppercase tracking-wider text-paper/70"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

function HorizontalCard({ project }: { project: Project }) {
  return (
    <article className="relative w-[82vw] max-w-5xl shrink-0">
      <div className="group relative aspect-4/3 overflow-hidden rounded-2xl md:h-[70vh] md:max-h-190 md:w-full md:aspect-auto">
        <img
          src={project.image}
          alt={`${project.title} · ${project.category}`}
          className="h-full w-full object-cover brightness-75 transition duration-700 ease-out group-hover:scale-105 group-hover:brightness-50"
          width={1400}
          height={1050}
          sizes="82vw"
          loading="lazy"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-ink/35" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/90 via-ink/45 to-ink/15" />
        <span className="absolute left-6 top-6 font-mono text-xs uppercase tracking-widest text-white/80">
          {project.category}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-accent">{project.index}</span>
            <h3 className="font-display text-4xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)] md:text-6xl">
              {project.title}
            </h3>
            <span className="ml-auto font-mono text-xs text-white/70">{project.year}</span>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
            <Highlight text={project.description} />
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-ink/70 px-3 py-1 font-mono text-xs uppercase tracking-wider text-paper/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

function HorizontalReel({ projects: reel }: { projects: Project[] }) {
  const md = usePinnedReel()
  const pinRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [travel, setTravel] = useState(0)

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])

  useEffect(() => {
    if (!md) return
    const measure = () => {
      const view = viewRef.current
      const track = trackRef.current
      if (!view || !track) return
      setTravel(Math.max(0, track.scrollWidth - view.clientWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (viewRef.current) ro.observe(viewRef.current)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    const late = window.setTimeout(measure, 900)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.clearTimeout(late)
    }
  }, [md])

  if (!md) {
    return (
      <div className="flex flex-col gap-24">
        {reel.map((project, i) => (
          <ProjectCard key={project.title} project={project} flip={(3 + i) % 2 === 1} />
        ))}
      </div>
    )
  }

  return (
    <div ref={pinRef} data-trail="span" className="relative h-[280vh]">
      <div ref={viewRef} className="sticky top-0 flex h-svh items-center overflow-hidden pt-20">
        <div className="pointer-events-none absolute left-6 top-24 z-20 hidden font-mono text-[10px] uppercase tracking-[0.28em] text-muted md:block">
          Horizontal · keep scrolling
        </div>
        <motion.div ref={trackRef} style={{ x }} className="flex items-center gap-8 pl-[10vw] pr-[12vw] will-change-transform">
          {reel.map((project) => (
            <HorizontalCard key={project.title} project={project} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default function Projects() {
  const trailRef = useRef<HTMLDivElement>(null)

  return (
    <section id="work" className="px-5 py-24 md:px-10 md:py-40">
      <SectionHeading number="03" title="Selected Work" />
      <div ref={trailRef} className="relative overflow-x-clip flex flex-col gap-24 md:gap-40">
        <WorkThread containerRef={trailRef} />
        {VERTICAL_A.map((project, i) => (
          <ProjectCard key={project.title} project={project} flip={i % 2 === 1} />
        ))}
        <HorizontalReel projects={HORIZONTAL} />
        {VERTICAL_B.map((project, i) => (
          <ProjectCard key={project.title} project={project} flip={(6 + i) % 2 === 1} />
        ))}
      </div>
    </section>
  )
}
