import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { useLenis } from 'lenis/react'

type WipeFn = (target: string | number, label?: string) => void

const WipeContext = createContext<WipeFn>(() => {})

// eslint-disable-next-line react-refresh/only-export-components
export const useWipe = () => useContext(WipeContext)

const EASE = [0.76, 0, 0.24, 1] as const

/**
 * Full-page "paint" transition. wipeTo(target) sweeps an accent panel
 * with curved edges over the viewport, performs the scroll jump while
 * the screen is covered, then sweeps the panel away.
 */
export default function WipeProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis()
  const [phase, setPhase] = useState<'idle' | 'enter' | 'exit'>('idle')
  const [label, setLabel] = useState('')
  const target = useRef<string | number>('#contact')

  const wipeTo = useCallback<WipeFn>(
    (t, l = '') => {
      setPhase((current) => {
        if (current !== 'idle') return current
        target.current = t
        setLabel(l)
        lenis?.stop()
        return 'enter'
      })
    },
    [lenis],
  )

  return (
    <WipeContext.Provider value={wipeTo}>
      {children}

      <div className="pointer-events-none fixed inset-0 z-[150]" aria-hidden>
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-accent"
          initial={false}
          animate={
            phase === 'enter' ? { y: '0%' } : phase === 'exit' ? { y: '-115%' } : { y: '115%' }
          }
          transition={phase === 'idle' ? { duration: 0 } : { duration: 0.65, ease: EASE }}
          onAnimationComplete={() => {
            if (phase === 'enter') {
              lenis?.scrollTo(target.current, { immediate: true, force: true })
              window.setTimeout(() => setPhase('exit'), 200)
            } else if (phase === 'exit') {
              lenis?.start()
              setPhase('idle')
            }
          }}
        >
          {/* curved caps give the panel its paint-blob leading edge */}
          <div
            className="absolute left-[-5%] top-[-9.5vh] h-[10vh] w-[110%] bg-accent"
            style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
          />
          <div
            className="absolute bottom-[-9.5vh] left-[-5%] h-[10vh] w-[110%] bg-accent"
            style={{ borderRadius: '0 0 50% 50% / 0 0 100% 100%' }}
          />

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
