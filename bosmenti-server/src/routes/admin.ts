import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { z } from 'zod'
import { checkCredentials, COOKIE, cookieOptions, createSession, destroySession, requireAdmin } from '../auth.js'
import { ORDER_STATUSES } from '../catalog-rules.js'
import type { Config } from '../config.js'
import type { Db } from '../db.js'
import { HttpError } from '../errors.js'
import { findByNo, listOrders, OrderPatch, updateOrder } from '../services/orders.js'
import { createProduct, deleteProduct, listProducts, ProductInput, updateProduct } from '../services/products.js'
import { getSettings, saveSettings, Settings } from '../services/settings.js'
import { saveImage, uploadMiddleware } from '../uploads.js'

const orderNo = (v: string) => {
  const n = Number(v)
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(404, 'Buyurtma topilmadi')
  return n
}

export function adminRouter({ db, cfg, rateLimits }: { db: Db; cfg: Config; rateLimits: boolean }) {
  const r = Router()

  const Login = z.object({ login: z.string().max(100), password: z.string().max(200) })
  const loginLimit = rateLimit({
    windowMs: 15 * 60_000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Juda ko‘p noto‘g‘ri urinish. 15 daqiqadan keyin qayta urinib ko‘ring.' },
  })

  r.post('/login', rateLimits ? loginLimit : (_req, _res, next) => next(), async (req, res) => {
    const { login, password } = Login.parse(req.body)
    if (!checkCredentials(cfg, login, password)) throw new HttpError(401, 'Login yoki parol noto‘g‘ri')
    res.cookie(COOKIE, await createSession(db), cookieOptions(cfg))
    res.json({ login: cfg.ADMIN_LOGIN })
  })

  r.post('/logout', async (req, res) => {
    await destroySession(db, req.cookies?.[COOKIE])
    res.clearCookie(COOKIE, { ...cookieOptions(cfg), maxAge: undefined })
    res.json({ ok: true })
  })

  r.use(requireAdmin(db))

  r.get('/me', (_req, res) => {
    res.json({ login: cfg.ADMIN_LOGIN })
  })

  const OrderQuery = z.object({
    status: z.enum(ORDER_STATUSES).optional(),
    q: z.string().max(60).optional(),
    page: z.coerce.number().int().min(1).max(10_000).default(1),
  })
  r.get('/orders', async (req, res) => {
    const { status, q, page } = OrderQuery.parse(req.query)
    const limit = 50
    res.json(await listOrders(db, { status, q, limit, offset: (page - 1) * limit }))
  })

  r.get('/orders/:no', async (req, res) => {
    res.json(await findByNo(db, orderNo(req.params.no)))
  })

  r.patch('/orders/:no', async (req, res) => {
    res.json(await updateOrder(db, orderNo(req.params.no), OrderPatch.parse(req.body)))
  })

  r.get('/products', async (_req, res) => {
    res.json({ products: await listProducts(db, { includeInactive: true }) })
  })

  r.post('/products', async (req, res) => {
    res.status(201).json(await createProduct(db, ProductInput.parse(req.body)))
  })

  r.put('/products/:id', async (req, res) => {
    res.json(await updateProduct(db, req.params.id, ProductInput.parse(req.body)))
  })

  r.delete('/products/:id', async (req, res) => {
    await deleteProduct(db, req.params.id)
    res.status(204).end()
  })

  r.post('/uploads', uploadMiddleware, async (req, res) => {
    res.status(201).json({ url: await saveImage(cfg.UPLOAD_DIR, req.file) })
  })

  r.get('/settings', async (_req, res) => {
    res.json(await getSettings(db))
  })

  r.put('/settings', async (req, res) => {
    const s = Settings.parse(req.body)
    await saveSettings(db, s)
    res.json(s)
  })

  return r
}
