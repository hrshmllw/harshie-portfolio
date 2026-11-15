#!/usr/bin/env node
/**
 * Capture homepage screenshots for every project with a `liveUrl`.
 *
 *   node scripts/capture-screenshots.mjs            # all projects
 *   node scripts/capture-screenshots.mjs ten-mixer  # just these slugs
 *
 * Uses the local Chrome in headless mode, then sharp to save a 1440×900 JPG
 * to public/images/projects/<slug>.jpg. Projects marked `confidential: true`
 * are pixelated here, so the readable screenshot never ships.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, basename, resolve } from "node:path";
import sharp from "sharp";

const ROOT = resolve(import.meta.dirname, "..");
const CONTENT = join(ROOT, "content/projects");
const OUT = join(ROOT, "public/images/projects");
const WIDTH = 1440;
const HEIGHT = 900;
const PIXEL_COLS = 56;

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

const only = process.argv.slice(2);
const projects = readdirSync(CONTENT)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const source = readFileSync(join(CONTENT, file), "utf8");
    return {
      slug: basename(file, ".md"),
      url: field(source, "liveUrl"),
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
        "--virtual-time-budget=9000",
        `--screenshot=${raw}`,
        project.url,
      ],
      { stdio: "ignore", timeout: 60_000 },
    );

    let image = sharp(raw).resize(WIDTH, HEIGHT, { fit: "cover", position: "top" });

    if (project.confidential) {
      const small = await image
        .resize(PIXEL_COLS, Math.round((PIXEL_COLS * HEIGHT) / WIDTH), { fit: "fill" })
        .toBuffer();
      image = sharp(small).resize(WIDTH, HEIGHT, { kernel: "nearest", fit: "fill" });
    }

    await image.jpeg({ quality: 80, mozjpeg: true }).toFile(join(OUT, `${project.slug}.jpg`));
    console.log(project.confidential ? "saved (pixelated)" : "saved");
  } catch (error) {
    console.log(`failed: ${error.message}`);
  }
}

rmSync(scratch, { recursive: true, force: true });
