'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Phase = 'envelope' | 'book' | 'done'

interface IntroGateProps {
  onEnter: () => void
  onOpen?: () => void
  babyName?: string
  parentA?: string
  parentB?: string
}

/* ── Cloud SVG ── */
function CloudSVG({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="introCloudGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      <path
        d="M25,60 C25,40 45,35 60,35 C65,20 85,15 105,25 C120,15 145,20 155,40 C175,40 185,60 170,75 C160,85 140,85 125,80 C110,90 80,90 65,80 C45,85 25,80 25,60 Z"
        fill="url(#introCloudGrad)"
      />
    </svg>
  )
}

/* ── Sparkle ── */
function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2 L13.5 9.5 L21 12 L13.5 14.5 L12 22 L10.5 14.5 L3 12 L10.5 9.5 Z" />
    </svg>
  )
}

export function IntroGate({ onEnter, onOpen, babyName, parentA, parentB }: IntroGateProps) {
  const [phase, setPhase] = useState<Phase>('envelope')

  const handleSealClick = () => {
    setPhase('book')
    onOpen?.()
  }

  // After the book animation plays, call onEnter
  useEffect(() => {
    if (phase !== 'book') return
    const t = setTimeout(() => {
      onEnter()
    }, 4200)
    return () => clearTimeout(t)
  }, [phase, onEnter])

  const parentLabel =
    parentA && parentB
      ? `${parentA} & ${parentB} 👶`
      : parentA
      ? `${parentA} 👶`
      : undefined

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden watercolor-bg">

      {/* ── Floating clouds bg ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-2 opacity-40 text-[#EDE9FF]"
          animate={{ x: [-8, 8, -8], y: [-4, 4, -4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CloudSVG className="w-32" />
        </motion.div>
        <motion.div
          className="absolute top-6 right-0 opacity-30 text-[#FFE4EE]"
          animate={{ x: [6, -6, 6], y: [3, -3, 3] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CloudSVG className="w-24" />
        </motion.div>
        <motion.div
          className="absolute bottom-16 left-1/4 opacity-25 text-[#C9B8F5]"
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CloudSVG className="w-28" />
        </motion.div>
        <motion.div
          className="absolute bottom-8 right-4 opacity-20 text-[#B8F0D8]"
          animate={{ x: [4, -4, 4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CloudSVG className="w-20" />
        </motion.div>

        {/* Floating sparkles */}
        {[
          { top: '18%', left: '8%', delay: 0, color: '#F5C0D0', size: 'w-3' },
          { top: '30%', right: '10%', delay: 0.8, color: '#C9B8F5', size: 'w-4' },
          { top: '55%', left: '5%', delay: 1.4, color: '#F5ECBA', size: 'w-3' },
          { top: '70%', right: '7%', delay: 0.3, color: '#B8F0D8', size: 'w-3' },
          { top: '12%', right: '22%', delay: 1.1, color: '#fbcfe8', size: 'w-2' },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: s.top, left: (s as any).left, right: (s as any).right, color: s.color }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
          >
            <Sparkle className={s.size} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ══════════ PHASE 1: ENVELOPE ══════════ */}
        {phase === 'envelope' && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.5 } }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center px-6 py-12 z-10 w-full max-w-sm"
          >
            {/* Headline */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span
                className="block text-3xl mb-1"
                style={{ fontFamily: 'var(--font-handwritten)', color: '#C9B8F5' }}
              >
                Ha llegado una hermosa
              </span>
              <h1
                className="text-4xl font-extrabold tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-serif)', color: '#4A3F6B' }}
              >
                Invitación
              </h1>
              <p className="text-[10px] tracking-[0.25em] text-gray-400 mt-2 uppercase font-semibold"
                style={{ fontFamily: 'var(--font-clean)' }}
              >
                Toca el sello para abrir
              </p>
            </motion.div>

            {/* Envelope */}
            <motion.div
              className="relative w-[320px] h-[210px] cursor-pointer select-none"
              whileHover={{ scale: 1.02, rotate: 0.5 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSealClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              role="button"
              aria-label="Abrir invitación"
            >
              {/* Envelope body */}
              <div
                className="absolute inset-0 rounded-2xl shadow-[0_20px_50px_-10px_rgba(74,63,107,0.18)] overflow-hidden"
                style={{ backgroundColor: '#FCF6F0', border: '1px solid #E9DFD5' }}
              >
                {/* Watercolor wash */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(252,207,232,0.18) 0%, rgba(221,214,254,0.2) 50%, rgba(254,243,199,0.15) 100%)',
                  }}
                />

                {/* Decorative gold thread lines */}
                <div className="absolute inset-y-0 left-1/2 w-px bg-amber-200/40" />
                <div className="absolute inset-x-0 top-1/2 h-px bg-amber-200/40" />
              </div>

              {/* Wax seal — centre */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="wax-seal w-20 h-20 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(219,39,119,0.35)]"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                    border: '2px solid rgba(244,114,182,0.5)',
                  }}
                  whileHover={{ scale: 1.12 }}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ border: '1.5px dashed rgba(252,231,243,0.5)' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white/90">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                </motion.div>
              </div>

              {/* Postmark stamp corner */}
              <div className="absolute top-3 right-4 opacity-50">
                <div className="w-10 h-10 border-2 border-dashed border-[#C9B8F5] rounded flex items-center justify-center">
                  <Sparkle className="w-4 text-[#C9B8F5]" />
                </div>
              </div>
            </motion.div>

            {/* Footer signature */}
            {parentLabel && (
              <motion.div
                className="mt-10 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <p
                  className="text-2xl"
                  style={{ fontFamily: 'var(--font-handwritten)', color: '#d97706' }}
                >
                  Con mucho amor,
                </p>
                <p
                  className="text-sm font-semibold tracking-wider mt-1"
                  style={{ fontFamily: 'var(--font-clean)', color: '#9ca3af' }}
                >
                  {parentLabel}
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ══════════ PHASE 2: BOOK OPENING ══════════ */}
        {phase === 'book' && (
          <motion.div
            key="book"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center px-6 z-10 text-center"
          >
            {/* Book */}
            <motion.div
              initial={{ rotateY: -90, scale: 0.75, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: 800 }}
              className="relative w-44 h-60 flex"
            >
              {/* Spine */}
              <div
                className="w-4 h-full rounded-l-md shadow-inner"
                style={{ background: 'linear-gradient(180deg, #C9B8F5, #9B4F6B)' }}
              />
              {/* Pages */}
              <div
                className="flex-1 h-full rounded-r-2xl shadow-[0_20px_50px_-12px_rgba(74,63,107,0.3)] border-y-4 border-r-4 border-white/80 flex items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #FFE4EE 100%)' }}
              >
                {/* Page lines */}
                <div className="absolute inset-x-4 top-6 space-y-2 opacity-20">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-px bg-[#4A3F6B]" />
                  ))}
                </div>
                {/* Sparkle icon */}
                <motion.div
                  animate={{ scale: [1, 1.25, 1], rotate: [0, 15, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkle className="w-14 text-[#C9B8F5]" />
                </motion.div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-8 text-4xl"
              style={{ fontFamily: 'var(--font-handwritten)', color: '#C9B8F5' }}
            >
              Abriendo nuestro cuento…
            </motion.h2>
            {babyName && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="mt-2 text-xs uppercase tracking-[0.22em]"
                style={{ fontFamily: 'var(--font-clean)', color: '#9ca3af' }}
              >
                Un milagro llamado {babyName} está por nacer
              </motion.p>
            )}

            {/* Animated dots loader */}
            <motion.div
              className="flex gap-1.5 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#C9B8F5' }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
