import React from 'react'
import CircuitCanvas from './components/CircuitCanvas'
import GatePanel from './components/GatePanel'
import { getPreset } from '../algorithms/services/presets'
import AlgorithmsInline from './components/AlgorithmsInline'
import StateViewer from './components/StateViewer'
import CircuitControls from './components/CircuitControls'
import QubitTimeline from './components/QubitTimeline'
import { useCircuitEngine } from './hooks/useCircuitEngine'
import { useCircuitPrefs } from '../CircuitPrefs'

export default function CircuitsPage() {
  const { numQubits } = useCircuitPrefs()
  const engine = useCircuitEngine(numQubits)
  const [selectedGate, setSelectedGate] = React.useState<string | undefined>(undefined)
  React.useEffect(() => {
    const loadCircuit = async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
      try {
        const raw = localStorage.getItem('quantum:loadCircuit')
        if (raw) {
          const parsed = JSON.parse(raw)
            engine.replaceCircuit(parsed)
          localStorage.removeItem('quantum:loadCircuit')
          const ar = localStorage.getItem('quantum:autoRun')
          if (ar === '1') {
            engine.executar()
            localStorage.removeItem('quantum:autoRun')
          }
        }
      } catch {}
    }
    loadCircuit()
  }, [])

  React.useEffect(() => {
    let isMounted = true
    const handler = (e: any) => {
      const detail = e?.detail
      if (detail?.circuit && isMounted) {
        engine.replaceCircuit(detail.circuit)
        if (detail.autoRun) engine.execute()
      }
    }
    window.addEventListener('quantum:set-circuit' as any, handler)
    return () => {
      isMounted = false
      window.removeEventListener('quantum:set-circuit' as any, handler)
    }
  }, [])
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Quantum Studio</h2>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 flex flex-col gap-4">
          <CircuitCanvas circuit={engine.circuit} selectedGate={selectedGate} onPlace={(g, target)=> engine.addGate(g, target)} onRemove={(target, idx)=> engine.removeGateAt(target, idx)} onMove={(fromTarget, fromIdx, toTarget, toIdx)=> engine.moveGate(fromTarget, fromIdx, toTarget, toIdx)} />
          <QubitTimeline circuit={engine.circuit} />
        </div>
        <div className="col-span-4 flex flex-col gap-4">
          <GatePanel
            numQubits={numQubits}
            onAdd={(g, target, angle, control)=> engine.addGate(g, target, angle, control)}
            onSelect={(g)=> setSelectedGate(g)}
            initialStates={engine.circuit.initialStates}
            onSetInitialState={engine.setInitialState}
          />
          <AlgorithmsInline onLoadAlgorithm={(id, autoRun)=> {
            const preset = getPreset(id)
            engine.replaceCircuit(preset)
            try {
              localStorage.setItem('quantum:circuit', JSON.stringify(preset))
              localStorage.setItem('quantum:prefs:numQubits', String(preset.numQubits))
            } catch {}
            if (autoRun) engine.execute()
          }} />
          <StateViewer
            probabilities={engine.result?.probabilities}
            processing={engine.isProcessing}
            stateVector={engine.result?.stateVector}
            numQubits={numQubits}
          />
          <CircuitControls onRun={engine.execute} onReset={engine.reset} circuitJSON={JSON.stringify(engine.circuit)} onImport={(txt)=> {
            try { const parsed = JSON.parse(txt); engine.replaceCircuit(parsed) } catch {}
          }} />
        </div>
      </div>
    </div>
  )
}
