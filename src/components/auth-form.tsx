"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const body =
      mode === "register"
        ? {
            name: String(form.get("name") || ""),
            email: String(form.get("email") || ""),
            password: String(form.get("password") || ""),
          }
        : {
            email: String(form.get("email") || ""),
            password: String(form.get("password") || ""),
          };

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setError(data.message || "Bir şey ters gitti.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-violet-950/30 backdrop-blur"
    >
      <div className="mb-6">
        <p className="text-sm font-medium text-violet-200">
          {mode === "register" ? "Yeni prova profili" : "Tekrar hoş geldin"}
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          {mode === "register" ? "Kayıt ol" : "Giriş yap"}
        </h1>
      </div>

      <div className="space-y-4">
        {mode === "register" && (
          <label className="block">
            <span className="text-sm text-slate-300">Ad</span>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none ring-violet-400 focus:ring-2"
              name="name"
              required
              minLength={2}
              placeholder="Adın"
            />
          </label>
        )}
        <label className="block">
          <span className="text-sm text-slate-300">E-posta</span>
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none ring-violet-400 focus:ring-2"
            name="email"
            type="email"
            required
            placeholder="sen@ornek.com"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Şifre</span>
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none ring-violet-400 focus:ring-2"
            name="password"
            type="password"
            required
            minLength={mode === "register" ? 8 : 1}
            placeholder={mode === "register" ? "En az 8 karakter" : "Şifren"}
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      )}

      <button
        className="mt-6 w-full rounded-2xl bg-violet-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "İşleniyor..." : mode === "register" ? "Kayıt ol" : "Giriş yap"}
      </button>

      {/* Or Separator */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <hr className="w-full border-t border-white/10" />
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">veya</span>
        <hr className="w-full border-t border-white/10" />
      </div>

      {/* Google Button */}
      <a
        href="/api/auth/google"
        className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#ea4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
          <path
            fill="#4285f4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#fbbc05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#34a853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
        </svg>
        Google ile {mode === "register" ? "Kayıt Ol" : "Giriş Yap"}
      </a>

      <p className="mt-5 text-center text-sm text-slate-400">
        {mode === "register" ? "Zaten hesabın var mı?" : "Hesabın yok mu?"}{" "}
        <Link
          href={mode === "register" ? "/login" : "/register"}
          className="font-semibold text-violet-200 hover:text-white"
        >
          {mode === "register" ? "Giriş yap" : "Kayıt ol"}
        </Link>
      </p>
    </form>
  );
}
