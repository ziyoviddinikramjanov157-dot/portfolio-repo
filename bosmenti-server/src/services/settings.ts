import { z } from 'zod'
import type { Client } from '../db.js'

export const Settings = z.object({
  phone: z.string().trim().max(30).default(''),
  address: z.string().trim().max(200).default(''),
  hours: z.string().trim().max(100).default('Har kuni 09:00–21:00'),
  shipFee: z.number().int().min(0).max(10_000_000).default(25000),
  freeFrom: z.number().int().min(0).max(1_000_000_000).default(500000),
})
export type Settings = z.infer<typeof Settings>

export const DEFAULT_SETTINGS: Settings = Settings.parse({})

export async function getSettings(db: Client): Promise<Settings> {
  const { rows } = await db.query<{ data: unknown }>('SELECT data FROM settings WHERE id = 1')
  // fields added in later versions fall back to their defaults
  return Settings.parse({ ...DEFAULT_SETTINGS, ...(rows[0]?.data as object | undefined) })
}

export async function saveSettings(db: Client, s: Settings) {
  await db.query(
    'INSERT INTO settings (id, data) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data',
    [JSON.stringify(s)],
  )
}
