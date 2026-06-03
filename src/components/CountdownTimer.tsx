'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CountdownTimerProps {
  targetDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(target: string): TimeLeft {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

function DigitUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')
  return (
    <div
      className="flex flex-col items-center gap-1 bg-white rounded-2xl px-4 py-3 shadow-sm border"
      style={{ borderColor: '#EDE9FF', minWidth: '72px' }}
    >
      <div className="relative overflow-hidden h-10 flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={display}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="text-3xl font-bold tabular-nums"
            style={{ color: '#4A3F6B', fontFamily: 'var(--font-serif)' }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs uppercase tracking-widest" style={{ color: '#C9B8F5' }}>
        {label}
      </span>
    </div>
  )
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate))

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-4 py-8 px-4"
    >
      <h2
        className="text-xl text-center"
        style={{ fontFamily: 'var(--font-serif)', color: '#4A3F6B' }}
      >
        Faltan...
      </h2>
      <div className="flex gap-3 flex-wrap justify-center">
        <DigitUnit value={timeLeft.days} label="Días" />
        <DigitUnit value={timeLeft.hours} label="Horas" />
        <DigitUnit value={timeLeft.minutes} label="Min" />
        <DigitUnit value={timeLeft.seconds} label="Seg" />
      </div>
    </motion.div>
  )
}
