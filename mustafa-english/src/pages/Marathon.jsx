import Button from '../components/Button.jsx'
import CtaBand from '../components/CtaBand.jsx'
import Fill from '../components/Fill.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Section from '../components/Section.jsx'
import Steps from '../components/Steps.jsx'
import { marathonSteps, seasons } from '../data/marathon.js'
import { links } from '../data/site.js'

export default function Marathon() {
  return (
    <>
      <PageHeader eyebrow="Marafon" title="Ko‘proq dars qilish marafoni">
        <p>
          Bitta maqsad — har kuni dars qilish. Marafon mavsumlarga bo‘lingan: har bir mavsum — o‘z
          ustingizda ishlash uchun yangi imkoniyat.
        </p>
      </PageHeader>

      <Section eyebrow="Qanday o‘tadi" title="Uch oddiy qadam">
        <Steps items={marathonSteps} />
      </Section>

      <div className="border-y border-line bg-surface/40">
        <Section eyebrow="Mavsumlar" title="Marafon tarixi">
          <div className="grid gap-5 md:grid-cols-3">
            {seasons.map((s, i) => (
              <Reveal
                key={s.name}
                delay={i * 0.08}
                className={`flex flex-col rounded-2xl border p-7 ${s.upcoming ? 'border-gold/50 bg-gold-soft' : 'border-line bg-ink'}`}
              >
                <span
                  className={`self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${s.upcoming ? 'bg-gold text-ink' : 'border border-line text-muted'}`}
                >
                  {s.upcoming ? 'Tez orada' : 'Yakunlangan'}
                </span>
                <h3 className="mt-6 font-display text-2xl font-extrabold">{s.name}</h3>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-muted">{s.upcoming ? 'Boshlanishi' : 'O‘tkazilgan sana'}</dt>
                    <dd className="mt-1.5 font-semibold">
                      <Fill>{s.dates}</Fill>
                    </dd>
                  </div>
                  {s.participants && (
                    <div>
                      <dt className="text-muted">Ishtirokchilar</dt>
                      <dd className="mt-1.5 font-semibold">
                        <Fill>{s.participants}</Fill>
                      </dd>
                    </div>
                  )}
                </dl>
                {s.upcoming && (
                  <div className="mt-auto pt-7">
                    <p className="mb-4 text-sm text-muted">E’lon Telegram kanalda beriladi.</p>
                    <Button href={links.telegram} size="sm">
                      Kanalga o‘tish
                    </Button>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      <Section eyebrow="Nega marafon" title="Yolg‘iz o‘qish qiyin. Birgalikda — osonroq.">
        <div className="grid gap-8 text-lg leading-relaxed text-muted md:grid-cols-2">
          <Reveal>
            <p>
              Ko‘pchilik o‘qishni boshlaydi, lekin bir-ikki haftadan keyin to‘xtab qoladi. Sababi —
              motivatsiya tez so‘nadi, odat esa hali shakllanmagan bo‘ladi.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              Marafonda siz bir maqsad sari harakat qilayotgan odamlar orasida bo‘lasiz. Belgilangan
              muddat va umumiy ritm intizomni saqlashga yordam beradi — va dars qilish odatga
              aylanadi.
            </p>
          </Reveal>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}
