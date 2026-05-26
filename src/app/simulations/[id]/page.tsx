import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ScoreBar } from "@/components/score-bar";
import { StatusBadge } from "@/components/status-badge";
import { contextFieldLabels } from "@/lib/categories";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/status";
import type {
  FinalReport,
  MessageContext,
  OutcomeAdvice,
  Scores,
  SimulationStatus,
} from "@/lib/types";

type DetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SimulationDetailPage({ params }: DetailPageProps) {
  const user = await requireUser();
  const { id } = await params;
  const simulation = await prisma.simulation.findFirst({
    where: { id, userId: user.id },
    include: {
      turns: { orderBy: { turnNumber: "asc" } },
      outcome: true,
    },
  });

  if (!simulation) {
    redirect("/dashboard");
  }

  const context = simulation.contextJson as unknown as MessageContext;
  const report = simulation.finalReportJson as FinalReport | null;
  const advice = simulation.outcome?.aiFollowupAdviceJson as OutcomeAdvice | null | undefined;

  return (
    <AppShell user={user}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-violet-200">Geçmiş simülasyon</p>
          <h1 className="mt-2 text-4xl font-black">{simulation.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge status={simulation.status as SimulationStatus} />
            <span className="text-sm text-slate-400">{formatDate(simulation.createdAt)}</span>
            {simulation.totalScore !== null && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
                Skor {simulation.totalScore}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {simulation.status === "in_progress" && (
            <Link className="rounded-2xl bg-violet-300 px-4 py-3 font-bold text-slate-950" href={`/simulations/${simulation.id}/play`}>
              Devam et
            </Link>
          )}
          {simulation.status !== "in_progress" && (
            <Link className="rounded-2xl border border-white/10 px-4 py-3 font-semibold" href={`/simulations/${simulation.id}/report`}>
              Rapor
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="space-y-4">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
            <h2 className="text-xl font-bold">Ön bilgiler</h2>
            <div className="mt-4 space-y-3">
              {(Object.keys(contextFieldLabels) as Array<keyof MessageContext>).map((key) => (
                <div key={key} className="rounded-2xl bg-slate-950/50 p-3">
                  <p className="text-xs font-semibold text-slate-500">{contextFieldLabels[key]}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-200">{context[key]}</p>
                </div>
              ))}
            </div>
          </section>

          {report && (
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-xl font-bold">Final raporu</h2>
              <p className="mt-3 leading-7 text-slate-300">{report.summary}</p>
              <div className="mt-4 rounded-3xl bg-violet-400/10 p-4 text-center">
                <p className="text-sm text-violet-100">Genel skor</p>
                <p className="text-4xl font-black">{report.total_score}</p>
              </div>
            </section>
          )}
        </aside>

        <section className="space-y-4">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5">
            <h2 className="text-xl font-bold">Konuşma akışı</h2>
            <div className="mt-5 space-y-5">
              {simulation.turns.length === 0 ? (
                <p className="text-slate-400">Henüz tur kaydı yok.</p>
              ) : (
                simulation.turns.map((turn) => (
                  <div key={turn.id} className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
                    <p className="text-sm font-semibold text-violet-200">Tur {turn.turnNumber}</p>
                    <div className="mt-3 space-y-3">
                      <p className="ml-auto max-w-[85%] rounded-3xl bg-violet-300 px-4 py-3 text-sm leading-6 text-slate-950">
                        {turn.userMessage}
                      </p>
                      <p className="max-w-[85%] rounded-3xl bg-white/10 px-4 py-3 text-sm leading-6 text-slate-100">
                        {turn.aiMessage}
                      </p>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {Object.entries(turn.scoresJson as Scores).map(([label, value]) => (
                        <ScoreBar key={label} label={label} value={value} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {simulation.outcome && (
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-xl font-bold">Gerçek hayat sonucu</h2>
              <div className="mt-4 grid gap-3">
                <p className="rounded-2xl bg-slate-950/50 p-4 leading-7">{simulation.outcome.whatHappened}</p>
                <p className="rounded-2xl bg-slate-950/50 p-4 leading-7">{simulation.outcome.otherPersonReaction}</p>
              </div>
              {advice && (
                <div className="mt-5 rounded-3xl bg-violet-400/10 p-4">
                  <h3 className="font-semibold text-violet-100">Ek öneri</h3>
                  <p className="mt-2 leading-7 text-slate-300">{advice.situation_analysis}</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-200">
                    {advice.next_steps.map((step) => (
                      <li key={step} className="rounded-2xl bg-slate-950/40 px-4 py-3">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </section>
      </div>
    </AppShell>
  );
}
