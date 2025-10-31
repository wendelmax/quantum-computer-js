import React from 'react'

interface StateAnalysisProps {
  stateVector: number[]
  probabilities: Record<string, number>
  numQubits: number
}

// TODO: Consider adding state comparison features
const StateAnalysis = ({ stateVector, probabilities, numQubits }: StateAnalysisProps) => {
  if (!stateVector || stateVector.length === 0) {
    return (
      <div className="p-4 bg-bg-card border border-slate-800 rounded">
        <div className="text-xs text-slate-400">No state to analyze</div>
      </div>
    )
  }

  const amplitudes: Array<{ r: number; i: number; prob: number }> = []
  let sumSquared = 0
  for (let i = 0; i < stateVector.length; i += 2) {
    const r = stateVector[i]
    const i_imag = stateVector[i + 1] ?? 0
    const prob = r * r + i_imag * i_imag
    sumSquared += prob
    amplitudes.push({ r, i: i_imag, prob })
  }

  const pureStates = amplitudes.filter(a => a.prob > 0.99)
  const mixedStates = amplitudes.filter(a => a.prob > 1e-6 && a.prob <= 0.99)
  const superposition = amplitudes.filter(a => a.prob > 1e-6).length > 1

  const maxProb = Math.max(...amplitudes.map(a => a.prob))
  const minProb = Math.min(...amplitudes.filter(a => a.prob > 1e-6).map(a => a.prob))
  const entropy = -amplitudes.reduce((acc, a) => {
    if (a.prob > 1e-10) return acc + a.prob * Math.log2(a.prob)
    return acc
  }, 0)

  const isNormalized = Math.abs(sumSquared - 1) < 0.01

  return (
    <div className="p-4 bg-bg-card border border-slate-800 rounded">
      <h4 className="text-sm font-medium mb-3">State Analysis</h4>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-400">Normalized:</span>
            <span className={`ml-2 ${isNormalized ? 'text-green-400' : 'text-red-400'}`}>
              {isNormalized ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Sum:</span>
            <span className="ml-2 font-mono text-slate-200">{sumSquared.toFixed(4)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Superposition:</span>
            <span className={superposition ? 'text-cyan-400' : 'text-slate-500'}>
              {superposition ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Pure states:</span>
            <span className="text-green-400">{pureStates.length}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Mixed states:</span>
            <span className="text-yellow-400">{mixedStates.length}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Max prob:</span>
            <span className="text-sky-400 font-mono">{maxProb.toFixed(4)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Min prob:</span>
            <span className="text-slate-300 font-mono">{minProb.toFixed(4)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Entropy:</span>
            <span className="text-purple-400 font-mono">{entropy.toFixed(4)}</span>
          </div>
        </div>

        {superposition && (
          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs text-cyan-400">
              Quantum superposition detected
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StateAnalysis

