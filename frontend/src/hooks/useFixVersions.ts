import { useEffect, useState } from 'react'
import { spaceToProjectId } from '../utils/projectMapping'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export interface FixVersion {
  name: string
  released: boolean
  releaseDate: string
}

export function useFixVersions(space?: string): FixVersion[] {
  const [versions, setVersions] = useState<FixVersion[]>([])

  useEffect(() => {
    if (!space) {
      setVersions([])
      return
    }
    const projectId = spaceToProjectId(space)
    if (!projectId) {
      setVersions([])
      return
    }

    const url = `${API_BASE}/api/v1/jira/fix-versions?project=${encodeURIComponent(projectId)}&limit=5`
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(resp => {
        const data: Array<{ name: string; released: string; releaseDate: string }> = resp?.data ?? []
        const sorted = data
          .map(v => ({ name: v.name, released: v.released === 'True', releaseDate: v.releaseDate ?? '' }))
          .sort((a, b) => a.name.localeCompare(b.name))
        setVersions(sorted)
      })
      .catch(() => setVersions([]))
  }, [space])

  return versions
}
