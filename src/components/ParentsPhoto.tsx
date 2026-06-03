'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface ParentsPhotoProps {
  parentA: string
  parentB: string
}

/* Clothespin SVG */
function Clothespin() {
  return (
    <svg viewBox="0 0 12 24" className="w-3 h-6" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="0" width="8" height="14" rx="2" fill="#D4A96A" />
      <rect x="4" y="6" width="4" height="8" rx="1" fill="#C49050" />
      <rect x="0" y="14" width="5" height="10" rx="1.5" fill="#D4A96A" />
      <rect x="7" y="14" width="5" height="10" rx="1.5" fill="#D4A96A" />
      <rect x="4" y="12" width="4" height="4" rx="1" fill="#B07030" />
    </svg>
  )
}

/* Heart polaroid placeholder */
function HeartPlaceholder() {
  return (
    <div
      className="w-full"
      style={{ aspectRatio: '1 / 1', background: 'linear-gradient(135deg, #EDE9FF 0%, #FFE4EE 100%)' }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="#C9B8F5" className="w-14 h-14 opacity-70">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </div>
  )
}

export function ParentsPhoto({ parentA, parentB }: ParentsPhotoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-4 py-6 relative"
    >
      {/* Hanging rope */}
      <div
        className="absolute left-8 right-8 top-6 h-px"
        style={{ backgroundColor: 'rgba(180,160,120,0.35)', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
      />

      <div className="flex justify-center gap-5 items-start">
        {/* Polaroid 1 — Photo */}
        <motion.div
          drag
          dragConstraints={{ left: -20, right: 20, top: -10, bottom: 10 }}
          dragElastic={0.35}
          whileHover={{ scale: 1.04 }}
          animate={{ rotate: [-2.5, 2.5, -2.5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative bg-white p-2.5 pb-10 shadow-[0_14px_28px_rgba(0,0,0,0.10)] cursor-grab active:cursor-grabbing"
          style={{ rotate: '-3deg', width: '148px', transformOrigin: 'top center' }}
        >
          {/* Pin */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Clothespin />
          </div>

          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
            <Image
              src="/images/parents.jpg"
              alt={`${parentA} y ${parentB}`}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            />
          </div>
          <p
            className="text-center mt-2 text-sm"
            style={{ fontFamily: 'var(--font-handwritten)', color: '#4A3F6B', fontSize: '1.05rem' }}
          >
            {parentA} & {parentB}
          </p>
        </motion.div>

        {/* Polaroid 2 — Heart placeholder */}
        <motion.div
          drag
          dragConstraints={{ left: -20, right: 20, top: -10, bottom: 10 }}
          dragElastic={0.35}
          whileHover={{ scale: 1.04 }}
          animate={{ rotate: [3, -3, 3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative bg-white p-2.5 pb-10 shadow-[0_14px_28px_rgba(0,0,0,0.09)] cursor-grab active:cursor-grabbing"
          style={{ rotate: '4deg', width: '148px', marginTop: '20px', transformOrigin: 'top center' }}
        >
          {/* Pin */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Clothespin />
          </div>

          <HeartPlaceholder />
          <p
            className="text-center mt-2 text-sm"
            style={{ fontFamily: 'var(--font-handwritten)', color: '#C9B8F5', fontSize: '1.05rem' }}
          >
            Próximamente 🌟
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
