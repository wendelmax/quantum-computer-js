import React from 'react'

export default function SidebarDocs({ items, onSelect }: { items: string[]; onSelect: (id: string)=>void }) {
  return (
    <aside className="w-56 border-r border-slate-800">
      <ul className="text-sm">
        {items.map(i => (
          <li key={i}>
            <button className="w-full text-left px-3 py-2 hover:text-primary" onClick={()=> onSelect(i)}>{i}</button>
          </li>
        ))}
      </ul>
    </aside>
  )
}


