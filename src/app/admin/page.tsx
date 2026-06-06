import { prisma } from "@/lib/prisma";
import { Users, Play, CheckCircle2, Shield, Clock, UserPlus, Eye } from "lucide-react";
import { formatDate } from "@/lib/status";
import { getCategoryLabel } from "@/lib/categories";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalSimulations,
    completedSimulations,
    inProgressSimulations,
    tiers,
    recentUsers,
    recentSimulations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.simulation.count(),
    prisma.simulation.count({ where: { status: { in: ["completed", "outcome_added"] } } }),
    prisma.simulation.count({ where: { status: "in_progress" } }),
    prisma.membershipTier.findMany({
      include: { _count: { select: { users: true } } },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { membershipTier: true },
    }),
    prisma.simulation.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Sistem İstatistikleri</h1>
        <p className="text-sm text-slate-400">Genel sistem verileri ve canlı aktivite akışı</p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 flex items-center gap-4 shadow-lg">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-500/10 text-violet-300 border border-violet-500/20">
            <Users size={22} />
          </div>
          <div>
            <span className="block text-xs text-slate-400">Toplam Üye</span>
            <span className="text-xl font-bold text-white">{totalUsers}</span>
          </div>
        </div>

        {/* Total Simulations */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 flex items-center gap-4 shadow-lg">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
            <Play size={22} />
          </div>
          <div>
            <span className="block text-xs text-slate-400">Toplam Simülasyon</span>
            <span className="text-xl font-bold text-white">{totalSimulations}</span>
          </div>
        </div>

        {/* Completed Simulations */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 flex items-center gap-4 shadow-lg">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="block text-xs text-slate-400">Tamamlanan</span>
            <span className="text-xl font-bold text-white">{completedSimulations}</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 flex items-center gap-4 shadow-lg">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Shield size={22} />
          </div>
          <div>
            <span className="block text-xs text-slate-400">Devam Eden</span>
            <span className="text-xl font-bold text-white">{inProgressSimulations}</span>
          </div>
        </div>
      </div>

      {/* Main Activity Feeds Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Registered Users Feed */}
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <UserPlus size={18} className="text-violet-400" /> Son Kaydolan Üyeler
            </h2>
            <div className="space-y-3">
              {recentUsers.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Kayıtlı üye bulunmuyor.</p>
              ) : (
                recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-200 block">{u.name}</span>
                      <span className="text-[10px] text-slate-400 block">{u.email}</span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 text-[9px] font-semibold uppercase">
                        {u.membershipTier?.name || "Varsayılan Plan"}
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-1">{formatDate(u.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-right">
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-violet-300 hover:text-violet-200 inline-flex items-center gap-1"
            >
              Tüm Kullanıcıları Yönet <Eye size={12} />
            </Link>
          </div>
        </section>

        {/* Recent Provas Feed */}
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-fuchsia-400" /> Son Prova Seansları
            </h2>
            <div className="space-y-3">
              {recentSimulations.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Başlatılmış prova bulunmuyor.</p>
              ) : (
                recentSimulations.map((sim) => (
                  <div
                    key={sim.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-200 block truncate max-w-[200px]">{sim.title}</span>
                      <span className="text-[10px] text-violet-300 block">{getCategoryLabel(sim.category)}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-400">{sim.user.name}</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">{formatDate(sim.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-right">
            <Link
              href="/admin/simulations"
              className="text-xs font-semibold text-fuchsia-300 hover:text-fuchsia-200 inline-flex items-center gap-1"
            >
              Tüm Provaları İzle <Eye size={12} />
            </Link>
          </div>
        </section>
      </div>

      {/* Subscription Tier Distribution */}
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4">Üyelik Planı Dağılımları</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tiers.length === 0 ? (
            <p className="text-sm text-slate-500 italic col-span-3">Henüz oluşturulmuş üyelik planı bulunmuyor.</p>
          ) : (
            tiers.map((tier) => (
              <div
                key={tier.id}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow"
              >
                <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">{tier.name}</span>
                <h3 className="text-2xl font-bold text-white mt-1">{tier._count.users} Üye</h3>
                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Aylık Limit:</span>
                    <span className="text-white font-bold">{tier.monthlyLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fiyat:</span>
                    <span className="text-white font-bold">{tier.price} TL</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
