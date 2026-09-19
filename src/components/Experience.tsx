import { motion } from 'motion/react'
import SectionHeading from './SectionHeading'
import { Highlight } from '../lib/highlight'
import { experience, education, highlights, accolade } from '../data/portfolio'

const EASE = [0.22, 1, 0.36, 1] as const

export default function Experience() {
  return (
    <section id="experience" className="px-6 py-28 md:px-10 md:py-40">
      <SectionHeading number="04" title="Experience" />

      <div className="flex flex-col">
        {experience.map((job, i) => (
          <motion.div
            key={`${job.company}-${job.period}`}
            className="group grid gap-4 border-t border-line py-10 transition-colors duration-500 last:border-b hover:bg-ink-2 md:grid-cols-[1fr_1.5fr_2fr] md:gap-8 md:py-14"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
            data-hover
          >
            <span className="font-mono text-xs uppercase tracking-widest text-muted transition-colors duration-500 group-hover:text-accent">
              {job.period}
            </span>

            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-paper transition-transform duration-500 group-hover:translate-x-2 md:text-3xl">
                {job.role}
              </h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
                {job.company}
              </p>
            </div>

            <p className="max-w-lg leading-relaxed text-muted">
              <Highlight text={job.description} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Education + competitive programming + hackathon — one composition */}
      <div className="mt-20 md:mt-28">
        <motion.p
          className="mb-8 font-mono text-xs uppercase tracking-widest text-accent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          Education &amp; Highlights
        </motion.p>

        <div className="grid gap-3 md:grid-cols-6">
          {/* Education — left half */}
          <motion.div
            className="group relative flex flex-col overflow-hidden border border-line bg-ink-2/40 p-6 md:col-span-3 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: EASE }}
            data-hover
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Degree
            </span>
            <h3 className="mt-6 font-display text-3xl font-extrabold uppercase tracking-tight text-paper md:text-4xl">
              {education.degree}
            </h3>
            <p className="mt-4 max-w-sm font-mono text-xs uppercase tracking-widest text-muted">
              {education.school}
            </p>
            <div className="mt-auto flex flex-wrap items-baseline gap-x-6 gap-y-2 pt-10">
              <span className="font-mono text-sm text-accent">{education.period}</span>
              <span className="font-display text-2xl font-bold text-paper">{education.detail}</span>
            </div>
          </motion.div>

          {/* Competitive programming stats */}
          {highlights.map((h, i) => (
            <motion.div
              key={h.platform}
              className="group flex flex-col border border-line bg-ink-2/40 p-5 transition-colors duration-500 hover:border-accent/40 md:col-span-1 md:p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: 0.08 + i * 0.06, ease: EASE }}
              data-hover
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  {h.platform}
                </span>
                <img
                  src={h.logo}
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 shrink-0 opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-paper md:text-[2.5rem]">
                {h.value}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                {h.label}
              </p>
              <p className="mt-auto pt-4 font-mono text-xs text-accent">{h.detail}</p>
            </motion.div>
          ))}

          {/* Hackathon — full width */}
          <motion.div
            className="group border border-line bg-ink-2/40 p-6 transition-colors duration-500 hover:border-accent/40 md:col-span-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
            data-hover
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                Hackathon
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                {accolade.badge} · {accolade.prize}
              </span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1.4fr] md:items-end md:gap-12">
              <h3 className="font-display text-3xl font-extrabold uppercase tracking-tight text-paper md:text-4xl">
                {accolade.title}
              </h3>
              <p className="max-w-xl text-sm leading-relaxed text-muted md:text-base">
                <Highlight text={accolade.description} />
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
