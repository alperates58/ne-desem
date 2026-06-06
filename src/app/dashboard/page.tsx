import Link from "next/link";
import { Plus, History, Play, ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { QuickStartGrid } from "@/components/quick-start-grid";
import { DashboardStats } from "@/components/dashboard-stats";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { templates } from "@/lib/templates";
import {
  Briefcase,
  Heart,
  Users,
  Coins,
  MessageSquare,
  GraduationCap,
  Home,
  Share2,
  Activity,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeStreak(dates: Date[]): number {
  if (!dates.length) return 0;
  const uniqueDays = [
    ...new Set(dates.map((d) => new Date(d).toISOString().split("T")[0])),
  ].sort().reverse();
  if (!uniqueDays.length) return 0;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split("T")[0];
  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0;
  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const diff =
      new Date(uniqueDays[i - 1]).getTime() - new Date(uniqueDays[i]).getTime();
    if (diff === 86_400_000) streak++;
    else break;
  }
  return streak;
}

const SKILL_LABELS: Record<string, string> = {
  clarity: "Netlik",
  confidence: "Özgüven",
  empathy: "Empati",
  boundaries: "Sınır Koyma",
  naturalness: "Doğallık",
  persuasion: "İkna",
  risk: "Risk Yönetimi",
};

const CATEGORY_META = [
  {
    id: "is_kariyer",
    label: "İş / Kariyer",
    emoji: "💼",
    desc: "Zam, terfi, sınır, istifa",
    count: 29,
    Icon: Briefcase,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/15",
  },
  {
    id: "flort_iliski",
    label: "Flört / İlişki",
    emoji: "❤️",
    desc: "Netlik, mesafe, kırgınlık",
    count: 26,
    Icon: Heart,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/15",
  },
  {
    id: "aile_arkadas",
    label: "Aile / Arkadaş",
    emoji: "👨‍👩‍👧",
    desc: "Sınır, borç, kararlar",
    count: 25,
    Icon: Users,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/15",
  },
  {
    id: "para_pazarlik",
    label: "Para / Pazarlık",
    emoji: "💰",
    desc: "Kira, fiyat, alacak",
    count: 25,
    Icon: Coins,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/15",
  },
  {
    id: "zor_mesajlar",
    label: "Zor Mesajlar",
    emoji: "💬",
    desc: "Ret, özür, sınır mesajları",
    count: 20,
    Icon: MessageSquare,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/15",
  },
  {
    id: "saglik_psikoloji",
    label: "Sağlık & Psikoloji",
    emoji: "🧠",
    desc: "Terapi, burnout, ilaç",
    count: 12,
    Icon: Activity,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/15",
  },
  {
    id: "egitim_okul",
    label: "Eğitim / Okul",
    emoji: "🎓",
    desc: "Hoca, not, grup ödevi",
    count: 16,
    Icon: GraduationCap,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/15",
  },
  {
    id: "gunluk_yasam",
    label: "Günlük Yaşam",
    emoji: "🏠",
    desc: "Komşu, usta, apartman",
    count: 18,
    Icon: Home,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/15",
  },
  {
    id: "sosyal_medya_dijital",
    label: "Dijital / Sosyal",
    emoji: "📱",
    desc: "DM, grup, LinkedIn",
    count: 17,
    Icon: Share2,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/15",
  },
];

function getRecommendedIds(simulations: { category: string }[]): string[] {
  const allCats = CATEGORY_META.map((c) => c.id);
  const usedCats = new Set(simulations.map((s) => s.category));
  const result: string[] = [];

  if (simulations.length === 0) {
    // New user — curated starter set
    const picks = ["patron-zam", "mesai-reddi", "kira-artisi"];
    const extras = templates
      .filter((t) => !picks.includes(t.id) && ["flort_iliski", "aile_arkadas"].includes(t.category))
      .slice(0, 3)
      .map((t) => t.id);
    return [...picks, ...extras].slice(0, 6);
  }

  // Returning — 2 from top category, rest from unused
  const freq: Record<string, number> = {};
  simulations.forEach((s) => { freq[s.category] = (freq[s.category] || 0) + 1; });
  const topCat = Object.entries(freq).sort(([, a], [, b]) => b - a)[0]?.[0];
  if (topCat) {
    templates.filter((t) => t.category === topCat).slice(0, 2).forEach((t) => result.push(t.id));
  }
  for (const cat of allCats) {
    if (result.length >= 6) break;
    if (!usedCats.has(cat)) {
      const t = templates.find((tmpl) => tmpl.category === cat);
      if (t) result.push(t.id);
    }
  }
  if (result.length < 4) {
    templates.filter((t) => !result.includes(t.id)).slice(0, 4 - result.length).forEach((t) => result.push(t.id));
  }
  return result.slice(0, 6);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const user = await requireUser();

  const [simulations, recentTurns] = await Promise.all([
    prisma.simulation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.simulationTurn.findMany({
      where: { simulation: { userId: user.id } },
      select: { scoresJson: true },
      orderBy: { createdAt: "desc" },
      take: 80,
    }),
  ]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const scored = simulations.filter((s) => s.totalScore !== null);
  const total = simulations.length;
  const completed = simulations.filter((s) => s.status !== "in_progress").length;
  const average =
    scored.length > 0
      ? Math.round(scored.reduce((sum, s) => sum + (s.totalScore ?? 0), 0) / scored.length)
      : 0;
  const successRate =
    scored.length > 0
      ? Math.round((scored.filter((s) => (s.totalScore ?? 0) >= 70).length / scored.length) * 100)
      : 0;
  const streak = computeStreak(simulations.map((s) => s.createdAt));

  // Strongest skill from recent turns
  const skillBuckets: Record<string, number[]> = {};
  recentTurns.forEach((t) => {
    const scores = t.scoresJson as Record<string, number>;
    Object.entries(scores).forEach(([key, val]) => {
      if (!skillBuckets[key]) skillBuckets[key] = [];
      skillBuckets[key].push(val);
    });
  });
  const strongestSkillKey =
    Object.entries(skillBuckets)
      .map(([k, vals]) => ({ k, avg: vals.reduce((a, b) => a + b, 0) / vals.length }))
      .sort((a, b) => b.avg - a.avg)[0]?.k || "";
  const strongestSkill = SKILL_LABELS[strongestSkillKey] || "";

  // ── In-progress ────────────────────────────────────────────────────────────
  const inProgress = simulations.filter((s) => s.status === "in_progress").slice(0, 2);

  // ── Recommendations ────────────────────────────────────────────────────────
  const recommendedIds = getRecommendedIds(simulations);
  const recommendedTemplates = recommendedIds
    .map((id) => templates.find((t) => t.id === id))
    .filter(Boolean) as typeof templates;

  return (
    <AppShell user={user}>
      {/* Background mesh (shared with landing) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-60 -left-40 h-[600px] w-[600px] rounded-full bg-violet-700/15 blur-[130px]" />
        <div className="absolute -bottom-40 -right-60 h-[500px] w-[500px] rounded-full bg-indigo-700/10 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      {/* ── Hero: Greeting + Stats ── */}
      <div className="mb-2 flex items-start justify-end gap-2.5 pt-1">
        <Link
          href="/profile?tab=provas"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
        >
          <History size={14} /> Geçmiş
        </Link>
        <Link
          href="/simulations/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-violet-300 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-violet-500/20 transition hover:bg-violet-200 hover:-translate-y-px"
        >
          <Plus size={14} /> Yeni Simülasyon
        </Link>
      </div>

      <DashboardStats
        userName={user.name || "Kullanıcı"}
        total={total}
        completed={completed}
        average={average}
        streak={streak}
        successRate={successRate}
        strongestSkill={strongestSkill}
      />

      {/* ── Kaldığın Yerden Devam Et ── */}
      {inProgress.length > 0 && (
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-400/80">
              Kaldığın Yerden Devam Et
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {inProgress.map((sim) => {
              const meta = CATEGORY_META.find((c) => c.id === sim.category);
              return (
                <Link
                  key={sim.id}
                  href={`/simulations/${sim.id}/play`}
                  className="group flex items-center justify-between rounded-2xl border border-amber-500/15 bg-amber-500/[0.06] px-5 py-4 transition-all hover:border-amber-400/30 hover:bg-amber-500/10"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="rounded-xl bg-amber-500/15 p-2.5">
                      {meta ? (
                        <meta.Icon size={16} className="text-amber-400" />
                      ) : (
                        <Play size={16} className="text-amber-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white line-clamp-1">{sim.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{meta?.label ?? sim.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 transition group-hover:gap-2.5">
                    Devam Et <ArrowRight size={13} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── AI Recommendations ── */}
      <div className="mb-12">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-violet-400" />
            <h2 className="text-lg font-bold text-white">Senin İçin Önerilenler</h2>
          </div>
          <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300">
            AI Seçimi
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedTemplates.map((template) => {
            const meta = CATEGORY_META.find((c) => c.id === template.category);
            const diffStyle =
              template.difficulty === "Kolay"
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : template.difficulty === "Orta"
                ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                : "text-rose-400 bg-rose-500/10 border-rose-500/20";

            return (
              <Link
                key={template.id}
                href={`/simulations/new?template=${template.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-violet-500/15 bg-violet-500/[0.05] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-violet-500/[0.09] hover:shadow-lg hover:shadow-violet-950/30"
              >
                {/* AI badge */}
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[10px] font-bold ${meta?.bg} ${meta?.color}`}>
                    {meta && <meta.Icon size={11} />}
                    <span>{meta?.label}</span>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${diffStyle}`}>
                    {template.difficulty}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white transition group-hover:text-violet-200">
                    {template.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-slate-500 line-clamp-2">
                    {template.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3.5">
                  <span className="text-[11px] text-slate-600">
                    {template.context.otherPerson}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-violet-400 transition group-hover:text-violet-300 group-hover:gap-1.5">
                    Başla <ArrowRight size={11} />
                  </div>
                </div>
                {/* Subtle glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/10 blur-[40px] transition-all duration-500 group-hover:bg-violet-500/20" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Category Browser ── */}
      <div className="mb-10">
        <h2 className="mb-5 text-lg font-bold text-white">Kategoriye Göre Keşfet</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORY_META.map((cat) => (
            <a
              key={cat.id}
              href={`#catalog-${cat.id}`}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.07]"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={`rounded-xl p-2.5 ${cat.bg}`}>
                  <cat.Icon size={15} className={cat.color} />
                </div>
                <span className="text-[10px] font-bold text-slate-600">
                  {cat.count} senaryo
                </span>
              </div>
              <p className="text-sm font-bold text-slate-200 transition group-hover:text-white">
                {cat.label}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                {cat.desc}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* ── Scenario Catalog ── */}
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-lg font-bold text-white">Senaryo Kataloğu</h2>
        <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-bold text-slate-400">
          126 senaryo
        </span>
      </div>
      <p className="mb-6 text-sm text-slate-500">
        Hazır senaryolardan birini seç, karakter tipini ayarla ve anında provaya başla.
      </p>
      <QuickStartGrid recommendedIds={recommendedIds} />
    </AppShell>
  );
}
