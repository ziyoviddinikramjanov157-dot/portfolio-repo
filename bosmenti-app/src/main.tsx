import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { loadCatalog } from './data/catalog'
import { StoreProvider } from './store'
import App from './App'
import './styles.css'

/** Waits for the catalogue from the server before showing the shop. */
function Boot() {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')
  const load = () => {
    setState('loading')
    loadCatalog().then(
      () => setState('ready'),
      (e: Error) => {
        setError(e.message)
        setState('error')
      },
    )
  }
  useEffect(load, [])

  if (state === 'ready')
    return (
      <StoreProvider>
        <App />
      </StoreProvider>
    )
  return (
    <div className="boot" role={state === 'error' ? 'alert' : 'status'}>
      <span className="mark">B</span>
      {state === 'loading' ? (
        <p>Yuklanmoqda…</p>
      ) : (
        <>
          <p>Do‘konni ochib bo‘lmadi. {error}</p>
          <button className="cta brass" onClick={load}>Qayta urinish</button>
        </>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Boot />
  </StrictMode>,
)
