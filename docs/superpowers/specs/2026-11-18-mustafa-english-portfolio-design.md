# Mustafa English — Portfolio Website Design

## Intent & why

Mustafa Kambarov (`@mustafa__english` on Instagram, 556K followers) is an
English/IELTS tutor and content creator. His Instagram bio already funnels
followers to his Telegram channel (`t.me/ieltswithmustaffa`) for lessons.
He needs a standalone portfolio/marketing website that carries the same
energy as his content — a credible, modern "cool mentor" presence, not a
stuffy academic one — and ultimately drives visitors to join his Telegram
channel / courses.

This is a second, independent site added to this repo, alongside the
existing `portfolio-repo/` folder which is the repo owner's (Ziyoviddin's)
own personal portfolio. The two are unrelated and must not interfere with
each other.

## Goals

- A modern, highly energetic, stylish site: dark mode, vibrant neon
  accents (yellow / electric blue / orange), bold clean typography,
  minimalistic-but-dynamic layout — Dribbble-grade UI quality.
- Full written copy across 10 pages, Gen-Z / punchy / slightly humorous /
  motivating tone — "cool mentor," not "strict professor."
- Every page ultimately points toward one conversion goal: join the
  Telegram channel / community.
- Mobile-first — his actual audience finds him on Instagram/phones.

## Non-goals

- No backend, payments, auth, or real course-purchase flow. Everything is
  a static, content-only site; "enroll" / "join" actions link out to
  Telegram.
- No CMS — content lives in the React source as data, editable by hand.
- No attempt to replicate or scrape real photos/videos from his Instagram.
  We don't have rights to his media, and this session can't fetch
  Instagram content beyond the one screenshot already shared. Visuals use
  original illustration/gradient/shape work and placeholder avatar
  treatment, not downloaded photos.

## Anti-goals

- Must not read as a generic corporate/template portfolio.
- Must not read as a strict, textbook-grammar-teacher site.
- Testimonials ("Wall of Wins") are written copy in the requested voice,
  not real student quotes. They'll use clearly generic placeholder
  names/initials (e.g. "— A.K., IELTS 7.5") so nothing is presented as a
  verified real review. Mustafa swaps in real testimonials later.

## Constraints

- Repo currently has no build tooling at all (the existing site is a
  single static HTML file). This new project brings its own, self-
  contained toolchain and must not change anything under the existing
  `portfolio-repo/` folder.
- No real course pricing/curriculum details exist yet — copy will be
  written in the requested voice with illustrative (clearly placeholder)
  specifics, easy for Mustafa to edit later.

## Approaches considered

1. **Single scrolling page with anchored sections**, plain HTML/CSS/JS
   (matches the existing site's architecture). Rejected once React was
   chosen — building 10 content-rich sections as one page would be heavy,
   and the copy brief is explicitly framed as "10 pages."
2. **10 real routed pages in Next.js.** Gives SSR/SEO benefits, but adds a
   server-rendering model, routing conventions, and deploy complexity this
   static content site doesn't need.
3. **10 real routed pages, Vite + React + React Router** (chosen). Static
   output, fast dev loop, trivial to deploy anywhere (Netlify/Vercel/
   GitHub Pages/etc.), shared `Nav`/`Footer` components avoid the
   duplication a plain-HTML multi-page site would require.

Decided with the user: option 3.

## Decided (user-approved)

- **Stack:** Vite + React + `react-router-dom`, Tailwind CSS for styling,
  Framer Motion for motion/transitions.
- **Location:** new self-contained folder `mustafa-english/` at the repo
  root (sibling to `portfolio-repo/`), with its own `package.json`.
- **Structure:** 10 routed pages:
  1. `/` — Home
  2. `/about` — About Me
  3. `/methodology` — The Methodology
  4. `/courses` — Courses Overview
  5. `/ielts` — IELTS Zone
  6. `/speaking-club` — Speaking Club & Community
  7. `/content-hub` — Free Content Hub
  8. `/wins` — Wall of Wins (Testimonials)
  9. `/faq` — FAQ (with attitude)
  10. `/contact` — Contact / Join

  Persistent `Nav` (logo/name + links + a standing "Join Telegram" CTA
  button) and `Footer` (social links: Instagram, Telegram) wrap every
  route via a shared layout.
- **Visual language:** dark background, neon yellow / electric blue /
  orange as accent colors (not all three competing at once per section —
  one dominant accent + one secondary, picked per the builder's taste),
  bold large display type for headings, clean sans body type.

## Left to the builder

- Exact color tokens, font choices (Google Fonts, free), and spacing/
  type scale.
- All page copy, written in the specified voice, for all 10 pages.
- Component breakdown, animation details (Framer Motion usage: hover
  states, page/section transitions, scroll reveals), and responsive
  behavior.
- Any illustration/shape/gradient treatment used in place of real photos.
- Favicon/branding basics (e.g. a simple wordmark/logo treatment for
  "Mustafa English").
