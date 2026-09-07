import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import {
  education,
  experience,
  profile,
  projects,
  skillGroups,
} from '../data/portfolio'

type Phase = 'idle' | 'enter' | 'hold' | 'fold' | 'fly' | 'dock' | 'exit' | 'static'

type ResumeApi = {
  openResume: () => void
  active: boolean
}

const ResumeContext = createContext<ResumeApi | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}

const EASE = [0.76, 0, 0.24, 1] as const
const SOFT = [0.22, 1, 0.36, 1] as const

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function triggerFileDownload() {
  const a = document.createElement('a')
  a.href = profile.resumeFile
  a.download = profile.resumeName
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function Envelope() {
  return (
    <div className="relative h-36 w-52 overflow-hidden rounded-md bg-[#ebe6d6] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div
        className="absolute inset-x-0 top-0 h-[4.6rem] bg-accent"
        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[#ddd6c4]" />
      <div className="absolute left-1/2 top-[54%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent font-display text-sm font-extrabold tracking-tight text-ink shadow-[0_0_0_4px_#ebe6d6]">
        OS
      </div>
      <span className="absolute bottom-3 left-0 right-0 text-center font-mono text-[8px] uppercase tracking-[0.28em] text-ink/50">
        {profile.fullName}
      </span>
    </div>
  )
}

function ResumePoster() {
  const featured = projects.slice(0, 8)

  return (
    <article className="relative w-[min(92vw,680px)] max-h-[86vh] overflow-y-auto rounded-2xl border border-line bg-ink-2 p-5 shadow-[0_40px_120px_rgba(0,0,0,0.55)] md:p-9">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1.5 bg-accent" />

      <header className="flex items-start justify-between gap-4 pl-3">
        <div>
          <p className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight text-paper md:text-6xl">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted md:text-xs">
            {profile.role} · {profile.location}
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent">CV · 2026</span>
      </header>

      <p className="mt-4 max-w-xl pl-3 text-sm leading-relaxed text-paper/80 md:text-[15px]">
        {profile.resumeSummary}
      </p>

      <p className="mt-3 pl-3 font-mono text-[10px] uppercase tracking-widest text-muted">
        {profile.email} · {profile.phone}
      </p>
      <a
        href={profile.resumeUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 ml-3 inline-block font-mono text-[10px] uppercase tracking-[0.22em] text-accent underline decoration-accent/40 underline-offset-4"
        onClick={(e) => e.stopPropagation()}
      >
        Open live resume
      </a>

      <div className="my-5 h-px bg-line" />

      <p className="pl-3 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Experience</p>
      <div className="mt-3 flex flex-col gap-4 pl-3">
        {experience.map((job) => (
          <div key={job.company}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-display text-lg font-bold text-paper md:text-xl">{job.role}</h3>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{job.company}</span>
              <span className="ml-auto font-mono text-[10px] text-muted">{job.period}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-paper/70">{job.description.replace(/\*/g, '')}</p>
          </div>
        ))}
      </div>

      <div className="my-5 h-px bg-line" />

      <p className="pl-3 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Selected work</p>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 pl-3 md:grid-cols-4">
        {featured.map((project) => (
          <li key={project.title} className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] text-accent">{project.index}</span>
            <span className="font-display text-sm font-bold uppercase tracking-tight text-paper">
              {project.title}
            </span>
          </li>
        ))}
      </ul>

      <div className="my-5 h-px bg-line" />

      <div className="grid gap-6 pl-3 md:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Arsenal</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skillGroups.flatMap((group) => group.skills.slice(0, 4)).map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-paper/70"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Education</p>
          <p className="mt-3 font-display text-lg font-bold text-paper">{education.degree}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {education.school} · {education.period} · {education.detail}
          </p>
        </div>
      </div>
    </article>
  )
}

export default function ResumeProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis()
  const packetRef = useRef<HTMLDivElement>(null)
  const phaseRef = useRef<Phase>('idle')
  const [phase, setPhase] = useState<Phase>('idle')
  const [flight, setFlight] = useState({ x: 0, y: 0 })
  const [sun, setSun] = useState({ x: 0 })

  const setPhaseSafe = (next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }

  const chromeDownloadTarget = () => {
    // Chrome's download chip sits in the browser toolbar, top-right of the
    // window. From inside the page that is just above the viewport roof,
    // roughly 70px in from the right edge.
    return {
      x: window.innerWidth - 168,
      y: 0,
    }
  }

  const finish = useCallback(() => {
    triggerFileDownload()
    setPhaseSafe('dock')
  }, [])

  const openResume = useCallback(() => {
    if (phaseRef.current !== 'idle') return
    lenis?.stop()
    setFlight({ x: 0, y: 0 })
    setSun({ x: window.innerWidth - 168 })
    setPhaseSafe(reducedMotion() ? 'static' : 'enter')
  }, [lenis])

  const close = useCallback(() => {
    lenis?.start()
    setPhaseSafe('idle')
  }, [lenis])

  const skipToFold = useCallback(() => {
    if (phaseRef.current === 'enter' || phaseRef.current === 'hold') setPhaseSafe('fold')
  }, [])

  useEffect(() => {
    if (phase === 'idle' || phase === 'static') return

    const timers: number[] = []

    if (phase === 'enter') {
      timers.push(window.setTimeout(() => setPhaseSafe('hold'), 380))
    } else if (phase === 'hold') {
      timers.push(window.setTimeout(() => setPhaseSafe('fold'), 520))
    } else if (phase === 'fold') {
      timers.push(
        window.setTimeout(() => {
          const packet = packetRef.current
          const target = chromeDownloadTarget()
          if (packet) {
            const p = packet.getBoundingClientRect()
            setFlight({
              x: target.x - (p.left + p.width / 2),
              y: target.y - (p.top + p.height / 2),
            })
          }
          setPhaseSafe('fly')
        }, 850),
      )
    } else if (phase === 'fly') {
      timers.push(window.setTimeout(() => finish(), 900))
    } else if (phase === 'dock') {
      timers.push(
        window.setTimeout(() => {
          setPhaseSafe('exit')
        }, 380),
      )
    } else if (phase === 'exit') {
      timers.push(window.setTimeout(() => close(), 320))
    }

    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [phase, finish, close])

  useEffect(() => {
    if (phase === 'idle') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (phase === 'static' || phase === 'enter' || phase === 'hold') {
        close()
        return
      }
      if (phase === 'fold') skipToFold()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, close, skipToFold])

  const active = phase !== 'idle'
  const showEnvelope = phase === 'fold' || phase === 'fly' || phase === 'dock' || phase === 'exit'
  const showPoster = phase === 'enter' || phase === 'hold' || phase === 'fold' || phase === 'static'

  const showSun = phase === 'fold' || phase === 'fly' || phase === 'dock' || phase === 'exit'

  return (
    <ResumeContext.Provider value={{ openResume, active }}>
      {children}

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-140"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.button
              type="button"
              aria-label={phase === 'static' ? 'Close resume' : 'Wrap resume'}
              className="absolute inset-0 bg-ink"
              initial={false}
              animate={{
                opacity: phase === 'fly' || phase === 'dock' || phase === 'exit' ? 0 : 0.9,
              }}
              transition={{ duration: 0.55, ease: EASE }}
              onClick={() => {
                if (phase === 'static') close()
                else skipToFold()
              }}
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center perspective-[1400px]">
              <AnimatePresence>
                {showPoster && (
                  <motion.div
                    key="poster"
                    className="pointer-events-auto origin-bottom"
                    initial={{ opacity: 0, scale: 0.92, rotateX: 8 }}
                    animate={
                      phase === 'fold'
                        ? { opacity: 0, scale: 0.72, rotateX: 68 }
                        : { opacity: 1, scale: 1, rotateX: 0 }
                    }
                    exit={{ opacity: 0 }}
                    transition={{ duration: phase === 'fold' ? 0.9 : 0.7, ease: SOFT }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (phase === 'static') return
                      skipToFold()
                    }}
                  >
                    <ResumePoster />
                    {phase === 'hold' && (
                      <div className="pointer-events-none absolute inset-x-0 -bottom-8 flex flex-col items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
                          Wrapping for download
                        </span>
                        <div className="h-px w-28 overflow-hidden bg-line">
                          <motion.div
                            className="h-full origin-left bg-accent"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.52, ease: 'linear' }}
                          />
                        </div>
                      </div>
                    )}
                    {phase === 'static' && (
                      <div className="mt-5 flex flex-wrap justify-center gap-4">
                        <button
                          type="button"
                          className="pointer-events-auto rounded-full bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink"
                          onClick={() => {
                            triggerFileDownload()
                            close()
                          }}
                        >
                          Download PDF
                        </button>
                        <a
                          href={profile.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="pointer-events-auto rounded-full border border-paper/30 px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper"
                        >
                          View online
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pointer-events-none fixed inset-0 z-155 flex items-center justify-center">
              <AnimatePresence>
                {showEnvelope && (
                  <motion.div
                    ref={packetRef}
                    key="envelope"
                    initial={{ opacity: 0, scale: 0.7, rotate: -16, x: 0, y: 40 }}
                    animate={
                      phase === 'fold'
                        ? { opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }
                        : phase === 'fly'
                          ? {
                              opacity: 1,
                              scale: 0.2,
                              rotate: 24,
                              x: [0, flight.x * 0.4, flight.x],
                              y: [0, flight.y * 0.25 - 100, flight.y],
                            }
                          : {
                              opacity: phase === 'exit' ? 0 : 1,
                              scale: 0.04,
                              rotate: 28,
                              x: flight.x,
                              y: flight.y,
                            }
                    }
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: phase === 'fold' ? 0.75 : 0.9,
                      ease: EASE,
                    }}
                  >
                    <Envelope />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showSun && (
                <motion.div
                  className="pointer-events-none fixed z-170"
                  style={{ left: sun.x, top: 0 }}
                  initial={{ y: '-120%', opacity: 0, scale: 0.55 }}
                  animate={
                    phase === 'exit'
                      ? { y: '-120%', opacity: 0, scale: 0.7 }
                      : {
                          y: 0,
                          opacity: 1,
                          scale: phase === 'dock' ? 1.2 : 1,
                        }
                  }
                  exit={{ y: '-120%', opacity: 0 }}
                  transition={{ duration: 0.65, ease: EASE }}
                >
                  <div
                    className="h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 42%, #f6ffc4 0%, #ccf655 40%, rgba(204,246,85,0.2) 66%, transparent 72%)',
                      boxShadow: '0 0 48px rgba(204,246,85,0.55)',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </ResumeContext.Provider>
  )
}
