import { fmtDate } from '../lib/formatters'
import { CompanyLogo } from './Logos'

export default function EarningsCard({ item }) {
  const a = parseFloat(item.actual)
  const e = parseFloat(item.estimate)
  const beat = !isNaN(a) && !isNaN(e) && a > e
  const miss = !isNaN(a) && !isNaN(e) && a < e
  const resultBadge = beat 
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
    : miss 
    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
    : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
  const resultText = beat ? 'Beat' : miss ? 'Miss' : 'Inline'

  const guidanceColor = item.guidance === 'positive' ? 'text-emerald-400' :
    item.guidance === 'negative' ? 'text-rose-400' : 'text-amber-400'
  const guidanceLabel = item.guidance === 'positive' ? 'Bullish' :
    item.guidance === 'negative' ? 'Bearish' : 'Neutral'

  return (
    <div className="rounded-xl border border-slate-800 bg-navy-900 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <CompanyLogo company={item.company} className="h-10 w-10" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-slate-100">{item.company}</span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${resultBadge}`}>
                {resultText}
              </span>
            </div>
            <p className="text-xs text-slate-500">{item.source} | {fmtDate(item.publishedAt)}</p>
          </div>
        </div>
        <div className={`rounded-lg border px-3 py-1 text-xs font-bold ${guidanceColor} border-current/30`}>
          {guidanceLabel} Guide
        </div>
      </div>
      <p className="text-sm text-slate-300 mb-3 leading-relaxed" style={{display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{item.headline}</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-lg bg-navy-800 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Actual</p>
          <p className="text-lg font-mono font-bold text-slate-100">{item.actual || '--'}</p>
        </div>
        <div className="rounded-lg bg-navy-800 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Estimate</p>
          <p className="text-lg font-mono font-bold text-slate-400">{item.estimate || '--'}</p>
        </div>
      </div>
      <div className="rounded-lg bg-navy-800/50 p-3">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Call Summary</p>
        <p className="text-xs text-slate-400 leading-relaxed">{item.summary || 'No summary available.'}</p>
      </div>
    </div>
  )
}