import { useEffect, useRef, useState, useCallback } from 'react'

const HL_WS = 'wss://api.hyperliquid.xyz/ws'

function parseLevel(l) {
  return { px: Number(l.px), sz: Number(l.sz), n: l.n }
}

export function useHLWebSocket(ticker) {
  const [connectionStatus, setConnectionStatus] = useState('idle')
  const [ohlcv, setOhlcv] = useState(null)
  const [l2Book, setL2Book] = useState(null)
  const [assetCtx, setAssetCtx] = useState(null)
  const wsRef = useRef(null)
  const pricesRef = useRef({})

  const send = useCallback((msg) => {
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify(msg))
    }
  }, [])

  useEffect(() => {
    if (!ticker) return
    // HIP-3 markets are dex-qualified (e.g. "xyz:SMSN") — HL's WS rejects the
    // subscription if you strip the dex prefix, so the ticker is used as-is.
    const coin = ticker
    const ws = new WebSocket(HL_WS)
    wsRef.current = ws
    setConnectionStatus('connecting')
    ws.onopen = () => {
      setConnectionStatus('connected')
      send({ method: 'subscribe', subscription: { type: 'candle', coin, interval: '1h' } })
      send({ method: 'subscribe', subscription: { type: 'l2Book', coin } })
      send({ method: 'subscribe', subscription: { type: 'activeAssetCtx', coin } })
      send({ method: 'subscribe', subscription: { type: 'trades', coin } })
    }
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.channel === 'candle') {
        const c = msg.data
        const candle = { t: c.t, o: Number(c.o), h: Number(c.h), l: Number(c.l), c: Number(c.c), v: Number(c.v) }
        setOhlcv(prev => {
          if (!prev) return [candle]
          const idx = prev.findLastIndex(p => p.t <= candle.t)
          if (idx >= 0 && prev[idx].t === candle.t) {
            const copy = [...prev]
            copy[idx] = candle
            return copy
          }
          return [...prev, candle].slice(-100)
        })
      }
      if (msg.channel === 'l2Book') {
        const [bidLevels, askLevels] = msg.data.levels || [[], []]
        setL2Book({ bids: bidLevels.map(parseLevel), asks: askLevels.map(parseLevel) })
      }
      if (msg.channel === 'activeAssetCtx') {
        setAssetCtx(msg.data.ctx)
      }
      if (msg.channel === 'trades') {
        const arr = Array.isArray(msg.data) ? msg.data : [msg.data]
        const last = arr[arr.length - 1]
        if (last?.px) pricesRef.current.last = Number(last.px)
      }
      if (msg.channel === 'error') {
        console.error('HL WS error:', msg.data)
        setConnectionStatus('error')
      }
    }
    ws.onerror = () => setConnectionStatus('error')
    ws.onclose = () => setConnectionStatus('disconnected')
    return () => ws.close()
  }, [ticker, send])

  const markPrice = assetCtx ? Number(assetCtx.markPx) : null
  const midPrice = assetCtx ? Number(assetCtx.midPx) : null
  const oraclePrice = assetCtx ? Number(assetCtx.oraclePx) : null
  const prevDayPrice = assetCtx ? Number(assetCtx.prevDayPx) : null
  const funding = assetCtx ? Number(assetCtx.funding) : null
  const dayVolumeUsd = assetCtx ? Number(assetCtx.dayNtlVlm) : null
  const openInterestUsd = assetCtx && markPrice ? Number(assetCtx.openInterest) * markPrice : null
  const change24h = markPrice && prevDayPrice ? ((markPrice - prevDayPrice) / prevDayPrice) * 100 : null

  const ask = l2Book?.asks?.[0]?.px
  const bid = l2Book?.bids?.[0]?.px
  const spread = ask && bid ? ((ask - bid) / ((ask + bid) / 2)) * 100 : null
  const askDepth = l2Book?.asks?.reduce((s, a) => s + a.sz * a.px, 0) || 0
  const bidDepth = l2Book?.bids?.reduce((s, b) => s + b.sz * b.px, 0) || 0
  const skew = bidDepth + askDepth > 0 ? ((bidDepth - askDepth) / (bidDepth + askDepth)) * 100 : 0

  return {
    connectionStatus,
    ohlcv,
    l2Book,
    funding,
    markPrice,
    midPrice,
    oraclePrice,
    change24h,
    dayVolumeUsd,
    openInterestUsd,
    lastPrice: pricesRef.current.last || midPrice || markPrice,
    spread,
    skew,
    askDepth,
    bidDepth,
    send
  }
}
