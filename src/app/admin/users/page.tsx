import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminUsersList } from "@/components/admin-users-list";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();

  const [users, tiers] = await Promise.all([
    prisma.user.findMany({
      include: { membershipTier: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.membershipTier.findMany({
      orderBy: { price: "asc" },
    }),
  ]);

  // Safe mapping of data to prevent serialization issues
  const usersData = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    customSimulationCredits: u.customSimulationCredits,
    membershipTierId: u.membershipTierId,
    membershipTier: u.membershipTier
      ? {
          id: u.membershipTier.id,
          name: u.membershipTier.name,
          monthlyLimit: u.membershipTier.monthlyLimit,
        }
      : null,
    createdAt: u.createdAt.toISOString(),
  }));

  const tiersData = tiers.map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    monthlyLimit: t.monthlyLimit,
  }));

  return <AdminUsersList initialUsers={usersData} tiers={tiersData} />;
}
