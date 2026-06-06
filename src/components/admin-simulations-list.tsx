"use client";

import { useState } from "react";
import { Search, Trash2, Eye, X, MessageSquare, Award, Clock, Activity, HelpCircle } from "lucide-react";
import { contextFieldLabels } from "@/lib/categories";

type Turn = {
  id: string;
  turnNumber: number;
  aiMessage: string;
  userMessage: string;
  scoresJson: any; // Record<string, number>
  feedback: string;
  betterAlternative: string;
  createdAt: string;
};

type Outcome = {
  id: string;
  whatHappened: string;
  otherPersonReaction: string;
  goalResult: string;
  satisfactionScore: number;
  nextGoal: string;
  aiFollowupAdviceJson: any;
  createdAt: string;
};

type Simulation = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: string;
  scenario: string;
  title: string;
  contextJson: any; // MessageContext
  status: string;
  totalScore: number | null;
  finalReportJson: any; // FinalReport
  createdAt: string;
  completedAt: string | null;
  turns: Turn[];
  outcome: Outcome | null;
};

type AdminSimulationsListProps = {
  initialSimulations: Simulation[];
};

export function AdminSimulationsList({ initialSimulations }: AdminSimulationsListProps) {
  const [simulations, setSimulations] = useState<Simulation[]>(initialSimulations);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedSim, setSelectedSim] = useState<Simulation | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter logic
  const filteredSims = simulations.filter((sim) => {
    const matchesSearch =
      sim.userName.toLowerCase().includes(search.toLowerCase()) ||
      sim.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      sim.title.toLowerCase().includes(search.toLowerCase()) ||
      sim.scenario.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !categoryFilter || sim.category === categoryFilter;
    const matchesStatus = !statusFilter || sim.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  async function handleDelete(id: string) {
    if (!confirm("Bu simülasyon kaydını tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/simulations/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Simülasyon silinemedi.");
        return;
      }

      setSimulations(simulations.filter((s) => s.id !== id));
      if (selectedSim?.id === id) {
        setSelectedSim(null);
      }
    } catch (err) {
      alert("Bir bağlantı hatası oluştu.");
    } finally {
      setDeletingId(null);
    }
  }

  // Helper to format category title
  function getCategoryTitle(catId: string) {
    const mapping: Record<string, string> = {
      is_kariyer: "İş / Kariyer",
      aile_arkadas: "Aile / Arkadaş",
      flort_iliski: "Flört / İlişki",
      para_pazarlik: "Para / Pazarlık",
      zor_mesajlar: "Zor Mesajlar",
      egitim_okul: "Eğitim / Okul",
      gunluk_yasam: "Günlük Yaşam / Komşuluk",
    };
    return mapping[catId] || catId;
  }

  // Helper to style status badges
  function getStatusBadge(status: string) {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
            Tamamlandı
          </span>
        );
      case "outcome_added":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/20 px-2.5 py-1 text-xs font-semibold text-violet-300 border border-violet-500/30">
            Sonuç Eklendi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-300 border border-amber-500/30">
            Devam Ediyor
          </span>
        );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Simülasyon / Prova Takibi</h1>
        <p className="text-sm text-slate-400">Sistemde gerçekleştirilen tüm yapay zeka prova seanslarını inceleyin.</p>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kullanıcı adı, e-posta veya başlıkta ara..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 pl-11 pr-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="">Tüm Kategoriler</option>
            <option value="is_kariyer">İş & Kariyer</option>
            <option value="aile_akraba">Aile & Akraba</option>
            <option value="ozel_iliskiler">Özel İlişkiler</option>
            <option value="para_pazarlik">Para & Pazarlık</option>
            <option value="zor_mesajlar">Zor Mesajlar</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="">Tüm Durumlar</option>
            <option value="in_progress">Devam Edenler</option>
            <option value="completed">Tamamlananlar</option>
            <option value="outcome_added">Sonuç Eklenenler</option>
          </select>
        </div>
      </div>

      {/* Simulations Table */}
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Kullanıcı</th>
                <th className="px-6 py-4">Kategori & Başlık</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-center">Hamle Adeti</th>
                <th className="px-6 py-4 text-center">Puan</th>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">
                    Aranan kriterlere uygun prova kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredSims.map((sim) => (
                  <tr key={sim.id} className="hover:bg-white/[0.01] transition">
                    <td className="px-6 py-4">
                      <div>
                        <span className="block font-bold text-white">{sim.userName}</span>
                        <span className="block text-xs text-slate-400">{sim.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-xs text-slate-300 font-semibold mb-1">
                          {getCategoryTitle(sim.category)}
                        </span>
                        <span className="block font-medium text-white truncate max-w-xs">{sim.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(sim.status)}</td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-200">
                      {sim.turns.length} Hamle
                    </td>
                    <td className="px-6 py-4 text-center">
                      {sim.totalScore !== null ? (
                        <span className="rounded-xl bg-violet-500/20 px-2.5 py-1 text-xs font-bold text-violet-300 border border-violet-500/20">
                          {sim.totalScore} / 100
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(sim.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedSim(sim)}
                        className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 inline-flex items-center transition"
                        title="Simülasyon Detayını Gör"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(sim.id)}
                        disabled={deletingId === sim.id}
                        className="p-2 text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-500/10 inline-flex items-center transition disabled:opacity-50"
                        title="Simülasyonu Sil"
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

      {/* Detail Inspector Modal */}
      {selectedSim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-5xl rounded-[2.5rem] border border-white/10 bg-slate-900 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-violet-400 font-bold uppercase tracking-wider">
                  {getCategoryTitle(selectedSim.category)} Prova Detayı
                </span>
                <h2 className="text-xl font-black text-white mt-1">{selectedSim.title}</h2>
                <p className="text-xs text-slate-400">
                  Oyuncu: <span className="text-slate-200 font-medium">{selectedSim.userName}</span> ({selectedSim.userEmail})
                </p>
              </div>
              <button
                onClick={() => setSelectedSim(null)}
                className="rounded-full bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Two Pane Grid */}
            <div className="mt-6 flex-1 overflow-y-auto grid gap-6 md:grid-cols-[300px_1fr] pr-1">
              {/* Left Pane - Setup & Context Details */}
              <aside className="space-y-4 h-fit">
                <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Senaryo Detayları</h3>
                  
                  {/* Map setup context fields */}
                  {Object.entries(selectedSim.contextJson || {}).map(([key, value]) => {
                    const label = (contextFieldLabels as Record<string, string>)[key];
                    if (!label || !value || typeof value !== "string") return null;
                    return (
                      <div key={key} className="space-y-1">
                        <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500">
                          {label}
                        </span>
                        <span className="block text-xs text-slate-200 leading-relaxed bg-white/[0.02] p-2 rounded-xl border border-white/5">
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Additional metadata */}
                <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-500">Simülasyon Durumu:</span>
                    <span className="font-semibold text-slate-200 uppercase">{selectedSim.status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-500">Toplam Hamle:</span>
                    <span className="font-semibold text-slate-200">{selectedSim.turns.length} Hamle</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-500">Oluşturma:</span>
                    <span className="font-semibold text-slate-200">
                      {new Date(selectedSim.createdAt).toLocaleString("tr-TR")}
                    </span>
                  </div>
                  {selectedSim.completedAt && (
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Bitiş:</span>
                      <span className="font-semibold text-slate-200">
                        {new Date(selectedSim.completedAt).toLocaleString("tr-TR")}
                      </span>
                    </div>
                  )}
                </div>
              </aside>

              {/* Right Pane - dialogue & reports */}
              <div className="space-y-6">
                {/* 1. Dialogue / Conversation Transcript */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare size={16} className="text-violet-400" /> Konuşma Akışı (Transcript)
                  </h3>

                  {selectedSim.turns.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-slate-500 text-xs italic">
                      Simülasyon henüz başlatılmamış veya ilk mesaj yazılmamış.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto border border-white/5 bg-slate-950/30 p-4 rounded-[1.5rem]">
                      {selectedSim.turns.map((turn, i) => (
                        <div key={turn.id} className="space-y-3">
                          {/* AI Character Message */}
                          <div className="flex flex-col items-start max-w-[85%]">
                            <span className="text-[10px] font-bold text-violet-400 mb-1 ml-2">
                              {selectedSim.contextJson.otherPerson || "Karşı Taraf"} (Hamle {turn.turnNumber})
                            </span>
                            <div className="rounded-2xl bg-violet-600/10 border border-violet-500/20 px-4 py-2.5 text-xs text-slate-200">
                              {turn.aiMessage}
                            </div>
                          </div>

                          {/* User Message */}
                          {turn.userMessage && (
                            <div className="flex flex-col items-end max-w-[85%] ml-auto">
                              <span className="text-[10px] font-bold text-slate-400 mb-1 mr-2">
                                Kullanıcı
                              </span>
                              <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-2.5 text-xs text-white">
                                {turn.userMessage}
                              </div>
                            </div>
                          )}

                          {/* AI Feedback Box for this Turn */}
                          <div className="ml-6 mr-6 border-l-2 border-violet-500/30 pl-4 py-1 text-xs space-y-2 bg-slate-950/20 p-3 rounded-r-xl">
                            <div className="flex flex-wrap gap-2">
                               {Object.entries(turn.scoresJson || {}).map(([sKey, sVal]) => (
                                 <span key={sKey} className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                   {sKey}: <span className="text-violet-300 font-bold">{String(sVal)}</span>
                                 </span>
                               ))}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed italic">
                              <strong>Geri Bildirim:</strong> {turn.feedback}
                            </p>
                            {turn.betterAlternative && (
                              <p className="text-[11px] text-emerald-400 leading-relaxed">
                                <strong>Daha İyi Alternatif:</strong> "{turn.betterAlternative}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Final Evaluation Report */}
                {selectedSim.finalReportJson && (
                  <div className="rounded-[1.5rem] border border-violet-500/20 bg-violet-950/10 p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-violet-500/20 pb-2">
                      <Award size={18} className="text-violet-400" /> Genel Değerlendirme Raporu
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400">Başarı Skoru:</span>
                        <p className="text-lg font-black text-violet-300">{selectedSim.totalScore} / 100</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400">Gelişim Alanı / Karşı Taraf Algısı:</span>
                        <p className="text-slate-300 leading-relaxed">
                          {selectedSim.finalReportJson.perceived_by_other_person}
                        </p>
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <span className="font-bold text-slate-400">Değerlendirme Özeti:</span>
                        <p className="text-slate-300 leading-relaxed">{selectedSim.finalReportJson.summary}</p>
                      </div>
                      <div className="space-y-1 text-emerald-300">
                        <span className="font-bold text-emerald-400">En İyi Cümle:</span>
                        <p className="italic">"{selectedSim.finalReportJson.best_sentence || "Veri yok"}"</p>
                      </div>
                      <div className="space-y-1 text-rose-300">
                        <span className="font-bold text-rose-400">En Zayıf Cümle:</span>
                        <p className="italic">"{selectedSim.finalReportJson.weakest_sentence || "Veri yok"}"</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Real Life Outcome & Followup Advice */}
                {selectedSim.outcome && (
                  <div className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-950/10 p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-emerald-500/20 pb-2">
                      <Clock size={18} className="text-emerald-400" /> Gerçek Hayat Sonucu ve Takip Tavsiyesi
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400">Gerçekte Ne Oldu? (Kullanıcı Raporu):</span>
                        <p className="text-slate-200 leading-relaxed">{selectedSim.outcome.whatHappened}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-400">Karşı Tarafın Tepkisi:</span>
                        <p className="text-slate-200 leading-relaxed">{selectedSim.outcome.otherPersonReaction}</p>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5 sm:col-span-2">
                        <span className="text-slate-400">Hedefe Ulaşıldı mı?</span>
                        <span className="font-bold text-emerald-300 uppercase">{selectedSim.outcome.goalResult}</span>
                      </div>
                      {selectedSim.outcome.aiFollowupAdviceJson && (
                        <div className="sm:col-span-2 space-y-2 bg-slate-950/30 p-3 rounded-xl">
                          <span className="font-bold text-emerald-400">AI Takip Analizi & Önerileri:</span>
                          <p className="text-slate-300 leading-relaxed">
                            {selectedSim.outcome.aiFollowupAdviceJson.situation_analysis}
                          </p>
                          {selectedSim.outcome.aiFollowupAdviceJson.followup_message && (
                            <div className="border-t border-white/5 pt-2">
                              <span className="font-bold text-slate-400">Tavsiye Edilen Takip Mesajı:</span>
                              <p className="text-emerald-300 italic">
                                "{selectedSim.outcome.aiFollowupAdviceJson.followup_message}"
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 border-t border-white/10 pt-4 flex justify-between">
              <button
                onClick={() => handleDelete(selectedSim.id)}
                disabled={deletingId === selectedSim.id}
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-500/20 px-5 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/30 transition disabled:opacity-50"
              >
                <Trash2 size={14} /> Simülasyonu Sil
              </button>
              <button
                onClick={() => setSelectedSim(null)}
                className="rounded-2xl border border-white/10 px-6 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5 transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
