"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import {
  PageHead,
  Field,
  inputCls,
  Btn,
  TableSkeleton,
  useToast,
} from "@/components/admin/ui";

interface T {
  id: number;
  quote: string;
  prenom: string;
  ville: string;
  rating: number;
  published: boolean;
  sort_order: number;
}

export default function TemoignagesAdmin() {
  const sb = createClient();
  const { push } = useToast();
  const [rows, setRows] = useState<T[] | null>(null);
  const [draft, setDraft] = useState({
    quote: "",
    prenom: "",
    ville: "",
    rating: 5,
  });

  const load = useCallback(async () => {
    const { data } = await sb
      .from("testimonials")
      .select("*")
      .order("sort_order")
      .order("id");
    setRows((data as T[]) ?? []);
  }, [sb]);
  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    if (!draft.quote || !draft.prenom)
      return push("Citation et prénom requis", "err");
    const { error } = await sb.from("testimonials").insert({
      ...draft,
      published: false,
      sort_order: (rows?.length ?? 0) + 1,
    });
    if (error) return push(error.message, "err");
    setDraft({ quote: "", prenom: "", ville: "", rating: 5 });
    push("Ajouté (non publié)");
    load();
  };
  const toggle = async (t: T) => {
    const { error } = await sb
      .from("testimonials")
      .update({ published: !t.published })
      .eq("id", t.id);
    if (error) return push(error.message, "err");
    push(t.published ? "Masqué" : "Publié sur le site");
    load();
  };
  const del = async (id: number) => {
    if (!window.confirm("Supprimer ce témoignage ?")) return;
    await sb.from("testimonials").delete().eq("id", id);
    push("Supprimé");
    load();
  };

  return (
    <div>
      <PageHead
        title="Témoignages"
        subtitle="Seuls les témoignages publiés apparaissent sur la page d'accueil."
      />

      <div className="adm-card adm-shadow mb-6 p-6">
        <h2 className="text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-[var(--adm-faint)]">
          Nouveau témoignage
        </h2>
        <div className="mt-4 grid gap-4">
          <Field label="Citation">
            <textarea
              rows={2}
              className={`${inputCls} resize-none`}
              value={draft.quote}
              onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Prénom">
              <input
                className={inputCls}
                value={draft.prenom}
                onChange={(e) => setDraft({ ...draft, prenom: e.target.value })}
              />
            </Field>
            <Field label="Ville">
              <input
                className={inputCls}
                value={draft.ville}
                onChange={(e) => setDraft({ ...draft, ville: e.target.value })}
              />
            </Field>
            <Field label="Note">
              <input
                type="number"
                min={1}
                max={5}
                className={inputCls}
                value={draft.rating}
                onChange={(e) =>
                  setDraft({ ...draft, rating: +e.target.value })
                }
              />
            </Field>
          </div>
          <Btn onClick={add} className="w-fit">
            <Plus size={14} /> Ajouter
          </Btn>
        </div>
      </div>

      {!rows ? (
        <TableSkeleton rows={3} cols={2} />
      ) : rows.length === 0 ? (
        <p className="adm-card py-10 text-center text-[0.85rem] text-[var(--adm-faint)]">
          Aucun témoignage.
        </p>
      ) : (
        <div className="grid gap-3">
          {rows.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="adm-card adm-shadow flex items-start gap-4 p-5"
            >
              <div className="flex-1">
                <div className="flex gap-0.5 text-[var(--adm-accent)]">
                  {Array.from({ length: Math.max(1, Math.min(5, t.rating)) }).map(
                    (_, k) => (
                      <Star key={k} size={13} fill="currentColor" />
                    ),
                  )}
                </div>
                <p className="mt-2 text-[0.9rem] text-[var(--adm-text)]/85">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-2 text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-[var(--adm-faint)]">
                  {t.prenom}
                  {t.ville ? ` — ${t.ville}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                  onClick={() => toggle(t)}
                  className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.06em] transition-colors ${
                    t.published
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-black/[0.06] text-[var(--adm-faint)]"
                  }`}
                >
                  {t.published ? "publié" : "masqué"}
                </button>
                <button
                  onClick={() => del(t.id)}
                  className="inline-flex items-center gap-1 text-[0.62rem] font-medium uppercase tracking-[0.1em] text-red-500 hover:underline"
                >
                  <Trash2 size={12} /> Supprimer
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}