export const COMPANY_MAP = {
  Samsung: {
    ticker: 'SMSN',
    hlTicker: 'xyz:SMSN',
    name: 'Samsung Electronics',
    fallbackCoin: 'SMSN'
  },
  'SK Hynix': {
    ticker: 'SKHX',
    hlTicker: 'xyz:SKHX',
    name: 'SK Hynix',
    fallbackCoin: 'SKHX'
  },
  Micron: {
    ticker: 'MU',
    hlTicker: 'xyz:MU',
    name: 'Micron Technology',
    fallbackCoin: 'MU'
  }
}

export const COMPANY_KEYS = Object.keys(COMPANY_MAP)

export const resolveCompany = (headline) => {
  const h = headline.toLowerCase()
  if (h.includes('samsung')) return COMPANY_MAP.Samsung
  if (h.includes('sk hynix') || h.includes('skhynix') || h.includes('hynix')) return COMPANY_MAP['SK Hynix']
  if (h.includes('micron')) return COMPANY_MAP.Micron
  return null
}
