"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Heart, Share2, Check } from "lucide-react";
import { formatDate } from "@/lib/status";
import { StatusBadge } from "@/components/status-badge";
import type { SimulationStatus } from "@/lib/types";

type SimulationCardProps = {
  simulation: {
    id: string;
    category: string;
    scenario: string;
    title: string;
    status: SimulationStatus;
    totalScore: number | null;
    isFavorite: boolean;
    isPublic: boolean;
    createdAt: Date | string;
  };
};

export function SimulationCard({ simulation }: SimulationCardProps) {
  const [isFavorite, setIsFavorite] = useState(simulation.isFavorite);
  const [isPublic, setIsPublic] = useState(simulation.isPublic);
  const [copied, setCopied] = useState(false);

  const href =
    simulation.status === "in_progress"
      ? `/simulations/${simulation.id}/play`
      : `/simulations/${simulation.id}`;

  const categoryLabels: Record<string, string> = {
    is_kariyer: "İş / Kariyer",
    flort_iliski: "Flört / İlişki",
    aile_arkadas: "Aile / Arkadaş",
    para_pazarlik: "Para / Pazarlık",
    egitim_okul: "Eğitim / Okul",
    gunluk_yasam: "Günlük Yaşam / Komşuluk",
    zor_mesajlar: "Zor Mesajlar",
    sosyal_medya_dijital: "Dijital / Sosyal Medya",
  };
  const categoryLabel = categoryLabels[simulation.category] || simulation.category;

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Toggle locally for instant feedback
    const original = isFavorite;
    setIsFavorite(!original);

    try {
      const res = await fetch(`/api/simulations/${simulation.id}/favorite`, {
        method: "POST",
      });
      if (!res.ok) {
        setIsFavorite(original);
      }
    } catch {
      setIsFavorite(original);
    }
  }

  async function toggleShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const originalPublic = isPublic;
    setIsPublic(!originalPublic);

    try {
      const res = await fetch(`/api/simulations/${simulation.id}/share`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setIsPublic(data.isPublic);
        if (data.isPublic) {
          // Copy public share link to clipboard
          const shareUrl = `${window.location.origin}${data.shareUrl}`;
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } else {
        setIsPublic(originalPublic);
      }
    } catch {
      setIsPublic(originalPublic);
    }
  }

  return (
    <div className="relative group">
      {/* Floating e-commerce style heart button */}
      <button
        onClick={toggleFavorite}
        className={`absolute top-5 right-5 z-20 p-2.5 rounded-full border transition-all duration-300 hover:scale-110 shadow-md ${
          isFavorite
            ? "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-950/20"
            : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
        }`}
        title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
      >
        <Heart size={15} fill={isFavorite ? "currentColor" : "none"} />
      </button>

      <Link
        href={href}
        className="block rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 pr-16 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/40 hover:bg-white/[0.09]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200">
              {categoryLabel}
            </p>
            <h3 className="mt-2 text-lg font-bold text-white group-hover:text-violet-200 transition-colors duration-300 pr-4">
              {simulation.title}
            </h3>
          </div>
          <ArrowRight className="mt-1 text-slate-500 transition-all duration-300 group-hover:text-violet-200 group-hover:translate-x-1" size={18} />
        </div>
        
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">{simulation.scenario}</p>
        
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={simulation.status} />
            <span className="text-xs text-slate-400">{formatDate(simulation.createdAt)}</span>
            {simulation.totalScore !== null && (
              <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                Skor {simulation.totalScore}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Public share icon */}
            <button
              onClick={toggleShare}
              className={`p-2 rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/5 flex items-center gap-1.5 text-[11px] ${
                isPublic ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-slate-400 hover:text-white"
              }`}
              title={isPublic ? "Paylaşımı Kapat" : "Genel Paylaşım Bağlantısı Kopyala"}
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  {isPublic && <span className="text-emerald-400 font-bold">Açık</span>}
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
