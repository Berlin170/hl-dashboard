const express = require('express')
const cors = require('cors')
const https = require('https')
const xml2js = require('xml2js')
const app = express()

const PORT = 3001
const SQUASH_KW = [
  'earnings', 'revenue', 'profit', 'loss', 'EPS', 'guidance', 'beat', 'miss',
  'forecast', 'outlook', 'quarterly', 'Q1', 'Q2', 'Q3', 'Q4', 'fiscal',
  'Samsung', 'Hynix', 'SK Hynix', 'Micron', 'semi', 'chip', 'DRAM', 'NAND', 'HBM'
]
const RELEVANT_PATTERN = new RegExp(SQUASH_KW.join('|'), 'i')

function getQueryUrl() {
  const query = encodeURIComponent('Samsung SK Hynix Micron earnings revenue quarterly')
  return `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`
}

function fetchRSS(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

app.use(cors())

app.get('/api/news', async (req, res) => {
  try {
    const xml = await fetchRSS(getQueryUrl())
    const parsed = await xml2js.parseStringPromise(xml)
    const items = parsed.rss?.channel?.[0]?.item || []
    const mapped = items
      .filter(item => RELEVANT_PATTERN.test(item.title?.[0] || ''))
      .slice(0, 12)
      .map(item => ({
        headline: item.title?.[0]?.replace(/&#39;/g, "'").replace(/&quot;/g, '"') || '',
        source: item.source?.[0]?._ || 'Google News',
        publishedAt: new Date(item.pubDate?.[0] || Date.now()).toISOString(),
        link: item.link?.[0] || '',
        summary: item.description?.[0]?.replace(/<[^>]+>/g, '') || ''
      }))
    res.json({ items: mapped })
  } catch (err) {
    console.error('News fetch error:', err.message)
    res.json({ items: [] })
  }
})

app.listen(PORT, () => console.log(`API server on http://localhost:${PORT}`))