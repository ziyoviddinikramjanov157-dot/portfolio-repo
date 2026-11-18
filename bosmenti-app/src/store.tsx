import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useReducer, useRef, useState, type ReactNode, type RefObject } from 'react'
import { byId, FREE_FROM, SHIP_FEE, type CatId } from './data/catalog'
import { today } from './lib/util'

export type Screen = 'home' | 'catalog' | 'category' | 'favs' | 'product' | 'cart' | 'profile' | 'success'
export type Sort = 'pop' | 'cheap' | 'exp'
export interface CartLine { id: string; ci: number; size: string; qty: number }
export interface Order { no: string; date: string; n: number; total: number; pay: string; ship: string }
export interface User { phone: string }
interface Frame { screen: Screen; pid: string | null; viewCat: CatId | 'all'; y: number }

export interface State {
  landing: boolean
  screen: Screen
  stack: Frame[]
  cat: CatId | 'all'
  q: string
  viewCat: CatId | 'all'
  sort: Sort
  pid: string | null
  cart: CartLine[]
  fav: string[]
  user: User | null
  orders: Order[]
  ship: 'delivery' | 'pickup'
  pay: 'cash' | 'card'
  ctype: string
  addr: string
  last: Order | null
}

type Action =
  | { type: 'go'; screen: Screen; y: number; patch?: Partial<State> }
  | { type: 'back' }
  | { type: 'tab'; screen: Screen }
  | { type: 'set'; patch: Partial<State> }
  | { type: 'fav'; id: string }
  | { type: 'add'; line: CartLine }
  | { type: 'cq'; i: number; d: number }
  | { type: 'rm'; i: number }
  | { type: 'order'; order: Order }
  | { type: 'login'; user: User }
  | { type: 'logout' }

const KEY = 'bosmenti_react_v1'
const PERSIST = ['cart', 'fav', 'user', 'orders'] as const

function initial(): State {
  const s: State = {
    landing: true, screen: 'home', stack: [], cat: 'all', q: '', viewCat: 'all', sort: 'pop', pid: null,
    cart: [], fav: [], user: null, orders: [], ship: 'delivery', pay: 'cash', ctype: 'Uzcard', addr: '', last: null,
  }
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (d) for (const k of PERSIST) if (d[k] !== undefined) (s as unknown as Record<string, unknown>)[k] = d[k]
  } catch { /* storage unavailable: start empty */ }
  s.cart = s.cart.filter(l => byId(l.id))
  s.fav = s.fav.filter(id => byId(id))
  return s
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'go':
      return { ...s, ...a.patch, stack: [...s.stack, { screen: s.screen, pid: s.pid, viewCat: s.viewCat, y: a.y }], screen: a.screen }
    case 'back': {
      const f = s.stack[s.stack.length - 1]
      if (!f) return { ...s, screen: 'home' }
      return { ...s, stack: s.stack.slice(0, -1), screen: f.screen, pid: f.pid, viewCat: f.viewCat }
    }
    case 'tab':
      return { ...s, stack: [], screen: a.screen }
    case 'set':
      return { ...s, ...a.patch }
    case 'fav':
      return { ...s, fav: s.fav.includes(a.id) ? s.fav.filter(x => x !== a.id) : [...s.fav, a.id] }
    case 'add': {
      const i = s.cart.findIndex(l => l.id === a.line.id && l.ci === a.line.ci && l.size === a.line.size)
      if (i < 0) return { ...s, cart: [...s.cart, a.line] }
      return { ...s, cart: s.cart.map((l, j) => (j === i ? { ...l, qty: Math.min(10, l.qty + a.line.qty) } : l)) }
    }
    case 'cq':
      return {
        ...s,
        cart: s.cart.flatMap((l, j) => (j !== a.i ? [l] : l.qty + a.d < 1 ? [] : [{ ...l, qty: Math.min(10, l.qty + a.d) }])),
      }
    case 'rm':
      return { ...s, cart: s.cart.filter((_, j) => j !== a.i) }
    case 'order':
      return { ...s, orders: [a.order, ...s.orders], last: a.order, cart: [], stack: [], screen: 'success' }
    case 'login':
      return { ...s, user: a.user }
    case 'logout':
      return { ...s, user: null }
  }
}

export const cartCount = (s: State) => s.cart.reduce((a, l) => a + l.qty, 0)
export const subTotal = (s: State) => s.cart.reduce((a, l) => a + (byId(l.id)?.price ?? 0) * l.qty, 0)
export const shipFee = (s: State) => (s.ship === 'pickup' ? 0 : subTotal(s) >= FREE_FROM ? 0 : SHIP_FEE)

export type SheetKind = { kind: 'login'; after?: 'checkout' } | { kind: 'guide' }
interface ToastData { msg: string; btn?: string; act?: () => void; n: number }

interface Ctx {
  s: State
  dispatch: (a: Action) => void
  go: (screen: Screen, patch?: Partial<State>) => void
  back: () => void
  tab: (screen: Screen) => void
  openProduct: (id: string) => void
  placeOrder: () => void
  toast: (msg: string, btn?: string, act?: () => void) => void
  toastData: ToastData | null
  sheet: SheetKind | null
  openSheet: (k: SheetKind) => void
  closeSheet: () => void
  viewRef: RefObject<HTMLElement>
}

const StoreCtx = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, undefined, initial)
  const viewRef = useRef<HTMLElement>(null)
  const scrollTo = useRef<number | null>(null)
  const [toastData, setToast] = useState<ToastData | null>(null)
  const [sheet, setSheet] = useState<SheetKind | null>(null)
  const stateRef = useRef(s)
  stateRef.current = s

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ cart: s.cart, fav: s.fav, user: s.user, orders: s.orders })) } catch { /* ignore */ }
  }, [s.cart, s.fav, s.user, s.orders])

  // restore (back) or reset (new screen) the scroll position after the screen has rendered
  useLayoutEffect(() => {
    if (scrollTo.current != null && viewRef.current) {
      viewRef.current.scrollTop = scrollTo.current
      scrollTo.current = null
    }
  }, [s.screen, s.pid, s.viewCat])

  const go = useCallback((screen: Screen, patch?: Partial<State>) => {
    dispatch({ type: 'go', screen, patch, y: viewRef.current?.scrollTop ?? 0 })
    scrollTo.current = 0
  }, [])
  const back = useCallback(() => {
    const f = stateRef.current.stack[stateRef.current.stack.length - 1]
    scrollTo.current = f ? f.y : 0
    dispatch({ type: 'back' })
  }, [])
  const tab = useCallback((screen: Screen) => {
    setSheet(null)
    scrollTo.current = 0
    dispatch({ type: 'tab', screen })
  }, [])
  const openProduct = useCallback((id: string) => go('product', { pid: id }), [go])

  const toast = useCallback((msg: string, btn?: string, act?: () => void) => setToast({ msg, btn, act, n: Date.now() }), [])

  const placeOrder = useCallback(() => {
    const st = stateRef.current
    const order: Order = {
      no: String(10000 + Math.floor(Math.random() * 90000)),
      date: today(),
      n: cartCount(st),
      total: subTotal(st) + shipFee(st),
      pay: st.pay === 'cash' ? 'Naqd pul' : `Karta (${st.ctype})`,
      ship: st.ship === 'pickup' ? 'Do‘kondan olish' : 'Yetkazib berish',
    }
    scrollTo.current = 0
    dispatch({ type: 'order', order })
  }, [])

  const value: Ctx = {
    s, dispatch, go, back, tab, openProduct, placeOrder, toast, toastData, sheet, viewRef,
    openSheet: setSheet, closeSheet: () => setSheet(null),
  }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const c = useContext(StoreCtx)
  if (!c) throw new Error('useStore must be used inside <StoreProvider>')
  return c
}
