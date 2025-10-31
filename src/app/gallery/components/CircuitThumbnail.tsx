import React from 'react'

type Props = {
  title: string
  description?: string
  gateCount?: number
  qubitCount?: number
  onClick?: () => void
}

export default function CircuitThumbnail({ title, description, gateCount, qubitCount, onClick }: Props) {
  return (
    <div 
      className="rounded-lg p-3 bg-bg-card border border-slate-800 hover:border-primary cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="h-24 bg-slate-900/10 rounded flex items-center justify-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-slate-600">
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="6" y="8" width="8" height="2" rx="1" fill="currentColor" />
          <rect x="6" y="11" width="8" height="2" rx="1" fill="currentColor" />
          <rect x="6" y="14" width="8" height="2" rx="1" fill="currentColor" />
        </svg>
      </div>
      <div className="mt-2">
        <div className="text-xs text-slate-200 font-medium truncate">{title}</div>
        {description && <div className="text-[10px] text-slate-400 truncate">{description}</div>}
        {(gateCount !== undefined || qubitCount !== undefined) && (
          <div className="text-[10px] text-slate-500 mt-1">
            {qubitCount ? `${qubitCount}q` : ''} {gateCount ? `${gateCount}g` : ''}
          </div>
        )}
      </div>
    </div>
  )
}
