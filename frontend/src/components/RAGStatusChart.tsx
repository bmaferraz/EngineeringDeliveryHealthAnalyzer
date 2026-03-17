import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { UseHealthScoreResult } from '../hooks/useHealthScore'

type RAGStatusChartProps = UseHealthScoreResult

const RAG_COLORS: Record<string, string> = {
  Green: '#22c55e',
  Amber: '#f59e0b',
  Red: '#ef4444',
}

const RAGStatusChart: React.FC<RAGStatusChartProps> = ({ data, loading, error }) => {
  if (loading) {
    return <div className="rounded-2xl shadow-md p-6 bg-white animate-pulse h-64" />
  }
  if (error) {
    return (
      <div className="rounded-2xl shadow-md p-6 bg-white">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    )
  }
  if (!data) return null

  const counts: Record<string, number> = { Green: 0, Amber: 0, Red: 0 }
  for (const issue of data.data.issues) counts[issue.rag]++
  const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }))

  return (
    <div className="rounded-2xl shadow-md p-6 bg-white">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">RAG Status Distribution</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={false}
          >
            {chartData.map(entry => (
              <Cell key={entry.name} fill={RAG_COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RAGStatusChart
