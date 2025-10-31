import React from 'react'

export default function DatasetViewer({ data }: { data: string[][] }) {
  return (
    <div className="rounded-lg p-4 bg-bg-card border border-slate-800 overflow-auto">
      <table className="text-xs w-full">
        <tbody>
          {data.slice(0,20).map((row,i)=> (
            <tr key={i}>
              {row.map((cell,j)=>(<td key={j} className="px-2 py-1 text-slate-200 border-b border-slate-800">{cell}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
