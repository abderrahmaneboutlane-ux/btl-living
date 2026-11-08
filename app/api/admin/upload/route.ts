import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // 1. caller must be a signed-in admin
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { data: admin } = await sb
    .from("admins").select("id").eq("id", user.id).maybeSingle();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  // 2. read the file
  const form = await req.formData();
  const file = form.get("file");
  const slug = String(form.get("slug") || "").replace(/[^a-z0-9-]/gi, "") || `tmp-${Date.now()}`;
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no file" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "fichier > 8 Mo" }, { status: 400 });
  }
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const key = `products/${slug}.${ext}`;

  // 3. upload with the service role (bypasses storage RLS, already authorised above)
  const admbc = supabaseAdmin();
  if (!admbc) return NextResponse.json({ error: "server" }, { status: 500 });
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await admbc.storage
    .from("media")
    .upload(key, buf, { contentType: file.type || "image/jpeg", upsert: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = admbc.storage.from("media").getPublicUrl(key);
  return NextResponse.json({ url: `${data.publicUrl}?v=${Date.now()}` });
}