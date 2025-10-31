import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const styles: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-sky-600 text-black hover:bg-sky-500',
  secondary: 'border border-slate-700 hover:border-sky-600',
  ghost: 'hover:bg-slate-800/40',
}

export default function Button({ variant = 'primary', className = '', ...resto }: Props) {
  return (
    <button
      className={`px-3 py-2 rounded transition-colors ${styles[variant]} ${className}`}
      {...resto}
    />
  )
}


