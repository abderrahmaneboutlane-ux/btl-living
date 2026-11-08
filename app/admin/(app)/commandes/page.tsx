"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircle, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import {
  PageHead,
  StatusTag,
  TableSkeleton,
  inputCls,
  useToast,
} from "@/components/admin/ui";

const MAD = (n: number) =>
  `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} MAD`;

const STATUSES = ["nouvelle", "confirmée", "livrée", "annulée"] as const;

interface Order {
  id: string;
  ref: string;
  nom: string;
  telephone: string;
  ville: string;
  adresse: string;
  note: string;
  subtotal: number;
  is_estimate: boolean;
  status: string;
  created_at: string;
}
interface Item {
  order_id: string;
  name: string;
  qty: number;
  unit_price: number;
}

export default function CommandesAdmin() {
  const sb = createClient();
  const { push } = useToast();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<string>("tous");
  const [q, setQ] = useState("");
  const [openRow, setOpenRow] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [o, it] = await Promise.all([
      sb.from("orders").select("*").order("created_at", { ascending: false }),
      sb.from("order_items").select("order_id,name,qty,unit_price"),
    ]);
    setOrders((o.data as Order[]) ?? []);
    setItems((it.data as Item[]) ?? []);
  }, [sb]);
  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    const { error } = await sb.from("orders").update({ status }).eq("id", id);
    if (error) return push(error.message, "err");
    setOrders((o) => (o ? o.map((x) => (x.id === id ? { ...x, status } : x)) : o));
    push("Statut mis à jour");
  };

  const counts = useMemo(() => {
    const m: Record<string, number> = { tous: orders?.length ?? 0 };
    STATUSES.forEach((s) => (m[s] = orders?.filter((o) => o.status === s).length ?? 0));
    return m;
  }, [orders]);

  const shown = useMemo(() => {
    if (!orders) return [];
    const t = q.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (filter === "tous" || o.status === filter) &&
        (!t ||
          o.ref.toLowerCase().includes(t) ||
          o.nom.toLowerCase().includes(t) ||
          o.ville.toLowerCase().includes(t) ||
          o.telephone.includes(t)),
    );
  }, [orders, filter, q]);

  return (
    <div>
      <PageHead
        title="Commandes"
        subtitle={
          orders
            ? `${counts.nouvelle} à traiter · ${orders.length} au total.`
            : undefined
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-faint)]"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Réf, nom, ville, téléphone…"
            className={`${inputCls} pl-9`}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["tous", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-[0.66rem] font-medium capitalize transition-colors ${
                filter === s
                  ? "bg-[var(--adm-text)] text-white"
                  : "border border-[var(--adm-border-strong)] text-[var(--adm-muted)] hover:border-[var(--adm-accent)]"
              }`}
            >
              {s} <span className="opacity-50">{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {!orders ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <div className="space-y-2.5">
          {shown.map((o) => {
            const lines = items.filter((i) => i.order_id === o.id);
            const open = openRow === o.id;
            return (
              <div
                key={o.id}
                className="adm-card adm-shadow overflow-hidden"
              >
                <button
                  onClick={() => setOpenRow(open ? null : o.id)}
                  className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 text-left text-[0.85rem]"
                >
                  <span className="font-mono text-[0.7rem] text-[var(--adm-faint)]">
                    {o.ref}
                  </span>
                  <span className="font-medium">{o.nom}</span>
                  <span className="text-[var(--adm-muted)]">{o.ville}</span>
                  <span className="ml-auto tabular-nums">
                    {o.is_estimate ? "~ " : ""}
                    {MAD(o.subtotal)}
                  </span>
                  <StatusTag s={o.status} />
                  <span className="hidden text-[0.7rem] text-[var(--adm-faint)] sm:inline">
                    {new Date(o.created_at).toLocaleDateString("fr-FR")}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[var(--adm-faint)] transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden border-t border-[var(--adm-border)] bg-black/[0.015]"
                    >
                      <div className="grid gap-6 px-5 py-5 md:grid-cols-2">
                        <div>
                          <h3 className="text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-[var(--adm-faint)]">
                            Articles
                          </h3>
                          <ul className="mt-2.5 space-y-1.5 text-[0.83rem]">
                            {lines.map((l, i) => (
                              <li
                                key={i}
                                className="flex justify-between gap-4"
                              >
                                <span>
                                  {l.name}{" "}
                                  <span className="text-[var(--adm-faint)]">
                                    × {l.qty}
                                  </span>
                                </span>
                                <span className="tabular-nums">
                                  {MAD(l.unit_price * l.qty)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-[0.83rem]">
                          <h3 className="text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-[var(--adm-faint)]">
                            Client
                          </h3>
                          <a
                            href={`https://wa.me/${o.telephone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener"
                            className="mt-2 inline-flex items-center gap-1.5 text-[var(--adm-accent)] hover:underline"
                          >
                            <MessageCircle size={13} />
                            {o.telephone}
                          </a>
                          {o.adresse && (
                            <p className="mt-1 text-[var(--adm-muted)]">
                              {o.adresse}
                            </p>
                          )}
                          {o.note && (
                            <p className="mt-1 text-[var(--adm-faint)]">
                              Note : {o.note}
                            </p>
                          )}

                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {STATUSES.map((s) => (
                              <button
                                key={s}
                                onClick={() => setStatus(o.id, s)}
                                disabled={o.status === s}
                                className={`rounded-lg px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.08em] transition-colors ${
                                  o.status === s
                                    ? "bg-[var(--adm-text)] text-white"
                                    : "border border-[var(--adm-border-strong)] text-[var(--adm-muted)] hover:border-[var(--adm-accent)]"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {shown.length === 0 && (
            <p className="adm-card py-10 text-center text-[0.85rem] text-[var(--adm-faint)]">
              Aucune commande.
            </p>
          )}
        </div>
      )}
    </div>
  );
}