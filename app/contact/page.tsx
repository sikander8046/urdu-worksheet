import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact — اردو ورک شیٹ',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ink-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav className="bg-white border-b border-ink-200 px-6 py-3">
        <Link href="/" className="text-sm font-bold text-ink-900 hover:text-brand-700 transition-colors">
          ← اردو ورک شیٹ
        </Link>
      </nav>
      <main className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">Contact</h1>
        <p className="text-ink-500 mb-8">رابطہ کریں — We'd love to hear from you.</p>

        <div className="bg-white rounded-2xl border border-ink-200 p-6 space-y-4">
          <p className="text-ink-600 text-sm leading-relaxed">
            Have a suggestion for the worksheet library? Found a bug? Want to request a feature?
            Send us a message and we'll get back to you.
          </p>
          <a
            href="mailto:hello@urdusheets.com"
            className="inline-flex items-center gap-2 text-brand-600 font-medium hover:underline text-sm"
          >
            hello@urdusheets.com
          </a>
          <p className="text-xs text-ink-400 pt-2">
            Response time: 1–3 business days.
          </p>
        </div>
      </main>
    </div>
  )
}
