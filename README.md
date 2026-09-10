# Jacquez Monroe — Portfolio (Vol. 2)

A multi-page personal portfolio for Jacquez Monroe, web developer. Plain HTML, CSS, and JavaScript — no framework, no build step.

This is a second, separate version of an existing portfolio: the first was a warm, minimal single-page site; this one is a full multi-page build with its own "futuristic" design system.

## Live site

_(add your GitHub Pages URL here once enabled — see below)_

## Design system

- **Colors** — deep navy background (`#0A0E17`), panel background (`#111827`), electric blue (`#2E86FF`) for structure/nav/links, and yellow (`#F5C518`) reserved as a single signal color for primary CTAs, the active nav item, and featured tags.
- **Type** — Space Grotesk for headings, IBM Plex Mono for nav/labels/data, system sans-serif for body copy.
- **Signature details** — a faint dot-grid pattern behind hero sections, HUD-style corner brackets on project cards/previews, a one-time scan-line sweep on primary button hover, a live local-time readout in the header, and a terminal-style status line in the footer.
- **Boot sequence** — a full-screen splash types out a short "system check" sequence on first visit per session (`sessionStorage`-gated), then fades out.

All of the above respects `prefers-reduced-motion` and includes visible keyboard focus states.

## Structure

```
index.html              Home — hero + featured project cards
about.html               About — bio + skill tags
projects.html             Projects — all three builds as full cards
contact.html              Contact — mailto link
projects/
  tic-tac-toe.html         Project detail — React + Vite tic-tac-toe
  calculator.html          Project detail — scientific calculator PWA
  weather.html             Project detail — weather app
css/style.css            Shared design system and layout
js/script.js              Shared behavior: splash sequence, header clock,
                           active-nav highlighting, mobile menu, page-fade
                           transitions
assets/resume.pdf         Placeholder — swap with the real resume
```

Every page shares the same sticky header (logo, nav, live clock, mobile hamburger) and footer (copyright + status line), duplicated per page since there's no build tool to share partials.

## Running locally

No build step — just serve the folder statically, e.g.:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploying

This is static output, so it deploys as-is to GitHub Pages, Vercel, Netlify, or any static host. For GitHub Pages: push to a repo, then in **Settings → Pages** set the source to the `main` branch, root folder.
