const API_KEY = import.meta.env.VITE_GOLDRUSH_API_KEY
const BASE = 'https://api.covalenthq.com/v1'
const HYPEREVM_CHAIN = 'hyperevm-mainnet'

async function goldRushRequest(path, params = {}) {
  const url = new URL(`${BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  })
  if (!res.ok) throw new Error(`GoldRush ${res.status}`)
  return res.json()
}

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/

// GoldRush indexes HyperEVM (the Hyperliquid EVM chain) for on-chain wallet
// data. It does not carry HIP-3 perp market data (OHLCV/order books/funding
// come straight from Hyperliquid's own WS, see useHLWebSocket). This resolves
// a wallet's token balances on HyperEVM — used for a collateral/portfolio
// lookup rather than market resolution.
export async function getWalletBalances(address) {
  if (!ADDRESS_RE.test(address)) throw new Error('Invalid HyperEVM address')
  const data = await goldRushRequest(`/${HYPEREVM_CHAIN}/address/${address}/balances_v2/`, {
    'quote-currency': 'USD'
  })
  const items = data?.data?.items || []
  return items
    .filter(t => !t.is_spam && Number(t.balance) > 0)
    .map(t => ({
      symbol: t.contract_ticker_symbol,
      name: t.contract_display_name || t.contract_name,
      logo: t.logo_urls?.token_logo_url || null,
      balance: Number(t.balance) / 10 ** t.contract_decimals,
      usdValue: t.quote || 0,
      prettyUsdValue: t.pretty_quote || '$0.00',
      isNative: !!t.is_native_token
    }))
    .sort((a, b) => b.usdValue - a.usdValue)
}
