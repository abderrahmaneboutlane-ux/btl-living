/**
 * Creates the 3 admin accounts + admins rows.
 *   node scripts/seed-admins.mjs
 * Idempotent. Prints the generated passwords ONCE — save them, then each admin
 * changes theirs from /admin/compte.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(path.join(ROOT, ".env.local"), "utf8")
    .split(/\r?\n/).filter((l) => /^[A-Z]/.test(l))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1)]; }),
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const ADMINS = [
  { name: "Abderrahmane", email: "abderrahmane@btl-living.com" },
  { name: "Bouchaib",     email: "bouchaib@btl-living.com" },
  { name: "Mohamed",      email: "mohamed@btl-living.com" },
];

const strongPw = () =>
  randomBytes(9).toString("base64").replace(/[^a-zA-Z0-9]/g, "") + "9!Aa";

console.log("\nSeeding admins on", env.NEXT_PUBLIC_SUPABASE_URL, "\n");
const creds = [];

for (const a of ADMINS) {
  // find existing
  const { data: list } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
  let user = list?.users?.find((u) => u.email === a.email);
  let pw = null;

  if (!user) {
    pw = strongPw();
    const { data, error } = await sb.auth.admin.createUser({
      email: a.email,
      password: pw,
      email_confirm: true,
      user_metadata: { name: a.name },
    });
    if (error) { console.log("✗", a.email, error.message); continue; }
    user = data.user;
  }

  const { error: upErr } = await sb
    .from("admins")
    .upsert({ id: user.id, name: a.name, email: a.email }, { onConflict: "id" });
  if (upErr) { console.log("✗ admins row", a.email, upErr.message); continue; }

  console.log(`✓ ${a.name.padEnd(13)} ${a.email}${pw ? "   PASSWORD: " + pw : "   (existing — password unchanged)"}`);
  if (pw) creds.push({ email: a.email, pw });
}

if (creds.length) {
  console.log("\n──────────────────────────────────────────────");
  console.log("SAVE THESE NOW. Each admin changes theirs at /admin/compte");
  creds.forEach((c) => console.log(`  ${c.email}\n  ${c.pw}\n`));
}
console.log("Done. Admin panel: https://www.btl-living.com/admin\n");