import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * The public site caches Supabase reads for `revalidate` seconds (see each
 * page). The admin panel writes straight to Supabase from the browser, so
 * Next has no way to know a save happened — without this, an edit can take
 * up to an hour to appear on the live site. The admin UI calls this route
 * right after a successful save/delete to flush just the affected pages.
 */
export async function POST(req: Request) {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  const { data: admin } = await sb
    .from("admins").select("id").eq("id", user.id).maybeSingle();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { slug, category } = body as { slug?: string; category?: string };

  const paths = new Set<string>(["/", "/collections", "/sitemap.xml"]);
  if (category) paths.add(`/collections/${category}`);
  if (slug) paths.add(`/produit/${slug}`);

  for (const p of paths) revalidatePath(p);

  return NextResponse.json({ revalidated: [...paths] });
}