'use client'

import { motion } from 'framer-motion'

export function FloatingBalloonHero({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        y: [0, -25, 0],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        viewBox="0 0 200 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          <radialGradient id="balloonGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#EDE9FF" />
            <stop offset="70%" stopColor="#C9B8F5" />
            <stop offset="100%" stopColor="#B197E6" />
          </radialGradient>
          <linearGradient id="basketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
        </defs>

        {/* Balloon Envelope */}
        <path
          d="M100,20 C150,20 180,60 180,105 C180,160 140,200 100,200 C60,200 20,160 20,105 C20,60 50,20 100,20Z"
          fill="url(#balloonGrad)"
        />
        
        {/* Decorative Vertical Stripes */}
        <path d="M100,20 C125,20 145,55 145,105 C145,155 125,200 100,200" stroke="white" strokeWidth="2" strokeOpacity="0.4" fill="none" />
        <path d="M100,20 C75,20 55,55 55,105 C55,155 75,200 100,200" stroke="white" strokeWidth="2" strokeOpacity="0.4" fill="none" />

        {/* Rigging Lines */}
        <line x1="60" y1="190" x2="75" y2="230" stroke="#4A3F6B" strokeWidth="1.5" />
        <line x1="140" y1="190" x2="125" y2="230" stroke="#4A3F6B" strokeWidth="1.5" />
        <line x1="100" y1="200" x2="100" y2="230" stroke="#4A3F6B" strokeWidth="1" strokeOpacity="0.6" />

        {/* Basket */}
        <rect x="75" y="230" width="50" height="35" rx="6" fill="url(#basketGrad)" />
        <rect x="75" y="230" width="50" height="8" rx="2" fill="#B45309" />
        
        {/* Basket Detail - Woven Pattern Effect */}
        <line x1="85" y1="238" x2="85" y2="265" stroke="#78350F" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="100" y1="238" x2="100" y2="265" stroke="#78350F" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="115" y1="238" x2="115" y2="265" stroke="#78350F" strokeWidth="1" strokeOpacity="0.4" />

        {/* Floating Heart inside Balloon */}
        <motion.path
          d="M100,105 c0,0 -15,-15 -15,-25 c0,-8 6,-14 14,-14 c4,0 7,2 9,5 c2,-3 5,-5 9,-5 c8,0 14,6 14,14 c0,10 -15,25 -15,25"
          fill="white"
          opacity="0.9"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>

      {/* Little flags or pennants */}
      <motion.div 
        className="absolute top-[65%] left-[20%] w-full h-8 flex gap-1 pointer-events-none"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="w-4 h-5 bg-pink/80" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
        <div className="w-4 h-5 bg-mint/80" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
        <div className="w-4 h-5 bg-butter/80" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
      </motion.div>
    </motion.div>
  )
}
