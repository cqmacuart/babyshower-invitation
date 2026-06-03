'use client'

import { FloatingBalloon } from '@/components/ui/FloatingBalloon'

interface IntroGateProps {
  onEnter: () => void
  babyName?: string
}

export function IntroGate({ onEnter, babyName }: IntroGateProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ backgroundColor: '#FFF8F0' }}
    >
      {/* Decorative floating clouds */}
      <div
        className="absolute top-8 left-4 opacity-60"
        style={{ animation: 'float 6s ease-in-out infinite' }}
      >
        <svg width="80" height="48" viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="32" rx="38" ry="20" fill="#EDE9FF" />
          <circle cx="20" cy="28" r="16" fill="#EDE9FF" />
          <circle cx="40" cy="22" r="20" fill="#EDE9FF" />
          <circle cx="60" cy="26" r="15" fill="#EDE9FF" />
        </svg>
      </div>
      <div
        className="absolute top-16 right-2 opacity-40"
        style={{ animation: 'float-slow 8s ease-in-out infinite' }}
      >
        <svg width="60" height="36" viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="24" rx="28" ry="15" fill="#FFE4EE" />
          <circle cx="14" cy="20" r="12" fill="#FFE4EE" />
          <circle cx="30" cy="15" r="16" fill="#FFE4EE" />
          <circle cx="46" cy="19" r="11" fill="#FFE4EE" />
        </svg>
      </div>

      {/* Balloon */}
      <div className="mb-6">
        <FloatingBalloon size={140} />
      </div>

      {/* Headline */}
      <p
        className="text-lg text-center mb-2"
        style={{ fontFamily: 'var(--font-serif)', color: '#4A3F6B' }}
      >
        Te invitamos a celebrar
      </p>

      {/* Baby name */}
      {babyName && (
        <h1
          className="text-4xl font-bold text-center mb-8"
          style={{ fontFamily: 'var(--font-serif)', color: '#C9B8F5' }}
        >
          {babyName}
        </h1>
      )}

      {/* CTA button */}
      <button
        onClick={onEnter}
        className="px-8 py-4 rounded-full text-white text-lg font-semibold shadow-lg transition-transform active:scale-95"
        style={{ backgroundColor: '#C9B8F5' }}
      >
        Descubrir Invitación
      </button>

      {/* Bottom decorative balloons */}
      <div className="absolute bottom-4 left-6 opacity-30">
        <FloatingBalloon size={60} />
      </div>
      <div className="absolute bottom-8 right-8 opacity-20">
        <FloatingBalloon size={45} />
      </div>
    </div>
  )
}
