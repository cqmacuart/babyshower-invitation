'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SheetData } from '@/lib/types'

interface UseSheetDataReturn {
  data: SheetData | null
  loading: boolean
  error: boolean
  refetch: () => void
}

export function useSheetData(): UseSheetDataReturn {
  const [data, setData] = useState<SheetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/sheet-data')
      if (!res.ok) {
        setError(true)
        return
      }
      const json = await res.json() as SheetData & { error?: string }
      if (json.error) {
        setError(true)
        return
      }
      setData(json)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
