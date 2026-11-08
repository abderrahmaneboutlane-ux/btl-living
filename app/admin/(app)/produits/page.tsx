"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Upload, Trash2, Loader2, ImageOff } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { parseImages, encodeImages } from "@/lib/products";
import {
  PageHead,
  Field,
  inputCls,
  Btn,
  Dot,
  SlideOver,
  TableSkeleton,
  useToast,
} from "@/components/admin/ui";

interface Row {
  slug: string;
  name: string;
  category_key: string;
  price: number;
  price_from: boolean;
  stock: number;
  in_stock: boolean;
  tagline: string;
  description: string;
  matiere: string;
  finition: string;
  dimensions: string;
  delai: string;
  badge: string | null;
  image_url: string | null;
  sort_order: number;
}

const BLANK: Row = {
  slug: "",
  name: "",
  category_key: "salon",
  price: 0,
  price_from: false,
  stock: 0,
  in_stock: true,
  tagline: "",
  description: "",
  matiere: "",
  finition: "",
  dimensions: "",
  delai: "",
  badge: "",
  image_url: "",
  sort_order: 50,
};

const MAD = (n: number) =>
  `${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} MAD`;

export default function ProduitsAdmin() {
  const sb = createClient();
  const { push } = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [cats, setCats] = useState<{ key: string; label: string }[]>([]);
  const [edit, setEdit] = useState<Row | null>(null);
  const [imgs, setImgs] = useState<string[]>([]); // up to 3, edited via the slots
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("tous");

  // open the editor for a row (or a blank new product), loading its photos
  const openEditor = (row: Row, creating: boolean) => {
    setEdit(row);
    setIsNew(creating);
    setImgs(parseImages(row.image_url).slice(0, 3));
  };
  const setImg = (i: number, url: string) => {
    setImgs((prev) => {
      const next = [...prev];
      next[i] = url;
      return next;
    });
  };

  const load = useCallback(async () => {
    const [p, c] = await Promise.all([
      sb.from("products").select("*").order("category_key").order("sort_order"),
      sb.from("categories").select("key,label").order("sort_order"),
    ]);
    setRows((p.data as Row[]) ?? []);
    setCats(c.data ?? []);
  }, [sb]);
  useEffect(() => {
    load();
  }, [load]);

  const shown = useMemo(() => {
    if (!rows) return [];
    const t = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (catFilter === "tous" || r.category_key === catFilter) &&
        (!t ||
          r.name.toLowerCase().includes(t) ||
          r.slug.toLowerCase().includes(t)),
    );
  }, [rows, q, catFilter]);

  // the public pages cache Supabase reads for up to an hour (ISR) — flush
  // just the affected ones so an admin edit shows up on the site right away
  const revalidate = (slug?: string, category?: string) => {
    fetch("/api/admin/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, category }),
    }).catch(() => {});
  };

  const save = async () => {
    if (!edit) return;
    if (!edit.slug || !edit.name) return push("Slug et nom obligatoires", "err");
    setBusy(true);
    const payload = {
      ...edit,
      badge: edit.badge || null,
      image_url: encodeImages(imgs),
    };
    const { error } = isNew
      ? await sb.from("products").insert(payload)
      : await sb.from("products").update(payload).eq("slug", edit.slug);
    setBusy(false);
    if (error) return push(error.message, "err");
    push(isNew ? "Produit ajouté" : "Modifications enregistrées");
    revalidate(edit.slug, edit.category_key);
    setEdit(null);
    load();
  };

  const del = async (slug: string) => {
    if (!window.confirm(`Supprimer définitivement « ${slug} » ?`)) return;
    const category = rows?.find((r) => r.slug === slug)?.category_key;
    const { error } = await sb.from("products").delete().eq("slug", slug);
    if (error) return push(error.message, "err");
    push("Produit supprimé");
    revalidate(slug, category);
    setEdit(null);
    load();
  };

  const IMAGE_SLOTS = [
    { i: 0, label: "Photo principale", suffix: "" },
    { i: 1, label: "Photo 2", suffix: "-2" },
    { i: 2, label: "Photo 3", suffix: "-3" },
  ] as const;

  const upload = async (file: File, i: number, suffix: string) => {
    if (!edit) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("slug", (edit.slug || "") + suffix);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await res.json();
    setBusy(false);
    if (!res.ok) return push("Upload : " + (j.error || res.status), "err");
    setImg(i, j.url);
    push("Photo téléversée");
  };

  const catLabel = (k: string) => cats.find((c) => c.key === k)?.label ?? k;

  return (
    <div>
      <PageHead
        title="Produits & stock"
        subtitle={rows ? `${rows.length} références au catalogue.` : undefined}
        action={
          <Btn onClick={() => openEditor({ ...BLANK }, true)}>
            <Plus size={14} /> Nouveau produit
          </Btn>
        }
      />

      {/* toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-faint)]"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher…"
            className={`${inputCls} pl-9`}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["tous", ...cats.map((c) => c.key)].map((k) => (
            <button
              key={k}
              onClick={() => setCatFilter(k)}
              className={`rounded-full px-3 py-1.5 text-[0.66rem] font-medium capitalize transition-colors ${
                catFilter === k
                  ? "bg-[var(--adm-text)] text-white"
                  : "border border-[var(--adm-border-strong)] text-[var(--adm-muted)] hover:border-[var(--adm-accent)]"
              }`}
            >
              {k === "tous" ? "Tous" : catLabel(k)}
            </button>
          ))}
        </div>
      </div>

      {!rows ? (
        <TableSkeleton rows={7} cols={5} />
      ) : (
        <div className="adm-card adm-shadow overflow-hidden">
          <table className="w-full text-[0.83rem]">
            <thead className="border-b border-[var(--adm-border)] bg-black/[0.02] text-[0.58rem] uppercase tracking-[0.13em] text-[var(--adm-faint)]">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Produit</th>
                <th className="px-5 py-3 text-left font-semibold">Catégorie</th>
                <th className="px-5 py-3 text-right font-semibold">Prix</th>
                <th className="px-5 py-3 text-right font-semibold">Stock</th>
                <th className="px-5 py-3 text-left font-semibold">Visibilité</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr
                  key={r.slug}
                  onClick={() => openEditor({ ...r }, false)}
                  className="cursor-pointer border-b border-[var(--adm-border)] last:border-0 hover:bg-black/[0.015]"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {parseImages(r.image_url)[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={parseImages(r.image_url)[0]}
                          alt=""
                          className="h-11 w-9 shrink-0 rounded object-cover"
                        />
                      ) : (
                        <span className="grid h-11 w-9 shrink-0 place-items-center rounded bg-black/[0.04] text-[var(--adm-faint)]">
                          <ImageOff size={14} />
                        </span>
                      )}
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="font-mono text-[0.68rem] text-[var(--adm-faint)]">
                          {r.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[var(--adm-muted)]">
                    {catLabel(r.category_key)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {r.price_from ? "dès " : ""}
                    {MAD(r.price)}
                  </td>
                  <td
                    className={`px-5 py-3 text-right tabular-nums ${
                      r.stock <= 2 ? "font-semibold text-red-600" : ""
                    }`}
                  >
                    {r.stock}
                  </td>
                  <td className="px-5 py-3">
                    <Dot tone={r.in_stock ? "on" : "off"} />
                  </td>
                  <td className="px-5 py-3 text-right text-[var(--adm-faint)]">
                    modifier →
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-[var(--adm-faint)]"
                  >
                    Aucun produit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <SlideOver
        open={!!edit}
        onClose={() => setEdit(null)}
        title={isNew ? "Nouveau produit" : edit?.name}
        footer={
          edit && (
            <div className="flex items-center justify-between">
              <Btn onClick={save} disabled={busy}>
                {busy ? <Loader2 size={14} className="animate-spin" /> : null}
                {busy ? "…" : "Enregistrer"}
              </Btn>
              {!isNew && (
                <Btn variant="danger" onClick={() => del(edit.slug)}>
                  <Trash2 size={13} /> Supprimer
                </Btn>
              )}
            </div>
          )
        }
      >
        {edit && (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Slug"
                hint={isNew ? "minuscules, sans espace" : "non modifiable"}
              >
                <input
                  className={inputCls}
                  value={edit.slug}
                  disabled={!isNew}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                />
              </Field>
              <Field label="Nom affiché">
                <input
                  className={inputCls}
                  value={edit.name}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Accroche">
              <input
                className={inputCls}
                value={edit.tagline}
                onChange={(e) => setEdit({ ...edit, tagline: e.target.value })}
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={3}
                className={`${inputCls} resize-none`}
                value={edit.description}
                onChange={(e) =>
                  setEdit({ ...edit, description: e.target.value })
                }
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Catégorie">
                <select
                  className={inputCls}
                  value={edit.category_key}
                  onChange={(e) =>
                    setEdit({ ...edit, category_key: e.target.value })
                  }
                >
                  {cats.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Badge (optionnel)">
                <input
                  className={inputCls}
                  value={edit.badge ?? ""}
                  placeholder="Signature, Nouveau…"
                  onChange={(e) => setEdit({ ...edit, badge: e.target.value })}
                />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Prix (MAD)">
                <input
                  type="number"
                  className={inputCls}
                  value={edit.price}
                  onChange={(e) =>
                    setEdit({ ...edit, price: +e.target.value })
                  }
                />
              </Field>
              <Field label="Stock">
                <input
                  type="number"
                  className={inputCls}
                  value={edit.stock}
                  onChange={(e) =>
                    setEdit({ ...edit, stock: +e.target.value })
                  }
                />
              </Field>
              <Field label="Ordre">
                <input
                  type="number"
                  className={inputCls}
                  value={edit.sort_order}
                  onChange={(e) =>
                    setEdit({ ...edit, sort_order: +e.target.value })
                  }
                />
              </Field>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-[0.83rem]">
                <input
                  type="checkbox"
                  className="accent-[var(--adm-accent)]"
                  checked={edit.price_from}
                  onChange={(e) =>
                    setEdit({ ...edit, price_from: e.target.checked })
                  }
                />
                Prix « à partir de »
              </label>
              <label className="flex items-center gap-2 text-[0.83rem]">
                <input
                  type="checkbox"
                  className="accent-[var(--adm-accent)]"
                  checked={edit.in_stock}
                  onChange={(e) =>
                    setEdit({ ...edit, in_stock: e.target.checked })
                  }
                />
                Visible sur le site
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  ["Matière", "matiere"],
                  ["Finition", "finition"],
                  ["Dimensions", "dimensions"],
                  ["Délai", "delai"],
                ] as const
              ).map(([label, key]) => (
                <Field key={key} label={label}>
                  <input
                    className={inputCls}
                    value={edit[key]}
                    onChange={(e) =>
                      setEdit({ ...edit, [key]: e.target.value })
                    }
                  />
                </Field>
              ))}
            </div>

            <div>
              <div className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-[var(--adm-faint)]">
                Photos du produit
              </div>
              <p className="mb-3 text-[0.72rem] text-[var(--adm-muted)]">
                Jusqu&apos;à 3 photos — la 1ʳᵉ est la photo de couverture.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {IMAGE_SLOTS.map(({ i, label, suffix }) => (
                  <Field
                    key={i}
                    label={label}
                    hint={i === 0 ? "couverture" : "optionnelle"}
                  >
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-[var(--adm-border-strong)] px-3 py-3 text-[0.76rem] text-[var(--adm-muted)] transition-colors hover:border-[var(--adm-accent)] hover:text-[var(--adm-text)]">
                      <Upload size={14} />
                      {busy ? "Envoi…" : "Choisir"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          upload(e.target.files[0], i, suffix)
                        }
                      />
                    </label>
                    <input
                      className={`${inputCls} mt-2 text-[0.76rem]`}
                      value={imgs[i] ?? ""}
                      placeholder="https://…"
                      onChange={(e) => setImg(i, e.target.value)}
                    />
                    {imgs[i] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgs[i]}
                        alt=""
                        className="mt-3 aspect-[4/5] w-full rounded-lg object-cover"
                      />
                    )}
                  </Field>
                ))}
              </div>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  );
}