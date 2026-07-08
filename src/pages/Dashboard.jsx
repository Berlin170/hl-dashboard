import { useMemo } from 'react'
import { useNews } from '../hooks/useNews'
import { useHLWebSocket } from '../hooks/useHLWebSocket'
import { COMPANY_MAP } from '../lib/constants'
import PriceCard from '../components/PriceCard'
import EarningsCard from '../components/EarningsCard'
import MiniChart from '../components/MiniChart'
import Leaderboard from '../components/Leaderboard'
import OrderBook from '../components/OrderBook'
import WalletPanel from '../components/WalletPanel'
import { HyperliquidLogo, CompanyLogo } from '../components/Logos'

function MarketRow({ companyMeta, ws }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-4">
        <PriceCard company={companyMeta} ws={ws} />
      </div>
      <div className="lg:col-span-5">
        <MiniChart ohlcv={ws.ohlcv} ticker={companyMeta.hlTicker} />
      </div>
      <div className="lg:col-span-3">
        <OrderBook l2Book={ws.l2Book} title={`${companyMeta.ticker} Book`} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { news, loading, error } = useNews()

  const samsungWs = useHLWebSocket(COMPANY_MAP.Samsung.hlTicker)
  const skHynixWs = useHLWebSocket(COMPANY_MAP['SK Hynix'].hlTicker)
  const micronWs = useHLWebSocket(COMPANY_MAP.Micron.hlTicker)

  const marketData = useMemo(() => ({
    SMSN: {
      lastPrice: samsungWs.lastPrice,
      markPrice: samsungWs.markPrice,
      spread: samsungWs.spread,
      skew: samsungWs.skew,
      vol: samsungWs.dayVolumeUsd || 0,
      change: samsungWs.change24h
    },
    SKHX: {
      lastPrice: skHynixWs.lastPrice,
      markPrice: skHynixWs.markPrice,
      spread: skHynixWs.spread,
      skew: skHynixWs.skew,
      vol: skHynixWs.dayVolumeUsd || 0,
      change: skHynixWs.change24h
    },
    MU: {
      lastPrice: micronWs.lastPrice,
      markPrice: micronWs.markPrice,
      spread: micronWs.spread,
      skew: micronWs.skew,
      vol: micronWs.dayVolumeUsd || 0,
      change: micronWs.change24h
    }
  }), [
    samsungWs.lastPrice, samsungWs.dayVolumeUsd, samsungWs.change24h, samsungWs.spread, samsungWs.skew, samsungWs.markPrice,
    skHynixWs.lastPrice, skHynixWs.dayVolumeUsd, skHynixWs.change24h, skHynixWs.spread, skHynixWs.skew, skHynixWs.markPrice,
    micronWs.lastPrice, micronWs.dayVolumeUsd, micronWs.change24h, micronWs.spread, micronWs.skew, micronWs.markPrice
  ])

  const grouped = useMemo(() => {
    const g = { Samsung: [], 'SK Hynix': [], Micron: [] }
    news.forEach(n => {
      if (g[n.company]) g[n.company].push(n)
      else if (n.ticker === 'SMSN') g.Samsung.push(n)
      else if (n.ticker === 'SKHX') g['SK Hynix'].push(n)
      else if (n.ticker === 'MU') g.Micron.push(n)
    })
    return g
  }, [news])

  const wsStatuses = {
    samsung: samsungWs.connectionStatus,
    skHynix: skHynixWs.connectionStatus,
    micron: micronWs.connectionStatus,
  }
  const allConnected = wsStatuses.samsung === 'connected' && wsStatuses.skHynix === 'connected' && wsStatuses.micron === 'connected'
  const anyError = wsStatuses.samsung === 'error' || wsStatuses.skHynix === 'error' || wsStatuses.micron === 'error'

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-navy-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HyperliquidLogo className="h-9 w-9 text-neon-teal" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-wide text-slate-100">HL EARNINGS</h1>
                <span className="rounded bg-navy-800 px-1.5 py-0.5 text-[9px] font-mono text-slate-500 tracking-wider">HIP-3</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Quarterly Tracker + xyz Markets</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full bg-navy-900 border border-slate-800 px-3 py-1">
              <span className={`h-1.5 w-1.5 rounded-full ${allConnected ? 'bg-emerald-500 animate-pulse' : anyError ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`} />
              <span className="text-[10px] text-slate-400 font-mono">
                {allConnected ? 'HL WS: Connected' : anyError ? 'HL WS: Error' : 'HL WS: Connecting...'}
              </span>
            </div>
            {loading && <span className="text-[10px] text-slate-500">Refreshing news...</span>}
            {error && <span className="text-[10px] text-rose-400">News error</span>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Market Rows with logos */}
        <section className="space-y-4">
          <MarketRow companyMeta={COMPANY_MAP.Samsung} ws={samsungWs} />
          <MarketRow companyMeta={COMPANY_MAP['SK Hynix']} ws={skHynixWs} />
          <MarketRow companyMeta={COMPANY_MAP.Micron} ws={micronWs} />
        </section>

        {/* Leaderboard + Collateral wallet */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Leaderboard newsItems={news} marketData={marketData} />
          </div>
          <div>
            <WalletPanel />
          </div>
        </section>

        {/* Latest Earnings */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Latest Earnings Prints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.slice(0, 4).map(item => (
              <EarningsCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Company sections */}
        {Object.entries(grouped).map(([company, items]) => items.length > 0 && (
          <section key={company} className="border-t border-slate-800 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <CompanyLogo company={company} className="h-10 w-10" />
              <div>
                <h2 className="text-lg font-bold text-slate-200">{company}</h2>
                <span className="rounded-md bg-navy-800 px-2 py-0.5 text-xs font-mono text-slate-400">
                  {COMPANY_MAP[company]?.hlTicker}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.slice(0, 2).map(item => (
                <EarningsCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-8">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between text-[10px] text-slate-600">
          <div className="flex items-center gap-2">
            <HyperliquidLogo className="h-4 w-4 text-slate-700" />
            <span>Data via Hyperliquid & GoldRush. News via Google News RSS.</span>
          </div>
          <span className="font-mono">HIP-3 xyz markets</span>
        </div>
      </footer>
    </div>
  )
}