import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, Trophy, Award, MessageSquare, MessageCircle, Play } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCategoryLabel } from "@/lib/categories";

type PublicProfilePageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { id } = await params;

  const profileUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!profileUser || !profileUser.isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,#4c1d95_0,#1e1b4b_28%,#020617_62%)] px-4">
        <div className="max-w-md w-full text-center rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl">
          <Award size={48} className="mx-auto text-violet-300" />
          <h1 className="mt-6 text-2xl font-bold text-white">Gizli Profil</h1>
          <p className="mt-3 text-sm text-slate-400 leading-6">
            Bu kullanıcı profili sahibi tarafından gizli olarak ayarlanmıştır veya böyle bir kullanıcı bulunmamaktadır.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block w-full rounded-2xl bg-violet-300 py-3 font-semibold text-slate-950 hover:bg-violet-200"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  // Fetch accomplishments metrics
  const completedCount = await prisma.simulation.count({
    where: { userId: id, status: { in: ["completed", "outcome_added"] } },
  });

  const scoresAgg = await prisma.simulation.aggregate({
    where: { userId: id, totalScore: { not: null } },
    _avg: { totalScore: true },
    _max: { totalScore: true },
  });

  const averageScore = scoresAgg._avg.totalScore ? Math.round(scoresAgg._avg.totalScore) : 0;
  const maxScore = scoresAgg._max.totalScore || 0;

  const latestSimulations = await prisma.simulation.findMany({
    where: { userId: id, status: { in: ["completed", "outcome_added"] } },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      category: true,
      title: true,
      totalScore: true,
    },
  });

  // Social Links
  const social = (profileUser.socialLinksJson as Record<string, string>) || {};
  const initials = profileUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#4c1d95_0,#1e1b4b_28%,#020617_62%)] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        
        {/* Header Portfolio Card */}
        <section className="rounded-[2.5rem] border border-white/10 bg-slate-950/70 p-8 shadow-2xl text-center relative overflow-hidden">
          {/* Decorative glows */}
          <div className="absolute -top-20 -left-20 w-44 h-44 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-44 h-44 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center">
            {/* Avatar */}
            <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-3xl font-black text-white shadow-xl shadow-violet-950/50">
              {initials}
            </div>

            <h1 className="mt-6 text-3xl font-black text-white tracking-tight">{profileUser.name}</h1>
            {profileUser.bio ? (
              <p className="mt-3 max-w-lg text-sm text-slate-300 leading-6">{profileUser.bio}</p>
            ) : (
              <p className="mt-3 text-sm text-slate-400 italic">"Zor diyalogları prova ederek sınırlarını çizmeyi öğreniyor."</p>
            )}

            {/* Social media icons using custom inline SVGs */}
            {(social.twitter || social.instagram || social.linkedin) && (
              <div className="mt-5 flex gap-3">
                {social.twitter && (
                  <a
                    href={`https://twitter.com/${social.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition"
                    title="X (Twitter)"
                  >
                    <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {social.instagram && (
                  <a
                    href={`https://instagram.com/${social.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition"
                    title="Instagram"
                  >
                    <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                )}
                {social.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${social.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition"
                    title="LinkedIn"
                  >
                    <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Stats Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5 flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-500/10 text-violet-300 border border-violet-500/20">
              <MessageSquare size={22} />
            </div>
            <div>
              <span className="block text-xs text-slate-400">Tamamlanan Prova</span>
              <span className="text-2xl font-black text-white">{completedCount}</span>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5 flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
              <Sparkles size={22} />
            </div>
            <div>
              <span className="block text-xs text-slate-400">Ortalama Başarı</span>
              <span className="text-2xl font-black text-white">{averageScore}%</span>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5 flex items-center gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Trophy size={22} />
            </div>
            <div>
              <span className="block text-xs text-slate-400">En Yüksek Skor</span>
              <span className="text-2xl font-black text-white">{maxScore}</span>
            </div>
          </div>
        </div>

        {/* Latest Public Completed Provas */}
        {latestSimulations.length > 0 && (
          <section className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/50 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Son Tamamlanan Provalar</h2>
            <div className="space-y-3">
              {latestSimulations.map((sim) => (
                <div
                  key={sim.id}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-violet-300">
                      {getCategoryLabel(sim.category)}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 mt-1">{sim.title}</h3>
                  </div>
                  {sim.totalScore !== null && (
                    <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 text-xs font-bold text-violet-300">
                      Skor: {sim.totalScore}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Share & Invite Portfolio */}
        <section className="mt-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-violet-950/20 to-fuchsia-950/20 p-8 text-center">
          <h3 className="text-lg font-bold text-white">Bu Başarı Tablosunu Paylaş</h3>
          <p className="mt-2 text-xs text-slate-400">Tek tıkla sosyal ağlarında paylaşarak arkadaşlarını davet et.</p>
          
          <div className="mt-5 flex justify-center gap-4 flex-wrap">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${profileUser.name} sınırlarını çizmek için "Ne Desem?" ile provalar yapıyor! Ortalama skoru: %${averageScore}. Sen de durumunu prova et: `
              )}&url=${encodeURIComponent(`https://nedesem.alperates.com.tr/u/${id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
            >
              <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter'da Paylaş
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                `https://nedesem.alperates.com.tr/u/${id}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
            >
              <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn'de Paylaş
            </a>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm text-slate-300">Sen de zor konuşmalar öncesinde kendini test etmek ister misin?</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-violet-300 px-6 py-3 font-bold text-slate-950 hover:bg-violet-200 transition"
            >
              <Play size={16} fill="currentColor" /> Hemen Ücretsiz Prova Yap
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
