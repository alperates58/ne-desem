import Link from "next/link";
import { redirect } from "next/navigation";
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
  });

  if (!simulation) {
    redirect("/dashboard");
  }

  if (!simulation.finalReportJson) {
    redirect(`/simulations/${simulation.id}/play`);
  }

  const report = simulation.finalReportJson as FinalReport;

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-4xl">
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

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ReportBlock title="En iyi cümle" value={report.best_sentence} />
          <ReportBlock title="En zayıf cümle" value={report.weakest_sentence} />
          <ReportBlock title="Karşı taraf seni nasıl algılamış olabilir?" value={report.perceived_by_other_person} />
          <ReportList title="Risk uyarıları" items={report.risks} />
          <ReportList title="Daha iyi 3 alternatif" items={report.better_alternatives} />
          <ReportList title="Gerçek hayatta dikkat edilecekler" items={report.real_life_tips} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
