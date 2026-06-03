'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

export function OrigamiBird() {
  // Generar cigüeñas con variedad de alturas y tiempos
  const storks = useMemo(() => {
    return [
      { top: '15%', delay: 0, duration: 25, size: 120, opacity: 0.9 }, // Grande = Rápida (15s)
      { top: '35%', delay: 8, duration: 35, size: 90, opacity: 0.7 }, // Pequeña = Lenta (25s)
      { top: '60%', delay: 4, duration: 55, size: 75, opacity: 0.8 }, // Mediana = Media (20s)
    ]
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {storks.map((stork, i) => (
        <StorkInstance key={`stork-${i}`} {...stork} />
      ))}
    </div>
  )
}

function StorkInstance({ top, delay, duration, size, opacity = 1 }: { top: string, delay: number, duration: number, size: number, opacity?: number }) {
  return (
    <motion.div
      className="absolute left-0"
      style={{ top, width: size, opacity }}
      initial={{ x: '-150%' }}
      animate={{ 
        x: '120vw',
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
        delay: -delay,
      }}
    >
      <motion.div
        animate={{ translateY: [0, -25, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100%" height="auto" viewBox="-30 0 320 200" style={{ filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.08))' }}>
          
          {/* Ala Trasera */}
          <motion.g 
            style={{ originX: '120px', originY: '95px' }}
            animate={{ rotate: [-35, 25, -35] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <polygon points="120,95 80,20 40,40" fill="#93C5FD" stroke="#60A5FA" strokeWidth="0.5" strokeLinejoin="round"/>
            <polygon points="120,95 40,40 30,70" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="0.5" strokeLinejoin="round"/>
          </motion.g>

          {/* Cola facetada */}
          <polygon points="90,95 20,80 50,110" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" strokeLinejoin="round"/>
          <polygon points="90,95 50,110 70,120" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="0.5" strokeLinejoin="round"/>

          {/* Patas estiradas hacia atrás */}
          <polygon points="100,115 40,130 42,135 102,119" fill="#FBBF24"/>
          <polygon points="110,120 50,140 52,145 112,124" fill="#FCD34D"/>

          {/* Cuerpo principal facetado */}
          <polygon points="90,95 140,85 160,105 100,115" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" strokeLinejoin="round"/>
          <polygon points="100,115 160,105 130,125 80,120" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="0.5" strokeLinejoin="round"/>

          {/* Cuello facetado */}
          <polygon points="140,85 175,40 185,45 160,105" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" strokeLinejoin="round"/>
          <polygon points="160,105 185,45 195,55 150,110" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" strokeLinejoin="round"/>

          {/* Cabeza facetada */}
          <polygon points="175,40 200,35 210,45 185,45" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" strokeLinejoin="round"/>
          <polygon points="185,45 210,45 205,55 195,55" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="0.5" strokeLinejoin="round"/>

          {/* Ojo (Rombo) */}
          <polygon points="195,42 197,40 199,42 197,44" fill="#1E293B"/>

          {/* Pico Origami */}
          <polygon points="210,45 270,55 205,55" fill="#FDE68A" stroke="#FCD34D" strokeWidth="0.5" strokeLinejoin="round"/>
          <polygon points="205,55 260,60 195,55" fill="#FCD34D" stroke="#FBBF24" strokeWidth="0.5" strokeLinejoin="round"/>

          {/* Paquete de Bebé Origami */}
          <g>
            {/* Tira de la que cuelga */}
            <polygon points="230,52 235,53 210,110 205,108" fill="#F9A8D4"/>
            
            {/* Diamante de papel (El saquito) */}
            <polygon points="205,108 180,125 205,150 220,130" fill="#FBCFE8" stroke="#F9A8D4" strokeWidth="0.5" strokeLinejoin="round"/>
            <polygon points="205,108 220,130 240,140 230,115" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="0.5" strokeLinejoin="round"/>
            <polygon points="180,125 205,150 240,140 220,130" fill="#F9A8D4" stroke="#F472B6" strokeWidth="0.5" strokeLinejoin="round"/>
          </g>

          {/* Ala Frontal facetada */}
          <motion.g 
            style={{ originX: '120px', originY: '95px' }}
            animate={{ rotate: [-25, 35, -25] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <polygon points="120,95 70,10 30,30" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" strokeLinejoin="round"/>
            <polygon points="120,95 30,30 20,70" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" strokeLinejoin="round"/>
            <polygon points="120,95 20,70 80,90" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="0.5" strokeLinejoin="round"/>
          </motion.g>

        </svg>
      </motion.div>
    </motion.div>
  )
}
