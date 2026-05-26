import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/status";
import { StatusBadge } from "@/components/status-badge";
import type { SimulationStatus } from "@/lib/types";

type SimulationCardProps = {
  simulation: {
    id: string;
    category: string;
    scenario: string;
    title: string;
    status: SimulationStatus;
    totalScore: number | null;
    createdAt: Date | string;
  };
};

export function SimulationCard({ simulation }: SimulationCardProps) {
  const href =
    simulation.status === "in_progress"
      ? `/simulations/${simulation.id}/play`
      : `/simulations/${simulation.id}`;

  return (
    <Link
      href={href}
      className="group block rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 transition hover:-translate-y-0.5 hover:border-violet-300/40 hover:bg-white/[0.09]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
            {simulation.category === "zor_mesajlar" ? "Zor Mesajlar" : simulation.category}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">{simulation.title}</h3>
        </div>
        <ArrowRight className="mt-1 text-slate-500 transition group-hover:text-violet-200" size={20} />
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">{simulation.scenario}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <StatusBadge status={simulation.status} />
        <span className="text-xs text-slate-400">{formatDate(simulation.createdAt)}</span>
        {simulation.totalScore !== null && (
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            Skor {simulation.totalScore}
          </span>
        )}
      </div>
    </Link>
  );
}
