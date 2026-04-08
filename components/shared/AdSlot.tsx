'use client'
import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'

// ─── Replace these with your real AdSense values after approval ───────────────
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'  // Your AdSense publisher ID

interface AdSlotProps {
  slot: string                    // Ad unit slot ID from AdSense
  format?: 'auto' | 'rectangle'  // Ad format
  className?: string
  label?: boolean                 // Show "Advertisement" label above
}

export function AdSlot({ slot, format = 'auto', className, label = true }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    // Only push once AdSense script is loaded
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (_) {}
    }
  }, [])

  // Don't render ads in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={clsx(
        'no-print flex items-center justify-center bg-ink-100 border border-dashed border-ink-300 rounded-xl text-xs text-ink-400',
        format === 'rectangle' ? 'h-[250px] w-[300px]' : 'h-[90px] w-full',
        className
      )}>
        Ad Placeholder ({slot})
      </div>
    )
  }

  return (
    <div className={clsx('no-print', className)}>
      {label && (
        <p className="text-[9px] text-ink-300 text-center mb-0.5 uppercase tracking-widest">
          Advertisement
        </p>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// ─── Pre-configured ad placements ─────────────────────────────────────────────

export function HeaderAd() {
  return (
    <AdSlot
      slot="1234567890"   // Replace with real slot ID
      format="auto"
      className="w-full max-w-[728px] mx-auto my-2"
      label={false}
    />
  )
}

export function SidebarAd() {
  return (
    <AdSlot
      slot="0987654321"   // Replace with real slot ID
      format="rectangle"
      className="mx-auto"
    />
  )
}

export function InFeedAd() {
  return (
    <AdSlot
      slot="1122334455"   // Replace with real slot ID
      format="auto"
      className="w-full my-2"
    />
  )
}
