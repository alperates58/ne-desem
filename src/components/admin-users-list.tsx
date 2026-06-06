"use client";

import { useState } from "react";
import { Search, Save, User, Check, AlertCircle } from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  customSimulationCredits: number;
  membershipTierId: string | null;
  membershipTier: {
    id: string;
    name: string;
    monthlyLimit: number;
  } | null;
  createdAt: string;
};

type Tier = {
  id: string;
  name: string;
  price: number;
  monthlyLimit: number;
};

type AdminUsersListProps = {
  initialUsers: UserData[];
  tiers: Tier[];
};

export function AdminUsersList({ initialUsers, tiers }: AdminUsersListProps) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [pendingUserIds, setPendingUserIds] = useState<Record<string, boolean>>({});
  const [updatedUserIds, setUpdatedUserIds] = useState<Record<string, boolean>>({});
  
  // Track local edits per user
  const [edits, setEdits] = useState<Record<string, Partial<UserData>>>({});

  // Filter users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleEditChange(userId: string, field: keyof UserData, value: any) {
    setEdits((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  }

  async function handleUpdate(userId: string) {
    const userEdits = edits[userId];
    if (!userEdits) return;

    setPendingUserIds((prev) => ({ ...prev, [userId]: true }));

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          ...userEdits,
        }),
      });

      const data = await res.json();
      setPendingUserIds((prev) => ({ ...prev, [userId]: false }));

      if (!res.ok) {
        alert(data.message || "Kullanıcı güncellenemedi.");
        return;
      }

      // Merge backend updates back into state
      setUsers(
        users.map((u) =>
          u.id === userId
            ? {
                ...u,
                role: data.user.role,
                customSimulationCredits: data.user.customSimulationCredits,
                membershipTierId: data.user.membershipTierId,
                membershipTier: data.user.membershipTier
                  ? {
                      id: data.user.membershipTier.id,
                      name: data.user.membershipTier.name,
                      monthlyLimit: data.user.membershipTier.monthlyLimit,
                    }
                  : null,
              }
            : u
        )
      );

      // Clear local edits for this user
      setEdits((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });

      // Show temporary checkmark indicator
      setUpdatedUserIds((prev) => ({ ...prev, [userId]: true }));
      setTimeout(() => {
        setUpdatedUserIds((prev) => ({ ...prev, [userId]: false }));
      }, 3000);
    } catch (err) {
      setPendingUserIds((prev) => ({ ...prev, [userId]: false }));
      alert("Bağlantı hatası oluştu.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Kullanıcı Yönetimi</h1>
        <p className="text-sm text-slate-400">Kullanıcıların yetki, üyelik ve haklarını yönetin</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="İsim veya e-posta ile ara..."
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 pl-11 pr-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-400"
        />
      </div>

      {/* Users List Table */}
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm text-slate-300">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Kullanıcı</th>
                <th className="px-6 py-4">Kayıt Tarihi</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Üyelik Planı</th>
                <th className="px-6 py-4">Ekstra Hak</th>
                <th className="px-6 py-4 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">
                    Aranan kriterlere uygun kullanıcı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userEdit = edits[user.id] || {};
                  const activeRole = userEdit.role !== undefined ? userEdit.role : user.role;
                  const activeTierId =
                    userEdit.membershipTierId !== undefined ? userEdit.membershipTierId : user.membershipTierId;
                  const activeCredits =
                    userEdit.customSimulationCredits !== undefined
                      ? userEdit.customSimulationCredits
                      : user.customSimulationCredits;

                  const isDirty =
                    userEdit.role !== undefined ||
                    userEdit.membershipTierId !== undefined ||
                    userEdit.customSimulationCredits !== undefined;

                  const isPending = pendingUserIds[user.id];
                  const isUpdated = updatedUserIds[user.id];

                  return (
                    <tr key={user.id} className="hover:bg-white/[0.01] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-300 border border-violet-500/20">
                            {user.name[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="block font-bold text-white leading-5">{user.name}</span>
                            <span className="block text-xs text-slate-400">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={activeRole}
                          onChange={(e) => handleEditChange(user.id, "role", e.target.value)}
                          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-violet-400"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={activeTierId || "null"}
                          onChange={(e) => handleEditChange(user.id, "membershipTierId", e.target.value)}
                          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-violet-400"
                        >
                          <option value="null">Free (Varsayılan)</option>
                          {tiers.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={activeCredits}
                          onChange={(e) =>
                            handleEditChange(
                              user.id,
                              "customSimulationCredits",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-16 rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-center text-white outline-none focus:ring-1 focus:ring-violet-400"
                          min={0}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isDirty ? (
                          <button
                            onClick={() => handleUpdate(user.id)}
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-300 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-violet-200 disabled:opacity-60 transition"
                          >
                            <Save size={12} />
                            {isPending ? "..." : "Güncelle"}
                          </button>
                        ) : isUpdated ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                            <Check size={12} /> OK
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
