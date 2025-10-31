import React, { useState } from 'react'
import DataUploader from './components/DataUploader'
import DatasetViewer from './components/DatasetViewer'
import QuantumMappingPanel from './components/QuantumMappingPanel'
import DataChart from './components/DataChart'
import AdvancedStats from './components/AdvancedStats'
import QuantumStatePreview from './components/QuantumStatePreview'
import SampleDatasetSelector from './components/SampleDatasetSelector'
import DataExporter from './components/DataExporter'
import Card from '../../components/Card'
import Button from '../../components/Button'

export default function DataLabPage() {
  const [rows, setRows] = useState<string[][]>([])
  const [normRows, setNormRows] = useState<number[][]>([])
  const [stats, setStats] = useState<{min: number, max: number, mean: number} | null>(null)
  const [numQubits, setNumQubits] = useState(2)
  const [mappingMode, setMappingMode] = useState<'amplitude' | 'angle'>('amplitude')
  
  React.useEffect(()=>{
    try { localStorage.setItem('quantum:datalab:raw', JSON.stringify(rows)) } catch{}
    if (normRows.length > 0) {
      const allNums = normRows.flat()
      const min = Math.min(...allNums)
      const max = Math.max(...allNums)
      const mean = allNums.reduce((a,b) => a+b, 0) / allNums.length
      setStats({ min, max, mean })
    }
  }, [rows, normRows])
  
  React.useEffect(()=>{
    try {
      const raw = localStorage.getItem('quantum:datalab:raw')
      if (raw) setRows(JSON.parse(raw))
    } catch{}
  }, [])

  async function normalizeInWorker(input: string[][]) {
    const w = new Worker(new URL('../../workers/dataWorker.ts', import.meta.url), { type: 'module' })
    const out: number[][] = await new Promise((resolve, reject)=>{
      const onMsg = (e: MessageEvent)=>{
        const d = e.data
        if (d && d.ok) { w.removeEventListener('message', onMsg); resolve(d.rows) }
        else if (d && d.error) { w.removeEventListener('message', onMsg); reject(new Error(d.error)) }
      }
      w.addEventListener('message', onMsg)
      w.postMessage({ type: 'normalize', rows: input })
    })
    setNormRows(out)
  }

  const exportToQuantum = () => {
    if (normRows.length === 0) return
    try {
      const circuit = {
        numQubits: Math.max(2, Math.ceil(Math.log2(normRows.length))),
        portas: normRows.slice(0, 20).map((row, i) => ({
          tipo: mappingMode === 'amplitude' ? 'H' : 'RY',
          alvo: i % numQubits,
          angulo: mappingMode === 'angle' ? (row[0] || 0) * Math.PI : undefined
        }))
      }
      localStorage.setItem('quantum:loadCircuit', JSON.stringify(circuit))
      localStorage.setItem('quantum:circuit', JSON.stringify(circuit))
      window.dispatchEvent(new CustomEvent('quantum:set-circuit', { detail: { circuit, autoRun: false } }))
      window.location.href = '/circuits'
    } catch {}
  }

  return (
    <div className="p-6 grid grid-cols-12 gap-4">
      <div className="col-span-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Data Lab</h2>
          <div className="flex gap-2">
            <DataExporter rawData={rows} normalizedData={normRows} />
            <Button onClick={() => window.location.href = '/circuits'}>Open Quantum Studio</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card title="Upload Dataset" description="Load CSV or TSV files">
            <DataUploader onLoad={(r)=> { setRows(r); normalizeInWorker(r) }} />
          </Card>
          
          <SampleDatasetSelector onLoad={(data) => { setRows(data); normalizeInWorker(data) }} />
        </div>

        {rows.length > 0 && (
          <Card title="Dataset Preview" description={`Showing first ${Math.min(20, rows.length)} rows`}>
            <DatasetViewer data={rows} />
          </Card>
        )}

        {normRows.length > 0 && (
          <>
            <DataChart data={normRows} selectedColumns={[0]} />
            
            {stats && (
              <Card title="Basic Statistics">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">Min</div>
                    <div className="text-2xl font-semibold text-slate-100">{stats.min.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Mean</div>
                    <div className="text-2xl font-semibold text-slate-100">{stats.mean.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Max</div>
                    <div className="text-2xl font-semibold text-slate-100">{stats.max.toFixed(3)}</div>
                  </div>
                </div>
              </Card>
            )}

            <AdvancedStats data={normRows} />
          </>
        )}
      </div>

      <div className="col-span-4 flex flex-col gap-4">
        <QuantumMappingPanel 
          numQubits={numQubits}
          mappingMode={mappingMode}
          onNumQubitsChange={setNumQubits}
          onMappingModeChange={setMappingMode}
        />
        
        {normRows.length > 0 && (
          <>
            <QuantumStatePreview 
              data={normRows} 
              numQubits={numQubits}
              mappingMode={mappingMode}
            />

            <Card title="Quantum Integration">
              <div className="text-xs text-slate-300 mb-3">
                Map your normalized data to quantum states and run computations.
              </div>
              <div className="space-y-2 mb-3">
                <div className="text-xs text-slate-400">
                  {mappingMode === 'amplitude' 
                    ? `Amplitude encoding will create superposition states with ${normRows.length} amplitudes`
                    : `Angle encoding will create rotation gates with ${normRows.length} angles`}
                </div>
                <div className="text-xs text-slate-400">
                  Qubits: {numQubits} (can represent {2**numQubits} states)
                </div>
              </div>
              <Button className="w-full" onClick={exportToQuantum}>
                Create Circuit from Data
              </Button>
            </Card>
          </>
        )}

        {!normRows.length && (
          <Card title="Instructions">
            <div className="text-xs text-slate-300 space-y-2">
              <p>1. Upload a CSV/TSV file or load a sample dataset</p>
              <p>2. Data will be automatically normalized</p>
              <p>3. Configure quantum mapping mode</p>
              <p>4. Preview quantum state encoding</p>
              <p>5. Export to Quantum Studio</p>
            </div>
          </Card>
        )}

        <Card title="About Data Lab">
          <div className="text-xs text-slate-300 space-y-2">
            <p>
              The Data Lab allows you to convert classical data into quantum states, 
              enabling quantum machine learning and data processing.
            </p>
            <p>
              <strong>Supported formats:</strong> CSV, TSV
              <br />
              <strong>Processing:</strong> Automatic normalization
              <br />
              <strong>Mapping:</strong> Amplitude or Angle encoding
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
