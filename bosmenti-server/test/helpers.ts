import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createApp } from '../src/app.js'
import { loadConfig } from '../src/config.js'
import { createPool, type Db } from '../src/db.js'
import { migrate } from '../src/migrate.js'
import type { Order } from '../src/services/orders.js'
import { seed } from '../src/seed.js'

const TEST_DB = process.env.TEST_DATABASE_URL ?? 'postgres://bosmenti:bosmenti@localhost:5432/bosmenti_test'

export const ADMIN = { login: 'admin', password: 'test-password-123' }

export async function setup() {
  const cfg = loadConfig({
    NODE_ENV: 'test',
    DATABASE_URL: TEST_DB,
    ADMIN_LOGIN: ADMIN.login,
    ADMIN_PASSWORD: ADMIN.password,
    UPLOAD_DIR: mkdtempSync(path.join(tmpdir(), 'bos-up-')),
    STATIC_DIR: path.join(tmpdir(), 'bos-no-site'),
  })
  const db = createPool(TEST_DB)
  await migrate(db)
  await db.query('TRUNCATE order_items, orders, products, categories, settings, admin_sessions RESTART IDENTITY CASCADE')
  await db.query("SELECT setval('order_no_seq', 10001, false)")
  await seed(db, { demoProducts: true })
  const sent: Order[] = []
  const app = createApp({ db, cfg, notify: async o => void sent.push(o), rateLimits: false })
  return { app, db, cfg, sent }
}

export const order = (over: Record<string, unknown> = {}) => ({
  name: 'Aziz',
  phone: '901234567',
  ship: 'delivery',
  address: 'Yunusobod, 4-kvartal, 12-uy',
  pay: 'cash',
  items: [{ id: 'tee', ci: 0, size: 'M', qty: 2 }],
  ...over,
})

export const close = (db: Db) => db.end()
