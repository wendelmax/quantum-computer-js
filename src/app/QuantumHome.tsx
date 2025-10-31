import React from 'react'
import { Link } from 'react-router-dom'
import { getPreset } from './algorithms/services/presets'

export default function QuantumHome() {
  const loadAlgorithm = (id: string) => {
    const preset = getPreset(id)
    try {
      localStorage.setItem('quantum:loadCircuit', JSON.stringify(preset))
      localStorage.setItem('quantum:circuit', JSON.stringify(preset))
      localStorage.setItem('quantum:prefs:numQubits', String(preset.numQubits))
    } catch {}
    window.dispatchEvent(new CustomEvent('quantum:set-circuit', { detail: { circuit: preset, autoRun: true } }))
    window.location.href = '/circuits'
  }

  const algorithms = [
    { id: 'grover', name: "Grover's algorithm" },
    { id: 'deutsch-jozsa', name: "Deutsch–Jozsa algorithm" },
    { id: 'shor', name: "Shor's algorithm" },
    { id: 'qft', name: "Quantum Fourier transform" },
    { id: 'qpe', name: "Quantum phase estimation" }
  ]

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-8 space-y-4">
        <section className="rounded-xl p-0 bg-bg-card border border-slate-800/60 overflow-hidden">
          <header className="h-10 px-4 border-b border-slate-800 flex items-center text-sm">
            <div className="flex items-center gap-2"><span className="text-sky-300">◦</span> <span className="font-medium">Quick Start</span></div>
          </header>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <Link to="/circuits" className="p-4 rounded-lg bg-slate-900/20 border border-slate-700 hover:border-sky-600 hover:bg-slate-900/30 transition-colors">
                <div className="text-lg mb-2">🧪</div>
                <div className="font-medium text-sm mb-1">Quantum Studio</div>
                <div className="text-xs text-slate-400">Build circuits</div>
              </Link>
              <Link to="/algorithms" className="p-4 rounded-lg bg-slate-900/20 border border-slate-700 hover:border-sky-600 hover:bg-slate-900/30 transition-colors">
                <div className="text-lg mb-2">📈</div>
                <div className="font-medium text-sm mb-1">Algorithms</div>
                <div className="text-xs text-slate-400">Run algorithms</div>
              </Link>
              <Link to="/data-lab" className="p-4 rounded-lg bg-slate-900/20 border border-slate-700 hover:border-sky-600 hover:bg-slate-900/30 transition-colors">
                <div className="text-lg mb-2">📊</div>
                <div className="font-medium text-sm mb-1">Data Lab</div>
                <div className="text-xs text-slate-400">Explore data</div>
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-xl p-0 bg-bg-card border border-slate-800/60 overflow-hidden">
          <header className="h-10 px-4 border-b border-slate-800 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2"><span className="text-sky-300">◦</span> <span className="font-medium">Popular Algorithms</span></div>
          </header>
          <ul className="divide-y divide-slate-800">
            {algorithms.map(item => (
              <li 
                key={item.id} 
                className="px-4 py-3 text-sm flex items-center justify-between hover:bg-slate-900/20 cursor-pointer"
                onClick={() => loadAlgorithm(item.id)}
              >
                <span className="text-slate-200">{item.name}</span>
                <span className="text-slate-400">›</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl p-3 bg-bg-card border border-slate-800/60">
          <div className="flex items-center gap-3 text-slate-300">
            <Link to="/circuits" className="px-3 py-2 rounded hover:bg-slate-800/40">▭ Quantum Studio</Link>
            <Link to="/algorithms" className="px-3 py-2 rounded hover:bg-slate-800/40">⧉ Algorithms</Link>
            <Link to="/state-viewer" className="px-3 py-2 rounded hover:bg-slate-800/40">⟲ States</Link>
            <Link to="/gates" className="px-3 py-2 rounded hover:bg-slate-800/40">⌗ Gates</Link>
            <Link to="/docs" className="px-3 py-2 rounded hover:bg-slate-800/40">📄 Docs</Link>
          </div>
        </section>
      </div>

      <div className="col-span-4 space-y-4">
        <section className="rounded-xl p-0 bg-bg-card border border-slate-800/60 overflow-hidden">
          <header className="h-10 px-4 border-b border-slate-800 flex items-center text-sm">
            <div className="flex items-center gap-2"><span className="text-sky-300">◦</span> <span className="font-medium">State Viewer</span></div>
          </header>
          <div className="p-4">
            <div className="h-48 rounded-md bg-slate-900/10 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border border-slate-700 relative">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-sky-400" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-0.5 bg-sky-400 origin-left rotate-20" />
              </div>
            </div>
            <div className="mt-2 text-center text-slate-300 text-sm">Qubit State</div>
          </div>
        </section>

        <section className="rounded-xl p-0 bg-bg-card border border-slate-800/60 overflow-hidden">
          <header className="h-10 px-4 border-b border-slate-800 flex items-center text-sm">
            <div className="flex items-center gap-2"><span className="text-sky-300">◦</span> <span className="font-medium">Quantum Data Explorer</span></div>
          </header>
          <div className="p-4 grid grid-cols-3 gap-3">
            <div className="col-span-2 h-28 rounded-md bg-slate-900/10 flex items-end gap-2 p-3">
              {[24,48,40,64,32].map((h,i)=>(
                <div key={i} className="w-6 bg-sky-500/40" style={{height: h}} />
              ))}
            </div>
            <div className="col-span-1 h-28 rounded-md bg-slate-900/10 p-3 text-xs text-slate-300">
              <div className="font-mono leading-5">1 1 0 0<br/>1 0 0 0<br/>1 1 0 0<br/>0 0 0 0</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

