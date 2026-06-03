# Implementation Decisions

## Tailwind v4 instead of v3

`create-next-app` installed Tailwind v4, which uses CSS-based `@theme {}` blocks instead of `tailwind.config.ts`. The color palette was defined in `globals.css` using `@theme` variables (e.g., `--color-lavender: #C9B8F5`) instead of the v3 `extend.colors` approach. Inline `style` props are used for colors in components to guarantee the exact hex values regardless of Tailwind version purging.

## JWT signing uses Web Crypto API

The spec requires no `googleapis` npm package. JWT signing uses `crypto.subtle` (Web Crypto API) which is available in the Next.js server runtime. This avoids Node.js `crypto` module compatibility issues with Edge runtime.

## Access token cached in module-level variable

`tokenCache` is a module-level variable in `sheets.ts`. It persists across requests within the same server process (standard Node.js server model). Cache is refreshed 60 seconds before expiry to avoid race conditions near token expiry.

## `claimGift` uses read-then-write (optimistic lock)

The spec describes this as "optimistic lock + marks gift". The implementation does a GET to check status, then a PUT. There is a small window for a race condition between two simultaneous claims. A true atomic lock would require a database transaction. For a baby shower with low concurrent traffic this is acceptable. Documented here for awareness.

## Google Sheets PUT vs PATCH

Used `PUT` with `values.update` (not `PATCH`) for updating gift status. `PUT` with a full value range is the correct REST approach for the Sheets API v4 when updating a specific range.

## `appendRSVP` returns the written row index

The `values:append` response includes `updates.updatedRange` (e.g. `RSVPs!A5:G5`). We parse the row number from this string so the caller can reference the RSVP row later if needed (e.g., `updateRSVPGift`).

## `updateRSVPGift` is implemented but not called in the current page flow

The function exists per spec. The current page flow submits the `giftId` with the initial RSVP POST, so a separate `updateRSVPGift` call is not needed in the primary flow. It is available for future use (e.g., if a guest changes their gift selection post-RSVP).

## Audio files are placeholder empty files

`public/audio/track1.mp3` and `track2.mp3` are empty text files. The app will fail to play audio until real MP3 files are placed there. Howler will log a console warning but will not crash the app.

## `public/images/parents.jpg` is a placeholder

The placeholder is an empty text file. `next/image` will throw a runtime error when trying to display it. Replace with a real JPEG before going live.

## No toast library — custom inline toast

The spec mentions a toast for the 409 conflict case. Used a simple `useState` + `setTimeout` pattern with a fixed-position div instead of adding a toast library. Keeps dependencies minimal.

## `CloudMask` uses `AnimatePresence` exit animation only

The cloud wipe transition is triggered by setting `isVisible` to `true` briefly and then to `false`, which fires the `exit` animation from Framer Motion's `AnimatePresence`. The cloud SVG uses a `clipPath` with circle bumps at the bottom edge to create the cloud-edge effect.

## Google Sheets Schema tab name is `Sheet1`

The default first tab name in Google Sheets is "Sheet1". The spec uses this name. If the user renames the tab, they must update `sheets.ts` accordingly.

## Tailwind `sm:` breakpoint used for 2-col gift grid

The spec says "grid 1 col mobile, 2 col sm". Tailwind's `sm` breakpoint is 640px, which is appropriate for the `max-width: 480px` invitation container. On desktop the container is 480px wide so it stays 1 column; on larger mobile/tablet it goes 2 columns within the container.

## Font variables applied via CSS `var()`

Next.js `next/font/google` injects CSS variables (`--font-serif`, `--font-sans`) on the `html` element. Components reference these via inline `style={{ fontFamily: 'var(--font-serif)' }}` for headings, and the global CSS sets `body { font-family: var(--font-sans) }`.
