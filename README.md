# Xiu Gu — Portfolio (skeleton)

A Next.js (App Router) + Tailwind v4 + Motion starting point for a UX/interaction
design portfolio. It's wired for the interaction patterns we discussed: kinetic
hero, scroll-triggered reveals, staggered content, magnetic hover, a route-enter
transition, and a scroll-progress hairline — all reduced-motion aware.

## Run it

Requires Node 20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> If install gives you any version friction, the most robust path is to scaffold
> a fresh app and copy `src/` over:
> ```bash
> npx create-next-app@latest xiu-portfolio --yes
> ```
> then `npm i motion geist`, replace `src/`, and copy the config files.

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com) — zero config.
As a student you can host on a custom domain for free via Framer's student plan if
you ever go that route, but for a code build Vercel's free tier is the natural home.

## Structure

```
src/
  app/
    layout.tsx              fonts, nav, footer, metadata
    template.tsx            route-enter transition (re-mounts per navigation)
    globals.css             design tokens (@theme), base styles, ambient drift
    page.tsx                home: Hero + WorkIndex
    about/page.tsx          stub — write your story
    contact/page.tsx        stub — set real links
    work/[slug]/page.tsx    case study template (static-generated per project)
  components/
    Hero.tsx                kinetic headline + ambient blobs
    WorkIndex.tsx           editorial indexed list of projects
    SiteNav.tsx             sticky nav
    motion/
      Reveal.tsx            scroll-triggered fade + rise
      Stagger.tsx           orchestrated sequential reveals
      Magnetic.tsx          cursor-following spring
      ScrollProgress.tsx    cool→warm scroll hairline
  lib/
    projects.ts             all project data + case study copy
```

## Where to edit

- **Content** lives in `src/lib/projects.ts`. Add/edit projects there and both the
  home index and the case study pages update automatically.
- **Visual tokens** (color, fonts) live in the `@theme` block of
  `src/app/globals.css`. Change `--color-*` / `--font-*` to re-skin the whole site.
- **Covers** are color-block placeholders. Drop real images in `/public` and swap
  the placeholder `div` in `work/[slug]/page.tsx` for `next/image`.

## Animation notes

- Every motion primitive checks `useReducedMotion()` and degrades to a plain fade
  (or nothing) when a visitor has "reduce motion" enabled. Keep this when you extend.
- `template.tsx` handles **enter** transitions. Full **enter + exit** choreography
  in the App Router needs either the View Transitions API or an `AnimatePresence`
  wrapper keyed on the pathname — worth adding once the content is settled.
- Import Motion from `motion/react` (the package is `motion`, formerly
  `framer-motion`).
