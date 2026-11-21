import { Router, type RequestHandler } from 'express'
import { rateLimit } from 'express-rate-limit'
import { z } from 'zod'
import { GUIDE, SIZES } from '../catalog-rules.js'
import type { Db } from '../db.js'
import { createOrder, findByTokens, OrderInput, toCustomerView } from '../services/orders.js'
import { listProducts } from '../services/products.js'
import { getSettings } from '../services/settings.js'
import type { Notifier } from '../services/telegram.js'

const limiter = (limit: number, minutes: number) =>
  rateLimit({
    windowMs: minutes * 60_000,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.' },
  })

export function publicRouter({ db, notify, rateLimits }: { db: Db; notify: Notifier; rateLimits: boolean }) {
  const r = Router()
  const pass: RequestHandler = (_req, _res, next) => next()

  r.get('/health', async (_req, res) => {
    await db.query('SELECT 1')
    res.json({ ok: true })
  })

  r.get('/catalog', async (_req, res) => {
    const [categories, products, shop] = await Promise.all([
      db.query('SELECT id, name, art_type AS type, color AS c FROM categories ORDER BY sort'),
      listProducts(db),
      getSettings(db),
    ])
    res.set('Cache-Control', 'no-cache')
    res.json({ categories: categories.rows, products, sizes: SIZES, guide: GUIDE, shop })
  })

  r.post('/orders', rateLimits ? limiter(10, 15) : pass, async (req, res) => {
    const order = await createOrder(db, OrderInput.parse(req.body))
    notify(order).catch(e => console.error('Telegram xabari yuborilmadi:', e))
    res.status(201).json(toCustomerView(order))
  })

  // The browser keeps a secret token for every order it placed; only those orders are returned.
  const Lookup = z.object({ tokens: z.array(z.string().min(10).max(64)).max(50) })
  r.post('/orders/lookup', rateLimits ? limiter(60, 5) : pass, async (req, res) => {
    const { tokens } = Lookup.parse(req.body)
    const orders = tokens.length ? await findByTokens(db, tokens) : []
    res.json({ orders: orders.map(toCustomerView) })
  })

  return r
}
