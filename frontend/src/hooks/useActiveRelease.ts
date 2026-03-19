import { useEffect, useState } from 'react'
import { spaceToProjectId } from '../utils/projectMapping'
import type { FixVersion } from './useFixVersions'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export function useActiveRelease(space?: string): FixVersion | null {
  const [release, setRelease] = useState<FixVersion | null>(null)

  useEffect(() => {
    if (!space) {
      setRelease(null)
      return
    }
    const projectId = spaceToProjectId(space)
    if (!projectId) {
      setRelease(null)
      return
    }

    const url = `${API_BASE}/api/v1/jira/active-release?project=${encodeURIComponent(projectId)}`
    fetch(url)
      .then(res => {
        if (!res.ok) return null
        return res.json()
      })
      .then(resp => {
        if (!resp?.data) {
          setRelease(null)
          return
        }
        const d = resp.data
        setRelease({
          name: d.name,
          released: d.released === 'True',
          releaseDate: d.releaseDate ?? '',
        })
      })
      .catch(() => setRelease(null))
  }, [space])

  return release
}
