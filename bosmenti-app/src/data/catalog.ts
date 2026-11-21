import type { ArtType } from '../lib/art'

/* Demo catalogue. Replace with data from the shop's backend later. */

export type CatId = 'koylak' | 'futbolka' | 'shim' | 'jinsi' | 'sviter' | 'kurtka' | 'kostyum' | 'ichki' | 'doppi' | 'oyoq' | 'aksessuar'
export type SizeKey = 'top' | 'pants' | 'doppi' | 'shoes' | 'under' | 'belt' | 'socks'

export interface Category { id: CatId; name: string; type: ArtType; c: string }
export interface Color { n: string; c: string }
export interface Product {
  id: string
  cat: CatId
  name: string
  price: number
  old: number
  imgs: string[]
  type: ArtType
  colors: Color[]
  sz: SizeKey
  mat: string
  made: string
  tag: string
  rating: number
  rev: number
  desc: string
  acc?: string
  tint: string
}

export const CATS: Category[] = [
  { id: 'koylak', name: 'Ko‘ylaklar', type: 'shirt', c: '#F4F4F0' },
  { id: 'futbolka', name: 'Futbolkalar', type: 'tee', c: '#22304A' },
  { id: 'shim', name: 'Shimlar', type: 'pants', c: '#3A3D41' },
  { id: 'jinsi', name: 'Jinsilar', type: 'pants', c: '#3D5B86' },
  { id: 'sviter', name: 'Sviterlar', type: 'thermal', c: '#8C7A62' },
  { id: 'kurtka', name: 'Kurtkalar', type: 'thermal', c: '#1F2124' },
  { id: 'kostyum', name: 'Kostyumlar', type: 'shirt', c: '#22304A' },
  { id: 'ichki', name: 'Ichki kiyimlar', type: 'briefs', c: '#8E9196' },
  { id: 'doppi', name: 'Do‘ppilar', type: 'doppi', c: '#17191B' },
  { id: 'oyoq', name: 'Poyabzal', type: 'shoes', c: '#5E3D28' },
  { id: 'aksessuar', name: 'Aksessuarlar', type: 'belt', c: '#2A2C30' },
]
export const CN = Object.fromEntries(CATS.map(c => [c.id, c.name])) as Record<CatId, string>

const COL = {
  oq: ['Oq', '#F4F4F0'], qora: ['Qora', '#222428'], kul: ['Kulrang', '#8E9196'], navy: ['To‘q ko‘k', '#22304A'],
  havo: ['Havorang', '#BCD0E4'], qum: ['Qum', '#D8C8A8'], zay: ['Zaytun', '#6E7356'], yashil: ['Yashil', '#244A3A'],
  xaki: ['Xaki', '#A99A72'], jigar: ['Jigarrang', '#5E3D28'], kok: ['Ko‘k', '#3D5B86'], ochkok: ['Och ko‘k', '#86A3C6'],
  komir: ['Ko‘mir', '#3A3D41'], qizil: ['Qizil', '#8E2A2A'], terra: ['Terrakota', '#B4643F'],
} as const
type ColKey = keyof typeof COL

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

export const TINT = ['#E4E7E1', '#E9E3D8', '#DCE3E8', '#E7E0DE', '#E1E6DB', '#EAE6DE']
export const SHIP_FEE = 25000
export const FREE_FROM = 500000

let n = 0
const P = (
  id: string, cat: CatId, name: string, price: number, old: number, imgs: string[], type: ArtType, cols: ColKey[],
  sz: SizeKey, mat: string, made: string, tag: string, rating: number, rev: number, desc: string, acc?: string,
): Product => ({
  id, cat, name, price, old, imgs: imgs.map(f => `img/${f}.jpg`), type,
  colors: cols.map(k => ({ n: COL[k][0], c: COL[k][1] })), sz, mat, made, tag, rating, rev, desc, acc, tint: TINT[n++ % TINT.length],
})

export const PRODUCTS: Product[] = [
  P('oxford', 'koylak', 'Oxford ko‘ylak', 289000, 0, ['p-oxford', 'p-oxford2'], 'shirt', ['havo', 'oq'], 'top', '100% paxta, Oxford to‘qima', 'O‘zbekiston', 'Xit', 4.8, 126, 'Har kun uchun klassik ko‘ylak. Qalin Oxford to‘qima shaklini yo‘qotmaydi, galstuk bilan ham, galstuksiz ham chiroyli turadi.'),
  P('linen', 'koylak', 'Zig‘ir yozgi ko‘ylak', 319000, 0, ['p-linen'], 'shirt', ['oq', 'qum', 'zay'], 'top', '100% zig‘ir', 'Turkiya', 'Yangi', 4.7, 58, 'Yengil zig‘ir matodan. Issiq kunlarda havo o‘tkazadi, yengini shimarib kiyish uchun qulay.'),
  P('white', 'koylak', 'Klassik oq ko‘ylak', 259000, 329000, ['p-white', 'p-oxford2'], 'shirt', ['oq', 'havo'], 'top', '80% paxta, 20% poliester', 'Turkiya', '-21%', 4.6, 203, 'Ofis va tadbirlar uchun. Kam g‘ijimlanadi, kostyum va galstuk bilan yaxshi mos tushadi.'),
  P('tee', 'futbolka', 'Basic futbolka', 129000, 0, ['p-tee', 'p-tee2'], 'tee', ['oq', 'qora', 'zay', 'kul'], 'top', '100% paxta, 180 g/m²', 'O‘zbekiston', 'Xit', 4.9, 341, 'Zich paxtadan oddiy futbolka. Yuvilganda kirishmaydi, yolg‘iz yoki ko‘ylak ostidan kiyiladi.'),
  P('oversize', 'futbolka', 'Oversize futbolka', 169000, 0, ['p-oversize'], 'tee', ['qora', 'oq', 'kul'], 'top', '100% paxta, 220 g/m²', 'O‘zbekiston', 'Yangi', 4.7, 94, 'Keng bichimli qalin futbolka, yoqasi kontrast hoshiyali. Jinsi va krossovka bilan kiyiladi.'),
  P('trousers', 'shim', 'Klassik shim', 349000, 0, ['p-trousers'], 'pants', ['qora', 'komir', 'navy'], 'pants', '70% jun, 30% poliester', 'Turkiya', '', 4.8, 77, 'To‘g‘ri bichimli klassik shim, dazmol chizig‘i bilan. Ko‘ylak va tufli bilan kiyiladi.'),
  P('chino', 'shim', 'Chino shim', 299000, 359000, ['p-chino'], 'pants', ['xaki', 'zay', 'navy'], 'pants', '98% paxta, 2% elastan', 'Turkiya', '-17%', 4.6, 112, 'Har kun uchun qulay chino. Ozgina cho‘ziladi, futbolka va jinsi kurtka bilan mos.'),
  P('jeans', 'jinsi', 'To‘q jinsi', 379000, 0, ['p-jeans', 'p-jeans2'], 'pants', ['navy', 'kok', 'qora'], 'pants', '99% paxta, 1% elastan', 'Turkiya', 'Xit', 4.8, 188, 'Zich to‘q denimdan to‘g‘ri bichimli jinsi. Har qanday ko‘ylak va futbolka bilan kiyiladi.'),
  P('jeans-light', 'jinsi', 'Och jinsi', 349000, 0, ['p-jeans-light'], 'pants', ['ochkok', 'kok'], 'pants', '100% paxta', 'Turkiya', '', 4.5, 63, 'Och rangli klassik jinsi. Yozda oq futbolka bilan yaxshi ko‘rinadi.'),
  P('knit', 'sviter', 'Jun sviter', 459000, 569000, ['p-knit'], 'thermal', ['qum', 'kul', 'yashil'], 'top', '70% jun, 30% akril', 'Turkiya', '-20%', 4.9, 71, 'Yirik to‘qilgan issiq sviter. Ko‘ylak ustidan kiyiladi, kuz va qish uchun.'),
  P('knit2', 'sviter', 'Naqshli sviter', 399000, 499000, ['p-knit2'], 'thermal', ['yashil', 'qum'], 'top', '80% jun, 20% neylon', 'O‘zbekiston', '-20%', 4.6, 45, 'Skandinav naqshli jun sviter. Sovuq kunlar uchun issiq va yumshoq.'),
  P('leather', 'kurtka', 'Charm kurtka', 1290000, 0, ['p-leather', 'p-leather2'], 'thermal', ['qora'], 'top', 'Tabiiy charm, astar: viskoza', 'Turkiya', 'Premium', 4.9, 38, 'Tabiiy charmdan klassik kurtka. Yillar davomida kiyiladi, vaqt o‘tib yanada chiroyli bo‘ladi.'),
  P('bomber', 'kurtka', 'Bomber kurtka', 690000, 860000, ['p-bomber'], 'thermal', ['terra', 'zay', 'qora'], 'top', '100% neylon, sintepon', 'Turkiya', '-20%', 4.7, 90, 'Yengil va issiq bomber. Yoqasi va etagi rezinali, ichida cho‘ntagi bor.'),
  P('denim', 'kurtka', 'Jinsi kurtka', 549000, 0, ['lb-denim'], 'thermal', ['kok'], 'top', '100% paxta denim, vel’vet yoqa', 'Turkiya', 'Yangi', 4.8, 41, 'Vel’vet yoqali klassik jinsi kurtka. Bahor va kuz uchun.'),
  P('suit1', 'kostyum', 'Klassik kostyum', 1890000, 0, ['p-suit', 'lb-walk'], 'shirt', ['navy', 'komir', 'qora'], 'pants', '80% jun, 20% poliester', 'Turkiya', 'Premium', 4.9, 52, 'Ikki tugmali klassik kostyum: pidjak va shim. Ish, uchrashuv va tadbirlar uchun.'),
  P('suit-check', 'kostyum', 'Katak kostyum (uchlik)', 2190000, 0, ['p-suit2'], 'shirt', ['kok', 'komir'], 'pants', '90% jun, 10% kashmir', 'Turkiya', 'Yangi', 4.8, 23, 'Pidjak, jilet va shimdan iborat katak naqshli kostyum. Bayram va muhim uchrashuvlar uchun.'),
  P('suit-black', 'kostyum', 'To‘y kostyumi', 2450000, 0, ['p-black-suit', 'p-tux'], 'shirt', ['qora', 'komir'], 'pants', '90% jun, 10% ipak', 'Turkiya', '', 5.0, 19, 'Bayram va to‘y uchun qora kostyum. Atlas yoqali, oq yoki qora ko‘ylak bilan to‘liq ko‘rinish.'),
  P('briefs', 'ichki', 'Paxta trusik (3 dona)', 99000, 0, [], 'briefs', ['qora', 'kul', 'navy'], 'under', '95% paxta, 5% elastan', 'O‘zbekiston', 'Xit', 4.8, 410, 'Boxer bichimli, yumshoq paxtadan. To‘plamda 3 dona, rezinasi ishqalamaydi.', '#14171A'),
  P('undershirt', 'ichki', 'Ichki futbolka', 69000, 0, ['p-undershirt'], 'tee', ['kul', 'oq', 'qora'], 'under', '100% paxta', 'O‘zbekiston', '', 4.6, 156, 'Ko‘ylak ostidan kiyiladigan yupqa futbolka. Terni shimadi, ko‘ylak ostidan ko‘rinmaydi.'),
  P('thermal', 'ichki', 'Termo ichki kiyim', 149000, 0, [], 'thermal', ['kul', 'qora'], 'under', 'Paxta va akril aralashmasi', 'O‘zbekiston', 'Yangi', 4.7, 88, 'Qish uchun issiqlikni saqlaydigan uzun yengli ichki kiyim.'),
  P('chust', 'doppi', 'Chust do‘ppi', 180000, 0, [], 'doppi', ['qora'], 'doppi', 'Atlas va ipak ip, qo‘l tikuvi', 'O‘zbekiston, Chust', 'Milliy', 5.0, 64, 'Qora fonda oq qalampir naqshli an’anaviy Chust do‘ppisi. Qo‘lda tikilgan, to‘y va bayramlar uchun.'),
  P('iroqi', 'doppi', 'Iroqi do‘ppi', 250000, 0, [], 'iroqi', ['qizil', 'yashil'], 'doppi', 'Ipak ip, iroqi (xoch) tikuv', 'O‘zbekiston, Shahrisabz', 'Milliy', 4.9, 27, 'Mayda xoch tikuvli rangli naqshlar bilan bezatilgan do‘ppi. Har biri qo‘lda tikiladi.'),
  P('shoes', 'oyoq', 'Charm tufli', 690000, 0, ['p-shoes'], 'shoes', ['jigar', 'qora'], 'shoes', 'Tabiiy charm, rezina taglik', 'Turkiya', '', 4.8, 74, 'Bog‘ichli klassik tufli. Kostyum va klassik shim bilan kiyiladi.'),
  P('monk', 'oyoq', 'Monk tufli', 749000, 0, ['p-shoes2'], 'shoes', ['jigar'], 'shoes', 'Tabiiy charm, ikki to‘qali', 'Turkiya', 'Yangi', 4.7, 22, 'Bog‘ichsiz, ikki to‘qali tufli. Kostyum va chino bilan birdek yarashadi.'),
  P('boots', 'oyoq', 'Charm botinka', 890000, 0, ['c-shoes'], 'shoes', ['jigar', 'qora'], 'shoes', 'Tabiiy charm, issiq astar', 'Turkiya', '', 4.8, 47, 'Bog‘ichli baland botinka. Kuz va qish uchun, jinsi va chino bilan kiyiladi.'),
  P('sneakers', 'oyoq', 'Krossovka', 549000, 649000, ['p-sneakers'], 'shoes', ['oq'], 'shoes', 'Sun’iy charm va to‘r, EVA taglik', 'Turkiya', '-15%', 4.7, 132, 'Har kun uchun yengil krossovka. Yumshoq taglik, uzoq yurishga qulay.'),
  P('belt', 'aksessuar', 'Charm kamar', 149000, 0, ['p-belt'], 'belt', ['jigar', 'qora'], 'belt', 'Tabiiy charm, metall to‘qa', 'Turkiya', '', 4.8, 98, 'Klassik charm kamar. Shim va jinsi bilan kiyiladi.'),
  P('socks', 'aksessuar', 'Paypoq to‘plami (5 juft)', 49000, 0, [], 'socks', ['navy'], 'socks', '80% paxta, 20% poliamid', 'O‘zbekiston', 'Xit', 4.7, 260, 'Har kun uchun 5 juft paypoq. Tovoni va uchi mustahkamlangan.', '#C49A52'),
]

export const byId = (id: string | null) => PRODUCTS.find(p => p.id === id)

/** Landing: collection cards → shop category */
export const COLLECTIONS: { t: string; s: string; img: string; cat: CatId }[] = [
  { t: 'Klassika', s: 'Kostyum, ko‘ylak, shim', img: 'c-classic', cat: 'kostyum' },
  { t: 'Kundalik', s: 'Futbolka, jinsi, chino', img: 'c-casual', cat: 'jinsi' },
  { t: 'Kuz-qish', s: 'Kurtka va sviterlar', img: 'c-autumn', cat: 'kurtka' },
  { t: 'Poyabzal', s: 'Tufli, botinka, krossovka', img: 'c-shoes', cat: 'oyoq' },
]
export const NEW_ARRIVALS = ['suit-check', 'leather', 'bomber', 'knit', 'oversize', 'denim', 'monk', 'chino']
