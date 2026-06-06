"use client";

import { useState } from "react";
import { ShieldAlert, Activity, Database, Check, Play, RefreshCw, Key } from "lucide-react";

type SystemStatus = {
  aiMode: string;
  deepseekModel: string;
  googleClientId: string;
  googleClientSecret: string;
  appUrl: string;
  tierCount: number;
};

type AdminSettingsFormProps = {
  systemStatus: SystemStatus;
};

export function AdminSettingsForm({ systemStatus }: AdminSettingsFormProps) {
  const [status, setStatus] = useState<SystemStatus>(systemStatus);
  
  // AI Test state
  const [testingAi, setTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{
    success: boolean;
    mode?: string;
    latencyMs?: number;
    outputSample?: string;
    warning?: string;
    error?: string;
  } | null>(null);

  // Seeding state
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  async function handleTestAi() {
    setTestingAi(true);
    setAiTestResult(null);

    try {
      const res = await fetch("/api/admin/settings/test-ai", {
        method: "POST",
      });
      const data = await res.json();
      setAiTestResult(data);
    } catch (err: any) {
      setAiTestResult({
        success: false,
        error: "Bağlantı isteği sunucuya ulaşamadı.",
      });
    } finally {
      setTestingAi(false);
    }
  }

  async function handleSeedTiers() {
    if (!confirm("Varsayılan üyelik planlarını (Free, Silver, Gold, Premium) veritabanına eklemek istediğinize emin misiniz?")) return;

    setSeeding(true);
    setSeedResult(null);

    try {
      const res = await fetch("/api/admin/settings/seed", {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        setSeedResult(data.message || "Başarıyla tamamlandı.");
        // Increment tier count locally to clear alert
        setStatus(prev => ({
          ...prev,
          tierCount: prev.tierCount + (data.seeded?.length || 0),
        }));
      } else {
        alert(data.message || "Seeding failed.");
      }
    } catch (err) {
      alert("Bir bağlantı hatası oluştu.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Sistem Ayarları</h1>
        <p className="text-sm text-slate-400">Sunucu yapılandırması ve teşhis araçları.</p>
      </div>

      {/* Warnings / Alerts */}
      {status.tierCount === 0 && (
        <div className="flex gap-3 rounded-[1.5rem] border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          <ShieldAlert size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-bold">Kritik Uyarı: Üyelik Tipleri Eksik</h3>
            <p className="text-xs leading-relaxed text-amber-300/90">
              Veritabanınızda henüz tanımlanmış bir üyelik planı (Free, Silver vb.) bulunmuyor. Bu durum, kullanıcıların kayıt olurken limitlerinin tanımlanamamasına ve sistemin çökmesine neden olabilir.
            </p>
            <button
              onClick={handleSeedTiers}
              disabled={seeding}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-300 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-200 disabled:opacity-50 transition"
            >
              {seeding ? "Oluşturuluyor..." : "Varsayılan Planları Yükle (Seed)"}
            </button>
          </div>
        </div>
      )}

      {/* Configuration Status Cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        {/* Card 1: AI Integration */}
        <div className="rounded-[2rem] border border-white/5 bg-slate-950/40 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-500/20 text-violet-300">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yapay Zeka Motoru</h3>
              <span className="text-sm font-bold text-white block mt-0.5 uppercase">
                {status.aiMode} Modu
              </span>
            </div>
          </div>
          <div className="border-t border-white/5 pt-3 text-xs space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>Aktif Model:</span>
              <span className="text-slate-200 font-mono text-[11px]">{status.deepseekModel}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Google Auth */}
        <div className="rounded-[2rem] border border-white/5 bg-slate-950/40 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-300">
              <Key size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Google Giriş</h3>
              <span className="text-sm font-bold text-white block mt-0.5">
                OAuth 2.0 Durumu
              </span>
            </div>
          </div>
          <div className="border-t border-white/5 pt-3 text-xs space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>Client ID:</span>
              <span className={status.googleClientId === "Configured" ? "text-emerald-300 font-bold" : "text-rose-400 font-bold"}>
                {status.googleClientId === "Configured" ? "Tanımlı" : "Eksik"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Client Secret:</span>
              <span className={status.googleClientSecret === "Configured" ? "text-emerald-300 font-bold" : "text-rose-400 font-bold"}>
                {status.googleClientSecret === "Configured" ? "Tanımlı" : "Eksik"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: App & DB */}
        <div className="rounded-[2rem] border border-white/5 bg-slate-950/40 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500/20 text-blue-300">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Veritabanı / URL</h3>
              <span className="text-sm font-bold text-white block mt-0.5">
                Uygulama Durumu
              </span>
            </div>
          </div>
          <div className="border-t border-white/5 pt-3 text-xs space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>Domain:</span>
              <span className="text-slate-200 truncate max-w-[150px]">{status.appUrl}</span>
            </div>
            <div className="flex justify-between">
              <span>Üyelik Planları:</span>
              <span className="text-slate-200 font-bold">{status.tierCount} Adet</span>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnostics Actions */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* AI Diagnostics Box */}
        <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/60 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Yapay Zeka Teşhis Aracı (Diagnostic)</h2>
            <p className="text-xs text-slate-400 mt-1">
              Aktif olan yapay zeka entegrasyonunun API bağlantısını, yanıt süresini ve şablon kalitesini test edin.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <button
              onClick={handleTestAi}
              disabled={testingAi}
              className="inline-flex items-center gap-2 rounded-2xl bg-violet-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-violet-200 disabled:opacity-50 transition"
            >
              {testingAi ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Bağlantı Test Ediliyor...
                </>
              ) : (
                <>
                  <Play size={16} />
                  AI Bağlantısını Test Et
                </>
              )}
            </button>

            {aiTestResult && (
              <div className={`rounded-2xl border p-4 space-y-3 text-xs ${
                aiTestResult.success 
                  ? "border-emerald-500/20 bg-emerald-950/10 text-slate-200" 
                  : "border-rose-500/20 bg-rose-950/10 text-slate-200"
              }`}>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-bold flex items-center gap-1.5">
                    {aiTestResult.success ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        Bağlantı Başarılı
                      </>
                    ) : (
                      <span className="text-rose-400">Bağlantı Başarısız</span>
                    )}
                  </span>
                  {aiTestResult.latencyMs !== undefined && (
                    <span className="text-[11px] font-semibold text-slate-400">
                      Gecikme: <span className="text-violet-300 font-bold">{aiTestResult.latencyMs} ms</span>
                    </span>
                  )}
                </div>

                {aiTestResult.success ? (
                  <div className="space-y-2">
                    <p>
                      <strong>Aktif Mod:</strong> <span className="uppercase text-violet-300 font-mono font-bold">{aiTestResult.mode}</span>
                    </p>
                    {aiTestResult.warning && (
                      <p className="text-amber-300 font-semibold bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        ⚠️ Uyarı: {aiTestResult.warning}
                      </p>
                    )}
                    <div className="space-y-1">
                      <strong className="block text-slate-400">Örnek Yapay Zeka Çıktısı (Brief):</strong>
                      <p className="bg-slate-950/40 p-3 rounded-xl border border-white/5 leading-relaxed text-[11px]">
                        "{aiTestResult.outputSample}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <strong className="block text-rose-400">Hata Detayı:</strong>
                    <pre className="bg-slate-950/60 p-3 rounded-xl border border-white/5 leading-relaxed overflow-x-auto text-[10px] text-rose-300 font-mono">
                      {aiTestResult.error}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Database Utilities Box */}
        <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/60 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Veritabanı Araçları (Database Utilities)</h2>
            <p className="text-xs text-slate-400 mt-1">
              Veritabanını sıfırlama, mock veriler ekleme veya varsayılan tabloları tohumlama (seed) işlemlerini başlatın.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSeedTiers}
                disabled={seeding}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5 disabled:opacity-50 transition"
              >
                {seeding ? "Planlar Yükleniyor..." : "Üyelik Planlarını Tohumla (Seed)"}
              </button>
            </div>

            {seedResult && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4 text-xs text-slate-200">
                <p className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Check size={14} /> Tohumlama Tamamlandı
                </p>
                <p className="mt-1 text-slate-300">{seedResult}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
