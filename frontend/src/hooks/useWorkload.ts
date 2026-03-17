import { useEffect, useState } from 'react'
import type { ApiResponse, WorkloadDistribution } from '../types/api'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface UseWorkloadResult {
  data: ApiResponse<WorkloadDistribution> | null
  loading: boolean
  error: string | null
}

export function useWorkload(): UseWorkloadResult {
  const [data, setData] = useState<ApiResponse<WorkloadDistribution> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = () => {
      fetch(`${API_BASE}/api/v1/workload`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json() as Promise<ApiResponse<WorkloadDistribution>>
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
