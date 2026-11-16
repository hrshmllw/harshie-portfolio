/**
 * Image sources for a project cover. Shared by the cover and the preloader so
 * the preloader warms exactly the file the card will pick.
 *
 * - NDA covers are a 56×35 PNG of the pixel grid, upscaled with
 *   `image-rendering: pixelated`.
 * - Public covers are WebP at 1440w with an 800w variant (`<slug>-800.webp`).
 */
export const COVER_SIZES =
  "(min-width: 1280px) 760px, (min-width: 768px) 56vw, calc(100vw - 2.5rem)";

export type CoverSources = {
  src: string;
  srcset?: string;
  sizes?: string;
  width: number;
  height: number;
  pixelated: boolean;
};

export function coverSources(image: string): CoverSources {
  if (image.endsWith(".png")) {
    return { src: image, width: 56, height: 35, pixelated: true };
  }
  if (image.endsWith(".webp")) {
    const small = image.replace(/\.webp$/, "-800.webp");
    return {
      src: image,
      srcset: `${small} 800w, ${image} 1440w`,
      sizes: COVER_SIZES,
      width: 1440,
      height: 900,
      pixelated: false,
    };
  }
  return { src: image, width: 1440, height: 900, pixelated: false };
}

/** Load and decode a cover the same way the `<img>` will, so it's cached and ready. */
export function preloadCover(image: string): Promise<void> {
  const sources = coverSources(image);
  const img = new Image();
  if (sources.sizes) img.sizes = sources.sizes;
  if (sources.srcset) img.srcset = sources.srcset;
  img.src = sources.src;
  return img.decode().catch(() => undefined);
}
