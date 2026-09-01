import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import SectionHeading from './SectionHeading'
import { Highlight } from '../lib/highlight'
import { projects } from '../data/portfolio'

type Project = (typeof projects)[number]

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
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Visual */}
      <div data-hover className="group relative block aspect-4/3 overflow-hidden rounded-2xl">
        <motion.div
          className="absolute inset-[-10%] transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ y: visualY }}
        >
          <img
            src={project.image}
            alt={`${project.title} · ${project.category}`}
            className="h-full w-full object-cover"
            width={1400}
            height={1050}
            loading="lazy"
            decoding="async"
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent" />

        <span className="absolute left-5 top-5 font-mono text-xs uppercase tracking-widest text-paper/80">
          {project.category}
        </span>
        <span
          className="absolute bottom-5 left-5 font-display text-3xl font-extrabold uppercase tracking-tight opacity-0 transition-all duration-500 group-hover:opacity-100 md:text-4xl"
          style={{ color: project.accent }}
        >
          {project.title}
        </span>
      </div>

      {/* Copy */}
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

export default function Projects() {
  return (
    <section id="work" className="px-5 py-24 md:px-10 md:py-40">
      <SectionHeading number="03" title="Selected Work" />
      <div className="flex flex-col gap-24 md:gap-40">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  )
}
