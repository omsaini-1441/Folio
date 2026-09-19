import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import SectionHeading from './SectionHeading'
import { Highlight } from '../lib/highlight'
import { projects } from '../data/portfolio'

type Project = (typeof projects)[number]

const EASE = [0.22, 1, 0.36, 1] as const

/** Cursor-following preview only makes sense with a mouse and motion allowed. */
function useFinePointer() {
  const [on, setOn] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const pointer = window.matchMedia('(pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setOn(pointer.matches && !reduce.matches)
    update()
    pointer.addEventListener('change', update)
    reduce.addEventListener('change', update)
    return () => {
      pointer.removeEventListener('change', update)
      reduce.removeEventListener('change', update)
    }
  }, [])
  return on
}

function ExpandedPanel({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="grid gap-8 pb-10 pt-1 md:grid-cols-[1.15fr_1fr] md:gap-16 md:pb-14 md:pl-24">
        <div className="flex min-w-0 flex-col gap-6">
          <p className="max-w-xl leading-relaxed text-muted">
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

        <div className="relative aspect-4/3 overflow-hidden rounded-xl">
          <img
            src={project.image}
            alt={`${project.title} · ${project.category}`}
            className="h-full w-full object-cover"
            width={1400}
            height={1050}
            sizes="(min-width: 768px) 40vw, 100vw"
            loading="lazy"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-0 bg-ink/15" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const fine = useFinePointer()
  const [active, setActive] = useState<number | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  // Remembers the last hovered project so the preview doesn't go blank
  // while it scales out after the pointer leaves the list.
  const [shown, setShown] = useState(0)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 320, damping: 32, mass: 0.7 })
  const springY = useSpring(y, { stiffness: 320, damping: 32, mass: 0.7 })

  const previewOn = fine && active !== null && active !== open

  const hover = (i: number | null) => {
    setActive(i)
    if (i !== null) setShown(i)
  }

  return (
    <section
      id="work"
      className="px-5 py-24 md:px-10 md:py-40"
      onMouseMove={(e) => {
        x.set(e.clientX)
        y.set(e.clientY)
      }}
    >
      <SectionHeading number="03" title="Recent Work" />

      <div className="mb-4 flex items-baseline justify-between font-mono text-xs uppercase tracking-widest text-muted">
        <span>{projects.length} projects · 2024 — 2026</span>
        <span className="hidden md:inline">Hover to preview — click to expand</span>
        <span className="md:hidden">Tap to expand</span>
      </div>

      <ul>
        {projects.map((project, i) => {
          const isOpen = open === i
          return (
            <motion.li
              key={project.title}
              className="border-b border-line first:border-t"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                onMouseEnter={() => hover(i)}
                onMouseLeave={() => hover(null)}
                className={`group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 py-5 text-left transition-opacity duration-300 md:grid-cols-[6rem_1fr_auto_7rem_2.5rem] md:gap-x-8 md:py-7 ${
                  fine && active !== null && active !== i ? 'opacity-35' : 'opacity-100'
                }`}
              >
                <span className="font-mono text-xs text-accent md:text-sm">{project.index}</span>

                <span className="min-w-0">
                  {/* Title stays paper-colored: the custom cursor blends with
                      mix-blend-difference, and accent-on-accent would render
                      black instead of the inverted look used site-wide. */}
                  <span className="block font-display text-2xl font-extrabold uppercase tracking-tight text-paper transition-transform duration-400 ease-out group-hover:translate-x-2 md:truncate md:text-5xl">
                    {project.title}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-muted md:hidden">
                    {project.category}
                  </span>
                </span>

                <span className="hidden max-w-80 truncate font-mono text-xs uppercase tracking-wider text-muted md:block">
                  {project.category}
                </span>

                <span className="text-right font-mono text-xs text-muted">{project.year}</span>

                <span
                  aria-hidden
                  className={`hidden text-center font-mono text-xl text-muted transition-transform duration-400 ease-out md:block ${
                    isOpen ? 'rotate-45 text-accent' : 'group-hover:text-paper'
                  }`}
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && <ExpandedPanel project={project} />}
              </AnimatePresence>
            </motion.li>
          )
        })}
      </ul>

      {/* Cursor-following preview (desktop, motion allowed). Sits under the
          custom cursor (z-200) so the difference-blend blob plays over it. */}
      {fine && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40"
          style={{ x: springX, y: springY }}
        >
          <motion.div
            className="relative aspect-4/3 w-80 -translate-y-1/2 translate-x-8 overflow-hidden rounded-lg xl:w-105"
            initial={false}
            animate={{ scale: previewOn ? 1 : 0.45, opacity: previewOn ? 1 : 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {projects.map((p, i) => (
              <img
                key={p.title}
                src={p.image}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  i === shown ? 'opacity-100' : 'opacity-0'
                }`}
                width={1400}
                height={1050}
                decoding="async"
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
