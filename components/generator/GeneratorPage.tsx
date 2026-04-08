'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  Printer, Share2, BookOpen, Settings, ZoomIn, ZoomOut,
  Check, ChevronLeft, ChevronRight, X, MessageCircle
} from 'lucide-react'
import clsx from 'clsx'
import { WorksheetOptions, DEFAULT_OPTIONS, DifficultyPreset, DIFFICULTY_PRESETS } from '@/lib/types'
import { WorksheetRow } from '@/lib/types'
import { encodeOptions, decodeOptions, makeRowId } from '@/lib/url-state'
import { TextRowsInput } from './TextRowsInput'
import { OptionsPanel } from './OptionsPanel'
import { WorksheetPreview } from './WorksheetPreview'
import { LibraryPanel } from '@/components/library/LibraryPanel'
import { Button } from '@/components/shared/Controls'

type PanelTab = 'text' | 'style' | 'library'

interface GeneratorPageProps {
  initialOpts?: WorksheetOptions
}

export function GeneratorPage({ initialOpts }: GeneratorPageProps = {}) {
  const [opts, setOpts] = useState<WorksheetOptions>(initialOpts || DEFAULT_OPTIONS)
  const [activeTab, setActiveTab] = useState<PanelTab>('text')
  const [zoom, setZoom] = useState(0.62)
  const [copied, setCopied] = useState(false)
  const [mobilePreview, setMobilePreview] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [prevRows, setPrevRows] = useState<WorksheetRow[]>([])
  const previewRef = useRef<HTMLDivElement>(null)

  // Load from URL on mount (only when no initialOpts provided)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (initialOpts) return
    const search = window.location.search
    if (search) {
      try {
        setOpts(decodeOptions(search))
      } catch (_) { /* ignore bad URLs */ }
    }
  }, [])

  // Update URL whenever opts change
  useEffect(() => {
    if (typeof window === 'undefined') return
    const encoded = encodeOptions(opts)
    const url = `${window.location.pathname}?${encoded}`
    window.history.replaceState(null, '', url)
  }, [opts])

  const patchOpts = useCallback((patch: Partial<WorksheetOptions>) => {
    setOpts(prev => ({ ...prev, ...patch }))
  }, [])

  function patchOptsWithUndo(patch: Partial<WorksheetOptions>) {
    if (patch.rows) setPrevRows(opts.rows)
    patchOpts(patch)
  }

  function undoRowChange() {
    if (prevRows.length > 0) {
      patchOpts({ rows: prevRows })
      setPrevRows([])
    }
  }

  async function handlePrint() {
    if (!previewRef.current) return
    setIsPrinting(true)
    try {
      // Find the scaled wrapper and temporarily remove scale
      const scaleWrapper = previewRef.current.parentElement as HTMLElement
      const originalTransform = scaleWrapper.style.transform
      scaleWrapper.style.transform = 'scale(1)'
      scaleWrapper.style.transformOrigin = 'top left'

      await new Promise(r => setTimeout(r, 100)) // let layout settle

      // Wait for all fonts to fully load
      await document.fonts.ready

      // Additional wait for canvas re-renders to complete
      await new Promise(r => setTimeout(r, 300))

      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          // Force all canvases in clone to be visible
          clonedDoc.querySelectorAll('canvas').forEach(c => {
            c.style.display = 'block'
          })
        },
      })

      // Restore transform
      scaleWrapper.style.transform = originalTransform

      const imgData = canvas.toDataURL('image/png')
      const isA4 = opts.paperSize === 'a4'
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: isA4 ? 'a4' : 'letter'
      })
      const pdfW = isA4 ? 210 : 215.9
      const pdfH = isA4 ? 297 : 279.4
      const imgH = (canvas.height * pdfW) / canvas.width

      if (imgH <= pdfH) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfW, imgH)
      } else {
        let y = 0
        let remaining = imgH
        while (remaining > 0) {
          pdf.addImage(imgData, 'PNG', 0, y, pdfW, imgH)
          remaining -= pdfH
          y -= pdfH
          if (remaining > 0) pdf.addPage()
        }
      }
      pdf.save('urdu-worksheet.pdf')
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3000)
    } finally {
      setIsPrinting(false)
    }
  }

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: 'Urdu Worksheet', url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleWhatsApp() {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent('اردو لکھائی ورک شیٹ — یہاں سے پرنٹ کریں: ')
    window.open(`https://wa.me/?text=${text}${url}`, '_blank')
  }

  function loadFromLibrary(rows: WorksheetRow[], preset?: DifficultyPreset) {
    const patch: Partial<WorksheetOptions> = { rows }
    if (preset) {
      const p = DIFFICULTY_PRESETS[preset]
      if (p) Object.assign(patch, {
        difficultyPreset: preset,
        fontSize: p.fontSize,
        rowHeight: p.rowHeight,
        fontBold: p.fontBold,
      })
    }
    patchOptsWithUndo(patch)
    setActiveTab('text')
  }

  const rowsPerPageEst = Math.floor(
    (opts.paperSize === 'a4' ? 1123 : 1056) * 0.75 /
    (opts.rowHeight * (opts.worksheetStyle === 'trace-blank' ? 2 : 1) * 1.25 + 8)
  )
  const pageCount = Math.ceil(opts.rows.length / Math.max(1, rowsPerPageEst))

  const TABS: { id: PanelTab; label: string; labelUrdu: string; icon: React.ReactNode }[] = [
    { id: 'text',    label: 'Text',    labelUrdu: 'متن',     icon: <span className="text-base">✏️</span> },
    { id: 'style',   label: 'Style',   labelUrdu: 'انداز',   icon: <span className="text-base">🎨</span> },
    { id: 'library', label: 'Library', labelUrdu: 'کتب خانہ', icon: <BookOpen size={14} /> },
  ]

  return (
    <>
      {/* ── Print styles ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .worksheet-root { display: block !important; }
          .worksheet-page {
            width: 100% !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 48px !important;
          }
          body { margin: 0; padding: 0; }
        }
        @page {
          size: ${opts.paperSize === 'a4' ? 'A4' : 'letter'};
          margin: 0;
        }
      `}</style>

      {downloadSuccess && (
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brand-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-medium">
          <Check size={16} />
          <span>PDF ڈاؤنلوڈ ہو گئی!</span>
        </div>
      )}

      {isPrinting && (
        <div className="no-print fixed inset-0 bg-black/40 flex flex-col items-center justify-center z-50">
          <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center gap-4 shadow-xl">
            <div
              className="w-10 h-10 border-t-brand-600 rounded-full animate-spin"
              style={{ borderWidth: 3, borderStyle: 'solid', borderColor: '#e5e7eb', borderTopColor: '#16a34a' }}
            />
            <div className="text-center">
              <p className="text-sm font-medium text-ink-800">PDF بن رہا ہے…</p>
              <p className="text-xs text-ink-400 mt-1">Generating your worksheet</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen bg-ink-50 overflow-hidden">

        {/* ════════════════════════════════════════════════
            LEFT PANEL — Controls
        ════════════════════════════════════════════════ */}
        <aside className={clsx(
          'no-print flex-col bg-white border-r border-ink-200 flex-shrink-0',
          'w-full md:w-[320px] xl:w-[340px]',
          'h-full md:h-auto',
          mobilePreview
            ? 'hidden md:flex'
            : 'flex'
        )}>
          {/* Logo / brand */}
          <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-ink-900 leading-none">اردو ورک شیٹ</h1>
              <p className="text-[10px] text-ink-400 mt-0.5">Urdu Handwriting Generator</p>
              <Link href="/worksheets" className="text-[10px] text-brand-600 hover:underline mt-0.5 block">
                📚 Browse 15 free worksheets
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleWhatsApp}
                title="Share on WhatsApp"
                className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle size={16} />
              </button>
              <button
                onClick={handleShare}
                title="Copy link"
                className="p-2 rounded-lg text-ink-500 hover:bg-ink-100 transition-colors"
                aria-label="Share worksheet link"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Share2 size={16} />}
              </button>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex border-b border-ink-100">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium border-b-2 transition-all',
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-700 bg-brand-50'
                    : 'border-transparent text-ink-500 hover:text-ink-700 hover:bg-ink-50'
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className="text-[9px] opacity-70" style={{ fontFamily: 'serif' }}>{tab.labelUrdu}</span>
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'text' && (
              <div className="p-4">
                <TextRowsInput
                  rows={opts.rows}
                  onChange={rows => patchOptsWithUndo({ rows })}
                  onClearAll={() => patchOptsWithUndo({ rows: [{ id: makeRowId(), text: '' }] })}
                  onUndo={undoRowChange}
                  hasUndo={prevRows.length > 0}
                />
              </div>
            )}
            {activeTab === 'style' && (
              <div className="p-4">
                <OptionsPanel opts={opts} onChange={patchOpts} />
              </div>
            )}
            {activeTab === 'library' && (
              <LibraryPanel
                onLoad={loadFromLibrary}
                onClose={() => setActiveTab('text')}
              />
            )}
          </div>

          {/* Bottom action bar */}
          <div className="no-print p-3 border-t border-ink-100 flex gap-2">
            <Button
              variant="secondary"
              size="md"
              className="md:hidden flex-1"
              onClick={() => setMobilePreview(true)}
            >
              پیش نظارہ دیکھیں →
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              className="hidden md:flex"
              icon={<Printer size={15} />}
              onClick={handlePrint}
              disabled={isPrinting}
            >
              {isPrinting ? '...' : 'ڈاؤنلوڈ کریں'}
            </Button>
          </div>
        </aside>

        {/* ════════════════════════════════════════════════
            RIGHT PANEL — Preview
        ════════════════════════════════════════════════ */}
        <main className={clsx(
          'flex-1 flex-col overflow-hidden',
          'w-full',
          mobilePreview
            ? 'flex'
            : 'hidden md:flex'
        )}>
          {/* Preview toolbar */}
          <div className="no-print flex items-center justify-between px-4 py-2 bg-white border-b border-ink-200 flex-shrink-0">
            {/* Mobile back */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setMobilePreview(false)}
                className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-100 flex items-center gap-1 text-sm"
              >
                <ChevronLeft size={16} />
                <span>ترمیم</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <span className="text-xs text-ink-500 mr-2">Zoom</span>
              <button
                onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
                className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-100 transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut size={15} />
              </button>
              <span className="text-xs font-mono text-ink-600 w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(1.2, z + 0.1))}
                className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-100 transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn size={15} />
              </button>
              <button
                onClick={() => setZoom(0.62)}
                className="ml-1 text-[10px] px-2 py-1 rounded border border-ink-200 text-ink-500 hover:bg-ink-100 transition-colors"
              >
                Fit
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-400 hidden sm:block">
                {opts.paperSize.toUpperCase()} · {opts.rows.length} rows · {pageCount} page{pageCount !== 1 ? 's' : ''}
              </span>
              <Button
                variant="primary"
                size="sm"
                className="md:hidden"
                icon={<Printer size={13} />}
                onClick={handlePrint}
                disabled={isPrinting}
              >
                {isPrinting ? '...' : 'ڈاؤنلوڈ'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="hidden md:flex"
                icon={<Printer size={13} />}
                onClick={handlePrint}
                disabled={isPrinting}
              >
                {isPrinting ? '...' : 'Download'}
              </Button>
            </div>
          </div>

          {/* Preview canvas */}
          <div className="flex-1 overflow-auto bg-ink-100 p-6">
            <div
              className="origin-top mx-auto transition-transform duration-200"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            >
              <WorksheetPreview
                ref={previewRef}
                opts={opts}
              />
            </div>
          </div>

          {/* Sticky mobile download bar */}
          <div className="md:hidden no-print sticky bottom-0 bg-white border-t border-ink-100 p-3 flex gap-2">
            <button
              onClick={() => setMobilePreview(false)}
              className="flex-1 py-2.5 rounded-xl border border-ink-200 text-xs font-medium text-ink-700"
            >
              ← ترمیم
            </button>
            <Button
              variant="primary"
              size="md"
              icon={<Printer size={14} />}
              onClick={handlePrint}
              disabled={isPrinting}
              fullWidth
            >
              {isPrinting ? 'بن رہا ہے...' : 'PDF ڈاؤنلوڈ'}
            </Button>
          </div>
        </main>
      </div>
    </>
  )
}
