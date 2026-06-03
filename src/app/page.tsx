'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { MapPin, Calendar, Clock } from 'lucide-react'
import { useInvitationStore } from '@/hooks/useInvitationStore'
import { useSheetData } from '@/hooks/useSheetData'
import { CloudMask } from '@/components/ui/CloudMask'
import { IntroGate } from '@/components/IntroGate'
import { CloudsBackground } from '@/components/CloudsBackground'
import { ConfettiOverlay } from '@/components/ConfettiOverlay'
import { Countdown } from '@/components/Countdown'
import { useMusicPlayer, MusicToggle } from '@/components/MusicPlayer'
import { RsvpFlow, type RsvpData } from '@/components/RsvpFlow'
import { OfflineScreen } from '@/components/OfflineScreen'
import { FloatingBalloonHero } from '@/components/ui/FloatingBalloonHero'
import { EventGraphicSection } from '@/components/ui/GraphicDetails'
import { ForegroundClouds } from '@/components/ui/ForegroundClouds'
import { OrigamiBird } from '@/components/ui/OrigamiBird'
import type { GuestInfo } from '@/lib/types'

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(`${dateStr}T12:00:00`)
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).replace(/^\w/, (c) => c.toUpperCase())
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

export default function Home() {
  const { mode, selectedGiftId, guestInfo, setMode, setSelectedGift, setGuestInfo } =
    useInvitationStore()

  const { data, loading, error, refetch } = useSheetData()
  const { scrollYProgress } = useScroll()

  // Parallax offsets
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -30])

  const [showIntro, setShowIntro] = useState(true)
  const [cloudVisible, setCloudVisible] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Music Player setup
  const { isPlaying, toggle, forcePlay } = useMusicPlayer(
    mode === 'celebration' ? 'celebration' : 'intro'
  )

  // Skip intro if already in celebration/declined mode on reload
  useEffect(() => {
    if (mode === 'celebration' || mode === 'declined') {
      setShowIntro(false)
    }
  }, [mode])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }, [])

  const handleEnter = useCallback(() => {
    forcePlay()
    setCloudVisible(true)
    setTimeout(() => {
      setShowIntro(false)
      setCloudVisible(false)
    }, 1200)
  }, [forcePlay])

  const triggerConfetti = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default
    const colors = ["#C9A8E0", "#F6C6D0", "#BFE3D4", "#FEC8D8", "#FFF6BD"]
    confetti({
      particleCount: 180,
      spread: 160,
      origin: { y: 0.6 },
      colors,
    })
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 100, origin: { y: 0.4 }, colors })
    }, 600)
  }, [])

  const handleRsvpSubmit = async (rsvpData: RsvpData) => {
    setSubmitting(true)
    try {
      const guest: GuestInfo = {
        name: rsvpData.nombre,
        phone: rsvpData.telefono,
        email: rsvpData.email || undefined,
      }

      if (rsvpData.attending) {
        // Submit RSVP to Confirmaciones sheet
        const rsvpRes = await fetch('/api/submit-rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestInfo: guest,
            giftId: rsvpData.regaloId,
            giftName: rsvpData.regaloNombre,
          }),
        })

        if (!rsvpRes.ok) {
          showToast('Hubo un error al confirmar tu asistencia. Intenta de nuevo.')
          return
        }

        // Claim gift in Regalos sheet (only physical gifts, not cash)
        if (rsvpData.regaloId && rsvpData.regaloId !== 'cash') {
          const claimRes = await fetch('/api/claim-gift', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ giftId: rsvpData.regaloId, guestInfo: guest }),
          })

          if (claimRes.status === 409) {
            showToast('Este regalo ya fue tomado, elige otro.')
            await refetch()
            return
          }
        }

        setGuestInfo(guest)
        setSelectedGift(rsvpData.regaloId)
        setMode('celebration')
        await triggerConfetti()
      } else {
        // Declining invitation
        const rsvpRes = await fetch('/api/submit-rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestInfo: guest,
            giftId: '',
            giftName: 'No asistirá',
          }),
        })

        if (!rsvpRes.ok) {
          showToast('Hubo un error al enviar tu respuesta. Intenta de nuevo.')
          return
        }

        setGuestInfo(guest)
        setSelectedGift(null)
        setMode('declined')
      }
    } catch {
      showToast('Ocurrió un error de red. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedGiftTitle = useMemo(() => {
    if (!data) return ''
    if (selectedGiftId === 'cash') return 'Obsequio en efectivo'
    return data.gifts.find((g) => g.id === selectedGiftId)?.title ?? ''
  }, [data, selectedGiftId])

  // Loading state
  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-4 border-slate-100"
          style={{ borderTopColor: '#c9a8e0' }}
        />
      </div>
    )
  }

  if (error) {
    return <OfflineScreen onRetry={refetch} />
  }

  return (
    <>
      {/* Cinematic Foreground Clouds (Passes in front of everything) */}
      <ForegroundClouds />

      {/* Cloud wipe transition */}
      <CloudMask isVisible={cloudVisible} />

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-white text-sm shadow-xl max-w-xs text-center"
            style={{ backgroundColor: '#e89aaa' }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {showIntro ? (
        <IntroGate
          onEnter={handleEnter}
          onOpen={forcePlay}
          babyName={data?.metadata.babyName}
          parentA={data?.metadata.parentA}
          parentB={data?.metadata.parentB}
        />
      ) : (
        <div className="relative min-h-screen">
          {/* Animated clouds background */}
          <CloudsBackground />

          {/* Origami Bird flying through the sky */}
          <OrigamiBird />

          {/* Confetti & balloons overlay on success */}
          <ConfettiOverlay active={mode === 'celebration'} />

          {/* Music player control */}
          <MusicToggle isPlaying={isPlaying} toggle={toggle} />

          {data && (
            <div className="relative z-10 w-full max-w-[480px] mx-auto px-6 py-12 flex flex-col gap-8">
              {/* Hero Balloon Section */}
              <div className="flex justify-center mb-4">
                <FloatingBalloonHero className="w-48 h-64" />
              </div>

              {/* Header Title Section */}
              <motion.div style={{ y: y1 }} className="text-center space-y-4">
                <span
                  className="block text-3xl text-pink-deep"
                  style={{ fontFamily: 'var(--font-handwritten)' }}
                >
                  {data.metadata.introMessage || 'Acompáñanos a celebrar la llegada de'}
                </span>
                <h1
                  className="text-4xl font-bold text-ink leading-tight font-display tracking-tight"
                >
                  Baby Shower de <span className="text-lilac block mt-1">{data.metadata.babyName}</span>
                </h1>
                <p className="text-sm font-semibold uppercase tracking-widest text-ink-soft">
                  Papás: {data.metadata.parentA} & {data.metadata.parentB}
                </p>
              </motion.div>

              {/* Countdown Timer */}
              <motion.div style={{ y: y2 }}>
                <Countdown targetIso={data.metadata.eventDate} />
              </motion.div>

              {/* Event Details Section */}
              <motion.div style={{ y: y3 }} className="space-y-6">
                {/* Integrated Graphic Unit: Almanac + Clock + Baby Deco */}
                <EventGraphicSection
                  date={data.metadata.eventDate}
                  time={formatTime(data.metadata.eventTime)}
                />

                {/* Location Card */}
                <div className="rounded-[2.5rem] border-b-4 border-butter bg-white p-7 shadow-xl shadow-butter/20 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-butter/60 text-ink shadow-inner">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-lg text-ink">Lugar del Evento</h4>
                      <p className="text-sm text-ink-soft leading-snug">{data.metadata.address || 'Pronto compartiremos la dirección exacta'}</p>
                    </div>
                  </div>

                  {data.metadata.mapsUrl && (
                    <button
                      type="button"
                      onClick={() => window.open(data.metadata.mapsUrl, '_blank', 'noopener,noreferrer')}
                      className="w-full rounded-2xl bg-lilac py-4 font-bold text-white shadow-lg shadow-lilac/25 transition-all active:scale-[0.98] hover:bg-lilac/95 flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-5 h-5" />
                      Abrir en Google Maps
                    </button>
                  )}
                </div>
              </motion.div>

              {/* RSVP Form and Gift Selection / Confirmation States */}
              <AnimatePresence mode="wait">
                {mode === 'normal' && (
                  <motion.div
                    key="rsvp-flow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <RsvpFlow
                      gifts={data.gifts}
                      onSubmit={handleRsvpSubmit}
                      submitting={submitting}
                    />
                  </motion.div>
                )}

                {mode === 'celebration' && guestInfo && (
                  <motion.div
                    key="celebration-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="rounded-[2.5rem] border-b-4 border-soft-pink bg-white p-7 text-center shadow-xl shadow-soft-pink/20 space-y-6"
                  >
                    <div className="flex justify-center text-6xl">🎉</div>
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl text-ink">¡Asistencia Confirmada!</h3>
                      <p className="text-sm text-ink-soft leading-relaxed">
                        Muchas gracias, <strong className="text-ink">{guestInfo.name}</strong>. Nos hace inmensamente felices saber que nos acompañarás en este día tan especial.
                      </p>
                    </div>

                    {selectedGiftId && (
                      <div className="rounded-3xl border border-slate-100 bg-cream p-5 text-left space-y-1">
                        <span className="text-xs uppercase tracking-wider text-ink-soft font-bold">Regalo Elegido</span>
                        <p className="font-display text-base text-ink font-semibold">{selectedGiftTitle}</p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setMode('normal')
                        setSelectedGift(null)
                      }}
                      className="text-xs text-ink-soft hover:text-ink underline transition-colors"
                    >
                      Modificar confirmación
                    </button>
                  </motion.div>
                )}

                {mode === 'declined' && guestInfo && (
                  <motion.div
                    key="declined-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="rounded-[2.5rem] border-b-4 border-soft-pink bg-white p-7 text-center shadow-xl shadow-soft-pink/20 space-y-6"
                  >
                    <div className="flex justify-center text-6xl">😔</div>
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl text-ink">¡Qué lástima!</h3>
                      <p className="text-sm text-ink-soft leading-relaxed">
                        Lamentamos mucho que no puedas asistir, <strong className="text-ink">{guestInfo.name}</strong>. Agradecemos mucho que te hayas tomado el tiempo de avisarnos.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMode('normal')
                        setGuestInfo({ name: '', phone: '', email: '' })
                      }}
                      className="w-full rounded-2xl bg-lilac py-4 font-bold text-white shadow-lg shadow-lilac/25 transition-all active:scale-[0.98] hover:bg-lilac/95"
                    >
                      ¡Mejor sí asistiré!
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </>
  )
}
