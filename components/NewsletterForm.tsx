"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <p className="mt-6 text-[0.78rem] font-light text-espresso/60">
        Merci — vous êtes inscrit·e.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <label
        htmlFor="nl-email"
        className="block text-[0.55rem] font-light uppercase tracking-luxe text-espresso/40"
      >
        Nouveautés & pièces en avant-première
      </label>
      <div className="mt-2 flex border border-espresso/20">
        <input
          id="nl-email"
          type="email"
          required
          placeholder="Votre e-mail"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          className="min-w-0 flex-1 bg-porcelain px-3 py-2.5 text-[0.82rem] font-light outline-none"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="shrink-0 bg-espresso px-4 text-[0.58rem] font-light uppercase tracking-wide2 text-porcelain transition-colors hover:bg-cognac disabled:opacity-50"
        >
          {state === "loading" ? "…" : "OK"}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-[0.68rem] font-light text-cognac">
          Vérifiez l&apos;adresse e-mail.
        </p>
      )}
    </form>
  );
}