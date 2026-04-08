// ─── Google Analytics 4 Event Tracking ──────────────
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    clarity: (...args: any[]) => void
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

// ─── Predefined events ───────────────────────────────

export const Analytics = {

  // PDF downloaded
  downloadPDF: (opts: {
    paperSize: string
    fontStyle: string
    worksheetStyle: string
    rowCount: number
    pageCount: number
    rulingStyle: string
  }) => trackEvent('download_pdf', {
    paper_size: opts.paperSize,
    font_style: opts.fontStyle,
    worksheet_style: opts.worksheetStyle,
    row_count: opts.rowCount,
    page_count: opts.pageCount,
    ruling_style: opts.rulingStyle,
  }),

  // Library item loaded
  libraryItemLoaded: (itemId: string, category: string) =>
    trackEvent('library_item_loaded', {
      item_id: itemId,
      category,
    }),

  // WhatsApp share clicked
  whatsappShare: () =>
    trackEvent('share', {
      method: 'whatsapp',
      content_type: 'worksheet',
    }),

  // URL copied
  urlCopied: () =>
    trackEvent('share', {
      method: 'copy_link',
      content_type: 'worksheet',
    }),

  // Font style changed
  fontChanged: (fontStyle: string) =>
    trackEvent('font_changed', { font_style: fontStyle }),

  // Difficulty preset selected
  presetSelected: (preset: string) =>
    trackEvent('preset_selected', { preset }),

  // Worksheet style changed
  styleChanged: (style: string) =>
    trackEvent('style_changed', { style }),

  // Worksheet page visited
  worksheetPageViewed: (slug: string, title: string) =>
    trackEvent('worksheet_page_view', {
      slug,
      title,
    }),

  // Urdu keyboard opened
  keyboardOpened: () =>
    trackEvent('keyboard_opened'),

  // Rows added
  rowAdded: (totalRows: number) =>
    trackEvent('row_added', { total_rows: totalRows }),

  // Download failed
  downloadFailed: (reason: string) =>
    trackEvent('download_failed', { reason }),

  // Safari warning shown
  safariWarningShown: () =>
    trackEvent('safari_warning_shown'),
}
