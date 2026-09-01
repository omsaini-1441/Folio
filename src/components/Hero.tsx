import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Highlight } from '../lib/highlight'
import { profile } from '../data/portfolio'

const EASE = [0.22, 1, 0.36, 1] as const

function RevealLine({
  text,
  delay,
  ready,
  outlined,
}: {
  text: string
  delay: number
  ready: boolean
  outlined?: boolean
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block font-display font-extrabold uppercase leading-[0.95] tracking-tight ${
          outlined ? 'text-stroke' : 'text-paper'
        }`}
        initial={{ y: '110%' }}
        animate={ready ? { y: 0 } : {}}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        {text}
      </motion.span>
    </span>
  )
}

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative flex min-h-svh flex-col justify-between overflow-hidden px-6 pb-8 pt-28 md:px-10">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -top-1/4 left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #ccf655 0%, transparent 70%)' }}
      />

      <motion.div style={{ y, opacity }} className="flex h-full flex-1 flex-col justify-between">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            {profile.availability} · {profile.location}
          </span>
          <span className="ml-auto font-mono text-xs text-accent">©2026</span>
        </motion.div>

        {/* Sized so the widest line always fills the column minus its padding:
            the headline is ~10.3em wide, and the extra headroom absorbs the
            text stroke and any font-loading variance. */}
        <h1 className="mt-8 w-full min-w-0 text-[calc((100vw-40px)/10.8)] md:text-[calc((100vw-80px)/10.8)]">
          <RevealLine text={profile.heroLines[0]} delay={0.35} ready={ready} />
          <RevealLine text={profile.heroLines[1]} delay={0.5} ready={ready} outlined />
        </h1>

        <div className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <motion.p
            className="max-w-md text-base leading-relaxed text-muted md:text-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 1 }}
          >
            <Highlight text={profile.heroBlurb} />
          </motion.p>

          <motion.div
            className="flex flex-col items-start gap-2 md:items-end"
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 1.15 }}
          >
            <span className="font-mono text-xs uppercase tracking-widest text-muted">Currently wielding</span>
            <span className="font-display text-lg font-bold text-paper md:text-xl">
              Node.js · NestJS · React · MongoDB
            </span>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.6, duration: 1 }}
        >
          <motion.span
            className="h-10 w-px bg-paper/40"
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
