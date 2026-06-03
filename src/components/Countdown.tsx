'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function Countdown({ targetIso }: { targetIso: string }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const target = new Date(targetIso).getTime()
  const diff = Math.max(0, target - now)
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const mins = Math.floor((diff % 3_600_000) / 60_000)
  const secs = Math.floor((diff % 60_000) / 1000)

  const cells: Array<[number, string, string]> = [
    [days, "Días", "bg-butter/80"],
    [hours, "Horas", "bg-mint/80"],
    [mins, "Min", "bg-lilac-soft/60"],
    [secs, "Seg", "bg-peach/80"],
  ]

  /**
   * CALIBRACIÓN FÍSICA:
   * CYCLE_DURATION: Tiempo que tarda en dar una vuelta completa (Día + Noche).
   * 
   * Lógica de Sincronización:
   * 0s  (0°)   -> SOL arriba, LUNA abajo. Fondo: DÍA.
   * 15s (180°) -> LUNA arriba, SOL abajo. Fondo: NOCHE.
   * 30s (360°) -> Vuelta al inicio.
   */
  const CYCLE_DURATION = 60 

  return (
    <div className="relative overflow-hidden rounded-[3.5rem] border-b-4 border-soft-pink bg-white shadow-xl shadow-soft-pink/20 min-h-[340px] flex items-center">
      {/* ── Fondo Atmosférico Sincronizado ── */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            'linear-gradient(180deg, #7dd3fc 0%, #ffffff 100%)', // 0s   (0°)   Vibrant Day
            'linear-gradient(180deg, #fbcfe8 0%, #ffffff 100%)', // 7.5s (90°)  ATARDECER
            'linear-gradient(180deg, #1e1b4b 0%, #ffffff 100%)', // 15s  (180°) NOCHE
            'linear-gradient(180deg, #fbcfe8 0%, #ffffff 100%)', // 22.5s(270°) AMANECER
            'linear-gradient(180deg, #7dd3fc 0%, #ffffff 100%)', // 30s  (360°) DÍA
          ],
        }}
        transition={{ duration: CYCLE_DURATION, repeat: Infinity, ease: 'linear' }}
      />

      {/* ── Órbita de los Astros ── */}
      <motion.div
        className="absolute inset-0 z-0 flex items-center justify-center"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: CYCLE_DURATION, repeat: Infinity, ease: 'linear' }}
      >
        <div className="relative w-full h-[480px]">
          {/* SOL: Siempre en oposición a la Luna */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#f5e900] shadow-[0_0_60px_#f5e900]"
          >
            <div className="absolute inset-0 rounded-full animate-pulse bg-[#fcd34d] opacity-60 scale-125" />
            <div className="absolute inset-0 rounded-full bg-[#f5e900] blur-[2px]" />
          </motion.div>

          {/* LUNA: A 180 grados del Sol */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-50 shadow-[0_0_30px_white]"
            animate={{ rotate: [0, -360] }} // Contra-rotación para que la luna no gire sobre su eje
            transition={{ duration: CYCLE_DURATION, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0 rounded-full bg-white opacity-40 blur-[4px]" />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Contenido ── */}
      <div className="relative z-10 w-full p-10 text-center backdrop-blur-[1px]">
        <motion.h3 
          className="mb-10 font-display text-2xl drop-shadow-md"
          animate={{
            color: ['#3e3a4d', '#3e3a4d', '#ffffff', '#3e3a4d', '#3e3a4d']
          }}
          transition={{ duration: CYCLE_DURATION, repeat: Infinity, ease: 'linear' }}
        >
          Contando cada segundo...
        </motion.h3>

        <div className="flex justify-center gap-4">
          {cells.map(([val, label, bg]) => (
            <div key={label} className="flex flex-col items-center">
              <motion.span
                key={val}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bg} font-display text-3xl text-ink shadow-lg ring-2 ring-white/60 backdrop-blur-md`}
              >
                {String(val).padStart(2, "0")}
              </motion.span>
              <motion.span 
                className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em]"
                animate={{
                  color: ['#7a748a', '#7a748a', '#e0e7ff', '#7a748a', '#7a748a']
                }}
                transition={{ duration: CYCLE_DURATION, repeat: Infinity, ease: 'linear' }}
              >
                {label}
              </motion.span>
            </div>
          ))}
        </div>
        
        <div className="mt-10 flex items-center justify-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-lilac animate-ping" />
          {/* <motion.p 
            className="text-[10px] font-bold uppercase tracking-widest"
            animate={{
              color: ['#7a748a', '#7a748a', '#ffffff', '#7a748a', '#7a748a']
            }}
            transition={{ duration: CYCLE_DURATION, repeat: Infinity, ease: 'linear' }}
          >
            En tiempo real
          </motion.p> */}
        </div>
      </div>
    </div>
  )
}
