import { useState } from 'react'
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

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 1.1 }}>
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
  )
}
