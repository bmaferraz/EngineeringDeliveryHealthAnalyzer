import React, { useState } from 'react'

const RAGLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="rounded-2xl shadow-md bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-base font-semibold text-gray-700">
            Understanding Health Status Colors
          </h3>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6">
          {/* RAG Thresholds */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Color Thresholds</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="w-8 h-8 rounded-full bg-green-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-green-900">Green — Healthy</div>
                  <div className="text-sm text-green-700">Score ≥ 75 · Continue monitoring</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-amber-900">Amber — At Risk</div>
                  <div className="text-sm text-amber-700">Score 50-74 · Needs attention</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="w-8 h-8 rounded-full bg-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-red-900">Red — Critical</div>
                  <div className="text-sm text-red-700">Score &lt; 50 · Immediate action needed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scoring Formula */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Health Score Formula (0-100)</h4>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-mono text-sm text-gray-700 mb-3">
                Score = (0.4 × Status) + (0.3 × Priority) + (0.3 × Age)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Status (40%)</div>
                  <div className="space-y-0.5 text-gray-600">
                    <div>Done: 100</div>
                    <div>In Progress: 70</div>
                    <div>Open: 50</div>
                    <div>Blocked: 0</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Priority (30%)</div>
                  <div className="space-y-0.5 text-gray-600">
                    <div>Low: 100</div>
                    <div>Medium: 75</div>
                    <div>High: 40</div>
                    <div>Critical: 10</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Age (30%)</div>
                  <div className="space-y-0.5 text-gray-600">
                    <div>Fresh: 100</div>
                    <div>10 days: 80</div>
                    <div>25 days: 50</div>
                    <div>50+ days: 0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Examples */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Examples</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2 rounded bg-green-50">
                <span className="font-bold text-green-600">85</span>
                <span className="text-gray-600">Done task, Medium priority, 5 days old</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded bg-amber-50">
                <span className="font-bold text-amber-600">64</span>
                <span className="text-gray-600">In Progress, High priority, 10 days old</span>
              </div>
              <div className="flex items-start gap-2 p-2 rounded bg-red-50">
                <span className="font-bold text-red-600">21</span>
                <span className="text-gray-600">Blocked, Critical priority, 20 days old</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">When to Act</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2 rounded bg-green-50 border border-green-200">
                <div className="font-semibold text-green-900 mb-1">🟢 Green</div>
                <div className="text-green-700">Normal monitoring</div>
              </div>
              <div className="p-2 rounded bg-amber-50 border border-amber-200">
                <div className="font-semibold text-amber-900 mb-1">🟠 Amber</div>
                <div className="text-amber-700">Review in standup</div>
              </div>
              <div className="p-2 rounded bg-red-50 border border-red-200">
                <div className="font-semibold text-red-900 mb-1">🔴 Red</div>
                <div className="text-red-700">Escalate immediately</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RAGLegend
