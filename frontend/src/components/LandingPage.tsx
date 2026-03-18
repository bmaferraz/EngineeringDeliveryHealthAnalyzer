import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useSpaces } from '../hooks/useSpaces'
import { useHealthScore } from '../hooks/useHealthScore'
import { getAllowedContributors, PROJECT_CONTRIBUTORS } from '../utils/projectMapping'

interface LandingPageProps {
  onViewDetails: (space: string) => void
}

const RAG_COLORS: Record<string, string> = {
  Green: '#22c55e',
  Amber: '#f59e0b',
  Red: '#ef4444',
}

interface SpaceCardProps {
  space: string
  onViewDetails: (space: string) => void
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, onViewDetails }) => {
  // Each card fetches its own data via API with project filter
  const { data, loading, error } = useHealthScore(space)

  const allIssues = data?.data.issues ?? []

  // Derive the latest release (highest sort-order non-Unassigned fix_version)
  const latestRelease = useMemo(() => {
    const versions = [
      ...new Set(allIssues.map(i => i.fix_version).filter(v => v && v !== 'Unassigned')),
    ].sort()
    return versions.length > 0 ? versions[versions.length - 1] : null
  }, [allIssues])

  // Issues scoped to the latest release (fall back to all if none found)
  const issues = useMemo(
    () => (latestRelease ? allIssues.filter(i => i.fix_version === latestRelease) : allIssues),
    [allIssues, latestRelease],
  )

  const totalIssues = issues.length

  const ragData = useMemo(() => {
    if (totalIssues === 0) return [{ name: 'Green', value: 1 }]
    const counts: Record<string, number> = { Green: 0, Amber: 0, Red: 0 }
    issues.forEach(issue => counts[issue.rag]++)
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [issues, totalIssues])

  const ragCounts = useMemo(() => {
    const counts: Record<string, number> = { Green: 0, Amber: 0, Red: 0 }
    issues.forEach(issue => counts[issue.rag]++)
    return counts
  }, [issues])

  // Show the configured team members for this space (allowlist); mark active if they
  // have at least one issue in the current release scope
  const configuredContributors = PROJECT_CONTRIBUTORS[space] ?? []
  const activeAssignees = useMemo(() => {
    const allowed = getAllowedContributors(space)
    return new Set(
      issues.map(i => i.assignee).filter(name => Boolean(name) && allowed.has(name)),
    )
  }, [issues, space])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-2 border-gray-100 hover:border-blue-200 flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-1 truncate" title={space}>
        {space}
      </h3>

      {/* Latest release badge */}
      {latestRelease && !loading && !error && (
        <div className="flex items-center gap-1.5 mb-3">
          <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
          </svg>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full truncate">
            {latestRelease}
          </span>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <p className="mt-3 text-sm text-gray-400">Loading...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center h-48">
          <p className="text-red-500 text-sm text-center">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="mb-2 flex-1">
          <p className="text-xs text-gray-400 mb-2">
            {latestRelease ? `${totalIssues} issues in release` : `${totalIssues} total issues`}
          </p>

          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={ragData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={65}
                label={false}
              >
                {ragData.map(entry => (
                  <Cell key={entry.name} fill={RAG_COLORS[entry.name]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {totalIssues > 0 ? (
            <div className="flex justify-around mt-2 text-sm">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-semibold">{ragCounts.Red}</span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">Red</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="font-semibold">{ragCounts.Amber}</span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">Amber</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-semibold">{ragCounts.Green}</span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">Green</p>
              </div>
            </div>
          ) : (
            <div className="text-center mt-2 text-sm">
              <p className="text-green-600 font-semibold">All Green — No Issues</p>
            </div>
          )}

          {/* Contributors — always show the configured team, highlight active ones */}
          {configuredContributors.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Contributors
              </p>
              <div className="flex flex-wrap gap-1">
                {configuredContributors.map(name => {
                  const isActive = activeAssignees.has(name)
                  return (
                    <span
                      key={name}
                      title={isActive ? `${name} — has issues in this release` : name}
                      className={`inline-block max-w-[130px] truncate text-xs rounded-full px-2 py-0.5 font-medium
                        ${isActive
                          ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300'
                          : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                      {name}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => onViewDetails(space)}
        className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
      >
        View Details
      </button>
    </div>
  )
}

const LandingPage: React.FC<LandingPageProps> = ({ onViewDetails }) => {
  const spaces = useSpaces()

  const spaceOptions = useMemo(() => {
    if (!spaces.data?.data) return []
    return Object.keys(spaces.data.data)
  }, [spaces.data])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Engineering Delivery Health Analyzer
          </h1>
          <p className="text-xl text-gray-600">
            Real-time delivery risk and workload visibility
          </p>
        </header>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">Project Spaces - RAG Status Distribution</h2>

          {spaces.loading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading spaces...</p>
            </div>
          )}

          {spaces.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 text-lg">Error loading spaces: {spaces.error}</p>
            </div>
          )}

          {!spaces.loading && !spaces.error && spaceOptions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {spaceOptions.map(space => (
                <SpaceCard
                  key={space}
                  space={space}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}

          {!spaces.loading && !spaces.error && spaceOptions.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No spaces available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LandingPage
