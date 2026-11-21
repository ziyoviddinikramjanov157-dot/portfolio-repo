import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { api, asset } from '../lib/api'
import { fmt } from '../lib/util'
import { adminApi, send, type AdminProduct } from './api'

interface Meta { categories: { id: string; name: string }[]; sizes: Record<string, string[]> }
type Draft = Omit<AdminProduct, 'id'>

/** Drawing used on the site while a product has no photo */
const ART: [string, string][] = [
  ['shirt', 'Ko‘ylak / kostyum'], ['tee', 'Futbolka'], ['pants', 'Shim / jinsi'], ['thermal', 'Sviter / kurtka'],
  ['briefs', 'Ichki kiyim'], ['doppi', 'Do‘ppi'], ['iroqi', 'Iroqi do‘ppi'], ['shoes', 'Poyabzal'], ['belt', 'Kamar'], ['socks', 'Paypoq'],
]
const SIZE_GROUP: Record<string, string> = {
  top: 'Ustki kiyim', pants: 'Shim va kostyum', under: 'Ichki kiyim', shoes: 'Poyabzal', doppi: 'Do‘ppi', belt: 'Kamar', socks: 'Paypoq',
}

const blank = (cat: string): Draft => ({
  cat, name: '', price: 0, old: 0, imgs: [], type: 'shirt', colors: [{ n: 'Qora', c: '#222428' }], sz: 'top',
  mat: '', made: '', tag: '', desc: '', acc: null, isNew: false, active: true, sort: 0,
})

export function Products() {
  const [list, setList] = useState<AdminProduct[] | null>(null)
  const [meta, setMeta] = useState<Meta | null>(null)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [edit, setEdit] = useState<{ id: string | null; draft: Draft } | null>(null)

  const load = () =>
    adminApi<{ products: AdminProduct[] }>('/api/admin/products').then(r => setList(r.products), (e: Error) => setError(e.message))

  useEffect(() => {
    load()
    api<Meta>('/api/catalog').then(setMeta, (e: Error) => setError(e.message))
  }, [])

  const names = useMemo(() => Object.fromEntries((meta?.categories ?? []).map(c => [c.id, c.name])), [meta])
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase()
    return (list ?? []).filter(p => (!cat || p.cat === cat) && (!t || p.name.toLowerCase().includes(t)))
  }, [list, q, cat])

  const toggle = async (p: AdminProduct) => {
    try {
      await send('PUT', `/api/admin/products/${p.id}`, { ...p, active: !p.active })
      await load()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  if (!list || !meta) return <p className={error ? 'a-err' : 'a-muted'}>{error || 'Yuklanmoqda…'}</p>

  return (
    <section>
      <div className="a-head">
        <h1>Mahsulotlar <small>{list.length}</small></h1>
        <button className="a-btn primary" onClick={() => setEdit({ id: null, draft: blank(cat || meta.categories[0]?.id || '') })}>+ Yangi mahsulot</button>
      </div>
      <div className="a-tools">
        <input className="a-search" type="search" placeholder="Nomi bo‘yicha qidirish" aria-label="Mahsulot qidirish" value={q} onChange={e => setQ(e.target.value)} />
        <select value={cat} onChange={e => setCat(e.target.value)} aria-label="Bo‘lim">
          <option value="">Barcha bo‘limlar</option>
          {meta.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {error && <p className="a-err">{error}</p>}

      <div className="a-table-wrap">
        <table className="a-table">
          <thead><tr><th /><th>Nomi</th><th className="r">Narxi</th><th>Saytda</th><th /></tr></thead>
          <tbody>
            {shown.map(p => (
              <tr key={p.id} className={p.active ? '' : 'is-off'}>
                <td className="a-thumb">{p.imgs[0] ? <img src={asset(p.imgs[0])} alt="" /> : <span className="a-noimg" />}</td>
                <td><b>{p.name}</b><br /><small>{names[p.cat] ?? p.cat}{p.tag && ` · ${p.tag}`}</small></td>
                <td className="r nw">{fmt(p.price)}{p.old > 0 && <><br /><s>{fmt(p.old)}</s></>}</td>
                <td>
                  <button className={'a-toggle' + (p.active ? ' on' : '')} onClick={() => toggle(p)} aria-pressed={p.active}>
                    {p.active ? 'Sotuvda' : 'Yashirilgan'}
                  </button>
                </td>
                <td className="r"><button className="a-btn" onClick={() => setEdit({ id: p.id, draft: { ...p } })}>Tahrirlash</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!shown.length && <p className="a-muted">Hech narsa topilmadi.</p>}
      </div>

      {edit && (
        <ProductEditor
          id={edit.id}
          initial={edit.draft}
          meta={meta}
          onClose={() => setEdit(null)}
          onSaved={() => { setEdit(null); load() }}
        />
      )}
    </section>
  )
}

function ProductEditor({ id, initial, meta, onClose, onSaved }: {
  id: string | null; initial: Draft; meta: Meta; onClose: () => void; onSaved: () => void
}) {
  const [d, setD] = useState<Draft>(initial)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const set = (patch: Partial<Draft>) => setD(prev => ({ ...prev, ...patch }))

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [onClose])

  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    setError('')
    try {
      for (const f of Array.from(files)) {
        const body = new FormData()
        body.append('file', f)
        const r = await adminApi<{ url: string }>('/api/admin/uploads', { method: 'POST', body })
        setD(prev => ({ ...prev, imgs: [...prev.imgs, r.url].slice(0, 10) }))
      }
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const moveFirst = (i: number) => set({ imgs: [d.imgs[i], ...d.imgs.filter((_, j) => j !== i)] })
  const setColor = (i: number, patch: Partial<Draft['colors'][number]>) =>
    set({ colors: d.colors.map((c, j) => (j === i ? { ...c, ...patch } : c)) })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (id) await send('PUT', `/api/admin/products/${id}`, d)
      else await send('POST', '/api/admin/products', d)
      onSaved()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!id || !confirm(`«${initial.name}» butunlay o‘chirilsinmi? Buni qaytarib bo‘lmaydi. Vaqtincha yashirish uchun “Sotuvda” belgisini olib tashlang.`)) return
    setBusy(true)
    try {
      await send('DELETE', `/api/admin/products/${id}`)
      onSaved()
    } catch (err) {
      setError((err as Error).message)
      setBusy(false)
    }
  }

  return (
    <div className="a-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <form className="a-panel a-form wide" role="dialog" aria-modal="true" aria-labelledby="pe-title" onSubmit={submit}>
        <div className="a-panel-head">
          <h2 id="pe-title">{id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h2>
          <button type="button" className="a-x" onClick={onClose} aria-label="Yopish">×</button>
        </div>

        <label>Nomi<input value={d.name} onChange={e => set({ name: e.target.value })} required maxLength={120} placeholder="Masalan, Oxford ko‘ylak" /></label>
        <div className="a-row">
          <label>Bo‘lim
            <select value={d.cat} onChange={e => set({ cat: e.target.value })}>
              {meta.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label>O‘lchamlar
            <select value={d.sz} onChange={e => set({ sz: e.target.value })}>
              {Object.entries(meta.sizes).map(([k, v]) => <option key={k} value={k}>{SIZE_GROUP[k] ?? k}: {v.join(', ')}</option>)}
            </select>
          </label>
        </div>
        <div className="a-row">
          <label>Narxi, so‘m<input type="number" min={0} step={1000} value={d.price} onChange={e => set({ price: Number(e.target.value) })} required /></label>
          <label>Eski narxi, so‘m <small>(chegirma bo‘lsa)</small><input type="number" min={0} step={1000} value={d.old} onChange={e => set({ old: Number(e.target.value) })} /></label>
        </div>

        <fieldset>
          <legend>Rasmlar <small>(birinchisi asosiy, 10 tagacha, har biri 5 MB gacha)</small></legend>
          <div className="a-imgs">
            {d.imgs.map((src, i) => (
              <figure key={src + i}>
                <img src={asset(src)} alt={`${i + 1}-rasm`} />
                <div>
                  {i > 0 && <button type="button" onClick={() => moveFirst(i)}>Asosiy qilish</button>}
                  <button type="button" onClick={() => set({ imgs: d.imgs.filter((_, j) => j !== i) })}>O‘chirish</button>
                </div>
              </figure>
            ))}
            {d.imgs.length < 10 && (
              <label className="a-upload">
                {uploading ? 'Yuklanmoqda…' : '+ Rasm qo‘shish'}
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading} onChange={e => { upload(e.target.files); e.target.value = '' }} />
              </label>
            )}
          </div>
          {!d.imgs.length && (
            <label>Rasm bo‘lmaganda chiziladigan shakl
              <select value={d.type} onChange={e => set({ type: e.target.value })}>
                {ART.map(([k, n]) => <option key={k} value={k}>{n}</option>)}
              </select>
            </label>
          )}
        </fieldset>

        <fieldset>
          <legend>Ranglar</legend>
          {d.colors.map((c, i) => (
            <div className="a-color" key={i}>
              <input type="color" value={c.c} onChange={e => setColor(i, { c: e.target.value.toUpperCase() })} aria-label={`${i + 1}-rang`} />
              <input value={c.n} onChange={e => setColor(i, { n: e.target.value })} placeholder="Rang nomi" maxLength={40} required />
              {d.colors.length > 1 && <button type="button" onClick={() => set({ colors: d.colors.filter((_, j) => j !== i) })}>O‘chirish</button>}
            </div>
          ))}
          <button type="button" className="a-btn" onClick={() => set({ colors: [...d.colors, { n: '', c: '#8E9196' }] })}>+ Rang qo‘shish</button>
        </fieldset>

        <label>Tavsif<textarea rows={3} value={d.desc} onChange={e => set({ desc: e.target.value })} maxLength={2000} /></label>
        <div className="a-row">
          <label>Material<input value={d.mat} onChange={e => set({ mat: e.target.value })} maxLength={200} placeholder="100% paxta" /></label>
          <label>Ishlab chiqarilgan<input value={d.made} onChange={e => set({ made: e.target.value })} maxLength={100} placeholder="Turkiya" /></label>
        </div>
        <div className="a-row">
          <label>Yorliq <small>(rasm ustida: Xit, Yangi, -20%)</small><input value={d.tag} onChange={e => set({ tag: e.target.value })} maxLength={30} /></label>
          <label>Tartib raqami <small>(kichigi oldinda)</small><input type="number" value={d.sort} onChange={e => set({ sort: Number(e.target.value) })} /></label>
        </div>
        <div className="a-checks">
          <label><input type="checkbox" checked={d.active} onChange={e => set({ active: e.target.checked })} /> Saytda sotuvda</label>
          <label><input type="checkbox" checked={d.isNew} onChange={e => set({ isNew: e.target.checked })} /> “Yangi kelganlar” ro‘yxatida</label>
        </div>

        {error && <p className="a-err" role="alert">{error}</p>}
        <div className="a-actions">
          <button className="a-btn primary" disabled={busy || uploading}>{busy ? 'Saqlanmoqda…' : 'Saqlash'}</button>
          <button type="button" className="a-btn" onClick={onClose}>Bekor qilish</button>
          {id && <button type="button" className="a-btn danger" onClick={remove} disabled={busy}>O‘chirish</button>}
        </div>
      </form>
    </div>
  )
}
