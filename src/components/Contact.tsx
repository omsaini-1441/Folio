import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Magnetic from './Magnetic'
import { useWipe } from './PageWipe'
import { profile, footerNote, contactFormAccessKey } from '../data/portfolio'

const EASE = [0.22, 1, 0.36, 1] as const

function LocalTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      )
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])
  return <span>{time} IST</span>
}

function RotatingBadge() {
  const wipeTo = useWipe()
  return (
    <button
      onClick={() => wipeTo('#contact-form', 'Say hi')}
      data-hover
      data-cursor-label="Let's go"
      className="group pointer-events-auto relative hidden h-32 w-32 transition-transform duration-500 hover:scale-110 md:block"
      aria-label="Jump to contact form"
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <path id="badge-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-muted font-mono text-8px uppercase tracking-[0.22em] transition-colors duration-300 group-hover:fill-paper">
          <textPath href="#badge-circle">Open to work · Let's talk · Open to work ·</textPath>
        </text>
      </motion.svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl text-accent">↓</span>
    </button>
  )
}

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

const TOPICS = ['a project', 'a full-time role', 'a collab', 'something else']

function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [topic, setTopic] = useState(TOPICS[0])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')
    const subject = `Portfolio: ${topic} from ${name}`

    // Honeypot: humans never see this field, bots fill everything.
    if (data.get('botcheck')) return

    if (!contactFormAccessKey) {
      // No API key configured: open the visitor's mail app pre-filled.
      console.warn('[contact] No Web3Forms access key configured, falling back to mailto.')
      const body = encodeURIComponent(`${message}\n\nRegarding: ${topic}\n${name}\n${email}`)
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${body}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: contactFormAccessKey,
          subject,
          from_name: 'Portfolio contact form',
          botcheck: false,
          name,
          email,
          message: `Reaching out about: ${topic}\n\n${message}`,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inlineInput =
    'inline-block max-w-full border-b-2 border-line bg-transparent pb-1 align-baseline font-display text-2xl font-bold text-accent outline-none transition-colors duration-300 [field-sizing:content] placeholder:font-normal placeholder:italic placeholder:text-muted/40 focus:border-accent md:text-4xl'

  return (
    <AnimatePresence mode="wait">
      {status === 'sent' ? (
        <motion.div
          key="sent"
          className="flex flex-col items-start gap-6 py-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="overflow-hidden font-display text-6xl font-extrabold uppercase tracking-tight md:text-8xl">
            <motion.span
              className="block text-accent"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              Sent.
            </motion.span>
          </span>
          <motion.p
            className="max-w-md text-lg leading-relaxed text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            It's sitting in my inbox right now. Expect a reply within 24 hours, usually much faster.
          </motion.p>
          <motion.button
            onClick={() => setStatus('idle')}
            data-hover
            className="font-mono text-xs uppercase tracking-widest text-paper underline decoration-accent underline-offset-8 transition-colors hover:text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Send another one
          </motion.button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30, transition: { duration: 0.4 } }}
        >
          <motion.p
            className="font-display text-2xl font-bold leading-[1.8] text-paper md:text-4xl md:leading-[1.7]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {/* Honeypot: off-screen and skipped by keyboard, bots fill it anyway */}
            <input
              type="checkbox"
              name="botcheck"
              className="sr-only"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            Hey Om, I'm{' '}
            <input
              name="name"
              required
              aria-label="Your name"
              placeholder="your name"
              autoComplete="name"
              className={`${inlineInput} min-w-[9ch]`}
            />{' '}
            and I'm reaching out about{' '}
            <span
              role="radiogroup"
              aria-label="What are you reaching out about?"
              className="inline-flex flex-wrap items-baseline gap-2 align-baseline"
            >
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={topic === t}
                  data-hover
                  onClick={() => setTopic(t)}
                  className={`rounded-full border px-4 py-1 align-middle font-body text-sm transition-all duration-300 md:text-base ${
                    topic === t
                      ? 'border-accent bg-accent font-semibold text-ink'
                      : 'border-line text-muted hover:border-accent/60 hover:text-paper'
                  }`}
                >
                  {t}
                </button>
              ))}
            </span>
            . The gist of it:{' '}
            <textarea
              name="message"
              required
              rows={1}
              aria-label="Your message"
              placeholder="two sentences is plenty, I'll ask the rest"
              className={`${inlineInput} w-full resize-none leading-snug`}
            />
            You can reach me back at{' '}
            <input
              name="email"
              type="email"
              required
              aria-label="Your email address"
              placeholder="you@company.com"
              autoComplete="email"
              className={`${inlineInput} min-w-[13ch]`}
            />
            .
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            <Magnetic strength={0.3}>
              <button
                type="submit"
                disabled={status === 'sending'}
                data-hover
                className="group relative overflow-hidden rounded-full bg-accent px-12 py-5 font-display text-lg font-bold text-ink transition-transform duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-60"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={status === 'sending' ? 'sending' : 'send'}
                    className="block"
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -24, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send it ↗'}
                  </motion.span>
                </AnimatePresence>
              </button>
            </Magnetic>

            {status === 'error' ? (
              <span className="font-mono text-xs uppercase tracking-widest text-red-400">
                Something broke. Email me directly instead?
              </span>
            ) : (
              <span className="font-mono text-10px uppercase tracking-[0.25em] text-muted/60">
                Straight to my inbox · no spam folder purgatory
              </span>
            )}
          </motion.div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

export default function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden px-6 pb-10 pt-28 md:px-10 md:pt-40">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute bottom-[-30%] left-1/2 h-70vmin w-90vmin -translate-x-1/2 rounded-full opacity-15 blur-120px"
        style={{ background: 'radial-gradient(circle, #ccf655 0%, transparent 70%)' }}
      />

      <div className="relative flex flex-col items-center text-center">
        <div className="pointer-events-none absolute -top-10 right-0 md:right-6">
          <RotatingBadge />
        </div>

        <motion.p
          className="font-mono text-xs uppercase tracking-widest text-muted"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Got a project in mind?
        </motion.p>

        <h2 className="mt-6 overflow-hidden font-display text-[10.5vw] font-extrabold uppercase leading-[0.95] tracking-tight md:text-[9vw]">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease: EASE }}
          >
            Let's build
          </motion.span>
        </h2>
        <h2 className="overflow-hidden font-display text-[10.5vw] font-extrabold uppercase leading-[0.95] tracking-tight md:text-[9vw]">
          <motion.span
            className="text-stroke-accent stroke-fill-hover block"
            data-hover
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
          >
            together
          </motion.span>
        </h2>

        <Magnetic strength={0.3} className="mt-12">
          <motion.a
            href={`mailto:${profile.email}`}
            data-hover
            data-cursor-label="Say hi"
            className="inline-block rounded-full border border-paper/25 px-8 py-4 font-display text-base font-bold text-paper transition-colors duration-300 hover:border-accent hover:text-accent md:px-12 md:py-5 md:text-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            {profile.email}
          </motion.a>
        </Magnetic>

        <motion.a
          href={`tel:${profile.phone.replace(/\s/g, '')}`}
          data-hover
          className="mt-6 font-mono text-xs uppercase tracking-widest text-muted transition-colors duration-300 hover:text-accent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          or call {profile.phone}
        </motion.a>
      </div>

      {/* Conversational contact form */}
      <div id="contact-form" className="mx-auto mt-24 w-full max-w-4xl scroll-mt-24 border-t border-line pt-14 md:mt-32 md:pt-20">
        <motion.p
          className="mb-10 font-mono text-xs uppercase tracking-widest text-muted"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Prefer to stay right here? Fill the blanks ↓
        </motion.p>

        <ContactForm />
      </div>

      <div className="mt-24 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          © 2026 {profile.fullName} · <LocalTime />
        </span>

        <ul className="flex gap-6">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                data-hover
                className="group relative font-mono text-xs uppercase tracking-widest text-paper"
              >
                {social.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <span className="max-w-xs font-mono text-10px uppercase leading-relaxed tracking-widest text-muted/60">
          {footerNote}
        </span>
      </div>
    </footer>
  )
}
