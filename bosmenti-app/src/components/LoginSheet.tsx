import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { fmtPh } from '../lib/util'

/**
 * Phone-number sign-in. Demo: no SMS is sent and any 4 digits are accepted.
 * Replace `verify` with a call to the real SMS provider later.
 */
export function LoginSheet({ after }: { after?: 'checkout' }) {
  const { dispatch, closeSheet, placeOrder, toast } = useStore()
  const [step, setStep] = useState<1 | 2>(1)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [left, setLeft] = useState(59)
  const phRef = useRef<HTMLInputElement>(null)
  const codeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => (step === 1 ? phRef : codeRef).current?.focus(), 350)
    return () => clearTimeout(t)
  }, [step])

  useEffect(() => {
    if (step !== 2 || left <= 0) return
    const t = setTimeout(() => setLeft(l => l - 1), 1000)
    return () => clearTimeout(t)
  }, [step, left])

  const onPhone = (v: string) => {
    let d = v.replace(/\D/g, '')
    if (d.startsWith('998') && d.length > 9) d = d.slice(3)
    setPhone(d.slice(0, 9))
  }

  const verify = (c: string) => {
    if (!/^\d{4}$/.test(c)) return
    dispatch({ type: 'login', user: { phone } })
    closeSheet()
    if (after === 'checkout') placeOrder()
    else toast('Xush kelibsiz!')
  }

  const onCode = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    setCode(d)
    if (d.length === 4) setTimeout(() => verify(d), 250)
  }

  if (step === 1)
    return (
      <>
        <h2>Telefon raqam bilan kirish</h2>
        <p className="sub">{after === 'checkout' ? 'Buyurtmani rasmiylashtirish uchun' : 'Hisobingizga kirish uchun'} raqamingizni kiriting. Tasdiqlash kodini SMS orqali yuboramiz.</p>
        <label className="phone" htmlFor="ph"><span>+998</span>
          <input ref={phRef} id="ph" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="90 123 45 67" value={fmtPh(phone)} onChange={e => onPhone(e.target.value)} />
        </label>
        <button className="cta wide" id="sendBtn" disabled={phone.length < 9} onClick={() => { setStep(2); setLeft(59) }}>Kod olish</button>
        <p className="fine">Ro‘yxatdan o‘tish shart emas. Raqam tasdiqlansa, hisob avtomatik ochiladi.</p>
      </>
    )

  return (
    <>
      <h2>Kodni kiriting</h2>
      <p className="sub"><b>+998 {fmtPh(phone)}</b> raqamiga 4 xonali kod yuborildi. <button className="lnk" onClick={() => { setStep(1); setCode('') }}>Raqamni o‘zgartirish</button></p>
      <input ref={codeRef} id="code" className="code" type="text" inputMode="numeric" maxLength={4} placeholder="····" autoComplete="one-time-code" aria-label="SMS kod" value={code} onChange={e => onCode(e.target.value)} />
      <div className="demo">Demo rejim: SMS yuborilmaydi. Istalgan 4 ta raqamni kiriting.</div>
      <button className="cta wide" id="verBtn" disabled={code.length < 4} onClick={() => verify(code)}>Tasdiqlash</button>
      <p className="fine">
        {left > 0
          ? `Kodni qayta yuborish: 0:${String(left).padStart(2, '0')}`
          : <button className="lnk" onClick={() => { setLeft(59); toast('Kod qayta yuborildi') }}>Kodni qayta yuborish</button>}
      </p>
    </>
  )
}
