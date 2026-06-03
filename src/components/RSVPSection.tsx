'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AppMode, GuestInfo } from '@/lib/types'

interface RSVPSectionProps {
  mode: AppMode
  selectedGiftId: string | null
  onAttend: (guestInfo: GuestInfo) => Promise<void>
  onDecline: (name: string) => Promise<void>
  initialGuestInfo?: GuestInfo
}

type View = 'buttons' | 'attend-form' | 'decline-form' | 'declined'

export function RSVPSection({
  mode,
  selectedGiftId,
  onAttend,
  onDecline,
  initialGuestInfo,
}: RSVPSectionProps) {
  const [view, setView] = useState<View>('buttons')
  const [loading, setLoading] = useState(false)
  const [declinedName, setDeclinedName] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  // Form state
  const [name, setName] = useState(initialGuestInfo?.name ?? '')
  const [phone, setPhone] = useState(initialGuestInfo?.phone ?? '')
  const [email, setEmail] = useState(initialGuestInfo?.email ?? '')
  const [declineName, setDeclineName] = useState('')

  if (mode === 'celebration') return null

  const handleAttendSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setLoading(true)
    try {
      await onAttend({ name: name.trim(), phone: phone.trim(), email: email.trim() || undefined })
    } finally {
      setLoading(false)
    }
  }

  const handleDeclineSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!declineName.trim()) return
    setLoading(true)
    setDeclinedName(declineName.trim())
    try {
      await onDecline(declineName.trim())
      setView('declined')
    } finally {
      setLoading(false)
    }
  }

  const handleChangeToAttend = () => {
    if (declinedName) setName(declinedName)
    setView('attend-form')
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const inputClass =
    'w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#C9B8F5] transition-colors'
  const inputStyle = { borderColor: '#EDE9FF', color: '#4A3F6B' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-4 py-8"
      ref={formRef}
    >
      <h2
        className="text-xl text-center mb-6"
        style={{ fontFamily: 'var(--font-serif)', color: '#4A3F6B' }}
      >
        ¿Podrás acompañarnos?
      </h2>

      <AnimatePresence mode="wait">
        {view === 'buttons' && (
          <motion.div
            key="buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={() => setView('attend-form')}
              className="w-full py-4 rounded-2xl text-white font-semibold text-lg shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: '#C9B8F5' }}
            >
              🎉 Asistiré
            </button>
            <button
              onClick={() => setView('decline-form')}
              className="w-full py-4 rounded-2xl font-semibold text-lg border-2 transition-transform active:scale-95"
              style={{ borderColor: '#F5C0D0', color: '#9B4F6B', backgroundColor: 'transparent' }}
            >
              No Asistiré
            </button>
          </motion.div>
        )}

        {view === 'attend-form' && (
          <motion.form
            key="attend-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={handleAttendSubmit}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#4A3F6B' }}>
                Nombre completo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#4A3F6B' }}>
                Teléfono *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52 000 000 0000"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#4A3F6B' }}>
                Email (opcional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            {selectedGiftId && (
              <p className="text-xs text-center" style={{ color: '#C9B8F5' }}>
                ✓ Has seleccionado un regalo
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-semibold text-lg shadow-sm transition-transform active:scale-95 disabled:opacity-60"
              style={{ backgroundColor: '#C9B8F5' }}
            >
              {loading ? 'Confirmando...' : 'Confirmar Asistencia'}
            </button>
            <button
              type="button"
              onClick={() => setView('buttons')}
              className="text-sm text-center"
              style={{ color: '#9B4F6B' }}
            >
              ← Volver
            </button>
          </motion.form>
        )}

        {view === 'decline-form' && (
          <motion.form
            key="decline-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={handleDeclineSubmit}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#4A3F6B' }}>
                Tu nombre *
              </label>
              <input
                type="text"
                required
                value={declineName}
                onChange={(e) => setDeclineName(e.target.value)}
                placeholder="Tu nombre"
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold text-lg border-2 transition-transform active:scale-95 disabled:opacity-60"
              style={{ borderColor: '#F5C0D0', color: '#9B4F6B', backgroundColor: 'transparent' }}
            >
              {loading ? 'Enviando...' : 'Enviar respuesta'}
            </button>
            <button
              type="button"
              onClick={() => setView('buttons')}
              className="text-sm text-center"
              style={{ color: '#9B4F6B' }}
            >
              ← Volver
            </button>
          </motion.form>
        )}

        {view === 'declined' && (
          <motion.div
            key="declined"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 text-center py-4"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="text-6xl"
            >
              😔
            </motion.span>
            <p
              className="text-lg font-semibold"
              style={{ fontFamily: 'var(--font-serif)', color: '#4A3F6B' }}
            >
              ¡Qué pena no poder contar contigo!
            </p>
            <p className="text-sm" style={{ color: '#9B4F6B' }}>
              Gracias por avisarnos, {declinedName}.
            </p>
            <button
              onClick={handleChangeToAttend}
              className="mt-2 px-6 py-3 rounded-full font-semibold text-white transition-transform active:scale-95"
              style={{ backgroundColor: '#C9B8F5' }}
            >
              ¡Mejor sí asistiré!
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
