import { useStore, type Screen } from './store'
import { Landing } from './screens/Landing'
import { Catalog, Category, Favorites, Home } from './screens/Shop'
import { Product } from './screens/Product'
import { Cart, Profile, Success } from './screens/Account'
import { BottomNav, DesktopHeader, NO_NAV, SheetHost, Toast } from './components/Chrome'

const SCREENS: Record<Screen, () => JSX.Element | null> = {
  home: Home, catalog: Catalog, category: Category, favs: Favorites, product: Product, cart: Cart, profile: Profile, success: Success,
}

export default function App() {
  const { s, viewRef } = useStore()
  const Page = SCREENS[s.screen]
  // a new key remounts the page, which replays the enter animation and resets per-page state
  const pageKey = `${s.screen}:${s.pid ?? ''}:${s.viewCat}:${s.stack.length}`
  return (
    <div className="app" id="app">
      <Landing />
      <DesktopHeader />
      <main className={'scr in' + (NO_NAV.includes(s.screen) ? ' nn' : '')} id="view" ref={viewRef}>
        <div key={pageKey} className={`page pg-${s.screen}`}><Page /></div>
      </main>
      <BottomNav />
      <SheetHost />
      <Toast />
    </div>
  )
}
