import { useHealthScore } from './hooks/useHealthScore'
import { useBottlenecks } from './hooks/useBottlenecks'
import { useWorkload } from './hooks/useWorkload'
import HealthScoreCard from './components/HealthScoreCard'
import BottleneckTable from './components/BottleneckTable'
import WorkloadDistribution from './components/WorkloadDistribution'
import Filters, { FilterOptions } from './components/Filters'
import LandingPage from './components/LandingPage'
import ExportPrintButtons from './components/ExportPrintButtons'
import { useEffect, useState, useMemo } from 'react'
import type { IssueWithScore } from './types/api'

export default function App() {
  const healthScore = useHealthScore()
  const bottlenecks = useBottlenecks()
  const workload = useWorkload()
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [selectedSpace, setSelectedSpace] = useState<string>('')
  const [showDashboard, setShowDashboard] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    priority: [],
    sprint: [],
    rag: []
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 5 * 60 * 1000) // Update timestamp every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const handleViewDetails = (space: string) => {
    setSelectedSpace(space)
    setShowDashboard(true)
  }

  const handleGoHome = () => {
    setShowDashboard(false)
    setSelectedSpace('')
    setFilters({ status: [], priority: [], sprint: [], rag: [] })
  }

  // Filter data by selected space
  const spaceFilteredHealthScore = useMemo(() => {
    if (!healthScore.data || !selectedSpace) return healthScore

    const filteredIssues = healthScore.data.data.issues.filter(
      (issue: IssueWithScore) => issue.space === selectedSpace
    )

    const activeFiltered = filteredIssues.filter(i => i.status !== 'Done')
    const teamScore = activeFiltered.length === 0 ? 100
      : Math.round(activeFiltered.reduce((sum, i) => sum + i.health_score, 0) / activeFiltered.length)
    
    const classifyRAG = (score: number) => {
      if (score >= 75) return 'Green'
      if (score >= 50) return 'Amber'
      return 'Red'
    }

    return {
      ...healthScore,
      data: {
        ...healthScore.data,
        data: {
          ...healthScore.data.data,
          team_score: teamScore,
          rag: classifyRAG(teamScore) as 'Red' | 'Amber' | 'Green',
          total_issues: filteredIssues.length,
          issues: filteredIssues
        }
      }
    }
  }, [healthScore, selectedSpace])

  // Extract unique sprints from space-filtered data
  const availableSprints = useMemo(() => {
    if (!spaceFilteredHealthScore.data?.data.issues) return []
    const sprints = new Set(
      spaceFilteredHealthScore.data.data.issues
        .map(i => i.sprint || 'Unassigned')
        .filter(s => s)
    )
    return Array.from(sprints).sort()
  }, [spaceFilteredHealthScore.data])

  // Apply additional filters to health score data
  const filteredHealthScore = useMemo(() => {
    if (!spaceFilteredHealthScore.data) return spaceFilteredHealthScore

    const hasFilters = 
      filters.status.length > 0 || 
      filters.priority.length > 0 || 
      filters.sprint.length > 0 || 
      filters.rag.length > 0

    if (!hasFilters) return spaceFilteredHealthScore

    const filteredIssues = spaceFilteredHealthScore.data.data.issues.filter((issue: IssueWithScore) => {
      if (filters.status.length > 0 && !filters.status.includes(issue.status)) return false
      if (filters.priority.length > 0 && !filters.priority.includes(issue.priority)) return false
      if (filters.sprint.length > 0 && !filters.sprint.includes(issue.sprint || 'Unassigned')) return false
      if (filters.rag.length > 0 && !filters.rag.includes(issue.rag)) return false
      return true
    })

    // Recalculate team score for filtered issues
    const activeFiltered = filteredIssues.filter(i => i.status !== 'Done')
    const teamScore = activeFiltered.length === 0 ? 100
      : Math.round(activeFiltered.reduce((sum, i) => sum + i.health_score, 0) / activeFiltered.length)
    
    const classifyRAG = (score: number) => {
      if (score >= 75) return 'Green'
      if (score >= 50) return 'Amber'
      return 'Red'
    }

    return {
      ...spaceFilteredHealthScore,
      data: {
        ...spaceFilteredHealthScore.data,
        data: {
          ...spaceFilteredHealthScore.data.data,
          team_score: teamScore,
          rag: classifyRAG(teamScore) as 'Red' | 'Amber' | 'Green',
          total_issues: filteredIssues.length,
          issues: filteredIssues
        }
      }
    }
  }, [spaceFilteredHealthScore, filters])

  // Apply filters to bottlenecks data
  const filteredBottlenecks = useMemo(() => {
    if (!bottlenecks.data) return bottlenecks

    // First filter by space
    let filteredData = bottlenecks.data.data.filter((issue: IssueWithScore) => 
      issue.space === selectedSpace
    )

    // Then apply additional filters
    const hasFilters = 
      filters.status.length > 0 || 
      filters.priority.length > 0 || 
      filters.sprint.length > 0 || 
      filters.rag.length > 0

    if (hasFilters) {
      filteredData = filteredData.filter((issue: IssueWithScore) => {
        if (filters.status.length > 0 && !filters.status.includes(issue.status)) return false
        if (filters.priority.length > 0 && !filters.priority.includes(issue.priority)) return false
        if (filters.sprint.length > 0 && !filters.sprint.includes(issue.sprint || 'Unassigned')) return false
        if (filters.rag.length > 0 && !filters.rag.includes(issue.rag)) return false
        return true
      })
    }

    return {
      ...bottlenecks,
      data: {
        ...bottlenecks.data,
        data: filteredData
      }
    }
  }, [bottlenecks, filters, selectedSpace])

  // Show landing page if dashboard is not open
  if (!showDashboard) {
    return <LandingPage onViewDetails={handleViewDetails} />
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={handleGoHome}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 print:hidden"
                title="Go to home"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Engineering Delivery Health Analyzer</h1>
            </div>
            <p className="text-gray-500 mt-1">Real-time delivery risk and workload visibility</p>
            <p className="text-sm text-blue-600 font-semibold mt-1">Current Space: {selectedSpace}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="text-right text-sm">
              <div className="text-gray-400">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Live data
              </div>
              <div className="text-gray-500 mt-1">
                Auto-refresh: 5 min
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
            <ExportPrintButtons 
              data={filteredHealthScore.data?.data.issues || []} 
              filename={`dashboard-${selectedSpace.replace(/\s+/g, '-')}`}
            />
          </div>
        </div>
      </header>

      <Filters 
        filters={filters} 
        onChange={setFilters} 
        availableSprints={availableSprints}
        totalIssues={spaceFilteredHealthScore.data?.data.issues.length}
        filteredIssues={filteredHealthScore.data?.data.issues.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <HealthScoreCard {...filteredHealthScore} />
        <WorkloadDistribution {...workload} />
      </div>

      <BottleneckTable {...filteredBottlenecks} />
    </div>
  )
}
