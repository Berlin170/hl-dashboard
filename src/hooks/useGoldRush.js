import { useState, useEffect } from 'react'
import { getWalletBalances } from '../lib/goldrush'

export function useWalletBalances(address) {
  const [balances, setBalances] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!address) { setBalances([]); setError(null); return }
    let cancelled = false
    setLoading(true)
    setError(null)
    getWalletBalances(address)
      .then(result => { if (!cancelled) setBalances(result) })
      .catch(err => { if (!cancelled) { setError(err.message); setBalances([]) } })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [address])

  return { balances, loading, error }
}
