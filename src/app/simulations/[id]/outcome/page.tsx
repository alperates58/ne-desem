import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { OutcomeForm } from "@/components/outcome-form";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type OutcomePageProps = {
  params: Promise<{ id: string }>;
};

export default async function OutcomePage({ params }: OutcomePageProps) {
  const user = await requireUser();
  const { id } = await params;
  const simulation = await prisma.simulation.findFirst({
    where: { id, userId: user.id },
  });

  if (!simulation) {
    redirect("/dashboard");
  }

  return (
    <AppShell user={user}>
      <OutcomeForm simulationId={simulation.id} />
    </AppShell>
  );
}
