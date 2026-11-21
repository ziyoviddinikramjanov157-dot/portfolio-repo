/** 1890000 -> "1 890 000 so‘m" */
export const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' so‘m'

/** "901234567" -> "90 123 45 67" */
export const fmtPh = (d: string) =>
  d.replace(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2}).*/, (_m, a, b, c, e) => [a, b, c, e].filter(Boolean).join(' '))

/** Lighten (p > 0) or darken (p < 0) a #rrggbb colour by p percent. */
export function shade(hex: string, p: number) {
  const n = parseInt(hex.slice(1), 16)
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map(v =>
    Math.max(0, Math.min(255, Math.round(p < 0 ? v * (1 + p / 100) : v + (255 - v) * p / 100))),
  )
  return '#' + ((1 << 24) + (ch[0] << 16) + (ch[1] << 8) + ch[2]).toString(16).slice(1)
}

export const reducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** ISO date -> "21.11.2026" in the viewer's time zone */
export const fmtDate = (iso: string) => {
  const d = new Date(iso)
  return [d.getDate(), d.getMonth() + 1, d.getFullYear()].map(x => String(x).padStart(2, '0')).join('.')
}
