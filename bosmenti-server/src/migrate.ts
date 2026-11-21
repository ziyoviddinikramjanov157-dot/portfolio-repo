import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Db } from './db.js'

const DIR = path.join(import.meta.dirname, '..', 'migrations')
const LOCK_ID = 812731

/** Applies migrations/*.sql in name order, each once, in its own transaction. */
export async function migrate(db: Db) {
  const c = await db.connect()
  try {
    // two app instances starting together must not run the same migration twice
    await c.query('SELECT pg_advisory_lock($1)', [LOCK_ID])
    await c.query(
      'CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())',
    )
    const done = new Set((await c.query<{ name: string }>('SELECT name FROM schema_migrations')).rows.map(r => r.name))
    const files = (await readdir(DIR)).filter(f => f.endsWith('.sql')).sort()
    for (const f of files) {
      if (done.has(f)) continue
      const sql = await readFile(path.join(DIR, f), 'utf8')
      await c.query('BEGIN')
      try {
        await c.query(sql)
        await c.query('INSERT INTO schema_migrations (name) VALUES ($1)', [f])
        await c.query('COMMIT')
      } catch (e) {
        await c.query('ROLLBACK')
        throw new Error(`Migratsiya ${f} bajarilmadi: ${(e as Error).message}`)
      }
    }
  } finally {
    await c.query('SELECT pg_advisory_unlock($1)', [LOCK_ID]).catch(() => {})
    c.release()
  }
}
