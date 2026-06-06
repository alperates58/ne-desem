import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminSimulationsList } from "@/components/admin-simulations-list";

export const dynamic = "force-dynamic";

export default async function AdminSimulationsPage() {
  await requireAdmin();

  const simulations = await prisma.simulation.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      turns: {
        orderBy: {
          turnNumber: "asc",
        },
      },
      outcome: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Map database data safely for client rendering
  const mappedSimulations = simulations.map((sim) => ({
    id: sim.id,
    userId: sim.userId,
    userName: sim.user.name,
    userEmail: sim.user.email,
    category: sim.category,
    scenario: sim.scenario,
    title: sim.title,
    contextJson: sim.contextJson,
    status: sim.status,
    totalScore: sim.totalScore,
    finalReportJson: sim.finalReportJson,
    createdAt: sim.createdAt.toISOString(),
    completedAt: sim.completedAt ? sim.completedAt.toISOString() : null,
    turns: sim.turns.map((turn) => ({
      id: turn.id,
      turnNumber: turn.turnNumber,
      aiMessage: turn.aiMessage,
      userMessage: turn.userMessage,
      scoresJson: turn.scoresJson,
      feedback: turn.feedback,
      betterAlternative: turn.betterAlternative,
      createdAt: turn.createdAt.toISOString(),
    })),
    outcome: sim.outcome
      ? {
          id: sim.outcome.id,
          whatHappened: sim.outcome.whatHappened,
          otherPersonReaction: sim.outcome.otherPersonReaction,
          goalResult: sim.outcome.goalResult,
          satisfactionScore: sim.outcome.satisfactionScore,
          nextGoal: sim.outcome.nextGoal,
          aiFollowupAdviceJson: sim.outcome.aiFollowupAdviceJson,
          createdAt: sim.outcome.createdAt.toISOString(),
        }
      : null,
  }));

  return <AdminSimulationsList initialSimulations={mappedSimulations} />;
}
