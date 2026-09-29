# Smiljan — Coffee Shop Landing Page

Frontend-only landing page for Smiljan, a classic coffee shop in Cipete, Jakarta Selatan.
Built from `PRD_Smiljan_Coffee_Shop_Landing_Page.docx`.

> **Status: frontend complete, business data still pending.**
> Every fact that has not been confirmed by the client (address, opening hours, menu
> names, prices, phone number, social accounts) is rendered as an explicit
> placeholder. See [Verified data](#verified-data) for how to publish it.

---

## Stack

| Concern  | Choice                                          |
| -------- | ----------------------------------------------- |
| Framework| Next.js 16 (App Router), JavaScript              |
| Styling  | Tailwind CSS v4 (CSS-first `@theme` tokens)      |
| 3D       | Three.js + React Three Fiber (procedural model)  |
| Motion   | CSS transitions + IntersectionObserver           |
| Fonts    | Fraunces (display) + Inter (body), via next/font |

No backend, database, auth, CMS, ordering, payment or booking — out of scope per PRD §14.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
npm run start
```

## Project structure

```
app/
  layout.js            metadata, fonts, JSON-LD, skip link
  page.js              section composition
  globals.css          design tokens, grain, scroll-reveal, reduced-motion
  icon.svg             favicon
components/
  layout/Masthead.js   fixed anchor navigation
  sections/            one file per PRD section 01–07
  ui/                  Button, SectionLabel, Reveal, PlaceholderNotice
  3d/                  HeroScene (loader + fallbacks), CoffeeHeroScene, CoffeeCup
data/
  site.js              brand, location, hours, contact, social
  menu.js              signature items
  gallery.js           atmosphere gallery
  craft.js             brewing process beats
lib/
  useReveal.js         scroll reveal via IntersectionObserver
  usePrefersReducedMotion.js
  mediaQuery.js        useSyncExternalStore wrappers
public/
  brand/               logo wordmark
  placeholders/        generated placeholder artwork
  textures/grain.svg   paper grain overlay
scripts/
  regenerate art: node scripts/generate-placeholders.mjs
```

## The 3D hero

The cup is **modelled in code**, not loaded from a `.glb`. `CoffeeCup.js` builds it from
`LatheGeometry` (body, saucer), `TorusGeometry` (handle) and scaled `IcosahedronGeometry`
(beans) — roughly 4k triangles total, with no binary asset to download.

Lighting uses drei `<Lightformer>` elements rendered into a local cubemap, so **no external
HDR file is fetched** and the scene works fully offline.

Fallback chain, in order:

1. `prefers-reduced-motion: reduce` → static poster only
2. No WebGL support → static poster only
3. Scene runtime error → static poster (error boundary)
4. Otherwise → poster until first frame, then the live scene

Performance measures: lazy-loaded via `next/dynamic` with `ssr: false`, render loop paused
via `frameloop="never"` when scrolled out of view, adaptive DPR, and automatic geometry /
shadow reduction on small screens, data-saver mode, or low-core devices.

The canvas is `aria-hidden`. No information or CTA depends on interacting with it.

## Verified data

Nothing on this page is invented. Unconfirmed facts live as `null` in `data/` and render
as an explicit placeholder. To publish:

**`data/site.js`**

| Field                | Currently          | Action                                                        |
| -------------------- | ------------------ | ------------------------------------------------------------- |
| `location.addressLines` | `null`          | Set to the confirmed street address, then `verified: true`     |
| `hours.entries`      | `null`             | `[{ days: "Senin – Jumat", time: "08.00 – 22.00" }]`, `verified: true` |
| `contact.phone`      | `null`             | Set the number, `verified: true` — renders a `tel:` link        |
| `social.*`           | `null`             | Set official URLs, `verified: true` — they become real links    |

The directions button already works: it points at a Google Maps **search query** rather
than a fabricated pin, so it resolves correctly without knowing the street address.

**`data/menu.js`** — fill in `name`, `description`, `price` and `image.src` for each item
and flip `verified: true`. Prices are plain integers in rupiah, formatted with
`Intl.NumberFormat('id-ID')`. All "belum dikonfirmasi" notices disappear automatically.

**`data/gallery.js`** — swap `src` for real photography.

## Replacing the placeholder artwork

Everything in `public/placeholders/` is generated placeholder art standing in for licensed
photography (PRD §12). To swap in real assets:

1. Put the real files in `public/photography/`.
2. Update the `image.src` / `src` fields in `data/menu.js` and `data/gallery.js`.
3. Remove the corresponding `PlaceholderNotice` from the section.

No component changes are needed. `next/image` optimises raster images automatically, so
real photos get responsive `srcset` and lazy loading for free.

To regenerate or restyle the placeholder art:

```bash
node scripts/generate-placeholders.mjs
```

The logo at `public/brand/logo-smiljan.svg` is a temporary wordmark. Replace it with the
real SVG/PNG at the same path.

## SEO

Metadata lives in `app/layout.js`: title template, description, keywords, canonical, Open
Graph, Twitter card, robots, icons. Structured data is JSON-LD `CafeOrCoffeeShop`.

Set the production origin before deploying — it is used for canonical, OG and JSON-LD URLs:

```bash
NEXT_PUBLIC_SITE_URL=https://smiljan.coffee
```

The street address is deliberately omitted from the JSON-LD until confirmed.

## Accessibility

Single `<h1>`, `<h2>` per section, semantic `<h3>` for card and process titles. Skip link to
main content, visible `:focus-visible` outlines, `min-h-11` (44px) touch targets, alt text
on every meaningful image and `alt=""` on decorative ones, `lang="id"`.

Scroll reveal, hover zoom, mask reveals and the 3D scene all respect
`prefers-reduced-motion: reduce` — see the media query at the end of `app/globals.css`.

## Placeholder copy

All body copy is temporary (PRD §12 allows placeholder copy pending the official brand
story). It lives in the section components and in `data/craft.js`.
