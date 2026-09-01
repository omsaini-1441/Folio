import { marqueeItems } from '../data/portfolio'

export default function Marquee() {
  const row = [...marqueeItems, ...marqueeItems]
  return (
    <div className="relative overflow-hidden border-y border-line bg-ink-2 py-5">
      <div className="animate-marquee flex w-max items-center">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="whitespace-nowrap px-6 font-display text-2xl font-bold uppercase tracking-tight text-paper md:text-4xl">
              {item}
            </span>
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
