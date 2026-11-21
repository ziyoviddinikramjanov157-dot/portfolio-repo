import type { Config } from '../config.js'
import type { Order } from './orders.js'

export type Notifier = (order: Order) => Promise<void>

const money = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so‘m`

export function orderMessage(o: Order, publicUrl?: string) {
  const lines = [
    `Yangi buyurtma № ${o.no}`,
    '',
    `Mijoz: ${o.name}`,
    `Telefon: ${o.phone}`,
    o.ship === 'pickup' ? 'Qabul qilish: do‘kondan olib ketadi' : `Yetkazib berish: ${o.address}`,
    `To‘lov: ${o.pay === 'cash' ? 'naqd' : `karta${o.cardType ? ` (${o.cardType})` : ''}`}, qabul qilganda`,
    '',
    ...o.items.map(i => `• ${i.name} — ${i.color}, ${i.size} × ${i.qty} = ${money(i.price * i.qty)}`),
    '',
    `Mahsulotlar: ${money(o.itemsTotal)}`,
    `Yetkazib berish: ${o.shipFee ? money(o.shipFee) : 'bepul'}`,
    `Jami: ${money(o.total)}`,
  ]
  if (o.note) lines.push('', `Izoh: ${o.note}`)
  if (publicUrl) lines.push('', `${publicUrl.replace(/\/$/, '')}/admin`)
  return lines.join('\n')
}

/** Sends each new order to the shop's Telegram chat. Without a bot token it does nothing. */
export function telegramNotifier(cfg: Config): Notifier {
  const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_CHAT_ID: chatId } = cfg
  if (!token || !chatId) return async () => {}
  return async order => {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: orderMessage(order, cfg.PUBLIC_URL), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`Telegram javobi: ${res.status} ${await res.text()}`)
  }
}
