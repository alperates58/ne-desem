"use client";

import { Send, Sparkles, SquareCheckBig } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScoreBar } from "@/components/score-bar";
import type { MessageContext, Scores, SuggestedReplies } from "@/lib/types";

type Turn = {
  turnNumber: number;
  userMessage: string;
  aiMessage: string;
  feedback: string;
  betterAlternative: string;
  scores: Scores;
};

type ChatSimulationProps = {
  simulationId: string;
  category: string;
  context: MessageContext;
  initialTurns: Turn[];
};

function createStarterSuggestions(category: string, context: MessageContext): SuggestedReplies {
  const goal = context.goal.toLocaleLowerCase("tr-TR");

  // Let's create smart suggestions based on the category
  if (category === "is_kariyer") {
    if (goal.includes("zam")) {
      return {
        soft: "Son dönemdeki projelerim ve artan sorumluluklarım doğrultusunda maaşımı gözden geçirmemizi rica edecektim.",
        clear: "Mevcut sorumluluklarım ve sektörel piyasa koşullarını değerlendirerek maaşımda bir artış yapılmasını talep ediyorum.",
        short: "Maaş artışı ve performans değerlendirmemi görüşmek isterim.",
      };
    }
    if (goal.includes("redd") || goal.includes("sınır")) {
      return {
        soft: "Bu konuda yardımcı olmak isterdim ancak şu anki iş yoğunluğum nedeniyle bu görevi ek olarak üstlenmem mümkün görünmüyor.",
        clear: "Hafta sonu için önceden planlanmış kişisel bir programım var, bu yüzden mesaiye kalamayacağım.",
        short: "Üzgünüm, bu seferlik yardımcı olamayacağım.",
      };
    }
    if (goal.includes("istifa")) {
      return {
        soft: "Kariyerimde yeni bir fırsatı değerlendirmek üzere istifa kararımı ve ihbar süremi sizinle paylaşmak istiyorum.",
        clear: "Başka bir şirketten aldığım teklifi kabul ettim. Bu doğrultuda görevimden ayrılma kararımı bildirmek isterim.",
        short: "İstifa dilekçemi ve ayrılma sürecimi görüşmek için zaman rica ediyorum.",
      };
    }
    return {
      soft: "İş süreçlerimiz ve sorumluluk paylaşımlarımız üzerine konuşmak istiyordum.",
      clear: "Bu konuyu profesyonel bir çerçevede değerlendirip ortak bir yol bulabileceğimizi düşünüyorum.",
      short: "Bu konuyu detaylıca görüşebilir miyiz?",
    };
  }

  if (category === "para_pazarlik") {
    if (goal.includes("kira") || context.incomingMessage.includes("kira")) {
      return {
        soft: "Piyasa şartlarını anlıyorum ancak yasal artış oranını aşmayacak ortak bir noktada buluşmamızı rica ediyorum.",
        clear: "Yasal olarak belirlenen üst sınırın üzerinde bir kira artışını bütçem doğrultusunda kabul etmem mümkün değil.",
        short: "Kira artışını yasal sınırda tutmak istiyorum.",
      };
    }
    if (goal.includes("borç") || goal.includes("alacak") || goal.includes("ödem")) {
      return {
        soft: "Biliyorum senin de planların vardır ama verdiğim borcu ne zaman kapatabileceğini sormam gerekti.",
        clear: "Sana verdiğim borç tutarını bu hafta sonuna kadar hesabıma gönderebilir misin? İhtiyacım oluştu.",
        short: "Geciken ödememi gönderebilir misin?",
      };
    }
    if (goal.includes("indirim") || goal.includes("satmak")) {
      return {
        soft: "Sunduğumuz hizmetin kalitesini korumak adına bu fiyatın altına inmemiz maalesef mümkün değil.",
        clear: "Belirttiğimiz fiyat teklifi son fiyattır. Herhangi bir indirim uygulayamıyoruz.",
        short: "Teklif ettiğimiz fiyat maalesef sondur.",
      };
    }
  }

  if (category === "flort_iliski") {
    if (goal.includes("netlik") || goal.includes("anlamak")) {
      return {
        soft: "Son zamanlarda aramızda bir mesafe hissediyorum, bunun sebebini açıkça konuşabilir miyiz?",
        clear: "İletişimimizdeki belirsizlik beni yoruyor. Aramızdakini netleştirmek istiyorum.",
        short: "İlişkimizin gidişatı hakkında ne düşünüyorsun?",
      };
    }
    if (goal.includes("mesafe") || goal.includes("bitirmek")) {
      return {
        soft: "İlişkimizin artık ikimiz için de sağlıklı yürümediğini düşünüyorum, bu yüzden mesafe koymak en doğrusu.",
        clear: "Bu ilişkiyi burada sonlandırmanın ikimiz için de daha iyi olacağına karar verdim.",
        short: "Daha fazla devam edemeyeceğimizi düşünüyorum.",
      };
    }
    return {
      soft: "Son mesajların veya tavrın konusunda hissettiklerimi paylaşmak istedim.",
      clear: "Açık ve dürüst bir iletişim kurmamız ikimiz için de çok daha sağlıklı olacaktır.",
      short: "Açıkça konuşalım mı?",
    };
  }

  if (category === "aile_arkadas") {
    if (goal.includes("hayır") || goal.includes("sınır")) {
      return {
        soft: "Seni kırmak istemem ama bu konuda sana yardımcı olamayacağım, umarım anlayışla karşılarsın.",
        clear: "Bden istediğin şeyi yapmam şu anki şartlarımda maalesef mümkün değil, hayır demek durumundayım.",
        short: "Üzgünüm ama buna evet diyemem.",
      };
    }
    return {
      soft: "Bu konudaki kararımı seninle paylaşmak ve anlayışını rica etmek istedim.",
      clear: "Kendi sınırlarımı koruyarak bu konuyu tatlıya bağlamak istiyorum.",
      short: "Kararıma saygı duyacağını umuyorum.",
    };
  }

  // Fallback
  return {
    soft: "Bu konuyu kırmadan ve yapıcı bir şekilde çözebileceğimizi umuyorum.",
    clear: "Konuyu uzatmadan net bir şekilde belirtmem gerekirse, bu durumun çözülmesini istiyorum.",
    short: "Konuşup netleştirelim.",
  };
}

export function ChatSimulation({
  simulationId,
  category,
  context,
  initialTurns,
}: ChatSimulationProps) {
  const router = useRouter();
  const [turns, setTurns] = useState<Turn[]>(initialTurns);
  const [isStarted, setIsStarted] = useState(() => initialTurns.length > 0);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedReplies>(() =>
    createStarterSuggestions(category, context),
  );
  const [optimisticUserMessage, setOptimisticUserMessage] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const answeredTurns = useMemo(
    () => turns.filter((turn) => turn.userMessage.trim().length > 0),
    [turns],
  );

  const openingMessage = context.aiOpeningMessage || context.incomingMessage;

  const messages = useMemo(() => {
    const list: Array<{ role: "ai" | "user"; content: string }> = [];

    // Only prepend the AI opening message if the other person initiates
    const otherPersonInitiated = context.initiatedBy !== "user";
    if (otherPersonInitiated && openingMessage) {
      list.push({ role: "ai", content: openingMessage });
    }

    for (const turn of answeredTurns) {
      list.push({ role: "user", content: turn.userMessage });
      list.push({ role: "ai", content: turn.aiMessage });
    }

    if (optimisticUserMessage) {
      list.push({ role: "user", content: optimisticUserMessage });
    }

    return list;
  }, [answeredTurns, openingMessage, optimisticUserMessage, context.initiatedBy]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending]);

  const latestTurn = [...answeredTurns].reverse()[0];
  const currentTurn = Math.min(answeredTurns.length + 1, 8);

  async function finish() {
    setPending(true);
    const response = await fetch(`/api/simulations/${simulationId}/finish`, {
      method: "POST",
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(data.message || "Final raporu oluşturulamadı.");
      return;
    }

    router.push(`/simulations/${simulationId}/report`);
    router.refresh();
  }

  async function send() {
    if (!input.trim() || pending) return;
    setPending(true);
    setError("");

    const message = input.trim();
    setInput("");
    setOptimisticUserMessage(message);

    try {
      const response = await fetch(`/api/simulations/${simulationId}/turn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: message }),
      });
      const data = await response.json();
      setPending(false);
      setOptimisticUserMessage(null);

      if (!response.ok) {
        setError(data.message || "Cevap kaydedilemedi.");
        setInput(message);
        return;
      }

      setTurns((previous) => [
        ...previous,
        {
          turnNumber: data.turn.turnNumber,
          userMessage: data.turn.userMessage,
          aiMessage: data.turn.aiMessage,
          feedback: data.turn.feedback,
          betterAlternative: data.turn.betterAlternative,
          scores: data.turn.scoresJson,
        },
      ]);
      setSuggestions(data.suggestedReplies);

      if (data.shouldFinish) {
        window.setTimeout(() => {
          void finish();
        }, 700);
      }
    } catch (err) {
      setPending(false);
      setOptimisticUserMessage(null);
      setError("Bağlantı hatası oluştu.");
    }
  }
  if (!isStarted) {
    const briefText = context.simulationBrief || `${context.otherPerson} ile karşı karşıyasın. Kendisi bu konuşmada "${context.otherPersonPersonality || 'belirsiz'}" bir kişilik sergileyecek. Amacın "${context.goal}" hedefine ulaşmak; sakin kalıp sınırlarını koruyarak diyalogu sürdürmelisin.`;

    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-violet-500/20 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 shadow-2xl shadow-violet-950/30">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-500/20 text-violet-300 shadow-inner">
            <Sparkles size={32} className="animate-pulse" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-violet-200 via-white to-violet-300 bg-clip-text text-transparent">
            Simülasyon Hazır!
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Konuşma provanıza başlamak üzeresiniz.
          </p>

          <div className="mt-8 w-full rounded-2xl border border-white/10 bg-slate-950/50 p-6 text-left leading-relaxed">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
               Durum & Karakter Özeti
            </h3>
            <p className="mt-3 text-sm text-slate-200">
              {briefText}
            </p>
          </div>

          <div className="mt-6 w-full grid grid-cols-2 gap-4 text-left text-sm text-slate-300">
            <div className="rounded-xl bg-white/[0.04] p-3">
              <span className="block text-xs text-slate-500">Muhatap</span>
              <span className="font-semibold text-slate-200">{context.otherPerson}</span>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-3">
              <span className="block text-xs text-slate-500">Kişilik Yapısı</span>
              <span className="font-semibold text-slate-200">{context.otherPersonPersonality || "Belirtilmemiş"}</span>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-3">
              <span className="block text-xs text-slate-500">Hedefiniz</span>
              <span className="font-semibold text-slate-200">{context.goal}</span>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-3">
              <span className="block text-xs text-slate-500">İletişim Tonu</span>
              <span className="font-semibold text-slate-200">{context.tone}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsStarted(true)}
            className="mt-8 w-full rounded-3xl bg-violet-400 py-4 font-bold text-slate-950 shadow-lg shadow-violet-950/40 transition-all hover:bg-violet-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Simülasyonu Başlat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
        <p className="text-sm font-semibold text-violet-200">Zor Mesajlar</p>
        <h1 className="mt-2 text-2xl font-bold">Prova turu</h1>
        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
          <p>
            <span className="text-slate-500">Karşı taraf:</span> {context.otherPerson}
            {context.otherPersonPersonality && (
              <span className="inline-block rounded-full bg-violet-500/15 border border-violet-500/20 px-2.5 py-0.5 text-[11px] text-violet-300 ml-2 font-bold align-middle">
                {context.otherPersonPersonality}
              </span>
            )}
          </p>
          <p>
            <span className="text-slate-500">Amaç:</span> {context.goal}
          </p>
          <p>
            <span className="text-slate-500">Ton:</span> {context.tone}
          </p>
          <p>
            <span className="text-slate-500">Çekince:</span> {context.fear}
          </p>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-950/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {context.initiatedBy === "user" ? "Durum / Konu" : "Durum / Gelen Mesaj"}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-200">{context.incomingMessage}</p>
        </div>

        {suggestions && (
          <div className="mt-6 rounded-3xl border border-violet-300/20 bg-violet-400/10 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-100">
              <Sparkles size={16} /> Bunu yazabilirsin
            </div>
            <div className="space-y-2">
              {Object.entries(suggestions).map(([key, value]) => (
                <button
                  key={key}
                  className="w-full rounded-2xl bg-white/10 px-3 py-3 text-left text-sm leading-6 text-slate-100 transition hover:bg-white/15"
                  onClick={() => setInput(value)}
                  type="button"
                >
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-violet-200">
                    {key === "soft" ? "Yumuşak" : key === "clear" ? "Net" : "Kısa / esprili"}
                  </span>
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}

        {latestTurn && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
            <p className="mb-4 text-sm font-semibold text-white">Son tur değerlendirmesi</p>
            <div className="grid gap-3">
              {Object.entries(latestTurn.scores).map(([label, value]) => (
                <ScoreBar key={label} label={label} value={value} />
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">{latestTurn.feedback}</p>
            <p className="mt-3 rounded-2xl bg-violet-400/10 p-3 text-sm leading-6 text-violet-100">
              {latestTurn.betterAlternative}
            </p>
          </div>
        )}
      </aside>

      <section className="flex h-[680px] flex-col rounded-[2rem] border border-white/10 bg-slate-950/75 shadow-2xl shadow-violet-950/30">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-sm text-slate-400">Tur {currentTurn} / 8</p>
            <h2 className="font-semibold text-white">Karşı taraf simülasyonu</h2>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-50"
            onClick={() => void finish()}
            disabled={pending || answeredTurns.length === 0}
            type="button"
          >
            <SquareCheckBig size={16} /> Bitir
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {context.initiatedBy === "user" && answeredTurns.length === 0 && (
            <div className="mb-4 rounded-2xl border border-violet-400/30 bg-violet-500/10 p-4 text-sm leading-6 text-violet-100 shadow-lg shadow-violet-950/20">
              <span className="font-bold flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-violet-300 animate-pulse" /> 
                İlk mesajını yaz ve simülasyona başlayalım!
              </span>
              Karşı tarafın durumuna veya canlandırmak istediğin diyaloğa göre ilk sözünü aşağıdaki yazma alanına girerek veya sol taraftaki hazır önerilerden birine tıklayarak simülasyonu başlatabilirsin.
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-[1.35rem] px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-violet-300 text-slate-950"
                    : "bg-white/[0.08] text-slate-100"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {pending && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-[1.35rem] bg-white/[0.08] px-4 py-3 text-sm leading-6 text-slate-100">
                Karşı taraf cevabını düşünüyor...
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-4">
          {error && (
            <div className="mb-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <textarea
              className="min-h-16 flex-1 resize-none rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-6 outline-none ring-violet-400 focus:ring-2"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Cevabını prova et..."
              disabled={pending}
            />
            <button
              className="grid h-16 w-16 place-items-center rounded-3xl bg-violet-300 text-slate-950 disabled:opacity-60"
              onClick={() => void send()}
              disabled={pending || !input.trim()}
              type="button"
              title="Gönder"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
