"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";
import { SITE_URL } from "@/lib/site";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [mode, setMode] = useState<"login" | "forgot" | "sent">("login");
  const [resetEmail, setResetEmail] = useState("");
  const [resetErr, setResetErr] = useState<string | null>(null);
  const [resetBusy, setResetBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { error } = await createClient().auth.signInWithPassword({
      email: email.trim(),
      password: pw,
    });
    setBusy(false);
    if (error) return setErr("Identifiants invalides.");
    router.replace("/admin");
    router.refresh();
  };

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErr(null);
    setResetBusy(true);
    const { error } = await createClient().auth.resetPasswordForEmail(
      resetEmail.trim(),
      { redirectTo: `${SITE_URL}/admin/reset-password` },
    );
    setResetBusy(false);
    // Always show the same confirmation, whether or not the address exists —
    // never reveal which admin e-mails are valid to whoever is at this form.
    if (error && (error.status ?? 0) >= 500) {
      setResetErr("Le service est momentanément indisponible. Réessayez.");
      return;
    }
    setMode("sent");
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

        <AnimatePresence mode="wait">
          {mode === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={submit}
            >
              <p className="mt-2 text-[0.8rem] text-black/45">
                Accès réservé à l&apos;équipe BTL LIVING.
              </p>

              <div className="mt-8 space-y-4">
                <div>
                  <span className="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-black/40">
                    E-mail
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={field}
                    autoComplete="username"
                  />
                </div>
                <div>
                  <span className="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-black/40">
                    Mot de passe
                  </span>
                  <input
                    type="password"
                    required
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    className={field}
                    autoComplete="current-password"
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
                {busy ? "Connexion…" : "Se connecter"}
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setResetEmail(email);
                  setResetErr(null);
                }}
                className="mt-5 w-full text-center text-[0.72rem] text-black/45 underline-offset-2 hover:text-[#9a5b32] hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </motion.form>
          )}

          {mode === "forgot" && (
            <motion.form
              key="forgot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={sendReset}
            >
              <p className="mt-2 text-[0.8rem] text-black/45">
                Indiquez votre e-mail d&apos;administrateur — un lien de
                réinitialisation vous sera envoyé.
              </p>

              <div className="mt-8">
                <span className="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-black/40">
                  E-mail
                </span>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className={field}
                  autoComplete="username"
                />
              </div>

              {resetErr && (
                <p className="mt-3 text-[0.8rem] text-red-600">{resetErr}</p>
              )}

              <motion.button
                type="submit"
                disabled={resetBusy}
                whileTap={{ scale: 0.98 }}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a1512] py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#9a5b32] disabled:opacity-50"
              >
                {resetBusy && <Loader2 size={15} className="animate-spin" />}
                {resetBusy ? "Envoi…" : "Envoyer le lien"}
              </motion.button>

              <button
                type="button"
                onClick={() => setMode("login")}
                className="mt-5 w-full text-center text-[0.72rem] text-black/45 underline-offset-2 hover:text-[#9a5b32] hover:underline"
              >
                ← Retour à la connexion
              </button>
            </motion.form>
          )}

          {mode === "sent" && (
            <motion.div
              key="sent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="mt-4 text-[0.9rem] leading-relaxed text-black/70">
                Si un compte existe pour <strong>{resetEmail.trim()}</strong>,
                un lien de réinitialisation vient d&apos;être envoyé. Ouvrez-le
                pour choisir un nouveau mot de passe.
              </p>
              <button
                type="button"
                onClick={() => setMode("login")}
                className="mt-7 w-full rounded-lg border border-black/15 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-black/60 transition-colors hover:border-[#9a5b32] hover:text-[#9a5b32]"
              >
                ← Retour à la connexion
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}