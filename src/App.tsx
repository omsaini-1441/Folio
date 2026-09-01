import { useState } from 'react'
import { MotionConfig } from 'motion/react'
import { ReactLenis } from 'lenis/react'
import WipeProvider from './components/PageWipe'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [ready, setReady] = useState(false)

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
          <div className="grain overflow-x-clip">
            <Preloader onDone={() => setReady(true)} />
            <Cursor />
            <Navbar ready={ready} />
            <main>
              <Hero ready={ready} />
              <Marquee />
              <About />
              <Skills />
              <Projects />
              <Experience />
            </main>
            <Contact />
          </div>
        </WipeProvider>
      </ReactLenis>
    </MotionConfig>
  )
}
