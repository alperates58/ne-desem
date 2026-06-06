import { prisma } from "@/lib/prisma";

export async function getUserRemainingLimits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { membershipTier: true },
  });

  if (!user) {
    return {
      remaining: 0,
      limit: 0,
      count: 0,
      custom: 0,
      tierName: "Yok",
    };
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const count = await prisma.simulation.count({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth,
      },
    },
  });

  const tierLimit = user.membershipTier?.monthlyLimit ?? 5;
  const custom = user.customSimulationCredits ?? 0;
  const totalLimit = tierLimit + custom;
  const remaining = Math.max(0, totalLimit - count);

  return {
    remaining,
    limit: tierLimit,
    count,
    custom,
    tierName: user.membershipTier?.name ?? "Free (Varsayılan)",
  };
}
