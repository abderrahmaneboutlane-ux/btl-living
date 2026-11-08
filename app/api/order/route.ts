import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

interface Incoming {
  customer: {
    nom: string;
    telephone: string;
    ville: string;
    adresse?: string;
    note?: string;
  };
  items: {
    slug: string;
    name: string;
    price: number;
    qty: number;
    priceFrom?: boolean;
  }[];
}

export async function POST(req: Request) {
  let body: Incoming;
  try {
    body = (await req.json()) as Incoming;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const { customer, items } = body ?? {};
  if (
    !customer?.nom?.trim() ||
    !customer?.telephone?.trim() ||
    !customer?.ville?.trim() ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const clean = items
    .filter((i) => i.slug && i.qty > 0 && Number.isFinite(i.price))
    .map((i) => ({
      slug: String(i.slug).slice(0, 120),
      name: String(i.name).slice(0, 200),
      unit_price: Math.round(i.price),
      qty: Math.min(99, Math.max(1, Math.round(i.qty))),
      price_from: Boolean(i.priceFrom),
    }));

  const subtotal = clean.reduce((s, i) => s + i.unit_price * i.qty, 0);
  const isEstimate = clean.some((i) => i.price_from);

  const sb = supabaseAdmin();
  // Supabase not configured yet — accept silently so checkout still works.
  if (!sb) return NextResponse.json({ ok: true, ref: null, persisted: false });

  const { data: order, error: orderErr } = await sb
    .from("orders")
    .insert({
      nom: customer.nom.trim().slice(0, 200),
      telephone: customer.telephone.trim().slice(0, 40),
      ville: customer.ville.trim().slice(0, 120),
      adresse: (customer.adresse ?? "").trim().slice(0, 400),
      note: (customer.note ?? "").trim().slice(0, 1000),
      subtotal,
      is_estimate: isEstimate,
    })
    .select("id, ref")
    .single();

  if (orderErr || !order) {
    return NextResponse.json(
      { error: "insert failed", detail: orderErr?.message },
      { status: 500 },
    );
  }

  const { error: itemsErr } = await sb
    .from("order_items")
    .insert(clean.map((i) => ({ ...i, order_id: order.id })));

  if (itemsErr) {
    return NextResponse.json(
      { error: "items insert failed", detail: itemsErr.message, ref: order.ref },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, ref: order.ref, persisted: true });
}