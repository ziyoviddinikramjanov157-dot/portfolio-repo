import { Link } from 'react-router'
import { links, pages } from '../data/site.js'
import { Instagram, Telegram } from './Icons.jsx'
import Logo from './Logo.jsx'

const official = [
  { href: links.instagram, label: links.instagramHandle, Icon: Instagram },
  { href: links.telegram, label: links.telegramHandle, Icon: Telegram },
]

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_1fr_0.8fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 leading-relaxed text-muted">
            Ingliz tilida erkin gapirish intizomdan boshlanadi. Online Speaking kurslari va IELTS
            Speaking tayyorgarligi.
          </p>
        </div>

        <nav aria-label="Sahifalar">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Sahifalar</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6">
            {pages.map((p) => (
              <li key={p.to}>
                <Link
                  to={p.to}
                  className="inline-flex min-h-11 items-center text-fg/90 transition-colors hover:text-gold"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Rasmiy sahifalar
          </h2>
          <ul className="mt-4">
            {official.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-3 text-fg/90 transition-colors hover:text-gold"
                >
                  <Icon className="size-5" />
                  {label}
                  <span className="sr-only"> (yangi oynada ochiladi)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Mustafa Kambarov</p>
          <p>To‘lovni faqat rasmiy sahifalar orqali qiling.</p>
        </div>
      </div>
    </footer>
  )
}
