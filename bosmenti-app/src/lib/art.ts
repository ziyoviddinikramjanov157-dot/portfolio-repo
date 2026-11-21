import { shade } from './util'

export type ArtType = 'tee' | 'shirt' | 'pants' | 'shoes' | 'belt' | 'thermal' | 'briefs' | 'doppi' | 'iroqi' | 'socks'

/**
 * Flat SVG drawings of garments (inner markup for a 200×200 viewBox).
 * Used only for products that do not have a real photo yet.
 */
export function artInner(t: ArtType, c: string, a = '#7A2430'): string {
  const d = shade(c, -18), dd = shade(c, -42), BR = '#C49A52'
  const L = 'rgba(0,0,0,.17)', o = ' stroke="rgba(0,0,0,.14)" stroke-width="1.6" stroke-linejoin="round"'
  const LS = 'M70 34 L48 42 L30 78 L20 152 L42 156 L56 98 L58 174 L142 174 L144 98 L158 156 L180 152 L170 78 L152 42 L130 34 Q100 50 70 34 Z'
  const TEE = 'M70 34 L46 42 L20 72 L38 96 L58 82 L58 174 L142 174 L142 82 L162 96 L180 72 L154 42 L130 34 Q100 52 70 34 Z'
  const gs = (y: number) => `<ellipse cx="100" cy="${y}" rx="64" ry="6" fill="rgba(0,0,0,.08)"/>`
  const ln = (dp: string, w = 1.8, col = L, extra = '') =>
    `<path d="${dp}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`

  switch (t) {
    case 'tee':
      return gs(186) + `<path d="${TEE}" fill="${c}"${o}/>` + ln('M70 34 Q100 52 130 34', 5, d) + ln('M25 77 L41 92 M175 77 L159 92', 2)
    case 'shirt':
      return gs(186) + `<path d="${LS}" fill="${c}"${o}/><path d="M86 26 L70 34 L80 60 L100 46 Z M114 26 L130 34 L120 60 L100 46 Z" fill="${shade(c, 12)}"${o}/>` + ln('M100 46 V174', 2)
    case 'pants':
      return gs(186) + `<path d="M60 28 L140 28 L148 176 L112 176 L100 80 L88 176 L52 176 Z" fill="${c}"${o}/><path d="M60 28 L140 28 L141 40 L59 40 Z" fill="${d}"/>`
    case 'shoes':
      return gs(166) + `<path d="M24 146 Q22 122 44 116 L92 104 Q104 98 112 90 L150 86 Q170 86 174 100 L178 146 Z" fill="${c}"${o}/><path d="M20 144 L182 144 L182 152 Q182 160 172 160 L30 160 Q20 160 20 152 Z" fill="${dd}"/>`
    case 'belt':
      return gs(140) + `<path d="M12 88 H186 L196 101 L186 114 H12 Z" fill="${c}"${o}/><rect x="26" y="80" width="40" height="42" rx="8" fill="none" stroke="${BR}" stroke-width="6"/>`
    case 'thermal':
      return gs(186) + `<path d="${LS}" fill="${c}"${o}/>` + ln('M70 34 Q100 52 130 34', 6, d) +
        `<path d="M20 144 L42 148 L42 156 L20 152 Z M180 144 L158 148 L158 156 L180 152 Z" fill="${d}"/><rect x="58" y="164" width="84" height="10" fill="${d}"/>`
    case 'briefs':
      return gs(162) + `<path d="M46 60 L154 60 L158 134 L114 144 L100 112 L86 144 L42 134 Z" fill="${c}"${o}/><path d="M46 60 L154 60 L154 80 L46 80 Z" fill="${a}"/>` +
        `<text x="100" y="74" text-anchor="middle" font-size="9" font-family="Onest,Arial,sans-serif" font-weight="700" letter-spacing="2.4" fill="#fff" opacity=".9">BOSMENTI</text>` +
        ln('M100 80 Q92 96 100 112') + ln('M44 126 L86 136 M156 126 L114 136', 2)
    case 'doppi': {
      const q = (x: number, y: number, r: number, sc: number) =>
        `<path transform="translate(${x} ${y}) rotate(${r}) scale(${sc})" d="M2 -18 C14 -6 12 12 0 16 C-10 12 -10 0 -2 -4 C2 -6 4 -12 2 -18 Z" fill="#F3EFE6"/>`
      return gs(168) + `<path d="M38 150 L46 80 Q100 56 154 80 L162 150 Z" fill="${c}"${o}/>` + ln('M74 68 L68 150 M126 68 L132 150', 1.5, 'rgba(255,255,255,.2)') +
        q(58, 112, -22, 1.05) + q(100, 104, 0, 1.3) + q(142, 112, 22, 1.05) +
        ln('M84 80 Q100 70 116 80 M54 92 Q62 84 70 86 M146 92 Q138 84 130 86', 2, '#F3EFE6') +
        `<path d="M36 136 L164 136 L164 158 Q100 164 36 158 Z" fill="${shade(c, 8)}"${o}/>` +
        ln('M40 142 Q100 147 160 142 M40 151 Q100 156 160 151', 1.3, 'rgba(243,239,230,.6)', 'stroke-dasharray="3 3"')
    }
    case 'iroqi': {
      const cols = ['#E2B13C', '#F3EFE6', '#3E8A63', '#2D3E73', '#D8743A']
      let m = ''
      for (let y = 84, i = 0; y <= 128; y += 11, i++)
        for (let x = 56 + (i % 2) * 6; x <= 144; x += 12)
          m += `<rect x="${x - 3.5}" y="${y - 3.5}" width="7" height="7" transform="rotate(45 ${x} ${y})" fill="${cols[(x + y) % 5]}"/>`
      return gs(168) + `<path d="M38 150 L46 80 Q100 56 154 80 L162 150 Z" fill="${c}"${o}/>` + m +
        `<path d="M36 136 L164 136 L164 158 Q100 164 36 158 Z" fill="${shade(c, -25)}"${o}/>` + ln('M40 147 Q100 152 160 147', 2, '#E2B13C', 'stroke-dasharray="5 4"')
    }
    case 'socks': {
      const sk = (f: string, p: string) =>
        `<path d="M62 26 H98 V112 Q98 140 78 152 L52 164 Q38 168 36 156 Q34 146 46 140 L62 130 Z" fill="${f}"${o}/><rect x="62" y="26" width="36" height="18" fill="${shade(f, -16)}"/>` +
        [68, 74, 80, 86, 92].map(x => ln(`M${x} 28 V42`, 1.2)).join('') +
        `<path d="M52 164 Q38 168 36 156 Q34 146 46 140 L54 154 Z" fill="${p}"/>`
      return gs(178) + `<g transform="translate(46 8)">${sk(a, c)}</g>` + sk(c, a)
    }
  }
}
