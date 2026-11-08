/**
 * Force-resets passwords for the 3 admin accounts.
 *   node scripts/reset-admin-passwords.mjs
 * Prints the new passwords ONCE. Each admin then changes theirs at /admin/compte.
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

const EMAILS = [
  "abderrahmane@btl-living.com",
  "bouchaib@btl-living.com",
  "mohamed@btl-living.com",
];

const newPw = () =>
  "BTL-" + randomBytes(6).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) + "-9Aa";

const { data: list, error: listErr } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
if (listErr) { console.error("listUsers failed:", listErr.message); process.exit(1); }

console.log("\n─────────── NEW ADMIN PASSWORDS ───────────\n");
for (const email of EMAILS) {
  const user = list.users.find((u) => u.email === email);
  if (!user) { console.log("✗", email, "— no such user"); continue; }
  const pw = newPw();
  const { error } = await sb.auth.admin.updateUserById(user.id, { password: pw });
  if (error) { console.log("✗", email, error.message); continue; }
  console.log(`  ${email}\n  ${pw}\n`);
}
console.log("───────────────────────────────────────────");
console.log("Log in at https://www.btl-living.com/admin/login");
console.log("then change it at /admin/compte.\n");