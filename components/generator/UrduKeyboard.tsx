'use client'
import React, { useState } from 'react'
import clsx from 'clsx'

interface UrduKeyboardProps {
  onChar: (char: string) => void
  onBackspace: () => void
  onClose: () => void
}

const KEYBOARD_ROWS = [
  ['ض','ص','ث','ق','ف','غ','ع','ہ','خ','ح','ج','چ'],
  ['ش','س','ی','ب','ل','ا','ت','ن','م','ک','گ','د'],
  ['ۃ','ز','ڑ','ر','ذ','و','ط','ظ','پ','ٹ','ڈ','ء'],
  ['۔','،','؟','!','ۓ','ے','ی','آ','أ','إ',' '],
]

const DIACRITICS = ['َ','ِ','ُ','ْ','ّ','ً','ٍ','ٌ','ٰ']

export function UrduKeyboard({ onChar, onBackspace, onClose }: UrduKeyboardProps) {
  const [showDiacritics, setShowDiacritics] = useState(false)

  return (
    <div className="bg-ink-100 border-t border-ink-200 p-2">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setShowDiacritics(!showDiacritics)}
          className={clsx(
            'text-xs px-2 py-1 rounded-lg border transition-colors',
            showDiacritics
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white border-ink-300 text-ink-600'
          )}
        >
          اعراب
        </button>
        <span className="text-xs text-ink-400 font-medium">اردو کی بورڈ</span>
        <button
          onClick={onClose}
          className="text-xs px-2 py-1 rounded-lg bg-white border border-ink-300 text-ink-600"
        >
          بند
        </button>
      </div>

      {showDiacritics && (
        <div className="flex gap-1 flex-wrap mb-2 justify-end">
          {DIACRITICS.map((d, i) => (
            <button
              key={i}
              onClick={() => onChar(d)}
              className="w-8 h-8 bg-white border border-ink-300 rounded text-sm hover:bg-brand-50 hover:border-brand-400 active:scale-95 transition-all"
              style={{ fontFamily: '"Noto Nastaliq Urdu","Jameel Noori Nastaleeq",serif' }}
            >
              ب{d}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1 justify-center flex-row-reverse">
            {row.map((key, ki) => (
              <button
                key={ki}
                onClick={() => onChar(key)}
                className={clsx(
                  'h-9 bg-white border border-ink-300 rounded-lg text-base',
                  'hover:bg-brand-50 hover:border-brand-400 active:scale-95 transition-all text-ink-800',
                  key === ' ' ? 'flex-1 text-xs text-ink-400' : 'w-9'
                )}
                style={{ fontFamily: '"Noto Nastaliq Urdu","Jameel Noori Nastaleeq",serif' }}
              >
                {key === ' ' ? 'space' : key}
              </button>
            ))}
          </div>
        ))}
        <div className="flex gap-1 mt-1">
          <button
            onClick={onBackspace}
            className="flex-1 h-9 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium hover:bg-red-100 active:scale-95 transition-all"
          >
            ← حذف
          </button>
        </div>
      </div>
    </div>
  )
}
