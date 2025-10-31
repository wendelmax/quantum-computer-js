import React from 'react'

export default function DataUploader({ onLoad }: { onLoad: (rows: string[][]) => void }) {
  function parseCsv(text: string): string[][] {
    return text.split(/\r?\n/).filter(Boolean).map(line => line.split(/,|;|\t/))
  }
  return (
    <div className="rounded-lg p-4 bg-bg-card border border-slate-800">
      <div className="text-sm font-medium">Upload CSV</div>
      <input className="mt-3 text-xs" type="file" accept=".csv,.txt" onChange={async (e)=>{
        const file = e.target.files?.[0]
        if (!file) return
        const text = await file.text()
        onLoad(parseCsv(text))
      }} />
    </div>
  )
}
