import CtaBand from '../components/CtaBand.jsx'
import { Check, Close } from '../components/Icons.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import Section from '../components/Section.jsx'
import Steps from '../components/Steps.jsx'

const principles = [
  {
    title: 'Har kungi amaliyot',
    text: 'Speaking — bu ko‘nikma. U kitob o‘qish bilan emas, muntazam gapirish bilan rivojlanadi. Kuniga oz, lekin har kuni.',
  },
  {
    title: 'Qoidadan oldin nutq',
    text: 'Grammatikani alohida yodlamaymiz — uni gapning ichida, kerakli joyda o‘rganamiz. Darsda asosan siz gapirasiz.',
  },
  {
    title: 'Intizom va nazorat',
    text: 'Vazifalar va muddatlar bor. Bajarilmagan vazifa e’tiborsiz qolmaydi, chunki intizom — o‘sishning asosi.',
  },
  {
    title: 'Aniq izoh',
    text: 'Har bir javobingizdan so‘ng nima yaxshi chiqqani va nimani tuzatish kerakligini aniq bilib olasiz.',
  },
  {
    title: 'Hayotiy vaziyatlar',
    text: 'Imtihon, ish suhbati, sayohat — mashqlar real hayotda kerak bo‘ladigan vaziyatlarga asoslanadi.',
  },
]

const steps = [
  { title: 'Kursga yozilasiz', text: 'Telegram orqali yozasiz va o‘zingizga mos kursni tanlaysiz.' },
  { title: 'Har kuni mashq qilasiz', text: 'Belgilangan vazifalarni bajarasiz va har kuni gapirasiz.' },
  { title: 'Izoh olasiz', text: 'Xatolaringizni bilib olasiz va ularni birma-bir tuzatasiz.' },
  {
    title: 'Natijani ko‘rasiz',
    text: 'Vaqt o‘tib, oldingi o‘zingiz bilan solishtirsangiz, o‘sishingiz aniq ko‘rinadi.',
  },
]

const fit = [
  'Har kuni o‘qishga vaqt ajratishga tayyor bo‘lsangiz',
  'Xato qilishdan qo‘rqmay gapirishni xohlasangiz',
  'Aniq maqsadingiz bo‘lsa: imtihon, ish yoki o‘qish',
]

const notFit = [
  'Harakat qilmasdan tez natija kutsangiz',
  'Vazifalarni muntazam bajarishga tayyor bo‘lmasangiz',
  'Faqat grammatika nazariyasini o‘rganmoqchi bo‘lsangiz',
]

export default function Method() {
  return (
    <>
      <PageHeader eyebrow="Metodika" title="Natija tasodif emas — tizim">
        <p>
          Darslarim grammatikani yodlashdan emas, har kuni gapirishdan boshlanadi. Quyidagi besh
          tamoyil — shu tizimning asosi.
        </p>
      </PageHeader>

      <Section>
        <ol className="divide-y divide-line border-y border-line">
          {principles.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              className="grid gap-3 py-8 sm:grid-cols-[5rem_1fr_1.4fr] sm:items-baseline sm:gap-8"
            >
              <span className="font-display text-sm font-bold text-gold">0{i + 1}</span>
              <h2 className="font-display text-2xl font-extrabold tracking-tight">{p.title}</h2>
              <p className="leading-relaxed text-muted">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <div className="border-y border-line bg-surface/40">
        <Section eyebrow="Jarayon" title="O‘qish qanday kechadi">
          <Steps items={steps} className="md:grid-cols-2 lg:grid-cols-4" />
        </Section>
      </div>

      <Section eyebrow="Kimlar uchun" title="Bu yondashuv hammaga ham mos emas">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-gold/40 bg-gold-soft p-7 sm:p-9">
            <h3 className="font-display text-xl font-extrabold">Sizga mos, agar:</h3>
            <ul className="mt-6 space-y-4">
              {fit.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="rounded-2xl border border-line bg-surface p-7 sm:p-9">
            <h3 className="font-display text-xl font-extrabold">Mos emas, agar:</h3>
            <ul className="mt-6 space-y-4">
              {notFit.map((item) => (
                <li key={item} className="flex gap-3 text-muted">
                  <Close className="mt-0.5 size-5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}
