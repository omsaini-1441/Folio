import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { motion } from 'motion/react'
import { useLenis } from 'lenis/react'

type WipeFn = (target: string | number, label?: string) => void

const WipeContext = createContext<WipeFn>(() => {})

// eslint-disable-next-line react-refresh/only-export-components
export const useWipe = () => useContext(WipeContext)

const EASE = [0.76, 0, 0.24, 1] as const

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SWEEP = reducedMotion ? 0.01 : 0.75
const HOLD_MS = reducedMotion ? 0 : 180

/**
 * Liquid edge shapes. Every path shares an identical command structure
 * (one cubic curve, same number of values), which is what lets Motion
 * interpolate between them and morph the surface instead of snapping.
 * The keyframe order reads as: flung up, slosh back, settle.
 */
const TOP_SURGE = [
  'M0,100 C25,-60 75,-60 100,100 Z',
  'M0,100 C25,-25 75,40 100,100 Z',
  'M0,100 C25,55 75,20 100,100 Z',
  'M0,100 C25,72 75,72 100,100 Z',
]
const TOP_REST = 'M0,100 C25,72 75,72 100,100 Z'

const BOTTOM_SURGE = [
  'M0,0 C25,160 75,160 100,0 Z',
  'M0,0 C25,125 75,60 100,0 Z',
  'M0,0 C25,45 75,80 100,0 Z',
  'M0,0 C25,28 75,28 100,0 Z',
]
const BOTTOM_REST = 'M0,0 C25,28 75,28 100,0 Z'

type Phase = 'idle' | 'enter' | 'exit'

function LiquidEdge({
  side,
  animate,
}: {
  side: 'top' | 'bottom'
  animate: string | string[]
}) {
  const isTop = side === 'top'
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute left-[-5%] h-[16vh] w-[110%]"
      style={isTop ? { top: '-15.8vh' } : { bottom: '-15.8vh' }}
      aria-hidden
    >
      <motion.path
        fill="var(--color-accent)"
        initial={false}
        d={isTop ? TOP_REST : BOTTOM_REST}
        animate={{ d: animate }}
        transition={{ duration: SWEEP, ease: 'easeOut' }}
      />
    </svg>
  )
}

/**
 * Full-page liquid transition. wipeTo(target) floods an accent panel over
 * the viewport, performs the scroll jump while the screen is covered, then
 * drains it away. Phases are timer-driven so navigation still completes if
 * the animation is skipped (e.g. reduced-motion users).
 */
export default function WipeProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis()
  const [phase, setPhase] = useState<Phase>('idle')
  const [label, setLabel] = useState('')
  const phaseRef = useRef<Phase>('idle')
  const target = useRef<string | number>('#contact')

  const setPhaseSafe = (next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }

  const wipeTo = useCallback<WipeFn>(
    (t, l = '') => {
      if (phaseRef.current !== 'idle') return
      target.current = t
      setLabel(l)
      lenis?.stop()
      setPhaseSafe('enter')
    },
    [lenis],
  )

  useEffect(() => {
    if (phase === 'idle') return

    if (phase === 'enter') {
      const id = window.setTimeout(() => {
        lenis?.scrollTo(target.current, { immediate: true, force: true })
        setPhaseSafe('exit')
      }, SWEEP * 1000 + HOLD_MS)
      return () => window.clearTimeout(id)
    }

    const id = window.setTimeout(() => {
      lenis?.start()
      setPhaseSafe('idle')
    }, SWEEP * 1000)
    return () => window.clearTimeout(id)
  }, [phase, lenis])

  return (
    <WipeContext.Provider value={wipeTo}>
      {children}

      <div
        className={`fixed inset-0 z-[150] ${phase === 'idle' ? 'pointer-events-none' : 'pointer-events-auto'}`}
        aria-hidden
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-accent"
          initial={false}
          animate={
            phase === 'enter' ? { y: '0%' } : phase === 'exit' ? { y: '-125%' } : { y: '125%' }
          }
          transition={phase === 'idle' ? { duration: 0 } : { duration: SWEEP, ease: EASE }}
        >
          <LiquidEdge side="top" animate={phase === 'enter' ? TOP_SURGE : TOP_REST} />
          <LiquidEdge side="bottom" animate={phase === 'exit' ? BOTTOM_SURGE : BOTTOM_REST} />

          {label && (
            <motion.span
              key={label + phase}
              className="font-display text-[10vw] font-extrabold uppercase tracking-tight text-ink md:text-[6vw]"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {label}
            </motion.span>
          )}
        </motion.div>
      </div>
    </WipeContext.Provider>
  )
}
