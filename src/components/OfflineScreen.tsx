'use client'

interface OfflineScreenProps {
  onRetry: () => void
}

export function OfflineScreen({ onRetry }: OfflineScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
      style={{ backgroundColor: '#FFF8F0' }}
    >
      <div style={{ animation: 'spin-slow 8s linear infinite' }}>
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="44" rx="38" ry="18" fill="#EDE9FF" />
          <circle cx="20" cy="38" r="16" fill="#EDE9FF" />
          <circle cx="40" cy="30" r="22" fill="#EDE9FF" />
          <circle cx="60" cy="36" r="16" fill="#EDE9FF" />
        </svg>
      </div>

      <p
        className="text-lg text-center"
        style={{ fontFamily: 'var(--font-serif)', color: '#4A3F6B' }}
      >
        Conectando a la celebración...
      </p>

      <button
        onClick={onRetry}
        className="px-8 py-3 rounded-full text-white font-semibold transition-transform active:scale-95"
        style={{ backgroundColor: '#C9B8F5' }}
      >
        Reintentar
      </button>
    </div>
  )
}
