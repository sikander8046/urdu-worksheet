'use client'
import React from 'react'
import Link from 'next/link'
import { WorksheetPageData } from '@/lib/worksheet-pages'
import { DEFAULT_OPTIONS, WorksheetOptions } from '@/lib/types'
import { makeRowId, encodeOptions } from '@/lib/url-state'
import { GeneratorPage } from '@/components/generator/GeneratorPage'

interface Props {
  data: WorksheetPageData
}

export function WorksheetLandingPage({ data }: Props) {
  const initialOpts: WorksheetOptions = {
    ...DEFAULT_OPTIONS,
    ...data.defaultOpts,
    rows: data.lines.map(text => ({ id: makeRowId(), text })),
    headerTitle: data.titleUrdu,
  }

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Breadcrumb nav */}
      <nav
        className="no-print bg-white border-b border-ink-200 px-4 py-2 flex items-center gap-2 text-xs text-ink-500"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/worksheets" className="hover:text-brand-600 transition-colors">
          Worksheets
        </Link>
        <span>/</span>
        <span className="text-ink-800 font-medium">{data.titleEn}</span>
      </nav>

      {/* SEO intro block */}
      <div
        className="no-print max-w-3xl mx-auto px-4 pt-6 pb-4"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        <h1 className="text-2xl font-bold text-ink-900 mb-1">{data.titleEn}</h1>
        <p
          className="text-lg text-ink-700 mb-2 text-right"
          dir="rtl"
          style={{ fontFamily: '"Noto Nastaliq Urdu", serif', lineHeight: 2 }}
        >
          {data.titleUrdu}
        </p>
        <p className="text-sm text-ink-600 leading-relaxed">{data.intro}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {data.keywords.slice(0, 4).map(kw => (
            <span
              key={kw}
              className="text-[10px] bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-full"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Generator — desktop only */}
      <div className="hidden md:block">
        <GeneratorPage initialOpts={initialOpts} />
      </div>

      {/* Mobile — simplified open button */}
      <div className="md:hidden no-print px-4 pb-6">
        <a
          href={`/?${encodeOptions(initialOpts)}`}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-brand-600 text-white font-medium text-base shadow-sm"
        >
          <span>اس ورک شیٹ کو کھولیں</span>
          <span>←</span>
        </a>
        <p className="text-center text-xs text-ink-400 mt-2">
          Generator میں کھل جائے گا — فوری PDF ڈاؤنلوڈ کریں
        </p>
      </div>
    </div>
  )
}
