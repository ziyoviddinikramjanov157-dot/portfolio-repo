import Button from '../components/Button.jsx'
import CtaBand from '../components/CtaBand.jsx'
import { Check } from '../components/Icons.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Section from '../components/Section.jsx'

const parts = [
  {
    name: 'Part 1',
    title: 'Tanishuv va savollar',
    time: '4–5 daqiqa',
    text: 'Imtihon oluvchi siz, o‘qishingiz yoki ishingiz va kundalik mavzular haqida savollar beradi.',
  },
  {
    name: 'Part 2',
    title: 'Monolog',
    time: '3–4 daqiqa',
    text: 'Mavzu yozilgan kartochka (cue card) beriladi. Bir daqiqa tayyorlanasiz va ikki daqiqagacha gapirasiz.',
  },
  {
    name: 'Part 3',
    title: 'Muhokama',
    time: '4–5 daqiqa',
    text: 'Part 2 mavzusi bo‘yicha umumiyroq va chuqurroq savollar muhokama qilinadi.',
  },
]

const criteria = [
  {
    en: 'Fluency and Coherence',
    uz: 'Ravonlik va izchillik',
    text: 'To‘xtalib qolmasdan, fikrni mantiqiy bog‘lab gapirish.',
  },
  {
    en: 'Lexical Resource',
    uz: 'So‘z boyligi',
    text: 'Mavzuga mos va xilma-xil so‘zlardan to‘g‘ri foydalanish.',
  },
  {
    en: 'Grammatical Range and Accuracy',
    uz: 'Grammatik xilma-xillik va aniqlik',
    text: 'Turli grammatik tuzilmalarni xatosiz qo‘llash.',
  },
  {
    en: 'Pronunciation',
    uz: 'Talaffuz',
    text: 'Tushunarli, aniq va tabiiy talaffuz.',
  },
]

const prep = [
  'Real imtihon savollari va kartochkalar bilan mashq',
  'Vaqtni nazorat qilgan holda gapirish',
  'Har bir baholash mezoni bo‘yicha alohida izoh',
  'Part 3 savollarida fikrni kengaytirish usullari',
]

export default function Ielts() {
  return (
    <>
      <PageHeader eyebrow="IELTS" title="IELTS Speaking bo‘limiga tizimli tayyorgarlik">
        <p>
          Speaking bo‘limidan 8.0 ball olganman. O‘quvchilarimni ham imtihonga aynan shu tajriba
          asosida tayyorlayman.
        </p>
      </PageHeader>

      <Section
        eyebrow="Imtihon tuzilishi"
        title="Speaking imtihoni qanday o‘tadi"
        intro="Imtihon imtihon oluvchi bilan yuzma-yuz suhbat shaklida o‘tadi va uch qismdan iborat. Umumiy davomiyligi — 11–14 daqiqa."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {parts.map((p, i) => (
            <Reveal
              key={p.name}
              delay={i * 0.08}
              className="flex flex-col rounded-2xl border border-line bg-surface p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-sm font-bold text-gold">{p.name}</span>
                <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
                  {p.time}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <div className="border-y border-line bg-surface/40">
        <Section
          eyebrow="Baholash"
          title="To‘rtta mezon bo‘yicha baholanadi"
          intro="Mezonlarning og‘irligi teng: har biri umumiy ballning 25 foizini tashkil qiladi."
        >
          <div className="grid gap-5 md:grid-cols-2">
            {criteria.map((c, i) => (
              <Reveal
                key={c.en}
                delay={(i % 2) * 0.08}
                className="rounded-2xl border border-line bg-ink p-7"
              >
                <p className="text-sm font-semibold text-gold">{c.en}</p>
                <h3 className="mt-2 font-display text-xl font-extrabold">{c.uz}</h3>
                <p className="mt-3 leading-relaxed text-muted">{c.text}</p>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      <Section eyebrow="Tayyorgarlik" title="Darslarda nima qilamiz">
        <Reveal className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <ul className="space-y-4 text-lg">
            {prep.map((item) => (
              <li key={item} className="flex gap-3">
                <Check className="mt-1 size-5 shrink-0 text-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="lg:justify-self-end">
            <Button to="/aloqa" arrow>
              IELTS kursiga yozilish
            </Button>
          </div>
        </Reveal>
      </Section>

      <CtaBand />
    </>
  )
}
