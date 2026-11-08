import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True once the public env vars are present — the app runs fine without them
 *  (it falls back to the bundled catalogue in lib/products.ts). */
export const supabaseEnabled = Boolean(URL && ANON);

/** Read-only client (anon key). Safe on server and client. Null if unconfigured. */
export function supabasePublic(): SupabaseClient | null {
  if (!URL || !ANON) return null;
  return createClient(URL, ANON, { auth: { persistSession: false } });
}

/** Privileged client (service_role). SERVER ONLY — never import into a
 *  "use client" module. Null if unconfigured. */
export function supabaseAdmin(): SupabaseClient | null {
  if (!URL || !SERVICE) return null;
  return createClient(URL, SERVICE, { auth: { persistSession: false } });
}