const labels: Record<string, string> = {
  clarity: "Netlik",
  confidence: "Özgüven",
  empathy: "Empati",
  boundaries: "Sınır",
  naturalness: "Doğallık",
  risk: "Risk",
  persuasion: "İkna",
};

export function ScoreBar({ label, value }: { label: string; value: number }) {
  const isRisk = label === "risk";
  const width = Math.max(0, Math.min(100, value));
  const color = isRisk
    ? value > 65
      ? "bg-rose-400"
      : value > 38
        ? "bg-amber-300"
        : "bg-emerald-300"
    : "bg-violet-300";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
        <span>{labels[label] || label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
