import React from 'react'

function MarkdownViewer({ content }: { content: string }) {
  const parseMarkdown = (md: string) => {
    const lines = md.split('\n')
    const elements: JSX.Element[] = []
    
    let codeBlock = ''
    let inCodeBlock = false
    let listItems: string[] = []
    
    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={idx} className="bg-slate-900 text-sky-300 p-4 rounded-lg my-4 overflow-x-auto text-xs font-mono">
              {codeBlock.trim()}
            </pre>
          )
          codeBlock = ''
          inCodeBlock = false
        } else {
          inCodeBlock = true
        }
        return
      }
      
      if (inCodeBlock) {
        codeBlock += line + '\n'
        return
      }
      
      if (line.trim() === '') {
        if (listItems.length > 0) {
          elements.push(
            <ul key={idx} className="list-disc list-inside my-2 space-y-1">
              {listItems.map((item, i) => {
                const trimmed = item.trim().replace(/^[-*]\s+/, '')
                const processed = processInlineFormatting(trimmed)
                return (
                  <li key={i} className="text-sm text-slate-300">{processed}</li>
                )
              })}
            </ul>
          )
          listItems = []
        }
        elements.push(<br key={idx} />)
        return
      }
      
      if (/^[-*]\s/.test(line)) {
        listItems.push(line)
        return
      }
      
      if (line.startsWith('# ')) {
        elements.push(<h1 key={idx} className="text-3xl font-bold mb-4 mt-6">{line.substring(2)}</h1>)
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={idx} className="text-2xl font-semibold mb-3 mt-4">{line.substring(3)}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={idx} className="text-xl font-semibold mb-2 mt-3">{line.substring(4)}</h3>)
      } else {
        const processedLine = processInlineFormatting(line)
        elements.push(<p key={idx} className="text-sm text-slate-300 leading-relaxed my-2">{processedLine}</p>)
      }
    })
    
    if (listItems.length > 0) {
      elements.push(
        <ul key="final-list" className="list-disc list-inside my-2 space-y-1">
          {listItems.map((item, i) => {
            const trimmed = item.trim().replace(/^[-*]\s+/, '')
            const processed = processInlineFormatting(trimmed)
            return (
              <li key={i} className="text-sm text-slate-300">{processed}</li>
            )
          })}
        </ul>
      )
    }
    
    if (inCodeBlock) {
      elements.push(
        <pre key="final-code" className="bg-slate-900 text-sky-300 p-4 rounded-lg my-4 overflow-x-auto text-xs font-mono">
          {codeBlock.trim()}
        </pre>
      )
    }
    
    return elements
  }
  
  const processInlineFormatting = (line: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = []
    let current = line
    let keyCounter = 0
    
    while (current.includes('**')) {
      const before = current.substring(0, current.indexOf('**'))
      current = current.substring(current.indexOf('**') + 2)
      const bold = current.substring(0, current.indexOf('**'))
      current = current.substring(current.indexOf('**') + 2)
      
      if (before) parts.push(before)
      parts.push(<strong key={keyCounter++} className="text-white font-semibold">{bold}</strong>)
    }
    
    if (current) parts.push(current)
    
    return parts
  }

  return (
    <div className="rounded-lg p-6 bg-bg-card border border-slate-800 prose prose-invert max-w-none">
      {parseMarkdown(content)}
    </div>
  )
}

export default MarkdownViewer
