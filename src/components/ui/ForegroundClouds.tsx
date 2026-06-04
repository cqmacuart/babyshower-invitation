'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'

export function ForegroundClouds() {
  const isMobile = useIsMobile()

  const foregroundClouds = useMemo(() => {
    const count = isMobile ? 2 : 4
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: `${(i * 30) + 5}%`,
      duration: 28 + i * 8,
      delay: -(i * 7),
      size: isMobile ? 700 + i * 150 : 1100 + i * 150,
      opacity: isMobile ? 0.12 + i * 0.04 : 0.2 + i * 0.05,
    }))
  }, [isMobile])

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {foregroundClouds.map((c) => (
        <motion.div
          key={c.id}
          className="absolute"
          style={{
            top: c.top,
            width: c.size,
            opacity: c.opacity,
            willChange: 'transform',
          }}
          initial={{ x: '-130%' }}
          animate={{ x: '130vw' }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: c.delay,
          }}
        >
          <svg viewBox="0 0 200 100" fill="white">
            <ellipse cx="60" cy="60" rx="40" ry="30" opacity="0.8" />
            <ellipse cx="100" cy="50" rx="55" ry="45" />
            <ellipse cx="140" cy="62" rx="45" ry="35" opacity="0.8" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
