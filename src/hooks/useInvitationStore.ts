'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppMode, GuestInfo } from '@/lib/types'

interface InvitationStore {
  mode: AppMode
  selectedGiftId: string | null
  guestInfo: GuestInfo | null
  audioUnlocked: boolean
  setMode: (mode: AppMode) => void
  setSelectedGift: (id: string | null) => void
  setGuestInfo: (info: GuestInfo) => void
  setAudioUnlocked: (v: boolean) => void
}

export const useInvitationStore = create<InvitationStore>()(
  persist(
    (set) => ({
      mode: 'normal',
      selectedGiftId: null,
      guestInfo: null,
      audioUnlocked: false,
      setMode: (mode) => set({ mode }),
      setSelectedGift: (id) => set({ selectedGiftId: id }),
      setGuestInfo: (info) => set({ guestInfo: info }),
      setAudioUnlocked: (v) => set({ audioUnlocked: v }),
    }),
    {
      name: 'baby-shower-state',
      partialize: (state) => ({
        mode: state.mode,
        selectedGiftId: state.selectedGiftId,
        guestInfo: state.guestInfo,
      }),
    }
  )
)
