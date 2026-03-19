import { useEffect, useState } from 'react'
import type { ApiResponse, IssueWithScore } from '../types/api'
import { spaceToProjectId } from '../utils/projectMapping'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export interface UseBottlenecksResult {
  data: ApiResponse<IssueWithScore[]> | null
  loading: boolean
  error: string | null
}

export function useBottlenecks(space?: string, fixVersion?: string): UseBottlenecksResult {
  const [data, setData] = useState<ApiResponse<IssueWithScore[]> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (space) {
      const projectId = spaceToProjectId(space)
      if (!projectId) {
        setError(`Unknown space: ${space}`)
        setLoading(false)
        return
      }
      params.set('project', projectId)
    }
    if (fixVersion) {
      params.set('fix_version', fixVersion)
    }
    const qs = params.toString()
    const url = `${API_BASE}/api/v1/bottlenecks${qs ? `?${qs}` : ''}`

    const fetchData = () => {
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json() as Promise<ApiResponse<IssueWithScore[]>>
        })
        .then(setData)
        .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Unknown error'))
        .finally(() => setLoading(false))
    }

    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [space, fixVersion])

  return { data, loading, error }
}
