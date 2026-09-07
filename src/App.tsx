import { lazy, Suspense, useEffect, useLayoutEffect, useState, type ComponentType } from 'react'
import { MotionConfig } from 'motion/react'
import { ReactLenis } from 'lenis/react'
import WipeProvider from './components/PageWipe'
import ResumeProvider from './components/ResumeCinematic'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'

const About = lazy(() => import('./components/About'))
const Skills = lazy(() => import('./components/Skills'))
const Projects = lazy(() => import('./components/Projects'))
const Experience = lazy(() => import('./components/Experience'))
const Contact = lazy(() => import('./components/Contact'))

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function LazyCursor() {
  const [Cursor, setCursor] = useState<ComponentType | null>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const load = () => {
      void import('./components/Cursor').then((mod) => setCursor(() => mod.default))
    }

    const t = window.setTimeout(load, 250)
    return () => window.clearTimeout(t)
  }, [])

  return Cursor ? <Cursor /> : null
}

export default function App() {
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    document.getElementById('boot')?.remove()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        options={{
          lerp: prefersReducedMotion ? 1 : 0.08,
          wheelMultiplier: 1.1,
          smoothWheel: !prefersReducedMotion,
        }}
      >
        <WipeProvider>
          <ResumeProvider>
            <div className="grain overflow-x-clip">
            {!ready && <Preloader onDone={() => setReady(true)} />}
            <LazyCursor />
            <Navbar ready={ready} />
            <main>
              <Hero ready={ready} />
              <Marquee />
              <Suspense fallback={null}>
                <About />
                <Skills />
                <Projects />
                <Experience />
              </Suspense>
            </main>
            <Suspense fallback={null}>
              <Contact />
            </Suspense>
            </div>
          </ResumeProvider>
        </WipeProvider>
      </ReactLenis>
    </MotionConfig>
  )
}
