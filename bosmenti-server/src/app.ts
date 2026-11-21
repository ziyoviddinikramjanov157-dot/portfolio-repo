import { existsSync } from 'node:fs'
import path from 'node:path'
import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import type { Config } from './config.js'
import type { Db } from './db.js'
import { errorHandler } from './errors.js'
import { adminRouter } from './routes/admin.js'
import { publicRouter } from './routes/public.js'
import type { Notifier } from './services/telegram.js'

export interface AppDeps {
  db: Db
  cfg: Config
  notify: Notifier
  rateLimits?: boolean
}

export function createApp({ db, cfg, notify, rateLimits = true }: AppDeps) {
  const app = express()
  app.disable('x-powered-by')
  if (cfg.TRUST_PROXY) app.set('trust proxy', cfg.TRUST_PROXY)

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'blob:'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: cfg.cookieSecure ? [] : null,
        },
      },
    }),
  )
  app.use(express.json({ limit: '100kb' }))
  app.use(cookieParser())

  app.use('/api/admin', adminRouter({ db, cfg, rateLimits }))
  app.use('/api', publicRouter({ db, notify, rateLimits }))
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Topilmadi' })
  })

  app.use('/uploads', express.static(cfg.UPLOAD_DIR, { index: false, maxAge: '365d', immutable: true }))

  const site = path.resolve(cfg.STATIC_DIR)
  if (existsSync(path.join(site, 'index.html'))) {
    app.use(
      express.static(site, {
        index: false,
        setHeaders: (res, file) => {
          // hashed build files never change; pages must be re-checked so new builds show up
          res.setHeader('Cache-Control', file.includes(`${path.sep}assets${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache')
        },
      }),
    )
    // pages use relative asset paths (for the mobile app build), so each page has exactly one address
    app.get(['/admin', '/admin/*rest'], (req, res) => {
      if (req.path === '/admin') res.sendFile(path.join(site, 'admin.html'))
      else res.redirect(301, '/admin')
    })
    app.get('/', (_req, res) => res.sendFile(path.join(site, 'index.html')))
    app.get('/*rest', (_req, res) => res.redirect(302, '/'))
  }

  app.use(errorHandler)
  return app
}
