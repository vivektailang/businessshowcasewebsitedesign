# Business Showcase Website

A clean, modern, static website designed to spotlight products and services. This repository contains a lightweight, fast, and fully functional front-end you can launch immediately.

Key features
- Responsive layout built with Bootstrap utility classes and custom CSS
- JS-free interactive experience: CSS-only responsive nav, gallery lightbox (using :target), animations that respect user reduced-motion preferences
- Fast-loading gallery with lazy-loaded images and optimized SVG placeholders
- Easy-to-edit product and gallery markup: add or replace ARTICLE blocks and gallery items

Files of interest
- `index.html` — single-page site (hero, products, gallery, contact)
- `assets/css/styles.css` — custom styles, branding variables, responsive helper classes, and animation rules
- `assets/images/` — logo and placeholder product images
- `data/products.json` — original product metadata (kept for reference if you want to reintroduce JS-driven rendering later)

Quick start (local preview)
1. From a command prompt (cmd.exe), run a local static server from the parent folder:

```cmd
python -m http.server 8000
```

2. Visit http://localhost:8000/businessshowcasewebsitedesign/ in your browser.

Customization guide
- Branding colors: edit CSS variables at the top of `assets/css/styles.css` (`--primary-color` and `--brand-accent`).
- Fonts: replace or add a webfont link in `<head>` (e.g., Google Fonts or self-hosted) and update `--body-font`/`--heading-font` variables.
- Products: open `index.html` and follow the product ARTICLE template comment. Copy that block, update the image path, title, description and tags.
- Gallery: add or remove the gallery thumbnail blocks and corresponding `div` lightbox overlays that use fragment IDs like `#img7` and `id="img7"`.

Accessibility & Performance notes
- The site respects `prefers-reduced-motion`; users who request reduced motion will not see animations.
- The lightbox uses CSS :target — it functions without JS but does not implement focus trapping or Escape-key closure. For full accessible modal behavior, a small JS enhancement is recommended.
- Prefer replacing SVG placeholders with optimized JPEG/WebP images for photographic product images. Use `srcset` for responsive images if you add raster formats.
- Keep hero imagery decorative where possible (use empty alt or role="presentation") unless the image conveys essential content.

Deployment
- This is a static site — deploy to any static hosting provider (Netlify, GitHub Pages, Vercel, S3 + CloudFront, or a standard Apache/nginx server).
- If deploying to GitHub Pages, set the repository to publish from the repository root (or `docs/` if you move the files there).

Optional improvements you can request
- Add a small JS module (~20–150 lines) to improve lightbox accessibility (Escape to close, arrow navigation, focus trap).
- Reintroduce JSON-driven rendering (`data/products.json`) and a tiny client-side renderer for CMS-like editing without rebuilding HTML.
- Add a minimal build step (parcel/webpack) for image optimization and CSS autoprefixing if you plan to maintain many assets.

Support
If you provide your logo, color palette, and the initial copy for each product, I can:
- Swap placeholders with real images and brand colors
- Fine-tune animations and layout to match brand personality (subtle/energetic/minimal)
- Add an accessible JS lightbox enhancement if you prefer optimal keyboard support