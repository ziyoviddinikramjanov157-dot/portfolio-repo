import Reveal from './Reveal.jsx'

export default function Steps({ items, className = 'md:grid-cols-3' }) {
  return (
    <ol className={`grid gap-5 ${className}`}>
      {items.map((s, i) => (
        <Reveal
          as="li"
          key={s.title}
          delay={i * 0.08}
          className="rounded-2xl border border-line bg-surface p-7"
        >
          <span className="grid size-10 place-items-center rounded-full bg-gold-soft font-display font-extrabold text-gold">
            {i + 1}
          </span>
          <h3 className="mt-6 font-display text-xl font-extrabold">{s.title}</h3>
          <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
        </Reveal>
      ))}
    </ol>
  )
}
