import type { SimulationStatus } from "@/lib/types";

export const statusLabels: Record<SimulationStatus, string> = {
  in_progress: "Devam ediyor",
  completed: "Tamamlandı",
  outcome_added: "Sonuç eklendi",
};

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function averageScore(scores: Record<string, number>) {
  const values = Object.entries(scores).map(([key, value]) =>
    key === "risk" ? 100 - value : value,
  );

  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
