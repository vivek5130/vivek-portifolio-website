# Ganathe Vivek — Full Stack AI Engineer

Interactive portfolio built with **Next.js 16 · React 19 · TypeScript · Three.js · React Three Fiber · Framer Motion · Lenis**, with an AI chat assistant powered by **Gemini**.

## Run

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY to enable AI answers
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

`npm run lint` and `npm run typecheck` should both pass cleanly.

## Edit your content

| What | Where |
|---|---|
| All résumé content (experience, projects, skills, education, links) | `lib/data.ts` |
| Chat quick replies + extra notes the AI should know | `lib/knowledge.ts` (`quickReplies`, `extraContext`) |
| Portrait | `public/vivek-portrait-hd.png` (subtle slate-blue duotone, transparent cut-out) |
| Résumé PDF | `public/Vivek_Ganathe_Resume.pdf` |

## What's inside

- `components/three/NeuralField.tsx` — fixed 3D neural volume behind the page: rotates and dollies with scroll, neurons drift toward the cursor with bright pointer links, spontaneous firing, click/tap bursts, plus wireframe crystals that spin on scroll and parallax with the cursor.
- `components/skills/TechGraph.tsx` — interactive technology graph (Skills): real brand logos (Simple Icons, CC0 — generated into `lib/techIcons.ts`), meaningful connections, hover to trace and label links.
- `components/hero/Portrait.tsx` — subtle duotone cut-out portrait with a gentle glow and a minimal, seeded neural aura with depth parallax.
- `components/chat/ChatWidget.tsx` + `app/api/chat/route.ts` — bottom-right assistant. Quick replies answer instantly; typed questions stream from Gemini, grounded in `lib/knowledge.ts`. Without an API key it falls back to keyword answers.
- `components/chrome/` — HUD navigation, section rail, ⌘K command palette, smooth scroll.
- `components/ui/diagrams.tsx` — animated SVG systems map and project schematics.

## Notes

- **Chat cost & safety:** the API route caps message length and history, and rate-limits per IP (in-memory; use a shared store such as Upstash if you deploy to many serverless instances). Set `GEMINI_MODEL` to change models (default `gemini-2.0-flash`).
- `prefers-reduced-motion` disables smooth scroll, parallax and continuous 3D animation; WebGL scenes pause when off-screen.
