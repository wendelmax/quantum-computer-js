import React, { useMemo, useState } from 'react'
import { useCircuitPrefs } from '../../../app/CircuitPrefs'
import Button from '../../../components/Button'

const GATES = ['H','X','Y','Z','CNOT','RX','RY','RZ']

type Props = {
  numQubits: number
  onAdd: (gate: string, alvo: number, angulo?: number) => void
  onSelect?: (gate: string) => void
  initialStates?: Record<number, '0' | '1'>
  onSetInitialState?: (qubit: number, state: '0' | '1') => void
}

export default function GatePanel({ numQubits, onAdd, onSelect, initialStates, onSetInitialState }: Props) {
  const prefs = useCircuitPrefs()
  const [selecionada, setSelecionada] = useState<string>('H')
  const [alvo, setAlvo] = useState<number>(0)
  const [angulo, setAngulo] = useState<number>(0)
  const [controle, setControle] = useState<number>(0)
  const requerAngulo = useMemo(() => ['RX','RY','RZ'].includes(selecionada), [selecionada])
  const requerControle = selecionada === 'CNOT'

  return (
    <div className="rounded-lg p-4 bg-[#021825] border border-slate-800">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium">Gates</h3>
        <label className="text-xs text-slate-300 flex items-center gap-2">
          Qubits
          <select value={prefs.numQubits} onChange={(e)=> prefs.setNumQubits(parseInt(e.target.value))} className="bg-bg border border-slate-700 rounded px-2 py-1">
            {Array.from({length:16},(_,i)=> i+1).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {GATES.map(g => (
          <Button key={g} variant={selecionada===g? 'primary':'secondary'} onClick={()=> { setSelecionada(g); onSelect?.(g) }}>{g}</Button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-slate-300">Target qubit</span>
          <select value={alvo} onChange={(e)=> setAlvo(parseInt(e.target.value))} className="bg-bg border border-slate-700 rounded px-2 py-1">
            {Array.from({length:numQubits},(_,i)=> i).map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </label>
        {requerControle ? (
          <label className="flex flex-col gap-1">
            <span className="text-slate-300">Control qubit</span>
            <select value={controle} onChange={(e)=> setControle(parseInt(e.target.value))} className="bg-bg border border-slate-700 rounded px-2 py-1">
              {Array.from({length:numQubits},(_,i)=> i).filter(i => i !== alvo).map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </label>
        ) : <div />}
        {requerAngulo ? (
          <label className="flex flex-col gap-1">
            <span className="text-slate-300">Angle (rad)</span>
            <input type="range" min="-3.14" max="3.14" step="0.01" value={angulo} onChange={(e)=> setAngulo(parseFloat(e.target.value))} />
            <span className="text-xs text-slate-400">{angulo.toFixed(2)}</span>
          </label>
        ) : <div />}
      </div>
      <div className="mt-3">
        <Button onClick={()=> onAdd(selecionada, alvo, requerAngulo ? angulo : undefined, requerControle ? controle : undefined)}>Add</Button>
      </div>
      {onSetInitialState && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <h4 className="text-xs text-slate-300 mb-2">Initial States</h4>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({length:numQubits},(_,i)=> i).map(q => (
              <label key={q} className="flex flex-col gap-1 text-xs">
                <span className="text-slate-400">q{q}</span>
                <select
                  value={initialStates?.[q] || '0'}
                  onChange={(e)=> onSetInitialState(q, e.target.value as '0' | '1')}
                  className="bg-bg border border-slate-700 rounded px-2 py-1"
                >
                  <option value="0">|0⟩</option>
                  <option value="1">|1⟩</option>
                </select>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


