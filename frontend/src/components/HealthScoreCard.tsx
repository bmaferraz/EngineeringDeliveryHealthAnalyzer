import React from 'react'
import type { UseHealthScoreResult } from '../hooks/useHealthScore'

type HealthScoreCardProps = UseHealthScoreResult

const RAG_BORDER: Record<string, string> = {
  Red: 'border-red-500',
  Amber: 'border-amber-400',
  Green: 'border-green-500',
  None: 'border-gray-300',
}

const RAG_TEXT: Record<string, string> = {
  Red: 'text-red-500',
  Amber: 'text-amber-500',
  Green: 'text-green-500',
  None: 'text-gray-400',
}

const RAG_BG: Record<string, string> = {
  Red: 'bg-red-500',
  Amber: 'bg-amber-400',
  Green: 'bg-green-500',
  None: 'bg-gray-300',
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ data, loading, error }) => {
  if (loading) {
    return <div className="rounded-2xl shadow-md p-8 bg-white animate-pulse h-60" />
  }
  if (error) {
    return (
      <div className="rounded-2xl shadow-md p-8 bg-white">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    )
  }
  if (!data) return null

  const { team_score, rag, total_issues, issues } = data.data
  const activeIssues = issues.filter(i => i.status !== 'Done').length

  return (
    <div className="rounded-2xl shadow-md p-8 bg-white">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Team Health Score</h2>
      <div className="flex items-start gap-8">
        <div
          className={`w-32 h-32 rounded-full border-[10px] ${RAG_BORDER[rag]} flex flex-col items-center justify-center shrink-0`}
        >
          <span className={`text-5xl font-bold ${RAG_TEXT[rag]}`}>{team_score}</span>
          <span className="text-sm text-gray-400">/ 100</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-white text-base font-semibold ${RAG_BG[rag]}`}
            >
              {rag === 'None' ? 'N/A' : rag}
            </span>
            <p className="text-base text-gray-500">
              {total_issues} total · {activeIssues} active
            </p>
          </div>
          <div className="space-y-2 text-sm mt-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-500 shrink-0"></div>
              <span className="text-gray-600">Green: Score ≥ 75</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-amber-500 shrink-0"></div>
              <span className="text-gray-600">Amber: Score 50-74</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500 shrink-0"></div>
              <span className="text-gray-600">Red: Score &lt; 50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthScoreCard
