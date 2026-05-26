import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/logout-button";

type AppShellProps = {
  children: ReactNode;
  user?: { name: string; email: string } | null;
};

export function AppShell({ children, user }: AppShellProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#4c1d95_0,#1e1b4b_28%,#020617_62%)]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-violet-500 text-sm font-black text-white shadow-lg shadow-violet-500/30">
              ND
            </span>
            <span className="font-semibold tracking-tight">Ne Desem?</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm text-slate-300">
            {user ? (
              <>
                <Link className="rounded-full px-3 py-2 hover:bg-white/10" href="/dashboard">
                  Dashboard
                </Link>
                <span className="hidden text-slate-500 sm:inline">{user.name}</span>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link className="rounded-full px-3 py-2 hover:bg-white/10" href="/login">
                  Giriş Yap
                </Link>
                <Link
                  className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950 hover:bg-violet-100"
                  href="/register"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto min-h-[calc(100vh-73px)] w-full max-w-6xl px-4 py-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
