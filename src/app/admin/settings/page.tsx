import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminSettingsForm } from "@/components/admin-settings-form";
import { getAiMode } from "@/lib/ai";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await requireAdmin();

  // Count existing tiers to see if seed is needed
  const tierCount = await prisma.membershipTier.count();

  // Evaluate config flags
  const systemStatus = {
    aiMode: getAiMode(),
    deepseekModel: process.env.DEEPSEEK_MODEL || "Not specified",
    googleClientId: process.env.GOOGLE_CLIENT_ID ? "Configured" : "Missing",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? "Configured" : "Missing",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    tierCount,
  };

  return <AdminSettingsForm systemStatus={systemStatus} />;
}
