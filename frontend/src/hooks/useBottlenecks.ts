import { useEffect, useState } from 'react'
import type { ApiResponse, IssueWithScore } from '../types/api'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface UseBottlenecksResult {
  data: ApiResponse<IssueWithScore[]> | null
  loading: boolean
  error: string | null
}

export function useBottlenecks(): UseBottlenecksResult {
  const [data, setData] = useState<ApiResponse<IssueWithScore[]> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = () => {
      fetch(`${API_BASE}/api/v1/bottlenecks`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json() as Promise<ApiResponse<IssueWithScore[]>>
        })
        .then(setData)
        .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
        .finally(() => setLoading(false))
    }

    fetchData() // Initial fetch
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Refresh every 5 minutes

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  return { data, loading, error }
}
