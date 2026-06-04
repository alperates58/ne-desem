import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getOutcomeAdvice } from "@/lib/ai";
import { jsonError, parseError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import type { MessageContext } from "@/lib/types";
import { outcomeSchema } from "@/lib/validators";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return jsonError("Giriş yapman gerekiyor.", 401);
    }

    const { id } = await context.params;
    const input = outcomeSchema.parse(await request.json());
    const simulation = await prisma.simulation.findFirst({
      where: { id, userId: user.id },
    });

    if (!simulation) {
      return jsonError("Simülasyon bulunamadı.", 404);
    }

    const advice = await getOutcomeAdvice(
      simulation.category,
      simulation.contextJson as unknown as MessageContext,
      input,
    );

    const outcome = await prisma.simulationOutcome.upsert({
      where: { simulationId: simulation.id },
      create: {
        simulationId: simulation.id,
        whatHappened: input.whatHappened,
        otherPersonReaction: input.otherPersonReaction,
        goalResult: input.goalResult,
        satisfactionScore: input.satisfactionScore,
        nextGoal: input.nextGoal,
        aiFollowupAdviceJson: advice,
      },
      update: {
        whatHappened: input.whatHappened,
        otherPersonReaction: input.otherPersonReaction,
        goalResult: input.goalResult,
        satisfactionScore: input.satisfactionScore,
        nextGoal: input.nextGoal,
        aiFollowupAdviceJson: advice,
      },
    });

    await prisma.simulation.update({
      where: { id: simulation.id },
      data: { status: "outcome_added" },
    });

    return NextResponse.json({ outcome, advice });
  } catch (error) {
    return jsonError(parseError(error));
  }
}
