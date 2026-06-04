'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function ForegroundClouds() {
  // Configuración de nubes MASIVAS con distribución vertical total
  const foregroundClouds = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      // Distribuir en todo el alto de la pantalla (de 0% a 90%)
      top: `${(i * 25) + Math.random() * 15}%`, 
      duration: 25 + Math.random() * 12,
      delay: i * 7,
      size: 1100 + Math.random() * 500,
      opacity: 0.2 + Math.random() * 0.15,
      // Movimiento diagonal leve para mayor naturalidad
      exitY: `${(Math.random() - 0.5) * 200}px`, 
    }))
  }, [])

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
            filter: 'blur(5px)', // Desenfoque cinemático
          }}
          initial={{ x: '-130%', y: 0 }}
          animate={{ 
            x: '130vw',
            y: c.exitY // Trayectoria diagonal
          }}
          transition={{
            duration: c.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: -c.delay, 
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
