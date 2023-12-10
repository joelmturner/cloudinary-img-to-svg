## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/components/UploadImage.tsx`. The page auto-updates as you edit the file.

## SVG controls

You can modify the config in the `vectorize()` (`url.effect(vectorize().numOfColors(2).detailsLevel(600))`) to achieve different outcomes. The current configuration is great for simple, 2 color images.
