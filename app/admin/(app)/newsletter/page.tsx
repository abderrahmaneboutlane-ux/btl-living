"use client";

import { useEffect, useState } from "react";
import { Copy, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { PageHead, Btn, TableSkeleton, useToast } from "@/components/admin/ui";

export default function NewsletterAdmin() {
  const sb = createClient();
  const { push } = useToast();
  const [emails, setEmails] = useState<
    { email: string; created_at: string }[] | null
  >(null);

  useEffect(() => {
    sb.from("newsletter_subscribers")
      .select("email,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setEmails(data ?? []));
  }, [sb]);

  const list = emails ?? [];

  const copyAll = () =>
    navigator.clipboard
      ?.writeText(list.map((e) => e.email).join(", "))
      .then(() => push("Adresses copiées"));

  const csv = () => {
    const blob = new Blob(
      ["email,inscrit_le\n" + list.map((e) => `${e.email},${e.created_at}`).join("\n")],
      { type: "text/csv" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "btl-living-newsletter.csv";
    a.click();
  };

  return (
    <div>
      <PageHead
        title="Newsletter"
        subtitle={emails ? `${list.length} abonné${list.length > 1 ? "s" : ""}.` : undefined}
        action={
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={copyAll} disabled={!list.length}>
              <Copy size={13} /> Copier
            </Btn>
            <Btn onClick={csv} disabled={!list.length}>
              <Download size={13} /> CSV
            </Btn>
          </div>
        }
      />

      {!emails ? (
        <TableSkeleton rows={6} cols={2} />
      ) : (
        <div className="adm-card adm-shadow overflow-hidden">
          <table className="w-full text-[0.85rem]">
            <thead className="border-b border-[var(--adm-border)] bg-black/[0.02] text-[0.58rem] uppercase tracking-[0.13em] text-[var(--adm-faint)]">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">E-mail</th>
                <th className="px-5 py-3 text-left font-semibold">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr
                  key={e.email}
                  className="border-b border-[var(--adm-border)] last:border-0 hover:bg-black/[0.015]"
                >
                  <td className="px-5 py-3.5">{e.email}</td>
                  <td className="px-5 py-3.5 text-[var(--adm-muted)]">
                    {new Date(e.created_at).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-5 py-10 text-center text-[var(--adm-faint)]"
                  >
                    Aucun abonné.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}