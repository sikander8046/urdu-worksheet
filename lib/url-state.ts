import { WorksheetOptions, DEFAULT_OPTIONS, WorksheetRow, FontStyle, RulingStyle, TextFit } from './types'

/**
 * Encode worksheet options to URL search params (compact).
 * Only non-default values are encoded to keep URLs short.
 */
export function encodeOptions(opts: WorksheetOptions): string {
  const params = new URLSearchParams()

  // Rows — always encode
  const rowTexts = opts.rows.map(r => r.text).join('||')
  params.set('t', rowTexts)

  if (opts.worksheetStyle    !== DEFAULT_OPTIONS.worksheetStyle)    params.set('ws', opts.worksheetStyle)
  if (opts.difficultyPreset  !== DEFAULT_OPTIONS.difficultyPreset)  params.set('dp', opts.difficultyPreset)
  if (opts.fontSize          !== DEFAULT_OPTIONS.fontSize)          params.set('fs', String(opts.fontSize))
  if (opts.fontBold          !== DEFAULT_OPTIONS.fontBold)          params.set('fb', opts.fontBold ? '1' : '0')
  if (opts.traceOpacity      !== DEFAULT_OPTIONS.traceOpacity)      params.set('to', String(Math.round(opts.traceOpacity * 100)))
  if (opts.traceColor        !== DEFAULT_OPTIONS.traceColor)        params.set('tc', opts.traceColor)
  if (opts.rowHeight         !== DEFAULT_OPTIONS.rowHeight)         params.set('rh', String(opts.rowHeight))
  if (opts.lineStyle         !== DEFAULT_OPTIONS.lineStyle)         params.set('ls', opts.lineStyle)
  if (opts.paperSize         !== DEFAULT_OPTIONS.paperSize)         params.set('ps', opts.paperSize)
  if (opts.showHeader        !== DEFAULT_OPTIONS.showHeader)        params.set('sh', opts.showHeader ? '1' : '0')
  if (opts.headerTitle       !== DEFAULT_OPTIONS.headerTitle)       params.set('ht', opts.headerTitle)
  if (opts.fontStyle         !== DEFAULT_OPTIONS.fontStyle)         params.set('ff', opts.fontStyle)
  if (opts.rulingStyle       !== DEFAULT_OPTIONS.rulingStyle)       params.set('rl', opts.rulingStyle)
  if (opts.textFit           !== DEFAULT_OPTIONS.textFit)           params.set('tf', opts.textFit)
  if (opts.headerStudentName !== DEFAULT_OPTIONS.headerStudentName) params.set('hsn', opts.headerStudentName ? '1' : '0')
  if (opts.headerClass       !== DEFAULT_OPTIONS.headerClass)       params.set('hc', opts.headerClass ? '1' : '0')
  if (opts.headerDate        !== DEFAULT_OPTIONS.headerDate)        params.set('hd', opts.headerDate ? '1' : '0')
  if (opts.rowsPerPage       !== DEFAULT_OPTIONS.rowsPerPage)       params.set('rpp', String(opts.rowsPerPage))

  return params.toString()
}

/**
 * Decode URL search params back to WorksheetOptions.
 */
export function decodeOptions(search: string): WorksheetOptions {
  const params = new URLSearchParams(search)
  const opts: WorksheetOptions = { ...DEFAULT_OPTIONS }

  const t = params.get('t')
  if (t) {
    opts.rows = t.split('||').filter(Boolean).map((text, i) => ({
      id: String(i + 1),
      text,
    }))
  }

  const ws = params.get('ws')
  if (ws) opts.worksheetStyle = ws as WorksheetOptions['worksheetStyle']

  const dp = params.get('dp')
  if (dp) opts.difficultyPreset = dp as WorksheetOptions['difficultyPreset']

  const fs = params.get('fs')
  if (fs) opts.fontSize = Number(fs)

  const fb = params.get('fb')
  if (fb !== null) opts.fontBold = fb === '1'

  const to = params.get('to')
  if (to) opts.traceOpacity = Number(to) / 100

  const tc = params.get('tc')
  if (tc) opts.traceColor = tc as WorksheetOptions['traceColor']

  const rh = params.get('rh')
  if (rh) opts.rowHeight = Number(rh)

  const ls = params.get('ls')
  if (ls) opts.lineStyle = ls as WorksheetOptions['lineStyle']

  const ps = params.get('ps')
  if (ps) opts.paperSize = ps as WorksheetOptions['paperSize']

  const sh = params.get('sh')
  if (sh !== null) opts.showHeader = sh === '1'

  const ht = params.get('ht')
  if (ht) opts.headerTitle = ht

  const ff = params.get('ff')
  if (ff) opts.fontStyle = ff as FontStyle

  const rl = params.get('rl')
  if (rl) opts.rulingStyle = rl as RulingStyle

  const tf = params.get('tf')
  if (tf) opts.textFit = tf as TextFit

  const hsn = params.get('hsn')
  if (hsn !== null) opts.headerStudentName = hsn === '1'
  const hc = params.get('hc')
  if (hc !== null) opts.headerClass = hc === '1'
  const hd = params.get('hd')
  if (hd !== null) opts.headerDate = hd === '1'
  const rpp = params.get('rpp')
  if (rpp) opts.rowsPerPage = rpp === 'auto' ? 'auto' : Number(rpp)

  return opts
}

/** Generate a unique row ID */
export function makeRowId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}
