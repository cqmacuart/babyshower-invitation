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
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

const CELLS: { label: string; bg: string; shadow: string }[] = [
  { label: 'Días',  bg: '#FEF3C7', shadow: 'rgba(251,191,36,0.2)' },
  { label: 'Horas', bg: '#D1FAE5', shadow: 'rgba(52,211,153,0.2)' },
  { label: 'Min',   bg: '#EDE9FF', shadow: 'rgba(167,139,250,0.2)' },
  { label: 'Seg',   bg: '#FFE4EE', shadow: 'rgba(244,114,182,0.2)' },
]

function DigitCell({
  value,
  label,
  bg,
  shadow,
}: {
  value: number
  label: string
  bg: string
  shadow: string
}) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative overflow-hidden w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          backgroundColor: bg,
          boxShadow: `0 8px 20px -4px ${shadow}, inset 0 -2px 4px rgba(0,0,0,0.04)`,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={display}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="text-2xl font-bold tabular-nums"
            style={{ color: '#4A3F6B', fontFamily: 'var(--font-serif)' }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className="text-[9px] font-bold uppercase tracking-widest"
        style={{ color: '#9B4F6B', fontFamily: 'var(--font-clean)' }}
      >
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

  const values = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-4 my-6 rounded-[2rem] overflow-hidden relative"
      style={{
        background: 'white',
        boxShadow: '0 20px 50px -12px rgba(201,184,245,0.25)',
        border: '1px solid #EDE9FF',
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg, #F5C0D0, #C9B8F5, #B8F0D8, #F5ECBA)' }}
      />

      <div className="p-6 text-center">
        <p
          className="text-sm italic mb-5"
          style={{ fontFamily: 'var(--font-serif)', color: '#9B4F6B' }}
        >
          Contando los suspiros para verte…
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          {CELLS.map((cell, i) => (
            <DigitCell
              key={cell.label}
              value={values[i]}
              label={cell.label}
              bg={cell.bg}
              shadow={cell.shadow}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
