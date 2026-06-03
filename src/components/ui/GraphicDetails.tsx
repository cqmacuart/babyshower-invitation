'use client'

import { motion } from 'framer-motion'
import { Clock as ClockIcon } from 'lucide-react'

interface EventGraphicProps {
  date: string
  time: string
}

export function EventGraphicSection({ date, time }: EventGraphicProps) {
  const d = new Date(date + 'T12:00:00')
  const month = d.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '')
  const dayName = d.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase()
  const dayNum = d.getDate()

  return (
    <div className="relative w-full max-w-[340px] mx-auto py-10 px-4 rounded-[3rem] overflow-hidden"
    >
      {/* ── Main Almanac (Centered & Enlarged) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative z-10 w-full max-w-[220px] mx-auto"
      >
        <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto]">
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          {/* Multiple Pages stack effect */}
          <rect x="20" y="55" width="160" height="170" rx="12" fill="#e2e8f0" />
          <rect x="20" y="50" width="160" height="170" rx="12" fill="white" />
          
          {/* Header */}
          <path d="M20 62 C20 55.3726 25.3726 50 32 50 H168 C174.627 50 180 55.3726 180 62 V90 H20 V62Z" fill="#c9a8e0" />

          {/* Holes */}
          <circle cx="55" cy="55" r="6" fill="#4a3a61" />
          <circle cx="100" cy="55" r="6" fill="#4a3a61" />
          <circle cx="145" cy="55" r="6" fill="#4a3a61" />

          {/* Metallic Rings */}
          <path d="M45 10 C45 0 65 0 65 10 V65 C65 75 45 75 45 65 V10Z" fill="url(#ring-grad)" />
          <path d="M90 10 C90 0 110 0 110 10 V65 C110 75 90 75 90 65 V10Z" fill="url(#ring-grad)" />
          <path d="M135 10 C135 0 155 0 155 10 V65 C155 75 135 75 135 65 V10Z" fill="url(#ring-grad)" />

          {/* Date Content */}
          <text x="100" y="80" textAnchor="middle" fill="white" className="font-bold text-[24px] tracking-[0.1em]" style={{ fontFamily: 'var(--font-display)' }}>{month}</text>
          <text x="100" y="175" textAnchor="middle" fill="#3e3a4d" className="font-bold text-[85px]" style={{ fontFamily: 'var(--font-display)' }}>{dayNum}</text>
          <text x="100" y="205" textAnchor="middle" fill="#c9a8e0" className="font-bold text-[14px] tracking-[0.2em]" style={{ fontFamily: 'var(--font-display)' }}>{dayName}</text>
          
          <line x1="50" y1="105" x2="150" y2="105" stroke="#f1f5f9" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </motion.div>

      {/* ── Overlapping Clock (Bottom-Right) ── */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-4 right-0 z-20 w-[110px]"
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-xl">
          <defs>
            <radialGradient id="clock-face" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="#fff1f2" />
            </radialGradient>
          </defs>

          {/* Frame */}
          <circle cx="100" cy="100" r="95" fill="#e89aaa" />
          <circle cx="100" cy="100" r="88" fill="white" />
          <circle cx="100" cy="100" r="82" fill="url(#clock-face)" />

          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <line key={i} x1="100" y1="28" x2="100" y2="38" transform={`rotate(${i * 30} 100 100)`} stroke="#e89aaa" strokeWidth="4" strokeLinecap="round" />
          ))}

          {/* Center pin */}
          {/* <circle cx="100" cy="100" r="6" fill="#3e3a4d" /> */}
          
          {/* Glass reflection */}
          <path d="M40 40 Q100 20 160 40" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
        </svg>
        
        {/* Digital Time Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <span className="text-xl font-bold text-ink leading-none">{time.split(' ')[0]}</span>
          <span className="text-[8px] font-bold text-pink-deep uppercase tracking-tighter">{time.split(' ')[1] || 'PM'}</span>
        </div>
      </motion.div>

      {/* ── Decorative Baby Socks (Top-Left) ── */}
      <motion.div
        initial={{ opacity: 0, rotate: -30, x: -20 }}
        whileInView={{ opacity: 1, rotate: -15, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="absolute top-6 left-0 z-20 w-[160px]"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left Sock */}
          <path d="M30 20 L45 20 L45 50 C45 65 25 75 15 65 C5 55 15 45 20 45 L20 20" fill="#bfe3d4" stroke="white" strokeWidth="2" />
          <path d="M20 20 H45 V30 H20 V20Z" fill="white" opacity="0.5" />
          {/* Right Sock */}
          <path d="M55 25 L70 25 L70 55 C70 70 50 80 40 70 C30 60 40 50 45 50 L45 25" fill="#f6c6d0" stroke="white" strokeWidth="2" />
          <path d="M45 25 H70 V35 H45 V25Z" fill="white" opacity="0.5" />
          {/* String connecting them */}
          <path d="M37 20 Q50 0 62 25" stroke="#7a748a" strokeWidth="1" fill="none" strokeDasharray="2 2" />
        </svg>
      </motion.div>

      {/* ── Decorative Little Balloon (Bottom-Left) ── */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-4 z-0 w-[80px] opacity-100"
      >
        <svg viewBox="0 0 100 130" fill="none">
          <ellipse cx="50" cy="45" rx="35" ry="40" fill="#fff6bd" />
          <path d="M50 85 L45 95 Q50 100 55 95 Z" fill="#fff6bd" />
          <path d="M50 95 Q40 110 50 130" stroke="#7a748a" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>
    </div>
  )
}
