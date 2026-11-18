import Button from '../components/Button.jsx'
import { ArrowUpRight, Instagram, Telegram } from '../components/Icons.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Section from '../components/Section.jsx'
import Steps from '../components/Steps.jsx'
import { enrollSteps } from '../data/courses.js'
import { links } from '../data/site.js'

const official = [
  { name: 'Telegram kanal', handle: links.telegramHandle, href: links.telegram, Icon: Telegram },
  { name: 'Instagram', handle: links.instagramHandle, href: links.instagram, Icon: Instagram },
]

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Aloqa" title="Kursga yozilish">
        <p>
          Yozilish oddiy: Telegram orqali yozasiz, kursni tanlaysiz, to‘lovni karta orqali qilasiz va
          darslarni boshlaysiz.
        </p>
      </PageHeader>

      <Section eyebrow="Bosqichlar" title="To‘rt qadamda yoziling">
        <Steps items={enrollSteps} className="md:grid-cols-2 lg:grid-cols-4" />
        <Reveal className="mt-10 flex flex-col gap-6 rounded-3xl border border-gold/40 bg-gold-soft p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Birinchi qadam — Telegram
            </h2>
            <p className="mt-2 text-muted">Yozing — qolgan barcha ma’lumotni o‘sha yerda olasiz.</p>
          </div>
          <Button href={links.enroll} className="shrink-0">
            Telegram orqali yozilish
          </Button>
        </Reveal>
      </Section>

      <div className="border-t border-line">
        <Section eyebrow="Rasmiy sahifalar" title="Faqat shu sahifalar orqali bog‘laning">
          <div className="grid gap-5 md:grid-cols-2">
            {official.map(({ name, handle, href, Icon }, i) => (
              <Reveal key={name} delay={i * 0.08}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-gold/40"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold-soft text-gold">
                    <Icon className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-extrabold">{name}</span>
                    <span className="block truncate text-muted">{handle}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-muted transition-colors group-hover:text-gold" />
                  <span className="sr-only"> (yangi oynada ochiladi)</span>
                </a>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 rounded-2xl border border-line p-6 text-muted">
            <p>
              <span className="font-semibold text-fg">Xavfsizlik uchun:</span> to‘lovni faqat rasmiy
              Telegram orqali berilgan ma’lumotlarga qiling. Boshqa sahifalar yoki shaxslarga to‘lov
              qilmang.
            </p>
          </Reveal>
        </Section>
      </div>
    </>
  )
}
