import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminTiersList } from "@/components/admin-tiers-list";

export const dynamic = "force-dynamic";

export default async function AdminTiersPage() {
  await requireAdmin();
  const tiers = await prisma.membershipTier.findMany({
    orderBy: { price: "asc" },
  });

  // Safe mapping of tier objects
  const tiersData = tiers.map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    monthlyLimit: t.monthlyLimit,
  }));

  return <AdminTiersList initialTiers={tiersData} />;
}
