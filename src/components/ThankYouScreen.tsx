'use client'

import { motion } from 'framer-motion'
import { CloudsBackground } from '@/components/CloudsBackground'
import { ForegroundClouds } from '@/components/ui/ForegroundClouds'

interface ThankYouScreenProps {
  babyName?: string
  parentA?: string
  parentB?: string
}

export function ThankYouScreen({ babyName, parentA, parentB }: ThankYouScreenProps) {
  const parents = parentA && parentB ? `${parentA} & ${parentB}` : parentA ?? parentB

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <CloudsBackground />
      <ForegroundClouds />

      <div className="relative z-10 w-full max-w-[420px] mx-auto px-6 py-16 flex flex-col items-center gap-8 text-center">

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="text-7xl"
        >
          🌸
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-3"
        >
          <span
            className="block text-2xl"
            style={{ fontFamily: 'var(--font-handwritten)', color: '#C9B8F5' }}
          >
            El evento ya tuvo lugar
          </span>
          <h1
            className="text-3xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: '#4A3F6B' }}
          >
            {babyName
              ? `¡Bienvenida, ${babyName}!`
              : '¡Gracias a todos!'}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-[2.5rem] border-b-4 bg-white p-7 shadow-xl space-y-4 w-full"
          style={{ borderColor: '#F6C6D0', boxShadow: '0 20px 40px -12px rgba(246,198,208,0.35)' }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: '#9B4F6B', fontFamily: 'var(--font-clean)' }}
          >
            El baby shower ya se celebró. Gracias a cada persona que nos acompañó, nos mandó sus buenos deseos o eligió un regalo con tanto amor.
          </p>
          {parents && (
            <p
              className="text-xs font-semibold tracking-wider"
              style={{ color: '#C9B8F5', fontFamily: 'var(--font-clean)' }}
            >
              Con cariño, {parents} 💜
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex gap-3 text-2xl"
        >
          {['🎀', '👶', '✨'].map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

      </div>
    </div>
  )
}
