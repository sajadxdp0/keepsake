# Keepsake

An Astro + React image editor using the Omarchy Vantablack palette. Add a name directly to a JPG, PNG, or WebP image, choose its typeface, weight, size, and color, then drag it into place. The original file remains unchanged; export creates a full-resolution PNG locally in your browser.

## Background

`KeepsakeBackdrop.tsx` provides a static black backdrop with restrained white ambient light. The site uses JetBrains Mono as its interface typeface; the image editor retains selectable typefaces for the name added to an image.

## Run locally

```sh
npm ci
npm run dev
```

## Deploy

Import this repository into Vercel. Astro builds a static site; no backend or environment variables are needed.
