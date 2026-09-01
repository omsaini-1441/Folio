import { motion } from 'motion/react'
import SectionHeading from './SectionHeading'
import { experience, education } from '../data/portfolio'

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
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
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

            <p className="max-w-lg leading-relaxed text-muted">{job.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-16 flex flex-col gap-2 md:mt-20 md:flex-row md:items-baseline md:justify-between"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-accent">Education</span>
        <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
          <span className="font-display text-xl font-bold text-paper">{education.degree}</span>
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            {education.school} · {education.period} · {education.detail}
          </span>
        </div>
      </motion.div>
    </section>
  )
}
