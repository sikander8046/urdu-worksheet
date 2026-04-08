# اردو ورک شیٹ — Urdu Handwriting Worksheet Generator

Free, printable Urdu handwriting worksheets for teachers, parents and homeschoolers.
Nastaleeq font · RTL · Print-ready · Ad-supported

## Live site
→ https://urdusheets.com

---

## Tech stack
- **Next.js 14** (App Router, static export)
- **Tailwind CSS** — utility-first styling
- **TypeScript** — full type safety
- **Lucide React** — icons
- **Noto Nastaliq Urdu** — Google Fonts fallback (Jameel Noori Nastaleeq when installed)

## Features (MVP)
- [x] RTL Urdu text input with drag-to-reorder rows
- [x] Trace-only / Trace+blank / Blank-only worksheet modes
- [x] 5 difficulty presets: Playgroup → Class 4+
- [x] Font size, row height, trace color controls
- [x] A4 and Letter paper support
- [x] Header block: title, student name, class, date
- [x] 15 pre-built worksheets: Huroof, Quran, school vocabulary
- [x] Shareable URL — all settings encoded in URL params
- [x] WhatsApp share button
- [x] Print-ready CSS (hides all UI chrome)
- [x] AdSense slots ready (activate after approval)
- [x] About / Privacy Policy / Contact pages

## Project structure
```
app/
  layout.tsx          Root layout + metadata
  page.tsx            Home → GeneratorPage
  about/page.tsx      About (AdSense requirement)
  privacy-policy/     Privacy policy
  contact/            Contact
  sitemap.ts          Dynamic sitemap
  robots.ts           robots.txt
components/
  generator/
    GeneratorPage.tsx     Main two-panel shell
    TextRowsInput.tsx     RTL row input with reorder
    OptionsPanel.tsx      All style controls
    WorksheetPreview.tsx  The printable A4 renderer
  library/
    LibraryPanel.tsx      Pre-built content browser
  shared/
    Controls.tsx          Slider, Toggle, SelectGroup, Button
    AdSlot.tsx            AdSense placements
lib/
  types.ts            WorksheetOptions + defaults + presets
  library.ts          15 pre-built worksheet entries
  url-state.ts        URL encode/decode for shareable links
styles/
  globals.css         Nastaleeq font + print CSS
```

## Local development
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel (free)
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/urdu-worksheet.git
git push -u origin main

# 2. Import to Vercel
# Go to vercel.com → New Project → Import from GitHub
# Framework: Next.js (auto-detected)
# No env vars needed for MVP

# 3. Add custom domain
# Vercel dashboard → Domains → Add → urdusheets.com (or likhna.pk)
```

## Enable Google AdSense
1. Apply at https://adsense.google.com once site is live with 20+ pages of content
2. After approval, add your publisher ID to `components/shared/AdSlot.tsx`:
   ```ts
   const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'  // ← your ID here
   ```
3. Add AdSense script to `app/layout.tsx`:
   ```tsx
   <script
     async
     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossOrigin="anonymous"
   />
   ```
4. Replace slot IDs in `AdSlot.tsx` with your real slot IDs
5. Add `<SidebarAd />` to `GeneratorPage.tsx` (below the print button)

## V2 roadmap
- [ ] 30+ more pre-built worksheet pages (individual SEO landing pages)
- [ ] Virtual Urdu on-screen keyboard
- [ ] Direct PDF download (jsPDF)
- [ ] Font selector (Jameel / Noto / Nafees)
- [ ] WhatsApp viral share with worksheet preview image
- [ ] localStorage save ("My recent worksheets")

## License
MIT
