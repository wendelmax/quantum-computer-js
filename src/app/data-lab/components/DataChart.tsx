import React from 'react'

interface DataChartProps {
  data: number[][]
  selectedColumns?: number[]
}

const DataChart = ({ data, selectedColumns = [0] }: DataChartProps) => {
  if (data.length === 0) {
    return (
      <div className="p-8 bg-slate-900/20 border border-slate-800 rounded text-center text-slate-500">
        No data to display
      </div>
    )
  }

  const maxValues = selectedColumns.map(col => Math.max(...data.map(row => Math.abs(row[col] || 0))))
  const maxValue = Math.max(...maxValues, 1)

  return (
    <div className="p-4 bg-bg-card border border-slate-800 rounded">
      <h4 className="text-sm font-medium mb-3">Data Visualization</h4>
      <div className="h-48 bg-slate-900/20 rounded overflow-hidden relative">
        <div className="absolute inset-0 flex items-end gap-1 p-2">
          {data.slice(0, 100).map((row, i) => (
            <div key={i} className="flex-1 flex items-end gap-0.5" style={{ minWidth: '4px' }}>
              {selectedColumns.map((col, ci) => {
                const value = row[col] || 0
                const height = (value / maxValue) * 100
                const colors = ['bg-sky-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500']
                return (
                  <div
                    key={ci}
                    className={`flex-1 ${colors[ci % colors.length]} opacity-60`}
                    style={{ height: `${Math.max(2, height)}%` }}
                    title={`Row ${i}: ${value.toFixed(2)}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-700" />
        <div className="absolute top-0 right-0 p-2">
          <div className="text-xs text-slate-500">{maxValue.toFixed(2)}</div>
        </div>
        <div className="absolute bottom-0 left-0 p-2">
          <div className="text-xs text-slate-500">0</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-400">
        Showing {Math.min(100, data.length)} of {data.length} rows
      </div>
    </div>
  )
}

export default DataChart

