import { useRef, useState } from 'react'
import { byId, CN, FREE_FROM, SHIP_FEE, SIZES } from '../data/catalog'
import { useStore } from '../store'
import { fmt, reducedMotion } from '../lib/util'
import { Art, BackButton, FavButton, Icon } from '../components/ui'

export function Product() {
  const { s, dispatch, toast, tab, openSheet } = useStore()
  const p = byId(s.pid)
  const [color, setColor] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [tabI, setTab] = useState(0)
  const [hint, setHint] = useState(false)
  const [shake, setShake] = useState(0)
  const [img, setImg] = useState(0)
  const galRef = useRef<HTMLDivElement>(null)
  const sizesRef = useRef<HTMLDivElement>(null)
  if (!p) return null

  const col = p.colors[color] ?? p.colors[0]
  const pct = p.old ? Math.round((1 - p.price / p.old) * 100) : 0
  const photo = p.imgs.length > 0
  const smooth: ScrollBehavior = reducedMotion() ? 'auto' : 'smooth'

  const add = () => {
    if (!size) {
      setHint(true)
      setShake(n => n + 1)
      sizesRef.current?.scrollIntoView({ block: 'center', behavior: smooth })
      return
    }
    dispatch({ type: 'add', line: { id: p.id, ci: color, size, qty } })
    toast('Savatga qo‘shildi', 'Savatga o‘tish', () => tab('cart'))
  }

  const care = p.cat === 'oyoq' || p.cat === 'aksessuar' ? 'Nam latta bilan arting' : p.cat === 'doppi' ? 'Faqat quruq tozalash' : '30°C da yuvish, past haroratda dazmollash'
  const tabs = [
    <p key="d">{p.desc}</p>,
    <dl key="m" className="spec"><dt>Material</dt><dd>{p.mat}</dd><dt>Ishlab chiqarilgan</dt><dd>{p.made}</dd><dt>Ranglar</dt><dd>{p.colors.map(c => c.n).join(', ')}</dd><dt>Parvarish</dt><dd>{care}</dd></dl>,
    <dl key="s" className="spec"><dt>Toshkent</dt><dd>1–2 kun, {fmt(SHIP_FEE)}</dd><dt>Bepul</dt><dd>{fmt(FREE_FROM)} dan ortiq buyurtmaga</dd><dt>Olib ketish</dt><dd>Do‘kondan bepul</dd><dt>Almashtirish</dt><dd>14 kun ichida, yorlig‘i bilan</dd></dl>,
  ]

  return (
    <>
      <div className={'pv' + (photo ? '' : ' svg')} style={{ ['--t' as string]: p.tint }}>
        <div className="pvbar"><BackButton white /><FavButton id={p.id} variant="page" /></div>
        {photo ? (
          <>
            <div className="gal" id="gal" ref={galRef} onScroll={e => setImg(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
              {p.imgs.map((src, i) => <img key={src} src={src} alt={p.name + (i ? ' (2-rasm)' : '')} />)}
            </div>
            {p.imgs.length > 1 && (
              <div className="gdots">
                {p.imgs.map((src, i) => (
                  <button key={src} className={i === img ? 'on' : ''} aria-label={`${i + 1}-rasm`}
                    onClick={() => galRef.current?.scrollTo({ left: galRef.current.clientWidth * i, behavior: smooth })}>
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="big"><Art t={p.type} c={col.c} a={p.acc} /></div>
        )}
      </div>

      <div className="pd">
        <span className="pcat">{CN[p.cat]} · {p.made}</span>
        <h1>{p.name}</h1>
        <div className="rate"><Icon n="star" /><b>{p.rating.toFixed(1)}</b><span>· {p.rev} ta sharh</span></div>
        <div className="price"><b>{fmt(p.price)}</b>{p.old > 0 && <><s>{fmt(p.old)}</s><em>−{pct}%</em></>}</div>

        <div className="row"><h4>Rang: <span>{col.n}</span></h4></div>
        <div className="sw">
          {p.colors.map((c, i) => <button key={c.n} className={i === color ? 'on' : ''} style={{ ['--c' as string]: c.c }} onClick={() => setColor(i)} aria-label={c.n} title={c.n} />)}
        </div>

        <div className="row">
          <h4>O‘lcham{size && <>: <span>{size}</span></>}</h4>
          <button className="lnk" onClick={() => openSheet({ kind: 'guide' })}><Icon n="ruler" />O‘lcham jadvali</button>
        </div>
        <div className={'sizes' + (shake ? ' err' : '')} key={shake} id="sizes" ref={sizesRef}>
          {SIZES[p.sz].map(z => <button key={z} className={size === z ? 'on' : ''} onClick={() => { setSize(z); setHint(false) }}>{z}</button>)}
        </div>
        <p className="hint" hidden={!hint}>Avval o‘lchamni tanlang</p>

        <div className="tabs">{['Tavsif', 'Tarkibi', 'Yetkazish'].map((n, i) => <button key={n} className={tabI === i ? 'on' : ''} onClick={() => setTab(i)}>{n}</button>)}</div>
        <div className="tabc">{tabs[tabI]}</div>
      </div>

      <div className="buy">
        <div className="qty">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Kamaytirish"><Icon n="minus" /></button>
          <b>{qty}</b>
          <button onClick={() => setQty(q => Math.min(10, q + 1))} aria-label="Ko‘paytirish"><Icon n="plus" /></button>
        </div>
        <button className="cta" id="addBtn" onClick={add}>Savatga qo‘shish <span>{fmt(p.price * qty)}</span></button>
      </div>
    </>
  )
}
