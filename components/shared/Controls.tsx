'use client'
import React from 'react'
import clsx from 'clsx'

// ─── Slider ───────────────────────────────────────────────────────────────────
interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}
export function Slider({ label, value, min, max, step = 1, unit = '', onChange }: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-ink-600">{label}</label>
        <span className="text-xs font-semibold text-ink-800 tabular-nums">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full bg-ink-200 accent-brand-600 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-ink-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
interface ToggleProps {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}
export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer gap-3 py-0.5">
      <span className="text-xs font-medium text-ink-600">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
          checked ? 'bg-brand-600' : 'bg-ink-300'
        )}
      >
        <span className={clsx(
          'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200',
          checked ? 'translate-x-4' : 'translate-x-0'
        )} />
      </button>
    </label>
  )
}

// ─── SelectGroup ──────────────────────────────────────────────────────────────
interface SelectGroupProps<T extends string> {
  label?: string
  value: T
  options: { value: T; label: string; labelSub?: string }[]
  onChange: (v: T) => void
  columns?: 2 | 3 | 4
}
export function SelectGroup<T extends string>({
  label, value, options, onChange, columns = 2
}: SelectGroupProps<T>) {
  const gridCols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[columns]
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-ink-600">{label}</label>}
      <div className={clsx('grid gap-1.5', gridCols)}>
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={clsx(
              'py-2 px-2 rounded-lg text-xs font-medium border transition-all duration-150 text-center leading-tight',
              value === opt.value
                ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                : 'bg-white border-ink-200 text-ink-600 hover:border-brand-400 hover:text-brand-700'
            )}
          >
            <span className="block">{opt.label}</span>
            {opt.labelSub && (
              <span className={clsx(
                'block text-[10px] mt-0.5',
                value === opt.value ? 'text-brand-100' : 'text-ink-400'
              )}>{opt.labelSub}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400 mt-4 mb-2 first:mt-0">
      {children}
    </p>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider() {
  return <hr className="border-ink-100 my-1" />
}

// ─── PrimaryButton ────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  fullWidth?: boolean
}
export function Button({
  children, variant = 'primary', size = 'md', icon, fullWidth, className, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        size === 'sm'  && 'text-xs px-3 py-2',
        size === 'md'  && 'text-sm px-4 py-2.5',
        size === 'lg'  && 'text-base px-6 py-3',
        variant === 'primary'   && 'bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.98] shadow-sm',
        variant === 'secondary' && 'bg-ink-50 text-ink-700 border border-ink-200 hover:bg-ink-100 active:scale-[0.98]',
        variant === 'ghost'     && 'text-ink-600 hover:bg-ink-100 active:scale-[0.98]',
        fullWidth && 'w-full',
        className
      )}
    >
      {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
      {children}
    </button>
  )
}
