'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Gift } from '@/lib/types'

interface GiftRegistryProps {
  gifts: Gift[]
  onGiftSelect: (giftId: string | null) => void
  selectedGiftId: string | null
  disabled?: boolean
  /** Cards per page (excluding cash). Pagination shown only when gifts > pageSize. Default: 10 */
  pageSize?: number
  /** Hide the section header (used in the confirmation view) */
  compact?: boolean
}

const CASH_GIFT: Gift = {
  id: 'cash',
  title: 'Obsequio en Efectivo',
  description: 'Una contribución en efectivo es siempre bienvenida y muy apreciada.',
  status: 'Available',
}

function CheckCircle() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path
        fillRule="evenodd"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 14.59L6.7 12.7l1.41-1.41 2.48 2.48 5.6-5.6 1.41 1.41-7 7z"
      />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2 L13.5 9.5 L21 12 L13.5 14.5 L12 22 L10.5 14.5 L3 12 L10.5 9.5 Z" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

interface GiftCardProps {
  gift: Gift
  isSelected: boolean
  isCash?: boolean
  disabled?: boolean
  emoji?: string
  onClick: () => void
}

function GiftCard({ gift, isSelected, isCash, disabled, emoji = '🎁', onClick }: GiftCardProps) {
  return (
    <motion.div
      whileHover={disabled && !isSelected ? {} : { scale: 1.015, y: -2 }}
      whileTap={disabled && !isSelected ? {} : { scale: 0.98 }}
      onClick={disabled && !isSelected ? undefined : onClick}
      className="relative rounded-3xl overflow-hidden transition-all"
      style={{
        padding: '18px',
        background: isSelected
          ? isCash
            ? 'linear-gradient(135deg, #FEF3C7, #FFFBE4)'
            : 'linear-gradient(135deg, #EDE9FF, #FFE4EE)'
          : 'white',
        border: `2px solid ${isSelected ? (isCash ? '#F5ECBA' : '#C9B8F5') : '#F3F0FF'}`,
        boxShadow: isSelected
          ? `0 12px 28px -6px ${isCash ? 'rgba(245,236,186,0.5)' : 'rgba(201,184,245,0.35)'}`
          : '0 4px 16px -4px rgba(0,0,0,0.06)',
        opacity: disabled && !isSelected ? 0.55 : 1,
        cursor: disabled && !isSelected ? 'default' : 'pointer',
      }}
    >
      {isSelected && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute top-0 inset-x-0 h-0.5 rounded-t-3xl"
          style={{
            background: isCash
              ? 'linear-gradient(90deg, #F5ECBA, #F5C0D0)'
              : 'linear-gradient(90deg, #C9B8F5, #F5C0D0)',
          }}
        />
      )}

      {isCash && !disabled && (
        <span
          className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontFamily: 'var(--font-clean)' }}
        >
          Siempre disp.
        </span>
      )}

      {isSelected && disabled && (
        <span
          className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
          style={{ background: 'linear-gradient(90deg, #C9B8F5, #F5C0D0)', fontFamily: 'var(--font-clean)' }}
        >
          Tu elección ✓
        </span>
      )}

      <div className="flex items-center gap-3 pr-6">
        <motion.div
          animate={isSelected ? { rotate: [0, -8, 8, 0], scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.5 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
          style={{
            background: isSelected
              ? isCash
                ? 'linear-gradient(135deg, #FEF9C3, #FFF9E6)'
                : 'linear-gradient(135deg, #EDE9FF, #FFE4EE)'
              : '#F8F6FF',
          }}
        >
          {emoji}
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-clean)', color: '#4A3F6B' }}>
            {gift.title}
          </p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#9B4F6B', fontFamily: 'var(--font-clean)' }}>
            {gift.description}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            transition={{ type: 'spring', stiffness: 450, damping: 22 }}
            className="absolute bottom-3 right-3"
            style={{ color: isCash ? '#F59E0B' : '#C9B8F5' }}
          >
            <CheckCircle />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSelected && isCash && (
          <motion.div
            key="sparkle"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute top-3 left-3 text-amber-400 animate-pulse-soft"
          >
            <SparkleIcon />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const GIFT_EMOJIS = ['🛏️', '🛒', '🧸', '🍼', '🛁', '🎠', '🎀', '⭐', '🌟', '💫', '🌸', '🎵', '🦋', '🌈', '🎨']

export function GiftRegistry({
  gifts,
  onGiftSelect,
  selectedGiftId,
  disabled = false,
  pageSize = 10,
  compact = false,
}: GiftRegistryProps) {
  const [page, setPage] = useState(0)

  const availableGifts = gifts.filter((g) => g.status === 'Available')
  const totalPages = Math.ceil(availableGifts.length / pageSize)
  const paginated = availableGifts.length > pageSize
  const pageGifts = availableGifts.slice(page * pageSize, page * pageSize + pageSize)

  const handleSelect = (id: string) => {
    onGiftSelect(selectedGiftId === id ? null : id)
  }

  const goToPrev = () => setPage((p) => Math.max(0, p - 1))
  const goToNext = () => setPage((p) => Math.min(totalPages - 1, p + 1))

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={compact ? 'py-2' : 'px-4 py-6'}
    >
      {/* Section header — hidden in compact mode */}
      {!compact && (
        <div className="text-center mb-6">
          <span
            className="block text-3xl mb-1"
            style={{ fontFamily: 'var(--font-handwritten)', color: '#d97706' }}
          >
            Un lindo gesto
          </span>
          <h2
            className="text-2xl font-extrabold"
            style={{ fontFamily: 'var(--font-serif)', color: '#4A3F6B' }}
          >
            Mesa de Regalos
          </h2>
          <p
            className="text-xs mt-2 max-w-xs mx-auto leading-relaxed"
            style={{ color: '#9B4F6B', fontFamily: 'var(--font-clean)' }}
          >
            Selecciona el detalle que deseas regalar. Cada regalo es único y especial.
          </p>
        </div>
      )}

      {/* Gift list with floating chevrons */}
      <div className="relative">
        {/* Left chevron */}
        <AnimatePresence>
          {paginated && page > 0 && (
            <motion.button
              key="prev"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              type="button"
              onClick={goToPrev}
              aria-label="Página anterior"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 flex items-center justify-center w-9 h-9 rounded-full shadow-lg transition-transform active:scale-90"
              style={{
                background: 'linear-gradient(135deg, #C9B8F5, #F5C0D0)',
                color: 'white',
                boxShadow: '0 6px 18px -4px rgba(201,184,245,0.6)',
              }}
            >
              <ChevronLeft />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right chevron */}
        <AnimatePresence>
          {paginated && page < totalPages - 1 && (
            <motion.button
              key="next"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              type="button"
              onClick={goToNext}
              aria-label="Página siguiente"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 flex items-center justify-center w-9 h-9 rounded-full shadow-lg transition-transform active:scale-90"
              style={{
                background: 'linear-gradient(135deg, #C9B8F5, #F5C0D0)',
                color: 'white',
                boxShadow: '0 6px 18px -4px rgba(201,184,245,0.6)',
              }}
            >
              <ChevronRight />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="space-y-3"
          >
            {pageGifts.map((gift, i) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                isSelected={selectedGiftId === gift.id}
                disabled={disabled}
                emoji={GIFT_EMOJIS[(page * pageSize + i) % GIFT_EMOJIS.length]}
                onClick={() => handleSelect(gift.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page dots */}
      {paginated && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Página ${i + 1}`}
              className="transition-all rounded-full"
              style={{
                width: i === page ? 20 : 8,
                height: 8,
                background: i === page
                  ? 'linear-gradient(90deg, #C9B8F5, #F5C0D0)'
                  : '#E9DFD5',
              }}
            />
          ))}
        </div>
      )}

      {/* Cash — always visible below the paginated list */}
      <div className="mt-3">
        <GiftCard
          gift={CASH_GIFT}
          isSelected={selectedGiftId === 'cash'}
          isCash
          disabled={disabled}
          emoji="👑"
          onClick={() => handleSelect('cash')}
        />
      </div>
    </motion.div>
  )
}
