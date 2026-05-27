"use client";

import { Send, Sparkles, SquareCheckBig } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
  context: MessageContext;
  initialTurns: Turn[];
};

function createStarterSuggestions(context: MessageContext): SuggestedReplies {
  const goal = context.goal.toLocaleLowerCase("tr-TR");
  const tone = context.tone.toLocaleLowerCase("tr-TR");
  const wantsLightTone = tone.includes("espri") || tone.includes("rahat") || tone.includes("samimi");
  const isDecline =
    goal.includes("redd") ||
    goal.includes("hayır") ||
    goal.includes("istem") ||
    context.difficultyReason.toLocaleLowerCase("tr-TR").includes("kır");

  if (isDecline) {
    return {
      soft:
        "Çok isterdim ama bugün gerçekten dinlenmeye ihtiyacım var. Başka bir güne ayarlayalım mı?",
      clear:
        "Bugün gelemeyeceğim, bunu net söyleyeyim. Uygun olduğum bir zamanı ben sana yazayım.",
      short: wantsLightTone
        ? "Bugün pilim kırmızıda, kahveyi başka güne alalım mı?"
        : "Bugün gelemeyeceğim, başka bir zamana bırakalım.",
    };
  }

  return {
    soft:
      "Bunu önemsediğim için hızlı cevap vermek istemedim. Sakin ve doğru ifade etmek istiyorum.",
    clear:
      "Konuyu uzatmadan net söyleyeyim: Benim için önemli olan şey yanlış anlaşılmadan anlaşılmak.",
    short: wantsLightTone
      ? "Bunu düzgün söylemek istiyorum, kelimeleri biraz özenle seçiyorum."
      : "Net ama kırmadan anlatmak istiyorum.",
  };
}

export function ChatSimulation({
  simulationId,
  context,
  initialTurns,
}: ChatSimulationProps) {
  const router = useRouter();
  const [turns, setTurns] = useState<Turn[]>(initialTurns);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedReplies>(() =>
    createStarterSuggestions(context),
  );

  const answeredTurns = useMemo(
    () => turns.filter((turn) => turn.userMessage.trim().length > 0),
    [turns],
  );

  const messages = useMemo(() => {
    const list: Array<{ role: "ai" | "user"; content: string }> = [
      { role: "ai", content: context.incomingMessage },
    ];

    for (const turn of answeredTurns) {
      list.push({ role: "user", content: turn.userMessage });
      list.push({ role: "ai", content: turn.aiMessage });
    }

    return list;
  }, [answeredTurns, context.incomingMessage]);

  const latestTurn = [...answeredTurns].reverse()[0];
  const currentTurn = Math.min(answeredTurns.length + 1, 5);

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
    const response = await fetch(`/api/simulations/${simulationId}/turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage: message }),
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(data.message || "Cevap kaydedilemedi.");
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
    setInput("");

    if (data.shouldFinish) {
      window.setTimeout(() => {
        void finish();
      }, 700);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5">
        <p className="text-sm font-semibold text-violet-200">Zor Mesajlar</p>
        <h1 className="mt-2 text-2xl font-bold">Prova turu</h1>
        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
          <p>
            <span className="text-slate-500">Karşı taraf:</span> {context.otherPerson}
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
            Gelen mesaj
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

      <section className="flex min-h-[680px] flex-col rounded-[2rem] border border-white/10 bg-slate-950/75 shadow-2xl shadow-violet-950/30">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-sm text-slate-400">Tur {currentTurn} / 5</p>
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

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
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
