import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(readFileSync(path.join(ROOT,".env.local"),"utf8")
  .split(/\r?\n/).filter(l=>/^[A-Z]/.test(l)).map(l=>{const i=l.indexOf("=");return[l.slice(0,i),l.slice(i+1)];}));
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {auth:{persistSession:false}});
const deadline = Date.now() + 10*60*1000;
let n=0;
while (Date.now() < deadline) {
  const { error } = await sb.from("admins").select("id").limit(1);
  const { error: fnErr } = await sb.rpc("is_admin").then(r=>r, e=>({error:e}));
  if (!error && !fnErr) { console.log(`\n✓ admin schema live after ${n*5}s`); process.exit(0); }
  if (n%6===0) process.stdout.write(`\n[${n*5}s] waiting for 0002_admin.sql`);
  process.stdout.write(".");
  n++; await new Promise(r=>setTimeout(r,5000));
}
console.log("\n✗ timed out"); process.exit(1);