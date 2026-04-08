import { MetadataRoute } from 'next'
import { WORKSHEET_PAGES } from '@/lib/worksheet-pages'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://urdusheets.com'

  const staticPages = [
    { url: base,                    priority: 1.0,  changeFrequency: 'weekly'  as const },
    { url: `${base}/worksheets`,    priority: 0.9,  changeFrequency: 'weekly'  as const },
    { url: `${base}/about`,         priority: 0.5,  changeFrequency: 'monthly' as const },
    { url: `${base}/privacy-policy`,priority: 0.3,  changeFrequency: 'yearly'  as const },
    { url: `${base}/contact`,       priority: 0.4,  changeFrequency: 'monthly' as const },
  ]

  const worksheetPages = WORKSHEET_PAGES.map(page => ({
    url: `${base}/worksheets/${page.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }))

  return [
    ...staticPages,
    ...worksheetPages,
  ].map(page => ({
    ...page,
    lastModified: new Date(),
  }))
}
