import CtaBand from '../components/CtaBand.jsx'
import { ArrowUpRight, Instagram, Telegram } from '../components/Icons.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Section from '../components/Section.jsx'
import { links } from '../data/site.js'

const channels = [
  {
    name: 'Instagram',
    handle: links.instagramHandle,
    href: links.instagram,
    Icon: Instagram,
    text: 'Intizom va ingliz tili haqida qisqa videolar (reels). 556 mingdan ortiq obunachi.',
  },
  {
    name: 'Telegram',
    handle: links.telegramHandle,
    href: links.telegram,
    Icon: Telegram,
    text: 'Bepul darslar, foydali materiallar va kurslar haqidagi e’lonlar.',
  },
]

const topics = [
  {
    title: 'Intizom va motivatsiya',
    text: 'Har kuni o‘qish odatini qanday shakllantirish va uni saqlab qolish.',
  },
  {
    title: 'Speaking bo‘yicha maslahatlar',
    text: 'Erkinroq gapirish uchun amaliy usullar va ko‘p uchraydigan xatolar.',
  },
  {
    title: 'IELTS savollari',
    text: 'Speaking savollariga yondashuvlar va namunaviy javoblar tahlili.',
  },
  {
    title: 'Kundalik iboralar',
    text: 'Jonli suhbatda kerak bo‘ladigan foydali so‘z va iboralar.',
  },
]

export default function FreeContent() {
  return (
    <>
      <PageHeader eyebrow="Bepul darslar" title="O‘rganishni bugun bepul boshlang">
        <p>
          Instagram va Telegramda muntazam ravishda bepul darslar, maslahatlar va intizom haqidagi
          videolarni joylab boraman.
        </p>
      </PageHeader>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {channels.map(({ name, handle, href, Icon, text }, i) => (
            <Reveal key={name} delay={i * 0.08}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-7 transition-colors hover:border-gold/40 sm:p-9"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gold-soft text-gold">
                    <Icon className="size-6" />
                  </span>
                  <ArrowUpRight className="size-5 text-muted transition-colors group-hover:text-gold" />
                </div>
                <h2 className="mt-8 font-display text-3xl font-extrabold tracking-tight">{name}</h2>
                <p className="mt-1 font-semibold text-gold">{handle}</p>
                <p className="mt-4 leading-relaxed text-muted">{text}</p>
                <span className="sr-only"> (yangi oynada ochiladi)</span>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      <div className="border-y border-line bg-surface/40">
        <Section eyebrow="Mavzular" title="Nimalar haqida gaplashamiz">
          <div className="grid gap-5 sm:grid-cols-2">
            {topics.map((t, i) => (
              <Reveal
                key={t.title}
                delay={(i % 2) * 0.08}
                className="rounded-2xl border border-line bg-ink p-7"
              >
                <h3 className="font-display text-xl font-extrabold">{t.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{t.text}</p>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      <div className="pt-16 sm:pt-24">
        <CtaBand />
      </div>
    </>
  )
}
