import { useEffect, useRef, useState } from 'react'
import { cartCount, useStore, type Screen } from '../store'
import { Icon } from './ui'
import { SizeGuide } from './SizeGuide'
import type { SheetKind } from '../store'

/* App chrome: bottom nav (phone), top header (desktop), toast, sheet host */

const TAB_OF: Record<Screen, Screen> = {
  home: 'home', catalog: 'catalog', category: 'catalog', cart: 'cart', profile: 'profile', favs: 'profile', product: 'home', success: 'home',
}
export const NO_NAV: Screen[] = ['product', 'success']

export function BottomNav() {
  const { s, tab } = useStore()
  const n = cartCount(s)
  const items: [Screen, string, string][] = [['home', 'home', 'Asosiy'], ['catalog', 'grid', 'Katalog'], ['cart', 'bag', 'Savat'], ['profile', 'user', 'Profil']]
  return (
    <nav className="nav" hidden={NO_NAV.includes(s.screen)} aria-label="Asosiy menyu">
      {items.map(([sc, ic, label]) => (
        <button key={sc} className={TAB_OF[s.screen] === sc ? 'on' : ''} onClick={() => tab(sc)}>
          <Icon n={ic} /><span>{label}</span>
          {sc === 'cart' && n > 0 && <i className="nb">{n}</i>}
        </button>
      ))}
    </nav>
  )
}

export function DesktopHeader() {
  const { s, dispatch, tab, go } = useStore()
  const active = TAB_OF[s.screen]
  const n = cartCount(s)
  const onSearch = (q: string) => {
    dispatch({ type: 'set', patch: { q } })
    if (s.screen !== 'home') tab('home')
  }
  return (
    <header className="dhead"><div className="in">
      <button className="dlogo" onClick={() => dispatch({ type: 'set', patch: { landing: true } })}><span className="mark">B</span>Bosmenti</button>
      <nav className="dlinks">
        <button className={active === 'home' ? 'on' : ''} onClick={() => tab('home')}>Asosiy</button>
        <button className={active === 'catalog' ? 'on' : ''} onClick={() => tab('catalog')}>Katalog</button>
        <button onClick={() => dispatch({ type: 'set', patch: { landing: true } })}>Do‘kon haqida</button>
      </nav>
      <label className="dsearch"><Icon n="search" />
        <input id="dq" type="search" placeholder="Kiyim qidirish" autoComplete="off" aria-label="Kiyim qidirish" value={s.q} onChange={e => onSearch(e.target.value)} />
      </label>
      <div className="dicons">
        <button className={'ib' + (s.screen === 'favs' ? ' on' : '')} onClick={() => go('favs')} aria-label="Sevimlilar">
          <Icon n="heart" />{s.fav.length > 0 && <i className="bdg">{s.fav.length}</i>}
        </button>
        <button className={'ib' + (active === 'cart' ? ' on' : '')} onClick={() => tab('cart')} aria-label="Savat">
          <Icon n="bag" />{n > 0 && <i className="bdg">{n}</i>}
        </button>
        <button className={'ib' + (active === 'profile' && s.screen !== 'favs' ? ' on' : '')} onClick={() => tab('profile')} aria-label="Profil">
          <Icon n="user" />
        </button>
      </div>
    </div></header>
  )
}

export function Toast() {
  const { toastData } = useStore()
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!toastData) return
    setShow(true)
    const t = setTimeout(() => setShow(false), 2800)
    return () => clearTimeout(t)
  }, [toastData])
  return (
    <div className={'toast' + (show ? ' show' : '')} role="status">
      <Icon n="check" /><span className="tm">{toastData?.msg}</span>
      {toastData?.btn && <button onClick={() => { setShow(false); toastData.act?.() }}>{toastData.btn}</button>}
    </div>
  )
}

export function SheetHost() {
  const { sheet, closeSheet } = useStore()
  // keep the last sheet's content on screen while it slides away
  const last = useRef<SheetKind | null>(null)
  if (sheet) last.current = sheet
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSheet() }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [closeSheet])
  const k = last.current
  return (
    <div className={'ov' + (sheet ? ' open' : '')} onClick={e => { if (e.target === e.currentTarget) closeSheet() }}>
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="grab" />
        {k?.kind === 'guide' && <SizeGuide />}
      </div>
    </div>
  )
}
