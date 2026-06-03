export interface SheetMetadata {
  parentA: string
  parentB: string
  babyName: string
  eventDate: string
  eventTime: string
  mapsUrl: string
  address?: string
  introMessage?: string
}

export interface Gift {
  id: string
  title: string
  description: string
  status: 'Available' | 'Claimed'
}

export interface GuestInfo {
  name: string
  phone: string
  email?: string
}

export interface SheetData {
  metadata: SheetMetadata
  gifts: Gift[]
}

export type AppMode = 'normal' | 'celebration' | 'declined'
