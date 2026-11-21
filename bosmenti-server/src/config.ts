import { z } from 'zod'

const optional = z
  .string()
  .optional()
  .transform(v => (v ? v : undefined))

const Env = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL kerak'),
  ADMIN_LOGIN: z.string().min(3, 'ADMIN_LOGIN kamida 3 belgi'),
  ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD kamida 8 belgi'),
  PUBLIC_URL: optional,
  STATIC_DIR: z.string().default('../bosmenti-app/dist'),
  UPLOAD_DIR: z.string().default('./uploads'),
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
  COOKIE_SECURE: optional,
  TELEGRAM_BOT_TOKEN: optional,
  TELEGRAM_CHAT_ID: optional,
  SEED_DEMO_PRODUCTS: z.enum(['true', 'false']).default('true'),
})

export type Config = z.infer<typeof Env> & { cookieSecure: boolean }

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = Env.safeParse(env)
  if (!parsed.success) {
    const lines = parsed.error.issues.map(i => `  - ${i.path.join('.')}: ${i.message}`)
    throw new Error(`Sozlamalarda xato (.env):\n${lines.join('\n')}`)
  }
  const c = parsed.data
  if (c.NODE_ENV === 'production' && c.ADMIN_PASSWORD.length < 12) {
    throw new Error('Sozlamalarda xato (.env): ADMIN_PASSWORD kamida 12 belgi bo‘lishi kerak')
  }
  const cookieSecure = c.COOKIE_SECURE ? c.COOKIE_SECURE === 'true' : c.NODE_ENV === 'production'
  return { ...c, cookieSecure }
}
