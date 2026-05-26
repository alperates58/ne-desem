import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getOutcomeAdvice } from "@/lib/ai";
import { jsonError, parseError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import type { MessageContext, OutcomeInput } from "@/lib/types";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return jsonError("Giriş yapman gerekiyor.", 401);
    }

    const { id } = await context.params;
    const simulation = await prisma.simulation.findFirst({
      where: { id, userId: user.id },
      include: { outcome: true },
    });

    if (!simulation || !simulation.outcome) {
      return jsonError("Sonuç kaydı bulunamadı.", 404);
    }

    const outcomeInput: OutcomeInput = {
      whatHappened: simulation.outcome.whatHappened,
      otherPersonReaction: simulation.outcome.otherPersonReaction,
      goalResult: simulation.outcome.goalResult as OutcomeInput["goalResult"],
      satisfactionScore: simulation.outcome.satisfactionScore,
      nextGoal: simulation.outcome.nextGoal,
    };
    const advice = await getOutcomeAdvice(
      simulation.contextJson as unknown as MessageContext,
      outcomeInput,
    );

    const outcome = await prisma.simulationOutcome.update({
      where: { simulationId: simulation.id },
      data: { aiFollowupAdviceJson: advice },
    });

    return NextResponse.json({ outcome, advice });
  } catch (error) {
    return jsonError(parseError(error));
  }
}
