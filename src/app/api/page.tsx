import React, { useState, useRef, useEffect } from 'react'
import { runSimulation } from '../circuits/services/simulator'
import type { Circuit, Gate, ExecutionResult } from '../circuits/hooks/useCircuitEngine'
import Card from '../../components/Card'

type Command = {
  input: string
  output: any
  type: 'success' | 'error' | 'info'
}

const EXAMPLES = [
  {
    name: 'Bell State',
    description: 'Creates entangled Bell state |00⟩ + |11⟩',
    code: `const circuit = { 
  numQubits: 2, 
  gates: [
    { type: 'H', target: 0 }, 
    { type: 'CNOT', target: 1, control: 0 }
  ] 
}
await runSimulation(circuit)`
  },
  {
    name: 'Superposition',
    description: 'Creates 50/50 superposition',
    code: `const circuit = { 
  numQubits: 1, 
  gates: [{ type: 'H', target: 0 }] 
}
await runSimulation(circuit)`
  },
  {
    name: 'Rotation Gate',
    description: 'Rotates qubit around X-axis',
    code: `const circuit = { 
  numQubits: 1, 
  gates: [{ type: 'RX', target: 0, angle: Math.PI/2 }] 
}
await runSimulation(circuit)`
  },
  {
    name: 'Grover Search',
    description: 'Grover algorithm with 3 qubits',
    code: `const circuit = {
  numQubits: 3,
  gates: [
    { type: 'H', target: 0 }, 
    { type: 'H', target: 1 },
    { type: 'X', target: 2 }, 
    { type: 'H', target: 2 },
    { type: 'CNOT', target: 2, control: 1 },
    { type: 'CNOT', target: 2, control: 0 },
    { type: 'H', target: 2 }
  ]
}
await runSimulation(circuit)`
  },
  {
    name: 'Multiple Gates',
    description: 'Chain of Pauli gates',
    code: `const circuit = {
  numQubits: 2,
  gates: [
    { type: 'X', target: 0 },
    { type: 'Y', target: 1 },
    { type: 'Z', target: 0 }
  ]
}
const result = await runSimulation(circuit)
console.log('Probabilities:', result.probabilities)
console.log('State vector:', result.stateVector)
result`
  }
]

export default function APIPage() {
  const [history, setHistory] = useState<Command[]>([
    { input: '', output: 'Quantum Computer JS API\nType your code or select an example to begin', type: 'info' }
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) {
      return
    }

    setIsProcessing(true)
    setHistory(prev => [...prev, { input: cmd, output: null, type: 'success' }])
    
    try {
      const result = await (async () => {
        const runSimulation = (await import('../circuits/services/simulator')).runSimulation
        
        const func = new Function('runSimulation', 'Math', `
          return (async () => {
            ${cmd}
          })()
        `)
        
        return func(runSimulation, Math)
      })()

      // Format output
      let formattedOutput: any = result
      if (typeof result === 'object' && result !== null) {
        formattedOutput = JSON.stringify(result, null, 2)
      } else if (result !== undefined) {
        formattedOutput = String(result)
      } else {
        formattedOutput = 'undefined'
      }

      setHistory(prev => {
        const newHistory = [...prev]
        newHistory[newHistory.length - 1] = { input: cmd, output: formattedOutput, type: 'success' }
        return newHistory
      })
    } catch (error: any) {
      setHistory(prev => {
        const newHistory = [...prev]
        newHistory[newHistory.length - 1] = { input: cmd, output: error.message, type: 'error' }
        return newHistory
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isProcessing) {
      executeCommand(input)
      setInput('')
    }
  }

  const loadExample = (example: string) => {
    setInput(example)
  }

  const clearHistory = () => {
    setHistory([{ input: '', output: 'Terminal cleared', type: 'info' }])
  }

  return (
    <div className="p-6 grid grid-cols-12 gap-4">
      <div className="col-span-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Quantum API</h2>
            <p className="text-xs text-slate-400 mt-1">Interactive REPL for quantum circuit programming</p>
          </div>
          <button
            onClick={clearHistory}
            className="px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded hover:border-sky-600 transition-colors"
          >
            Clear
          </button>
        </div>

        <Card className="flex flex-col" style={{ minHeight: '550px' }}>
          <div 
            ref={terminalRef}
            className="flex-1 bg-black rounded-lg p-4 font-mono text-sm overflow-y-auto"
            style={{ minHeight: '450px' }}
          >
            {history.map((cmd, idx) => (
              <div key={idx} className="mb-3">
                {cmd.input && (
                  <div className="text-cyan-400 mb-1">
                    <span className="text-slate-600">&gt;</span> {cmd.input}
                  </div>
                )}
                {cmd.output && (
                  <div className={cmd.type === 'error' ? 'text-red-400' : cmd.type === 'info' ? 'text-slate-500' : 'text-green-400 whitespace-pre-wrap'}>
                    {cmd.output}
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="text-yellow-400">Processing...</div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-3 border-t border-slate-800 pt-3">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter quantum circuit code..."
                className="flex-1 px-3 py-2 bg-black border border-slate-700 rounded font-mono text-sm focus:outline-none focus:border-sky-600 resize-none"
                disabled={isProcessing}
                rows={2}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded transition-colors disabled:opacity-50 h-fit self-end"
                disabled={isProcessing || !input.trim()}
              >
                Execute
              </button>
            </div>
          </form>
        </Card>

        <Card title="Quick Reference">
          <div className="text-xs space-y-2 font-mono text-slate-300">
            <div>
              <span className="text-green-400">runSimulation(circuit)</span> - Run simulation
            </div>
            <div>
              <span className="text-blue-400">circuit =</span> {'{'}{' '}
              numQubits, gates: Gate[] {'}'}
            </div>
            <div>
              <span className="text-yellow-400">Gate =</span> {'{'}{' '}
              type, target, control?, angle? {'}'}
            </div>
            <div>
              <span className="text-purple-400">console.log(...)</span> - Debug output
            </div>
          </div>
        </Card>
      </div>

      <div className="col-span-4 flex flex-col gap-4">
        <Card title="Code Examples">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {EXAMPLES.map((example, idx) => (
              <button
                key={idx}
                onClick={() => loadExample(example.code)}
                className="w-full text-left p-3 bg-slate-900/30 border border-slate-800 rounded hover:border-sky-600 transition-colors"
              >
                <div className="text-xs font-medium text-slate-200">{example.name}</div>
                <div className="text-[10px] text-slate-400 mt-1">{example.description}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Available Gates">
          <div className="text-xs space-y-1 text-slate-300">
            <div><span className="text-sky-400 font-bold">H</span> - Hadamard (superposition)</div>
            <div><span className="text-sky-400 font-bold">X</span> - Pauli-X (NOT/Bit flip)</div>
            <div><span className="text-sky-400 font-bold">Y</span> - Pauli-Y (bit+phase flip)</div>
            <div><span className="text-sky-400 font-bold">Z</span> - Pauli-Z (Phase flip)</div>
            <div><span className="text-sky-400 font-bold">CNOT</span> - Controlled NOT</div>
            <div><span className="text-sky-400 font-bold">RX(θ)</span> - Rotation X-axis</div>
            <div><span className="text-sky-400 font-bold">RY(θ)</span> - Rotation Y-axis</div>
            <div><span className="text-sky-400 font-bold">RZ(θ)</span> - Rotation Z-axis</div>
          </div>
        </Card>

        <Card title="Return Value">
          <div className="text-xs text-slate-300 space-y-2">
            <div>
              Returns object with:
            </div>
            <div className="ml-2 space-y-1">
              <div>• <code className="text-green-400">probabilidades</code> - {'{'}{'string: number'}{'}'}</div>
              <div>• <code className="text-blue-400">vetorEstado</code> - number[]</div>
            </div>
          </div>
        </Card>

        <Card title="Tips">
          <div className="text-xs text-slate-300 space-y-2">
            <div>• Use <code className="px-1 py-0.5 bg-slate-900 rounded">Math.PI</code> for angles</div>
            <div>• Use <code className="px-1 py-0.5 bg-slate-900 rounded">await</code> for async</div>
            <div>• Use <code className="px-1 py-0.5 bg-slate-900 rounded">console.log</code> for debug</div>
            <div>• Access last result with return</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
