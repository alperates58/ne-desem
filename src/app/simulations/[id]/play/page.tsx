import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ChatSimulation } from "@/components/chat-simulation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { MessageContext, Scores } from "@/lib/types";

type PlayPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlayPage({ params }: PlayPageProps) {
  const user = await requireUser();
  const { id } = await params;
  const simulation = await prisma.simulation.findFirst({
    where: { id, userId: user.id },
    include: { turns: { orderBy: { turnNumber: "asc" } } },
  });

  if (!simulation) {
    redirect("/dashboard");
  }

  if (simulation.status !== "in_progress") {
    redirect(`/simulations/${simulation.id}/report`);
  }

  const context = simulation.contextJson as unknown as MessageContext;

  return (
    <AppShell user={user}>
      <ChatSimulation
        simulationId={simulation.id}
        context={context}
        initialTurns={simulation.turns.map((turn) => ({
          turnNumber: turn.turnNumber,
          userMessage: turn.userMessage,
          aiMessage: turn.aiMessage,
          feedback: turn.feedback,
          betterAlternative: turn.betterAlternative,
          scores: turn.scoresJson as Scores,
        }))}
      />
    </AppShell>
  );
}
