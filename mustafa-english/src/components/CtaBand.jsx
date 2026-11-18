import { links } from '../data/site.js'
import Button from './Button.jsx'
import Reveal from './Reveal.jsx'

export default function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <Reveal className="rounded-3xl border border-line bg-surface px-6 py-12 sm:px-12 sm:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-balance font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Har kuni bir qadam. <span className="text-gold">Bugundan boshlang.</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Kursga yozilish uchun Telegram orqali yozing — barcha ma’lumotni o‘sha yerda olasiz.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:shrink-0 lg:flex-nowrap">
            <Button to="/aloqa" arrow>
              Kursga yozilish
            </Button>
            <Button href={links.telegram} variant="secondary">
              Telegram kanal
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
