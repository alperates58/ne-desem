"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Flame, Trophy, Target, TrendingUp, Star, Brain } from "lucide-react";

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    const controls = animate(mv, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.25 + delay,
    });
    return () => { controls.stop(); unsub(); };
  }, [value, delay]);

  return <span>{display}</span>;
}

type StatItem = {
  label: string;
  value: number | string;
  suffix?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  isText?: boolean;
};

export function DashboardStats({
  userName,
  total,
  completed,
  average,
  streak,
  successRate,
  strongestSkill,
}: {
  userName: string;
  total: number;
  completed: number;
  average: number;
  streak: number;
  successRate: number;
  strongestSkill: string;
}) {
  const stats: StatItem[] = [
    {
      label: "Toplam Prova",
      value: total,
      icon: Target,
      iconColor: "text-violet-300",
      iconBg: "bg-violet-500/10",
    },
    {
      label: "Tamamlanan",
      value: completed,
      icon: Trophy,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
    },
    {
      label: "Ort. Skor",
      value: average,
      suffix: average > 0 ? "/100" : "",
      icon: Star,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10",
    },
    {
      label: "Başarı Oranı",
      value: successRate,
      suffix: successRate > 0 ? "%" : "",
      icon: TrendingUp,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10",
    },
    {
      label: "Günlük Seri",
      value: streak,
      suffix: streak > 0 ? " gün" : "",
      icon: Flame,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-500/10",
    },
    {
      label: "Güçlü Alan",
      value: strongestSkill || "—",
      icon: Brain,
      iconColor: "text-pink-400",
      iconBg: "bg-pink-500/10",
      isText: true,
    },
  ];

  const firstName = userName?.split(" ")[0] || userName;

  return (
    <div className="mb-10">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-7"
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-300">
              Merhaba, {firstName} 👋
            </p>
            <h1 className="mt-1.5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Bugün hangi konuşmayı prova etmek istiyorsun?
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.07]"
          >
            <div className={`mb-3 inline-flex rounded-xl p-2 ${stat.iconBg}`}>
              <stat.icon size={14} className={stat.iconColor} />
            </div>
            <div className="text-[1.6rem] font-black leading-none text-white">
              {stat.isText ? (
                <span className="text-base font-bold">{stat.value}</span>
              ) : (
                <>
                  {typeof stat.value === "number" && stat.value > 0 ? (
                    <AnimatedNumber value={stat.value as number} delay={i * 0.06} />
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                  {stat.suffix && typeof stat.value === "number" && stat.value > 0 && (
                    <span className="ml-0.5 text-xs font-semibold text-slate-500">{stat.suffix}</span>
                  )}
                </>
              )}
            </div>
            <p className="mt-1.5 text-[11px] font-semibold text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
