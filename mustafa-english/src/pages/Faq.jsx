import CtaBand from '../components/CtaBand.jsx'
import { Plus } from '../components/Icons.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Section from '../components/Section.jsx'
import { faq } from '../data/faq.js'

export default function Faq() {
  return (
    <>
      <PageHeader eyebrow="Savol-javob" title="Ko‘p beriladigan savollar">
        <p>Bu yerda javobini topmagan savolingizni Telegram orqali yozing.</p>
      </PageHeader>

      <Section>
        <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
          {faq.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-bold transition-colors hover:text-gold [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus className="size-5 shrink-0 text-gold transition-transform group-open:rotate-45" />
              </summary>
              <p className="pb-6 pr-10 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  )
}
