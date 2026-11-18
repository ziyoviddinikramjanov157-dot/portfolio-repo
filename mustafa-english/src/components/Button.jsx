import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight } from './Icons.jsx'

const variants = {
  primary: 'bg-gold text-ink hover:bg-[#ecc068]',
  secondary: 'border border-line text-fg hover:border-white/25 hover:bg-white/5',
}

const sizes = {
  md: 'min-h-12 px-6 text-[15px]',
  sm: 'min-h-11 px-5 text-sm',
}

export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  arrow = false,
  className = '',
  children,
  ...rest
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
        <ArrowUpRight className="size-4" />
        <span className="sr-only"> (yangi oynada ochiladi)</span>
      </a>
    )
  }

  return (
    <Link to={to} className={classes} {...rest}>
      {children}
      {arrow && <ArrowRight className="size-4" />}
    </Link>
  )
}
