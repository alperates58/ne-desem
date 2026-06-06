"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  CreditCard, 
  History, 
  Share2, 
  Clipboard, 
  ClipboardCheck, 
  AlertCircle, 
  Save,
  Search,
  MessageSquare
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SimulationCard } from "@/components/simulation-card";
import type { SimulationStatus } from "@/lib/types";

type ProfileViewProps = {
  user: {
    id: string;
    name: string;
    email: string;
    bio: string;
    isPublic: boolean;
    socialLinks: Record<string, string>;
  };
  limits: {
    remaining: number;
    limit: number;
    count: number;
    custom: number;
    tierName: string;
  };
  simulations: any[];
  defaultTab: string;
  initialFilter: string;
  initialSearch: string;
};

export function ProfileView({
  user,
  limits,
  simulations,
  defaultTab,
  initialFilter,
  initialSearch,
}: ProfileViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(defaultTab || "info");

  // Local form state
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [isPublic, setIsPublic] = useState(user.isPublic);
  const [socialLinks, setSocialLinks] = useState({
    twitter: user.socialLinks.twitter || "",
    instagram: user.socialLinks.instagram || "",
    linkedin: user.socialLinks.linkedin || "",
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/u/${user.id}`);
    }
  }, [user.id]);

  // Handle URL tab changes if any
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const totalLimit = limits.limit + limits.custom;
  const usagePercentage = totalLimit > 0 ? Math.min(100, (limits.count / totalLimit) * 100) : 0;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          isPublic,
          socialLinks,
        }),
      });

      const data = await res.json();
      setPending(false);

      if (!res.ok) {
        setError(data.message || "Profil güncellenirken hata oluştu.");
        return;
      }

      setSuccess("Profiliniz başarıyla güncellendi.");
      setTimeout(() => setSuccess(""), 4000);
      router.refresh();
    } catch (err) {
      setPending(false);
      setError("Bağlantı hatası oluştu.");
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Helper for generating initials
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ND";

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] items-start">
      {/* Sidebar Navigation */}
      <aside className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 space-y-6 shadow-xl">
        {/* User Quick Info */}
        <div className="flex flex-col items-center text-center pb-5 border-b border-white/10">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-xl font-black text-white shadow-md">
            {initials}
          </div>
          <h3 className="mt-3 font-bold text-white text-base leading-tight">{name || "Kullanıcı"}</h3>
          <p className="text-xs text-slate-400 mt-1 truncate w-full px-2">{user.email}</p>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-1.5">
          <button
            onClick={() => {
              setActiveTab("info");
              router.push("/profile?tab=info");
            }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold transition duration-200 ${
              activeTab === "info"
                ? "bg-violet-400/20 text-violet-300 border border-violet-400/30"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <User size={16} />
            <span>Profil Bilgileri</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("limits");
              router.push("/profile?tab=limits");
            }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold transition duration-200 ${
              activeTab === "limits"
                ? "bg-violet-400/20 text-violet-300 border border-violet-400/30"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <CreditCard size={16} />
            <span>Üyelik & Limitler</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("provas");
              router.push("/profile?tab=provas");
            }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold transition duration-200 ${
              activeTab === "provas"
                ? "bg-violet-400/20 text-violet-300 border border-violet-400/30"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <History size={16} />
            <span>Önceki Provalarım</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="w-full">
        {/* Tab 1: Profil Bilgileri */}
        {activeTab === "info" && (
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-xl animate-in fade-in duration-300">
              <h2 className="text-xl font-black text-white">Profil Ayarları</h2>
              <p className="text-xs text-slate-400 mt-1">Kişisel bilgilerinizi ve sosyal ağlarınızı güncelleyin</p>

              <form onSubmit={handleSave} className="mt-6 space-y-5">
                {success && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                    {success}
                  </div>
                )}
                {error && (
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
                    {error}
                  </div>
                )}

                {/* Email (Readonly) */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">E-Posta Adresi</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-500 outline-none cursor-not-allowed"
                  />
                  <span className="mt-1 block text-[10px] text-slate-500">E-posta adresiniz güvenlik nedeniyle değiştirilemez.</span>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Ad Soyad</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs text-white outline-none focus:border-violet-300"
                    placeholder="Adınızı girin..."
                    required
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Hakkımda (Bio)</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 160))}
                    className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs text-white outline-none focus:border-violet-300"
                    placeholder="Kendinizi kısaca tanıtın (maks. 160 karakter)..."
                  />
                  <div className="mt-1 flex justify-end text-[10px] text-slate-500">
                    <span>{bio.length} / 160</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Sosyal Medya Linkleri</label>
                  
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1">X (Twitter) Kullanıcı Adı</span>
                      <input
                        type="text"
                        value={socialLinks.twitter}
                        onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                        placeholder="örn: alperates"
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs text-white outline-none focus:border-violet-300"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1">Instagram Kullanıcı Adı</span>
                      <input
                        type="text"
                        value={socialLinks.instagram}
                        onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                        placeholder="örn: alperates"
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs text-white outline-none focus:border-violet-300"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 mb-1">LinkedIn Kullanıcı Adı</span>
                      <input
                        type="text"
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                        placeholder="örn: alper-ates"
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-xs text-white outline-none focus:border-violet-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Public Toggle */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-white">Profilimi Herkese Aç</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Sosyal medyada paylaşmak ve başarılarınızı sergilemek için aktifleştirin.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 accent-violet-400"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex items-center gap-2 rounded-2xl bg-violet-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-violet-200 disabled:opacity-60 text-xs"
                  >
                    <Save size={14} />
                    {pending ? "Kaydediliyor..." : "Ayarları Kaydet"}
                  </button>
                </div>
              </form>
            </section>

            {/* Share Card */}
            {isPublic && (
              <div className="rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-violet-950/20 to-slate-900/30 p-6 shadow-xl animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-violet-200">
                  <Share2 size={18} />
                  <h3 className="font-bold text-sm">Profilini Paylaş!</h3>
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Profiliniz herkese açık olarak ayarlandı. Başarılarınızı ve tamamladığınız provaları sosyal medyada paylaşarak diğerlerine de ilham olun!
                </p>

                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2.5 text-xs text-slate-300 outline-none"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-300 text-slate-950 transition hover:bg-violet-200 shrink-0"
                    title="Linki kopyala"
                  >
                    {copied ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Üyelik & Limitler */}
        {activeTab === "limits" && (
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-xl animate-in fade-in duration-300 space-y-6">
            <div>
              <span className="inline-block rounded-full bg-violet-500/20 border border-violet-500/30 px-3 py-1 text-[10px] font-bold text-violet-300">
                {limits.tierName} Üyelik
              </span>
              <h2 className="mt-3 text-xl font-black text-white">Simülasyon Kotası</h2>
              <p className="text-xs text-slate-400 mt-1">Bu ayki kullanım durumunuz</p>
            </div>

            {/* Progress Bar */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>{limits.count} / {totalLimit} Prova</span>
                <span className="text-violet-300">{Math.round(usagePercentage)}%</span>
              </div>
              <div className="mt-3 h-3.5 w-full rounded-full bg-slate-900 border border-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Üyelik Limiti:</span>
                <span className="font-semibold text-white">{limits.limit}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-slate-400">Ekstra Haklar:</span>
                <span className="font-semibold text-white">+{limits.custom}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">Kalan Hakkınız:</span>
                <span className="font-bold text-violet-300">{limits.remaining}</span>
              </div>
            </div>

            {limits.remaining <= 0 && (
              <div className="flex gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs leading-relaxed text-rose-200">
                <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
                <span>Aylık simülasyon sınırına ulaştınız. Hakkınızı artırmak için admin paneli üzerinden veya paket yükselterek limitlerinizi artırabilirsiniz.</span>
              </div>
            )}
          </section>
        )}

        {/* Tab 3: Önceki Provalarım */}
        {activeTab === "provas" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Filter Form */}
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-xl">
              <h2 className="text-xl font-black text-white">Önceki Provaların</h2>
              <p className="text-xs text-slate-400 mt-1">Geçmişte yaptığınız veya yarım bıraktığınız tüm simülasyonlar.</p>

              <form action="/profile" method="GET" className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <input type="hidden" name="tab" value="provas" />
                <label className="flex items-center gap-3 rounded-2xl bg-slate-900 border border-white/5 px-4 py-3 text-xs">
                  <Search size={16} className="text-slate-500" />
                  <input
                    className="w-full bg-transparent outline-none text-white placeholder-slate-500"
                    name="search"
                    defaultValue={initialSearch}
                    placeholder="Senaryo veya kategori ara"
                  />
                </label>
                <select
                  className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-xs outline-none"
                  name="filter"
                  defaultValue={initialFilter}
                >
                  <option value="all">Tümü</option>
                  <option value="favorites">Favorilerim</option>
                  <option value="completed">Tamamlanan</option>
                  <option value="in_progress">Devam eden</option>
                  <option value="outcome_added">Sonuç yazılan</option>
                </select>
                <button className="rounded-2xl bg-violet-300 px-5 py-3 font-semibold text-slate-950 text-xs hover:bg-violet-200 transition" type="submit">
                  Uygula
                </button>
              </form>
            </div>

            {/* Loop Simulations */}
            {simulations.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.04] p-8 text-center">
                <h3 className="text-lg font-bold text-white">Sonuç bulunamadı</h3>
                <p className="mt-1 text-xs text-slate-400">Arama veya filtre kriterlerine uygun prova bulunamadı.</p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {simulations.map((simulation) => (
                  <SimulationCard
                    key={simulation.id}
                    simulation={{
                      ...simulation,
                      status: simulation.status as SimulationStatus,
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
