"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const sb = createClient();

  // The recovery link puts an access token in the URL hash; supabase-js
  // picks it up on load and fires this event once the session is ready.
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: sub } = sb.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // also cover the case where the session was already established by the
    // time this component mounts (fast networks / already-open tab)
    sb.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (pw.length < 6) return setErr("6 caractères minimum.");
    if (pw !== pw2) return setErr("Les mots de passe diffèrent.");
    setBusy(true);
    const { error } = await sb.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr(error.message);
    setDone(true);
    setTimeout(() => router.replace("/admin"), 1600);
  };

  const field =
    "w-full rounded-lg border border-black/15 bg-white px-3.5 py-3 text-[0.9rem] outline-none transition-colors focus:border-[#9a5b32] focus:ring-2 focus:ring-[#9a5b32]/15";

  return (
    <div className="adm flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="adm-card adm-shadow w-full max-w-[400px] p-9"
      >
        <div className="flex items-end gap-2.5">
          <span className="font-display text-[1.7rem] leading-none">BTL</span>
          <span className="mb-[3px] h-3.5 w-px bg-black/20" />
          <span className="mb-[2px] text-[0.55rem] font-semibold uppercase tracking-[0.4em] text-[#9a5b32]">
            Administration
          </span>
        </div>

        {checking ? (
          <div className="mt-8 flex items-center gap-2 text-[0.85rem] text-black/45">
            <Loader2 size={15} className="animate-spin" /> Vérification du
            lien…
          </div>
        ) : done ? (
          <p className="mt-6 text-[0.9rem] text-black/70">
            Mot de passe mis à jour. Redirection…
          </p>
        ) : !ready ? (
          <div className="mt-6">
            <p className="text-[0.85rem] leading-relaxed text-black/60">
              Ce lien de réinitialisation est invalide ou a expiré. Redemandez
              un lien depuis la page de connexion.
            </p>
            <a
              href="/admin/login"
              className="mt-6 block w-full rounded-lg border border-black/15 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-black/60 transition-colors hover:border-[#9a5b32] hover:text-[#9a5b32]"
            >
              ← Retour à la connexion
            </a>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p className="mt-2 flex items-center gap-1.5 text-[0.8rem] text-black/45">
              <KeyRound size={13} /> Choisissez un nouveau mot de passe.
            </p>
            <div className="mt-7 space-y-4">
              <div>
                <span className="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-black/40">
                  Nouveau mot de passe
                </span>
                <input
                  type="password"
                  required
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className={field}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <span className="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-black/40">
                  Confirmer
                </span>
                <input
                  type="password"
                  required
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  className={field}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {err && <p className="mt-3 text-[0.8rem] text-red-600">{err}</p>}

            <motion.button
              type="submit"
              disabled={busy}
              whileTap={{ scale: 0.98 }}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a1512] py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#9a5b32] disabled:opacity-50"
            >
              {busy && <Loader2 size={15} className="animate-spin" />}
              {busy ? "…" : "Mettre à jour"}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}