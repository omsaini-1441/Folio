import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
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

function ProjectCard({ project, flip }: { project: Project; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const visualY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <motion.article
      ref={ref}
      className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div data-hover className="group relative block aspect-4/3 overflow-hidden rounded-2xl">
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
      <div className="flex flex-col gap-24 md:gap-40">
        {reel.map((project, i) => (
          <ProjectCard key={project.title} project={project} flip={(3 + i) % 2 === 1} />
        ))}
      </div>
    )
  }

  return (
    <div ref={pinRef} className="relative h-[240vh]">
      <div ref={viewRef} className="sticky top-0 flex h-svh items-center overflow-hidden pt-20">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex items-center gap-8 pl-[10vw] pr-[12vw] will-change-transform"
        >
          {reel.map((project) => (
            <HorizontalCard key={project.title} project={project} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="work" className="px-5 py-24 md:px-10 md:py-40">
      <SectionHeading number="03" title="Selected Work" />
      <div className="flex flex-col gap-24 overflow-x-clip md:gap-40">
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
