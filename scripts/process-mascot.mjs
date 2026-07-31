#!/usr/bin/env node
/**
 * Prepares Haven's official mascot artwork for use in the app.
 *
 * Reads the untouched source PNGs from public/mascot/original/ and writes a
 * transparent-background version to public/mascot/processed/. Originals are
 * never modified or deleted.
 *
 * Background removal is edge-connected flood fill only — starting from the
 * four image borders, it walks outward through near-white pixels and marks
 * only that connected region as background. Any near-white pixel that isn't
 * reachable from the border (i.e. it's enclosed by the artwork) is left
 * alone, so pale colors inside the illustration are never mistaken for
 * canvas. This is deliberately not a global color-distance matte — that
 * approach removes pale-but-real artwork pixels along with the background.
 *
 * Run: node scripts/process-mascot.mjs
 */

import { readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const ORIGINAL_DIR = path.join(ROOT, "public", "mascot", "original");
const PROCESSED_DIR = path.join(ROOT, "public", "mascot", "processed");
const NEAR_WHITE_THRESHOLD = 246; // a pixel counts as "canvas" if every channel is >= this

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

  // 1-bit alpha mask, softened slightly so the cut edge isn't pixel-hard.
  const rawAlpha = Buffer.alloc(total);
  for (let i = 0; i < total; i++) rawAlpha[i] = isBackground[i] ? 0 : 255;
  const alpha = await sharp(rawAlpha, { raw: { width, height, channels: 1 } })
    .blur(1.2)
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
  console.log(`  ${path.basename(outputPath)} — ${width}x${height}, ${removed}/${total} px cut as background`);
}

async function main() {
  if (!existsSync(ORIGINAL_DIR)) {
    console.error(`Missing ${ORIGINAL_DIR}. Put the official PNGs there first:`);
    console.error("  public/mascot/original/moon-awake.png");
    console.error("  public/mascot/original/moon-sleeping.png");
    process.exit(1);
  }

  await mkdir(PROCESSED_DIR, { recursive: true });

  const files = (await readdir(ORIGINAL_DIR)).filter((f) => /\.png$/i.test(f));
  if (files.length === 0) {
    console.error(`No PNGs found in ${ORIGINAL_DIR}.`);
    process.exit(1);
  }

  console.log("Processing mascot artwork (flood-fill background removal, originals untouched):");
  for (const file of files) {
    await floodCutBackground(path.join(ORIGINAL_DIR, file), path.join(PROCESSED_DIR, file));
  }
  console.log("Done. Originals in public/mascot/original/ were not modified.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
