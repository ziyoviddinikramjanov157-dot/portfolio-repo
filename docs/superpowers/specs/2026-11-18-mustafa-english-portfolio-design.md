# Mustafa English — Portfolio Website Design

## Intent & why

Mustafa Kambarov (`@mustafa__english` on Instagram, 556K followers,
IELTS Speaking 8.0) is an English teacher who sells online Speaking
courses and runs a "ko‘proq dars qilish" (study-more) marathon split into
seasons. His Instagram content is about discipline (intizom), and his bio
sends people to his Telegram channel (`t.me/ieltswithmustaffa`).

The site is being built by one of his students as a draft to show him.
It goes live under his name only once he agrees.

## Goals

- 10 routed pages, all copy in Uzbek (Latin script).
- Serious, disciplined tone: confident and direct, no jokes or Gen-Z slang.
  Core message: speaking fluency comes from daily, disciplined practice.
- Every page leads to one action: enroll via Telegram.
- Mobile-first; his audience finds him on Instagram.

## Non-goals

- No payments, backend, auth or forms. Enrollment works the way it does
  today: the student writes on Telegram and pays by card.
- No CMS; content lives in `src/data/` and the page components.
- No photos or videos taken from his Instagram; photo slots are
  placeholders until he provides images.

## Anti-goals

- Nothing playful or "cool mentor"; this replaces the earlier Gen-Z brief.
- No invented facts about a real person. Unknown specifics (prices,
  durations, season dates and counts, student results) appear as `[ ]`
  placeholders. Testimonials are labelled "Namuna" (sample) until real
  ones replace them.

## Approaches considered

1. Single scrolling page in plain HTML (like the repo's existing site).
   Rejected: the brief is 10 pages, and the user chose React.
2. Next.js. Rejected: SSR and server routing add nothing to a static
   content site.
3. **Vite + React + React Router (chosen).** Static output, shared
   layout components, deployable to any static host.

## Decided

- **Stack:** Vite, React, `react-router`, Tailwind CSS v4, `motion` for
  subtle reveal animations (respects reduced-motion).
- **Location:** `mustafa-english/` at the repo root, self-contained; the
  existing `portfolio-repo/` site is untouched.
- **Pages and routes:**
  1. `/` — Bosh sahifa
  2. `/haqimda` — Men haqimda
  3. `/metodika` — Metodika
  4. `/kurslar` — Speaking kurslari
  5. `/ielts` — IELTS
  6. `/marafon` — Marafon (seasons; replaces the earlier "Speaking Club")
  7. `/bepul-darslar` — Bepul darslar
  8. `/natijalar` — Natijalar
  9. `/savollar` — Savol-javob
  10. `/aloqa` — Aloqa / Kursga yozilish
- **Look:** dark background, one restrained gold accent (a serious take on
  the original "yellow" option), strong sans-serif headings.
- **Enroll links** all come from one config value, pointing to the
  Telegram channel until an admin/bot link is provided.

## Open (decide later)

- Hosting: separate site vs. a sub-path of the existing GitHub Pages
  site. Routing uses `BrowserRouter`, so the host needs an SPA fallback
  (or a basename for a sub-path).
- Marathon details: number of seasons, dates, format and results.
