import { useCallback, useEffect, useState } from 'react'
import { asset } from '../lib/api'
import { fmt } from '../lib/util'
import { adminApi, send, STATUS, type AdminOrder, type Status } from './api'

const time = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
const payLabel = (o: AdminOrder) => (o.pay === 'cash' ? 'Naqd' : `Karta${o.cardType ? ` (${o.cardType})` : ''}`)
const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`

export function Orders() {
  const [status, setStatus] = useState<Status | ''>('')
  const [query, setQuery] = useState('')
  const [q, setQ] = useState('')
  const [data, setData] = useState<{ orders: AdminOrder[]; counts: Partial<Record<Status, number>> } | null>(null)
  const [error, setError] = useState('')
  const [open, setOpen] = useState<AdminOrder | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setQ(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  const load = useCallback(() => {
    const p = new URLSearchParams()
    if (status) p.set('status', status)
    if (q) p.set('q', q)
    adminApi<{ orders: AdminOrder[]; counts: Partial<Record<Status, number>> }>(`/api/admin/orders?${p}`).then(
      d => {
        setData(d)
        setError('')
      },
      (e: Error) => setError(e.message),
    )
  }, [status, q])

  // new orders show up without reloading the page
  useEffect(() => {
    load()
    const t = setInterval(load, 30_000)
    return () => clearInterval(t)
  }, [load])

  const total = Object.values(data?.counts ?? {}).reduce((a, n) => a + (n ?? 0), 0)

  return (
    <section>
      <div className="a-head">
        <h1>Buyurtmalar</h1>
        <input className="a-search" type="search" placeholder="№, telefon yoki ism" aria-label="Buyurtma qidirish" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <div className="a-filter">
        <button className={status === '' ? 'on' : ''} onClick={() => setStatus('')}>Hammasi <b>{total}</b></button>
        {(Object.keys(STATUS) as Status[]).map(s => (
          <button key={s} className={status === s ? 'on' : ''} onClick={() => setStatus(s)}>
            {STATUS[s]} <b className={s === 'new' && data?.counts.new ? 'hot' : ''}>{data?.counts[s] ?? 0}</b>
          </button>
        ))}
      </div>

      {error && <p className="a-err">{error}</p>}
      {!data ? <p className="a-muted">Yuklanmoqda…</p> : data.orders.length === 0 ? (
        <p className="a-muted">{q || status ? 'Bunday buyurtma topilmadi.' : 'Hali buyurtma yo‘q. Mijoz buyurtma berishi bilan shu yerda paydo bo‘ladi.'}</p>
      ) : (
        <div className="a-table-wrap">
          <table className="a-table">
            <thead><tr><th>№</th><th>Vaqt</th><th>Mijoz</th><th>Qabul qilish</th><th className="r">Summa</th><th>Holat</th></tr></thead>
            <tbody>
              {data.orders.map(o => (
                <tr key={o.no} onClick={() => setOpen(o)} className={o.status === 'new' ? 'is-new' : ''}>
                  <td><button className="a-link" onClick={() => setOpen(o)}>{o.no}</button></td>
                  <td className="nw">{time(o.createdAt)}</td>
                  <td><b>{o.name}</b><br /><small>{o.phone}</small></td>
                  <td>{o.ship === 'pickup' ? 'Do‘kondan' : <span className="clip">{o.address}</span>}</td>
                  <td className="r nw">{fmt(o.total)}</td>
                  <td><span className={`a-st st-${o.status}`}>{STATUS[o.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && <OrderDetail order={open} onClose={() => setOpen(null)} onSaved={o => { setOpen(o); load() }} />}
    </section>
  )
}

function OrderDetail({ order: o, onClose, onSaved }: { order: AdminOrder; onClose: () => void; onSaved: (o: AdminOrder) => void }) {
  const [note, setNote] = useState(o.adminNote)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [onClose])

  const save = async (patch: { status?: Status; adminNote?: string }) => {
    setBusy(true)
    setError('')
    try {
      onSaved(await send<AdminOrder>('PATCH', `/api/admin/orders/${o.no}`, patch))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="a-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="a-panel" role="dialog" aria-modal="true" aria-labelledby="ord-title">
        <div className="a-panel-head">
          <h2 id="ord-title">Buyurtma № {o.no}</h2>
          <button className="a-x" onClick={onClose} aria-label="Yopish">×</button>
        </div>
        <p className="a-muted">{time(o.createdAt)}</p>

        <dl className="a-dl">
          <dt>Mijoz</dt><dd>{o.name}</dd>
          <dt>Telefon</dt><dd><a href={telHref(o.phone)}>{o.phone}</a></dd>
          <dt>Qabul qilish</dt><dd>{o.ship === 'pickup' ? 'Do‘kondan olib ketadi' : o.address}</dd>
          <dt>To‘lov</dt><dd>{payLabel(o)}, qabul qilganda</dd>
          {o.note && <><dt>Mijoz izohi</dt><dd>{o.note}</dd></>}
        </dl>

        <ul className="a-items">
          {o.items.map((i, k) => (
            <li key={k}>
              {i.image ? <img src={asset(i.image)} alt="" /> : <span className="a-noimg" />}
              <div><b>{i.name}</b><small>{i.color} · {i.size} · {i.qty} dona</small></div>
              <span className="nw">{fmt(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="a-dl a-sum">
          <dt>Mahsulotlar</dt><dd>{fmt(o.itemsTotal)}</dd>
          <dt>Yetkazib berish</dt><dd>{o.shipFee ? fmt(o.shipFee) : 'Bepul'}</dd>
          <dt><b>Jami</b></dt><dd><b>{fmt(o.total)}</b></dd>
        </dl>

        <h3>Holat</h3>
        <div className="a-status">
          {(Object.keys(STATUS) as Status[]).map(s => (
            <button key={s} className={`a-st st-${s}` + (o.status === s ? ' on' : '')} disabled={busy || o.status === s} onClick={() => save({ status: s })}>
              {STATUS[s]}
            </button>
          ))}
        </div>

        <h3><label htmlFor="anote">Ichki izoh</label></h3>
        <textarea id="anote" rows={3} placeholder="Faqat admin ko‘radi: kuryer, qo‘ng‘iroq natijasi…" value={note} onChange={e => setNote(e.target.value)} maxLength={1000} />
        {error && <p className="a-err">{error}</p>}
        <div className="a-actions">
          <button className="a-btn primary" disabled={busy || note === o.adminNote} onClick={() => save({ adminNote: note })}>Izohni saqlash</button>
          <a className="a-btn" href={telHref(o.phone)}>Qo‘ng‘iroq qilish</a>
        </div>
      </div>
    </div>
  )
}
