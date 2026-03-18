import { useEffect, useState } from 'react'
import type { ApiResponse, SpaceInfo } from '../types/api'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface UseSpacesResult {
  data: ApiResponse<SpaceInfo> | null
  loading: boolean
  error: string | null
}

export function useSpaces(): UseSpacesResult {
  const [data, setData] = useState<ApiResponse<SpaceInfo> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/jira/spaces`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<ApiResponse<SpaceInfo>>
      })
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
