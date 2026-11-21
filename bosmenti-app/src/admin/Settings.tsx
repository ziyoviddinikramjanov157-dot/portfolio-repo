import { useEffect, useState, type FormEvent } from 'react'
import { adminApi, send, type Settings } from './api'

export function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null)
  const [saved, setSaved] = useState<Settings | null>(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    adminApi<Settings>('/api/admin/settings').then(d => { setS(d); setSaved(d) }, (e: Error) => setError(e.message))
  }, [])

  if (!s) return <p className={error ? 'a-err' : 'a-muted'}>{error || 'Yuklanmoqda…'}</p>

  const set = (patch: Partial<Settings>) => { setS({ ...s, ...patch }); setMsg('') }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const d = await send<Settings>('PUT', '/api/admin/settings', s)
      setS(d)
      setSaved(d)
      setMsg('Saqlandi. Do‘kon sahifasini yangilaganda ko‘rinadi.')
    } catch (err) {
      setError((err as Error).message)
    }
  }
  const changed = JSON.stringify(s) !== JSON.stringify(saved)

  return (
    <section>
      <div className="a-head"><h1>Sozlamalar</h1></div>
      <form className="a-form a-card" onSubmit={submit}>
        <h2>Do‘kon ma’lumotlari</h2>
        <p className="a-muted">Saytdagi “Do‘kon” bo‘limida va profil sahifasida ko‘rsatiladi. Bo‘sh qoldirilgan qator saytda chiqmaydi.</p>
        <label>Telefon<input value={s.phone} onChange={e => set({ phone: e.target.value })} placeholder="+998 90 123 45 67" maxLength={30} /></label>
        <label>Manzil<input value={s.address} onChange={e => set({ address: e.target.value })} placeholder="Chilonzor tumani, Bunyodkor ko‘chasi, 1-uy" maxLength={200} /></label>
        <label>Ish vaqti<input value={s.hours} onChange={e => set({ hours: e.target.value })} placeholder="Har kuni 09:00–21:00" maxLength={100} /></label>

        <h2>Yetkazib berish</h2>
        <div className="a-row">
          <label>Narxi, so‘m<input type="number" min={0} step={1000} value={s.shipFee} onChange={e => set({ shipFee: Number(e.target.value) })} /></label>
          <label>Shu summadan boshlab bepul, so‘m<input type="number" min={0} step={10000} value={s.freeFrom} onChange={e => set({ freeFrom: Number(e.target.value) })} /></label>
        </div>

        {error && <p className="a-err">{error}</p>}
        {msg && <p className="a-ok">{msg}</p>}
        <div className="a-actions"><button className="a-btn primary" disabled={!changed}>Saqlash</button></div>
      </form>
    </section>
  )
}
