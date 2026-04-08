'use client'
import React, { useState } from 'react'
import clsx from 'clsx'
import {
  WorksheetOptions, WorksheetStyle, LineStyle, PaperSize, TraceColor,
  DifficultyPreset, DIFFICULTY_PRESETS, FontStyle, RulingStyle, TextFit
} from '@/lib/types'
import { Slider, Toggle, SelectGroup, SectionLabel, Divider } from '@/components/shared/Controls'

interface OptionsPanelProps {
  opts: WorksheetOptions
  onChange: (patch: Partial<WorksheetOptions>) => void
  onReset: () => void
}

export function OptionsPanel({ opts, onChange, onReset }: OptionsPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  function applyPreset(preset: DifficultyPreset) {
    if (preset === 'custom') {
      onChange({ difficultyPreset: 'custom' })
      return
    }
    const p = DIFFICULTY_PRESETS[preset]
    onChange({
      difficultyPreset: preset,
      fontSize:   p.fontSize,
      rowHeight:  p.rowHeight,
      fontBold:   p.fontBold,
    })
  }

  return (
    <div className="flex flex-col gap-3 text-sm">

      {/* Reset button */}
      <div className="flex justify-end mb-1">
        <button
          onClick={onReset}
          className="text-[10px] text-ink-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          ↺ ڈیفالٹ ترتیبات
        </button>
      </div>

      {/* ── Header ── */}
      <SectionLabel>Header / سرخی</SectionLabel>
      <Toggle
        label="Show header / سرخی دکھائیں"
        checked={opts.showHeader}
        onChange={sh => onChange({ showHeader: sh })}
      />
      {opts.showHeader && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-ink-600">Title / عنوان</label>
            <input
              dir="rtl"
              type="text"
              value={opts.headerTitle}
              onChange={e => onChange({ headerTitle: e.target.value })}
              placeholder="اردو لکھائی مشق"
              className="w-full border border-ink-200 rounded-xl px-3 py-2 text-sm font-nastaleeq text-right text-ink-800 focus:outline-none focus:border-brand-400 bg-white"
              style={{ fontFamily: '"Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", serif' }}
            />
          </div>
          <Toggle
            label="Student name line"
            checked={opts.headerStudentName}
            onChange={v => onChange({ headerStudentName: v })}
          />
          <Toggle
            label="Class / grade line"
            checked={opts.headerClass}
            onChange={v => onChange({ headerClass: v })}
          />
          <Toggle
            label="Date line"
            checked={opts.headerDate}
            onChange={v => onChange({ headerDate: v })}
          />
        </>
      )}

      <Divider />

      {/* ── Difficulty preset ── */}
      <SectionLabel>Level / مستوی</SectionLabel>
      <SelectGroup<DifficultyPreset>
        value={opts.difficultyPreset}
        columns={2}
        options={Object.entries(DIFFICULTY_PRESETS).map(([k, v]) => ({
          value: k as DifficultyPreset,
          label: v.label,
          labelSub: v.labelUrdu,
        }))}
        onChange={applyPreset}
      />

      <Divider />

      {/* ── Worksheet style ── */}
      <SectionLabel>Style / انداز</SectionLabel>
      <SelectGroup<WorksheetStyle>
        value={opts.worksheetStyle}
        columns={3}
        options={[
          { value: 'trace-only',  label: 'Trace',       labelSub: 'صرف خاکہ'   },
          { value: 'trace-blank', label: 'Trace+Line',  labelSub: 'خاکہ + خط' },
          { value: 'blank-only',  label: 'Blank',       labelSub: 'خالی'        },
        ]}
        onChange={ws => onChange({ worksheetStyle: ws })}
      />

      <Divider />

      {/* ── Advanced settings (collapsible) ── */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between py-2 text-xs font-medium text-ink-500 hover:text-ink-700 transition-colors"
      >
        <span>اضافی ترتیبات (Advanced settings)</span>
        <span className="text-ink-400">{showAdvanced ? '▲' : '▼'}</span>
      </button>

      {showAdvanced && <div className="flex flex-col gap-3">

      {/* ── Typography ── */}
      <SectionLabel>Typography / خط</SectionLabel>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-ink-600">Script style / خط</label>
        <div className="grid grid-cols-2 gap-1.5">
          {([
            { value: 'nastaleeq',    label: 'Nastaleeq', sub: 'نستعلیق', font: '"Jameel Noori Nastaleeq","Noto Nastaliq Urdu",serif', preview: 'اردو' },
            { value: 'naskh',        label: 'Naskh',     sub: 'نسخ',     font: '"Noto Naskh Arabic",sans-serif',                        preview: 'اردو' },
            { value: 'amiri',        label: 'Amiri',     sub: 'امیری',   font: '"Amiri",serif',                                          preview: 'اردو' },
            { value: 'scheherazade', label: 'Scheher..', sub: 'تعلیمی',  font: '"Scheherazade New",serif',                               preview: 'اردو' },
          ] as const).map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ fontStyle: opt.value as FontStyle })}
              className={clsx(
                'py-2 px-2 rounded-lg border transition-all text-center',
                opts.fontStyle === opt.value
                  ? 'bg-brand-600 border-brand-600 text-white'
                  : 'bg-white border-ink-200 hover:border-brand-400'
              )}
            >
              <span className="block text-xl leading-tight mb-1" style={{ fontFamily: opt.font }}>
                {opt.preview}
              </span>
              <span className="block text-[10px] font-medium">{opt.label}</span>
              <span className={clsx(
                'block text-[9px]',
                opts.fontStyle === opt.value ? 'text-brand-100' : 'text-ink-400'
              )}>
                {opt.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      <SelectGroup<TextFit>
        label="Long text / لمبا متن"
        value={opts.textFit}
        columns={2}
        options={[
          { value: 'wrap',   label: 'Wrap',   labelSub: 'اگلی سطر پر' },
          { value: 'shrink', label: 'Shrink', labelSub: 'چھوٹا کریں'  },
        ]}
        onChange={tf => onChange({ textFit: tf })}
      />
      <Slider
        label="Font size / حروف کا سائز"
        value={opts.fontSize}
        min={20} max={56} step={2} unit="pt"
        onChange={fs => onChange({ fontSize: fs, difficultyPreset: 'custom' })}
      />
      <Toggle
        label="Bold / موٹا"
        checked={opts.fontBold}
        onChange={fb => onChange({ fontBold: fb })}
      />

      <Divider />

      {/* ── Tracing ── */}
      <SectionLabel>Tracing / خاکہ</SectionLabel>
      <Slider
        label="Trace darkness / گہرائی"
        value={Math.round(opts.traceOpacity * 100)}
        min={20} max={75} unit="%"
        onChange={v => onChange({ traceOpacity: v / 100 })}
      />
      <SelectGroup<TraceColor>
        label="Trace color / رنگ"
        value={opts.traceColor}
        columns={3}
        options={[
          { value: 'gray', label: 'Gray',  labelSub: 'سرمئی'    },
          { value: 'blue', label: 'Blue',  labelSub: 'نیلا'     },
          { value: 'pink', label: 'Pink',  labelSub: 'گلابی'    },
        ]}
        onChange={tc => onChange({ traceColor: tc })}
      />

      <Divider />

      {/* ── Line & rows ── */}
      <SectionLabel>Lines / سطریں</SectionLabel>
      <Slider
        label="Row height / اونچائی"
        value={opts.rowHeight}
        min={50} max={110} step={2} unit="pt"
        onChange={rh => onChange({ rowHeight: rh, difficultyPreset: 'custom' })}
      />
      <SelectGroup<LineStyle>
        label="Line style / لکیر"
        value={opts.lineStyle}
        columns={3}
        options={[
          { value: 'solid',  label: 'Solid',  labelSub: 'مکمل'  },
          { value: 'dashed', label: 'Dashed', labelSub: 'نقطہ'  },
          { value: 'double', label: 'Double', labelSub: 'دوہری' },
        ]}
        onChange={ls => onChange({ lineStyle: ls })}
      />
      <SelectGroup<RulingStyle>
        label="Ruling / لکیریں"
        value={opts.rulingStyle}
        columns={3}
        options={[
          { value: 'single',    label: 'Single',   labelSub: 'ایک لکیر'     },
          { value: 'baseline',  label: 'Baseline', labelSub: 'بنیادی لکیر'  },
          { value: 'threeline', label: '3-Line',   labelSub: 'تین لکیریں'   },
        ]}
        onChange={rl => onChange({ rulingStyle: rl })}
      />

      <Divider />

      {/* ── Page ── */}
      <SectionLabel>Page / صفحہ</SectionLabel>
      <SelectGroup<PaperSize>
        label="Paper size"
        value={opts.paperSize}
        columns={2}
        options={[
          { value: 'a4',     label: 'A4',     labelSub: '210×297mm'  },
          { value: 'letter', label: 'Letter', labelSub: '8.5×11in'   },
        ]}
        onChange={ps => onChange({ paperSize: ps })}
      />

      </div>}{/* end showAdvanced */}

    </div>
  )
}
