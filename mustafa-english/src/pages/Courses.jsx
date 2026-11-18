import Button from '../components/Button.jsx'
import CtaBand from '../components/CtaBand.jsx'
import Fill from '../components/Fill.jsx'
import { Check } from '../components/Icons.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Section from '../components/Section.jsx'
import Steps from '../components/Steps.jsx'
import { courses, enrollSteps } from '../data/courses.js'

export default function Courses() {
  return (
    <>
      <PageHeader eyebrow="Speaking kurslari" title="Gapirishni o‘rganish uchun kurslar">
        <p>
          Barcha kurslar online o‘tadi: istalgan joydan qatnashasiz. Telefon yoki kompyuter va
          internet kifoya.
        </p>
      </PageHeader>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {courses.map((c, i) => (
            <Reveal
              key={c.title}
              delay={i * 0.08}
              className="flex flex-col rounded-3xl border border-line bg-surface p-7 sm:p-9"
            >
              <h2 className="font-display text-3xl font-extrabold tracking-tight">{c.title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{c.summary}</p>
              <ul className="mt-7 space-y-3">
                {c.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-gold" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6">
                <div>
                  <dt className="text-sm text-muted">Davomiyligi</dt>
                  <dd className="mt-2 font-semibold">
                    <Fill>{c.duration}</Fill>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted">Narxi</dt>
                  <dd className="mt-2 font-semibold">
                    <Fill>{c.price}</Fill>
                  </dd>
                </div>
              </dl>
              <div className="mt-auto pt-8">
                <Button to="/aloqa" arrow className="w-full sm:w-auto">
                  Kursga yozilish
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <div className="border-y border-line bg-surface/40">
        <Section eyebrow="Yozilish" title="Kursga qanday yoziladi">
          <Steps items={enrollSteps} className="md:grid-cols-2 lg:grid-cols-4" />
        </Section>
      </div>

      <div className="pt-16 sm:pt-24">
        <CtaBand />
      </div>
    </>
  )
}
