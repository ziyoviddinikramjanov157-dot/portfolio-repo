const isPlaceholder = (value) => typeof value === 'string' && /^\[.*\]$/.test(value)

export default function Fill({ children }) {
  if (!isPlaceholder(children)) return children

  return (
    <span className="rounded-md border border-dashed border-gold/60 px-1.5 py-0.5 text-gold">
      {children}
    </span>
  )
}
