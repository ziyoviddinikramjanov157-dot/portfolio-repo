import { CATS, CN, PRODUCTS, TINT, type CatId, type Product } from '../data/catalog'
import { useStore, type Sort } from '../store'
import { BackButton, CatPic, Icon, ProductGrid } from '../components/ui'

/* Home, catalogue, category and favourites screens */

function homeList(cat: CatId | 'all', q: string) {
  const t = q.trim().toLowerCase()
  return PRODUCTS.filter(p => (t ? (p.name + ' ' + CN[p.cat]).toLowerCase().includes(t) : cat === 'all' || p.cat === cat))
}

function sorted(list: Product[], sort: Sort) {
  const l = [...list]
  if (sort === 'cheap') l.sort((a, b) => a.price - b.price)
  else if (sort === 'exp') l.sort((a, b) => b.price - a.price)
  return l
}

export function Home() {
  const { s, dispatch, go, tab } = useStore()
  const list = homeList(s.cat, s.q)
  const searching = s.q.trim() !== ''
  const title = searching ? `"${s.q.trim()}" bo‘yicha` : s.cat === 'all' ? 'Barcha kiyimlar' : CN[s.cat]
  const setCat = (cat: CatId | 'all') => dispatch({ type: 'set', patch: { cat } })
  return (
    <>
      <header className="top pad">
        <div><p className="hello">Assalomu alaykum{s.contact.name ? `, ${s.contact.name}` : ''}</p><h1 className="ttl">Bugun nima kiyamiz?</h1></div>
        <button className="ib" onClick={() => go('favs')} aria-label="Sevimlilar"><Icon n="heart" />{s.fav.length > 0 && <i className="bdg">{s.fav.length}</i>}</button>
      </header>
      <div className="pad">
        <label className="search"><Icon n="search" />
          <input id="q" type="search" placeholder="Kiyim qidirish" autoComplete="off" aria-label="Kiyim qidirish" value={s.q} onChange={e => dispatch({ type: 'set', patch: { q: e.target.value } })} />
        </label>
      </div>
      <div className="pad" id="promo" hidden={searching}>
        <button className="promo" onClick={() => go('category', { viewCat: 'sviter', sort: 'pop' })}>
          <div className="pt"><div><small>Kuzgi kolleksiya</small><h3>Sviter va kurtkalar</h3></div><span className="go">Ko‘rish <Icon n="arrow" /></span></div>
          <div className="pm"><span className="pct">−20%</span><img src="img/c-autumn.jpg" alt="" /></div>
        </button>
      </div>
      <div className="sec pad"><h2>Bo‘limlar</h2><button className="lnk" onClick={() => tab('catalog')}>Katalog <Icon n="chev" /></button></div>
      <div className="chips" id="chips">
        <button className={'chip' + (s.cat === 'all' ? ' on' : '')} data-v="all" onClick={() => setCat('all')}><span className="ci"><Icon n="grid" /></span>Hammasi</button>
        {CATS.map(c => (
          <button key={c.id} className={'chip' + (s.cat === c.id ? ' on' : '')} data-v={c.id} onClick={() => setCat(c.id)}>
            <span className="ci"><CatPic id={c.id} /></span>{c.name}
          </button>
        ))}
      </div>
      <div className="sec pad"><h2 id="gt">{title}</h2><span className="cnt" id="gc">{list.length} ta</span></div>
      <ProductGrid list={list} />
    </>
  )
}

export function Catalog() {
  const { go } = useStore()
  const open = (v: CatId | 'all') => go('category', { viewCat: v, sort: 'pop' })
  return (
    <>
      <header className="top pad"><div><p className="hello">{PRODUCTS.length} ta model</p><h1 className="ttl">Katalog</h1></div></header>
      <div className="tiles pad">
        <button className="tile" data-v="all" onClick={() => open('all')}>
          <div className="ta" style={{ ['--t' as string]: '#DDE5DF' }}><Icon n="sparkle" /></div><b>Hammasi</b><span>{PRODUCTS.length} ta mahsulot</span>
        </button>
        {CATS.map((c, i) => (
          <button key={c.id} className="tile" data-v={c.id} onClick={() => open(c.id)}>
            <div className="ta" style={{ ['--t' as string]: TINT[i % TINT.length] }}><CatPic id={c.id} /></div>
            <b>{c.name}</b><span>{PRODUCTS.filter(p => p.cat === c.id).length} ta mahsulot</span>
          </button>
        ))}
      </div>
    </>
  )
}

export function Category() {
  const { s, dispatch } = useStore()
  const all = s.viewCat === 'all'
  const list = sorted(PRODUCTS.filter(p => all || p.cat === s.viewCat), s.sort)
  const sorts: [Sort, string][] = [['pop', 'Tavsiya'], ['cheap', 'Arzonroq'], ['exp', 'Qimmatroq']]
  return (
    <>
      <header className="bh pad"><BackButton /><div><h1 className="ttl">{all ? 'Barcha kiyimlar' : CN[s.viewCat as CatId]}</h1><small>{list.length} ta mahsulot</small></div></header>
      <div className="pad" style={{ marginTop: 18 }}>
        <div className="seg">{sorts.map(([k, n]) => <button key={k} className={s.sort === k ? 'on' : ''} onClick={() => dispatch({ type: 'set', patch: { sort: k } })}>{n}</button>)}</div>
      </div>
      <ProductGrid list={list} style={{ marginTop: 22 }} />
    </>
  )
}

export function Favorites() {
  const { s, tab } = useStore()
  const list = PRODUCTS.filter(p => s.fav.includes(p.id))
  return (
    <>
      <header className="bh pad"><BackButton /><div><h1 className="ttl">Sevimlilar</h1><small>{list.length} ta mahsulot</small></div></header>
      {list.length
        ? <ProductGrid list={list} style={{ marginTop: 22 }} />
        : (
          <div className="empty">
            <div className="ea"><img src="img/p-white.jpg" alt="" /></div>
            <h2>Hali bo‘sh</h2><p>Yoqqan kiyimdagi yurakchani bosing. U shu yerda saqlanadi.</p>
            <button className="cta" onClick={() => tab('home')}>Kiyimlarni ko‘rish</button>
          </div>
        )}
    </>
  )
}
