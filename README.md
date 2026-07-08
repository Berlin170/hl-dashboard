# HL Earnings Dashboard

A dark-theme React 19 + Vite dashboard that tracks quarterly earnings for Samsung, SK Hynix, and Micron, mapping each earnings print to its Hyperliquid HIP-3 xyz ticker.

## Features

- **Real-time HL WebSocket**: Live OHLCV, L2 order books, funding rates, spreads, skew via Hyperliquid `wss://api.hyperliquid.xyz/ws`
- **News Feed**: Fetches fresh earnings headlines from `/api/news` (Google News RSS via Express proxy)
- **GoldRush Wallet Panel**: Looks up a HyperEVM wallet's token balances/USD value via the GoldRush (Covalent) `balances_v2` API — a collateral check before trading these earnings prints. HIP-3 ticker mapping itself uses the static `COMPANY_MAP` (GoldRush doesn't index Hyperliquid's native perp markets, only the HyperEVM chain)
- **Market Metrics**: Price change since headline, 24h volume, dollar OI, funding, spread, liquidity, order-book skew
- **Early Positioning Leaderboard**: Ranks earnings prints by composite score (volume, skew, recency)
- **Lightweight Charts**: Candlestick charts per market
- **Price Flashing**: Cards flash green/red on price updates
- **WebSocket Status**: Real-time connection indicators

## Architecture

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite + Tailwind 4 + proxy to API server |
| `api-server.cjs` | Express server proxying `/api/news` to Google News RSS |
| `src/pages/Dashboard.jsx` | Main orchestrator layout |
| `src/components/PriceCard.jsx` | Per-market live pricing card with flash |
| `src/components/MiniChart.jsx` | lightweight-charts candlestick per market |
| `src/components/EarningsCard.jsx` | Earnings result card (beat/miss/guidance) |
| `src/components/OrderBook.jsx` | L2 depth visualization |
| `src/components/Leaderboard.jsx` | Early positioning ranking |
| `src/hooks/useHLWebSocket.js` | Hyperliquid WS hook (candles + book + trades) |
| `src/hooks/useNews.js` | News fetch with 60s polling |
| `src/hooks/useGoldRush.js` | GoldRush wallet balances hook |
| `src/components/WalletPanel.jsx` | GoldRush-powered HyperEVM collateral wallet lookup |
| `src/lib/constants.js` | Company-to-HIP3 mapping |
| `src/lib/formatters.js` | Price/volume/date formatting |
| `src/lib/goldrush.js` | GoldRush (Covalent) API client — `balances_v2` on `hyperevm-mainnet` |

## Styling

- Tailwind CSS v4 with `@theme` custom colors
- Dark navy palette: `#0a0f1c`, `#0f172a`, `#1e293b`
- Neon accents: teal `#06b6d4`, pink `#ec4899`
- Price flash animations for green/red ticks

## Running

```bash
# Install dependencies
npm install

# Start the API server (in a separate terminal)
node api-server.cjs

# Start the Vite dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and the proxy routes `/api/news` to `http://localhost:3001`.

## Environment

- `VITE_GOLDRUSH_API_KEY` — set in `.env` (included)

## Fallback Mappings

| Company | HIP-3 Ticker | Fallback |
|---------|-------------|----------|
| Samsung | `xyz:SMSN-USDC` | SMSN |
| SK Hynix | `xyz:SKHX-USDC` | SKHX |
| Micron | `xyz:MU-USDC` | MU |