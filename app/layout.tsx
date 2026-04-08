import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'اردو ورک شیٹ | Urdu Handwriting Worksheet Generator',
  description: 'مفت اردو لکھائی ورک شیٹ بنائیں — Free Urdu handwriting practice worksheet generator for teachers and parents. Print-ready Nastaleeq worksheets.',
  keywords: 'urdu worksheet, اردو ورک شیٹ, urdu handwriting, اردو لکھائی, nastaleeq, tracing worksheet',
  openGraph: {
    title: 'اردو ورک شیٹ Generator',
    description: 'Free Urdu handwriting practice worksheets — Nastaleeq font, print-ready',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ur" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
