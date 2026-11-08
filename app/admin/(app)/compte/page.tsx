"use client";

import { useEffect, useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { PageHead, Field, inputCls, Btn, useToast } from "@/components/admin/ui";

export default function ComptePage() {
  const sb = createClient();
  const { push } = useToast();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    sb.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, [sb]);

  const change = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return push("8 caractères minimum", "err");
    if (pw !== pw2) return push("Les mots de passe diffèrent", "err");
    setBusy(true);
    const { error } = await sb.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return push(error.message, "err");
    setPw("");
    setPw2("");
    push("Mot de passe mis à jour");
  };

  return (
    <div className="max-w-md">
      <PageHead title="Mon compte" subtitle={email} />

      <form onSubmit={change} className="adm-card adm-shadow space-y-4 p-6">
        <div className="flex items-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-[var(--adm-faint)]">
          <KeyRound size={13} /> Changer le mot de passe
        </div>
        <Field label="Nouveau mot de passe">
          <input
            type="password"
            className={inputCls}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="new-password"
          />
        </Field>
        <Field label="Confirmer">
          <input
            type="password"
            className={inputCls}
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            autoComplete="new-password"
          />
        </Field>
        <Btn type="submit" disabled={busy}>
          {busy && <Loader2 size={14} className="animate-spin" />}
          {busy ? "…" : "Mettre à jour"}
        </Btn>
      </form>
    </div>
  );
}