"use client";

import { ArrowRight, Lock, MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { categories } from "@/lib/categories";
import type { MessageContext } from "@/lib/types";

type WizardStep = {
  key: keyof MessageContext;
  label: string;
  helper: string;
  type: "textarea" | "select" | "input";
  options?: string[];
  placeholder?: string;
};

function getStepsForCategory(category: string): WizardStep[] {
  switch (category) {
    case "is_kariyer":
      return [
        {
          key: "incomingMessage",
          label: "İş ortamındaki durum veya sana söylenen son söz ne?",
          helper: "Örn: Yöneticinin 'Hafta sonu işe gelebilir misin?' demesi veya zam talebi öncesi mevcut durum.",
          type: "textarea",
          placeholder: "Durumu veya konuşulan son cümleyi yaz..."
        },
        {
          key: "otherPerson",
          label: "Karşı taraf kim?",
          helper: "Karşı tarafın rolü konuşmanın gidişatını belirler.",
          type: "select",
          options: ["Patron", "Yönetici / Müdür", "İş arkadaşı", "IK (İnsan Kaynakları)", "Müşteri"]
        },
        {
          key: "difficultyReason",
          label: "Bu konuda konuşmakta neden zorlanıyorsun?",
          helper: "Temel zorluğu veya çekinceni seç.",
          type: "select",
          options: [
            "Zam istemek / hakkımı savunmak",
            "Fazla mesaiyi kibarca reddetmek",
            "İstifa etmek / ayrılmak",
            "Haksız eleştiriye profesyonel yanıt vermek",
            "İş yükümü azaltmak",
            "Ekip arkadaşıma geribildirim vermek"
          ]
        },
        {
          key: "goal",
          label: "Senin amacın ne?",
          helper: "Provanın kazanma koşulu gibi düşün.",
          type: "select",
          options: ["Zam almak", "Sınır koymak", "Profesyonelce reddetmek", "Geri bildirim vermek", "İstifa etmek"]
        },
        {
          key: "tone",
          label: "Ton nasıl olsun?",
          helper: "Yapay zeka önerileri bu tona göre ayarlanır.",
          type: "select",
          options: ["Profesyonel ve kibar", "Net ve kararlı", "Yumuşak ama ciddi", "Kısa ve direkt"]
        },
        {
          key: "replyLength",
          label: "Cevap uzunluğu nasıl olsun?",
          helper: "Profesyonel yazışmalarda net olmak avantajdır.",
          type: "select",
          options: ["Tek cümle", "Kısa mesaj", "Detaylı mesaj", "3 alternatif ver"]
        },
        {
          key: "preserveRelationship",
          label: "Bu kişiyle profesyonel ilişkiyi korumak istiyor musun?",
          helper: "Sınır ve nezaket dengesini ayarlar.",
          type: "select",
          options: ["Evet", "Hayır", "Emin değilim", "Sadece saygılı kapatmak istiyorum"]
        },
        {
          key: "fear",
          label: "Karşı tarafın nasıl tepki vermesinden çekiniyorsun?",
          helper: "Çekindiğin olumsuz senaryoyu belirt.",
          type: "input",
          placeholder: "Örn: işimi kaybetmek, zayıf görünmek, patronun sinirlenmesi"
        }
      ];
    case "flort_iliski":
      return [
        {
          key: "incomingMessage",
          label: "İlişkideki son mesaj veya durum ne?",
          helper: "Örn: Karşı tarafın geç yazması, soğuk cevabı veya belirsiz bir durum.",
          type: "textarea",
          placeholder: "Gelen son mesajı veya durumu yaz..."
        },
        {
          key: "otherPerson",
          label: "Karşı taraf kim?",
          helper: "Aranızdaki bağ simülasyonu şekillendirir.",
          type: "select",
          options: ["Yeni tanışılan biri", "Flört", "Sevgili", "Eski sevgili", "Platonik aşk"]
        },
        {
          key: "difficultyReason",
          label: "Neden yazmakta veya konuşmakta zorlanıyorsun?",
          helper: "Kararsızlığının sebebini seç.",
          type: "select",
          options: [
            "İlişkiyi adlandırmak / netlik istemek",
            "Soğuk davranılmasını sorgulamak",
            "Kırgınlığımı dile getirmek",
            "Kıskançlık / güven konusunu açmak",
            "Kibarca mesafe koymak / bitirmek",
            "Eski sevgiliye yanıt vermek"
          ]
        },
        {
          key: "goal",
          label: "Senin amacın ne?",
          helper: "Simülasyonun hedefi.",
          type: "select",
          options: ["Niyetini anlamak", "Kırgınlığımı hissettirmek", "Mesafe koymak", "İlişkiyi bitirmek", "Özür dilemek ve barışmak"]
        },
        {
          key: "tone",
          label: "Ton nasıl olsun?",
          helper: "AI bu tona göre öneri yapacaktır.",
          type: "select",
          options: ["Sakin", "Net ve mesafeli", "Duygusal ama kontrollü", "Samimi ve açık", "Hafif esprili"]
        },
        {
          key: "replyLength",
          label: "Cevap uzunluğu nasıl olsun?",
          helper: "Kısa kalmak genelde flörtte daha etkilidir.",
          type: "select",
          options: ["Tek cümle", "Kısa mesaj", "Detaylı mesaj", "3 alternatif ver"]
        },
        {
          key: "preserveRelationship",
          label: "Bu kişiyle aranızdaki bağı korumak istiyor musun?",
          helper: "Gelecekteki iletişimi etkiler.",
          type: "select",
          options: ["Evet", "Hayır", "Emin değilim", "Sadece saygılı kapatmak istiyorum"]
        },
        {
          key: "fear",
          label: "Karşı tarafın nasıl tepki vermesinden çekiniyorsun?",
          helper: "Seni durduran endişeyi yaz.",
          type: "input",
          placeholder: "Örn: tamamen kopmak, gurursuz görünmek, reddedilmek"
        }
      ];
    case "aile_arkadas":
      return [
        {
          key: "incomingMessage",
          label: "Söylenen son söz veya yaşanan durum ne?",
          helper: "Örn: Arkadaşın borç istedi veya ailen kararlarına karıştı.",
          type: "textarea",
          placeholder: "Durumu veya mesajı buraya yaz..."
        },
        {
          key: "otherPerson",
          label: "Karşı taraf kim?",
          helper: "Yakınlık derecesini seç.",
          type: "select",
          options: ["Anne", "Baba", "Kardeş", "Yakın arkadaş", "Akraba / Kuzen"]
        },
        {
          key: "difficultyReason",
          label: "Bu konuda konuşmakta neden zorlanıyorsun?",
          helper: "En çok zorlandığın durum.",
          type: "select",
          options: [
            "Arkadaşa borcunu hatırlatmak",
            "Yakın birine hayır demek",
            "Aileye kendi kararlarımı açıklamak",
            "Planı kırmadan iptal etmek",
            "Yakın birinin kırıcı davranışını söylemek"
          ]
        },
        {
          key: "goal",
          label: "Senin amacın ne?",
          helper: "Ulaşmak istediğin sonuç.",
          type: "select",
          options: ["Kırmadan sınır koymak", "Hayır demek", "Kararımı kabul ettirmek", "Borcumu tahsil etmek", "İlişkiyi düzeltmek"]
        },
        {
          key: "tone",
          label: "Ton nasıl olsun?",
          helper: "İletişim dilini belirler.",
          type: "select",
          options: ["Çok yumuşak", "Sakin ama net", "Kırmadan sınır koyan", "Direkt ve açık"]
        },
        {
          key: "replyLength",
          label: "Cevap uzunluğu nasıl olsun?",
          helper: "Çok açıklama yapmak bazen sınırları zayıflatır.",
          type: "select",
          options: ["Tek cümle", "Kısa mesaj", "Detaylı mesaj", "3 alternatif ver"]
        },
        {
          key: "preserveRelationship",
          label: "İlişkiyi korumak istiyor musun?",
          helper: "Kişisel sınır dengesini etkiler.",
          type: "select",
          options: ["Evet", "Hayır", "Emin değilim", "Sadece saygılı kapatmak istiyorum"]
        },
        {
          key: "fear",
          label: "Karşı tarafın nasıl tepki vermesinden çekiniyorsun?",
          helper: "En büyük kaygın.",
          type: "input",
          placeholder: "Örn: ailemin küsmesi, arkadaşımın kırılması, bencil görünmek"
        }
      ];
    case "para_pazarlik":
      return [
        {
          key: "incomingMessage",
          label: "Pazarlık veya para ile ilgili son durum/teklif ne?",
          helper: "Örn: Ev sahibinin yüksek zam talebi veya müşterinin indirim istemesi.",
          type: "textarea",
          placeholder: "Mevcut fiyat teklifini veya durumu yaz..."
        },
        {
          key: "otherPerson",
          label: "Karşı taraf kim?",
          helper: "Finansal muhatabın.",
          type: "select",
          options: ["Müşteri", "Patron / Yönetici", "Ev sahibi", "Kiracı", "Satıcı", "Alıcı", "Arkadaş"]
        },
        {
          key: "difficultyReason",
          label: "Neden zorlanıyorsun?",
          helper: "Seni kısıtlayan durumu seç.",
          type: "select",
          options: [
            "Maaş pazarlığı yapmak",
            "Serbest çalışan olarak fiyatımı savunmak",
            "Müşterinin indirim talebini reddetmek",
            "Kira artışına itiraz etmek / anlaşmak",
            "Arkadaştan alacağımı istemek"
          ]
        },
        {
          key: "goal",
          label: "Senin amacın ne?",
          helper: "Maddi veya sözleşmesel hedefin.",
          type: "select",
          options: ["Hedef tutarda anlaşmak", "İndirim yapmadan satmak", "Artışı kabul ettirmek / limit koymak", "Ödemeyi almak"]
        },
        {
          key: "tone",
          label: "Pazarlık tonun nasıl olsun?",
          helper: "Pazarlık gücünü etkiler.",
          type: "select",
          options: ["Uzlaşmacı", "Net ve kararlı", "Sert ama saygılı", "Profesyonel"]
        },
        {
          key: "replyLength",
          label: "Cevap uzunluğu nasıl olsun?",
          helper: "Pazarlıkta az ve öz konuşmak koz kazandırır.",
          type: "select",
          options: ["Tek cümle", "Kısa mesaj", "Detaylı mesaj", "3 alternatif ver"]
        },
        {
          key: "preserveRelationship",
          label: "İlişkiyi/anlaşmayı korumak istiyor musun?",
          helper: "Masadan kalkma limitini belirler.",
          type: "select",
          options: ["Evet", "Hayır", "Emin değilim", "Sadece saygılı kapatmak istiyorum"]
        },
        {
          key: "fear",
          label: "En çok hangi tepki veya sonuçtan çekiniyorsun?",
          helper: "En büyük finansal kaygın.",
          type: "input",
          placeholder: "Örn: anlaşmanın bozulması, müşteriyi kaybetmek, cimri görünmek"
        }
      ];
    case "zor_mesajlar":
    default:
      return [
        {
          key: "incomingMessage",
          label: "Gelen mesaj ne?",
          helper: "İstersen özel bilgileri sansürleyebilirsin.",
          type: "textarea",
          placeholder: "Gelen mesajı aynen buraya yapıştır..."
        },
        {
          key: "otherPerson",
          label: "Karşı taraf kim?",
          helper: "Bu rol simülasyondaki tepkiyi belirler.",
          type: "select",
          options: ["Flört", "Sevgili", "Eski sevgili", "Arkadaş", "Aile", "İş arkadaşı", "Patron", "Müşteri", "Tanımadığım biri"]
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
            "Karşı tarafın niyetini anlamak istiyorum"
          ]
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
            "Karşı tarafı sakinleştirmek"
          ]
        },
        {
          key: "tone",
          label: "Ton nasıl olsun?",
          helper: "AI önerileri bu tona göre ayarlanır.",
          type: "select",
          options: ["Kısa", "Sakin", "Net", "Esprili", "Mesafeli", "Samimi", "Profesyonel", "Kırmadan ama kararlı"]
        },
        {
          key: "replyLength",
          label: "Cevap uzunluğu nasıl olsun?",
          helper: "Kısa kalmak çoğu zor mesajda avantajdır.",
          type: "select",
          options: ["Tek cümle", "Kısa mesaj", "Detaylı mesaj", "3 alternatif ver"]
        },
        {
          key: "preserveRelationship",
          label: "Bu kişiyle ilişkiyi korumak istiyor musun?",
          helper: "Sınır ve yumuşaklık dengesini etkiler.",
          type: "select",
          options: ["Evet", "Hayır", "Emin değilim", "Sadece saygılı kapatmak istiyorum"]
        },
        {
          key: "fear",
          label: "Karşı tarafın nasıl tepki vermesinden çekiniyorsun?",
          helper: "Örn: alınması, kızması, cevap vermemesi, manipüle etmesi.",
          type: "input",
          placeholder: "Örn: alınması, kızması, cevap vermemesi, dalga geçmesi"
        }
      ];
  }
}

function getInitialContextForCategory(category: string): MessageContext {
  const steps = getStepsForCategory(category);
  const context: Partial<MessageContext> = {};
  for (const step of steps) {
    if (step.type === "select" && step.options) {
      context[step.key] = step.options[0];
    } else {
      context[step.key] = "";
    }
  }
  return context as MessageContext;
}

export function ContextWizard() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("zor_mesajlar");
  const [context, setContext] = useState<MessageContext>(() =>
    getInitialContextForCategory("zor_mesajlar"),
  );
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const steps = getStepsForCategory(selectedCategory);
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
      body: JSON.stringify({ category: selectedCategory, context }),
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

    if (!context[current.key]?.trim()) {
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
            <button
              key={category.id}
              onClick={() => {
                if (category.active && !pending) {
                  setSelectedCategory(category.id);
                  setContext(getInitialContextForCategory(category.id));
                  setStep(0);
                  setError("");
                }
              }}
              type="button"
              className={`w-full text-left rounded-3xl border p-4 transition-all duration-300 ${
                category.active
                  ? category.id === selectedCategory
                    ? "border-violet-300 bg-violet-400/20 ring-2 ring-violet-400/40 shadow-lg shadow-violet-950/20"
                    : "border-white/10 bg-slate-950/40 hover:bg-violet-400/5 cursor-pointer"
                  : "border-white/10 bg-slate-950/20 opacity-40 cursor-not-allowed"
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
            </button>
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
            value={context[current.key] || ""}
            onChange={(event) => update(current.key, event.target.value)}
            placeholder={current.placeholder || "Mesajı buraya yaz..."}
          />
        ) : current.type === "select" ? (
          <select
            className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-4 outline-none ring-violet-400 focus:ring-2"
            value={context[current.key] || ""}
            onChange={(event) => update(current.key, event.target.value)}
          >
            {current.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            className="w-full rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-4 outline-none ring-violet-400 focus:ring-2"
            value={context[current.key] || ""}
            onChange={(event) => update(current.key, event.target.value)}
            placeholder={current.placeholder || "Kısaca yaz..."}
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
