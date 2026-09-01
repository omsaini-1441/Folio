import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import Magnetic from './Magnetic'
import { useWipe } from './PageWipe'
import { profile } from '../data/portfolio'

const links = [
  { label: 'About', target: '#about' },
  { label: 'Work', target: '#work' },
  { label: 'Experience', target: '#experience' },
  { label: 'Contact', target: '#contact' },
]

const EASE = [0.76, 0, 0.24, 1] as const

export default function Navbar({ ready }: { ready: boolean }) {
  const lenis = useLenis()
  const wipeTo = useWipe()
  const [open, setOpen] = useState(false)

  const go = (target: string | number, label: string) => {
    setOpen(false)
    wipeTo(target, label)
  }

  const toggleMenu = () => {
    setOpen((prev) => {
      if (prev) lenis?.start()
      else lenis?.stop()
      return !prev
    })
  }

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -80, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <nav className="flex items-center justify-between bg-linear-to-b from-ink/80 to-transparent px-5 py-4 md:px-10 md:py-5">
          <Magnetic>
            <button
              onClick={() => go(0, 'Home')}
              className="font-display text-lg font-bold tracking-tight text-paper"
              data-hover
            >
              {profile.firstName}
              <span className="text-accent">.</span>
            </button>
          </Magnetic>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <li key={link.label}>
                <Magnetic strength={0.25}>
                  <button
                    onClick={() => go(link.target, link.label)}
                    className="group relative px-1 py-1 font-mono text-xs uppercase tracking-widest text-paper"
                    data-hover
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                  </button>
                </Magnetic>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Magnetic className="hidden md:block">
              <button
                onClick={() => go('#contact-form', "Let's talk")}
                className="rounded-full border border-paper/30 px-4 py-2 font-mono text-xs uppercase tracking-widest text-paper transition-colors duration-300 hover:border-accent hover:text-accent"
                data-hover
              >
                Let's talk
              </button>
            </Magnetic>

            {/* Mobile menu toggle */}
            <button
              onClick={toggleMenu}
              className="relative z-80 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              aria-label="Menu"
              data-hover
            >
              <motion.span
                className="block h-px w-6 bg-paper"
                animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className="block h-px w-6 bg-paper"
                animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-70 flex flex-col justify-between bg-ink-2 px-6 pb-10 pt-28"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ul className="flex flex-col gap-2">
              {links.map((link, i) => (
                <li key={link.label} className="overflow-hidden">
                  <motion.button
                    onClick={() => go(link.target, link.label)}
                    className="font-display text-5xl font-extrabold uppercase tracking-tight text-paper"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%', transition: { duration: 0.3 } }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: EASE }}
                  >
                    <span className="mr-3 font-mono text-sm text-accent">
                      0{i + 1}
                    </span>
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>

            <motion.div
              className="flex flex-col gap-4 border-t border-line pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <a href={`mailto:${profile.email}`} className="font-mono text-sm text-accent">
                {profile.email}
              </a>
              <div className="flex gap-5">
                {profile.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs uppercase tracking-widest text-muted"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
