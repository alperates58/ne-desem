import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, Trophy, Award, MessageSquare, ArrowRight, Play, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCategoryLabel } from "@/lib/categories";
import { formatDate } from "@/lib/status";
import { ScoreBar } from "@/components/score-bar";
import type { MessageContext, FinalReport, Scores, OutcomeAdvice } from "@/lib/types";

type PublicSharePageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function PublicSimulationSharePage({ params }: PublicSharePageProps) {
  const { id } = await params;

  const simulation = await prisma.simulation.findUnique({
    where: { id },
    include: {
      turns: { orderBy: { turnNumber: "asc" } },
      outcome: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  // If simulation doesn't exist or is not marked as public, return gizli/not found screen
  if (!simulation || !simulation.isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#4c1d95_0,#1e1b4b_28%,#020617_62%)] px-4">
        <div className="max-w-md w-full text-center rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl">
          <Award size={48} className="mx-auto text-violet-300 animate-pulse" />
          <h1 className="mt-6 text-2xl font-bold text-white">Gizli Paylaşım</h1>
          <p className="mt-3 text-sm text-slate-400 leading-6">
            Bu simülasyon sahibi tarafından paylaşılmamış veya erişim süresi dolmuş.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block w-full rounded-2xl bg-violet-300 py-3 font-semibold text-slate-950 hover:bg-violet-200 transition"
          >
            Siz de Prova Yapın
          </Link>
        </div>
      </div>
    );
  }

  const context = simulation.contextJson as unknown as MessageContext;
  const report = simulation.finalReportJson as FinalReport | null;
  const advice = simulation.outcome?.aiFollowupAdviceJson as OutcomeAdvice | null | undefined;
  
  // Format initials anonymously
  const authorInitials = simulation.user.name
    ? simulation.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "ND";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#4c1d95_0,#1e1b4b_28%,#020617_62%)] px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Header Branding */}
        <header className="flex justify-between items-center pb-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-500 font-black text-white text-sm">ND</span>
            <span className="font-extrabold text-white text-base tracking-tight">Ne Desem?</span>
          </Link>
          <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            📢 Paylaşılan Rapor
          </span>
        </header>

        {/* Main Cover Card */}
        <section className="rounded-[2.5rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-44 h-44 rounded-full bg-violet-500/10 blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-block rounded-md bg-white/5 px-2.5 py-1 text-xs text-violet-300 font-semibold uppercase tracking-wider">
                {getCategoryLabel(simulation.category)}
              </span>
              <h1 className="text-3xl font-black text-white leading-tight">{simulation.title}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 font-bold text-white text-[9px]">
                  {authorInitials}
                </div>
                <span>Tarafından prova edildi</span>
                <span>•</span>
                <span>{formatDate(simulation.createdAt)}</span>
              </div>
            </div>

            {simulation.totalScore !== null && (
              <div className="rounded-[2rem] bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 p-5 text-center shrink-0 w-32 md:w-36">
                <span className="text-xs text-slate-400 block">Başarı Skoru</span>
                <span className="text-4xl font-black text-white block mt-1">{simulation.totalScore}</span>
                <span className="text-[10px] text-violet-300 block mt-1">/ 100</span>
              </div>
            )}
          </div>
        </section>

        {/* Context & Transcript Two-Pane Grid */}
        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          
          {/* Left Side: Setup Details */}
          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/40 p-5 space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-white/5 pb-2">Senaryo Detayları</h2>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-wider">Hedef Karşı Taraf</span>
                  <span className="block text-xs text-slate-200 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    {context.otherPerson || "Karşı Taraf"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-wider">Hedef / Amaç</span>
                  <span className="block text-xs text-slate-200 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    {context.goal}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] uppercase font-bold text-slate-500 tracking-wider">Korku / Çekince</span>
                  <span className="block text-xs text-slate-200 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    {context.fear || "Belirtilmemiş"}
                  </span>
                </div>
                {context.redLine && (
                  <div className="space-y-1">
                    <span className="block text-[9px] uppercase font-bold text-rose-500 tracking-wider">Kırmızı Çizgi</span>
                    <span className="block text-xs text-rose-200 leading-relaxed bg-rose-500/5 p-2.5 rounded-xl border border-rose-500/15">
                      {context.redLine}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {report && (
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/40 p-5 space-y-3">
                <h2 className="text-sm font-bold text-white border-b border-white/5 pb-2">AI Genel Yorumu</h2>
                <p className="text-xs text-slate-300 leading-relaxed">{report.summary}</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                  <div>
                    <span className="block text-emerald-400 font-bold">En İyi Hamle:</span>
                    <p className="truncate italic mt-0.5">"{report.best_sentence || "Veri yok"}"</p>
                  </div>
                  <div>
                    <span className="block text-rose-400 font-bold">En Zayıf Hamle:</span>
                    <p className="truncate italic mt-0.5">"{report.weakest_sentence || "Veri yok"}"</p>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Right Side: Conversation Timeline */}
          <main className="space-y-6">
            
            {/* Conversation Flow */}
            <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/50 p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
                <MessageSquare size={18} className="text-violet-400" /> Diyalog Akışı ve Analizi
              </h2>

              <div className="space-y-6">
                {simulation.turns.map((turn) => (
                  <div key={turn.id} className="space-y-3 border-b border-white/5 pb-5 last:border-b-0 last:pb-0">
                    <div className="flex flex-col items-start max-w-[90%]">
                      <span className="text-[10px] font-bold text-violet-300 mb-1 ml-2">
                        {context.otherPerson || "Karşı Taraf"} (Hamle {turn.turnNumber})
                      </span>
                      <div className="rounded-2xl bg-violet-600/10 border border-violet-500/20 px-4 py-3 text-xs text-slate-200 leading-relaxed">
                        {turn.aiMessage}
                      </div>
                    </div>

                    {turn.userMessage && (
                      <div className="flex flex-col items-end max-w-[90%] ml-auto">
                        <span className="text-[10px] font-bold text-slate-400 mb-1 mr-2">
                          Kullanıcı
                        </span>
                        <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 text-xs text-white leading-relaxed">
                          {turn.userMessage}
                        </div>
                      </div>
                    )}

                    {/* Turn Scores & Alternative */}
                    <div className="ml-4 mr-4 mt-2 border-l-2 border-violet-500/30 pl-4 py-1 space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(turn.scoresJson as Scores).map(([sKey, sVal]) => (
                          <span key={sKey} className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                            {sKey}: <span className="text-violet-300 font-bold">{String(sVal)}</span>
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        <strong>AI Analizi:</strong> {turn.feedback}
                      </p>
                      {turn.betterAlternative && (
                        <p className="text-[11px] text-emerald-400 leading-relaxed">
                          💡 <strong>Önerilen Alternatif:</strong> "{turn.betterAlternative}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Life Outcome */}
            {simulation.outcome && (
              <div className="rounded-[2rem] border border-white/10 bg-emerald-950/10 p-6 space-y-4">
                <h2 className="text-base font-bold text-white border-b border-emerald-500/20 pb-2 flex items-center gap-2">
                  <Trophy size={18} className="text-emerald-400" /> Gerçek Hayat Deneyimi ve Sonuç
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400">Ne Yaşandı?</span>
                    <p className="text-slate-200 leading-relaxed">{simulation.outcome.whatHappened}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400">Karşı Tarafın Tepkisi:</span>
                    <p className="text-slate-200 leading-relaxed">{simulation.outcome.otherPersonReaction}</p>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5 sm:col-span-2">
                    <span className="text-slate-400">Hedefe Ulaşıldı mı?</span>
                    <span className="font-bold text-emerald-300 uppercase">{simulation.outcome.goalResult}</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Global Premium CTA Box */}
        <section className="rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 p-8 text-center space-y-4">
          <h2 className="text-2xl font-black text-white">Siz de Zor Konuşmalara Hazırlanın!</h2>
          <p className="max-w-xl mx-auto text-sm text-slate-300 leading-relaxed">
            Patronunuzla zam konuşması yaparken, partnerinize sınır çizerken veya zor bir alacak tahsilatında "Ne Desem?" diye düşünmeyin. Yapay zeka ile hemen prova yapın, puanınızı ve alternatif önerileri görün.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-slate-950 hover:bg-slate-100 transition shadow-xl"
            >
              <Play size={16} fill="currentColor" /> Hemen Ücretsiz Prova Başlat
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
