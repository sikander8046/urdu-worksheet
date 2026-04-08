'use client'
import React, { useEffect, useRef } from 'react'
import { WorksheetOptions, RulingStyle } from '@/lib/types'

interface WorksheetRowCanvasProps {
  text: string
  showText: boolean
  showBlankBelow: boolean
  fontSize: number
  fontBold: boolean
  fontFamily: string
  traceColor: string
  traceOpacity: number
  rowHeight: number
  rulingStyle: RulingStyle
  lineStyle: WorksheetOptions['lineStyle']
  paperWidthPx: number
  textFit: 'wrap' | 'shrink'
}

export function WorksheetRowCanvas({
  text,
  showText,
  showBlankBelow,
  fontSize,
  fontBold,
  fontFamily,
  traceColor,
  traceOpacity,
  rowHeight,
  rulingStyle,
  lineStyle,
  paperWidthPx,
  textFit,
}: WorksheetRowCanvasProps) {
  const traceRef = useRef<HTMLCanvasElement>(null)
  const blankRef = useRef<HTMLCanvasElement>(null)

  const DPR = 3

  async function drawRow(
    canvas: HTMLCanvasElement,
    drawText: boolean,
    fit: 'wrap' | 'shrink' = 'wrap'
  ) {
    // EC4: Canvas guard
    if (!canvas || !canvas.getContext) return

    const W = paperWidthPx
    const weight = fontBold ? 'bold' : 'normal'
    const fontStr = `${weight} ${fontSize}pt ${fontFamily}`

    // EC5: Font loading with fallback
    let activeFont = fontStr
    if (typeof document !== 'undefined') {
      try {
        await document.fonts.load(`${weight} ${fontSize}pt ${fontFamily}`)
        if (!document.fonts.check(`${weight} ${fontSize}pt ${fontFamily}`)) {
          activeFont = `${weight} ${fontSize}pt "Noto Naskh Arabic", serif`
        }
      } catch (_) {
        activeFont = `${weight} ${fontSize}pt serif`
      }
    }

    // Set initial canvas size for measurement phase
    canvas.width  = W * DPR
    canvas.height = rowHeight * DPR
    canvas.style.width  = W + 'px'
    canvas.style.height = rowHeight + 'px'

    const ctx = canvas.getContext('2d')!
    ctx.scale(DPR, DPR)
    ctx.font = activeFont

    // ── Measure real font metrics ─────────────────
    const metrics = ctx.measureText('یے وجچحخ گی ے')
    const rawAscent  = metrics.actualBoundingBoxAscent  || fontSize * 0.8
    const rawDescent = metrics.actualBoundingBoxDescent || fontSize * 0.3

    const ptSize = fontSize
    const safetyMult = 1.0 + Math.max(0, (ptSize - 24) / 32) * 0.35
    let ascent = rawAscent * safetyMult

    const descentMult = 1.0 + Math.max(0, (ptSize - 20) / 20) * 0.6
    let descent = Math.max(rawDescent * descentMult, ptSize * 0.45)

    // EC3: If text zone exceeds row height, scale down font for metric calc
    const maxZoneH = rowHeight * 0.85
    if (ascent + descent > maxZoneH) {
      const scale = maxZoneH / (ascent + descent)
      const scaledSize = Math.floor(fontSize * scale)
      ctx.font = `${weight} ${scaledSize}pt ${fontFamily}`
      const sm = ctx.measureText('یے وجچحخ گی ے')
      ascent  = (sm.actualBoundingBoxAscent  || scaledSize * 0.8) * safetyMult
      descent = Math.max(
        (sm.actualBoundingBoxDescent || scaledSize * 0.3) * descentMult,
        scaledSize * 0.45
      )
      ctx.font = activeFont  // restore for text drawing
    }

    // ── Calculate positions ───────────────────────
    const writingZoneH = ascent + descent
    const topPad = Math.max(fontSize * 0.15, (rowHeight - writingZoneH) * 0.35)
    const baselineY = Math.min(topPad + ascent, rowHeight - descent - 4)
    const maxWidth = W - 8

    // ── Pre-compute wrap lines (for EC6 height expansion) ─
    let lines: string[] = []
    if (drawText && text.trim() && fit === 'wrap') {
      const words = text.split(' ')
      let currentLine = ''
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word
        if (ctx.measureText(testLine).width > maxWidth && currentLine !== '') {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      if (currentLine) lines.push(currentLine)
    }

    // ── EC6: Compute final canvas height ──────────
    const lineH = (ascent + descent) * 1.15
    let H = rowHeight
    if (lines.length > 1) {
      const requiredH = topPad + (lines.length * lineH) + (descent * 1.3)
      if (requiredH > H) H = Math.ceil(requiredH)
    }

    // ── Set final canvas dimensions ───────────────
    // (resize resets ctx state, so re-setup below)
    canvas.width  = W * DPR
    canvas.height = H * DPR
    canvas.style.width  = W + 'px'
    canvas.style.height = H + 'px'
    ctx.scale(DPR, DPR)
    ctx.clearRect(0, 0, W, H)
    ctx.font = activeFont

    // ── Draw ruling lines ─────────────────────────
    function drawRuling() {
      const lineDash = lineStyle === 'dashed' ? [4, 4] : []
      ctx.setLineDash(lineDash)
      ctx.strokeStyle = '#c0c0c0'
      ctx.lineWidth   = 0.75

      if (rulingStyle === 'threeline') {
        ctx.beginPath()
        ctx.moveTo(0, topPad)
        ctx.lineTo(W, topPad)
        ctx.stroke()
      }

      if (rulingStyle === 'threeline' || rulingStyle === 'baseline') {
        const ceilY = baselineY - ascent
        ctx.beginPath()
        ctx.moveTo(0, ceilY)
        ctx.lineTo(W, ceilY)
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.moveTo(0, baselineY)
      ctx.lineTo(W, baselineY)
      ctx.stroke()

      ctx.setLineDash([])
    }

    drawRuling()

    // ── Draw text ─────────────────────────────────
    if (drawText && text.trim()) {
      ctx.fillStyle = traceColor
      ctx.globalAlpha = traceOpacity
      ctx.direction = 'rtl'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'alphabetic'

      if (fit === 'shrink') {
        // Shrink font until text fits on one line
        let fitFontSize = fontSize
        while (fitFontSize > 8) {
          if (ctx.measureText(text).width <= maxWidth) break
          fitFontSize -= 1
          ctx.font = `${weight} ${fitFontSize}pt ${fontFamily}`
        }
        ctx.fillText(text, W - 4, baselineY)
      } else {
        // EC2: Single word exceeding width — force shrink it
        if (lines.length === 1 && ctx.measureText(lines[0]).width > maxWidth) {
          let fitSize = fontSize
          while (fitSize > 8) {
            ctx.font = `${weight} ${fitSize}pt ${fontFamily}`
            if (ctx.measureText(lines[0]).width <= maxWidth) break
            fitSize -= 1
          }
        }

        // Wrap — draw each line below the previous
        const availableH = H - topPad - (descent * 1.2)
        const actualLineH = (lines.length * lineH) > availableH
          ? availableH / lines.length
          : lineH

        lines.forEach((line, idx) => {
          const lineY = baselineY + (idx * actualLineH)
          if (lineY + descent < H + descent) {
            ctx.fillText(line, W - 4, lineY)
          }
        })
      }
      ctx.globalAlpha = 1
    }
  }

  useEffect(() => {
    if (traceRef.current) {
      (async () => {
        await drawRow(traceRef.current!, showText, textFit)
      })()
    }
  }, [
    text, showText, fontSize, fontBold, fontFamily,
    traceColor, traceOpacity, rowHeight, rulingStyle,
    lineStyle, paperWidthPx, textFit
  ])

  useEffect(() => {
    if (blankRef.current && showBlankBelow) {
      (async () => {
        await drawRow(blankRef.current!, false, textFit)
      })()
    }
  }, [
    showBlankBelow, fontSize, fontBold, fontFamily,
    rowHeight, rulingStyle, lineStyle, paperWidthPx, textFit
  ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <canvas ref={traceRef} style={{ display: 'block' }} />
      {showBlankBelow && (
        <canvas ref={blankRef} style={{ display: 'block' }} />
      )}
    </div>
  )
}
