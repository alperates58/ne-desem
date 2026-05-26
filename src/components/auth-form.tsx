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
