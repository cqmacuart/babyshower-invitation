'use client'

import { motion } from 'framer-motion'

interface DateTimeLocationProps {
  eventDate: string
  eventTime: string
  mapsUrl: string
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(`${dateStr}T12:00:00`)
  return date
    .toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    .replace(/^\w/, (c) => c.toUpperCase())
}

function formatTime(timeStr: string): string {
  if (!timeStr) return ''
  if (/[AaPp][Mm]/.test(timeStr)) return timeStr
  const [h, m] = timeStr.split(':').map(Number)
  if (isNaN(h)) return timeStr
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

export function DateTimeLocation({ eventDate, eventTime, mapsUrl }: DateTimeLocationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-4 my-6 rounded-[2rem] overflow-hidden relative"
      style={{
        background: 'white',
        boxShadow: '0 20px 50px -12px rgba(244,143,177,0.2)',
        border: '1px solid #FFE4EE',
      }}
    >
      {/* Top gradient accent */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg, #F5C0D0, #C9B8F5, #F5ECBA)' }}
      />

      <div className="p-6">
        <h3
          className="text-center text-lg font-extrabold mb-5"
          style={{ fontFamily: 'var(--font-serif)', color: '#C9B8F5' }}
        >
          Detalles del Cuento
        </h3>

        {/* Date row */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-[#9B4F6B]"
            style={{ backgroundColor: '#FFE4EE' }}
          >
            <CalendarIcon />
          </div>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-clean)', color: '#4A3F6B' }}
            >
              {formatDate(eventDate)}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: '#C9B8F5', fontFamily: 'var(--font-clean)' }}
            >
              ¡Guarda esta fecha en tu corazón!
            </p>
          </div>
        </div>

        {/* Time row */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-[#4A3F6B]"
            style={{ backgroundColor: '#EDE9FF' }}
          >
            <ClockIcon />
          </div>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-clean)', color: '#4A3F6B' }}
            >
              {formatTime(eventTime)}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: '#9B4F6B', fontFamily: 'var(--font-clean)' }}
            >
              Hora sugerida de llegada: 15 min antes
            </p>
          </div>
        </div>

        {/* Location card */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: '#FFFBE4', border: '1px solid #F5ECBA' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="text-[#9B4F6B]"
            >
              <MapPinIcon />
            </motion.div>
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: 'var(--font-clean)', color: '#4A3F6B' }}
            >
              Ver ubicación en el mapa
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.open(mapsUrl, '_blank', 'noopener,noreferrer')}
            className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #F5C0D0, #C9B8F5)',
              boxShadow: '0 4px 14px rgba(201,184,245,0.4)',
              fontFamily: 'var(--font-clean)',
            }}
          >
            <MapPinIcon />
            Abrir Mapa
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
