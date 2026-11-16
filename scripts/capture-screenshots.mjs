#!/usr/bin/env node
/**
 * Capture homepage screenshots for every project with a `liveUrl`.
 *
 *   node scripts/capture-screenshots.mjs            # all projects
 *   node scripts/capture-screenshots.mjs ten-mixer  # just these slugs
 *   SHOT_WAIT=20000 node scripts/…                  # wait longer (preloaders)
 *
 * Uses the local Chrome in headless mode at 1440×900, then sharp writes:
 *   - public projects: <slug>.webp (1440w) and <slug>-800.webp
 *   - `confidential: true` projects: <slug>.png at 56×35 (pixelated here, so
 *     the readable screenshot never ships)
 * to public/images/projects/. Set the project's `image:` to match.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const CONTENT = join(ROOT, "content/projects");
const OUT = join(ROOT, "public/images/projects");
const WIDTH = 1440;
const HEIGHT = 900;
const PIXEL_COLS = 56;
// How long Chrome lets the page run before the shot; raise for slow preloaders:
//   SHOT_WAIT=20000 node scripts/capture-screenshots.mjs <slug>
const WAIT_MS = Number(process.env.SHOT_WAIT ?? 9000);

const CHROME =
  process.env.CHROME_PATH ??
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
  ].find((path) => existsSync(path));

if (!CHROME) {
  console.error("Chrome not found; set CHROME_PATH.");
  process.exit(1);
}

const field = (source, key) =>
  source.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]?.trim();

// Args: slugs to limit the run, or `slug=source` to shoot a different source,
// e.g. a page saved with SingleFile when the live site blocks headless Chrome:
//   node scripts/capture-screenshots.mjs video-game-news=C:/path/saved.html
const overrides = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((arg) => arg.includes("="))
    .map((arg) => {
      const [slug, source] = arg.split(/=(.*)/s);
      return [slug, /^[a-z]+:\/\//i.test(source) ? source : pathToFileURL(resolve(source)).href];
    }),
);
const only = process.argv.slice(2).map((arg) => arg.split("=")[0]);
const projects = readdirSync(CONTENT)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const source = readFileSync(join(CONTENT, file), "utf8");
    return {
      slug: basename(file, ".md"),
      url: overrides[basename(file, ".md")] ?? field(source, "liveUrl"),
      confidential: field(source, "confidential") === "true",
    };
  })
  .filter((project) => project.url && (!only.length || only.includes(project.slug)));

mkdirSync(OUT, { recursive: true });
const scratch = mkdtempSync(join(tmpdir(), "shots-"));

for (const project of projects) {
  const raw = join(scratch, `${project.slug}.png`);
  process.stdout.write(`${project.slug} … `);
  try {
    execFileSync(
      CHROME,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--mute-audio",
        "--no-first-run",
        "--no-default-browser-check",
        `--user-data-dir=${join(scratch, "profile")}`,
        `--window-size=${WIDTH},${HEIGHT}`,
        `--virtual-time-budget=${WAIT_MS}`,
        `--screenshot=${raw}`,
        project.url,
      ],
      { stdio: "ignore", timeout: WAIT_MS + 90_000 },
    );

    const image = sharp(raw).resize(WIDTH, HEIGHT, { fit: "cover", position: "top" });

    if (project.confidential) {
      // Ship only the pixel grid itself (56×35); the site upscales it with
      // `image-rendering: pixelated`, so the readable shot never leaves here.
      await image
        .resize(PIXEL_COLS, Math.round((PIXEL_COLS * HEIGHT) / WIDTH), { fit: "fill" })
        .png({ compressionLevel: 9 })
        .toFile(join(OUT, `${project.slug}.png`));
    } else {
      const buffer = await image.toBuffer();
      await sharp(buffer).webp({ quality: 78 }).toFile(join(OUT, `${project.slug}.webp`));
      await sharp(buffer).resize(800).webp({ quality: 78 }).toFile(join(OUT, `${project.slug}-800.webp`));
    }
    console.log(project.confidential ? "saved (pixelated)" : "saved");
  } catch (error) {
    console.log(`failed: ${error.message}`);
  }
}

rmSync(scratch, { recursive: true, force: true });
