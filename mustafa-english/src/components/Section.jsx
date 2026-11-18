import Reveal from './Reveal.jsx'

export default function Section({ eyebrow, title, intro, className = '', children }) {
  return (
    <section className={`mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24 ${className}`}>
      {(eyebrow || title) && (
        <Reveal className="mb-10 max-w-3xl sm:mb-14">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">{eyebrow}</p>
          )}
          {title && (
            <h2 className="mt-3 text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {title}
            </h2>
          )}
          {intro && <p className="mt-5 text-lg leading-relaxed text-muted">{intro}</p>}
        </Reveal>
      )}
      {children}
    </section>
  )
}
