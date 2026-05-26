import type { SimulationStatus } from "@/lib/types";
import { statusLabels } from "@/lib/status";

export function StatusBadge({ status }: { status: SimulationStatus }) {
  const tone =
    status === "outcome_added"
      ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100"
      : status === "completed"
        ? "border-violet-300/30 bg-violet-400/10 text-violet-100"
        : "border-amber-300/30 bg-amber-400/10 text-amber-100";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>
      {statusLabels[status]}
    </span>
  );
}
