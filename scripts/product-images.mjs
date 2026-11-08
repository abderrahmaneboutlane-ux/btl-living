/**
 * Cuts individual product photos from the showroom render — FAITHFUL MODE.
 *
 *   node scripts/product-images.mjs
 *
 * Crops straight from the source with no grading and no sharpening. Output is
 * kept modest (800x1000) so the crop is barely enlarged and stays photographic;
 * an earlier version pushed 1200x1500 with an unsharp mask and looked cartoonish.
 *
 * Test imagery — swap for real product photography at the same paths later.
 */

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { mkdirSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public", "showroom.jpg");
const OUT = path.join(ROOT, "public", "products");
mkdirSync(OUT, { recursive: true });

// slug -> [x, y, w, h] as fractions of the source image
const CROPS = {
  "lit-anfa": [0.0, 0.28, 0.31, 0.72],
  "chevet-habous": [0.0, 0.5, 0.13, 0.34],
  "commode-riad": [0.02, 0.58, 0.22, 0.4],
  "dressing-mansour": [0.6, 0.12, 0.25, 0.86],
  "penderie-zellige": [0.27, 0.32, 0.17, 0.56],
  "table-assilah": [0.42, 0.56, 0.37, 0.42],
  "chaise-medina": [0.53, 0.58, 0.19, 0.36],
  "buffet-oualidia": [0.72, 0.5, 0.21, 0.38],
  "fauteuil-essaouira": [0.15, 0.58, 0.23, 0.38],
  "table-basse-taghazout": [0.21, 0.56, 0.17, 0.3],
  "meuble-tv-corniche": [0.7, 0.56, 0.24, 0.36],
  "coiffeuse-majorelle": [0.43, 0.32, 0.19, 0.5],
  "miroir-lune": [0.49, 0.34, 0.15, 0.32],
};

const OUT_W = 1200;
const OUT_H = 1500;

const meta = await sharp(SRC).metadata();
const W = meta.width;
const H = meta.height;
console.log(`source ${W}x${H} — crops taken raw, no grade / no sharpen`);

for (const [slug, [fx, fy, fw, fh]] of Object.entries(CROPS)) {
  let left = Math.round(fx * W);
  let top = Math.round(fy * H);
  let width = Math.round(fw * W);
  let height = Math.round(fh * H);
  width = Math.min(width, W - left);
  height = Math.min(height, H - top);
  left = Math.max(0, Math.min(left, W - width));
  top = Math.max(0, Math.min(top, H - height));

  const pipe = () =>
    sharp(SRC)
      .extract({ left, top, width, height })
      .resize(OUT_W, OUT_H, {
        fit: "cover",
        position: "centre",
        kernel: sharp.kernel.lanczos3,
      });

  const w = await pipe().webp({ quality: 88, effort: 6 }).toFile(path.join(OUT, `${slug}.webp`));
  await pipe().jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(OUT, `${slug}.jpg`));
  console.log(`${slug}.webp  ${w.width}x${w.height}  ${(w.size / 1024).toFixed(0)} KB`);
}