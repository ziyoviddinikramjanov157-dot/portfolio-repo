import { Link } from 'react-router'
import Button from '../components/Button.jsx'
import CtaBand from '../components/CtaBand.jsx'
import Fill from '../components/Fill.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import Portrait from '../components/Portrait.jsx'
import Reveal from '../components/Reveal.jsx'
import Section from '../components/Section.jsx'
import { links, stats } from '../data/site.js'
import { testimonials } from '../data/testimonials.js'

const directions = [
  {
    to: '/kurslar',
    title: 'Speaking kurslari',
    text: 'Erkin va to‘g‘ri gapirish uchun muntazam amaliyot va har bir javobga aniq izoh.',
  },
  {
    to: '/ielts',
    title: 'IELTS Speaking',
    text: 'Imtihonning uchala qismiga va baholash mezonlariga tizimli tayyorgarlik.',
  },
  {
    to: '/marafon',
    title: 'Marafon',
    text: 'Ko‘proq dars qilish marafoni: har bir mavsum — o‘z ustingizda ishlashning yangi bosqichi.',
  },
]

const principles = [
  {
    title: 'Intizom',
    text: 'Kuniga oz bo‘lsa ham, lekin har kuni. Natija aynan muntazamlikdan keladi.',
  },
  {
    title: 'Amaliyot',
    text: 'Qoidalarni yodlash emas — ularni gapda ishlatish. Darsda asosan siz gapirasiz.',
  },
  {
    title: 'Izoh',
    text: 'Har bir javobingizdan so‘ng nima yaxshi, nimani tuzatish kerakligini aniq bilasiz.',
  },
]

export default function Home() {
  const sample = testimonials[0]

  return (
    <>
      <title>Mustafa English — Online Speaking kurslari</title>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gold">
              IELTS Speaking 8.0 · Online kurslar
            </p>
            <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Ingliz tilida erkin gapirish <span className="text-gold">intizomdan</span> boshlanadi
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Men Mustafa Kambarov — ingliz tili o‘qituvchisiman. Speaking kurslarim va marafonlarimda
              o‘quvchilarimni har kuni shug‘ullanishga va ingliz tilida ishonch bilan gapirishga
              o‘rgataman.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button to="/aloqa" arrow>
                Kursga yozilish
              </Button>
              <Button to="/kurslar" variant="secondary">
                Kurslarni ko‘rish
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto w-full max-w-sm lg:max-w-none">
            <Portrait />
          </Reveal>
        </div>

        <div className="border-t border-line">
          <dl className="mx-auto grid max-w-6xl divide-y divide-line px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-2 py-7 sm:px-8 sm:first:pl-0">
                <dt className="text-sm text-muted">{s.label}</dt>
                <dd className="font-display text-3xl font-extrabold tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section eyebrow="Yo‘nalishlar" title="Nimani o‘rganasiz">
        <div className="grid gap-5 md:grid-cols-3">
          {directions.map((d, i) => (
            <Reveal key={d.to} delay={i * 0.08}>
              <Link
                to={d.to}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-gold/40"
              >
                <span className="font-display text-sm font-bold text-gold">0{i + 1}</span>
                <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight">{d.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{d.text}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold transition-colors group-hover:text-gold">
                  Batafsil <ArrowRight className="size-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <div className="border-y border-line bg-surface/40">
        <Section
          eyebrow="Yondashuv"
          title="Natija tasodif emas — tizim"
          intro="Darslarim uchta tamoyilga asoslanadi. Ularning hech biri murakkab emas, lekin har biri qat’iyat talab qiladi."
        >
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className="bg-ink p-7">
                <h3 className="font-display text-xl font-extrabold text-gold">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{p.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <Button to="/metodika" variant="secondary" arrow>
              Metodika haqida batafsil
            </Button>
          </div>
        </Section>
      </div>

      <Section eyebrow="Natijalar" title="O‘quvchilar nima deydi">
        <Reveal>
          <figure className="max-w-3xl rounded-2xl border border-line bg-surface p-8 sm:p-10">
            <span className="inline-block rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
              Namuna
            </span>
            <blockquote className="mt-6 font-display text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              “{sample.quote}”
            </blockquote>
            <figcaption className="mt-6 text-muted">
              <Fill>{sample.name}</Fill> · <Fill>{sample.result}</Fill>
            </figcaption>
          </figure>
        </Reveal>
        <div className="mt-10">
          <Button to="/natijalar" variant="secondary" arrow>
            Barcha natijalar
          </Button>
        </div>
      </Section>

      <div className="border-t border-line">
        <Section
          eyebrow="Bepul darslar"
          title="Bugunoq bepul boshlang"
          intro="Instagram va Telegramda muntazam ravishda bepul darslar va intizom haqidagi videolarni joylab boraman."
        >
          <div className="flex flex-wrap gap-3">
            <Button href={links.instagram} variant="secondary">
              Instagram
            </Button>
            <Button href={links.telegram} variant="secondary">
              Telegram kanal
            </Button>
            <Button to="/bepul-darslar" variant="secondary" arrow>
              Barcha bepul darslar
            </Button>
          </div>
        </Section>
      </div>

      <CtaBand />
    </>
  )
}
