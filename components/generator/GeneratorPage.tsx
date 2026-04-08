'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import {
  Printer, Share2, BookOpen, ZoomIn, ZoomOut,
  Check, ChevronLeft, MessageCircle
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
import { Analytics } from '@/lib/analytics'

type PanelTab = 'text' | 'style' | 'library'

interface GeneratorPageProps {
  initialOpts?: WorksheetOptions
}

function isSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android')
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
  const [safariWarning, setSafariWarning] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [copies, setCopies] = useState(1)
  const previewRef = useRef<HTMLDivElement>(null)

  // Load from URL on mount (only when no initialOpts provided)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (initialOpts) return
    const search = window.location.search
    if (search) {
      try { setOpts(decodeOptions(search)) } catch (_) {}
    }
  }, [])

  // Restore last session from localStorage (only when no URL params and no initialOpts)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (initialOpts) return
    if (window.location.search) return
    try {
      const saved = localStorage.getItem('last-worksheet')
      if (saved) setOpts({ ...DEFAULT_OPTIONS, ...JSON.parse(saved) })
    } catch (_) {}
  }, [])

  // Update URL whenever opts change
  useEffect(() => {
    if (typeof window === 'undefined') return
    const encoded = encodeOptions(opts)
    const url = `${window.location.pathname}?${encoded}`
    window.history.replaceState(null, '', url)
  }, [opts])

  // Auto-save to localStorage
  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    try { localStorage.setItem('last-worksheet', JSON.stringify(opts)) } catch (_) {}
  }, [opts])

  // Font loading state with 5s fallback
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.fonts.ready.then(() => setFontsReady(true))
    const t = setTimeout(() => setFontsReady(true), 5000)
    return () => clearTimeout(t)
  }, [])

  // Onboarding banner — show on first visit
  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    const dismissed = localStorage.getItem('onboarding-dismissed')
    if (!dismissed) setShowOnboarding(true)
  }, [])

  // Mobile zoom auto-fit
  useEffect(() => {
    if (typeof window === 'undefined') return
    const updateZoom = () => {
      if (window.innerWidth < 768) {
        const pageW = opts.paperSize === 'a4' ? 794 : 816
        setZoom((window.innerWidth - 32) / pageW)
      }
    }
    updateZoom()
    window.addEventListener('resize', updateZoom)
    return () => window.removeEventListener('resize', updateZoom)
  }, [opts.paperSize])

  const patchOpts = useCallback((patch: Partial<WorksheetOptions>) => {
    if (patch.fontStyle) Analytics.fontChanged(patch.fontStyle)
    if (patch.difficultyPreset && patch.difficultyPreset !== 'custom') Analytics.presetSelected(patch.difficultyPreset)
    if (patch.worksheetStyle) Analytics.styleChanged(patch.worksheetStyle)
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

  function dismissOnboarding() {
    setShowOnboarding(false)
    localStorage.setItem('onboarding-dismissed', '1')
  }

  async function handlePrint() {
    if (!previewRef.current) return

    // Safari fallback — html2canvas doesn't work reliably on Safari
    if (isSafari()) {
      setSafariWarning(true)
      Analytics.safariWarningShown()
      return
    }

    setIsPrinting(true)
    let scaleWrapper: HTMLElement | null = null
    let originalTransform = ''

    try {
      await document.fonts.ready
      scaleWrapper = previewRef.current.parentElement as HTMLElement
      originalTransform = scaleWrapper.style.transform
      scaleWrapper.style.transform = 'scale(1)'
      scaleWrapper.style.transformOrigin = 'top left'
      await new Promise(r => setTimeout(r, 300))
      await document.fonts.ready

      const isA4 = opts.paperSize === 'a4'
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: isA4 ? 'a4' : 'letter' })
      const pdfW = isA4 ? 210 : 215.9
      const pdfH = isA4 ? 297 : 279.4

      // CRITICAL FIX 5: Capture each page separately for correct multi-page PDFs
      const pageEls = previewRef.current.querySelectorAll('.worksheet-page')
      for (let i = 0; i < pageEls.length; i++) {
        const pageEl = pageEls[i] as HTMLElement
        const canvas = await html2canvas(pageEl, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: true,
          foreignObjectRendering: false,
          imageTimeout: 0,
          onclone: (clonedDoc) => {
            clonedDoc.querySelectorAll('canvas').forEach(c => { c.style.display = 'block' })
          },
        })
        if (i > 0) pdf.addPage()
        const imgData = canvas.toDataURL('image/png')
        const imgH = (canvas.height * pdfW) / canvas.width
        pdf.addImage(imgData, 'PNG', 0, 0, pdfW, Math.min(imgH, pdfH))
      }

      const filename = copies > 1 ? `urdu-worksheet-${copies}copies.pdf` : 'urdu-worksheet.pdf'
      pdf.save(filename)
      Analytics.downloadPDF({
        paperSize: opts.paperSize,
        fontStyle: opts.fontStyle,
        worksheetStyle: opts.worksheetStyle,
        rowCount: opts.rows.length,
        pageCount,
        rulingStyle: opts.rulingStyle,
      })
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3000)
    } catch (err) {
      console.error('PDF generation failed:', err)
      Analytics.downloadFailed(String(err))
      window.print()
    } finally {
      if (scaleWrapper) scaleWrapper.style.transform = originalTransform
      setIsPrinting(false)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey
      if (meta && e.key === 'd') {
        e.preventDefault()
        if (!isPrinting && fontsReady) handlePrint()
      }
      if (meta && e.key === 'Enter') {
        e.preventDefault()
        patchOpts({ rows: [...opts.rows, { id: makeRowId(), text: '' }] })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPrinting, fontsReady, opts.rows])

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: 'Urdu Worksheet', url })
    } else {
      await navigator.clipboard.writeText(url)
      Analytics.urlCopied()
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleWhatsApp() {
    Analytics.whatsappShare()
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

  // HIGH FIX 7: Accurate page count calculation
  const headerH = opts.showHeader ? 120 : 0
  const pageH = opts.paperSize === 'a4' ? 1123 : 1056
  const availH = pageH - 96 - headerH
  const rowH = opts.rowHeight + 4
  const rowMultiplier = opts.worksheetStyle === 'trace-blank' ? 2 : 1
  const rowsPerPageEst = Math.floor(availH / (rowH * rowMultiplier))
  const pageCount = Math.max(1, Math.ceil(opts.rows.length / Math.max(1, rowsPerPageEst)))

  const TABS: { id: PanelTab; label: string; labelUrdu: string; icon: React.ReactNode }[] = [
    { id: 'text',    label: 'Text',    labelUrdu: 'متن',      icon: <span className="text-base">✏️</span> },
    { id: 'style',   label: 'Style',   labelUrdu: 'انداز',    icon: <span className="text-base">🎨</span> },
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

      {/* Download success toast */}
      {downloadSuccess && (
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brand-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-medium">
          <Check size={16} />
          <span>PDF ڈاؤنلوڈ ہو گئی!</span>
        </div>
      )}

      {/* CRITICAL FIX 3: Safari warning modal */}
      {safariWarning && (
        <div
          className="no-print fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSafariWarning(false)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-ink-900 mb-2">Safari پر PDF</h3>
            <p className="text-sm text-ink-600 mb-4 leading-relaxed">
              Safari browser میں direct PDF download کام نہیں کرتا۔
              بہتر نتائج کے لیے Chrome استعمال کریں، یا نیچے
              Print کریں اور &ldquo;Save as PDF&rdquo; منتخب کریں۔
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { setSafariWarning(false); window.print() }}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setSafariWarning(false)}
                className="px-4 py-2.5 rounded-xl border border-ink-200 text-sm text-ink-600"
              >
                بند کریں
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF generating overlay */}
      {isPrinting && (
        <div className="no-print fixed inset-0 bg-black/40 flex flex-col items-center justify-center z-50">
          <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center gap-4 shadow-xl">
            <div
              className="w-10 h-10 rounded-full animate-spin"
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
          mobilePreview ? 'hidden md:flex' : 'flex'
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

          {/* HIGH FIX 5: Trust signals bar */}
          <div className="px-4 py-1.5 bg-brand-50 border-b border-brand-100 flex justify-center gap-3 flex-wrap">
            {['مفت', 'No watermark', 'No account'].map(t => (
              <span key={t} className="text-[10px] text-brand-700 flex items-center gap-0.5">
                <span style={{ fontSize: 10 }}>✓</span> {t}
              </span>
            ))}
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
                  worksheetTitle={opts.headerTitle}
                  onTitleChange={title => patchOpts({ headerTitle: title })}
                />
              </div>
            )}
            {activeTab === 'style' && (
              <div className="p-4">
                <OptionsPanel
                  opts={opts}
                  onChange={patchOpts}
                  onReset={() => patchOpts({ ...DEFAULT_OPTIONS, rows: opts.rows })}
                />
              </div>
            )}
            {activeTab === 'library' && (
              <LibraryPanel
                onLoad={loadFromLibrary}
                onClose={() => setActiveTab('text')}
              />
            )}
          </div>

          {/* HIGH FIX 4: Minimal footer */}
          <div className="no-print px-4 py-2 border-t border-ink-100 flex flex-wrap gap-x-3 gap-y-1">
            <a href="/worksheets" className="text-[10px] text-ink-400 hover:text-brand-600 transition-colors">📚 Worksheets</a>
            <a href="/about"      className="text-[10px] text-ink-400 hover:text-brand-600 transition-colors">About</a>
            <a href="/privacy-policy" className="text-[10px] text-ink-400 hover:text-brand-600 transition-colors">Privacy</a>
            <a href="/contact"    className="text-[10px] text-ink-400 hover:text-brand-600 transition-colors">Contact</a>
            <span className="text-[10px] text-ink-300 ml-auto">urdusheets.com</span>
          </div>

          {/* HIGH FIX 11: Copies input */}
          <div className="no-print px-3 pb-1 flex items-center gap-2">
            <label className="text-xs text-ink-500 flex-shrink-0">نسخے (Copies)</label>
            <input
              type="number"
              min={1}
              max={50}
              value={copies}
              onChange={e => setCopies(Math.max(1, Math.min(50, Number(e.target.value))))}
              className="w-16 border border-ink-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:border-brand-400"
            />
            <span className="text-[10px] text-ink-400">(browser print کے ذریعے)</span>
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
              disabled={isPrinting || !fontsReady}
            >
              {isPrinting ? 'بن رہا ہے...' : !fontsReady ? 'لوڈ ہو رہا ہے...' : 'ڈاؤنلوڈ کریں'}
            </Button>
          </div>
        </aside>

        {/* ════════════════════════════════════════════════
            RIGHT PANEL — Preview
        ════════════════════════════════════════════════ */}
        <main className={clsx(
          'flex-1 flex-col overflow-hidden',
          'w-full',
          mobilePreview ? 'flex' : 'hidden md:flex'
        )}>
          {/* HIGH FIX 1: Onboarding banner */}
          {showOnboarding && (
            <div className="no-print bg-brand-50 border-b border-brand-200 px-4 py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-xs text-brand-800">
                <span>✏️ <strong>متن لکھیں</strong> — Text tab میں اردو ٹائپ کریں</span>
                <span className="hidden sm:inline">📚 <strong>Library</strong> — تیار شدہ ورک شیٹس</span>
                <span className="hidden md:inline">🎨 <strong>Style</strong> — سائز اور انداز تبدیل کریں</span>
                <span className="hidden lg:inline">⬇️ <strong>Download</strong> — PDF فوری ڈاؤنلوڈ</span>
              </div>
              <button onClick={dismissOnboarding} className="text-brand-600 hover:text-brand-800 flex-shrink-0 text-xs">
                ✕ بند
              </button>
            </div>
          )}

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
                onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}
                className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-100 transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut size={15} />
              </button>
              <span className="text-xs font-mono text-ink-600 w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
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
                disabled={isPrinting || !fontsReady}
              >
                {isPrinting ? '...' : !fontsReady ? '...' : 'ڈاؤنلوڈ'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="hidden md:flex"
                icon={<Printer size={13} />}
                onClick={handlePrint}
                disabled={isPrinting || !fontsReady}
              >
                {isPrinting ? '...' : !fontsReady ? '...' : 'Download'}
              </Button>
            </div>
          </div>

          {/* CRITICAL FIX 9: Preview canvas with scroll-wheel zoom (MEDIUM FIX 3) */}
          <div
            className="flex-1 overflow-auto bg-ink-100 p-4 md:p-6"
            onWheel={e => {
              e.preventDefault()
              const delta = e.deltaY > 0 ? -0.05 : 0.05
              setZoom(z => Math.max(0.2, Math.min(1.5, z + delta)))
            }}
          >
            <div
              className="origin-top mx-auto transition-transform duration-200"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            >
              <WorksheetPreview ref={previewRef} opts={opts} />
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
              disabled={isPrinting || !fontsReady}
              fullWidth
            >
              {isPrinting ? 'بن رہا ہے...' : !fontsReady ? 'لوڈ ہو رہا ہے...' : 'PDF ڈاؤنلوڈ'}
            </Button>
          </div>
        </main>
      </div>
    </>
  )
}
