'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Plus, Trash2, GripVertical, Copy, RotateCcw } from 'lucide-react'
import clsx from 'clsx'
import { WorksheetRow } from '@/lib/types'
import { makeRowId } from '@/lib/url-state'
import { UrduKeyboard } from './UrduKeyboard'
import { Analytics } from '@/lib/analytics'

interface TextRowsInputProps {
  rows: WorksheetRow[]
  onChange: (rows: WorksheetRow[]) => void
  onClearAll: () => void
  onUndo: () => void
  hasUndo: boolean
  worksheetTitle: string
  onTitleChange: (title: string) => void
}

export function TextRowsInput({ rows, onChange, onClearAll, onUndo, hasUndo, worksheetTitle, onTitleChange }: TextRowsInputProps) {
  const dragIdx = useRef<number | null>(null)
  const dragOverIdx = useRef<number | null>(null)
  const [activeRowId, setActiveRowId] = useState<string | null>(null)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement>>({})

  function updateRow(id: string, text: string) {
    onChange(rows.map(r => r.id === id ? { ...r, text } : r))
  }

  function addRow(afterIdx?: number) {
    const newRow: WorksheetRow = { id: makeRowId(), text: '' }
    if (afterIdx === undefined) {
      onChange([...rows, newRow])
    } else {
      const next = [...rows]
      next.splice(afterIdx + 1, 0, newRow)
      onChange(next)
    }
  }

  function deleteRow(id: string) {
    if (rows.length <= 1) return
    onChange(rows.filter(r => r.id !== id))
  }

  function duplicateRow(idx: number) {
    const newRow: WorksheetRow = { id: makeRowId(), text: rows[idx].text }
    const next = [...rows]
    next.splice(idx + 1, 0, newRow)
    onChange(next)
  }

  // CRITICAL FIX 7: Auto-resize all textareas when rows change
  useEffect(() => {
    Object.values(textareaRefs.current).forEach(ta => {
      if (ta) {
        ta.style.height = 'auto'
        ta.style.height = ta.scrollHeight + 'px'
      }
    })
  }, [rows])

  function onDragStart(idx: number) { dragIdx.current = idx }
  function onDragEnter(idx: number) { dragOverIdx.current = idx }
  function onDragEnd() {
    const from = dragIdx.current
    const to   = dragOverIdx.current
    if (from === null || to === null || from === to) return
    const next = [...rows]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
    dragIdx.current = null
    dragOverIdx.current = null
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* HIGH FIX 2: Worksheet title field */}
      <div className="flex flex-col gap-1 mb-3 pb-3 border-b border-ink-100">
        <label className="text-xs font-medium text-ink-600">عنوان (Worksheet title)</label>
        <input
          dir="rtl"
          type="text"
          value={worksheetTitle}
          onChange={e => onTitleChange(e.target.value)}
          placeholder="اردو لکھائی مشق"
          className="w-full border border-ink-200 rounded-xl px-3 py-2 text-sm text-right text-ink-800 focus:outline-none focus:border-brand-400 bg-white"
          style={{ fontFamily: '"Jameel Noori Nastaleeq","Noto Nastaliq Urdu",serif' }}
        />
      </div>

      <div className="flex items-center justify-between mb-0.5">
        <label className="text-xs font-medium text-ink-600">متن (Text rows)</label>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-400">{rows.length} row{rows.length !== 1 ? 's' : ''}</span>
          <button
            onClick={onClearAll}
            title="Clear all rows"
            className="text-[10px] text-ink-400 hover:text-red-500 flex items-center gap-0.5 transition-colors"
          >
            <Trash2 size={10} />
            <span>Clear</span>
          </button>
          {hasUndo && (
            <button
              onClick={onUndo}
              title="Undo"
              className="text-[10px] text-ink-400 hover:text-brand-600 flex items-center gap-0.5 transition-colors"
            >
              <RotateCcw size={10} />
              <span>Undo</span>
            </button>
          )}
          <button
            onClick={() => {
            if (!showKeyboard) Analytics.keyboardOpened()
            setShowKeyboard(!showKeyboard)
          }}
            className={clsx(
              'text-[10px] px-2 py-0.5 rounded border transition-colors',
              showKeyboard
                ? 'bg-brand-600 text-white border-brand-600'
                : 'border-ink-300 text-ink-500 hover:border-brand-400'
            )}
          >
            ⌨ اردو
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {rows.map((row, idx) => (
          <div
            key={row.id}
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragEnter={() => onDragEnter(idx)}
            onDragEnd={onDragEnd}
            onDragOver={e => e.preventDefault()}
            className="group flex items-center gap-1.5 bg-white border border-ink-200 rounded-xl px-2 py-1.5 hover:border-brand-300 transition-colors"
          >
            {/* Drag handle */}
            <button
              aria-label="Drag to reorder"
              className="cursor-grab active:cursor-grabbing text-ink-300 hover:text-ink-500 p-0.5 flex-shrink-0 touch-none"
            >
              <GripVertical size={14} />
            </button>

            {/* Row number */}
            <span className="text-[10px] text-ink-300 w-4 text-center flex-shrink-0 font-mono">
              {idx + 1}
            </span>

            {/* Urdu textarea */}
            <textarea
              dir="rtl"
              value={row.text}
              onChange={e => updateRow(row.id, e.target.value)}
              placeholder="یہاں اردو لکھیں…"
              rows={1}
              ref={el => { if (el) textareaRefs.current[row.id] = el }}
              onFocus={() => setActiveRowId(row.id)}
              className={clsx(
                'flex-1 resize-none bg-transparent text-right font-nastaleeq text-xl leading-relaxed',
                'text-ink-800 placeholder:text-ink-300 focus:outline-none',
                'min-h-[2.5rem] py-0.5',
              )}
              style={{ fontFamily: '"Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", serif' }}
              onInput={e => {
                const el = e.currentTarget
                el.style.height = 'auto'
                el.style.height = Math.max(40, el.scrollHeight) + 'px'
              }}
            />

            {/* Row actions */}
            <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => duplicateRow(idx)}
                aria-label="Duplicate row"
                title="Duplicate"
                className="p-1 rounded-lg text-ink-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
              >
                <Copy size={12} />
              </button>
              <button
                onClick={() => deleteRow(row.id)}
                aria-label="Delete row"
                title="Delete"
                disabled={rows.length <= 1}
                className="p-1 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add row button */}
      <button
        onClick={() => addRow()}
        className="flex items-center justify-center gap-1.5 w-full py-2 mt-0.5 rounded-xl border border-dashed border-ink-300 text-xs text-ink-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all duration-150"
      >
        <Plus size={13} />
        <span>سطر شامل کریں</span>
        <span className="text-ink-400">(Add row)</span>
      </button>

      {/* CRITICAL FIX 6: On-screen Urdu keyboard */}
      {showKeyboard && (
        <UrduKeyboard
          onChar={(char) => {
            if (!activeRowId) return
            const ta = textareaRefs.current[activeRowId]
            if (!ta) return
            const start = ta.selectionStart ?? ta.value.length
            const end = ta.selectionEnd ?? ta.value.length
            const newVal = ta.value.slice(0, start) + char + ta.value.slice(end)
            updateRow(activeRowId, newVal)
            setTimeout(() => {
              ta.focus()
              ta.setSelectionRange(start + char.length, start + char.length)
            }, 0)
          }}
          onBackspace={() => {
            if (!activeRowId) return
            const ta = textareaRefs.current[activeRowId]
            if (!ta) return
            const start = ta.selectionStart ?? ta.value.length
            if (start === 0) return
            const newVal = ta.value.slice(0, start - 1) + ta.value.slice(start)
            updateRow(activeRowId, newVal)
            setTimeout(() => {
              ta.focus()
              ta.setSelectionRange(start - 1, start - 1)
            }, 0)
          }}
          onClose={() => setShowKeyboard(false)}
        />
      )}
    </div>
  )
}
