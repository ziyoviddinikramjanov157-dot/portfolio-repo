import { useEffect, useRef, useState } from 'react'
import { byId, SHOP } from '../data/catalog'
import { cartCount, shipFee, STATUS_LABEL, subTotal, useStore, type Order, type State } from '../store'
import { ApiError, asset, post } from '../lib/api'
import { fmt, fmtDate, fmtPh } from '../lib/util'
import { Icon, Pic } from '../components/ui'

/* Cart, profile and order-confirmation screens */

const payLabel = (o: Pick<Order, 'pay' | 'cardType'>) => (o.pay === 'cash' ? 'Naqd pul' : `Karta${o.cardType ? ` (${o.cardType})` : ''}`)
const shipLabel = (o: Pick<Order, 'ship'>) => (o.ship === 'pickup' ? 'Do‘kondan olish' : 'Yetkazib berish')
const itemCount = (o: Order) => o.items.reduce((a, i) => a + i.qty, 0)
/** "+998901234567" -> "+998 90 123 45 67" */
const showPhone = (p: string) => `+998 ${fmtPh(p.replace(/^\+998/, ''))}`

/** "+998 90 123-45-67", "998901234567" or "90 123 45 67" -> "901234567" */
const phoneDigits = (v: string) => {
  let d = v.replace(/\D/g, '')
  if (d.startsWith('998') && d.length > 9) d = d.slice(3)
  return d.slice(0, 9)
}

type Field = 'name' | 'phone' | 'addr'

export function Cart() {
  const { s, dispatch, tab, toast, openProduct, placeOrder } = useStore()
  const [bad, setBad] = useState<Field | null>(null)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const refs = { name: useRef<HTMLInputElement>(null), phone: useRef<HTMLInputElement>(null), addr: useRef<HTMLInputElement>(null) }

  if (!s.cart.length)
    return (
      <>
        <header className="top pad"><h1 className="ttl">Savat</h1></header>
        <div className="empty">
          <div className="ea"><img src="img/p-tee.jpg" alt="" /></div>
          <h2>Savat bo‘sh</h2><p>Kiyimni tanlang, o‘lchamini belgilang va shu yerga qo‘shing.</p>
          <button className="cta" onClick={() => tab('home')}>Xaridni boshlash</button>
        </div>
      </>
    )

  const sub = subTotal(s), fee = shipFee(s), left = SHOP.freeFrom - sub, total = sub + fee
  const set = (patch: Partial<State>) => dispatch({ type: 'set', patch })
  const setContact = (patch: Partial<State['contact']>) => set({ contact: { ...s.contact, ...patch } })
  const fix = (f: Field) => { if (bad === f) setBad(null) }

  const fail = (f: Field, msg: string) => {
    setBad(f)
    setError(msg)
    refs[f].current?.focus()
  }

  const checkout = async () => {
    setError('')
    if (s.contact.name.trim().length < 2) return fail('name', 'Ismingizni kiriting')
    if (s.contact.phone.length !== 9) return fail('phone', 'Telefon raqamni to‘liq kiriting: 9 ta raqam')
    if (s.ship === 'delivery' && s.addr.trim().length < 5) return fail('addr', 'Yetkazib berish manzilini kiriting')
    setSending(true)
    try {
      await placeOrder()
    } catch (e) {
      const err = e as ApiError
      const at = (err.details as { index?: number } | undefined)?.index
      // the shop changed or removed this item since the page was opened
      if (err.status === 409 && typeof at === 'number') dispatch({ type: 'rm', i: at })
      setError(err.message)
      toast(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <header className="top pad"><h1 className="ttl">Savat</h1><span className="cnt">{cartCount(s)} ta mahsulot</span></header>
      <div className="pad cartwrap">
        <div className="cl"><div className="list">
          {s.cart.map((l, i) => {
            const p = byId(l.id)!, c = p.colors[l.ci] ?? p.colors[0]
            return (
              <div className="crow" key={`${l.id}-${l.ci}-${l.size}`}>
                <button className="th" style={{ ['--t' as string]: p.tint }} onClick={() => openProduct(p.id)} aria-label={p.name}><Pic p={p} /></button>
                <div className="tx">
                  <div className="tt"><h3>{p.name}</h3><button className="rm" onClick={() => { dispatch({ type: 'rm', i }); toast('Savatdan olib tashlandi') }} aria-label="O‘chirish"><Icon n="x" /></button></div>
                  <small>{c.n} · O‘lcham {l.size}</small>
                  <div className="bt"><b>{fmt(p.price * l.qty)}</b>
                    <div className="qty sm">
                      <button onClick={() => dispatch({ type: 'cq', i, d: -1 })} aria-label="Kamaytirish"><Icon n="minus" /></button>
                      <b>{l.qty}</b>
                      <button onClick={() => dispatch({ type: 'cq', i, d: 1 })} aria-label="Ko‘paytirish"><Icon n="plus" /></button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div></div>

        <div className="cr">
          <h3 className="h3">Aloqa</h3>
          <div className="field"><label htmlFor="cname">Ismingiz</label>
            <input ref={refs.name} id="cname" className={bad === 'name' ? 'bad' : ''} autoComplete="name" placeholder="Masalan, Aziz" maxLength={60}
              value={s.contact.name} onChange={e => { setContact({ name: e.target.value }); fix('name') }} />
          </div>
          <div className="field"><label htmlFor="cphone">Telefon raqam</label>
            <div className={'pfx' + (bad === 'phone' ? ' bad' : '')}><span>+998</span>
              <input ref={refs.phone} id="cphone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="90 123 45 67"
                value={fmtPh(s.contact.phone)} onChange={e => { setContact({ phone: phoneDigits(e.target.value) }); fix('phone') }} />
            </div>
          </div>

          <h3 className="h3">Qabul qilish</h3>
          <div className="seg">
            <button className={s.ship === 'delivery' ? 'on' : ''} onClick={() => set({ ship: 'delivery' })}>Yetkazib berish</button>
            <button className={s.ship === 'pickup' ? 'on' : ''} onClick={() => set({ ship: 'pickup' })}>Do‘kondan olish</button>
          </div>
          {s.ship === 'delivery' ? (
            <>
              <div className="field"><label htmlFor="addr">Manzil</label>
                <input ref={refs.addr} id="addr" className={bad === 'addr' ? 'bad' : ''} placeholder="Tuman, ko‘cha, uy, xonadon" autoComplete="street-address" maxLength={200}
                  value={s.addr} onChange={e => { set({ addr: e.target.value }); fix('addr') }} />
              </div>
              {left > 0
                ? <div className="free">Bepul yetkazib berishgacha yana <b>{fmt(left)}</b><div className="bar"><i style={{ width: `${Math.min(100, (sub / SHOP.freeFrom) * 100)}%` }} /></div></div>
                : <div className="free ok">Yetkazib berish bepul</div>}
            </>
          ) : (
            <div className="store"><Icon n="store" /><div><b>Bosmenti do‘koni</b><small>{[SHOP.address, SHOP.hours].filter(Boolean).join(' · ') || 'Manzilni operator aytadi'}</small></div></div>
          )}

          <h3 className="h3">To‘lov usuli</h3>
          <div className="pays">
            <button className={'pay' + (s.pay === 'cash' ? ' on' : '')} data-v="cash" onClick={() => set({ pay: 'cash' })}><span className="ck"><Icon n="check" /></span><Icon n="cash" /><b>Naqd pul</b><small>Qabul qilganda to‘laysiz</small></button>
            <button className={'pay' + (s.pay === 'card' ? ' on' : '')} data-v="card" onClick={() => set({ pay: 'card' })}><span className="ck"><Icon n="check" /></span><Icon n="card" /><b>Karta</b><small>Uzcard · Humo · Visa</small></button>
          </div>
          {s.pay === 'card' && (
            <>
              <div className="ctypes">{['Uzcard', 'Humo', 'Visa'].map(t => <button key={t} className={s.ctype === t ? 'on' : ''} onClick={() => set({ ctype: t })}>{t}</button>)}</div>
              <p className="note">Kartadan kiyimni qabul qilganda to‘laysiz: kuryerga yoki do‘konda.</p>
            </>
          )}

          <div className="sum">
            <div><span>Mahsulotlar ({cartCount(s)})</span><b>{fmt(sub)}</b></div>
            <div><span>Yetkazib berish</span><b className={fee ? '' : 'ok'}>{fee ? fmt(fee) : 'Bepul'}</b></div>
            <div className="tot"><span>Jami</span><b>{fmt(total)}</b></div>
          </div>
          {error && <p className="ferr" role="alert">{error}</p>}
          <button className="cta wide" id="checkout" onClick={checkout} disabled={sending}>
            {sending ? 'Yuborilmoqda…' : <>Buyurtma berish <span>{fmt(total)}</span></>}
          </button>
          <p className="note" style={{ textAlign: 'center' }}>Operator qo‘ng‘iroq qilib, buyurtmani tasdiqlaydi</p>
        </div>
      </div>
    </>
  )
}

export function Profile() {
  const { s, dispatch, go, tab } = useStore()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!s.mine.length) {
      setOrders([])
      return
    }
    let alive = true
    post<{ orders: Order[] }>('/api/orders/lookup', { tokens: s.mine.map(m => m.token) }).then(
      r => alive && setOrders(r.orders),
      (e: Error) => alive && setError(e.message),
    )
    return () => { alive = false }
  }, [s.mine])

  const c = s.contact
  return (
    <>
      <header className="top pad"><h1 className="ttl">Profil</h1></header>
      <div className="pad">
        {c.name || c.phone ? (
          <div className="pcard"><div className="ava"><Icon n="user" /></div><div><p>{c.name || 'Telefon raqam'}</p>{c.phone && <div className="ph1">+998 {fmtPh(c.phone)}</div>}</div></div>
        ) : (
          <div className="pcard">
            <div className="ava"><Icon n="bag" /></div><h2>Buyurtmalaringiz shu yerda</h2>
            <p>Ro‘yxatdan o‘tish kerak emas. Buyurtma berganingizdan keyin uning holatini shu yerda kuzatasiz.</p>
            <button className="cta brass" onClick={() => tab('home')}>Xaridni boshlash</button>
          </div>
        )}

        <h3 className="h3">Buyurtmalarim</h3>
        {error ? <p className="note">{error}</p>
          : !orders ? <p className="note">Yuklanmoqda…</p>
          : orders.length ? (
            <div className="menu">
              {orders.map(o => (
                <div className="ord" key={o.no}>
                  <span className="mi">{o.items[0]?.image ? <img src={asset(o.items[0].image)} alt="" /> : <Icon n="box" />}</span>
                  <span className="mt"><b>№ {o.no}</b><small>{fmtDate(o.createdAt)} · {itemCount(o)} ta · {fmt(o.total)}<br />{shipLabel(o)} · {payLabel(o)}</small></span>
                  <span className={`st st-${o.status}`}>{STATUS_LABEL[o.status]}</span>
                </div>
              ))}
            </div>
          ) : <p className="note">Hali buyurtma yo‘q.</p>}

        <div className="menu">
          <button onClick={() => go('favs')}><span className="mi"><Icon n="heart" /></span><span className="mt"><b>Sevimlilar</b><small>{s.fav.length} ta mahsulot</small></span><Icon n="chev" className="chev" /></button>
          <button onClick={() => dispatch({ type: 'set', patch: { landing: true } })}><span className="mi"><Icon n="info" /></span><span className="mt"><b>Do‘kon haqida</b><small>Bosmenti, manzil, ish vaqti</small></span><Icon n="chev" className="chev" /></button>
          {SHOP.phone && (
            <a href={`tel:${SHOP.phone.replace(/[^\d+]/g, '')}`}><span className="mi"><Icon n="phone" /></span><span className="mt"><b>Aloqa</b><small>{SHOP.phone}</small></span><Icon n="chev" className="chev" /></a>
          )}
        </div>
      </div>
    </>
  )
}

export function Success() {
  const { s, tab } = useStore()
  const o = s.last
  if (!o) return null
  return (
    <div className="okw">
      <div className="okc"><Icon n="check" /></div>
      <h1>Buyurtma qabul qilindi</h1>
      <p>Buyurtma raqami <b>№ {o.no}</b></p>
      <div className="sum">
        <div><span>Mahsulotlar</span><b>{itemCount(o)} ta</b></div>
        <div><span>Qabul qilish</span><b>{shipLabel(o)}</b></div>
        <div><span>To‘lov</span><b>{payLabel(o)}</b></div>
        <div className="tot"><span>Jami</span><b>{fmt(o.total)}</b></div>
      </div>
      <p className="note">Operator tez orada {showPhone(o.phone)} raqamiga qo‘ng‘iroq qilib, buyurtmani tasdiqlaydi. Buyurtma holatini “Profil” bo‘limida kuzatasiz.</p>
      <button className="cta wide" onClick={() => tab('home')}>Xaridni davom ettirish</button>
      <button className="ghost" onClick={() => tab('profile')}>Buyurtmalarim</button>
    </div>
  )
}
