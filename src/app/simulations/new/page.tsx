import { AppShell } from "@/components/app-shell";
import { ContextWizard } from "@/components/context-wizard";
import { requireUser } from "@/lib/auth";

export default async function NewSimulationPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string; personality?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;

  return (
    <AppShell user={user}>
      <ContextWizard templateId={params.template} initialPersonality={params.personality} />
    </AppShell>
  );
}
