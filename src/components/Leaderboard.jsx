import { fmtPct } from '../lib/formatters'
import { CompanyLogo } from './Logos'

export default function Leaderboard({ newsItems, marketData }) {
  const rows = newsItems.map(item => {
    const data = marketData[item.ticker] || {}
    const price = data.lastPrice || 0
    const headlineTime = new Date(item.publishedAt).getTime()
    const now = Date.now()
    const hoursSince = (now - headlineTime) / 36e5
    // Synthetic early positioning score based on vol, skew, and recency
    const volScore = (data.vol || 0) * 0.001
    const skewScore = Math.abs(data.skew || 0)
    const recencyScore = Math.max(0, 24 - hoursSince)
    const score = volScore * 0.4 + skewScore * 0.3 + recencyScore * 0.3
    return { ...item, ...data, score, hoursSince }
  }).sort((a, b) => b.score - a.score)

  return (
    <div className="rounded-xl border border-slate-800 bg-navy-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Early Positioning</h2>
        <span className="rounded-full bg-neon-teal/10 px-2 py-0.5 text-[10px] font-bold text-neon-teal">Live</span>
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={row.id} className="flex items-center gap-3 rounded-lg bg-navy-800/50 px-3 py-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
              i === 0 ? 'bg-amber-500/20 text-amber-400' :
              i === 1 ? 'bg-slate-400/20 text-slate-300' :
              i === 2 ? 'bg-orange-600/20 text-orange-400' :
              'bg-navy-800 text-slate-500'
            }`}>{i + 1}</div>
            <CompanyLogo company={row.company} className="h-8 w-8" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 truncate">{row.company}</span>
                <span className="text-[10px] font-mono text-slate-500">{row.ticker}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px] text-slate-500">{row.hoursSince.toFixed(1)}h ago</span>
                <span className={`text-[10px] font-mono font-bold ${row.change >= 0 ? 'text-flash-green' : 'text-flash-red'}`}>
                  {fmtPct(row.change)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-slate-100">{row.score.toFixed(1)}</div>
              <div className="text-[9px] text-slate-600">score</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}