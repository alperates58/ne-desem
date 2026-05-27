import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth";

const features = [
  { title: "Gerçekçi tepkiler", icon: MessageCircle },
  { title: "Cevap skoru", icon: Trophy },
  { title: "Alternatif cümleler", icon: Sparkles },
  { title: "Geçmiş prova kayıtları", icon: ShieldCheck },
];

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <AppShell user={user}>
      <section className="grid min-h-[calc(100vh-150px)] items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-violet-300/30 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-100">
            Zor konuşmalar için prova oyunu
          </p>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight text-white sm:text-7xl">
            Cevap vermeden önce prova yap.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Zor konuşmaları, mesajları ve pazarlıkları güvenli bir simülasyonda dene.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={user ? "/simulations/new" : "/register"}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-300 px-6 py-4 font-bold text-slate-950 hover:bg-violet-200"
            >
              Simülasyona Başla <ArrowRight size={18} />
            </Link>
            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-6 py-4 font-semibold text-white hover:bg-white/10"
            >
              {user ? "Dashboard" : "Giriş Yap"}
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-violet-950/40 backdrop-blur">
          <div className="rounded-[1.5rem] bg-slate-950/80 p-4">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-violet-200">Mini prova</span>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
                AI prova motoru hazır
              </span>
            </div>
            <div className="space-y-4">
              <div className="max-w-[85%] rounded-3xl bg-white/10 px-4 py-3 text-sm leading-6 text-slate-100">
                Bunu şimdi söylemen biraz ani olmadı mı?
              </div>
              <div className="ml-auto max-w-[85%] rounded-3xl bg-violet-300 px-4 py-3 text-sm leading-6 text-slate-950">
                Haklısın, ani görünmüş olabilir. Sadece yanlış anlaşılmadan sakin şekilde anlatmak istedim.
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {["Netlik", "Empati", "Sınır koyma"].map((label, index) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs text-slate-400">
                    <span>{label}</span>
                    <span>{[82, 76, 88][index]}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-violet-300"
                      style={{ width: `${[82, 76, 88][index]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl bg-white/[0.06] p-4">
                <feature.icon className="mb-3 text-violet-200" size={22} />
                <p className="text-sm font-semibold text-white">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
