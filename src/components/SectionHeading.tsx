import { motion } from 'motion/react'

export default function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-14 flex items-baseline gap-4 overflow-hidden md:mb-20">
      <motion.span
        className="font-mono text-sm text-accent"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.6 }}
      >
        {number}
      </motion.span>
      <motion.h2
        className="font-display text-4xl font-extrabold uppercase tracking-tight text-paper md:text-6xl"
        initial={{ y: '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h2>
    </div>
  )
}
