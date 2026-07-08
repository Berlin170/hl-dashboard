import { useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'

export default function MiniChart({ ohlcv, ticker }) {
  const containerRef = useRef(null)
  const chartApiRef = useRef(null)
  const seriesRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    if (chartApiRef.current) return

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 220,
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      crosshair: { mode: 0 },
      rightPriceScale: {
        borderColor: '#334155',
        scaleMargins: { top: 0.1, bottom: 0.1 }
      },
      timeScale: {
        borderColor: '#334155',
        timeVisible: true,
        secondsVisible: false
      },
      handleScroll: false,
      handleScale: false,
    })
    chartApiRef.current = chart

    const series = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })
    seriesRef.current = series

    if (ohlcv && ohlcv.length) {
      const data = ohlcv.map(c => ({
        time: Math.floor((c.t || c.time) / 1000),
        open: c.o || c.open,
        high: c.h || c.high,
        low: c.l || c.low,
        close: c.c || c.close
      }))
      series.setData(data)
      chart.timeScale().fitContent()
    }

    const handleResize = () => {
      if (containerRef.current && chartApiRef.current) {
        chartApiRef.current.applyOptions({ width: containerRef.current.clientWidth })
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
      chartApiRef.current = null
      seriesRef.current = null
    }
  }, [ticker])

  useEffect(() => {
    if (!seriesRef.current || !ohlcv?.length) return
    const data = ohlcv.map(c => ({
      time: Math.floor((c.t || c.time) / 1000),
      open: c.o || c.open,
      high: c.h || c.high,
      low: c.l || c.low,
      close: c.c || c.close
    }))
    seriesRef.current.setData(data)
    if (chartApiRef.current) chartApiRef.current.timeScale().fitContent()
  }, [ohlcv])

  return (
    <div ref={containerRef} className="w-full rounded-xl border border-slate-800 bg-navy-900 p-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 font-mono">{ticker} | 1H</div>
    </div>
  )
}