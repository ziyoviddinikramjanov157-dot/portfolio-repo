import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import type { CookieOptions, RequestHandler } from 'express'
import type { Config } from './config.js'
import type { Db } from './db.js'
import { HttpError } from './errors.js'

export const COOKIE = 'bos_admin'
const TTL_MS = 30 * 24 * 60 * 60 * 1000

const sha256 = (s: string) => createHash('sha256').update(s).digest()

export function checkCredentials(cfg: Config, login: string, password: string) {
  const given = Buffer.concat([sha256(login), sha256(password)])
  const expected = Buffer.concat([sha256(cfg.ADMIN_LOGIN), sha256(cfg.ADMIN_PASSWORD)])
  return timingSafeEqual(given, expected)
}

export const cookieOptions = (cfg: Config): CookieOptions => ({
  httpOnly: true,
  sameSite: 'strict',
  secure: cfg.cookieSecure,
  path: '/api/admin',
  maxAge: TTL_MS,
})

/** Sessions live in the database, so logging out or restarting the server behaves predictably. */
export async function createSession(db: Db) {
  const token = randomBytes(32).toString('base64url')
  await db.query('DELETE FROM admin_sessions WHERE expires_at < now()')
  await db.query('INSERT INTO admin_sessions (token_hash, expires_at) VALUES ($1, $2)', [
    sha256(token).toString('hex'),
    new Date(Date.now() + TTL_MS),
  ])
  return token
}

export async function destroySession(db: Db, token: string | undefined) {
  if (token) await db.query('DELETE FROM admin_sessions WHERE token_hash = $1', [sha256(token).toString('hex')])
}

export const requireAdmin =
  (db: Db): RequestHandler =>
  async (req, _res, next) => {
    const token: string | undefined = req.cookies?.[COOKIE]
    if (token) {
      const { rowCount } = await db.query('SELECT 1 FROM admin_sessions WHERE token_hash = $1 AND expires_at > now()', [
        sha256(token).toString('hex'),
      ])
      if (rowCount) return next()
    }
    throw new HttpError(401, 'Avval tizimga kiring')
  }
