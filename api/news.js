import { parseStringPromise } from 'xml2js'

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

export default async function handler(req, res) {
  try {
    const rssRes = await fetch(getQueryUrl())
    const xml = await rssRes.text()
    const parsed = await parseStringPromise(xml)
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
    res.status(200).json({ items: mapped })
  } catch (err) {
    console.error('News fetch error:', err.message)
    res.status(200).json({ items: [] })
  }
}
