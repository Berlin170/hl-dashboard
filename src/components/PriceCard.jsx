import { useState, useEffect, useRef } from 'react'
import { fmtPrice, fmtPct, fmtVol, clsPct } from '../lib/formatters'
import { CompanyLogo } from './Logos'

export default function PriceCard({ company, ws }) {
  const { connectionStatus, lastPrice, markPrice, spread, skew, askDepth, bidDepth, funding, change24h, dayVolumeUsd, openInterestUsd } = ws
  const [flash, setFlash] = useState('')
  const prevPrice = useRef(lastPrice)

  useEffect(() => {
    if (!lastPrice || !prevPrice.current) { prevPrice.current = lastPrice; return }
    if (lastPrice > prevPrice.current) setFlash('animate-flash-green')
    else if (lastPrice < prevPrice.current) setFlash('animate-flash-red')
    const t = setTimeout(() => setFlash(''), 700)
    prevPrice.current = lastPrice
    return () => clearTimeout(t)
  }, [lastPrice])

  const change = change24h
  const vol = dayVolumeUsd || 0
  const oiDollars = openInterestUsd || 0

  const statusColor = {
    connected: 'bg-emerald-500',
    connecting: 'bg-amber-500',
    error: 'bg-rose-500',
    disconnected: 'bg-slate-500',
    idle: 'bg-slate-600'
  }[connectionStatus]

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-800 bg-navy-900 p-5 transition-shadow hover:shadow-lg hover:shadow-cyan-900/10 ${flash}`}>
      <div className={`absolute top-0 left-0 h-0.5 w-full ${statusColor}`} />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CompanyLogo company={company.name} className="h-10 w-10" />
          <div>
            <h3 className="text-lg font-bold text-slate-100">{company.name}</h3>
            <p className="text-xs text-slate-500 font-mono">{company.hlTicker}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-block h-2 w-2 rounded-full ${statusColor}`} />
          <span className="text-[10px] uppercase tracking-wider text-slate-500">{connectionStatus}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-mono font-bold text-slate-50">{fmtPrice(lastPrice)}</span>
        <span className={`text-sm font-mono font-semibold ${clsPct(change)}`}>{fmtPct(change)}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div className="flex justify-between border-b border-slate-800 pb-1">
          <span className="text-slate-500">Mark</span>
          <span className="font-mono text-slate-300">{fmtPrice(markPrice)}</span>
        </div>
        <div className="flex justify-between border-b border-slate-800 pb-1">
          <span className="text-slate-500">24h Vol</span>
          <span className="font-mono text-slate-300">{fmtVol(vol)}</span>
        </div>
        <div className="flex justify-between border-b border-slate-800 pb-1">
          <span className="text-slate-500">OI ($)</span>
          <span className="font-mono text-slate-300">{fmtVol(oiDollars)}</span>
        </div>
        <div className="flex justify-between border-b border-slate-800 pb-1">
          <span className="text-slate-500">Funding</span>
          <span className={`font-mono ${funding && funding > 0 ? 'text-flash-green' : funding < 0 ? 'text-flash-red' : 'text-slate-300'}`}>
            {funding ? `${(funding * 100).toFixed(4)}%` : '--'}
          </span>
        </div>
        <div className="flex justify-between border-b border-slate-800 pb-1">
          <span className="text-slate-500">Spread</span>
          <span className="font-mono text-slate-300">{spread ? spread.toFixed(3) + '%' : '--'}</span>
        </div>
        <div className="flex justify-between border-b border-slate-800 pb-1">
          <span className="text-slate-500">Skew</span>
          <span className={`font-mono ${skew > 0 ? 'text-neon-teal' : skew < 0 ? 'text-neon-pink' : 'text-slate-300'}`}>
            {skew ? skew.toFixed(1) : '--'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Ask Liq</span>
          <span className="font-mono text-neon-pink">{fmtVol(askDepth)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Bid Liq</span>
          <span className="font-mono text-neon-teal">{fmtVol(bidDepth)}</span>
        </div>
      </div>
    </div>
  )
}