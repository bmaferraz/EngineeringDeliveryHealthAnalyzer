import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useSpaces } from '../hooks/useSpaces'
import { useHealthScore } from '../hooks/useHealthScore'
import type { IssueWithScore } from '../types/api'

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
  issues: IssueWithScore[]
  onViewDetails: (space: string) => void
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, issues, onViewDetails }) => {
  const totalIssues = issues.length
  
  const ragData = useMemo(() => {
    if (totalIssues === 0) {
      // Show full green when no issues
      return [{ name: 'Green', value: 1 }]
    }
    const counts: Record<string, number> = { Green: 0, Amber: 0, Red: 0 }
    issues.forEach(issue => counts[issue.rag]++)
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [issues, totalIssues])

  const ragCounts = useMemo(() => {
    const counts: Record<string, number> = { Green: 0, Amber: 0, Red: 0 }
    issues.forEach(issue => counts[issue.rag]++)
    return counts
  }, [issues])

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow border-2 border-gray-100 hover:border-blue-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 truncate" title={space}>
        {space}
      </h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Total Issues: {totalIssues}</p>
        
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={ragData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label={false}
            >
              {ragData.map(entry => (
                <Cell key={entry.name} fill={RAG_COLORS[entry.name]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {totalIssues > 0 ? (
          <div className="flex justify-around mt-3 text-sm">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="font-semibold">{ragCounts.Red}</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">Red</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="font-semibold">{ragCounts.Amber}</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">Amber</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-semibold">{ragCounts.Green}</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">Green</p>
            </div>
          </div>
        ) : (
          <div className="text-center mt-3 text-sm">
            <p className="text-green-600 font-semibold">All Green - No Issues</p>
          </div>
        )}
      </div>
      
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
  const healthScore = useHealthScore()

  const spaceOptions = useMemo(() => {
    if (!spaces.data?.data) return []
    return Object.keys(spaces.data.data)
  }, [spaces.data])

  const spaceIssuesMap = useMemo(() => {
    if (!healthScore.data?.data.issues) return new Map<string, IssueWithScore[]>()
    
    const map = new Map<string, IssueWithScore[]>()
    spaceOptions.forEach(space => {
      const issues = healthScore.data!.data.issues.filter(
        (issue: IssueWithScore) => issue.space === space
      )
      map.set(space, issues)
    })
    return map
  }, [healthScore.data, spaceOptions])

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

          {healthScore.loading && !spaces.loading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading issue data...</p>
            </div>
          )}

          {!spaces.loading && !healthScore.loading && !spaces.error && spaceOptions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {spaceOptions.map(space => (
                <SpaceCard
                  key={space}
                  space={space}
                  issues={spaceIssuesMap.get(space) || []}
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
