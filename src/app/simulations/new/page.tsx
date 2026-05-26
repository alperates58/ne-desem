import { AppShell } from "@/components/app-shell";
import { ContextWizard } from "@/components/context-wizard";
import { requireUser } from "@/lib/auth";

export default async function NewSimulationPage() {
  const user = await requireUser();

  return (
    <AppShell user={user}>
      <ContextWizard />
    </AppShell>
  );
}
