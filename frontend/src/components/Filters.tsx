import React from 'react'

export interface FilterOptions {
  status: string[]
  priority: string[]
  sprint: string[]
  rag: string[]
}

interface FiltersProps {
  filters: FilterOptions
  onChange: (filters: FilterOptions) => void
  availableSprints: string[]
  totalIssues?: number
  filteredIssues?: number
}

const STATUS_OPTIONS = ['Open', 'In Progress', 'Blocked', 'Done']
const PRIORITY_OPTIONS = ['Critical', 'High', 'Medium', 'Low']
const RAG_OPTIONS = ['Red', 'Amber', 'Green']

const Filters: React.FC<FiltersProps> = ({ 
  filters, 
  onChange, 
  availableSprints,
  totalIssues,
  filteredIssues 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true)

  const toggleFilter = (category: keyof FilterOptions, value: string) => {
    const current = filters[category]
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    
    onChange({ ...filters, [category]: updated })
  }

  const clearAll = () => {
    onChange({ status: [], priority: [], sprint: [], rag: [] })
  }

  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.priority.length > 0 || 
    filters.sprint.length > 0 || 
    filters.rag.length > 0

  const showCount = totalIssues !== undefined && filteredIssues !== undefined

  return (
    <div className="rounded-2xl shadow-md bg-white mb-6">
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Filters
            {hasActiveFilters && !isExpanded && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                {filters.status.length + filters.priority.length + filters.sprint.length + filters.rag.length}
              </span>
            )}
          </button>
          {showCount && hasActiveFilters && (
            <span className="text-sm text-gray-500">
              Showing {filteredIssues} of {totalIssues} issues
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="px-6 pb-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Status Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Status</h3>
          <div className="space-y-2">
            {STATUS_OPTIONS.map(status => (
              <label key={status} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => toggleFilter('status', status)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  {status}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Priority</h3>
          <div className="space-y-2">
            {PRIORITY_OPTIONS.map(priority => (
              <label key={priority} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.priority.includes(priority)}
                  onChange={() => toggleFilter('priority', priority)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  {priority}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sprint Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Sprint</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {availableSprints.map(sprint => (
              <label key={sprint} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.sprint.includes(sprint)}
                  onChange={() => toggleFilter('sprint', sprint)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
                  {sprint}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* RAG Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Health Status</h3>
          <div className="space-y-2">
            {RAG_OPTIONS.map(rag => (
              <label key={rag} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.rag.includes(rag)}
                  onChange={() => toggleFilter('rag', rag)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span
                  className={`ml-2 text-sm font-medium ${
                    rag === 'Red' ? 'text-red-600' : 
                    rag === 'Amber' ? 'text-amber-600' : 
                    'text-green-600'
                  }`}
                >
                  {rag}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.status.map(s => (
              <span
                key={`status-${s}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                Status: {s}
                <button
                  onClick={() => toggleFilter('status', s)}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.priority.map(p => (
              <span
                key={`priority-${p}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                Priority: {p}
                <button
                  onClick={() => toggleFilter('priority', p)}
                  className="ml-1 hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.sprint.map(s => (
              <span
                key={`sprint-${s}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {s}
                <button
                  onClick={() => toggleFilter('sprint', s)}
                  className="ml-1 hover:text-green-900"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.rag.map(r => (
              <span
                key={`rag-${r}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {r}
                <button
                  onClick={() => toggleFilter('rag', r)}
                  className="ml-1 hover:text-gray-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
        </div>
      )}

      {/* Show active filter badges even when collapsed */}
      {!isExpanded && hasActiveFilters && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {filters.status.map(s => (
              <span
                key={`status-${s}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                Status: {s}
                <button
                  onClick={() => toggleFilter('status', s)}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.priority.map(p => (
              <span
                key={`priority-${p}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                Priority: {p}
                <button
                  onClick={() => toggleFilter('priority', p)}
                  className="ml-1 hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.sprint.map(s => (
              <span
                key={`sprint-${s}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {s}
                <button
                  onClick={() => toggleFilter('sprint', s)}
                  className="ml-1 hover:text-green-900"
                >
                  ×
                </button>
              </span>
            ))}
            {filters.rag.map(r => (
              <span
                key={`rag-${r}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {r}
                <button
                  onClick={() => toggleFilter('rag', r)}
                  className="ml-1 hover:text-gray-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Filters
