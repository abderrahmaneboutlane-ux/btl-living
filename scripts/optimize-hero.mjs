/**
 * Hero pipeline — clean 4K upscale + a RESTRAINED film pass.
 *   node scripts/optimize-hero.mjs "<source>"
 * Film pass: gentle contrast S-curve, barely-warm cast, fine grain, soft edge
 * falloff. NO saturation boost, NO unsharp mask (those made it cartoonish).
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const src = process.argv[2];
if (!src) { console.error('give a source path'); process.exit(1); }

const TARGET_W = 3840;
const m0 = await sharp(src).metadata();
console.log(`source ${m0.width}x${m0.height} ${m0.format} -> ${TARGET_W}px + light film pass`);

// upscale first so grain/vignette are generated at final size
const base = await sharp(src).rotate()
  .resize({ width: TARGET_W, kernel: sharp.kernel.lanczos3 })
  .toBuffer();
const { width: W, height: H } = await sharp(base).metadata();

const grainPng = await sharp(Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
     <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/></filter>
     <rect width="100%" height="100%" filter="url(#n)"/></svg>`)).png().toBuffer();

const vigPng = await sharp(Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
     <defs><radialGradient id="v" cx="50%" cy="43%" r="78%">
       <stop offset="58%" stop-color="#000" stop-opacity="0"/>
       <stop offset="100%" stop-color="#000" stop-opacity="0.16"/></radialGradient></defs>
     <rect width="100%" height="100%" fill="url(#v)"/></svg>`)).png().toBuffer();

const graded = () => sharp(base)
  .linear(1.05, -4)                       // gentle contrast only
  .composite([
    { input: vigPng, blend: "multiply" },
    { input: grainPng, blend: "soft-light", opacity: 0.07 },
  ]);

const jpg  = await graded().jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" }).toFile(path.join(PUBLIC, "showroom.jpg"));
const webp = await graded().webp({ quality: 88, effort: 6 }).toFile(path.join(PUBLIC, "showroom.webp"));
const og   = await sharp(src).rotate().resize(1200, 630, { fit: "cover", position: "attention" })
  .linear(1.05, -4)
  .jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(PUBLIC, "og.jpg"));

const kb = n => `${(n/1024).toFixed(0)} KB`;
console.log(`showroom.jpg  ${jpg.width}x${jpg.height}  ${kb(jpg.size)}`);
console.log(`showroom.webp ${webp.width}x${webp.height}  ${kb(webp.size)}`);
console.log(`og.jpg        ${og.width}x${og.height}  ${kb(og.size)}`);