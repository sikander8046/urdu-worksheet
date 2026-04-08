import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — اردو ورک شیٹ',
  description: 'Free Urdu handwriting worksheet generator for teachers, parents and homeschoolers.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Nav */}
      <nav className="bg-white border-b border-ink-200 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-ink-900 hover:text-brand-700 transition-colors">
          ← اردو ورک شیٹ
        </Link>
        <span className="text-xs text-ink-400">Urdu Worksheet Generator</span>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">About</h1>
        <p className="text-ink-500 mb-8">اردو ورک شیٹ جنریٹر کے بارے میں</p>

        <div className="prose prose-ink space-y-6 text-ink-700 leading-relaxed">
          <p>
            <strong>اردو ورک شیٹ</strong> was built by a Pakistani educator and parent who
            homeschools his children and couldn&apos;t find a proper Urdu handwriting tool that
            worked the way Pakistani teachers actually teach — with authentic Nastaleeq script,
            proper 2-line ruling, and worksheets that print correctly on A4 paper.
          </p>

          <p>
            Every worksheet uses the same ruling system found in Pakistani school notebooks — two
            guide lines per row, with letters sitting on the baseline and descenders hanging freely
            below. Four fonts are available: from traditional Nastaleeq for qalam practice to clean
            Naskh for pencil tracing.
          </p>

          <p>
            The tool is used by teachers, parents, and madrassa educators across Pakistan and the
            Pakistani diaspora in UK, USA, Canada and Australia.
          </p>

          <h2 className="text-xl font-semibold text-ink-800 mt-8">Who is this for?</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>School teachers preparing Urdu writing exercises</li>
            <li>Parents and homeschoolers teaching Urdu at home</li>
            <li>Madrassa teachers creating Quran and dua practice sheets</li>
            <li>Pakistani diaspora families teaching Urdu abroad</li>
          </ul>

          <h2 className="text-xl font-semibold text-ink-800 mt-8">Features</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Authentic Nastaleeq (نستعلیق) font rendering</li>
            <li>5 difficulty levels — Playgroup to Class 4+</li>
            <li>Pre-built library: Huroof, Quran surahs, school vocabulary</li>
            <li>Shareable links — send a worksheet to parents via WhatsApp</li>
            <li>Print-ready A4 and Letter paper sizes</li>
            <li>100% free, no account required</li>
          </ul>

          <h2 className="text-xl font-semibold text-ink-800 mt-8">Contact</h2>
          <p>
            Questions or suggestions?{' '}
            <Link href="/contact" className="text-brand-600 hover:underline">Get in touch</Link>.
          </p>
        </div>
      </main>
    </div>
  )
}
