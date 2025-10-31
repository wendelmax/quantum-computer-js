import React from 'react'
import Button from '../../../components/Button'

type Props = {
  onSelect?: (porta: string) => void
}

const portas = ['H','X','Y','Z','CNOT','RX','RY','RZ']

export default function GateLibrary({ onSelect }: Props) {
  return (
    <div className="rounded-lg p-4 bg-[#021825] border border-slate-800">
      <h3 className="text-sm font-medium">Gate Library</h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {portas.map((g) => (
          <Button key={g} variant="secondary" onClick={() => onSelect?.(g)}>{g}</Button>
        ))}
      </div>
    </div>
  )
}


