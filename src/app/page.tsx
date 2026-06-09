'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
import { GiftRegistry } from '@/components/GiftRegistry'
import { ThankYouScreen } from '@/components/ThankYouScreen'
import { useIsMobile } from '@/hooks/useIsMobile'
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

function mapsDirectionsUrl(coordinates?: string, fallbackUrl?: string): string {
  if (coordinates) return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coordinates)}`
  return fallbackUrl ?? ''
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
  const { mode, selectedGiftId, guestInfo, confirmacionRow, setMode, setSelectedGift, setGuestInfo, setConfirmacionRow } =
    useInvitationStore()

  const { data, loading, error, refetch } = useSheetData()
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll()

  const y1 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -50])
  const y3 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -30])

  const [showIntro, setShowIntro] = useState(true)
  const [cloudVisible, setCloudVisible] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [pendingGiftId, setPendingGiftId] = useState<string | null>(null)
  const [claimingGift, setClaimingGift] = useState(false)

  const { isPlaying, toggle, forcePlay } = useMusicPlayer(
    mode === 'celebration' ? 'celebration' : 'intro'
  )

  useEffect(() => {
    if (mode === 'celebration' || mode === 'declined') {
      setShowIntro(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [mode])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 5500)
  }, [])

  const handleEnter = useCallback(() => {
    forcePlay()
    setCloudVisible(true)
    setTimeout(() => {
      setShowIntro(false)
      setCloudVisible(false)
      // After the main content renders (page becomes much taller), framer-motion
      // won't recalculate scrollYProgress until a scroll event fires. Dispatching
      // one after the next paint forces it back to 0 so parallax starts correctly.
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
        window.dispatchEvent(new Event('scroll'))
      })
    }, 1200)
  }, [forcePlay])

  const triggerConfetti = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default
    const colors = ["#C9A8E0", "#F6C6D0", "#BFE3D4", "#FEC8D8", "#FFF6BD"]
    confetti({ particleCount: 180, spread: 160, origin: { y: 0.6 }, colors })
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
        // Update existing row (declined → attending) or append new row
        let rowIndex = confirmacionRow
        if (rowIndex) {
          const res = await fetch('/api/update-rsvp', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              rowIndex,
              guestInfo: guest,
              giftId: rsvpData.regaloId,
              giftName: rsvpData.regaloNombre,
              asistentes: rsvpData.asistentes,
            }),
          })
          if (!res.ok) {
            showToast('Hubo un error al actualizar tu confirmación. Intenta de nuevo.')
            return
          }
        } else {
          const res = await fetch('/api/submit-rsvp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              guestInfo: guest,
              giftId: rsvpData.regaloId,
              giftName: rsvpData.regaloNombre,
              asistentes: rsvpData.asistentes,
            }),
          })
          if (!res.ok) {
            showToast('Hubo un error al confirmar tu asistencia. Intenta de nuevo.')
            return
          }
          const json = await res.json() as { rowIndex?: number }
          rowIndex = json.rowIndex ?? null
          setConfirmacionRow(rowIndex)
        }

        if (rsvpData.regaloId && rsvpData.regaloId !== 'cash') {
          const claimRes = await fetch('/api/claim-gift', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              giftId: rsvpData.regaloId,
              guestInfo: guest,
              confirmacionRow: rowIndex,
              giftName: rsvpData.regaloNombre,
            }),
          })

          if (claimRes.status === 409) {
            showToast('⚠️ Este regalo ya fue tomado por alguien más. La lista se actualizó — elige otro.')
            await refetch()
            return
          }
        }

        setGuestInfo(guest)
        setSelectedGift(rsvpData.regaloId)
        setMode('celebration')
        await triggerConfetti()
      } else {
        // Declined — always append (first time saying no)
        const res = await fetch('/api/submit-rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestInfo: guest,
            giftId: '',
            giftName: 'No asistirá',
            asistentes: 0,
          }),
        })
        if (!res.ok) {
          showToast('Hubo un error al enviar tu respuesta. Intenta de nuevo.')
          return
        }
        const json = await res.json() as { rowIndex?: number }
        setConfirmacionRow(json.rowIndex ?? null)
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

  const handleClaimGift = useCallback(async () => {
    if (!pendingGiftId || !guestInfo) return
    setClaimingGift(true)
    try {
      const giftName = pendingGiftId === 'cash'
        ? 'Obsequio en Efectivo'
        : (data?.gifts.find((g) => g.id === pendingGiftId)?.title ?? '')
      const res = await fetch('/api/claim-gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftId: pendingGiftId, guestInfo, confirmacionRow, giftName }),
      })
      if (res.status === 409) {
        showToast('⚠️ Este regalo ya fue tomado por alguien más. La lista se actualizó — elige otro.')
        setPendingGiftId(null)
        await refetch()
      } else if (!res.ok) {
        showToast('Ocurrió un error al reservar el regalo. Intenta de nuevo.')
      } else {
        setSelectedGift(pendingGiftId)
        setPendingGiftId(null)
      }
    } catch {
      showToast('Ocurrió un error de red. Intenta de nuevo.')
    } finally {
      setClaimingGift(false)
    }
  }, [pendingGiftId, guestInfo, confirmacionRow, data, refetch, setSelectedGift, showToast])

  const handleReset = useCallback(() => {
    localStorage.removeItem('baby-shower-state')
    window.location.reload()
  }, [])

  const selectedGiftTitle = useMemo(() => {
    if (!data) return ''
    if (selectedGiftId === 'cash') return 'Obsequio en efectivo'
    return data.gifts.find((g) => g.id === selectedGiftId)?.title ?? ''
  }, [data, selectedGiftId])

  const eventPassed = (() => {
    if (!data?.metadata.eventDate) return false
    const event = new Date(`${data.metadata.eventDate}T23:59:59`)
    return new Date() > event
  })()

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

  if (error) return <OfflineScreen onRetry={refetch} />

  if (eventPassed) {
    return (
      <ThankYouScreen
        babyName={data?.metadata.babyName}
        parentA={data?.metadata.parentA}
        parentB={data?.metadata.parentB}
      />
    )
  }

  const isConfirmationMode = (mode === 'celebration' || mode === 'declined') && !!guestInfo

  // ── Confirmation view ──────────────────────────────────────────────────────────
  if (isConfirmationMode && data) {
    return (
      <div className="relative min-h-screen">
        <CloudsBackground />
        <ForegroundClouds />
        <MusicToggle isPlaying={isPlaying} toggle={toggle} />

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl text-white text-sm font-semibold shadow-2xl max-w-sm text-center leading-snug"
              style={{ backgroundColor: '#c0392b' }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
        {mode === 'celebration' && <ConfettiOverlay active />}

        {/* Floating confirm-gift button */}
        <AnimatePresence>
          {pendingGiftId && !selectedGiftId && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-[360px] px-6"
            >
              <button
                type="button"
                onClick={handleClaimGift}
                disabled={claimingGift}
                className="w-full rounded-2xl py-4 font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #C9B8F5, #F5C0D0)',
                  fontFamily: 'var(--font-clean)',
                  boxShadow: '0 12px 32px -8px rgba(201,184,245,0.7)',
                }}
              >
                {claimingGift ? 'Reservando…' : 'Confirmar regalo'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`relative z-10 w-full max-w-[480px] mx-auto px-6 py-14 flex flex-col gap-7 ${pendingGiftId && !selectedGiftId ? 'pb-28' : ''}`}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3 pt-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
              className="text-7xl"
            >
              {mode === 'celebration' ? '🎉' : '😔'}
            </motion.div>

            {mode === 'celebration' ? (
              <>
                <h1
                  className="text-3xl font-bold leading-tight"
                  style={{ fontFamily: 'var(--font-display)', color: '#4A3F6B' }}
                >
                  ¡Gracias, {guestInfo!.name}!
                </h1>
                <p
                  className="text-sm leading-relaxed max-w-xs mx-auto"
                  style={{ color: '#9B4F6B', fontFamily: 'var(--font-clean)' }}
                >
                  Nos hace inmensamente felices saber que nos acompañarás en este día tan especial.
                </p>
              </>
            ) : (
              <>
                <h1
                  className="text-3xl font-bold leading-tight"
                  style={{ fontFamily: 'var(--font-display)', color: '#4A3F6B' }}
                >
                  ¡Qué lástima!
                </h1>
                <p
                  className="text-sm leading-relaxed max-w-xs mx-auto"
                  style={{ color: '#9B4F6B', fontFamily: 'var(--font-clean)' }}
                >
                  Lamentamos mucho que no puedas asistir,{' '}
                  <strong style={{ color: '#4A3F6B' }}>{guestInfo!.name}</strong>.
                  Agradecemos que nos hayas avisado.
                </p>
                <button
                  type="button"
                  onClick={() => setMode('normal')}
                  className="mt-2 rounded-2xl px-6 py-3 font-bold text-white text-sm transition-all active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #C9B8F5, #F5C0D0)',
                    fontFamily: 'var(--font-clean)',
                    boxShadow: '0 8px 20px -6px rgba(201,184,245,0.5)',
                  }}
                >
                  ¡Mejor sí asistiré! 🎉
                </button>
              </>
            )}
          </motion.div>

          {/* Event details — only on celebration */}
          {mode === 'celebration' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="rounded-[2.5rem] border-b-4 bg-white p-7 shadow-xl space-y-4"
              style={{ borderColor: '#F6C6D0', boxShadow: '0 20px 40px -12px rgba(246,198,208,0.35)' }}
            >
              <h4
                className="font-bold text-base"
                style={{ fontFamily: 'var(--font-display)', color: '#4A3F6B' }}
              >
                Te esperamos el
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EDE9FF' }}>
                    <Calendar className="w-4 h-4" style={{ color: '#8B7FD4' }} />
                  </div>
                  <span className="text-sm" style={{ color: '#4A3F6B', fontFamily: 'var(--font-clean)' }}>
                    {formatDate(data.metadata.eventDate)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EDE9FF' }}>
                    <Clock className="w-4 h-4" style={{ color: '#8B7FD4' }} />
                  </div>
                  <span className="text-sm" style={{ color: '#4A3F6B', fontFamily: 'var(--font-clean)' }}>
                    {formatTime(data.metadata.eventTime)}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#EDE9FF' }}>
                    <MapPin className="w-4 h-4" style={{ color: '#8B7FD4' }} />
                  </div>
                  <span className="text-sm leading-snug" style={{ color: '#4A3F6B', fontFamily: 'var(--font-clean)' }}>
                    {data.metadata.address}
                  </span>
                </div>
              </div>

              {data.metadata.mapsUrl && (
                <button
                  type="button"
                  onClick={() => window.open(mapsDirectionsUrl(data.metadata.coordinates, data.metadata.mapsUrl), '_blank', 'noopener,noreferrer')}
                  className="w-full rounded-2xl py-4 font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #C9B8F5, #F5C0D0)', fontFamily: 'var(--font-clean)', boxShadow: '0 8px 20px -6px rgba(201,184,245,0.5)' }}
                >
                  <MapPin className="w-4 h-4" />
                  Abrir en Google Maps
                </button>
              )}
            </motion.div>
          )}

          {/* Gift section — only on celebration */}
          {mode === 'celebration' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {selectedGiftId ? (
                <div
                  className="rounded-[2.5rem] border bg-white p-7 shadow-xl space-y-2"
                  style={{ borderColor: '#EDE9FF', boxShadow: '0 12px 28px -8px rgba(201,184,245,0.25)' }}
                >
                  <span
                    className="text-xs uppercase tracking-wider font-bold"
                    style={{ color: '#9B4F6B', fontFamily: 'var(--font-clean)' }}
                  >
                    Tu regalo elegido
                  </span>
                  <p
                    className="text-base font-semibold"
                    style={{ fontFamily: 'var(--font-display)', color: '#4A3F6B' }}
                  >
                    {selectedGiftTitle}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p
                    className="text-xs text-center px-4"
                    style={{ color: '#9B4F6B', fontFamily: 'var(--font-clean)' }}
                  >
                    Si deseas traer un detalle, selecciona uno de la lista:
                  </p>
                  <GiftRegistry
                    gifts={data.gifts}
                    onGiftSelect={(id) => setPendingGiftId(id)}
                    selectedGiftId={pendingGiftId}
                    pageSize={5}
                    compact
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Reset button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center pb-6"
          >
            <button
              type="button"
              onClick={handleReset}
              className="text-xs underline underline-offset-2 transition-colors"
              style={{ color: '#C9B8F5', fontFamily: 'var(--font-clean)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#9B4F6B')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#C9B8F5')}
            >
              Reiniciar postal
            </button>
          </motion.div>

        </div>
      </div>
    )
  }

  // ── Invitation view (normal flow) ──────────────────────────────────────────────
  return (
    <>
      <ForegroundClouds />
      <CloudMask isVisible={cloudVisible} />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl text-white text-sm font-semibold shadow-2xl max-w-sm text-center leading-snug"
            style={{ backgroundColor: '#c0392b' }}
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
          <CloudsBackground />
          <OrigamiBird />
          <MusicToggle isPlaying={isPlaying} toggle={toggle} />

          {data && (
            <div className="relative z-10 w-full max-w-[480px] mx-auto px-6 py-12 flex flex-col gap-8">
              <div className="flex justify-center mb-4">
                <FloatingBalloonHero className="w-48 h-64" />
              </div>

              <motion.div style={{ y: y1, willChange: 'transform' }} className="text-center space-y-4">
                <span
                  className="block text-3xl text-pink-deep"
                  style={{ fontFamily: 'var(--font-handwritten)' }}
                >
                  {data.metadata.introMessage || 'Acompáñanos a celebrar la llegada de'}
                </span>
                <h1 className="text-4xl font-bold text-ink leading-tight font-display tracking-tight">
                  Baby Shower de{' '}
                  <span className="text-lilac block mt-1">{data.metadata.babyName}</span>
                </h1>
                <p className="text-sm font-semibold uppercase tracking-widest text-ink-soft">
                  Padres: {data.metadata.parentA} & {data.metadata.parentB}
                </p>
              </motion.div>

              <motion.div style={{ y: y2, willChange: 'transform' }}>
                <Countdown targetIso={data.metadata.eventDate} />
              </motion.div>

              <motion.div style={{ y: y3, willChange: 'transform' }} className="space-y-6">
                <EventGraphicSection
                  date={data.metadata.eventDate}
                  time={formatTime(data.metadata.eventTime)}
                />

                <div className="rounded-[2.5rem] border-b-4 border-butter bg-white p-7 shadow-xl shadow-butter/20 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-butter/60 text-ink shadow-inner">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-display text-lg text-ink">Lugar del Evento</h4>
                      <p className="text-sm text-ink-soft leading-snug">
                        {data.metadata.address || 'Pronto compartiremos la dirección exacta'}
                      </p>
                    </div>
                  </div>

                  {data.metadata.mapsUrl && (
                    <button
                      type="button"
                      onClick={() => window.open(mapsDirectionsUrl(data.metadata.coordinates, data.metadata.mapsUrl), '_blank', 'noopener,noreferrer')}
                      className="w-full rounded-2xl bg-lilac py-4 font-bold text-white shadow-lg shadow-lilac/25 transition-all active:scale-[0.98] hover:bg-lilac/95 flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-5 h-5" />
                      Abrir en Google Maps
                    </button>
                  )}
                </div>
              </motion.div>

              <RsvpFlow
                gifts={data.gifts}
                onSubmit={handleRsvpSubmit}
                submitting={submitting}
                defaultValues={guestInfo ? {
                  nombre: guestInfo.name,
                  telefono: guestInfo.phone,
                  email: guestInfo.email,
                } : undefined}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}
