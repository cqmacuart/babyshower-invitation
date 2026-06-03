'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GiftRegistry } from '@/components/GiftRegistry'
import type { Gift } from '@/lib/types'

interface CelebrationBannerProps {
  guestName: string
  gifts: Gift[]
  onGiftSelect: (giftId: string | null) => void
  selectedGiftId: string | null
}

export function CelebrationBanner({
  guestName,
  gifts,
  onGiftSelect,
  selectedGiftId,
}: CelebrationBannerProps) {
  const [showGifts, setShowGifts] = useState(!selectedGiftId)

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="px-4 py-8"
    >
      {/* Confirmation banner */}
      <div
        className="rounded-3xl p-6 text-center shadow-md"
        style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #FFE4EE 100%)' }}
      >
        <p className="text-2xl mb-2">🎉</p>
        <h2
          className="text-xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-serif)', color: '#4A3F6B' }}
        >
          ¡Ya estás en la lista, {guestName}!
        </h2>
        <p className="text-sm" style={{ color: '#9B4F6B' }}>
          ¡Estamos muy emocionados de verte!
        </p>
      </div>

      {/* Post-RSVP gift selection */}
      <AnimatePresence>
        {showGifts && (
          <motion.div
            key="gift-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="mt-6">
              <h3
                className="text-base font-semibold text-center mb-1"
                style={{ fontFamily: 'var(--font-serif)', color: '#4A3F6B' }}
              >
                ¿Quieres sorprenderlos con un regalo?
              </h3>
              <p className="text-xs text-center mb-4" style={{ color: '#C9B8F5' }}>
                Totalmente opcional — elige si quieres
              </p>
              <GiftRegistry
                gifts={gifts}
                onGiftSelect={onGiftSelect}
                selectedGiftId={selectedGiftId}
                disabled={false}
              />
              <div className="text-center mt-2">
                <button
                  onClick={() => setShowGifts(false)}
                  className="text-sm px-6 py-2 rounded-full border transition-colors"
                  style={{ borderColor: '#EDE9FF', color: '#9B4F6B' }}
                >
                  Decidir después
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showGifts && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowGifts(true)}
            className="text-sm"
            style={{ color: '#C9B8F5' }}
          >
            Ver mesa de regalos ↓
          </button>
        </div>
      )}
    </motion.div>
  )
}
