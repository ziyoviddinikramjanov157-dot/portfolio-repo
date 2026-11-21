import { useEffect, useRef, useState } from 'react'
import { byId, CATS, COLLECTIONS, NEW_ARRIVALS, PRODUCTS, type CatId } from '../data/catalog'
import { useStore } from '../store'
import { fmt, reducedMotion } from '../lib/util'
import { Icon, Pic } from '../components/ui'

const LOOKBOOK: [string, string, string][] = [
  ['lb-coat', 'Kamel palto va oq futbolka', 'Palto + chino'],
  ['lb-walk', 'To‘q ko‘k kostyum', 'Ofis uchun'],
  ['lb-sit', 'Jigarrang pidjak va oq shim', 'Yarim rasmiy'],
  ['lb-denim', 'Vel’vet yoqali jinsi kurtka', 'Jinsi kurtka'],
  ['lb-jacket', 'To‘q rangli kurtka va soat', 'Kuzgi kechqurun'],
  ['lb-green', 'Yashil kostyum', 'Bayram uchun'],
]

const FAQ: [string, string][] = [
  ['Yetkazib berish qancha turadi?', 'Toshkent bo‘ylab 25 000 so‘m. 500 000 so‘mdan ortiq buyurtma bepul yetkaziladi. Do‘kondan o‘zingiz olib ketsangiz ham bepul.'],
  ['Qanday to‘lasam bo‘ladi?', 'Kiyimni qabul qilganda naqd pul bilan yoki Uzcard, Humo, Visa kartasi orqali.'],
  ['O‘lcham to‘g‘ri kelmasa-chi?', '14 kun ichida yorlig‘i olinmagan kiyimni boshqa o‘lchamga almashtiramiz.'],
  ['O‘lchamimni qanday bilaman?', 'Har bir kiyim sahifasida "O‘lcham jadvali" bor: ko‘krak, bel va son o‘lchamlari santimetrda. Do‘ppi uchun bosh aylanasi, poyabzal uchun oyoq uzunligi berilgan.'],
  ['Ro‘yxatdan o‘tishim kerakmi?', 'Yo‘q. Kiyimlarni bemalol ko‘rasiz. Buyurtma berayotganda faqat telefon raqamingiz SMS kod bilan tasdiqlanadi.'],
]

/** First-launch page about the shop. No sign-up: "Do‘konga kirish" goes straight to the shop. */
export function Landing() {
  const { s, dispatch, tab, go, openProduct } = useStore()
  const open = s.landing
  const [mounted, setMounted] = useState(open)
  const [out, setOut] = useState(!open)
  const ref = useRef<HTMLElement>(null)
  const smooth: ScrollBehavior = reducedMotion() ? 'auto' : 'smooth'

  useEffect(() => {
    if (open) {
      setMounted(true)
      if (ref.current) ref.current.scrollTop = 0
      const r = requestAnimationFrame(() => setOut(false))
      return () => cancelAnimationFrame(r)
    }
    setOut(true)
    const t = setTimeout(() => setMounted(false), reducedMotion() ? 0 : 700)
    return () => clearTimeout(t)
  }, [open])

  const enter = (then?: () => void) => {
    dispatch({ type: 'set', patch: { landing: false } })
    tab('home')
    then?.()
  }
  const toCat = (cat: CatId) => enter(() => go('category', { viewCat: cat, sort: 'pop' }))
  const toProduct = (id: string) => enter(() => openProduct(id))
  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (el && ref.current) ref.current.scrollTo({ top: el.offsetTop - 70, behavior: smooth })
  }
  const suit = byId('suit1')!

  const EnterBtn = ({ label = 'Do‘konga kirish' }: { label?: string }) => (
    <button className="cta brass" onClick={() => enter()}>{label} <Icon n="arrow" /></button>
  )

  return (
    <section className={'land' + (out ? ' out' : '')} id="landing" hidden={!mounted} ref={ref} aria-label="Bosmenti haqida">
      <header className="lnav"><div className="lw">
        <button className="lbrand" onClick={() => ref.current?.scrollTo({ top: 0, behavior: smooth })}><span className="mark">B</span>Bosmenti</button>
        <nav className="llinks">
          <button onClick={() => scrollToId('l-col')}>Kolleksiyalar</button>
          <button onClick={() => scrollToId('l-new')}>Yangi kelganlar</button>
          <button onClick={() => scrollToId('l-about')}>Do‘kon haqida</button>
          <button onClick={() => scrollToId('l-faq')}>Savollar</button>
        </nav>
        <EnterBtn />
        <button className="lmini" onClick={() => enter()}>Do‘kon <Icon n="arrow" /></button>
      </div></header>

      <div className="lw lhero" id="lhero">
        <div className="lh-text">
          <span className="lsmall">Erkaklar kiyim do‘koni · Toshkent</span>
          <h1><span>Bos</span><span style={{ animationDelay: '.08s' }}><em>menti</em></span></h1>
          <p>Klassik kostyumdan kundalik futbolkagacha. Erkak kishiga kerak bo‘lgan kiyimlar bitta do‘konda, o‘lchami va narxi bilan.</p>
          <div className="lbtns" id="heroBtns">
            <EnterBtn />
            <button className="cta line" onClick={() => scrollToId('l-col')}>Kolleksiyalar</button>
          </div>
          <div className="lmeta">
            <div><b>{CATS.length}</b><span>bo‘lim</span></div>
            <div><b>{PRODUCTS.length}</b><span>model</span></div>
            <div><b>S–3XL</b><span>o‘lchamlar</span></div>
          </div>
        </div>
        <div className="lh-media">
          <div className="frame"><img src="img/l-hero.jpg" alt="To‘q ko‘k kostyumdagi erkak pidjak tugmasini qadamoqda" /></div>
          <span className="hchip">Yangi kolleksiya</span>
          <button className="htag" onClick={() => toProduct(suit.id)}>
            <img src={suit.imgs[0]} alt="" /><div><b>{suit.name}</b><small>{fmt(suit.price)}</small></div><Icon n="arrow" />
          </button>
        </div>
      </div>

      <div className="lmq" aria-hidden="true"><div>
        {[...CATS, ...CATS].map((c, i) => <span key={i}>{c.name}<i> ✦</i></span>)}
      </div></div>

      <section className="lw lsec" id="l-about">
        <div className="labout">
          <div>
            <span className="lsmall">Do‘kon haqida</span>
            <h2>Erkaklar uchun, har kungi va bayramona</h2>
            <p className="lead">Bosmenti erkaklar uchun klassik va zamonaviy kiyimlar do‘koni. Har bir kiyim turi o‘z bo‘limida turadi: ko‘ylaklar, shimlar, jinsilar, sviterlar, kurtkalar, kostyumlar, ichki kiyimlar, milliy do‘ppilar, poyabzal va aksessuarlar.</p>
            <p className="lead">Ilovada kiyimni tanlaysiz, o‘lchamini belgilaysiz va naqd yoki karta bilan buyurtma berasiz. Ro‘yxatdan o‘tish shart emas.</p>
            <div className="lstats">
              <div><b>{CATS.length}</b><span>alohida bo‘lim</span></div>
              <div><b>{PRODUCTS.length}</b><span>demo model</span></div>
              <div><b>14 kun</b><span>almashtirish</span></div>
            </div>
          </div>
          <div className="collage">
            <img src="img/l-store.jpg" alt="Do‘kondagi pidjak va kostyumlar" loading="lazy" />
            <img src="img/l-flatlay.jpg" alt="Jinsi, ko‘ylak, galstuk, pidjak va tufli" loading="lazy" />
            <img src="img/l-store2.jpg" alt="Kiyim do‘koni ichki ko‘rinishi" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="lw lsec" id="l-col">
        <div className="lhead2"><div><span className="lsmall">Kolleksiyalar</span><h2>Uslubingizni tanlang</h2></div></div>
        <div className="lcol">
          {COLLECTIONS.map(c => (
            <button key={c.t} className="ccard" onClick={() => toCat(c.cat)}>
              <img src={`img/${c.img}.jpg`} alt={c.t} loading="lazy" />
              <div className="cc"><div><b>{c.t}</b><small>{c.s}</small></div><span className="arr"><Icon n="arrow" /></span></div>
            </button>
          ))}
        </div>
      </section>

      <section className="lw lsec" id="l-new">
        <div className="lhead2">
          <div><span className="lsmall">Yangi kelganlar</span><h2>Bu hafta do‘konda</h2></div>
          <button className="lmini" onClick={() => enter()}>Hammasini ko‘rish <Icon n="arrow" /></button>
        </div>
        <div className="rail">
          {NEW_ARRIVALS.map(id => byId(id)!).map(p => (
            <button key={p.id} className="rcard" onClick={() => toProduct(p.id)}>
              <div className="ri"><Pic p={p} /></div><b>{p.name}</b><small>{fmt(p.price)}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="lw lsec">
        <div className="lhead2"><div><span className="lsmall">Nega Bosmenti</span><h2>Xarid qilish oson</h2></div></div>
        <ul className="feat">
          <li><Icon n="truck" /><div><b>Yetkazib berish</b><span>Toshkent bo‘ylab. 500 000 so‘mdan ortiq buyurtmaga bepul.</span></div></li>
          <li><Icon n="card" /><div><b>Naqd yoki karta</b><span>Uzcard, Humo, Visa yoki qabul qilganda naqd pul.</span></div></li>
          <li><Icon n="swap" /><div><b>O‘lcham mos kelmasa</b><span>14 kun ichida boshqa o‘lchamga almashtiramiz.</span></div></li>
          <li><Icon n="phone" /><div><b>Ro‘yxatdan o‘tishsiz</b><span>Bemalol tomosha qiling. Telefon raqam faqat buyurtmada so‘raladi.</span></div></li>
        </ul>
      </section>

      <section className="lw lsec">
        <div className="lhead2"><div><span className="lsmall">Buyurtma</span><h2>To‘rt qadamda</h2></div></div>
        <ol className="steps">
          <li><b>Kiyimni tanlang</b><span>Bo‘limlardan yoki qidiruv orqali.</span></li>
          <li><b>O‘lchamni belgilang</b><span>O‘lcham jadvali har bir kiyim sahifasida bor.</span></li>
          <li><b>Savatga qo‘shing</b><span>Yetkazib berish yoki do‘kondan olib ketishni tanlang.</span></li>
          <li><b>Telefon bilan tasdiqlang</b><span>SMS kod keladi, operator qo‘ng‘iroq qilib buyurtmani tasdiqlaydi.</span></li>
        </ol>
      </section>

      <section className="lw lsec">
        <div className="lhead2"><div><span className="lsmall">Lookbook</span><h2>Uslub g‘oyalari</h2></div></div>
        <div className="look">
          {LOOKBOOK.map(([f, alt, cap]) => (
            <figure key={f}><img src={`img/${f}.jpg`} alt={alt} loading="lazy" /><figcaption>{cap}</figcaption></figure>
          ))}
        </div>
      </section>

      <section className="lw lsec" id="l-faq">
        <div className="lfaq">
          <div className="faq">
            <span className="lsmall">Savollar</span><h2 style={{ marginBottom: 22 }}>Ko‘p so‘raladi</h2>
            {FAQ.map(([q, a], i) => (
              <details key={q} open={i === 0}><summary>{q}<Icon n="plus" /></summary><p>{a}</p></details>
            ))}
          </div>
          <div className="lcontact">
            <span className="lsmall" style={{ margin: 0 }}>Do‘kon</span>
            <div><Icon n="pin" /><span><b>Toshkent sh.</b><small>Manzil keyin kiritiladi</small></span></div>
            <div><Icon n="clock" /><span><b>Har kuni 09:00–21:00</b><small>Dam olish kunlarisiz</small></span></div>
            <div><Icon n="phone" /><span><b>+998 00 000 00 00</b><small>Demo raqam</small></span></div>
            <EnterBtn />
          </div>
        </div>
      </section>

      <div className="lw">
        <div className="lfinal">
          <img src="img/c-classic.jpg" alt="" loading="lazy" />
          <div className="lf"><span className="lsmall">Bosmenti</span><h2>Yangi uslubingiz shu yerdan boshlanadi</h2><EnterBtn /></div>
        </div>
        <footer className="lfoot"><span>© 2026 Bosmenti · Erkaklar kiyim do‘koni</span><span>Fotolar: Unsplash (demo)</span></footer>
      </div>

      <div className="lcta">
        <EnterBtn />
        <small>Ro‘yxatdan o‘tmasdan kirasiz</small>
      </div>
    </section>
  )
}
