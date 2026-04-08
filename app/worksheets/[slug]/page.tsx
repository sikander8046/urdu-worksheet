import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { WORKSHEET_PAGES } from '@/lib/worksheet-pages'
import { WorksheetLandingPage } from '@/components/pages/WorksheetLandingPage'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return WORKSHEET_PAGES.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = WORKSHEET_PAGES.find(p => p.slug === slug)
  if (!page) return {}
  return {
    title: `${page.titleUrdu} | اردو ورک شیٹ`,
    description: page.metaDescription,
    keywords: page.keywords.join(', '),
  }
}

export default async function WorksheetPage({ params }: Props) {
  const { slug } = await params
  const page = WORKSHEET_PAGES.find(p => p.slug === slug)
  if (!page) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalMaterial',
    'name': page.titleEn,
    'description': page.metaDescription,
    'educationalLevel': 'Kindergarten, Primary School',
    'inLanguage': 'ur',
    'isAccessibleForFree': true,
    'url': `https://www.urdusheets.com/worksheets/${page.slug}`,
    'provider': {
      '@type': 'Organization',
      'name': 'urdusheets.com',
      'url': 'https://www.urdusheets.com',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorksheetLandingPage data={page} />
    </>
  )
}
