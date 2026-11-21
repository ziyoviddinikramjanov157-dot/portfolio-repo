import pg from 'pg'

export type Db = pg.Pool
export type Client = pg.Pool | pg.PoolClient

export const createPool = (url: string): Db => new pg.Pool({ connectionString: url, max: 10 })

export async function tx<T>(db: Db, fn: (c: pg.PoolClient) => Promise<T>): Promise<T> {
  const c = await db.connect()
  try {
    await c.query('BEGIN')
    const result = await fn(c)
    await c.query('COMMIT')
    return result
  } catch (e) {
    await c.query('ROLLBACK')
    throw e
  } finally {
    c.release()
  }
}
