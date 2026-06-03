'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Gift } from '@/lib/types'

interface GiftRegistryProps {
  gifts: Gift[]
  onGiftSelect: (giftId: string | null) => void
  selectedGiftId: string | null
  disabled?: boolean
}

const CASH_GIFT: Gift = {
  id: 'cash',
  title: 'Obsequio en Efectivo',
  description: 'Una contribución en efectivo es siempre bienvenida y muy apreciada.',
  status: 'Available',
}

function CashIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="#2E7A5A" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="#2E7A5A" strokeWidth="1.5" />
      <line x1="6" y1="9" x2="6" y2="9" stroke="#2E7A5A" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="15" x2="18" y2="15" stroke="#2E7A5A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8L6.5 11.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface GiftCardProps {
  gift: Gift
  isSelected: boolean
  isCash?: boolean
  disabled?: boolean
  onClick: () => void
}

function GiftCard({ gift, isSelected, isCash, disabled, onClick }: GiftCardProps) {
  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.02 }}
      onClick={disabled ? undefined : onClick}
      className="relative bg-white rounded-2xl p-5 shadow-sm border-2 cursor-pointer transition-colors"
      style={{
        borderColor: isSelected ? '#C9B8F5' : '#EDE9FF',
        opacity: disabled && !isSelected ? 0.6 : 1,
        pointerEvents: disabled && !isSelected ? 'none' : 'auto',
      }}
    >
      {/* Selected badge */}
      {isSelected && disabled && (
        <span
          className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full text-white font-semibold"
          style={{ backgroundColor: '#C9B8F5' }}
        >
          Tu elección
        </span>
      )}

      {/* Cash badge */}
      {isCash && !disabled && (
        <span
          className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-semibold"
          style={{ backgroundColor: '#E4FFF4', color: '#2E7A5A' }}
        >
          Siempre disponible
        </span>
      )}

      <div className="flex items-start gap-3 pr-6">
        {isCash && (
          <div className="shrink-0 mt-0.5">
            <CashIcon />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm" style={{ color: '#4A3F6B' }}>
            {gift.title}
          </p>
          <p className="text-xs mt-1" style={{ color: '#9B4F6B' }}>
            {gift.description}
          </p>
        </div>
      </div>

      {/* Animated checkmark */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute bottom-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#C9B8F5' }}
          >
            <CheckIcon />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function GiftRegistry({
  gifts,
  onGiftSelect,
  selectedGiftId,
  disabled = false,
}: GiftRegistryProps) {
  const availableGifts = gifts.filter((g) => g.status === 'Available')

  const handleSelect = (id: string) => {
    onGiftSelect(selectedGiftId === id ? null : id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-4 py-8"
    >
      <h2
        className="text-xl text-center mb-6"
        style={{ fontFamily: 'var(--font-serif)', color: '#4A3F6B' }}
      >
        Mesa de Regalos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableGifts.map((gift) => (
          <GiftCard
            key={gift.id}
            gift={gift}
            isSelected={selectedGiftId === gift.id}
            disabled={disabled}
            onClick={() => handleSelect(gift.id)}
          />
        ))}
        <GiftCard
          gift={CASH_GIFT}
          isSelected={selectedGiftId === 'cash'}
          isCash
          disabled={disabled}
          onClick={() => handleSelect('cash')}
        />
      </div>
    </motion.div>
  )
}
