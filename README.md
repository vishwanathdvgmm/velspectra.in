# VELSPECTRA — Agency Website Starter

A responsive React 19 + Vite starter website for VELSPECTRA.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Customize first

1. Replace `hello@velspectra.com` with your real business email.
2. Update the service descriptions, pricing and contact details in `src/App.jsx`.
3. Replace the concept projects with real work as you complete it. They are currently labelled as concepts.
4. Connect the enquiry form to a backend such as Formspree, a serverless function, or your own API. It currently demonstrates the form interaction only and does not send messages.
5. Add your social profile URLs and business contact number.
6. Review hosting provider terms before deploying a commercial client website.

## Logo assets

- `public/velspectra-logo.png`: transparent-background version of the supplied wordmark.
- `public/velspectra-v-icon.png`: cropped V mark for favicon and compact brand use.

## Structure

```text
├── 📁 public
│   ├── 🖼️ velspectra-logo.png
│   └── 🖼️ velspectra-v-icon.png
├── 📁 src
│   ├── 📄 App.jsx
│   ├── 📄 main.jsx
│   └── 🎨 styles.css
├── 📝 README.md
├── 🌐 index.html
└── ⚙️ package.json
```

## Notes

- This is a starter template, not a completed production lead-management system.
- The contact form currently shows a local success state only. Connect a real form endpoint before launch.
- The portfolio cards are illustrative concept designs, not client testimonials or commissioned projects.

## Motion details

- Floating V emblem and slow orbital rings in the hero.
- Soft ambient glow and twinkling accent points.
- Scroll-triggered section reveals using IntersectionObserver.
- Hover micro-interactions on service rows, project cards and buttons.
- Respects `prefers-reduced-motion` for accessibility.
