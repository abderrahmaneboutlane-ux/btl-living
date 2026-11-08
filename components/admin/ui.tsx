"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

/* ─────────────────────────── inputs ─────────────────────────── */

export const inputCls =
  "w-full rounded-lg border border-[var(--adm-border-strong)] bg-white px-3 py-2.5 text-[0.88rem] text-[var(--adm-text)] outline-none transition-colors placeholder:text-[var(--adm-faint)] focus:border-[var(--adm-accent)] focus:ring-2 focus:ring-[var(--adm-accent)]/15";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-[var(--adm-faint)]">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-[0.7rem] text-[var(--adm-faint)]">
          {hint}
        </span>
      )}
    </label>
  );
}

/* ─────────────────────────── button ─────────────────────────── */

export function Btn({
  children,
  onClick,
  type = "button",
  variant = "solid",
  size = "md",
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "solid" | "ghost" | "danger" | "quiet";
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}) {
  const v =
    variant === "solid"
      ? "bg-[var(--adm-text)] text-white hover:bg-[var(--adm-accent)]"
      : variant === "danger"
        ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
        : variant === "quiet"
          ? "text-[var(--adm-muted)] hover:bg-black/[0.04] hover:text-[var(--adm-text)]"
          : "border border-[var(--adm-border-strong)] bg-white text-[var(--adm-text)] hover:border-[var(--adm-accent)] hover:text-[var(--adm-accent)]";
  const s =
    size === "sm" ? "px-3 py-1.5 text-[0.66rem]" : "px-4 py-2.5 text-[0.7rem]";
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2 rounded-lg font-semibold uppercase tracking-[0.1em] transition-colors disabled:pointer-events-none disabled:opacity-40 ${v} ${s} ${className}`}
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────── pills ──────────────────────────── */

const STATUS_STYLE: Record<string, string> = {
  nouvelle: "bg-amber-100 text-amber-800",
  "confirmée": "bg-sky-100 text-sky-800",
  "livrée": "bg-emerald-100 text-emerald-800",
  "annulée": "bg-black/[0.06] text-[var(--adm-faint)]",
};

export function StatusTag({ s }: { s: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.06em] ${
        STATUS_STYLE[s] ?? "bg-black/[0.06] text-[var(--adm-faint)]"
      }`}
    >
      {s}
    </span>
  );
}

export function Dot({ tone }: { tone: "on" | "off" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[0.68rem] font-medium ${
        tone === "on" ? "text-emerald-600" : "text-[var(--adm-faint)]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === "on" ? "bg-emerald-500" : "bg-[var(--adm-faint)]"
        }`}
      />
      {tone === "on" ? "En ligne" : "Masqué"}
    </span>
  );
}

/* ─────────────────────────── skeleton ───────────────────────── */

export function Skel({ className = "" }: { className?: string }) {
  return <div className={`adm-skel ${className}`} />;
}

export function TableSkeleton({
  rows = 6,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="adm-card adm-shadow overflow-hidden">
      <div className="border-b border-[var(--adm-border)] bg-black/[0.02] px-5 py-3">
        <Skel className="h-3 w-24" />
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-6 border-b border-[var(--adm-border)] px-5 py-4 last:border-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skel key={c} className={`h-3 ${c === 0 ? "w-40" : "w-20"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────── slide-over ─────────────────────── */

export function SlideOver({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-[var(--adm-text)]/30 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            className="adm-scroll fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
          >
            <div className="flex items-center justify-between border-b border-[var(--adm-border)] px-7 py-5">
              <h2 className="font-display text-xl">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-[var(--adm-faint)] transition-colors hover:bg-black/[0.05] hover:text-[var(--adm-text)]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="adm-scroll flex-1 overflow-y-auto px-7 py-6">
              {children}
            </div>
            {footer && (
              <div className="border-t border-[var(--adm-border)] px-7 py-4">
                {footer}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────── toasts ─────────────────────────── */

type ToastItem = { id: number; msg: string; kind: "ok" | "err" };
const ToastCtx = createContext<{
  push: (msg: string, kind?: "ok" | "err") => void;
}>({ push: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x, { id, msg, kind }]);
    window.setTimeout(
      () => setItems((x) => x.filter((t) => t.id !== id)),
      3200,
    );
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="pointer-events-auto flex items-center gap-2.5 rounded-xl bg-[var(--adm-text)] px-4 py-3 text-[0.82rem] text-white shadow-lg"
            >
              {t.kind === "ok" ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : (
                <AlertTriangle size={16} className="text-amber-400" />
              )}
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}

/* ─────────────────────────── page header ───────────────────── */

export function PageHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[2rem] leading-none tracking-[-0.01em]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-[0.85rem] text-[var(--adm-muted)]">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}