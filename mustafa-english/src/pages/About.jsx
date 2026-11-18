import CtaBand from '../components/CtaBand.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Portrait from '../components/Portrait.jsx'
import Reveal from '../components/Reveal.jsx'
import Section from '../components/Section.jsx'
import { links, travels } from '../data/site.js'

const facts = [
  { label: 'IELTS Speaking', value: '8.0' },
  { label: 'Instagram', value: `556K obunachi · ${links.instagramHandle}` },
  { label: 'Telegram', value: links.telegramHandle },
  { label: 'Darslar formati', value: 'Online' },
  { label: 'Sayohatlar', value: travels.join(', ') },
]

const values = [
  {
    title: 'Intizom',
    text: 'Har kuni oz bo‘lsa ham, lekin har kuni. Buni o‘zimdan ham, o‘quvchilarimdan ham talab qilaman.',
  },
  {
    title: 'Amaliyot',
    text: 'Til — bu ko‘nikma. U faqat o‘qish orqali emas, gapirish orqali o‘rganiladi.',
  },
  {
    title: 'Mas’uliyat',
    text: 'O‘quvchining natijasi — mening ham natijam. Shuning uchun har bir qadamiga e’tibor beraman.',
  },
]

export default function About() {
  return (
    <>
      <PageHeader eyebrow="Men haqimda" title="Mustafa Kambarov">
        <p>
          Ingliz tili o‘qituvchisi, IELTS Speaking — 8.0. Instagramda 556 mingdan ortiq kishi intizom
          va ingliz tili haqidagi videolarimni kuzatib boradi.
        </p>
      </PageHeader>

      <Section>
        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="mx-auto w-full max-w-sm lg:sticky lg:top-24 lg:max-w-none">
            <Portrait />
          </Reveal>
          <div>
            <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
              <p className="font-display text-2xl font-bold leading-snug tracking-tight text-fg sm:text-3xl">
                Ko‘pchilik ingliz tilini yillab o‘rganadi, lekin baribir gapira olmaydi.
              </p>
              <p>
                Sababi bilim yetishmasligida emas — amaliyot va intizom yetishmasligida. Qoidalarni
                bilish bilan ularni jonli suhbatda ishlata olish o‘rtasida katta farq bor.
              </p>
              <p>
                Darslarimni aynan shu muammoni hal qilish uchun qurganman: kam nazariya, ko‘p amaliyot
                va har kungi nazorat. Instagramdagi videolarimda ham asosiy mavzu shu — intizom.
              </p>
              <p>
                Ingliz tili men uchun dunyoga ochilgan eshik. U bilan sayohat qilaman, turli
                davlatlardagi odamlar bilan muloqot qilaman va o‘z ustimda ishlashda davom etaman.
              </p>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-display text-xl font-extrabold">Qisqacha</h2>
              <dl className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <dt className="text-sm text-muted">{f.label}</dt>
                    <dd className="font-semibold sm:text-right">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Section>

      <div className="border-t border-line">
        <Section eyebrow="Qadriyatlar" title="Men nimaga tayanaman">
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 0.08}
                className="rounded-2xl border border-line bg-surface p-7"
              >
                <h3 className="font-display text-xl font-extrabold text-gold">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      <CtaBand />
    </>
  )
}
