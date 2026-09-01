import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  animate,
  type MotionValue,
} from 'motion/react'
import SectionHeading from './SectionHeading'
import { profile, stats } from '../data/portfolio'

function Word({
  word,
  range,
  progress,
}: {
  word: string
  range: [number, number]
  progress: MotionValue<number>
}) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[0.3em] inline-block">
      {word}
    </motion.span>
  )
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value])

  return (
    <span ref={ref} className="font-display text-5xl font-extrabold text-paper md:text-7xl">
      {display}
      <span className="text-accent">{suffix}</span>
    </span>
  )
}

export default function About() {
  const textRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ['start 0.85', 'end 0.45'],
  })

  const words = profile.aboutIntro.split(' ')

  return (
    <section id="about" className="px-6 py-28 md:px-10 md:py-40">
      <SectionHeading number="01" title="About" />

      <div className="grid gap-16 md:grid-cols-[1fr_2fr]">
        <div className="font-mono text-xs uppercase leading-loose tracking-widest text-muted">
          <p>The person</p>
          <p>behind the commits</p>
        </div>

        <p ref={textRef} className="max-w-3xl text-xl font-medium leading-relaxed text-paper md:text-3xl">
          {words.map((word, i) => (
            <Word
              key={i}
              word={word}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
            />
          ))}
        </p>
      </div>

      <div className="mt-24 grid grid-cols-2 gap-y-14 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Counter value={stat.value} suffix={stat.suffix} />
            <span className="max-w-[16ch] font-mono text-xs uppercase tracking-widest text-muted">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
