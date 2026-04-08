'use client'
import React, { forwardRef } from 'react'
import { WorksheetOptions, TRACE_COLORS, FONT_FAMILIES } from '@/lib/types'
import { WorksheetRowCanvas } from './WorksheetRowCanvas'
import clsx from 'clsx'

interface WorksheetPreviewProps {
  opts: WorksheetOptions
  className?: string
}

// A4 at 96dpi in pixels: 794 × 1123
// Letter: 816 × 1056
const PAGE_DIMS = {
  a4:     { width: 794,  height: 1123 },
  letter: { width: 816,  height: 1056 },
}
const MARGIN_PT = 48 // ~17mm

export const WorksheetPreview = forwardRef<HTMLDivElement, WorksheetPreviewProps>(
  function WorksheetPreview({ opts, className }, ref) {
    const dims = PAGE_DIMS[opts.paperSize]
    const contentWidth = dims.width - MARGIN_PT * 2

    // Row height in px (1pt ≈ 1.333px at 96dpi, but we keep 1:1 for screen)
    const rowHeightPx = opts.rowHeight

    // Estimate rows that fit on one page
    const headerHeight = opts.showHeader ? 100 : 0
    const availableHeight = dims.height - MARGIN_PT * 2 - headerHeight
    const rowsPerPage = opts.rowsPerPage === 'auto'
      ? Math.floor(availableHeight / (rowHeightPx * 1.25 * (opts.worksheetStyle === 'trace-blank' ? 2 : 1)))
      : opts.rowsPerPage

    // Build pages
    const allRows = opts.rows
    const pages: typeof allRows[] = []
    for (let i = 0; i < allRows.length; i += rowsPerPage) {
      pages.push(allRows.slice(i, i + rowsPerPage))
    }
    if (pages.length === 0) pages.push([])

    return (
      <div ref={ref} className={clsx('worksheet-root flex flex-col gap-6', className)}>
        {pages.map((pageRows, pageIdx) => (
          <div
            key={pageIdx}
            className="worksheet-page bg-white shadow-md mx-auto"
            style={{
              width: dims.width,
              minHeight: dims.height,
              padding: MARGIN_PT,
              fontFamily: FONT_FAMILIES[opts.fontStyle],
              pageBreakAfter: 'always',
              direction: 'ltr',
            }}
          >
            {/* ── Header ── */}
            {opts.showHeader && pageIdx === 0 && (
              <div
                className="border-b-2 border-ink-800 pb-3 mb-4"
                style={{ direction: 'rtl' }}
              >
                {/* Title */}
                <h1
                  className="text-center font-bold text-ink-900"
                  style={{
                    fontSize: 28,
                    fontFamily: FONT_FAMILIES[opts.fontStyle],
                    lineHeight: 1.6,
                  }}
                >
                  {opts.headerTitle || 'اردو لکھائی مشق'}
                </h1>

                {/* Info lines */}
                <div
                  className="flex justify-between mt-6 gap-4"
                  style={{ direction: 'rtl' }}
                >
                  {opts.headerStudentName && (
                    <HeaderInfoLine label="نام" fontFamily={FONT_FAMILIES[opts.fontStyle]} />
                  )}
                  {opts.headerClass && (
                    <HeaderInfoLine label="جماعت" fontFamily={FONT_FAMILIES[opts.fontStyle]} />
                  )}
                  {opts.headerDate && (
                    <HeaderInfoLine label="تاریخ" fontFamily={FONT_FAMILIES[opts.fontStyle]} />
                  )}
                </div>
              </div>
            )}

            {/* ── Worksheet rows ── */}
            <div className="flex flex-col">
              {pageRows.map((row) => (
                <WorksheetRowCanvas
                  key={row.id}
                  text={row.text}
                  showText={opts.worksheetStyle !== 'blank-only'}
                  showBlankBelow={opts.worksheetStyle === 'trace-blank'}
                  fontSize={opts.fontSize}
                  fontBold={opts.fontBold}
                  fontFamily={FONT_FAMILIES[opts.fontStyle]}
                  traceColor={TRACE_COLORS[opts.traceColor]}
                  traceOpacity={opts.traceOpacity}
                  rowHeight={opts.rowHeight}
                  rulingStyle={opts.rulingStyle}
                  lineStyle={opts.lineStyle}
                  paperWidthPx={contentWidth}
                  textFit={opts.textFit}
                />
              ))}

              {/* CRITICAL FIX 1: Fill remaining page space with blank writing lines */}
              {opts.worksheetStyle !== 'blank-only' && (() => {
                const headerH = opts.showHeader && pageIdx === 0 ? 120 : 0
                const pageH = opts.paperSize === 'a4' ? 1123 : 1056
                const availH = pageH - MARGIN_PT * 2 - headerH - 20
                const rowsRendered = opts.worksheetStyle === 'trace-blank'
                  ? pageRows.length * 2
                  : pageRows.length
                const rowH = opts.rowHeight + 4
                const rowsUsed = rowsRendered * rowH
                const remaining = availH - rowsUsed
                const blankCount = Math.floor(remaining / rowH)
                if (blankCount <= 0) return null
                return Array.from({ length: blankCount }).map((_, i) => (
                  <WorksheetRowCanvas
                    key={`blank-fill-${i}`}
                    text=""
                    showText={false}
                    showBlankBelow={false}
                    fontSize={opts.fontSize}
                    fontBold={opts.fontBold}
                    fontFamily={FONT_FAMILIES[opts.fontStyle]}
                    traceColor={TRACE_COLORS[opts.traceColor]}
                    traceOpacity={opts.traceOpacity}
                    rowHeight={opts.rowHeight}
                    rulingStyle={opts.rulingStyle}
                    lineStyle={opts.lineStyle}
                    paperWidthPx={contentWidth}
                    textFit={opts.textFit}
                  />
                ))
              })()}

              {/* CRITICAL FIX 2: Blank-only — fill full page with ruled lines */}
              {opts.worksheetStyle === 'blank-only' && (() => {
                const headerH = opts.showHeader && pageIdx === 0 ? 120 : 0
                const pageH = opts.paperSize === 'a4' ? 1123 : 1056
                const availH = pageH - MARGIN_PT * 2 - headerH - 20
                const rowH = opts.rowHeight + 4
                const blankCount = Math.floor(availH / rowH)
                return Array.from({ length: blankCount }).map((_, i) => (
                  <WorksheetRowCanvas
                    key={`blank-only-${i}`}
                    text=""
                    showText={false}
                    showBlankBelow={false}
                    fontSize={opts.fontSize}
                    fontBold={opts.fontBold}
                    fontFamily={FONT_FAMILIES[opts.fontStyle]}
                    traceColor={TRACE_COLORS[opts.traceColor]}
                    traceOpacity={opts.traceOpacity}
                    rowHeight={opts.rowHeight}
                    rulingStyle={opts.rulingStyle}
                    lineStyle={opts.lineStyle}
                    paperWidthPx={contentWidth}
                    textFit={opts.textFit}
                  />
                ))
              })()}
            </div>

            {/* Page number */}
            {pages.length > 1 && (
              <div
                className="absolute bottom-4 left-0 right-0 text-center text-xs text-ink-300"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {pageIdx + 1} / {pages.length}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }
)

// ─── Header info line ─────────────────────────────────────────────────────────
function HeaderInfoLine({ label, fontFamily }: { label: string; fontFamily: string }) {
  return (
    <div className="flex items-end gap-2 flex-1 min-w-0" style={{ paddingBottom: 4 }}>
      <span
        className="text-ink-700 flex-shrink-0 text-sm font-bold whitespace-nowrap"
        style={{ fontFamily, lineHeight: 1 }}
      >
        {label}:
      </span>
      <span className="flex-1 border-b-2 border-ink-700" style={{ marginBottom: 2 }} />
    </div>
  )
}

