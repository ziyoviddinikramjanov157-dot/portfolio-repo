/** Server address. Empty when the site and the API are served from the same domain. */
const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message)
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(BASE + path, {
      ...init,
      credentials: BASE ? 'include' : 'same-origin',
      headers: init.body instanceof FormData ? init.headers : { 'content-type': 'application/json', ...init.headers },
    })
  } catch {
    throw new ApiError(0, 'Internet bilan aloqa yo‘q. Ulanishni tekshirib, qayta urinib ko‘ring.')
  }
  if (res.status === 204) return undefined as T
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, body.error ?? 'Xatolik yuz berdi. Qayta urinib ko‘ring.', body.details)
  return body as T
}

export const post = <T>(path: string, data: unknown) => api<T>(path, { method: 'POST', body: JSON.stringify(data) })

/** Photos uploaded in the admin panel live on the server; the shop's own photos ship with the site. */
export const asset = (url: string) => (url.startsWith('/uploads/') ? BASE + url : url)
