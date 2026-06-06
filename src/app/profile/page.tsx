import { AppShell } from "@/components/app-shell";
import { ProfileView } from "@/components/profile-view";
import { requireUser } from "@/lib/auth";
import { getUserRemainingLimits } from "@/lib/limits";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ProfileProps = {
  searchParams?: Promise<{ tab?: string; filter?: string; search?: string }>;
};

export default async function ProfilePage({ searchParams }: ProfileProps) {
  const user = await requireUser();
  const limits = await getUserRemainingLimits(user.id);
  const params = (await searchParams) || {};
  const activeTab = params.tab || "info";
  const filter = params.filter || "all";
  const search = params.search?.trim() || "";

  // Query matching simulations for the user
  const simulations = await prisma.simulation.findMany({
    where: {
      userId: user.id,
      ...(filter === "favorites" ? { isFavorite: true } : {}),
      ...(filter !== "all" && filter !== "favorites" ? { status: filter as never } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { scenario: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio || "",
    isPublic: user.isPublic,
    socialLinks: (user.socialLinksJson as Record<string, string>) || {},
  };

  return (
    <AppShell user={user}>
      <ProfileView
        user={userData}
        limits={limits}
        simulations={simulations}
        defaultTab={activeTab}
        initialFilter={filter}
        initialSearch={search}
      />
    </AppShell>
  );
}
