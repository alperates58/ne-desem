"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Lightbulb, MessageCircle, Trophy, Sparkles, ShieldCheck } from "lucide-react";

const scores = [
  { label: "Netlik", value: 82, color: "from-violet-400 to-violet-300", glow: "rgba(167,139,250,0.35)" },
  { label: "Empati", value: 76, color: "from-indigo-400 to-violet-400", glow: "rgba(129,140,248,0.35)" },
  { label: "Sınır koyma", value: 88, color: "from-violet-300 to-indigo-300", glow: "rgba(196,181,253,0.35)" },
];

const feedback = [
  {
    icon: CheckCircle2,
    color: "text-emerald-400",
    borderColor: "border-emerald-500/15",
    bg: "bg-emerald-500/[0.07]",
    label: "Güçlü yön",
    text: "Sakin ve yapıcı bir ton yakaladın.",
  },
  {
    icon: AlertTriangle,
    color: "text-amber-400",
    borderColor: "border-amber-500/15",
    bg: "bg-amber-500/[0.07]",
    label: "Dikkat et",
    text: "Hafif savunmacı bir ifade riski var.",
  },
  {
    icon: Lightbulb,
    color: "text-violet-300",
    borderColor: "border-violet-400/15",
    bg: "bg-violet-500/[0.07]",
    label: "Öneri",
    text: "\"Ben\" dili kullanmayı dene.",
  },
];

const features = [
  { title: "Gerçekçi tepkiler", icon: MessageCircle },
  { title: "Cevap skoru", icon: Trophy },
  { title: "Alternatif cümleler", icon: Sparkles },
  { title: "Geçmiş kayıtlar", icon: ShieldCheck },
];

export function ProductPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Ambient glow behind card */}
      <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 left-1/4 right-1/4 h-20 rounded-full bg-indigo-600/15 blur-2xl" />

      {/* Outer glass shell */}
      <div className="relative rounded-[2rem] border border-white/[0.09] bg-white/[0.035] p-4 shadow-2xl shadow-violet-950/60 backdrop-blur-2xl">

        {/* Main chat card */}
        <div className="rounded-[1.6rem] border border-white/[0.07] bg-slate-950/75 p-5 backdrop-blur-sm">

          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-sm font-semibold text-violet-200">Mini prova</span>
              <span className="text-xs text-slate-600">· Tur 2 / 8</span>
            </div>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
              AI motoru hazır
            </span>
          </div>

          {/* Conversation */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="max-w-[78%] rounded-[1.25rem] rounded-tl-md border border-white/[0.07] bg-white/[0.06] px-4 py-3 text-sm leading-relaxed text-slate-200 shadow-sm"
            >
              Bunu şimdi söylemen biraz ani olmadı mı?
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="ml-auto max-w-[78%] rounded-[1.25rem] rounded-tr-md bg-gradient-to-br from-violet-300 to-violet-400 px-4 py-3 text-sm leading-relaxed text-slate-950 shadow-lg shadow-violet-500/20"
            >
              Haklısın, ani görünmüş olabilir. Sadece yanlış anlaşılmadan sakin şekilde anlatmak istedim.
            </motion.div>
          </div>

          {/* Score bars */}
          <div className="mt-5 space-y-3">
            {scores.map((score, i) => (
              <div key={score.label}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-slate-500">{score.label}</span>
                  <span className="font-semibold tabular-nums text-slate-300">{score.value}</span>
                </div>
                <div className="h-[5px] overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className={`h-[5px] rounded-full bg-gradient-to-r ${score.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score.value}%` }}
                    transition={{ duration: 1, delay: 0.8 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    style={{ boxShadow: `0 0 10px ${score.glow}` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Feedback cards */}
          <div className="mt-4 space-y-2">
            {feedback.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15 + i * 0.1, duration: 0.4 }}
                className={`flex items-start gap-3 rounded-xl border ${item.borderColor} ${item.bg} px-3.5 py-2.5`}
              >
                <item.icon size={13} className={`mt-0.5 shrink-0 ${item.color}`} />
                <div className="min-w-0">
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${item.color}`}>{item.label}</span>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature grid */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.45 + i * 0.07, duration: 0.35 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3.5 transition-all duration-200 hover:border-violet-500/20 hover:bg-white/[0.06]"
            >
              <feature.icon
                className="mb-2 text-violet-400 transition-all duration-200 group-hover:text-violet-300 group-hover:scale-110"
                size={18}
              />
              <p className="text-xs font-semibold text-slate-300">{feature.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
