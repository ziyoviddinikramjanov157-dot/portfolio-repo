import { randomBytes } from 'node:crypto'
import { z } from 'zod'
import { ART_TYPES, isAllowedImage, SIZE_KEYS } from '../catalog-rules.js'
import type { Client } from '../db.js'
import { HttpError } from '../errors.js'

interface ProductRow {
  id: string; category_id: string; name: string; price: number; old_price: number; images: string[]
  art_type: string; colors: { n: string; c: string }[]; size_key: string; material: string; made_in: string
  tag: string; description: string; accent: string | null; is_new: boolean; is_active: boolean; sort: number
}

const COLUMNS = `id, category_id, name, price, old_price, images, art_type, colors, size_key, material, made_in,
  tag, description, accent, is_new, is_active, sort`

/** The shape the shop frontend has always used for a product. */
const toApi = (r: ProductRow) => ({
  id: r.id, cat: r.category_id, name: r.name, price: r.price, old: r.old_price, imgs: r.images, type: r.art_type,
  colors: r.colors, sz: r.size_key, mat: r.material, made: r.made_in, tag: r.tag, desc: r.description,
  acc: r.accent, isNew: r.is_new, active: r.is_active, sort: r.sort,
})

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Rang #RRGGBB ko‘rinishida bo‘lsin')

export const ProductInput = z.object({
  cat: z.string().min(1, 'Bo‘limni tanlang'),
  name: z.string().trim().min(2, 'Nomini kiriting').max(120),
  price: z.number().int().min(0).max(1_000_000_000),
  old: z.number().int().min(0).max(1_000_000_000).default(0),
  imgs: z.array(z.string().refine(isAllowedImage, 'Rasm manzili noto‘g‘ri')).max(10).default([]),
  type: z.enum(ART_TYPES),
  colors: z.array(z.object({ n: z.string().trim().min(1, 'Rang nomini kiriting').max(40), c: hex })).min(1, 'Kamida bitta rang kiriting').max(20),
  sz: z.enum(SIZE_KEYS),
  mat: z.string().trim().max(200).default(''),
  made: z.string().trim().max(100).default(''),
  tag: z.string().trim().max(30).default(''),
  desc: z.string().trim().max(2000).default(''),
  acc: hex.nullable().default(null),
  isNew: z.boolean().default(false),
  active: z.boolean().default(true),
  sort: z.number().int().min(-100000).max(100000).default(0),
})
export type ProductInput = z.infer<typeof ProductInput>

const values = (p: ProductInput) => [
  p.cat, p.name, p.price, p.old, JSON.stringify(p.imgs), p.type, JSON.stringify(p.colors), p.sz, p.mat, p.made,
  p.tag, p.desc, p.acc, p.isNew, p.active, p.sort,
]

export async function listProducts(db: Client, { includeInactive = false } = {}) {
  const { rows } = await db.query<ProductRow>(
    `SELECT ${COLUMNS} FROM products ${includeInactive ? '' : 'WHERE is_active'} ORDER BY sort, created_at`,
  )
  return rows.map(toApi)
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[‘’'`ʻʼ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'mahsulot'

export async function createProduct(db: Client, p: ProductInput) {
  const id = `${slug(p.name)}-${randomBytes(3).toString('hex')}`
  const { rows } = await db.query<ProductRow>(
    `INSERT INTO products (id, category_id, name, price, old_price, images, art_type, colors, size_key, material,
       made_in, tag, description, accent, is_new, is_active, sort)
     VALUES ($17, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING ${COLUMNS}`,
    [...values(p), id],
  )
  return toApi(rows[0])
}

export async function updateProduct(db: Client, id: string, p: ProductInput) {
  const { rows } = await db.query<ProductRow>(
    `UPDATE products SET category_id = $1, name = $2, price = $3, old_price = $4, images = $5, art_type = $6,
       colors = $7, size_key = $8, material = $9, made_in = $10, tag = $11, description = $12, accent = $13,
       is_new = $14, is_active = $15, sort = $16, updated_at = now()
     WHERE id = $17 RETURNING ${COLUMNS}`,
    [...values(p), id],
  )
  if (!rows[0]) throw new HttpError(404, 'Mahsulot topilmadi')
  return toApi(rows[0])
}

export async function deleteProduct(db: Client, id: string) {
  const { rowCount } = await db.query('DELETE FROM products WHERE id = $1', [id])
  if (!rowCount) throw new HttpError(404, 'Mahsulot topilmadi')
}
