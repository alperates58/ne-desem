import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth";
import { ProductPreview } from "@/components/landing-preview";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <AppShell user={user}>
      {/* ── Background: gradient mesh + grid ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Large violet orb — top-left */}
        <div className="absolute -top-60 -left-60 h-[700px] w-[700px] rounded-full bg-violet-700/20 blur-[140px]" />
        {/* Indigo orb — bottom-right */}
        <div className="absolute -bottom-60 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-700/15 blur-[120px]" />
        {/* Center halo */}
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-900/10 blur-[100px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
        {/* Fade-out vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,transparent_60%,rgba(2,6,23,0.9)_100%)]" />
      </div>

      <section className="grid min-h-[calc(100vh-140px)] items-center gap-12 py-10 lg:grid-cols-[1.1fr_0.9fr]">

        {/* ── LEFT: Hero ── */}
        <div className="flex flex-col gap-8">

          {/* Tag pill */}
          <div className="w-fit">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2 text-sm font-medium text-violet-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
              </span>
              Zor konuşmalar için AI prova motoru
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="max-w-2xl text-5xl font-black leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
              Söylemeden önce dene.{" "}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-violet-300 via-violet-200 to-indigo-300 bg-clip-text text-transparent">
                Göndermeden önce bil.
              </span>
            </h1>
          </div>

          {/* Subtext */}
          <p className="max-w-md text-lg leading-relaxed text-slate-400">
            Zor konuşmaları, mesajları ve pazarlıkları AI ile güvenle prova et.
            Gerçek tepkileri gör, cevaplarını mükemmelleştir.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={user ? "/simulations/new" : "/register"}
              className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-violet-300 px-7 py-4 font-bold text-slate-950 shadow-lg shadow-violet-500/20 transition-all duration-200 hover:bg-violet-200 hover:-translate-y-0.5 hover:shadow-violet-500/35"
            >
              Ücretsiz Dene
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 font-semibold text-slate-200 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              {user ? "Dashboard" : "Giriş Yap"}
            </Link>
          </div>

          {/* Social proof stats */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
            <div className="text-sm text-slate-500">
              <span className="font-semibold text-slate-300">15.000+</span> prova tamamlandı
            </div>
            <div className="hidden h-3.5 w-px bg-white/10 sm:block" />
            <div className="text-sm text-slate-500">
              <span className="font-semibold text-slate-300">87%</span> daha etkili cevaplar
            </div>
            <div className="hidden h-3.5 w-px bg-white/10 sm:block" />
            <div className="text-sm text-slate-500">
              <span className="font-semibold text-slate-300">4.9 / 5</span> kullanıcı puanı
            </div>
          </div>
        </div>

        {/* ── RIGHT: Animated Product Preview ── */}
        <ProductPreview />
      </section>
    </AppShell>
  );
}
