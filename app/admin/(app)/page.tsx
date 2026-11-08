"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Coins,
  Package,
  AlertOctagon,
  Mail,
  Quote,
  ArrowUpRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { PageHead, StatusTag, Skel } from "@/components/admin/ui";

const MAD = (n: number) =>
  `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} MAD`;

type Recent = {
  ref: string;
  nom: string;
  ville: string;
  subtotal: number;
  status: string;
  created_at: string;
};

export default function Dashboard() {
  const sb = createClient();
  const [s, setS] = useState<{
    products: number;
    lowStock: number;
    ordersNew: number;
    ordersAll: number;
    revenue: number;
    subs: number;
    testis: number;
    recent: Recent[];
  } | null>(null);

  useEffect(() => {
    (async () => {
      const [p, low, oNew, oAll, subs, testis, recent, revRows] =
        await Promise.all([
          sb.from("products").select("*", { count: "exact", head: true }),
          sb
            .from("products")
            .select("*", { count: "exact", head: true })
            .lte("stock", 2),
          sb
            .from("orders")
            .select("*", { count: "exact", head: true })
            .eq("status", "nouvelle"),
          sb.from("orders").select("*", { count: "exact", head: true }),
          sb
            .from("newsletter_subscribers")
            .select("*", { count: "exact", head: true }),
          sb.from("testimonials").select("*", { count: "exact", head: true }),
          sb
            .from("orders")
            .select("ref,nom,ville,subtotal,status,created_at")
            .order("created_at", { ascending: false })
            .limit(8),
          sb.from("orders").select("subtotal").in("status", ["confirmée", "livrée"]),
        ]);
      const revenue = (revRows.data ?? []).reduce(
        (a, r) => a + (r.subtotal || 0),
        0,
      );
      setS({
        products: p.count ?? 0,
        lowStock: low.count ?? 0,
        ordersNew: oNew.count ?? 0,
        ordersAll: oAll.count ?? 0,
        revenue,
        subs: subs.count ?? 0,
        testis: testis.count ?? 0,
        recent: (recent.data as Recent[]) ?? [],
      });
    })();
  }, [sb]);

  const cards = s
    ? [
        {
          label: "Commandes à traiter",
          value: s.ordersNew,
          icon: ClipboardList,
          href: "/admin/commandes",
          accent: s.ordersNew > 0,
        },
        { label: "Chiffre confirmé / livré", value: MAD(s.revenue), icon: Coins },
        { label: "Produits en ligne", value: s.products, icon: Package, href: "/admin/produits" },
        {
          label: "Stock faible (≤ 2)",
          value: s.lowStock,
          icon: AlertOctagon,
          href: "/admin/produits",
          warn: s.lowStock > 0,
        },
        { label: "Commandes (total)", value: s.ordersAll, icon: ClipboardList, href: "/admin/commandes" },
        { label: "Abonnés newsletter", value: s.subs, icon: Mail, href: "/admin/newsletter" },
        { label: "Témoignages", value: s.testis, icon: Quote, href: "/admin/temoignages" },
      ]
    : [];

  return (
    <div>
      <PageHead
        title={s ? bonjour() : "Tableau de bord"}
        subtitle="Vue d'ensemble de la boutique."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {!s
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="adm-card adm-shadow p-5">
                <Skel className="h-3 w-24" />
                <Skel className="mt-4 h-8 w-20" />
              </div>
            ))
          : cards.map((c, i) => {
              const Icon = c.icon;
              const body = (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`adm-card adm-shadow group relative overflow-hidden p-5 transition-shadow hover:shadow-[0_2px_4px_rgba(26,21,18,0.06),0_14px_34px_-14px_rgba(26,21,18,0.22)] ${
                    c.accent ? "ring-1 ring-[var(--adm-accent)]/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[var(--adm-faint)]">
                      {c.label}
                    </span>
                    <Icon
                      size={15}
                      className={c.warn ? "text-red-500" : "text-[var(--adm-faint)]"}
                    />
                  </div>
                  <div
                    className={`mt-3 font-display text-[2rem] leading-none ${
                      c.warn && Number(c.value) > 0 ? "text-red-600" : ""
                    }`}
                  >
                    {c.value}
                  </div>
                  {"href" in c && c.href && (
                    <ArrowUpRight
                      size={14}
                      className="absolute right-4 bottom-4 text-[var(--adm-faint)] opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  )}
                </motion.div>
              );
              return "href" in c && c.href ? (
                <Link key={c.label} href={c.href}>
                  {body}
                </Link>
              ) : (
                <div key={c.label}>{body}</div>
              );
            })}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl">Dernières commandes</h2>
        <Link
          href="/admin/commandes"
          className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[var(--adm-accent)] hover:underline"
        >
          Tout voir
        </Link>
      </div>

      <div className="adm-card adm-shadow mt-4 overflow-hidden">
        {!s ? (
          <div className="p-6">
            <Skel className="h-4 w-full" />
            <Skel className="mt-3 h-4 w-3/4" />
            <Skel className="mt-3 h-4 w-5/6" />
          </div>
        ) : s.recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-[0.85rem] text-[var(--adm-faint)]">
            Aucune commande pour le moment.
          </p>
        ) : (
          <table className="w-full text-[0.82rem]">
            <thead className="border-b border-[var(--adm-border)] bg-black/[0.02] text-[0.58rem] uppercase tracking-[0.13em] text-[var(--adm-faint)]">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Réf.</th>
                <th className="px-5 py-3 text-left font-semibold">Client</th>
                <th className="px-5 py-3 text-left font-semibold">Ville</th>
                <th className="px-5 py-3 text-right font-semibold">Total</th>
                <th className="px-5 py-3 text-left font-semibold">Statut</th>
                <th className="px-5 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {s.recent.map((o) => (
                <tr
                  key={o.ref}
                  className="border-b border-[var(--adm-border)] last:border-0 hover:bg-black/[0.015]"
                >
                  <td className="px-5 py-3.5 font-mono text-[0.7rem] text-[var(--adm-muted)]">
                    {o.ref}
                  </td>
                  <td className="px-5 py-3.5 font-medium">{o.nom}</td>
                  <td className="px-5 py-3.5 text-[var(--adm-muted)]">{o.ville}</td>
                  <td className="px-5 py-3.5 text-right tabular-nums">
                    {MAD(o.subtotal)}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusTag s={o.status} />
                  </td>
                  <td className="px-5 py-3.5 text-[var(--adm-faint)]">
                    {new Date(o.created_at).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function bonjour() {
  const h = new Date().getHours();
  return h < 12 ? "Bonjour" : h < 18 ? "Bon après-midi" : "Bonsoir";
}