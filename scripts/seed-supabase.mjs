/**
 * Seeds the Supabase catalogue.
 *
 *   npm run seed
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY      (Settings → API → service_role, "Reveal")
 *
 * Idempotent — re-running upserts by primary key, so it will not duplicate.
 * Run the SQL in supabase/migrations/0001_init.sql FIRST.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// minimal .env.local loader (no extra dependency)
function loadEnv() {
  try {
    const raw = readFileSync(path.join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* no .env.local — rely on real env vars */
  }
}
loadEnv();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error(
    "\n✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local\n",
  );
  process.exit(1);
}

const sb = createClient(URL, KEY, { auth: { persistSession: false } });
const data = JSON.parse(
  readFileSync(path.join(__dirname, "seed-data.json"), "utf8"),
);

async function step(label, promise) {
  const { error, count } = await promise;
  if (error) {
    console.error(`✗ ${label}: ${error.message}`);
    process.exitCode = 1;
    return false;
  }
  console.log(`✓ ${label}${count != null ? ` (${count})` : ""}`);
  return true;
}

console.log(`\nSeeding ${URL}\n`);

const okCats = await step(
  `categories × ${data.categories.length}`,
  sb.from("categories").upsert(data.categories, { onConflict: "key" }),
);

if (okCats) {
  await step(
    `products × ${data.products.length}`,
    sb.from("products").upsert(
      data.products.map((p) => ({ ...p, image_url: null })),
      { onConflict: "slug" },
    ),
  );
}

// Sample rows only — seeded UNPUBLISHED so nothing fake ever shows on the site.
// Replace the text with real customer quotes, then flip `published` to true.
const { count: existingT } = await sb
  .from("testimonials")
  .select("*", { count: "exact", head: true });

if (!existingT) {
  await step(
    `testimonials × ${data.testimonials.length} (unpublished samples)`,
    sb.from("testimonials").insert(data.testimonials),
  );
} else {
  console.log("• testimonials: table not empty, skipped");
}

console.log("\nDone.\n");