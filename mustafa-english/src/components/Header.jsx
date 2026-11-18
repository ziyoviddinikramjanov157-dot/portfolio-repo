import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { pages } from '../data/site.js'
import Button from './Button.jsx'
import { Close, Menu } from './Icons.jsx'
import Logo from './Logo.jsx'

const primary = pages.filter((p) => p.primary)

export default function Header() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo onClick={close} />

        <nav aria-label="Asosiy menyu" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {primary.map((p) => (
              <li key={p.to}>
                <NavLink
                  to={p.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${isActive ? 'text-gold' : 'text-muted hover:text-fg'}`
                  }
                >
                  {p.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Button to="/aloqa" size="sm">
              Kursga yozilish
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Menyuni yopish' : 'Menyuni ochish'}
            className="grid size-11 place-items-center rounded-full border border-line text-fg transition-colors hover:bg-white/5 lg:hidden"
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobil menyu"
          className="max-h-[calc(100dvh_-_4rem)] overflow-y-auto border-t border-line bg-ink lg:hidden"
        >
          <ul className="mx-auto grid max-w-6xl gap-1 px-5 py-5 sm:px-8">
            {pages.map((p) => (
              <li key={p.to}>
                <NavLink
                  to={p.to}
                  end={p.to === '/'}
                  onClick={close}
                  className={({ isActive }) =>
                    `flex min-h-12 items-center rounded-xl px-4 font-display text-lg font-bold transition-colors ${isActive ? 'bg-gold-soft text-gold' : 'text-fg hover:bg-white/5'}`
                  }
                >
                  {p.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-4">
              <Button to="/aloqa" onClick={close} className="w-full">
                Kursga yozilish
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
