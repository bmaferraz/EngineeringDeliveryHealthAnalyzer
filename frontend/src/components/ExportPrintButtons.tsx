import React from 'react'
import type { IssueWithScore } from '../types/api'

interface ExportPrintButtonsProps {
  data: IssueWithScore[]
  filename?: string
}

const ExportPrintButtons: React.FC<ExportPrintButtonsProps> = ({ data, filename = 'dashboard-export' }) => {
  const handlePrint = () => {
    window.print()
  }

  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('No data to export')
      return
    }

    const headers = [
      'Issue ID',
      'Title',
      'Project',
      'Space',
      'Status',
      'Priority',
      'Type',
      'Days Open',
      'Assignee',
      'Fix Version',
      'Health Score',
      'RAG Status',
      'Bottleneck',
      'Bottleneck Reason'
    ]

    const csvRows = [
      headers.join(','),
      ...data.map(issue => [
        issue.issue_id,
        `"${issue.title.replace(/"/g, '""')}"`,
        issue.project,
        issue.space,
        issue.status,
        issue.priority,
        issue.type,
        issue.days_open,
        issue.assignee,
        issue.fix_version,
        issue.health_score,
        issue.rag,
        issue.bottleneck,
        issue.bottleneck_reason ? `"${issue.bottleneck_reason.replace(/"/g, '""')}"` : ''
      ].join(','))
    ]

    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToJSON = () => {
    if (!data || data.length === 0) {
      alert('No data to export')
      return
    }

    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex gap-2 print:hidden">
      <button
        onClick={handlePrint}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        title="Print dashboard"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print
      </button>
      <button
        onClick={exportToCSV}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        title="Export to CSV"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        CSV
      </button>
      <button
        onClick={exportToJSON}
        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
        title="Export to JSON"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        JSON
      </button>
    </div>
  )
}

export default ExportPrintButtons
