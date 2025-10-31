import React, { useState } from 'react'
import Button from '../../../components/Button'
import { getPreset } from '../services/presets'
import { runSimulation } from '../../circuits/services/simulator'

type Props = {
  algorithm: string
}

export default function AlgorithmRunner({ algorithm }: Props) {
  const [ms, setMs] = useState<number>(0)
  const [summary, setSummary] = useState<string>('')
  async function runPreview() {
    const preset = getPreset(algorithm)
    const t0 = performance.now()
    const res = await runSimulation(preset as any)
    const t1 = performance.now()
    setMs(t1 - t0)
    setSummary(`states=${Object.keys(res.probabilities).length}`)
    try {
      window.dispatchEvent(new CustomEvent('quantum:set-circuit', { detail: { circuit: preset, autoRun: true } }))
    } catch {}
  }
  return (
    <div className="p-4 rounded bg-bg-card border border-slate-800">
      <div className="text-sm text-slate-300 mb-2">Runner: <span className="text-slate-100">{algorithm}</span></div>
      <Button onClick={runPreview}>Run</Button>
      <div className="mt-2 text-xs text-slate-400">{summary ? `${summary} • ${ms.toFixed(2)}ms` : ' '}</div>
    </div>
  )
}
