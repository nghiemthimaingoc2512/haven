#!/usr/bin/env node
/**
 * Derives Haven's working brand assets from the permanent master mascot.
 *
 * Reads public/brand/master/haven-moon-master.png (NEVER modified - see
 * docs/brand/HAVEN_BRAND.md) and writes:
 *   - public/brand/derived/haven-moon.png - corner-transparent badge, the
 *     canonical asset the in-app mascot component renders.
 *   - app/icon.png, app/apple-icon.png, app/opengraph-image.png - Next.js's
 *     static file conventions for favicon / apple touch icon / social
 *     share image, all literal crops/resizes of the same badge.
 *
 * The master is a circular badge (moon + night sky + clouds + stars) inset
 * on a white canvas; this only ever removes the white canvas outside that
 * circle via edge-connected flood fill, or resizes the result - it never
 * touches a pixel of the badge itself, so the face, proportions, colors,
 * and personality are untouched, per the brand rules ("Allowed: crop,
 * resize, simplify for small sizes, remove background, export PNG/favicon").
 *
 * Run: node scripts/derive-brand-assets.mjs
 */

import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const MASTER = path.join(ROOT, "public", "brand", "master", "haven-moon-master.png");
const DERIVED_DIR = path.join(ROOT, "public", "brand", "derived");
const OUTPUT = path.join(DERIVED_DIR, "haven-moon.png");
const NEAR_WHITE_THRESHOLD = 246;

async function floodCutBackground(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const total = width * height;

  const isBackground = new Uint8Array(total);
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let queueTail = 0;
  let queueHead = 0;

  const isNearWhite = (i) => {
    const idx = i * channels;
    return (
      data[idx] >= NEAR_WHITE_THRESHOLD &&
      data[idx + 1] >= NEAR_WHITE_THRESHOLD &&
      data[idx + 2] >= NEAR_WHITE_THRESHOLD
    );
  };

  const visit = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (visited[i]) return;
    visited[i] = 1;
    if (isNearWhite(i)) {
      isBackground[i] = 1;
      queue[queueTail++] = i;
    }
  };

  for (let x = 0; x < width; x++) {
    visit(x, 0);
    visit(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    visit(0, y);
    visit(width - 1, y);
  }

  while (queueHead < queueTail) {
    const i = queue[queueHead++];
    const x = i % width;
    const y = (i / width) | 0;
    visit(x + 1, y);
    visit(x - 1, y);
    visit(x, y + 1);
    visit(x, y - 1);
  }

  const rawAlpha = Buffer.alloc(total);
  for (let i = 0; i < total; i++) rawAlpha[i] = isBackground[i] ? 0 : 255;
  // toColourspace('b-w') is required here - sharp silently promotes a
  // single-channel raw buffer to 3 channels through .blur() otherwise,
  // which corrupts every alpha read after that via misaligned indexing.
  const alpha = await sharp(rawAlpha, { raw: { width, height, channels: 1 } })
    .blur(1.2)
    .toColourspace("b-w")
    .raw()
    .toBuffer();

  const rgba = Buffer.alloc(total * 4);
  for (let i = 0; i < total; i++) {
    const src = i * channels;
    const dst = i * 4;
    rgba[dst] = data[src];
    rgba[dst + 1] = data[src + 1];
    rgba[dst + 2] = data[src + 2];
    rgba[dst + 3] = alpha[i];
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toFile(outputPath);

  const removed = isBackground.reduce((a, b) => a + b, 0);
  console.log(`  ${path.basename(outputPath)} - ${width}x${height}, ${removed}/${total} px cut as background`);
}

const APP_DIR = path.join(ROOT, "app");

async function generateFavicons() {
  const badge = sharp(OUTPUT);

  // app/icon.png - favicon. Kept transparent; browsers render the page
  // background behind it.
  await badge.clone().resize(128, 128).png().toFile(path.join(APP_DIR, "icon.png"));
  console.log("  app/icon.png - 128x128");

  // app/apple-icon.png - iOS flattens onto a solid ground itself, but we
  // do it explicitly onto Haven's paper token so there's no black fallback
  // fill on older iOS versions before the OS applies its own mask.
  await badge
    .clone()
    .resize(180, 180)
    .flatten({ background: "#faf8ff" })
    .png()
    .toFile(path.join(APP_DIR, "apple-icon.png"));
  console.log("  app/apple-icon.png - 180x180");

  // app/opengraph-image.png - 1200x630 share image: gradient background +
  // wordmark, composed via SVG, with the real badge composited on top.
  const OG_W = 1200;
  const OG_H = 630;
  const badgeSize = 300;
  const badgeBuffer = await badge.clone().resize(badgeSize, badgeSize).png().toBuffer();

  const backgroundSvg = `
    <svg width="${OG_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="0%" r="85%">
          <stop offset="0%" stop-color="#E9E2FF" />
          <stop offset="60%" stop-color="#F8F4FF" />
        </radialGradient>
      </defs>
      <rect width="${OG_W}" height="${OG_H}" fill="url(#bg)" />
      <text x="50%" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="92" font-weight="600" fill="#221D35">Haven</text>
      <text x="50%" y="555" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#8B5CF6">Somewhere to go.</text>
    </svg>
  `;

  await sharp(Buffer.from(backgroundSvg))
    .composite([{ input: badgeBuffer, left: Math.round((OG_W - badgeSize) / 2), top: 70 }])
    .png()
    .toFile(path.join(APP_DIR, "opengraph-image.png"));
  console.log("  app/opengraph-image.png - 1200x630");
}

async function main() {
  if (!existsSync(MASTER)) {
    console.error(`Missing master asset: ${MASTER}`);
    console.error("The master must exist at exactly this path - see docs/brand/HAVEN_BRAND.md.");
    process.exit(1);
  }

  await mkdir(DERIVED_DIR, { recursive: true });

  console.log("Deriving brand assets from the master (master untouched):");
  await floodCutBackground(MASTER, OUTPUT);
  await generateFavicons();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
