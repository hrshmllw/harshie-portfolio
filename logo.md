# Pixel ej logo

A lowercase "ej" on a 6×6 pixel grid. The j's dot is a red cursor that blinks on the site.

## Grid

The 6×6 grid sits inside a 64-unit square with a one-cell (8-unit) margin. Each cell is 8 units, so pixels land on whole screen pixels at 16, 24, 32, 48 and 64 px.

```
  c0 c1 c2 c3 c4 c5
r0 .  .  .  .  .  ●     ● = cursor dot (#C4454A)
r1 █  █  █  .  .  .
r2 █  .  █  .  .  █
r3 █  █  █  .  .  █
r4 █  .  .  .  .  █
r5 █  █  █  .  █  █
```

- e: 3 × 5 cells (columns 0–2, rows 1–5)
- j: 2 × 6 cells (column 5, plus the tail at column 4 on row 5), with its dot on row 0. It doesn't drop below the line.
- Cell (c, r) is drawn at x = 8 + 8c, y = 8 + 8r when on a plate. Without a plate (the site logo), use a 48-unit viewBox and x = 8c, y = 8r.

## Cuts

| Cut | Pixel size | Gap | Use |
| --- | --- | --- | --- |
| Small (solid) | 8 units | none | 32 px and below: header, footer, favicons |
| Large (dot matrix) | 7 units | 1 unit | Above 32 px: Apple touch icon, avatars, hero |
| Static | 7 units | 1 unit | Large cut with no red and no blink: print, CV |

## Colours

From the v2 palette in `tailwind.config.js`:

| Role | Colour |
| --- | --- |
| Letters on dark | `#F4F1EC` (`fg`) |
| Plate / background | `#2A2E31` (`bg`) |
| Cursor dot | `#C4454A` (`accent.bright`) |

## Motion

The cursor dot blinks with `steps(1, end)` over 1.1 s (hidden for the second half). It stays visible under `prefers-reduced-motion: reduce`.

## Where it's used

- `components/layout/AppLogo.vue`: the site logo, small cut, no plate, letters in `currentColor`. Shown at 24 px (`h-6 w-6`) in `AppHeader.vue` and `AppFooter.vue`. Keep sizes at multiples of 6 px so the pixels stay sharp. The `glowing` prop grows a red halo out of the j's dot and stops the blink.
- `public/favicon.svg`: small cut on a rounded `#2A2E31` plate.
- `public/favicon.ico`: the same at 16 and 32 px.
- `public/apple-touch-icon.png`: large cut, 180 px, on a square plate (iOS rounds the corners).

## SVG

Small cut on a plate (`public/favicon.svg`):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges"><rect width="64" height="64" rx="12" fill="#2A2E31" shape-rendering="geometricPrecision"/><path fill="#F4F1EC" d="M8 16h24v8H8zM8 24h8v8H8zM24 24h8v8h-8zM8 32h24v8H8zM8 40h8v8H8zM8 48h24v8H8zM48 24h8v24h-8zM40 48h16v8H40z"/><path fill="#C4454A" d="M48 8h8v8h-8z"/></svg>
```

Large cut on a plate (7-unit dots):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges"><rect width="64" height="64" rx="12" fill="#2A2E31"/><path fill="#F4F1EC" d="M8 16h7v7h-7zM16 16h7v7h-7zM24 16h7v7h-7zM8 24h7v7h-7zM24 24h7v7h-7zM8 32h7v7h-7zM16 32h7v7h-7zM24 32h7v7h-7zM8 40h7v7h-7zM8 48h7v7h-7zM16 48h7v7h-7zM24 48h7v7h-7zM48 24h7v7h-7zM48 32h7v7h-7zM48 40h7v7h-7zM40 48h7v7h-7zM48 48h7v7h-7z"/><path fill="#C4454A" d="M48 8h7v7h-7z"/></svg>
```

For the Static cut, give the cursor path the same fill as the letters.
