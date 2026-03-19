import React, { useRef, useEffect } from 'react'

export interface FilterOptions {
  status: string[]
  priority: string[]
  sprint: string[]
  rag: string[]
}

interface FiltersProps {
  filters: FilterOptions
  onChange: (filters: FilterOptions) => void
  totalIssues?: number
  filteredIssues?: number
}

const STATUS_OPTIONS = ['Open', 'In Progress', 'Blocked', 'Done']
const PRIORITY_OPTIONS = ['Critical', 'High', 'Medium', 'Low']
const RAG_OPTIONS = ['Red', 'Amber', 'Green']

const STATUS_COLORS: Record<string, string> = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Blocked: 'bg-red-100 text-red-700',
  Done: 'bg-green-100 text-green-700',
}

const PRIORITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-gray-100 text-gray-600',
}

const RAG_DOT: Record<string, string> = {
  Red: 'bg-red-500',
  Amber: 'bg-amber-400',
  Green: 'bg-green-500',
}

interface DropdownProps {
  label: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
  renderOption?: (value: string) => React.ReactNode
}

const FilterDropdown: React.FC<DropdownProps> = ({
  label, options, selected, onToggle, onClear, renderOption,
}) => {
  const [open, setOpen] = React.useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isActive = selected.length > 0

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm font-medium transition-colors select-none
          ${isActive
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'
          }`}
      >
        {label}
        {isActive && (
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold bg-blue-600 text-white rounded-full">
            {selected.length}
          </span>
        )}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-lg py-1">
          {isActive && (
            <button
              onClick={() => { onClear(); setOpen(false) }}
              className="w-full text-left px-3 py-1.5 text-xs text-blue-600 hover:bg-gray-50 border-b border-gray-100 mb-0.5"
            >
              Clear
            </button>
          )}
          {options.map(opt => (
            <label
              key={opt}
              className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-50 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onToggle(opt)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 shrink-0"
              />
              {renderOption ? renderOption(opt) : opt}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

const Filters: React.FC<FiltersProps> = ({
  filters, onChange, totalIssues, filteredIssues,
}) => {
  const toggleFilter = (category: keyof FilterOptions, value: string) => {
    const current = filters[category]
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onChange({ ...filters, [category]: updated })
  }

  const clearCategory = (category: keyof FilterOptions) => onChange({ ...filters, [category]: [] })
  const clearAll = () => onChange({ ...filters, status: [], priority: [], rag: [] })

  const hasActiveFilters =
    filters.status.length > 0 || filters.priority.length > 0 ||
    filters.rag.length > 0

  const activeChips = [
    ...filters.status.map(v => ({ label: v, category: 'status' as const, value: v })),
    ...filters.priority.map(v => ({ label: v, category: 'priority' as const, value: v })),
    ...filters.rag.map(v => ({ label: v, category: 'rag' as const, value: v })),
  ]

  return (
    <div className="bg-white rounded-2xl shadow-md px-4 py-3 mb-6">
      {/* Filter bar */}
      <div className="flex items-center flex-wrap gap-2">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 mr-1 shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
        </span>

        <FilterDropdown
          label="Status"
          options={STATUS_OPTIONS}
          selected={filters.status}
          onToggle={v => toggleFilter('status', v)}
          onClear={() => clearCategory('status')}
          renderOption={v => (
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[v]}`}>{v}</span>
          )}
        />

        <FilterDropdown
          label="Priority"
          options={PRIORITY_OPTIONS}
          selected={filters.priority}
          onToggle={v => toggleFilter('priority', v)}
          onClear={() => clearCategory('priority')}
          renderOption={v => (
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[v]}`}>{v}</span>
          )}
        />

        <FilterDropdown
          label="Health"
          options={RAG_OPTIONS}
          selected={filters.rag}
          onToggle={v => toggleFilter('rag', v)}
          onClear={() => clearCategory('rag')}
          renderOption={v => (
            <span className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${RAG_DOT[v]}`} />
              {v}
            </span>
          )}
        />



        {hasActiveFilters && totalIssues !== undefined && filteredIssues !== undefined && (
          <>
            <span className="text-gray-200 text-lg select-none mx-0.5">|</span>
            <span className="text-xs text-gray-500 shrink-0">
              {filteredIssues} of {totalIssues}
            </span>
          </>
        )}

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-medium shrink-0"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-100">
          {activeChips.map(chip => (
            <span
              key={`${chip.category}-${chip.value}`}
              className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {chip.label}
              <button
                onClick={() => toggleFilter(chip.category, chip.value)}
                className="w-4 h-4 inline-flex items-center justify-center rounded-full hover:bg-blue-200 text-blue-500 hover:text-blue-700 transition-colors"
                aria-label={`Remove ${chip.label}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default Filters

