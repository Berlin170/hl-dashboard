import { useState, useEffect } from 'react'

const MOCK_NEWS = [
  {
    id: '1',
    headline: 'Samsung Q3 2025 Earnings: Revenue 79.1T, Beats by 2.3%',
    source: 'Reuters',
    publishedAt: '2025-07-01T06:00:00Z',
    company: 'Samsung',
    ticker: 'SMSN',
    actual: '79.1T',
    estimate: '77.3T',
    guidance: 'positive',
    summary: 'Strong semiconductor demand drove upside. Memory pricing stabilized above contract levels. Capex guided slightly higher for HBM3E ramp.'
  },
  {
    id: '2',
    headline: 'SK Hynix Reports Q3 2025 Operating Profit 7.3T, Miss on Margins',
    source: 'Bloomberg',
    publishedAt: '2025-07-02T08:30:00Z',
    company: 'SK Hynix',
    ticker: 'SKHX',
    actual: '7.3T',
    estimate: '7.8T',
    guidance: 'neutral',
    summary: 'HBM shipments exceeded volume targets but ASP compression in commodity DRAM weighed. 2026 HBM capacity fully booked.'
  },
  {
    id: '3',
    headline: 'Micron Q3 FY2025 EPS $0.62 vs $0.51 Estimate, Raises Q4 Guide',
    source: 'CNBC',
    publishedAt: '2025-06-25T20:15:00Z',
    company: 'Micron',
    ticker: 'MU',
    actual: '0.62',
    estimate: '0.51',
    guidance: 'positive',
    summary: 'Data-center revenue up 93 pct YoY. NAND pricing recovery faster than expected. Inventory weeks declined.'
  }
]

function extractFields(title) {
  const companies = ['Samsung', 'SK Hynix', 'Micron', 'SKHynix', 'Hynix']
  const company = companies.find(c => title.toLowerCase().includes(c.toLowerCase())) || 'Unknown'
  const tickerMap = { Samsung: 'SMSN', 'SK Hynix': 'SKHX', SKHynix: 'SKHX', Hynix: 'SKHX', Micron: 'MU' }
  const ticker = tickerMap[company] || ''
  const beat = title.match(/beat/i) ? 'Beat' : title.match(/miss/i) ? 'Miss' : ''
  const g = title.match(/guidance.*?([\w]+)/i)
  const guidance = g ? g[1].toLowerCase() : (beat === 'Beat' ? 'positive' : beat === 'Miss' ? 'negative' : 'neutral')
  const numM = title.match(/([0-9.]+[TBMK]?)/)
  const actual = numM ? numM[1] : ''
  const estM = title.match(/estimate.*?([0-9.]+[TBMK]?)/i)
  const estimate = estM ? estM[1] : ''
  return { company: (company === 'SKHynix' || company === 'Hynix') ? 'SK Hynix' : company, ticker, actual, estimate, guidance, summary: '' }
}

export function useNews() {
  const [news, setNews] = useState(MOCK_NEWS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      try {
        const res = await fetch('/api/news')
        if (!res.ok) throw new Error('news fetch failed')
        const data = await res.json()
        if (data.items && data.items.length) {
          const enriched = data.items.map(item => ({
            id: item.publishedAt || Math.random().toString(36).slice(2),
            headline: item.headline,
            source: item.source,
            publishedAt: item.publishedAt,
            ...extractFields(item.headline),
            summary: item.summary || ''
          }))
          setNews(prev => {
            const map = new Map([...enriched, ...prev].map(n => [n.id, n]))
            return Array.from(map.values()).slice(0, 20)
          })
        }
      } catch { /* keep mock data */ } finally { setLoading(false) }
    }
    fetchNews()
    const interval = setInterval(fetchNews, 60000)
    return () => clearInterval(interval)
  }, [])

  return { news, loading, error }
}