import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — اردو ورک شیٹ',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ink-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav className="bg-white border-b border-ink-200 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-ink-900 hover:text-brand-700 transition-colors">
          ← اردو ورک شیٹ
        </Link>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12 text-ink-700 leading-relaxed space-y-6">
        <h1 className="text-3xl font-bold text-ink-900">Privacy Policy</h1>
        <p className="text-ink-500 text-sm">Last updated: {new Date().getFullYear()}</p>

        <p>
          اردو ورک شیٹ ("we", "us") operates this website. This page informs you of our
          policies regarding the collection and use of information.
        </p>

        <h2 className="text-xl font-semibold text-ink-800">Information We Collect</h2>
        <p>
          We do not collect any personally identifiable information. All worksheet content
          you type stays in your browser and is never sent to our servers. Worksheet settings
          are stored only in the URL of your browser.
        </p>

        <h2 className="text-xl font-semibold text-ink-800">Google AdSense</h2>
        <p>
          This website uses Google AdSense to display advertisements. Google AdSense uses
          cookies to serve ads based on a user's prior visits to this website or other websites.
          You may opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Google Ad Settings
          </a>.
        </p>
        <p>
          Google's use of advertising cookies enables it and its partners to serve ads based
          on your visit to this and/or other sites on the internet. For more information about
          Google's privacy practices, see the{' '}
          <a href="https://policies.google.com/privacy" className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Google Privacy Policy
          </a>.
        </p>

        <h2 className="text-xl font-semibold text-ink-800">Analytics</h2>
        <p>
          We may use Google Analytics to understand how visitors use the site. This data is
          aggregated and anonymous. No personal information is stored.
        </p>

        <h2 className="text-xl font-semibold text-ink-800">Cookies</h2>
        <p>
          This website uses cookies only for advertising purposes through Google AdSense.
          You can instruct your browser to refuse all cookies or to indicate when a cookie
          is being sent.
        </p>

        <h2 className="text-xl font-semibold text-ink-800">Children's Privacy</h2>
        <p>
          Our service is intended for use by teachers and parents. We do not knowingly
          collect personal information from children under 13.
        </p>

        <h2 className="text-xl font-semibold text-ink-800">Contact</h2>
        <p>
          If you have questions about this Privacy Policy, please{' '}
          <Link href="/contact" className="text-brand-600 hover:underline">contact us</Link>.
        </p>
      </main>
    </div>
  )
}
