import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { profile } from '../data/portfolio'

const DURATION =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 0.3
    : 1.8

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const t = Math.min((now - start) / (DURATION * 1000), 1)
      // ease-out so the counter decelerates into 100
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * 100))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => setFinished(true), 250)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!finished && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col justify-between bg-ink p-6 md:p-10"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-muted">
            <span>{profile.fullName}</span>
            <span>Portfolio © 2026</span>
          </div>

          <div className="flex items-end justify-between">
            <motion.p
              className="max-w-xs font-mono text-xs uppercase leading-relaxed tracking-widest text-muted"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Loading the good stuff: fonts, easing curves &amp; questionable confidence
            </motion.p>
            <span className="font-display text-[18vw] font-extrabold leading-none text-paper md:text-[10rem]">
              {count}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
