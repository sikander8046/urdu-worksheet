// ─── Worksheet configuration types ───────────────────────────────────────────

export type WorksheetStyle = 'trace-only' | 'trace-blank' | 'blank-only'
export type LineStyle      = 'solid' | 'dashed' | 'double'
export type PaperSize      = 'a4' | 'letter'
export type TraceColor     = 'gray' | 'blue' | 'pink'
export type FontStyle      = 'nastaleeq' | 'naskh' | 'amiri' | 'scheherazade'
export type RulingStyle    = 'single' | 'baseline' | 'threeline'
export type DifficultyPreset = 'playgroup' | 'kg' | 'class1-3' | 'class4plus' | 'custom'
export type TextFit        = 'wrap' | 'shrink'

export interface WorksheetRow {
  id: string
  text: string
}

export interface WorksheetOptions {
  // Text
  rows: WorksheetRow[]
  fontStyle: FontStyle

  // Style
  worksheetStyle: WorksheetStyle
  difficultyPreset: DifficultyPreset

  // Typography
  fontSize: number          // pt  — 20–56
  fontBold: boolean

  // Tracing
  traceOpacity: number      // 0.2–0.8
  traceColor: TraceColor

  // Lines
  rowHeight: number         // pt  — 50–110
  lineStyle: LineStyle
  rulingStyle: RulingStyle
  rowsPerPage: number | 'auto'
  textFit: TextFit

  // Page
  paperSize: PaperSize
  showHeader: boolean
  headerTitle: string
  headerStudentName: boolean
  headerClass: boolean
  headerDate: boolean
}

export const DEFAULT_OPTIONS: WorksheetOptions = {
  rows: [
    { id: '1', text: 'بسم اللہ الرحمٰن الرحیم' },
    { id: '2', text: 'الحمد للہ رب العالمین' },
  ],
  worksheetStyle:   'trace-blank',
  difficultyPreset: 'kg',
  fontSize:         40,
  fontBold:         true,
  traceOpacity:     0.35,
  traceColor:       'gray',
  rowHeight:        80,
  lineStyle:        'solid',
  rulingStyle:      'baseline',
  rowsPerPage:      'auto',
  textFit:          'wrap',
  paperSize:        'a4',
  showHeader:       true,
  headerTitle:      'اردو لکھائی مشق',
  headerStudentName: true,
  headerClass:      true,
  headerDate:       true,
  fontStyle:        'nastaleeq',
}

// ─── Difficulty presets ───────────────────────────────────────────────────────

export interface PresetValues {
  label: string
  labelUrdu: string
  fontSize: number
  rowHeight: number
  fontBold: boolean
}

export const DIFFICULTY_PRESETS: Record<DifficultyPreset, PresetValues> = {
  playgroup: {
    label: 'Playgroup',
    labelUrdu: 'پلے گروپ',
    fontSize: 52,
    rowHeight: 160,
    fontBold: true,
  },
  kg: {
    label: 'KG / Nursery',
    labelUrdu: 'نرسری / کے جی',
    fontSize: 42,
    rowHeight: 140,
    fontBold: true,
  },
  'class1-3': {
    label: 'Class 1–3',
    labelUrdu: 'جماعت ۱ تا ۳',
    fontSize: 32,
    rowHeight: 115,
    fontBold: true,
  },
  'class4plus': {
    label: 'Class 4+',
    labelUrdu: 'جماعت ۴ اور اوپر',
    fontSize: 24,
    rowHeight: 90,
    fontBold: false,
  },
  custom: {
    label: 'Custom',
    labelUrdu: 'اپنی مرضی',
    fontSize: 36,
    rowHeight: 72,
    fontBold: true,
  },
}

// ─── Trace color values ───────────────────────────────────────────────────────

export const TRACE_COLORS: Record<TraceColor, string> = {
  gray: '#9ca3af',
  blue: '#93c5fd',
  pink: '#f9a8d4',
}

export const FONT_FAMILIES: Record<FontStyle, string> = {
  nastaleeq: '"Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", serif',
  naskh: '"Noto Naskh Arabic", sans-serif',
  amiri: '"Amiri", serif',
  scheherazade: '"Scheherazade New", serif',
}
