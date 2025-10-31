import React, { useState } from 'react'
import Button from '../../components/Button'
import Card from '../../components/Card'

type GateInfo = {
  name: string
  symbol: string
  description: string
  category: 'Pauli' | 'Rotation' | 'Two-qubit'
  matrix: string
}

const gates: GateInfo[] = [
  {
    name: 'Hadamard',
    symbol: 'H',
    description: 'Creates superposition of |0⟩ and |1⟩ states',
    category: 'Pauli',
    matrix: '½[1 1; 1 -1]'
  },
  {
    name: 'Pauli-X',
    symbol: 'X',
    description: 'Bit flip (NOT gate), flips |0⟩ to |1⟩ and vice versa',
    category: 'Pauli',
    matrix: '[0 1; 1 0]'
  },
  {
    name: 'Pauli-Y',
    symbol: 'Y',
    description: 'Combination of bit and phase flip',
    category: 'Pauli',
    matrix: '[0 -i; i 0]'
  },
  {
    name: 'Pauli-Z',
    symbol: 'Z',
    description: 'Phase flip, adds π phase to |1⟩ state',
    category: 'Pauli',
    matrix: '[1 0; 0 -1]'
  },
  {
    name: 'CNOT',
    symbol: 'CNOT',
    description: 'Controlled NOT, flips target when control is |1⟩',
    category: 'Two-qubit',
    matrix: '[1 0 0 0; 0 1 0 0; 0 0 0 1; 0 0 1 0]'
  },
  {
    name: 'RX',
    symbol: 'RX',
    description: 'Rotation around X-axis by θ radians',
    category: 'Rotation',
    matrix: '[cos(θ/2) -isin(θ/2); -isin(θ/2) cos(θ/2)]'
  },
  {
    name: 'RY',
    symbol: 'RY',
    description: 'Rotation around Y-axis by θ radians',
    category: 'Rotation',
    matrix: '[cos(θ/2) -sin(θ/2); sin(θ/2) cos(θ/2)]'
  },
  {
    name: 'RZ',
    symbol: 'RZ',
    description: 'Rotation around Z-axis by θ radians',
    category: 'Rotation',
    matrix: '[exp(-iθ/2) 0; 0 exp(iθ/2)]'
  }
]

export default function GatesLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedGate, setSelectedGate] = useState<string | null>(null)

  const categories = ['All', 'Pauli', 'Rotation', 'Two-qubit']
  
  const filteredGates = selectedCategory === 'All' 
    ? gates 
    : gates.filter(g => g.category === selectedCategory)

  const selectedGateInfo = selectedGate ? gates.find(g => g.symbol === selectedGate) : null

  const addToStudio = (symbol: string) => {
    try {
      const raw = localStorage.getItem('quantum:circuit')
      let circuit
      if (raw) {
        circuit = JSON.parse(raw)
      } else {
        const rawPrefs = localStorage.getItem('quantum:prefs:numQubits')
        const numQubits = rawPrefs ? parseInt(rawPrefs) : 2
        circuit = { numQubits, portas: [] }
      }
      const newGate = { tipo: symbol, alvo: 0 }
      circuit.portas.push(newGate)
      localStorage.setItem('quantum:circuit', JSON.stringify(circuit))
      localStorage.setItem('quantum:loadCircuit', JSON.stringify(circuit))
      window.dispatchEvent(new CustomEvent('quantum:set-circuit', { detail: { circuit, autoRun: false } }))
      window.location.href = '/circuits'
    } catch {
      window.location.href = '/circuits'
    }
  }

  return (
    <div className="p-6 grid grid-cols-12 gap-4">
      <div className="col-span-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Gates Library</h2>
          <Button onClick={() => window.location.href = '/circuits'}>Open Quantum Studio</Button>
        </div>

        <Card>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded transition-colors ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-900/20 border border-slate-800 hover:border-sky-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {filteredGates.map(gate => (
            <Card
              key={gate.symbol}
              title={gate.name}
              description={`${gate.symbol} - ${gate.category}`}
            >
              <p className="text-sm text-slate-300 mb-3">{gate.description}</p>
              <div className="text-xs font-mono bg-slate-900/30 p-2 rounded mb-3 text-slate-400">
                Matrix: {gate.matrix}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setSelectedGate(gate.symbol)}>View Details</Button>
                <Button variant="secondary" onClick={() => addToStudio(gate.symbol)}>
                  Add to Circuit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="col-span-4 flex flex-col gap-4">
        <Card title="Selected Gate">
          {selectedGateInfo ? (
            <div className="space-y-3">
              <div className="text-3xl font-bold text-center">{selectedGateInfo.symbol}</div>
              <div className="text-sm text-slate-300">{selectedGateInfo.description}</div>
              <div className="text-xs bg-slate-900/30 p-2 rounded font-mono text-slate-400">
                {selectedGateInfo.matrix}
              </div>
              <Button className="w-full" onClick={() => addToStudio(selectedGateInfo.symbol)}>
                Add to Current Circuit
              </Button>
            </div>
          ) : (
            <div className="text-sm text-slate-400">Click a gate to see details</div>
          )}
        </Card>

        <Card title="Quick Reference">
          <div className="text-xs space-y-2 text-slate-300">
            <div>
              <strong>H:</strong> Superposition gate
            </div>
            <div>
              <strong>X/Y/Z:</strong> Pauli gates
            </div>
            <div>
              <strong>CNOT:</strong> Control target
            </div>
            <div>
              <strong>RX/RY/RZ:</strong> Parametric rotations
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
