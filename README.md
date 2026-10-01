# telos-site

The Telos College website (teloscollege.org), built with Next.js and deployed on Vercel. It was migrated from Squarespace in October 2026 as a visual match of the Squarespace site.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` makes the production build and `npm run lint` checks the code.

## Where things are

| Path | What it holds |
|---|---|
| `src/app/<route>/page.tsx` | One file per page. Home is `src/app/page.tsx`. |
| `src/content/site.ts` | Site-wide content: nav, footer text, email, form settings. |
| `src/content/pilot.ts` | Pilot program tracks, stats and timelines, shared by the three pilot pages. |
| `src/components/blocks.tsx` | The building blocks pages are made from. |
| `src/components/` | Header, footer, newsletter and contact form. |
| `src/app/globals.css` | All styles: brand colors, type scale, section themes, grid. |
| `public/images/` | Images, at original resolution. Next.js resizes them when serving. |
| `next.config.ts` | Redirects for old Squarespace URLs. |

## How a page is put together

Each page is a stack of `Section`s. A section has a color theme and holds one `Grid`: 24 columns from 768px up, 8 columns below. Each `Block` is placed on that grid with a mobile and a desktop position, written as `row-start/column-start/row-end/column-end`.

```tsx
<Section theme="bright" minHeight={10} pad={10} divider z={7}>
  <Grid rows={[10, 11]}>
    <Block area={["2/1/4/11", "2/2/5/26"]} v="center">
      <Text>
        <h1 className="center light">A degree that works</h1>
      </Text>
    </Block>
  </Grid>
</Section>
```

To change copy, edit the text inside `Text`, or in `src/content/` when it is shared. To move something, change its `area`. Props are documented in `blocks.tsx`.

## Forms

The contact form, the pilot early-access form (`/contact-1`) and the footer newsletter sign-up post to one [Formspree](https://formspree.io) form, which emails each submission. Its ID is set in `src/content/site.ts`; the `NEXT_PUBLIC_FORMSPREE_ID` environment variable overrides it (see `.env.example`). Each submission carries a `form` field and a subject line saying which form it came from.

## URLs

Every URL from the Squarespace site still works: `/contact`, `/pilot`, `/pilot-students`, `/pilot-employers` and `/contact-1` are pages, `/home` redirects to `/`, and `/pilot-program` redirects to `/pilot`.

## Checking the match against Squarespace

The scripts in `tools/` drive the installed Chrome to capture a reference site and this build, then compare them. They were used to match this site to Squarespace before the domain moved to Vercel on 2026-10-01. Since then `capture:live` captures this site itself, so it is only useful for before-and-after checks of a change: capture live, make the change locally, capture local, compare.

```bash
npm run capture:live
npm run capture:local
npm run compare
```

`compare` reports, for each page and width, how many text runs, images and controls differ in position or style, and the share of pixels that differ. Side-by-side images are written to `tools/out/diff/`. Set `WIDTHS=1440,390,768` to pick widths, and pass a page and width (`node tools/compare.mjs home 1440`) to list each difference.

`tools/import.mjs` is the one-time importer that generated the pages from Squarespace. The pages have been edited by hand since, so it skips existing pages unless run with `FORCE=1`.
