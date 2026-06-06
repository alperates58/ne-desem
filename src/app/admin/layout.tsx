import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireAdmin } from "@/lib/auth";
import { Users, CreditCard, BarChart3, MessageSquare, Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  // Cast user safely to match app shell expectations
  const userData = {
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return (
    <AppShell user={userData}>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Admin Navigation Sidebar */}
        <aside className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-xl h-fit">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">Yönetim Paneli</h2>
          
          <nav className="mt-6 flex flex-col gap-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <BarChart3 size={18} className="text-violet-300" /> İstatistikler
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <Users size={18} className="text-violet-300" /> Kullanıcılar
            </Link>
            <Link
              href="/admin/simulations"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <MessageSquare size={18} className="text-violet-300" /> Simülasyonlar
            </Link>
            <Link
              href="/admin/tiers"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <CreditCard size={18} className="text-violet-300" /> Üyelik Planları
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <Settings size={18} className="text-violet-300" /> Sistem Ayarları
            </Link>
          </nav>
        </aside>

        {/* Admin Content Area */}
        <section className="min-w-0">
          {children}
        </section>
      </div>
    </AppShell>
  );
}
