import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Shell from "@/components/admin/Shell";
import { ToastProvider } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sb = createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await sb
    .from("admins")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-plaster px-6 text-center">
        <h1 className="font-display text-3xl">Accès refusé</h1>
        <p className="max-w-[40ch] text-sm text-espresso/60">
          Ce compte ({user.email}) n&apos;est pas administrateur.
        </p>
        <a href="/admin/login" className="text-[0.7rem] uppercase tracking-[0.14em] text-cognac">
          Changer de compte
        </a>
      </div>
    );
  }

  return (
    <ToastProvider>
      <Shell adminName={admin.name} adminEmail={user.email ?? ""}>
        {children}
      </Shell>
    </ToastProvider>
  );
}