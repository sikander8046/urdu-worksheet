'use client'
import React, { useState } from 'react'
import { BookOpen, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { LIBRARY_ITEMS, LIBRARY_CATEGORIES, LibraryItem } from '@/lib/library'
import { WorksheetRow, DIFFICULTY_PRESETS, DifficultyPreset } from '@/lib/types'
import { makeRowId } from '@/lib/url-state'

interface LibraryPanelProps {
  onLoad: (rows: WorksheetRow[], preset?: DifficultyPreset) => void
  onClose: () => void
}

export function LibraryPanel({ onLoad, onClose }: LibraryPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filtered = LIBRARY_ITEMS.filter(item => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory
    const q = search.toLowerCase().trim()
    const matchSearch = !q ||
      item.title.toLowerCase().includes(q) ||
      item.titleUrdu.includes(q) ||
      item.categoryLabel.includes(q)
    return matchCat && matchSearch
  })

  function loadItem(item: LibraryItem) {
    const rows: WorksheetRow[] = item.lines.map(text => ({ id: makeRowId(), text }))
    onLoad(rows, item.recommendedPreset as DifficultyPreset)
    onClose()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-4 pt-3 pb-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="تلاش کریں… (search)"
          dir="rtl"
          className="w-full border border-ink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-400 bg-white"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto no-scrollbar">
        {LIBRARY_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={clsx(
              'flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
              activeCategory === cat.id
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'bg-white border-ink-200 text-ink-600 hover:border-brand-300'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
        {filtered.length === 0 && (
          <p className="text-sm text-ink-400 text-center py-8">کوئی نتیجہ نہیں</p>
        )}
        {filtered.map(item => (
          <button
            key={item.id}
            onClick={() => loadItem(item)}
            className="group text-left w-full bg-white border border-ink-200 rounded-xl p-3 hover:border-brand-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Urdu title */}
                <p
                  dir="rtl"
                  className="text-base font-nastaleeq text-ink-800 text-right leading-relaxed"
                  style={{ fontFamily: '"Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", serif' }}
                >
                  {item.titleUrdu}
                </p>
                <p className="text-xs text-ink-500 mt-0.5">{item.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-medium bg-ink-100 text-ink-500 px-2 py-0.5 rounded-full">
                    {item.categoryLabel}
                  </span>
                  <span className="text-[10px] text-ink-400">
                    {item.lines.length} lines · {DIFFICULTY_PRESETS[item.recommendedPreset as DifficultyPreset]?.label}
                  </span>
                </div>
              </div>
              <ChevronRight size={14} className="text-ink-300 group-hover:text-brand-500 flex-shrink-0 mt-1 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
