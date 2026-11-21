import { api, ApiError } from '../lib/api'

export const LOGGED_OUT = 'bosmenti-admin:logged-out'

/** Like api(), but an expired session sends the admin back to the login screen. */
export async function adminApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  try {
    return await api<T>(path, init)
  } catch (e) {
    if (e instanceof ApiError && e.status === 401 && !path.endsWith('/login')) dispatchEvent(new Event(LOGGED_OUT))
    throw e
  }
}

export const send = <T>(method: string, path: string, data?: unknown) =>
  adminApi<T>(path, { method, body: data === undefined ? undefined : JSON.stringify(data) })

export type Status = 'new' | 'confirmed' | 'shipping' | 'done' | 'cancelled'

export const STATUS: Record<Status, string> = {
  new: 'Yangi',
  confirmed: 'Tasdiqlangan',
  shipping: 'Yo‘lda',
  done: 'Topshirilgan',
  cancelled: 'Bekor qilingan',
}

export interface AdminOrder {
  no: number
  name: string
  phone: string
  ship: 'delivery' | 'pickup'
  address: string
  pay: 'cash' | 'card'
  cardType: string | null
  note: string
  itemsTotal: number
  shipFee: number
  total: number
  status: Status
  adminNote: string
  createdAt: string
  items: { productId: string; name: string; color: string; size: string; price: number; qty: number; image: string | null }[]
}

export interface AdminProduct {
  id: string
  cat: string
  name: string
  price: number
  old: number
  imgs: string[]
  type: string
  colors: { n: string; c: string }[]
  sz: string
  mat: string
  made: string
  tag: string
  desc: string
  acc: string | null
  isNew: boolean
  active: boolean
  sort: number
}

export interface Settings { phone: string; address: string; hours: string; shipFee: number; freeFrom: number }
