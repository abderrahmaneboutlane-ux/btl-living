/**
 * Pushes the hero + product images into Supabase Storage and points
 * products.image_url at the public URLs.
 *
 *   npm run upload:images
 *
 * Creates a public bucket "media" if missing. Idempotent (upsert).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(path.join(ROOT, ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z]/.test(l))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    }),
);

const sb = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const BUCKET = "media";

// 1. bucket
const { data: buckets } = await sb.storage.listBuckets();
if (!buckets?.some((b) => b.name === BUCKET)) {
  const { error } = await sb.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: "10MB",
  });
  if (error) {
    console.error("✗ bucket:", error.message);
    process.exit(1);
  }
  console.log(`✓ bucket "${BUCKET}" created (public)`);
} else {
  console.log(`• bucket "${BUCKET}" already exists`);
}

const contentType = (f) =>
  f.endsWith(".webp") ? "image/webp" : f.endsWith(".jpg") ? "image/jpeg" : "application/octet-stream";

async function put(localPath, remotePath) {
  const body = readFileSync(localPath);
  const { error } = await sb.storage
    .from(BUCKET)
    .upload(remotePath, body, { contentType: contentType(remotePath), upsert: true });
  if (error) {
    console.error(`  ✗ ${remotePath}: ${error.message}`);
    return null;
  }
  const { data } = sb.storage.from(BUCKET).getPublicUrl(remotePath);
  console.log(`  ✓ ${remotePath}  (${(body.length / 1024).toFixed(0)} KB)`);
  return data.publicUrl;
}

// 2. hero + og
console.log("\nhero / social:");
for (const f of ["showroom.jpg", "showroom.webp", "og.jpg"]) {
  await put(path.join(ROOT, "public", f), f);
}

// 3. product images -> products.image_url
console.log("\nproducts:");
const dir = path.join(ROOT, "public", "products");
const webps = readdirSync(dir).filter((f) => f.endsWith(".webp"));
let linked = 0;
for (const f of webps) {
  const url = await put(path.join(dir, f), `products/${f}`);
  if (!url) continue;
  const slug = f.replace(/\.webp$/, "");
  const { error } = await sb.from("products").update({ image_url: url }).eq("slug", slug);
  if (error) console.error(`    ✗ link ${slug}: ${error.message}`);
  else linked++;
}

console.log(`\n✓ ${linked}/${webps.length} produits liés à Supabase Storage\n`);