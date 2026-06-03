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
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).replace(/^\w/, (c) => c.toUpperCase())
}

function formatTime(timeStr: string): string {
  if (!timeStr) return ''
  // If already contains AM/PM (e.g. "4:00 PM - 7:00 PM"), use as-is
  if (/[AaPp][Mm]/.test(timeStr)) return timeStr
  // Parse HH:MM format
  const [h, m] = timeStr.split(':').map(Number)
  if (isNaN(h)) return timeStr
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`
}

export function DateTimeLocation({ eventDate, eventTime, mapsUrl }: DateTimeLocationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="px-4 py-8 flex flex-col gap-4"
    >
      {/* Date & Time card */}
      <div
        className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col gap-2"
        style={{ borderColor: '#EDE9FF' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#4A3F6B' }}>
              {formatDate(eventDate)}
            </p>
            <p className="text-sm" style={{ color: '#C9B8F5' }}>
              {formatTime(eventTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Location card */}
      <div
        className="bg-white rounded-2xl p-6 shadow-sm border flex items-center justify-between"
        style={{ borderColor: '#FFE4EE' }}
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="text-2xl"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            📍
          </motion.span>
          <p className="text-sm font-semibold" style={{ color: '#4A3F6B' }}>
            Ver ubicación
          </p>
        </div>
        <button
          onClick={() => window.open(mapsUrl, '_blank', 'noopener,noreferrer')}
          className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-transform active:scale-95"
          style={{ backgroundColor: '#F5C0D0' }}
        >
          Abrir mapa
        </button>
      </div>
    </motion.div>
  )
}
