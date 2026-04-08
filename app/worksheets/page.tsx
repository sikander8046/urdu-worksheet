import type { Metadata } from 'next'
import Link from 'next/link'
import { WORKSHEET_PAGES } from '@/lib/worksheet-pages'

export const metadata: Metadata = {
  title: 'Free Urdu Handwriting Worksheets | اردو ورک شیٹس',
  description: 'Free printable Urdu handwriting worksheets for teachers and parents. Huroof, Quran surahs, school vocabulary and more. Download PDF instantly.',
}

const CATEGORIES = [
  { id: 'islamic', label: 'Islamic / اسلامی',
    slugs: ['bismillah', 'surah-al-fatiha', 'surah-al-ikhlas', 'kalima-tayyiba', 'asma-ul-husna', 'daily-duas'] },
  { id: 'alphabet', label: 'Alphabet / حروف',
    slugs: ['huroof-e-tahaji'] },
  { id: 'school', label: 'School / اسکول',
    slugs: ['urdu-numbers', 'days-of-week', 'months-of-year', 'colours-urdu', 'body-parts', 'animals-urdu', 'fruits-urdu'] },
  { id: 'poems', label: 'Poems / نظمیں',
    slugs: ['lab-pe-aati-hai'] },
]

export default function WorksheetsPage() {
  return (
    <div
      className="min-h-screen bg-ink-50"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <nav className="bg-white border-b border-ink-200 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-ink-900 hover:text-brand-600">
          ← اردو ورک شیٹ
        </Link>
        <span className="text-xs text-ink-400">
          {WORKSHEET_PAGES.length} free worksheets
        </span>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">
          Free Urdu Handwriting Worksheets
        </h1>
        <p className="text-ink-600 mb-8">
          Print-ready Urdu worksheets for teachers, parents and homeschoolers.
          All worksheets are free and open instantly in the generator.
        </p>

        {CATEGORIES.map(cat => {
          const pages = WORKSHEET_PAGES.filter(p => cat.slugs.includes(p.slug))
          if (pages.length === 0) return null
          return (
            <div key={cat.id} className="mb-8">
              <h2 className="text-lg font-semibold text-ink-800 mb-3 border-b border-ink-200 pb-2">
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {pages.map(page => (
                  <Link
                    key={page.slug}
                    href={`/worksheets/${page.slug}`}
                    className="bg-white border border-ink-200 rounded-xl p-4 hover:border-brand-400 hover:shadow-sm transition-all group"
                  >
                    <p
                      className="text-base text-ink-800 text-right mb-1"
                      dir="rtl"
                      style={{ fontFamily: '"Noto Nastaliq Urdu", serif', lineHeight: 2 }}
                    >
                      {page.titleUrdu}
                    </p>
                    <p className="text-xs text-ink-500 group-hover:text-brand-600 transition-colors">
                      {page.titleEn} →
                    </p>
                    <p className="text-[10px] text-ink-400 mt-1">
                      {page.lines.length} lines · Free PDF
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </main>

      <footer className="border-t border-ink-200 bg-white px-4 py-6 text-center text-xs text-ink-400 mt-8">
        <Link href="/" className="hover:text-brand-600">← Back to Generator</Link>
        {' · '}
        <Link href="/about" className="hover:text-brand-600">About</Link>
        {' · '}
        <Link href="/privacy-policy" className="hover:text-brand-600">Privacy</Link>
      </footer>
    </div>
  )
}
