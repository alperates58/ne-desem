"use client";

import { useState } from "react";
import { Heart, Share2, Check } from "lucide-react";

type SimulationDetailActionsProps = {
  id: string;
  initialFavorite: boolean;
  initialPublic: boolean;
};

export function SimulationDetailActions({
  id,
  initialFavorite,
  initialPublic,
}: SimulationDetailActionsProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [copied, setCopied] = useState(false);

  async function toggleFavorite() {
    const original = isFavorite;
    setIsFavorite(!original);

    try {
      const res = await fetch(`/api/simulations/${id}/favorite`, {
        method: "POST",
      });
      if (!res.ok) {
        setIsFavorite(original);
      }
    } catch {
      setIsFavorite(original);
    }
  }

  async function toggleShare() {
    const originalPublic = isPublic;
    setIsPublic(!originalPublic);

    try {
      const res = await fetch(`/api/simulations/${id}/share`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setIsPublic(data.isPublic);
        if (data.isPublic) {
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
    <div className="flex items-center gap-2">
      {/* Toggle Favorite Button */}
      <button
        onClick={toggleFavorite}
        className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
          isFavorite
            ? "border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
            : "border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
        }`}
        title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
      >
        <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        <span>{isFavorite ? "Favori" : "Favoriye Ekle"}</span>
      </button>

      {/* Toggle Public Sharing Button */}
      <button
        onClick={toggleShare}
        className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
          isPublic
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
            : "border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
        }`}
        title={isPublic ? "Paylaşımı Kapat" : "Paylaşım Linkini Kopyala"}
      >
        {copied ? (
          <>
            <Check size={16} className="text-emerald-400" />
            <span className="text-emerald-300">Link Kopyalandı!</span>
          </>
        ) : (
          <>
            <Share2 size={16} />
            <span>{isPublic ? "Paylaşımı Kapat" : "Paylaş"}</span>
          </>
        )}
      </button>
    </div>
  );
}
