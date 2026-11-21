import type { ErrorRequestHandler } from 'express'
import multer from 'multer'
import { ZodError } from 'zod'

export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message)
  }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details })
    return
  }
  if (err instanceof ZodError) {
    const details = err.issues.map(i => ({ path: i.path.join('.'), message: i.message }))
    res.status(400).json({ error: details[0]?.message ?? 'Ma’lumotlar noto‘g‘ri', details })
    return
  }
  if (err instanceof multer.MulterError) {
    const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Rasm 5 MB dan katta bo‘lmasin' : 'Faylni yuklab bo‘lmadi'
    res.status(400).json({ error: msg })
    return
  }
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'So‘rov noto‘g‘ri yuborildi' })
    return
  }
  if (err?.type === 'entity.too.large') {
    res.status(413).json({ error: 'So‘rov juda katta' })
    return
  }
  // Postgres foreign key violation: a product pointing at a category that doesn't exist
  if (err?.code === '23503') {
    res.status(400).json({ error: 'Bunday bo‘lim yo‘q' })
    return
  }
  console.error(err)
  res.status(500).json({ error: 'Serverda xato yuz berdi. Birozdan keyin qayta urinib ko‘ring.' })
}
