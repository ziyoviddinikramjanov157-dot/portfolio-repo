import { randomBytes } from 'node:crypto'
import { z } from 'zod'
import { ORDER_STATUSES, SIZES, type SizeKey } from '../catalog-rules.js'
import { tx, type Client, type Db } from '../db.js'
import { HttpError } from '../errors.js'
import { getSettings } from './settings.js'

export const OrderInput = z
  .object({
    name: z.string().trim().min(2, 'Ismingizni kiriting').max(60),
    phone: z.string().regex(/^\d{9}$/, 'Telefon raqamni to‘liq kiriting: 9 ta raqam'),
    ship: z.enum(['delivery', 'pickup']),
    address: z.string().trim().max(200).default(''),
    pay: z.enum(['cash', 'card']),
    cardType: z.enum(['Uzcard', 'Humo', 'Visa']).optional(),
    note: z.string().trim().max(300).default(''),
    items: z
      .array(
        z.object({
          id: z.string().min(1).max(80),
          ci: z.number().int().min(0).max(50),
          size: z.string().min(1).max(20),
          qty: z.number().int().min(1).max(10),
        }),
      )
      .min(1, 'Savat bo‘sh')
      .max(30),
  })
  .superRefine((v, ctx) => {
    if (v.ship === 'delivery' && v.address.length < 5)
      ctx.addIssue({ code: 'custom', path: ['address'], message: 'Yetkazib berish manzilini kiriting' })
  })
export type OrderInput = z.infer<typeof OrderInput>

export interface OrderItem { productId: string; name: string; color: string; size: string; price: number; qty: number; image: string | null }
export interface Order {
  no: number; token: string; name: string; phone: string; ship: 'delivery' | 'pickup'; address: string
  pay: 'cash' | 'card'; cardType: string | null; note: string; itemsTotal: number; shipFee: number; total: number
  status: (typeof ORDER_STATUSES)[number]; adminNote: string; createdAt: string; updatedAt: string; items: OrderItem[]
}

interface OrderRow {
  id: number; no: number; token: string; customer_name: string; phone: string; ship: Order['ship']; address: string
  pay: Order['pay']; card_type: string | null; note: string; items_total: number; ship_fee: number; total: number
  status: Order['status']; admin_note: string; created_at: Date; updated_at: Date
}
interface ItemRow { order_id: number; product_id: string; name: string; color: string; size: string; price: number; qty: number; image: string | null }

const toOrder = (o: OrderRow, items: ItemRow[]): Order => ({
  no: o.no, token: o.token, name: o.customer_name, phone: o.phone, ship: o.ship, address: o.address, pay: o.pay,
  cardType: o.card_type, note: o.note, itemsTotal: o.items_total, shipFee: o.ship_fee, total: o.total,
  status: o.status, adminNote: o.admin_note, createdAt: o.created_at.toISOString(), updatedAt: o.updated_at.toISOString(),
  items: items.map(i => ({ productId: i.product_id, name: i.name, color: i.color, size: i.size, price: i.price, qty: i.qty, image: i.image })),
})

/** What a customer may see about their own order: no admin notes. */
export const toCustomerView = ({ adminNote: _a, ...o }: Order) => o

/** Prices and the delivery fee always come from the database, never from the customer's browser. */
export async function createOrder(db: Db, input: OrderInput): Promise<Order> {
  return tx(db, async c => {
    const ids = [...new Set(input.items.map(i => i.id))]
    const { rows: products } = await c.query<{
      id: string; name: string; price: number; colors: { n: string }[]; size_key: SizeKey; images: string[]; is_active: boolean
    }>('SELECT id, name, price, colors, size_key, images, is_active FROM products WHERE id = ANY($1)', [ids])
    const byId = new Map(products.map(p => [p.id, p]))

    const lines = input.items.map((it, index) => {
      const p = byId.get(it.id)
      if (!p || !p.is_active)
        throw new HttpError(409, 'Savatdagi bir mahsulot endi sotuvda yo‘q. Uni savatdan olib tashlang.', { index, id: it.id })
      const color = p.colors[it.ci]
      if (!color || !SIZES[p.size_key]?.includes(it.size))
        throw new HttpError(409, `«${p.name}» uchun tanlangan rang yoki o‘lcham endi yo‘q.`, { index, id: it.id })
      return { product_id: p.id, name: p.name, color: color.n, size: it.size, price: p.price, qty: it.qty, image: p.images[0] ?? null }
    })

    const settings = await getSettings(c)
    const itemsTotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
    const shipFee = input.ship === 'pickup' || itemsTotal >= settings.freeFrom ? 0 : settings.shipFee
    const token = randomBytes(18).toString('base64url')

    const { rows } = await c.query<OrderRow>(
      `INSERT INTO orders (token, customer_name, phone, ship, address, pay, card_type, note, items_total, ship_fee, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [token, input.name, `+998${input.phone}`, input.ship, input.ship === 'pickup' ? '' : input.address, input.pay,
        input.pay === 'card' ? (input.cardType ?? null) : null, input.note, itemsTotal, shipFee, itemsTotal + shipFee],
    )
    const order = rows[0]
    const items: ItemRow[] = []
    for (const l of lines) {
      const r = await c.query<ItemRow>(
        `INSERT INTO order_items (order_id, product_id, name, color, size, price, qty, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [order.id, l.product_id, l.name, l.color, l.size, l.price, l.qty, l.image],
      )
      items.push(r.rows[0])
    }
    return toOrder(order, items)
  })
}

async function withItems(db: Client, orders: OrderRow[]): Promise<Order[]> {
  if (!orders.length) return []
  const { rows } = await db.query<ItemRow>('SELECT * FROM order_items WHERE order_id = ANY($1) ORDER BY id', [orders.map(o => o.id)])
  return orders.map(o => toOrder(o, rows.filter(i => i.order_id === o.id)))
}

export async function findByTokens(db: Client, tokens: string[]) {
  const { rows } = await db.query<OrderRow>('SELECT * FROM orders WHERE token = ANY($1) ORDER BY created_at DESC', [tokens])
  return withItems(db, rows)
}

export async function findByNo(db: Client, no: number) {
  const { rows } = await db.query<OrderRow>('SELECT * FROM orders WHERE no = $1', [no])
  if (!rows[0]) throw new HttpError(404, 'Buyurtma topilmadi')
  return (await withItems(db, rows))[0]
}

export async function listOrders(db: Client, { status, q, limit, offset }: { status?: string; q?: string; limit: number; offset: number }) {
  const text = q?.trim() || null
  const digits = text?.replace(/\D/g, '') ?? ''
  const { rows } = await db.query<OrderRow>(
    `SELECT * FROM orders
     WHERE ($1::text IS NULL OR status = $1)
       AND ($2::text IS NULL
            OR customer_name ILIKE '%' || $2 || '%'
            OR ($3 <> '' AND (no::text = $3 OR phone LIKE '%' || $3 || '%')))
     ORDER BY created_at DESC LIMIT $4 OFFSET $5`,
    [status ?? null, text, digits, limit, offset],
  )
  const counts = await db.query<{ status: string; n: number }>('SELECT status, count(*)::int AS n FROM orders GROUP BY status')
  return { orders: await withItems(db, rows), counts: Object.fromEntries(counts.rows.map(r => [r.status, r.n])) }
}

export const OrderPatch = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  adminNote: z.string().trim().max(1000).optional(),
})

export async function updateOrder(db: Client, no: number, patch: z.infer<typeof OrderPatch>) {
  const { rowCount } = await db.query(
    `UPDATE orders SET status = coalesce($2, status), admin_note = coalesce($3, admin_note), updated_at = now() WHERE no = $1`,
    [no, patch.status ?? null, patch.adminNote ?? null],
  )
  if (!rowCount) throw new HttpError(404, 'Buyurtma topilmadi')
  return findByNo(db, no)
}
