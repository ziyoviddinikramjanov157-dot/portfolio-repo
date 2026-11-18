import CtaBand from '../components/CtaBand.jsx'
import Fill from '../components/Fill.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Section from '../components/Section.jsx'
import { testimonials } from '../data/testimonials.js'

export default function Results() {
  return (
    <>
      <PageHeader eyebrow="Natijalar" title="O‘quvchilarim natijalari">
        <p>
          Bu sahifada o‘quvchilarning haqiqiy fikrlari va imtihon natijalari joylanadi. Hozircha
          namunaviy matnlar ko‘rsatilgan.
        </p>
      </PageHeader>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal
              as="figure"
              key={t.quote}
              delay={(i % 3) * 0.08}
              className="flex flex-col rounded-2xl border border-line bg-surface p-7"
            >
              <span className="self-start rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
                Namuna
              </span>
              <blockquote className="mt-6 flex-1 text-lg leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-7 border-t border-line pt-5 text-sm text-muted">
                <Fill>{t.name}</Fill> · <Fill>{t.result}</Fill>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  )
}
