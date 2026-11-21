import { useEffect, useState, type FormEvent } from 'react'
import { adminApi, LOGGED_OUT, send } from './api'
import { Orders } from './Orders'
import { Products } from './Products'
import { SettingsPage } from './Settings'

type Tab = 'orders' | 'products' | 'settings'
const TABS: [Tab, string][] = [['orders', 'Buyurtmalar'], ['products', 'Mahsulotlar'], ['settings', 'Sozlamalar']]
const fromHash = (): Tab => (TABS.some(([t]) => `#${t}` === location.hash) ? (location.hash.slice(1) as Tab) : 'orders')

export function AdminApp() {
  // undefined while checking whether the session is still valid
  const [login, setLogin] = useState<string | null | undefined>(undefined)
  const [tab, setTab] = useState<Tab>(fromHash)

  useEffect(() => {
    adminApi<{ login: string }>('/api/admin/me').then(r => setLogin(r.login), () => setLogin(null))
    const out = () => setLogin(null)
    addEventListener(LOGGED_OUT, out)
    return () => removeEventListener(LOGGED_OUT, out)
  }, [])

  useEffect(() => {
    history.replaceState(null, '', `#${tab}`)
  }, [tab])

  if (login === undefined) return <div className="a-center">Yuklanmoqda…</div>
  if (login === null) return <Login onDone={setLogin} />

  const logout = async () => {
    await send('POST', '/api/admin/logout').catch(() => {})
    setLogin(null)
  }

  return (
    <div className="a-shell">
      <header className="a-top">
        <div className="a-brand"><span className="a-mark">B</span>Bosmenti <small>boshqaruv</small></div>
        <nav className="a-tabs">
          {TABS.map(([t, label]) => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{label}</button>
          ))}
        </nav>
        <div className="a-user">
          <a href="./" target="_blank" rel="noopener">Do‘konni ochish</a>
          <button onClick={logout}>Chiqish</button>
        </div>
      </header>
      <main className="a-main">
        {tab === 'orders' && <Orders />}
        {tab === 'products' && <Products />}
        {tab === 'settings' && <SettingsPage />}
      </main>
    </div>
  )
}

function Login({ onDone }: { onDone: (login: string) => void }) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const r = await send<{ login: string }>('POST', '/api/admin/login', { login, password })
      onDone(r.login)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="a-center">
      <form className="a-login" onSubmit={submit}>
        <div className="a-brand"><span className="a-mark">B</span>Bosmenti</div>
        <h1>Boshqaruv paneliga kirish</h1>
        <label>Login<input id="login" autoComplete="username" value={login} onChange={e => setLogin(e.target.value)} required /></label>
        <label>Parol<input id="password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
        {error && <p className="a-err" role="alert">{error}</p>}
        <button className="a-btn primary" disabled={busy}>{busy ? 'Tekshirilmoqda…' : 'Kirish'}</button>
      </form>
    </div>
  )
}
