import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [label, setLabel] = useState('')

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 })

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reducedMotion) return
    setEnabled(true)

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-hover]')
      setHovering(!!target)
      setLabel(target?.dataset.cursorLabel ?? '')
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [x, y])

  if (!enabled) return null

  /**
   * Lens effect: the blend mode must live on the SAME element as the
   * transform. A transformed ancestor creates an isolated stacking
   * context, which cuts the blend off from the page and turns the
   * cursor into an opaque blob. With `difference` directly here, the
   * accent circle composites against whatever is underneath: the dark
   * background reads as neon green, and any text caught inside the
   * blob flips to its inverse color while the rest stays normal.
   */
  return (
    <motion.div
      className={`pointer-events-none fixed left-0 top-0 z-200 flex items-center justify-center rounded-full bg-accent ${
        label ? '' : 'mix-blend-difference'
      }`}
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: label ? 88 : hovering ? 80 : 12,
        height: label ? 88 : hovering ? 80 : 12,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {label && (
        <span className="font-mono text-10px uppercase tracking-widest text-ink">{label}</span>
      )}
    </motion.div>
  )
}
