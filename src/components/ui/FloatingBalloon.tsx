'use client'

import { motion } from 'framer-motion'

interface FloatingBalloonProps {
  size?: number
}

export function FloatingBalloon({ size = 120 }: FloatingBalloonProps) {
  const w = size
  const h = size * 1.3

  return (
    <motion.div
      animate={{ y: [-12, 12], rotate: [-3, 3] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      }}
      style={{ display: 'inline-block' }}
    >
      <svg
        width={w}
        height={h}
        viewBox="0 0 120 156"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Balloon body */}
        <ellipse cx="60" cy="58" rx="46" ry="52" fill="#C9B8F5" />
        {/* Highlight */}
        <ellipse cx="42" cy="36" rx="12" ry="16" fill="#EDE9FF" opacity="0.7" />
        {/* Bottom tip */}
        <path d="M60 110 L55 122 Q60 128 65 122 Z" fill="#C9B8F5" />
        {/* Knot */}
        <circle cx="60" cy="112" r="4" fill="#4A3F6B" />
        {/* String */}
        <path
          d="M60 116 Q52 130 58 145 Q62 155 60 156"
          stroke="#4A3F6B"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Decorative dots */}
        <circle cx="72" cy="60" r="3" fill="#F5C0D0" opacity="0.8" />
        <circle cx="50" cy="75" r="2" fill="#B8F0D8" opacity="0.8" />
        <circle cx="68" cy="80" r="2" fill="#F5ECBA" opacity="0.8" />
      </svg>
    </motion.div>
  )
}
