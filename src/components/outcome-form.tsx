"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function OutcomeForm({ simulationId }: { simulationId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/simulations/${simulationId}/outcome`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        whatHappened: String(form.get("whatHappened") || ""),
        otherPersonReaction: String(form.get("otherPersonReaction") || ""),
        goalResult: String(form.get("goalResult") || "kismen"),
        satisfactionScore: Number(form.get("satisfactionScore") || 3),
        nextGoal: String(form.get("nextGoal") || ""),
      }),
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(data.message || "Sonuç kaydedilemedi.");
      return;
    }

    router.push(`/simulations/${simulationId}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-violet-950/30"
    >
      <div className="mb-6">
        <p className="text-sm font-semibold text-violet-200">Gerçek hayat sonucu</p>
        <h1 className="mt-2 text-3xl font-bold">Gerçekte ne oldu?</h1>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="text-sm text-slate-300">Gerçekte ne oldu?</span>
          <textarea
            className="mt-2 min-h-32 w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none ring-violet-400 focus:ring-2"
            name="whatHappened"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Karşı taraf nasıl tepki verdi?</span>
          <textarea
            className="mt-2 min-h-24 w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none ring-violet-400 focus:ring-2"
            name="otherPersonReaction"
            required
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-300">Hedefine ulaştın mı?</span>
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-violet-400 focus:ring-2"
              name="goalResult"
              defaultValue="kismen"
            >
              <option value="evet">Evet</option>
              <option value="kismen">Kısmen</option>
              <option value="hayir">Hayır</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Memnuniyet</span>
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-violet-400 focus:ring-2"
              name="satisfactionScore"
              defaultValue="3"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-sm text-slate-300">Bir sonraki adımda ne yapmak istiyorsun?</span>
          <textarea
            className="mt-2 min-h-24 w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none ring-violet-400 focus:ring-2"
            name="nextGoal"
            required
          />
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-rose-200">{error}</p>}

      <button
        className="mt-6 w-full rounded-2xl bg-violet-300 px-5 py-3 font-semibold text-slate-950 disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Öneri hazırlanıyor..." : "Sonucu kaydet ve ek öneri al"}
      </button>
    </form>
  );
}
