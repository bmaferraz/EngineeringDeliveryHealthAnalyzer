import { useEffect, useState } from 'react'
import { spaceToProjectId } from '../utils/projectMapping'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export function useFixVersions(space?: string): string[] {
  const [versions, setVersions] = useState<string[]>([])

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

    const url = `${API_BASE}/api/v1/jira/fix-versions?project=${encodeURIComponent(projectId)}&limit=50`
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(resp => {
        const data: Array<{ name: string }> = resp?.data ?? []
        setVersions(data.map(v => v.name).sort())
      })
      .catch(() => setVersions([]))
  }, [space])

  return versions
}
