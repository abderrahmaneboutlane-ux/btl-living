/**
 * Film-emulation variants of the showroom render.
 *   node scripts/film-variants.mjs "<source>"
 * NO saturation boost, NO unsharp mask (that's what made it cartoonish).
 * Just: gentle S-curve, warm split-tone, fine grain, edge falloff.
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const src = process.argv[2];
if (!src) { console.error("give a source path"); process.exit(1); }

const meta = await sharp(src).metadata();
const W = meta.width, H = meta.height;
console.log(`source ${W}x${H}`);

// fine monochrome grain tile as PNG buffer
async function grain(intensity) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/></filter>
    <rect width="100%" height="100%" filter="url(#n)"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
// soft radial edge darkening
async function vignette(strength) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><radialGradient id="v" cx="50%" cy="43%" r="75%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="${strength}"/>
    </radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

// base grade: gentle contrast + a whisper of warmth in shadows, cooler highlights
function grade(p, { contrast = 1.06, lift = -5, warmShadow = true }) {
  let x = p.linear(contrast, lift);
  if (warmShadow) x = x.tint({ r: 255, g: 250, b: 242 }); // barely-there warm cast
  return x;
}

const variants = [
  { name: "showroom-A-clean",  contrast: 1.05, lift: -4, grain: 0.05, vig: 0.14 },
  { name: "showroom-B-film",   contrast: 1.09, lift: -7, grain: 0.09, vig: 0.20 },
  { name: "showroom-C-strong", contrast: 1.12, lift: -9, grain: 0.13, vig: 0.26 },
];

for (const v of variants) {
  const g = await grain(v.grain);
  const vg = await vignette(v.vig);
  const buf = await grade(sharp(src).rotate(), { contrast: v.contrast, lift: v.lift })
    .composite([
      { input: vg, blend: "multiply" },
      { input: g, blend: "soft-light", opacity: v.grain },
    ])
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();
  const info = await sharp(buf).toFile(path.join(OUT, `${v.name}.jpg`));
  console.log(`${v.name}.jpg  ${info.width}x${info.height}  ${(info.size/1024).toFixed(0)} KB`);
}