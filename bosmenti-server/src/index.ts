import { mkdir } from 'node:fs/promises'
import { createApp } from './app.js'
import { loadConfig } from './config.js'
import { createPool } from './db.js'
import { migrate } from './migrate.js'
import { seed } from './seed.js'
import { telegramNotifier } from './services/telegram.js'

const cfg = loadConfig()
const db = createPool(cfg.DATABASE_URL)

await migrate(db)
await seed(db, { demoProducts: cfg.SEED_DEMO_PRODUCTS === 'true' })
await mkdir(cfg.UPLOAD_DIR, { recursive: true })

const app = createApp({ db, cfg, notify: telegramNotifier(cfg) })
const server = app.listen(cfg.PORT, () => {
  console.log(`Bosmenti ishga tushdi: http://localhost:${cfg.PORT} (admin: /admin)`)
  if (!cfg.TELEGRAM_BOT_TOKEN) console.log('Telegram sozlanmagan: yangi buyurtmalar faqat admin panelda ko‘rinadi.')
})

const stop = () => {
  server.close(() => db.end().then(() => process.exit(0)))
  setTimeout(() => process.exit(1), 10_000).unref()
}
process.on('SIGTERM', stop)
process.on('SIGINT', stop)
