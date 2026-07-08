import { useState } from 'react'
import { useWalletBalances } from '../hooks/useGoldRush'

export default function WalletPanel() {
  const [input, setInput] = useState('')
  const [address, setAddress] = useState('')
  const { balances, loading, error } = useWalletBalances(address)

  const total = balances.reduce((s, b) => s + b.usdValue, 0)

  const submit = (e) => {
    e.preventDefault()
    setAddress(input.trim())
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-navy-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Collateral Wallet</h2>
        <span className="rounded bg-navy-800 px-1.5 py-0.5 text-[9px] font-mono text-neon-teal tracking-wider">Powered by GoldRush</span>
      </div>
      <form onSubmit={submit} className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="0x… HyperEVM wallet address"
          className="flex-1 rounded-md bg-navy-950 border border-slate-800 px-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-neon-teal/50"
        />
        <button
          type="submit"
          className="rounded-md bg-neon-teal/10 border border-neon-teal/30 px-3 py-1.5 text-xs font-mono text-neon-teal hover:bg-neon-teal/20 transition-colors"
        >
          Check
        </button>
      </form>

      {!address && <p className="text-[11px] text-slate-600">Enter a HyperEVM address to view available USDC/HYPE collateral before trading these earnings prints.</p>}
      {loading && <p className="text-[11px] text-slate-500">Fetching balances…</p>}
      {error && <p className="text-[11px] text-rose-400">{error}</p>}

      {!loading && !error && address && balances.length === 0 && (
        <p className="text-[11px] text-slate-600">No token balances found for this address on HyperEVM.</p>
      )}

      {!loading && balances.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-1.5 mb-1.5">
            <span>Total</span>
            <span className="text-slate-100 font-semibold">${total.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
          </div>
          {balances.slice(0, 6).map(b => (
            <div key={b.symbol} className="flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-1.5 text-slate-300">
                {b.logo && <img src={b.logo} alt="" className="h-4 w-4 rounded-full" />}
                <span>{b.symbol}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span>{b.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })}</span>
                <span className="text-slate-200 w-20 text-right">{b.prettyUsdValue}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
