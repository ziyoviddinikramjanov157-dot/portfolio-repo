import { randomBytes } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import multer from 'multer'
import { HttpError } from './errors.js'

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
}).single('file')

/** Decides the type from the file's first bytes, not from its name or the browser's claim. */
function imageType(b: Buffer): 'jpg' | 'png' | 'webp' | null {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg'
  if (b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png'
  if (b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return 'webp'
  return null
}

export async function saveImage(dir: string, file: Express.Multer.File | undefined) {
  if (!file) throw new HttpError(400, 'Rasm tanlanmadi')
  const ext = imageType(file.buffer)
  if (!ext) throw new HttpError(400, 'Faqat JPG, PNG yoki WEBP rasm yuklash mumkin')
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString('hex')}.${ext}`
  await writeFile(path.join(dir, name), file.buffer)
  return `/uploads/${name}`
}
