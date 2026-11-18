import Reveal from './Reveal.jsx'

export default function PageHeader({ eyebrow, title, children }) {
  return (
    <section className="border-b border-line">
      <title>{`${eyebrow} — Mustafa English`}</title>
      <div className="mx-auto max-w-6xl px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {children && (
            <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{children}</div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
