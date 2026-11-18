import { Link } from 'react-router'

export default function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-lg bg-gold font-display text-lg font-extrabold text-ink"
      >
        M
      </span>
      <span className="whitespace-nowrap font-display text-base font-extrabold tracking-tight">
        Mustafa <span className="text-gold">English</span>
      </span>
    </Link>
  )
}
