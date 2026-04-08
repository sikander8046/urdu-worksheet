# CLAUDE.md — Urdu Worksheet Generator

## What this is
A Next.js 14 (App Router, static export) web app that generates printable Urdu Nastaleeq handwriting worksheets. Live at https://urdusheets.com.

## Commands
```bash
npm run dev      # development server → http://localhost:3000
npm run build    # static export → out/
npm run lint     # ESLint
```

## Architecture
- **Static export** (`output: 'export'` in `next.config.js`) — no server-side rendering, no API routes. Everything runs in the browser.
- All worksheet state lives in `WorksheetOptions` (`lib/types.ts`) and is encoded into URL params (`lib/url-state.ts`) for shareable links.
- The main UI is a two-panel layout: left panel (controls) + right panel (live preview) in `components/generator/GeneratorPage.tsx`.

## Key files
| File | Purpose |
|------|---------|
| `lib/types.ts` | `WorksheetOptions` interface, defaults, difficulty presets, trace colors |
| `lib/library.ts` | 15 pre-built worksheet entries |
| `lib/url-state.ts` | Encode/decode all options to/from URL query params |
| `components/generator/WorksheetPreview.tsx` | The printable A4/Letter renderer — this is what gets printed |
| `components/generator/OptionsPanel.tsx` | All style/layout controls |
| `components/generator/TextRowsInput.tsx` | RTL Urdu text input with drag-to-reorder |
| `components/shared/Controls.tsx` | Shared UI primitives: Slider, Toggle, SelectGroup, Button |
| `components/shared/AdSlot.tsx` | Google AdSense placements (inactive until publisher ID added) |
| `styles/globals.css` | Nastaleeq font import + print CSS (hides all UI chrome on print) |

## RTL / Urdu specifics
- All text input and preview is **right-to-left**. Use `dir="rtl"` on relevant elements.
- Font: **Noto Nastaliq Urdu** (Google Fonts). Jameel Noori Nastaleeq is used if installed locally.
- Font size is in **pt**, row height in **pt** — these map directly to print dimensions.
- Worksheet styles: `trace-only`, `trace-blank` (trace + blank practice line), `blank-only`.

## Worksheet options shape
Defined in `lib/types.ts` as `WorksheetOptions`. Key fields:
- `rows: WorksheetRow[]` — the Urdu text lines
- `worksheetStyle`, `difficultyPreset`
- `fontSize` (20–56 pt), `fontBold`, `traceOpacity` (0.2–0.8), `traceColor`
- `rowHeight` (50–110 pt), `lineStyle`, `rowsPerPage`
- `paperSize` ('a4' | 'letter'), header fields

## Adding pre-built worksheets
Add entries to the array in `lib/library.ts`. Each entry has a title (Urdu + English), category, and `rows: WorksheetRow[]`.

## Print behavior
Print CSS is in `styles/globals.css`. On print, all UI chrome (controls, buttons, ads) is hidden via `@media print`. Only `WorksheetPreview` renders.

## AdSense (not yet active)
To activate: add publisher ID to `components/shared/AdSlot.tsx` and add the AdSense `<script>` tag to `app/layout.tsx`. See README for full steps.

## Deployment
Vercel, static export. No environment variables required for MVP. `vercel.json` is present for config.
