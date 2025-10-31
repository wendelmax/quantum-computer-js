import React from 'react'
import type { Circuit, Gate } from '../hooks/useCircuitEngine'

interface QubitTimelineProps {
  circuit: Circuit
}

// TODO: Add timeline scrolling for long circuits
const QubitTimeline = ({ circuit }: QubitTimelineProps) => {
  const byQubit: Record<number, Gate[]> = {}
  circuit.gates.forEach(p => {
    if (!byQubit[p.target]) byQubit[p.target] = []
    byQubit[p.target].push(p)
    if (p.type === 'CNOT' && p.control != null) {
      if (!byQubit[p.control]) byQubit[p.control] = []
      byQubit[p.control].push({ ...p, type: 'CNOT-ctrl' })
    }
  })
  return (
    <div className="rounded-lg p-4 bg-[#021825] border border-slate-800">
      <h3 className="text-sm font-medium mb-3">Qubit Timeline</h3>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {Array.from({ length: circuit.numQubits }, (_, i) => i).map(q => {
          const gates = byQubit[q] || []
          return (
            <div key={q} className="flex items-center gap-2 text-xs">
              <div className="w-8 text-slate-400">q{q}</div>
              <div className="flex-1 flex items-center gap-1 flex-wrap">
                {gates.length ? (
                  gates.map((p, idx) => (
                    <div key={idx} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sky-300">
                      {p.type === 'CNOT-ctrl' ? '●' : p.type}
                      {p.angle != null ? `(${(p.angle * 180 / Math.PI).toFixed(0)}°)` : ''}
                    </div>
                  ))
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default QubitTimeline


