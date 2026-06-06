import Link from "next/link";
import { Plus, History } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { QuickStartGrid } from "@/components/quick-start-grid";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();

  // Fetch all user simulations to calculate dashboard statistics
  const simulations = await prisma.simulation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: simulations.length,
    completed: simulations.filter((simulation) => simulation.status !== "in_progress").length,
    average:
      simulations.filter((simulation) => simulation.totalScore !== null).length > 0
        ? Math.round(
            simulations.reduce((sum, simulation) => sum + (simulation.totalScore || 0), 0) /
              simulations.filter((simulation) => simulation.totalScore !== null).length,
          )
        : 0,
  };

  return (
    <AppShell user={user}>
      {/* Header Banner */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-violet-200">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black">Prova Odası</h1>
          <p className="mt-3 text-slate-300">Yeni simülasyon başlat veya popüler hazır senaryoları dene.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/15 transition text-sm"
            href="/profile?tab=provas"
          >
            <History size={18} /> Prova Geçmişi
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-300 px-5 py-3 font-bold text-slate-950 hover:bg-violet-200 transition text-sm"
            href="/simulations/new"
          >
            <Plus size={18} /> Yeni Simülasyon
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {[
          ["Başlatılan Prova", stats.total, "Toplam denediğiniz senaryo sayısı"],
          ["Tamamlanan Prova", stats.completed, "Sonuca ulaştırılan simülasyonlar"],
          ["Ortalama Skor", stats.average || "-", "Değerlendirilen provaların ortalaması"],
        ].map(([label, value, desc]) => (
          <div key={label as string} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-lg">
            <p className="text-xs font-bold text-violet-300 uppercase tracking-wider">{label}</p>
            <p className="mt-2 text-4xl font-black text-white">{value}</p>
            <p className="mt-2 text-[10px] text-slate-400">{desc}</p>
          </div>
        ))}
      </div>

      {/* Quick Start Scenarios Grid */}
      <div className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-slate-200">Popüler Hazır Senaryolar</h2>
        <QuickStartGrid />
      </div>
    </AppShell>
  );
}
