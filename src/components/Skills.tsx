import { motion } from 'motion/react'
import SectionHeading from './SectionHeading'
import { skillGroups } from '../data/portfolio'

export default function Skills() {
  return (
    <section className="px-6 py-28 md:px-10 md:py-40">
      <SectionHeading number="02" title="Arsenal" />

      <div className="flex flex-col">
        {skillGroups.map((group, i) => (
          <motion.div
            key={group.title}
            className="group border-t border-line py-10 transition-colors duration-500 last:border-b hover:bg-ink-2 md:py-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            data-hover
          >
            <div className="grid gap-6 md:grid-cols-[1fr_1fr_2fr] md:items-baseline">
              <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-paper transition-transform duration-500 group-hover:translate-x-3 md:text-4xl">
                <span className="mr-3 font-mono text-sm text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {group.title}
              </h3>

              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                {group.tagline}
              </p>

              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-line px-4 py-1.5 text-sm text-paper/80 transition-all duration-300 hover:border-accent hover:bg-accent hover:text-ink"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
