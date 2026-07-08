export const fmtPrice = (n, d = 4) => {
  if (n == null) return '--'
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
}

export const fmtPct = (n) => {
  if (n == null) return '--'
  const sign = n > 0 ? '+' : ''
  return `${sign}${Number(n).toFixed(2)}%`
}

export const fmtVol = (n) => {
  if (n == null) return '--'
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`
  return n.toFixed(2)
}

export const fmtDate = (d) => {
  if (!d) return '--'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const clsPct = (n) => {
  if (n == null) return 'text-slate-400'
  return n >= 0 ? 'text-flash-green' : 'text-flash-red'
}
