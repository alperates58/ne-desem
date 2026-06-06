import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { FinalReport } from "@/lib/types";

type ReportPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const user = await requireUser();
  const { id } = await params;
  const simulation = await prisma.simulation.findFirst({
    where: { id, userId: user.id },
    include: {
      turns: {
        orderBy: { turnNumber: "asc" },
      },
    },
  });

  if (!simulation) {
    redirect("/dashboard");
  }

  if (!simulation.finalReportJson) {
    redirect(`/simulations/${simulation.id}/play`);
  }

  const report = simulation.finalReportJson as FinalReport;
  const otherPersonName = (simulation.contextJson as any)?.otherPerson || "Karşı Taraf";

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-violet-950/30">
          <p className="text-sm font-semibold text-violet-200">Final raporu</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-black">Genel skor: {report.total_score}</h1>
              <p className="mt-3 leading-7 text-slate-300">{report.summary}</p>
            </div>
            <div className="grid h-28 w-28 place-items-center rounded-full border-8 border-violet-300/70 text-3xl font-black">
              {report.total_score}
            </div>
          </div>
        </div>

        {report.detailed_evaluation && (
          <div className="rounded-[2rem] border border-violet-400/20 bg-gradient-to-r from-violet-500/10 via-violet-950/25 to-slate-900/50 p-6 shadow-xl leading-relaxed">
            <h2 className="flex items-center gap-2 text-lg font-bold text-violet-200">
              <Sparkles className="text-violet-300 animate-pulse" size={20} />
              Detaylı Değerlendirme & Gelişim Raporu
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
              {report.detailed_evaluation.split("\n\n").map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {/* Conversation Transcript History */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/40 p-6 shadow-xl space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="rounded-xl bg-violet-500/10 p-2 text-violet-300 border border-violet-500/20">
              <MessageSquare size={18} />
            </span>
            Prova Konuşma Geçmişi (Tüm Konuşma)
          </h2>
          {simulation.turns.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Konuşma turu bulunmuyor.</p>
          ) : (
            <div className="space-y-4 mt-4">
              {simulation.turns.map((turn) => (
                <div key={turn.id} className="space-y-3 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex flex-col gap-2">
                    {/* AI Message */}
                    <div className="flex flex-col items-start max-w-[85%]">
                      <span className="text-[10px] font-bold text-violet-300 mb-1 ml-2">
                        {otherPersonName} (Hamle {turn.turnNumber})
                      </span>
                      <div className="rounded-2xl bg-white/[0.04] border border-white/5 px-4 py-2.5 text-xs text-slate-200 leading-relaxed">
                        {turn.aiMessage}
                      </div>
                    </div>

                    {/* User Message */}
                    {turn.userMessage && (
                      <div className="flex flex-col items-end max-w-[85%] ml-auto">
                        <span className="text-[10px] font-bold text-slate-400 mb-1 mr-2">
                          Sen
                        </span>
                        <div className="rounded-2xl bg-violet-500/15 border border-violet-500/20 px-4 py-2.5 text-xs text-white leading-relaxed">
                          {turn.userMessage}
                        </div>
                      </div>
                    )}

                    {/* Turn Feedback */}
                    <div className="ml-4 mt-2 border-l-2 border-violet-500/20 pl-4 py-1.5 text-xs space-y-1.5 text-slate-400 leading-relaxed bg-white/[0.01] rounded-r-xl pr-3">
                      {turn.feedback && (
                        <p>
                          <strong className="text-slate-300">Geri Bildirim:</strong> {turn.feedback}
                        </p>
                      )}
                      {turn.betterAlternative && (
                        <p className="text-emerald-400">
                          <strong className="text-emerald-300">Daha İyi Alternatif:</strong> "{turn.betterAlternative}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ReportBlock title="En iyi cümle" value={report.best_sentence} />
          <ReportBlock title="En zayıf cümle" value={report.weakest_sentence} />
          <ReportBlock title="Karşı taraf seni nasıl algılamış olabilir?" value={report.perceived_by_other_person} />
          <ReportList title="Risk uyarıları" items={report.risks} />
          <ReportList title="Daha iyi 3 alternatif" items={report.better_alternatives} />
          <ReportList title="Gerçek hayatta dikkat edilecekler" items={report.real_life_tips} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className="rounded-2xl border border-white/10 px-5 py-3 text-center font-semibold hover:bg-white/10"
            href={`/simulations/new`}
          >
            Bu konuşmayı tekrar dene
          </Link>
          <Link
            className="rounded-2xl bg-violet-300 px-5 py-3 text-center font-bold text-slate-950"
            href={`/simulations/${simulation.id}/outcome`}
          >
            Sonucu ekle
          </Link>
          <Link
            className="rounded-2xl border border-white/10 px-5 py-3 text-center font-semibold hover:bg-white/10"
            href="/dashboard"
          >
            Dashboard’a dön
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function ReportBlock({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
      <h2 className="font-semibold text-violet-100">{title}</h2>
      <p className="mt-3 leading-7 text-slate-300">{value}</p>
    </section>
  );
}

function ReportList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
      <h2 className="font-semibold text-violet-100">{title}</h2>
      <ul className="mt-3 space-y-2 text-slate-300">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-slate-950/50 px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
