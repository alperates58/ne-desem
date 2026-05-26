"use client";

import { ArrowRight, Lock, MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { categories } from "@/lib/categories";
import type { MessageContext } from "@/lib/types";

const steps: Array<{
  key: keyof MessageContext;
  label: string;
  helper: string;
  type: "textarea" | "select" | "input";
  options?: string[];
}> = [
  {
    key: "incomingMessage",
    label: "Gelen mesaj ne?",
    helper: "İstersen özel bilgileri sansürleyebilirsin.",
    type: "textarea",
  },
  {
    key: "otherPerson",
    label: "Karşı taraf kim?",
    helper: "Bu rol simülasyondaki tepkiyi belirler.",
    type: "select",
    options: ["Flört", "Sevgili", "Eski sevgili", "Arkadaş", "Aile", "İş arkadaşı", "Patron", "Müşteri", "Tanımadığım biri"],
  },
  {
    key: "difficultyReason",
    label: "Bu mesaja cevap vermekte neden zorlanıyorsun?",
    helper: "Ana gerilimi seç.",
    type: "select",
    options: [
      "Kırmadan reddetmek istiyorum",
      "Fazla istekli görünmek istemiyorum",
      "Net olmak istiyorum",
      "Tartışma çıkmasın istiyorum",
      "Kendimi savunmak istiyorum",
      "Konuyu kapatmak istiyorum",
      "Karşı tarafın niyetini anlamak istiyorum",
    ],
  },
  {
    key: "goal",
    label: "Senin amacın ne?",
    helper: "Provanın kazanma koşulu gibi düşün.",
    type: "select",
    options: [
      "Konuşmayı sürdürmek",
      "Mesafe koymak",
      "Özür dilemek",
      "Sınır koymak",
      "Reddetmek",
      "Netlik istemek",
      "Tartışmayı kapatmak",
      "Karşı tarafı sakinleştirmek",
    ],
  },
  {
    key: "tone",
    label: "Ton nasıl olsun?",
    helper: "AI önerileri bu tona göre ayarlanır.",
    type: "select",
    options: ["Kısa", "Sakin", "Net", "Esprili", "Mesafeli", "Samimi", "Profesyonel", "Kırmadan ama kararlı"],
  },
  {
    key: "replyLength",
    label: "Cevap uzunluğu nasıl olsun?",
    helper: "Kısa kalmak çoğu zor mesajda avantajdır.",
    type: "select",
    options: ["Tek cümle", "Kısa mesaj", "Detaylı mesaj", "3 alternatif ver"],
  },
  {
    key: "preserveRelationship",
    label: "Bu kişiyle ilişkiyi korumak istiyor musun?",
    helper: "Sınır ve yumuşaklık dengesini etkiler.",
    type: "select",
    options: ["Evet", "Hayır", "Emin değilim", "Sadece saygılı kapatmak istiyorum"],
  },
  {
    key: "fear",
    label: "Karşı tarafın nasıl tepki vermesinden çekiniyorsun?",
    helper: "Örn: alınması, kızması, cevap vermemesi, manipüle etmesi.",
    type: "input",
  },
];

const initialContext: MessageContext = {
  incomingMessage: "",
  otherPerson: "Arkadaş",
  difficultyReason: "Net olmak istiyorum",
  goal: "Sınır koymak",
  tone: "Sakin",
  replyLength: "Kısa mesaj",
  preserveRelationship: "Evet",
  fear: "",
};

export function ContextWizard() {
  const router = useRouter();
  const [context, setContext] = useState<MessageContext>(initialContext);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  function update(key: keyof MessageContext, value: string) {
    setContext((previous) => ({ ...previous, [key]: value }));
  }

  async function submit() {
    setPending(true);
    setError("");

    const response = await fetch("/api/simulations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "zor_mesajlar", context }),
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(data.message || "Simülasyon oluşturulamadı.");
      return;
    }

    router.push(`/simulations/${data.simulation.id}/play`);
    router.refresh();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!context[current.key].trim()) {
      setError("Bu alanı doldurman gerekiyor.");
      return;
    }

    if (isLast) {
      void submit();
      return;
    }

    setError("");
    setStep((value) => value + 1);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
        <p className="text-sm font-semibold text-violet-200">Kategori seçimi</p>
        <div className="mt-4 grid gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`rounded-3xl border p-4 ${
                category.active
                  ? "border-violet-300/40 bg-violet-400/10"
                  : "border-white/10 bg-slate-950/40 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{category.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{category.description}</p>
                </div>
                {category.active ? (
                  <MessageSquareText className="text-violet-200" size={20} />
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                    <Lock size={12} /> Yakında
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {category.examples.map((example) => (
                  <span key={example} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <form
        onSubmit={onSubmit}
        className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-violet-950/30"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-200">
              Adım {step + 1} / {steps.length}
            </p>
            <h1 className="mt-2 text-2xl font-bold">{current.label}</h1>
            <p className="mt-2 text-sm text-slate-400">{current.helper}</p>
          </div>
        </div>

        {current.type === "textarea" ? (
          <textarea
            className="min-h-44 w-full rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-4 leading-7 outline-none ring-violet-400 focus:ring-2"
            value={context[current.key]}
            onChange={(event) => update(current.key, event.target.value)}
            placeholder="Mesajı buraya yapıştır..."
          />
        ) : current.type === "select" ? (
          <select
            className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-4 outline-none ring-violet-400 focus:ring-2"
            value={context[current.key]}
            onChange={(event) => update(current.key, event.target.value)}
          >
            {current.options?.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            className="w-full rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-4 outline-none ring-violet-400 focus:ring-2"
            value={context[current.key]}
            onChange={(event) => update(current.key, event.target.value)}
            placeholder="Kısaca yaz..."
          />
        )}

        {error && <p className="mt-4 text-sm text-rose-200">{error}</p>}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 disabled:opacity-40"
            disabled={step === 0 || pending}
            onClick={() => setStep((value) => Math.max(0, value - 1))}
          >
            Geri
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-2xl bg-violet-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-60"
            disabled={pending}
            type="submit"
          >
            {pending ? "Hazırlanıyor..." : isLast ? "Simülasyonu Başlat" : "Devam"}
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
