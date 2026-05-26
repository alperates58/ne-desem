"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-60"
      onClick={logout}
      disabled={pending}
      title="Çıkış yap"
      type="button"
    >
      <LogOut size={18} />
    </button>
  );
}
