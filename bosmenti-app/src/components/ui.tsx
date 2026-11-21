import { artInner, type ArtType } from '../lib/art'
import { CATS, CN, PRODUCTS, type CatId, type Product } from '../data/catalog'
import { fmt } from '../lib/util'
import { asset } from '../lib/api'
import { useStore } from '../store'
import type { KeyboardEvent, MouseEvent } from 'react'

/** Icon from the sprite in index.html */
export function Icon({ n, className }: { n: string; className?: string }) {
  return <svg className={'i' + (className ? ' ' + className : '')}><use href={`#i-${n}`} /></svg>
}

/** Flat drawing used where a product has no photo yet.
 *  The markup is built only from catalogue constants (never from user input), so injecting it is safe. */
export function Art({ t, c, a }: { t: ArtType; c: string; a?: string }) {
  return <svg className="art" viewBox="0 0 200 200" aria-hidden="true" dangerouslySetInnerHTML={{ __html: artInner(t, c, a) }} />
}

/** Product photo, or the drawing if there is no photo */
export function Pic({ p, i = 0, lazy = true }: { p: Product; i?: number; lazy?: boolean }) {
  return p.imgs[i]
    ? <img src={asset(p.imgs[i])} alt={p.name} loading={lazy ? 'lazy' : undefined} />
    : <Art t={p.type} c={p.colors[0].c} a={p.acc} />
}

/** First photo of a category, or its drawing */
export function CatPic({ id }: { id: CatId }) {
  const p = PRODUCTS.find(x => x.cat === id && x.imgs.length)
  const c = CATS.find(x => x.id === id)!
  return p ? <img src={asset(p.imgs[0])} alt="" loading="lazy" /> : <Art t={c.type} c={c.c} />
}

export function BackButton({ white }: { white?: boolean }) {
  const { back } = useStore()
  return <button className={'ib' + (white ? ' w' : '')} onClick={back} aria-label="Orqaga"><Icon n="back" /></button>
}

export function FavButton({ id, variant }: { id: string; variant: 'card' | 'page' }) {
  const { s, dispatch, toast } = useStore()
  const on = s.fav.includes(id)
  const click = (e: MouseEvent) => {
    e.stopPropagation()
    if (!on) toast('Sevimlilarga qo‘shildi')
    dispatch({ type: 'fav', id })
  }
  return (
    <button className={(variant === 'card' ? 'fav' : 'ib w') + (on ? ' on' : '')} onClick={click}
      aria-label={on ? 'Sevimlilardan olib tashlash' : 'Sevimlilarga qo‘shish'} aria-pressed={on}>
      <Icon n="heart" />
    </button>
  )
}

export function ProductCard({ p }: { p: Product }) {
  const { openProduct } = useStore()
  const open = () => openProduct(p.id)
  const key = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }
  return (
    <article className="pc" onClick={open} onKeyDown={key} role="button" tabIndex={0} aria-label={p.name}>
      <div className="ph" style={{ ['--t' as string]: p.tint }}>
        {p.tag && <span className={'tag' + (p.old ? ' s' : '')}>{p.tag}</span>}
        <FavButton id={p.id} variant="card" />
        <Pic p={p} />
      </div>
      <div className="pi">
        <span className="pcat">{CN[p.cat]}</span>
        <h3>{p.name}</h3>
        <div className="pr"><b>{fmt(p.price)}</b>{p.old > 0 && <s>{fmt(p.old)}</s>}</div>
        <div className="dots">{p.colors.map(c => <i key={c.n} style={{ ['--c' as string]: c.c }} title={c.n} />)}</div>
      </div>
    </article>
  )
}

export function ProductGrid({ list, style }: { list: Product[]; style?: React.CSSProperties }) {
  return (
    <div className="grid pad" style={style}>
      {list.length
        ? list.map(p => <ProductCard key={p.id} p={p} />)
        : <p className="none">Hech narsa topilmadi. Boshqa so‘z bilan qidirib ko‘ring.</p>}
    </div>
  )
}
