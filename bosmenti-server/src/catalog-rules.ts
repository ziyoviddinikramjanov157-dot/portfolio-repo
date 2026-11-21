export const ART_TYPES = ['tee', 'shirt', 'pants', 'shoes', 'belt', 'thermal', 'briefs', 'doppi', 'iroqi', 'socks'] as const
export type ArtType = (typeof ART_TYPES)[number]

export const SIZE_KEYS = ['top', 'pants', 'doppi', 'shoes', 'under', 'belt', 'socks'] as const
export type SizeKey = (typeof SIZE_KEYS)[number]

export const SIZES: Record<SizeKey, string[]> = {
  top: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
  pants: ['46', '48', '50', '52', '54', '56'],
  doppi: ['56', '57', '58', '59', '60'],
  shoes: ['39', '40', '41', '42', '43', '44', '45'],
  under: ['S', 'M', 'L', 'XL', 'XXL'],
  belt: ['105', '115', '125'],
  socks: ['39–42', '43–46'],
}

export const GUIDE: Record<SizeKey, { h: string[]; r: string[][] }> = {
  top: { h: ['O‘lcham', 'Ko‘krak, sm', 'Bel, sm'], r: [['S', '88–92', '76–80'], ['M', '96–100', '82–86'], ['L', '104–108', '88–92'], ['XL', '112–116', '94–98'], ['XXL', '120–124', '100–104'], ['3XL', '128–132', '106–110']] },
  pants: { h: ['O‘lcham', 'Bel, sm', 'Son, sm'], r: [['46', '76–79', '94–97'], ['48', '80–83', '98–101'], ['50', '84–87', '102–105'], ['52', '88–91', '106–109'], ['54', '92–95', '110–113'], ['56', '96–99', '114–117']] },
  doppi: { h: ['O‘lcham', 'Bosh aylanasi, sm'], r: [['56', '55,5–56,4'], ['57', '56,5–57,4'], ['58', '57,5–58,4'], ['59', '58,5–59,4'], ['60', '59,5–60,4']] },
  shoes: { h: ['O‘lcham', 'Oyoq uzunligi, sm'], r: [['39', '25,0'], ['40', '25,7'], ['41', '26,3'], ['42', '27,0'], ['43', '27,7'], ['44', '28,3'], ['45', '29,0']] },
  under: { h: ['O‘lcham', 'Bel, sm', 'Son, sm'], r: [['S', '76–80', '90–94'], ['M', '82–86', '96–100'], ['L', '88–92', '102–106'], ['XL', '94–98', '108–112'], ['XXL', '100–104', '114–118']] },
  belt: { h: ['Uzunlik, sm', 'Bel, sm'], r: [['105', '80–90'], ['115', '90–100'], ['125', '100–110']] },
  socks: { h: ['O‘lcham', 'Oyoq kiyim o‘lchami'], r: [['39–42', '39–42'], ['43–46', '43–46']] },
}

export const ORDER_STATUSES = ['new', 'confirmed', 'shipping', 'done', 'cancelled'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

/** Product images are either shipped with the shop frontend (img/…) or uploaded through the admin panel (/uploads/…). */
export const isAllowedImage = (u: string) => /^(img\/[\w.-]+|\/uploads\/[\w.-]+)$/.test(u)
