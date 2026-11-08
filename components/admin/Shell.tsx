"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Package,
  ClipboardList,
  Quote,
  Mail,
  UserCog,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutGrid },
  { href: "/admin/produits", label: "Produits & stock", icon: Package },
  { href: "/admin/commandes", label: "Commandes", icon: ClipboardList },
  { href: "/admin/temoignages", label: "Témoignages", icon: Quote },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/compte", label: "Mon compte", icon: UserCog },
];

export default function Shell({
  adminName,
  adminEmail,
  children,
}: {
  adminName: string;
  adminEmail: string;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const signOut = async () => {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  const initials = adminName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const current =
    NAV.find((n) =>
      n.href === "/admin" ? path === "/admin" : path.startsWith(n.href),
    )?.label ?? "Administration";

  const Nav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-1">
      {NAV.map((n) => {
        const active =
          n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
        const Icon = n.icon;
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.82rem] transition-colors ${
              active
                ? "text-[var(--adm-text)]"
                : "text-[var(--adm-muted)] hover:bg-black/[0.03] hover:text-[var(--adm-text)]"
            }`}
          >
            {active && (
              <motion.span
                layoutId="admNavActive"
                className="absolute inset-0 rounded-lg bg-white shadow-[0_1px_2px_rgba(26,21,18,0.06),0_6px_16px_-10px_rgba(26,21,18,0.2)]"
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              />
            )}
            <Icon size={16} className="relative shrink-0" />
            <span className="relative">{n.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="adm min-h-screen">
      {/* ── desktop sidebar ── */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-[var(--adm-border)] bg-[var(--adm-bg)] px-4 py-6 lg:flex">
        <Link href="/admin" className="mb-9 flex items-end gap-2.5 px-2">
          <span className="font-display text-[1.4rem] leading-none">BTL</span>
          <span className="mb-[3px] h-3 w-px bg-[var(--adm-border-strong)]" />
          <span className="mb-[1px] text-[0.5rem] font-semibold uppercase tracking-[0.4em] text-[var(--adm-accent)]">
            Admin
          </span>
        </Link>
        <Nav />
        <div className="mt-auto">
          <div className="flex items-center gap-3 rounded-lg border border-[var(--adm-border)] bg-white px-3 py-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--adm-text)] text-[0.62rem] font-semibold text-white">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[0.78rem] font-medium">{adminName}</div>
              <div className="truncate text-[0.66rem] text-[var(--adm-faint)]">
                {adminEmail}
              </div>
            </div>
            <button
              onClick={signOut}
              title="Se déconnecter"
              className="rounded-md p-1.5 text-[var(--adm-faint)] transition-colors hover:bg-black/[0.05] hover:text-[var(--adm-text)]"
            >
              <LogOut size={15} />
            </button>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener"
            className="mt-3 flex items-center gap-2 px-2 text-[0.68rem] uppercase tracking-[0.12em] text-[var(--adm-faint)] transition-colors hover:text-[var(--adm-text)]"
          >
            <ExternalLink size={12} /> Voir le site
          </a>
        </div>
      </aside>

      {/* ── mobile top bar + drawer ── */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--adm-border)] bg-[var(--adm-bg)]/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg">BTL</span>
          <span className="text-[0.5rem] font-semibold uppercase tracking-[0.3em] text-[var(--adm-accent)]">
            Admin
          </span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="p-1.5">
          <Menu size={20} />
        </button>
      </header>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            className="absolute inset-y-0 left-0 w-72 bg-[var(--adm-bg)] p-5"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <Nav onNavigate={() => setMobileOpen(false)} />
            <button
              onClick={signOut}
              className="mt-6 flex items-center gap-2 px-3 text-[0.7rem] uppercase tracking-[0.12em] text-[var(--adm-accent)]"
            >
              <LogOut size={14} /> Se déconnecter
            </button>
          </motion.div>
        </div>
      )}

      {/* ── content ── */}
      <div className="lg:pl-64">
        <div className="hidden items-center justify-between border-b border-[var(--adm-border)] bg-[var(--adm-bg)]/80 px-8 py-4 backdrop-blur lg:flex">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--adm-faint)]">
            {current}
          </span>
          <span className="text-[0.7rem] text-[var(--adm-faint)]">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
        <motion.main
          key={path}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mx-auto max-w-[1200px] px-6 py-8 lg:px-8 lg:py-10"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}