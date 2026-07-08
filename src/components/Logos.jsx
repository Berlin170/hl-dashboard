export function SamsungLogo({ className = 'h-10 w-10' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#1428A0" />
      <ellipse cx="24" cy="24" rx="18" ry="10" fill="none" stroke="white" strokeWidth="1.8" transform="rotate(-7 24 24)" />
      <text x="24" y="37" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="6" fontWeight="800" fill="white" letterSpacing="0.4">SAMSUNG</text>
    </svg>
  )
}

export function SkHynixLogo({ className = 'h-10 w-10' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#EA0029" />
      <text x="24" y="21" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fontWeight="900" fill="white" letterSpacing="-0.5">SK</text>
      <text x="24" y="35" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="11" fontWeight="700" fill="white" letterSpacing="0.3">hynix</text>
    </svg>
  )
}

export function MicronLogo({ className = 'h-10 w-10' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#0096D6" />
      <path d="M12 34 L12 16 L20 26 L28 16 L28 34" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="20" y1="26" x2="20" y2="34" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <text x="24" y="44" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="5" fontWeight="bold" fill="white" opacity="0.9">micron</text>
    </svg>
  )
}

export function HyperliquidLogo({ className = 'h-10 w-10' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="currentColor" opacity="0.10" />
      <path d="M10 16 L24 32 L38 16" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M14 22 L24 34 L34 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
    </svg>
  )
}

export function CompanyLogo({ company, className = 'h-10 w-10' }) {
  const name = (company || '').toLowerCase()
  if (name.includes('samsung') || name === 'smsn') {
    return <SamsungLogo className={className} />
  }
  if (name.includes('hynix') || name.includes('sk hynix') || name === 'skhx') {
    return <SkHynixLogo className={className} />
  }
  if (name.includes('micron') || name === 'mu') {
    return <MicronLogo className={className} />
  }

  // Fallback generic initial avatar
  const initials = company?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?'
  return (
    <div className={`flex items-center justify-center rounded-xl bg-slate-700 text-white font-bold text-xs ${className}`}>
      {initials}
    </div>
  )
}