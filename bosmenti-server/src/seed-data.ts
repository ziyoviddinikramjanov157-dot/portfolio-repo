import type { ArtType, SizeKey } from './catalog-rules.js'

export interface SeedCategory { id: string; name: string; type: ArtType; c: string }
export interface SeedProduct {
  id: string; cat: string; name: string; price: number; old: number; imgs: string[]; type: ArtType
  colors: { n: string; c: string }[]; sz: SizeKey; mat: string; made: string; tag: string; desc: string
  acc: string | null; isNew: boolean
}

export const CATEGORIES: SeedCategory[] = [
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

const COL = {
  oq: ['Oq', '#F4F4F0'], qora: ['Qora', '#222428'], kul: ['Kulrang', '#8E9196'], navy: ['To‘q ko‘k', '#22304A'],
  havo: ['Havorang', '#BCD0E4'], qum: ['Qum', '#D8C8A8'], zay: ['Zaytun', '#6E7356'], yashil: ['Yashil', '#244A3A'],
  xaki: ['Xaki', '#A99A72'], jigar: ['Jigarrang', '#5E3D28'], kok: ['Ko‘k', '#3D5B86'], ochkok: ['Och ko‘k', '#86A3C6'],
  komir: ['Ko‘mir', '#3A3D41'], qizil: ['Qizil', '#8E2A2A'], terra: ['Terrakota', '#B4643F'],
} as const
type ColKey = keyof typeof COL

const NEW = new Set(['suit-check', 'leather', 'bomber', 'knit', 'oversize', 'denim', 'monk', 'chino'])

const P = (
  id: string, cat: string, name: string, price: number, old: number, imgs: string[], type: ArtType, cols: ColKey[],
  sz: SizeKey, mat: string, made: string, tag: string, desc: string, acc: string | null = null,
): SeedProduct => ({
  id, cat, name, price, old, imgs: imgs.map(f => `img/${f}.jpg`), type,
  colors: cols.map(k => ({ n: COL[k][0], c: COL[k][1] })), sz, mat, made, tag, desc, acc, isNew: NEW.has(id),
})

/** The demo catalogue the shop launched with; the owner edits or replaces it in the admin panel. */
export const PRODUCTS: SeedProduct[] = [
  P('oxford', 'koylak', 'Oxford ko‘ylak', 289000, 0, ['p-oxford', 'p-oxford2'], 'shirt', ['havo', 'oq'], 'top', '100% paxta, Oxford to‘qima', 'O‘zbekiston', 'Xit', 'Har kun uchun klassik ko‘ylak. Qalin Oxford to‘qima shaklini yo‘qotmaydi, galstuk bilan ham, galstuksiz ham chiroyli turadi.'),
  P('linen', 'koylak', 'Zig‘ir yozgi ko‘ylak', 319000, 0, ['p-linen'], 'shirt', ['oq', 'qum', 'zay'], 'top', '100% zig‘ir', 'Turkiya', 'Yangi', 'Yengil zig‘ir matodan. Issiq kunlarda havo o‘tkazadi, yengini shimarib kiyish uchun qulay.'),
  P('white', 'koylak', 'Klassik oq ko‘ylak', 259000, 329000, ['p-white', 'p-oxford2'], 'shirt', ['oq', 'havo'], 'top', '80% paxta, 20% poliester', 'Turkiya', '-21%', 'Ofis va tadbirlar uchun. Kam g‘ijimlanadi, kostyum va galstuk bilan yaxshi mos tushadi.'),
  P('tee', 'futbolka', 'Basic futbolka', 129000, 0, ['p-tee', 'p-tee2'], 'tee', ['oq', 'qora', 'zay', 'kul'], 'top', '100% paxta, 180 g/m²', 'O‘zbekiston', 'Xit', 'Zich paxtadan oddiy futbolka. Yuvilganda kirishmaydi, yolg‘iz yoki ko‘ylak ostidan kiyiladi.'),
  P('oversize', 'futbolka', 'Oversize futbolka', 169000, 0, ['p-oversize'], 'tee', ['qora', 'oq', 'kul'], 'top', '100% paxta, 220 g/m²', 'O‘zbekiston', 'Yangi', 'Keng bichimli qalin futbolka, yoqasi kontrast hoshiyali. Jinsi va krossovka bilan kiyiladi.'),
  P('trousers', 'shim', 'Klassik shim', 349000, 0, ['p-trousers'], 'pants', ['qora', 'komir', 'navy'], 'pants', '70% jun, 30% poliester', 'Turkiya', '', 'To‘g‘ri bichimli klassik shim, dazmol chizig‘i bilan. Ko‘ylak va tufli bilan kiyiladi.'),
  P('chino', 'shim', 'Chino shim', 299000, 359000, ['p-chino'], 'pants', ['xaki', 'zay', 'navy'], 'pants', '98% paxta, 2% elastan', 'Turkiya', '-17%', 'Har kun uchun qulay chino. Ozgina cho‘ziladi, futbolka va jinsi kurtka bilan mos.'),
  P('jeans', 'jinsi', 'To‘q jinsi', 379000, 0, ['p-jeans', 'p-jeans2'], 'pants', ['navy', 'kok', 'qora'], 'pants', '99% paxta, 1% elastan', 'Turkiya', 'Xit', 'Zich to‘q denimdan to‘g‘ri bichimli jinsi. Har qanday ko‘ylak va futbolka bilan kiyiladi.'),
  P('jeans-light', 'jinsi', 'Och jinsi', 349000, 0, ['p-jeans-light'], 'pants', ['ochkok', 'kok'], 'pants', '100% paxta', 'Turkiya', '', 'Och rangli klassik jinsi. Yozda oq futbolka bilan yaxshi ko‘rinadi.'),
  P('knit', 'sviter', 'Jun sviter', 459000, 569000, ['p-knit'], 'thermal', ['qum', 'kul', 'yashil'], 'top', '70% jun, 30% akril', 'Turkiya', '-20%', 'Yirik to‘qilgan issiq sviter. Ko‘ylak ustidan kiyiladi, kuz va qish uchun.'),
  P('knit2', 'sviter', 'Naqshli sviter', 399000, 499000, ['p-knit2'], 'thermal', ['yashil', 'qum'], 'top', '80% jun, 20% neylon', 'O‘zbekiston', '-20%', 'Skandinav naqshli jun sviter. Sovuq kunlar uchun issiq va yumshoq.'),
  P('leather', 'kurtka', 'Charm kurtka', 1290000, 0, ['p-leather', 'p-leather2'], 'thermal', ['qora'], 'top', 'Tabiiy charm, astar: viskoza', 'Turkiya', 'Premium', 'Tabiiy charmdan klassik kurtka. Yillar davomida kiyiladi, vaqt o‘tib yanada chiroyli bo‘ladi.'),
  P('bomber', 'kurtka', 'Bomber kurtka', 690000, 860000, ['p-bomber'], 'thermal', ['terra', 'zay', 'qora'], 'top', '100% neylon, sintepon', 'Turkiya', '-20%', 'Yengil va issiq bomber. Yoqasi va etagi rezinali, ichida cho‘ntagi bor.'),
  P('denim', 'kurtka', 'Jinsi kurtka', 549000, 0, ['lb-denim'], 'thermal', ['kok'], 'top', '100% paxta denim, vel’vet yoqa', 'Turkiya', 'Yangi', 'Vel’vet yoqali klassik jinsi kurtka. Bahor va kuz uchun.'),
  P('suit1', 'kostyum', 'Klassik kostyum', 1890000, 0, ['p-suit', 'lb-walk'], 'shirt', ['navy', 'komir', 'qora'], 'pants', '80% jun, 20% poliester', 'Turkiya', 'Premium', 'Ikki tugmali klassik kostyum: pidjak va shim. Ish, uchrashuv va tadbirlar uchun.'),
  P('suit-check', 'kostyum', 'Katak kostyum (uchlik)', 2190000, 0, ['p-suit2'], 'shirt', ['kok', 'komir'], 'pants', '90% jun, 10% kashmir', 'Turkiya', 'Yangi', 'Pidjak, jilet va shimdan iborat katak naqshli kostyum. Bayram va muhim uchrashuvlar uchun.'),
  P('suit-black', 'kostyum', 'To‘y kostyumi', 2450000, 0, ['p-black-suit', 'p-tux'], 'shirt', ['qora', 'komir'], 'pants', '90% jun, 10% ipak', 'Turkiya', '', 'Bayram va to‘y uchun qora kostyum. Atlas yoqali, oq yoki qora ko‘ylak bilan to‘liq ko‘rinish.'),
  P('briefs', 'ichki', 'Paxta trusik (3 dona)', 99000, 0, [], 'briefs', ['qora', 'kul', 'navy'], 'under', '95% paxta, 5% elastan', 'O‘zbekiston', 'Xit', 'Boxer bichimli, yumshoq paxtadan. To‘plamda 3 dona, rezinasi ishqalamaydi.', '#14171A'),
  P('undershirt', 'ichki', 'Ichki futbolka', 69000, 0, ['p-undershirt'], 'tee', ['kul', 'oq', 'qora'], 'under', '100% paxta', 'O‘zbekiston', '', 'Ko‘ylak ostidan kiyiladigan yupqa futbolka. Terni shimadi, ko‘ylak ostidan ko‘rinmaydi.'),
  P('thermal', 'ichki', 'Termo ichki kiyim', 149000, 0, [], 'thermal', ['kul', 'qora'], 'under', 'Paxta va akril aralashmasi', 'O‘zbekiston', 'Yangi', 'Qish uchun issiqlikni saqlaydigan uzun yengli ichki kiyim.'),
  P('chust', 'doppi', 'Chust do‘ppi', 180000, 0, [], 'doppi', ['qora'], 'doppi', 'Atlas va ipak ip, qo‘l tikuvi', 'O‘zbekiston, Chust', 'Milliy', 'Qora fonda oq qalampir naqshli an’anaviy Chust do‘ppisi. Qo‘lda tikilgan, to‘y va bayramlar uchun.'),
  P('iroqi', 'doppi', 'Iroqi do‘ppi', 250000, 0, [], 'iroqi', ['qizil', 'yashil'], 'doppi', 'Ipak ip, iroqi (xoch) tikuv', 'O‘zbekiston, Shahrisabz', 'Milliy', 'Mayda xoch tikuvli rangli naqshlar bilan bezatilgan do‘ppi. Har biri qo‘lda tikiladi.'),
  P('shoes', 'oyoq', 'Charm tufli', 690000, 0, ['p-shoes'], 'shoes', ['jigar', 'qora'], 'shoes', 'Tabiiy charm, rezina taglik', 'Turkiya', '', 'Bog‘ichli klassik tufli. Kostyum va klassik shim bilan kiyiladi.'),
  P('monk', 'oyoq', 'Monk tufli', 749000, 0, ['p-shoes2'], 'shoes', ['jigar'], 'shoes', 'Tabiiy charm, ikki to‘qali', 'Turkiya', 'Yangi', 'Bog‘ichsiz, ikki to‘qali tufli. Kostyum va chino bilan birdek yarashadi.'),
  P('boots', 'oyoq', 'Charm botinka', 890000, 0, ['c-shoes'], 'shoes', ['jigar', 'qora'], 'shoes', 'Tabiiy charm, issiq astar', 'Turkiya', '', 'Bog‘ichli baland botinka. Kuz va qish uchun, jinsi va chino bilan kiyiladi.'),
  P('sneakers', 'oyoq', 'Krossovka', 549000, 649000, ['p-sneakers'], 'shoes', ['oq'], 'shoes', 'Sun’iy charm va to‘r, EVA taglik', 'Turkiya', '-15%', 'Har kun uchun yengil krossovka. Yumshoq taglik, uzoq yurishga qulay.'),
  P('belt', 'aksessuar', 'Charm kamar', 149000, 0, ['p-belt'], 'belt', ['jigar', 'qora'], 'belt', 'Tabiiy charm, metall to‘qa', 'Turkiya', '', 'Klassik charm kamar. Shim va jinsi bilan kiyiladi.'),
  P('socks', 'aksessuar', 'Paypoq to‘plami (5 juft)', 49000, 0, [], 'socks', ['navy'], 'socks', '80% paxta, 20% poliamid', 'O‘zbekiston', 'Xit', 'Har kun uchun 5 juft paypoq. Tovoni va uchi mustahkamlangan.', '#C49A52'),
]
