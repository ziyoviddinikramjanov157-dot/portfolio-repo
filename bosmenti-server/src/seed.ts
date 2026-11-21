import { tx, type Db } from './db.js'
import { CATEGORIES, PRODUCTS } from './seed-data.js'
import { DEFAULT_SETTINGS } from './services/settings.js'

/** Fills an empty database: categories and settings always, demo products only on request. */
export async function seed(db: Db, { demoProducts }: { demoProducts: boolean }) {
  await tx(db, async c => {
    for (const [i, cat] of CATEGORIES.entries()) {
      await c.query(
        'INSERT INTO categories (id, name, art_type, color, sort) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
        [cat.id, cat.name, cat.type, cat.c, i],
      )
    }
    await c.query('INSERT INTO settings (id, data) VALUES (1, $1) ON CONFLICT (id) DO NOTHING', [
      JSON.stringify(DEFAULT_SETTINGS),
    ])

    if (!demoProducts) return
    const { rows } = await c.query<{ n: number }>('SELECT count(*)::int AS n FROM products')
    if (rows[0].n > 0) return
    for (const [i, p] of PRODUCTS.entries()) {
      await c.query(
        `INSERT INTO products (id, category_id, name, price, old_price, images, art_type, colors, size_key,
           material, made_in, tag, description, accent, is_new, sort)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [p.id, p.cat, p.name, p.price, p.old, JSON.stringify(p.imgs), p.type, JSON.stringify(p.colors), p.sz,
          p.mat, p.made, p.tag, p.desc, p.acc, p.isNew, i],
      )
    }
  })
}
