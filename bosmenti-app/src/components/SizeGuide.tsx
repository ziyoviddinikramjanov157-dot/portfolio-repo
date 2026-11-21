import { byId, CN, GUIDE } from '../data/catalog'
import { useStore } from '../store'

export function SizeGuide() {
  const { s, closeSheet } = useStore()
  const p = byId(s.pid)
  if (!p) return null
  const g = GUIDE[p.sz]
  return (
    <>
      <h2>O‘lcham jadvali</h2>
      <p className="sub">{CN[p.cat]}. O‘lchamni santimetr lenta bilan tana bo‘yicha oling.</p>
      <table className="gd">
        <thead><tr>{g.h.map(h => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{g.r.map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
      </table>
      <button className="cta wide" onClick={closeSheet}>Tushunarli</button>
    </>
  )
}
