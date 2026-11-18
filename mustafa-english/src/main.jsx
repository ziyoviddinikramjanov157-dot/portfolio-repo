import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router'
import '@fontsource-variable/inter'
import '@fontsource-variable/manrope'
import './index.css'
import App from './App.jsx'

// Preview builds embedded in other pages can't rely on the URL path.
const Router = import.meta.env.VITE_MEMORY_ROUTER ? MemoryRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
