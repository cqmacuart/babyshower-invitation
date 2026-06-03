'use client'

import { useEffect, useRef, useState } from 'react'

interface AudioController {
  unlockAndPlay: () => void
  switchToCelebration: () => void
  isUnlocked: boolean
}

export function useAudio(isCelebrationMode: boolean): AudioController {
  const track1Ref = useRef<import('howler').Howl | null>(null)
  const track2Ref = useRef<import('howler').Howl | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    // If already in celebration mode on mount, skip track1 and go straight to track2
    if (isCelebrationMode) {
      let mounted = true
      import('howler').then(({ Howl }) => {
        if (!mounted) return
        if (!track2Ref.current) {
          track2Ref.current = new Howl({
            src: ['/audio/track2.mp3'],
            loop: true,
            volume: 0,
          })
        }
        track2Ref.current.play()
        track2Ref.current.fade(0, 0.7, 1500)
        setIsUnlocked(true)
      })
      return () => { mounted = false }
    }
  }, [isCelebrationMode])

  const unlockAndPlay = async () => {
    if (isUnlocked) return
    const { Howl } = await import('howler')

    if (!track1Ref.current) {
      track1Ref.current = new Howl({
        src: ['/audio/track1.mp3'],
        loop: true,
        volume: 0,
        autoplay: false,
      })
    }
    if (!track2Ref.current) {
      track2Ref.current = new Howl({
        src: ['/audio/track2.mp3'],
        loop: true,
        volume: 0,
        autoplay: false,
      })
    }

    track1Ref.current.play()
    track1Ref.current.fade(0, 0.7, 1000)
    setIsUnlocked(true)
  }

  const switchToCelebration = () => {
    if (track1Ref.current) {
      track1Ref.current.fade(0.7, 0, 1500)
    }
    setTimeout(async () => {
      if (!track2Ref.current) {
        const { Howl } = await import('howler')
        track2Ref.current = new Howl({
          src: ['/audio/track2.mp3'],
          loop: true,
          volume: 0,
        })
      }
      track2Ref.current.play()
      track2Ref.current.fade(0, 0.7, 1500)
    }, 1500)
  }

  return { unlockAndPlay, switchToCelebration, isUnlocked }
}
