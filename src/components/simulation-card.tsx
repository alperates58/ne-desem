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
    <Link
      href={href}
      className="group block rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 transition hover:-translate-y-0.5 hover:border-violet-300/40 hover:bg-white/[0.09] relative"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
            {simulation.category === "zor_mesajlar" ? "Zor Mesajlar" : simulation.category}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">{simulation.title}</h3>
        </div>
        <ArrowRight className="mt-1 text-slate-500 transition group-hover:text-violet-200" size={20} />
      </div>
      
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">{simulation.scenario}</p>
      
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
        <div className="flex items-center gap-3">
          <StatusBadge status={simulation.status} />
          <span className="text-xs text-slate-400">{formatDate(simulation.createdAt)}</span>
          {simulation.totalScore !== null && (
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              Skor {simulation.totalScore}
            </span>
          )}
        </div>

        {/* Favorites & Share Toggles */}
        <div className="flex items-center gap-2">
          {/* Favorite heart icon */}
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-xl border border-white/10 transition hover:bg-white/5 ${
              isFavorite ? "text-rose-500 border-rose-500/20 bg-rose-500/5" : "text-slate-400 hover:text-white"
            }`}
            title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
          >
            <Heart size={15} fill={isFavorite ? "currentColor" : "none"} />
          </button>

          {/* Public share icon */}
          <button
            onClick={toggleShare}
            className={`p-2 rounded-xl border border-white/10 transition hover:bg-white/5 flex items-center gap-1 text-[11px] ${
              isPublic ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-slate-400 hover:text-white"
            }`}
            title={isPublic ? "Paylaşımı Kapat" : "Genel Paylaşım Bağlantısı Kopyala"}
          >
            {copied ? (
              <>
                <Check size={15} className="text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Share2 size={15} />
                {isPublic && <span className="text-emerald-400 font-semibold">Açık</span>}
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
