import { AppShell } from "@/components/app-shell";
import { ProfileForm } from "@/components/profile-form";
import { requireUser } from "@/lib/auth";
import { getUserRemainingLimits } from "@/lib/limits";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();
  const limits = await getUserRemainingLimits(user.id);

  // Cast user data to a standard format for safety
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
      <ProfileForm user={userData} limits={limits} />
    </AppShell>
  );
}
