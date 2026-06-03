'use client'

import { useState, useEffect, useCallback } from 'react'
import { useInvitationStore } from '@/hooks/useInvitationStore'
import { useSheetData } from '@/hooks/useSheetData'
import { useAudio } from '@/hooks/useAudio'
import { CloudMask } from '@/components/ui/CloudMask'
import { IntroGate } from '@/components/IntroGate'
import { CountdownTimer } from '@/components/CountdownTimer'
import { ParentsPhoto } from '@/components/ParentsPhoto'
import { DateTimeLocation } from '@/components/DateTimeLocation'
import { GiftRegistry } from '@/components/GiftRegistry'
import { RSVPSection } from '@/components/RSVPSection'
import { CelebrationBanner } from '@/components/CelebrationBanner'
import { OfflineScreen } from '@/components/OfflineScreen'
import type { GuestInfo } from '@/lib/types'

export default function Home() {
  const { mode, selectedGiftId, guestInfo, setMode, setSelectedGift, setGuestInfo } =
    useInvitationStore()

  const { data, loading, error, refetch } = useSheetData()
  const audio = useAudio(mode === 'celebration')

  const [showIntro, setShowIntro] = useState(true)
  const [cloudVisible, setCloudVisible] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Skip intro if already in celebration mode
  useEffect(() => {
    if (mode === 'celebration') {
      setShowIntro(false)
    }
  }, [mode])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }, [])

  const handleEnter = useCallback(() => {
    audio.unlockAndPlay()
    // Cloud wipe out animation
    setCloudVisible(true)
    setTimeout(() => {
      setShowIntro(false)
      setCloudVisible(false)
    }, 1200)
  }, [audio])

  const triggerConfetti = useCallback(async () => {
    const confetti = (await import('canvas-confetti')).default
    confetti({
      particleCount: 180,
      spread: 160,
      origin: { y: 0.6 },
      colors: ['#C9B8F5', '#F5C0D0', '#B8F0D8', '#F5ECBA', '#B8E4F0'],
    })
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 100, origin: { y: 0.4 } })
    }, 600)
  }, [])

  const handleAttend = useCallback(
    async (info: GuestInfo) => {
      // Resolve gift name for the sheet
      const giftName =
        selectedGiftId === 'cash'
          ? 'Regalo en efectivo'
          : (data?.gifts.find((g) => g.id === selectedGiftId)?.title ?? '')

      // Submit RSVP to Confirmaciones sheet
      const rsvpRes = await fetch('/api/submit-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestInfo: info,
          giftId: selectedGiftId ?? '',
          giftName,
        }),
      })

      if (!rsvpRes.ok) {
        showToast('Hubo un error al confirmar tu asistencia. Intenta de nuevo.')
        return
      }

      // Claim gift in Regalos sheet (only physical gifts, not cash)
      if (selectedGiftId && selectedGiftId !== 'cash') {
        const claimRes = await fetch('/api/claim-gift', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ giftId: selectedGiftId, guestInfo: info }),
        })

        if (claimRes.status === 409) {
          showToast('Este regalo ya fue tomado, elige otro.')
          setSelectedGift(null)
          return
        }
      }

      setGuestInfo(info)
      setMode('celebration')
      audio.switchToCelebration()
      await triggerConfetti()
    },
    [data, selectedGiftId, setMode, setGuestInfo, setSelectedGift, audio, triggerConfetti, showToast]
  )

  // "No Asistiré" — we just record the local UI state; the sheet schema
  // doesn't have an attendance column so we skip the API call.
  const handleDecline = useCallback(async (_name: string) => {
    // no-op: Confirmaciones only tracks attending guests
  }, [])

  // Loading state
  if (loading && !data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#FFF8F0' }}
      >
        <div
          className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: '#C9B8F5', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  if (error) {
    return <OfflineScreen onRetry={refetch} />
  }

  return (
    <>
      {/* Cloud wipe transition */}
      <CloudMask isVisible={cloudVisible} />

      {/* Toast notification */}
      {toast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-white text-sm shadow-lg max-w-xs text-center"
          style={{ backgroundColor: '#9B4F6B' }}
        >
          {toast}
        </div>
      )}

      {showIntro ? (
        <IntroGate
          onEnter={handleEnter}
          babyName={data?.metadata.babyName}
        />
      ) : (
        <div className="invitation-container">
          {data && (
            <>
              <CountdownTimer targetDate={data.metadata.eventDate} />
              <ParentsPhoto parentA={data.metadata.parentA} parentB={data.metadata.parentB} />
              <DateTimeLocation
                eventDate={data.metadata.eventDate}
                eventTime={data.metadata.eventTime}
                mapsUrl={data.metadata.mapsUrl}
              />
              <GiftRegistry
                gifts={data.gifts}
                onGiftSelect={setSelectedGift}
                selectedGiftId={selectedGiftId}
                disabled={mode === 'celebration'}
              />
              {mode !== 'celebration' && (
                <RSVPSection
                  mode={mode}
                  selectedGiftId={selectedGiftId}
                  onAttend={handleAttend}
                  onDecline={handleDecline}
                  initialGuestInfo={guestInfo ?? undefined}
                />
              )}
              {mode === 'celebration' && guestInfo && (
                <CelebrationBanner
                  guestName={guestInfo.name}
                  gifts={data.gifts}
                  onGiftSelect={setSelectedGift}
                  selectedGiftId={selectedGiftId}
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
