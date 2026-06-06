"use client";

import { useState, useEffect } from "react";
import { Share2, Clipboard, ClipboardCheck, Sparkles, AlertCircle, Save } from "lucide-react";

type ProfileFormProps = {
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
};

export function ProfileForm({ user, limits }: ProfileFormProps) {
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

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
      {/* Left Column - Subscription & Limit Status */}
      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-xl">
          <span className="inline-block rounded-full bg-violet-500/20 border border-violet-500/30 px-3 py-1 text-xs font-bold text-violet-300">
            {limits.tierName} Üyelik
          </span>
          <h2 className="mt-3 text-2xl font-bold">Simülasyon Kotası</h2>
          <p className="mt-1 text-sm text-slate-400">Bu ayki kullanım durumunuz</p>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{limits.count} / {totalLimit} Prova</span>
              <span className="text-violet-300">{Math.round(usagePercentage)}%</span>
            </div>
            <div className="mt-2 h-3 w-full rounded-full bg-slate-900 border border-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Üyelik Limiti:</span>
              <span className="font-semibold text-white">{limits.limit}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Ekstra Haklar:</span>
              <span className="font-semibold text-white">+{limits.custom}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-slate-400">Kalan Hakkınız:</span>
              <span className="font-bold text-violet-300">{limits.remaining}</span>
            </div>
          </div>

          {limits.remaining <= 0 && (
            <div className="mt-4 flex gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs leading-5 text-rose-200">
              <AlertCircle size={16} className="shrink-0 text-rose-400 mt-0.5" />
              <span>Aylık simülasyon sınırına ulaştınız. Hakkınızı artırmak için admin paneli üzerinden veya paket yükselterek limitlerinizi artırabilirsiniz.</span>
            </div>
          )}
        </div>

        {/* Share Card */}
        {isPublic && (
          <div className="rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-violet-950/20 to-slate-900/30 p-6 shadow-xl">
            <div className="flex items-center gap-2 text-violet-200">
              <Share2 size={20} />
              <h3 className="font-bold">Profilini Paylaş!</h3>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-5">
              Profiliniz herkese açık olarak ayarlandı. Başarılarınızı ve tamamladığınız provaları sosyal medyada paylaşarak diğerlerine de ilham olun!
            </p>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-300 outline-none"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="grid h-9 w-9 place-items-center rounded-2xl bg-violet-300 text-slate-950 transition hover:bg-violet-200"
                title="Linki kopyala"
              >
                {copied ? <ClipboardCheck size={16} /> : <Clipboard size={16} />}
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Right Column - Profile Settings Form */}
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-xl">
        <h2 className="text-2xl font-bold">Profil Ayarları</h2>
        <p className="mt-1 text-sm text-slate-400">Kişisel bilgilerinizi ve sosyal ağlarınızı güncelleyin</p>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          {/* Success / Error Alerts */}
          {success && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          {/* Email (Readonly) */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">E-Posta Adresi</label>
            <input
              type="email"
              disabled
              value={user.email}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-500 outline-none cursor-not-allowed"
            />
            <span className="mt-1 block text-xs text-slate-500">E-posta adresiniz güvenlik nedeniyle değiştirilemez.</span>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Ad Soyad</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="Adınızı girin..."
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Hakkımda (Bio)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="Kendinizi kısaca tanıtın (maks. 160 karakter)..."
            />
            <div className="mt-1 flex justify-end text-xs text-slate-500">
              <span>{bio.length} / 160</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Sosyal Medya Linkleri</label>
            
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <span className="block text-xs text-slate-500 mb-1">X (Twitter) Kullanıcı Adı</span>
                <input
                  type="text"
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                  placeholder="örn: alperates"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div>
                <span className="block text-xs text-slate-500 mb-1">Instagram Kullanıcı Adı</span>
                <input
                  type="text"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  placeholder="örn: alperates"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div>
                <span className="block text-xs text-slate-500 mb-1">LinkedIn Kullanıcı Adı</span>
                <input
                  type="text"
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                  placeholder="örn: alper-ates"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
            </div>
          </div>

          {/* Public Toggle */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
            <div>
              <span className="block text-sm font-semibold text-white">Profilimi Herkese Aç</span>
              <span className="block text-xs text-slate-400 mt-0.5">Sosyal medyada paylaşmak ve başarılarınızı sergilemek için aktifleştirin.</span>
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
              className="inline-flex items-center gap-2 rounded-2xl bg-violet-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-violet-200 disabled:opacity-60"
            >
              <Save size={16} />
              {pending ? "Kaydediliyor..." : "Ayarları Kaydet"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
