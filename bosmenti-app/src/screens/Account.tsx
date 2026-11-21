import { useRef, useState } from 'react'
import { byId, FREE_FROM } from '../data/catalog'
import { cartCount, shipFee, subTotal, useStore, type State } from '../store'
import { fmt, fmtPh } from '../lib/util'
import { Icon, Pic } from '../components/ui'

/* Cart, profile and order-confirmation screens */

export function Cart() {
  const { s, dispatch, tab, toast, openProduct, openSheet, placeOrder } = useStore()
  const [bad, setBad] = useState(false)
  const addrRef = useRef<HTMLInputElement>(null)

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

  const sub = subTotal(s), fee = shipFee(s), left = FREE_FROM - sub, total = sub + fee
  const set = (patch: Partial<State>) => dispatch({ type: 'set', patch })

  const checkout = () => {
    if (s.ship === 'delivery' && s.addr.trim().length < 5) {
      setBad(true)
      addrRef.current?.focus()
      toast('Yetkazib berish manzilini kiriting')
      return
    }
    if (!s.user) { openSheet({ kind: 'login', after: 'checkout' }); return }
    placeOrder()
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
          <h3 className="h3">Qabul qilish</h3>
          <div className="seg">
            <button className={s.ship === 'delivery' ? 'on' : ''} onClick={() => set({ ship: 'delivery' })}>Yetkazib berish</button>
            <button className={s.ship === 'pickup' ? 'on' : ''} onClick={() => set({ ship: 'pickup' })}>Do‘kondan olish</button>
          </div>
          {s.ship === 'delivery' ? (
            <>
              <div className="field"><label htmlFor="addr">Manzil</label>
                <input ref={addrRef} id="addr" className={bad ? 'bad' : ''} placeholder="Tuman, ko‘cha, uy, xonadon" autoComplete="street-address" value={s.addr}
                  onChange={e => { set({ addr: e.target.value }); setBad(false) }} />
              </div>
              {left > 0
                ? <div className="free">Bepul yetkazib berishgacha yana <b>{fmt(left)}</b><div className="bar"><i style={{ width: `${Math.min(100, (sub / FREE_FROM) * 100)}%` }} /></div></div>
                : <div className="free ok">Yetkazib berish bepul</div>}
            </>
          ) : (
            <div className="store"><Icon n="store" /><div><b>Bosmenti do‘koni</b><small>Toshkent sh. · Har kuni 09:00–21:00</small></div></div>
          )}

          <h3 className="h3">To‘lov usuli</h3>
          <div className="pays">
            <button className={'pay' + (s.pay === 'cash' ? ' on' : '')} data-v="cash" onClick={() => set({ pay: 'cash' })}><span className="ck"><Icon n="check" /></span><Icon n="cash" /><b>Naqd pul</b><small>Qabul qilganda to‘laysiz</small></button>
            <button className={'pay' + (s.pay === 'card' ? ' on' : '')} data-v="card" onClick={() => set({ pay: 'card' })}><span className="ck"><Icon n="check" /></span><Icon n="card" /><b>Karta</b><small>Uzcard · Humo · Visa</small></button>
          </div>
          {s.pay === 'card' && (
            <>
              <div className="ctypes">{['Uzcard', 'Humo', 'Visa'].map(t => <button key={t} className={s.ctype === t ? 'on' : ''} onClick={() => set({ ctype: t })}>{t}</button>)}</div>
              <p className="note">Buyurtma berilgach, xavfsiz to‘lov sahifasi ochiladi. Demo versiyada to‘lov amalga oshirilmaydi.</p>
            </>
          )}

          <div className="sum">
            <div><span>Mahsulotlar ({cartCount(s)})</span><b>{fmt(sub)}</b></div>
            <div><span>Yetkazib berish</span><b className={fee ? '' : 'ok'}>{fee ? fmt(fee) : 'Bepul'}</b></div>
            <div className="tot"><span>Jami</span><b>{fmt(total)}</b></div>
          </div>
          <button className="cta wide" id="checkout" onClick={checkout}>Buyurtma berish <span>{fmt(total)}</span></button>
          {!s.user && <p className="note" style={{ textAlign: 'center' }}>Buyurtma berishda telefon raqamingiz so‘raladi</p>}
        </div>
      </div>
    </>
  )
}

export function Profile() {
  const { s, dispatch, go, openSheet, toast } = useStore()
  const u = s.user
  return (
    <>
      <header className="top pad"><h1 className="ttl">Profil</h1></header>
      <div className="pad">
        {u ? (
          <div className="pcard"><div className="ava"><Icon n="user" /></div><div><p>Telefon raqam</p><div className="ph1">+998 {fmtPh(u.phone)}</div></div></div>
        ) : (
          <div className="pcard">
            <div className="ava"><Icon n="phone" /></div><h2>Hisobga kirish</h2>
            <p>Buyurtmalaringiz tarixini ko‘rish uchun telefon raqamingiz bilan kiring. Parol kerak emas.</p>
            <button className="cta brass" onClick={() => openSheet({ kind: 'login' })}>Telefon raqam bilan kirish</button>
          </div>
        )}
        {u && (
          <>
            <h3 className="h3">Buyurtmalarim</h3>
            {s.orders.length ? (
              <div className="menu">
                {s.orders.map(o => (
                  <div className="ord" key={o.no}><span className="mi"><Icon n="box" /></span>
                    <span className="mt"><b>№ {o.no}</b><small>{o.date} · {o.n} ta · {fmt(o.total)}<br />{o.pay}</small></span>
                    <span className="st">Qabul qilindi</span>
                  </div>
                ))}
              </div>
            ) : <p className="note">Hali buyurtma yo‘q.</p>}
          </>
        )}
        <div className="menu">
          <button onClick={() => go('favs')}><span className="mi"><Icon n="heart" /></span><span className="mt"><b>Sevimlilar</b><small>{s.fav.length} ta mahsulot</small></span><Icon n="chev" className="chev" /></button>
          <button onClick={() => dispatch({ type: 'set', patch: { landing: true } })}><span className="mi"><Icon n="info" /></span><span className="mt"><b>Do‘kon haqida</b><small>Bosmenti, manzil, ish vaqti</small></span><Icon n="chev" className="chev" /></button>
          <div><span className="mi"><Icon n="phone" /></span><span className="mt"><b>Aloqa</b><small>+998 00 000 00 00 (demo)</small></span></div>
          {u && <button onClick={() => { dispatch({ type: 'logout' }); toast('Hisobdan chiqdingiz') }}><span className="mi"><Icon n="out" /></span><span className="mt"><b>Chiqish</b><small>Hisobdan chiqish</small></span></button>}
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
        <div><span>Mahsulotlar</span><b>{o.n} ta</b></div>
        <div><span>Qabul qilish</span><b>{o.ship}</b></div>
        <div><span>To‘lov</span><b>{o.pay}</b></div>
        <div className="tot"><span>Jami</span><b>{fmt(o.total)}</b></div>
      </div>
      {s.user && <p className="note">Operator tez orada +998 {fmtPh(s.user.phone)} raqamiga qo‘ng‘iroq qilib, buyurtmani tasdiqlaydi.</p>}
      <button className="cta wide" onClick={() => tab('home')}>Xaridni davom ettirish</button>
      <button className="ghost" onClick={() => tab('profile')}>Buyurtmalarim</button>
    </div>
  )
}
