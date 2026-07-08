export default function OrderBook({ l2Book, title }) {
  const MAX_ROWS = 6
  const asks = (l2Book?.asks || []).slice(0, MAX_ROWS).reverse()
  const bids = (l2Book?.bids || []).slice(0, MAX_ROWS)
  const maxAsk = Math.max(...asks.map(a => a.sz * a.px), 1)
  const maxBid = Math.max(...bids.map(b => b.sz * b.px), 1)

  return (
    <div className="rounded-xl border border-slate-800 bg-navy-900 p-4">
      <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">{title || 'Order Book'}</h2>
      <div className="space-y-0.5">
        {asks.map((a, i) => (
          <div key={`a-${i}`} className="flex items-center gap-2 text-[11px] font-mono">
            <span className="w-16 text-right text-neon-pink">{a.px.toFixed(4)}</span>
            <span className="w-12 text-right text-slate-400">{a.sz.toFixed(2)}</span>
            <div className="flex-1 h-1.5 rounded-sm bg-navy-800 overflow-hidden">
              <div className="h-full bg-neon-pink/40 rounded-sm" style={{ width: `${(a.sz * a.px / maxAsk) * 100}%` }} />
            </div>
          </div>
        ))}
        <div className="h-px bg-slate-700 my-1" />
        {bids.map((b, i) => (
          <div key={`b-${i}`} className="flex items-center gap-2 text-[11px] font-mono">
            <span className="w-16 text-right text-neon-teal">{b.px.toFixed(4)}</span>
            <span className="w-12 text-right text-slate-400">{b.sz.toFixed(2)}</span>
            <div className="flex-1 h-1.5 rounded-sm bg-navy-800 overflow-hidden">
              <div className="h-full bg-neon-teal/40 rounded-sm" style={{ width: `${(b.sz * b.px / maxBid) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}