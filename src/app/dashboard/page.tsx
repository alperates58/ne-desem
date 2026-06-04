import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SimulationCard } from "@/components/simulation-card";
import { QuickStartGrid } from "@/components/quick-start-grid";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import type { SimulationStatus } from "@/lib/types";

type DashboardProps = {
  searchParams?: Promise<{ filter?: string; search?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const user = await requireUser();
  const params = (await searchParams) || {};
  const filter = params.filter || "all";
  const search = params.search?.trim() || "";

  const simulations = await prisma.simulation.findMany({
    where: {
      userId: user.id,
      ...(filter !== "all" ? { status: filter as never } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { scenario: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-violet-200">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black">Prova geçmişin</h1>
          <p className="mt-3 text-slate-300">Yeni simülasyon başlat, yarım kalanları tamamla.</p>
        </div>
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-300 px-5 py-3 font-bold text-slate-950 hover:bg-violet-200"
          href="/simulations/new"
        >
          <Plus size={18} /> Yeni simülasyon
        </Link>
      </div>

      <div className="mb-10 grid gap-3 sm:grid-cols-3">
        {[
          ["Toplam prova", stats.total],
          ["Tamamlanan", stats.completed],
          ["Ortalama skor", stats.average || "-"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-slate-200">Popüler Hazır Senaryolar</h2>
        <QuickStartGrid />
      </div>

      <div className="mb-6">
        <h2 className="mb-4 text-xl font-bold text-slate-200">Önceki Provaların</h2>
        <form className="mb-6 grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-3 sm:grid-cols-[1fr_auto_auto]">
          <label className="flex items-center gap-3 rounded-2xl bg-slate-950/70 px-4 py-3">
            <Search size={18} className="text-slate-500" />
            <input
              className="w-full bg-transparent outline-none"
              name="search"
              defaultValue={search}
              placeholder="Senaryo veya kategori ara"
            />
          </label>
          <select
            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3"
            name="filter"
            defaultValue={filter}
          >
            <option value="all">Tümü</option>
            <option value="completed">Tamamlanan</option>
            <option value="in_progress">Devam eden</option>
            <option value="outcome_added">Sonuç yazılan</option>
          </select>
          <button className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950" type="submit">
            Uygula
          </button>
        </form>
      </div>

      {simulations.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
          <h2 className="text-2xl font-bold">Henüz prova yok</h2>
          <p className="mt-2 text-slate-400">İlk zor mesajını seçip simülasyonu başlatabilirsin.</p>
          <Link
            className="mt-5 inline-flex rounded-2xl bg-violet-300 px-5 py-3 font-bold text-slate-950"
            href="/simulations/new"
          >
            Başla
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {simulations.map((simulation) => (
            <SimulationCard
              key={simulation.id}
              simulation={{
                ...simulation,
                status: simulation.status as SimulationStatus,
              }}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
