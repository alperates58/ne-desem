"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, X, Save, ShieldAlert } from "lucide-react";

type Tier = {
  id: string;
  name: string;
  price: number;
  monthlyLimit: number;
};

type AdminTiersListProps = {
  initialTiers: Tier[];
};

export function AdminTiersList({ initialTiers }: AdminTiersListProps) {
  const [tiers, setTiers] = useState<Tier[]>(initialTiers);
  const [editingTier, setEditingTier] = useState<Partial<Tier> | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTier?.name || editingTier.price === undefined || editingTier.monthlyLimit === undefined) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    setPending(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/tiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTier),
      });

      const data = await res.json();
      setPending(false);

      if (!res.ok) {
        setError(data.message || "Plan kaydedilemedi.");
        return;
      }

      // Update local state
      if (editingTier.id) {
        setTiers(tiers.map((t) => (t.id === editingTier.id ? data.tier : t)));
        setSuccess("Plan başarıyla güncellendi.");
      } else {
        setTiers([...tiers, data.tier]);
        setSuccess("Plan başarıyla oluşturuldu.");
      }

      setEditingTier(null);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setPending(false);
      setError("Bağlantı hatası oluştu.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu planı silmek istediğinize emin misiniz?")) return;

    setPending(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/tiers?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      setPending(false);

      if (!res.ok) {
        setError(data.message || "Plan silinemedi.");
        return;
      }

      setTiers(tiers.filter((t) => t.id !== id));
      setSuccess("Plan başarıyla silindi.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setPending(false);
      setError("Bağlantı hatası oluştu.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Üyelik Planları</h1>
          <p className="text-sm text-slate-400">Üyelik paketlerini ve limitleri buradan yönetin</p>
        </div>
        {!editingTier && (
          <button
            onClick={() => setEditingTier({ name: "", price: 0, monthlyLimit: 5 })}
            className="inline-flex items-center gap-2 rounded-2xl bg-violet-300 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-violet-200"
          >
            <Plus size={16} /> Yeni Plan
          </button>
        )}
      </div>

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

      {/* Editor Drawer / Box */}
      {editingTier && (
        <section className="rounded-[2rem] border border-violet-500/20 bg-white/[0.04] p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              {editingTier.id ? "Planı Düzenle" : "Yeni Üyelik Planı"}
            </h2>
            <button
              onClick={() => {
                setEditingTier(null);
                setError("");
              }}
              className="text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Plan Adı</label>
              <input
                type="text"
                value={editingTier.name || ""}
                onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                placeholder="Örn: Pro Plan"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Aylık Limit</label>
              <input
                type="number"
                value={editingTier.monthlyLimit === undefined ? "" : editingTier.monthlyLimit}
                onChange={(e) =>
                  setEditingTier({ ...editingTier, monthlyLimit: parseInt(e.target.value) || 0 })
                }
                placeholder="Aylık simülasyon adeti"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400"
                required
                min={0}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ücret (TL / Ay)</label>
              <input
                type="number"
                value={editingTier.price === undefined ? "" : editingTier.price}
                onChange={(e) =>
                  setEditingTier({ ...editingTier, price: parseFloat(e.target.value) || 0 })
                }
                placeholder="Fiyat"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400"
                required
                min={0}
                step={0.01}
              />
            </div>
            <div className="sm:col-span-3 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingTier(null);
                  setError("");
                }}
                className="rounded-2xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-200"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-300 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-violet-200 disabled:opacity-60"
              >
                <Save size={16} />
                Kaydet
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Tiers List */}
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Plan Adı</th>
                <th className="px-6 py-4">Aylık Simülasyon Limiti</th>
                <th className="px-6 py-4">Fiyat</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tiers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">
                    Kayıtlı üyelik planı bulunmuyor.
                  </td>
                </tr>
              ) : (
                tiers.map((tier) => (
                  <tr key={tier.id} className="hover:bg-white/[0.01] transition">
                    <td className="px-6 py-4 font-bold text-white">{tier.name}</td>
                    <td className="px-6 py-4">{tier.monthlyLimit} Adet</td>
                    <td className="px-6 py-4 font-semibold text-violet-300">{tier.price} TL / ay</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingTier(tier)}
                        className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 inline-flex items-center transition"
                        title="Planı Düzenle"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(tier.id)}
                        className="p-2 text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-500/10 inline-flex items-center transition"
                        title="Planı Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
