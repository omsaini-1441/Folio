import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import Magnetic from './Magnetic'
import { profile, footerNote, contactFormAccessKey } from '../data/portfolio'

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

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')

    if (!contactFormAccessKey) {
      // No API key configured yet: open the visitor's mail app pre-filled.
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`)
      const body = encodeURIComponent(`${message}\n\n${name}\n${email}`)
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: contactFormAccessKey,
          subject: `Portfolio inquiry from ${name}`,
          name,
          email,
          message,
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

  if (status === 'sent') {
    return (
      <motion.div
        className="flex flex-col items-center gap-3 py-16 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="font-display text-3xl font-bold text-accent">Message sent.</span>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          I read everything. You'll hear back soon.
        </p>
      </motion.div>
    )
  }

  const inputClass =
    'w-full border-b border-line bg-transparent py-3 text-paper outline-none transition-colors duration-300 placeholder:text-muted/50 focus:border-accent'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted" htmlFor="cf-name">
            01 · Your name
          </label>
          <input id="cf-name" name="name" required placeholder="John Carmack" className={inputClass} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted" htmlFor="cf-email">
            02 · Your email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            placeholder="john@id.software"
            className={inputClass}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <label className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted" htmlFor="cf-message">
          03 · The message
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={4}
          placeholder="Tell me about the project, the problem, or the opportunity..."
          className={`${inputClass} resize-none`}
        />
      </motion.div>

      <motion.div
        className="flex items-center gap-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <Magnetic strength={0.3}>
          <button
            type="submit"
            disabled={status === 'sending'}
            data-hover
            className="rounded-full border border-accent px-10 py-4 font-display text-base font-bold text-accent transition-all duration-300 hover:bg-accent hover:text-ink disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending...' : 'Send it ↗'}
          </button>
        </Magnetic>
        {status === 'error' && (
          <span className="font-mono text-xs uppercase tracking-widest text-red-400">
            Something broke. Try emailing me directly instead.
          </span>
        )}
      </motion.div>
    </form>
  )
}

export default function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden px-6 pb-10 pt-28 md:px-10 md:pt-40">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[70vmin] w-[90vmin] -translate-x-1/2 rounded-full opacity-15 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #ccf655 0%, transparent 70%)' }}
      />

      <div className="flex flex-col items-center text-center">
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
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Let's build
          </motion.span>
        </h2>
        <h2 className="overflow-hidden font-display text-[10.5vw] font-extrabold uppercase leading-[0.95] tracking-tight md:text-[9vw]">
          <motion.span
            className="text-stroke-accent block"
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            together
          </motion.span>
        </h2>

        <Magnetic strength={0.3} className="mt-12">
          <motion.a
            href={`mailto:${profile.email}`}
            data-hover
            data-cursor-label="Say hi"
            className="inline-block rounded-full bg-accent px-8 py-4 font-display text-base font-bold text-ink transition-transform duration-300 hover:scale-105 md:px-14 md:py-6 md:text-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
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

      {/* Contact form */}
      <div className="mx-auto mt-24 grid w-full max-w-5xl gap-10 border-t border-line pt-14 md:mt-32 md:grid-cols-[1fr_2fr] md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-paper md:text-3xl">
            Or drop it here
          </h3>
          <p className="mt-3 max-w-xs leading-relaxed text-muted">
            Straight to my inbox. No forms-into-the-void energy, I actually reply.
          </p>
        </motion.div>

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

        <span className="max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-widest text-muted/60">
          {footerNote}
        </span>
      </div>
    </footer>
  )
}
