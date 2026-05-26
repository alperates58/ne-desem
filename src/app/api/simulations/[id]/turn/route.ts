import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getTurnResponse } from "@/lib/ai";
import { jsonError, parseError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import type { MessageContext } from "@/lib/types";
import { turnSchema } from "@/lib/validators";

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
    const input = turnSchema.parse(await request.json());
    const simulation = await prisma.simulation.findFirst({
      where: { id, userId: user.id },
      include: { turns: true },
    });

    if (!simulation) {
      return jsonError("Simülasyon bulunamadı.", 404);
    }

    if (simulation.status !== "in_progress") {
      return jsonError("Bu simülasyon tamamlanmış.", 409);
    }

    const turnNumber = simulation.turns.length + 1;
    const ai = await getTurnResponse(
      simulation.contextJson as unknown as MessageContext,
      input.userMessage,
      turnNumber,
    );

    const turn = await prisma.simulationTurn.create({
      data: {
        simulationId: simulation.id,
        turnNumber,
        aiMessage: ai.ai_message,
        userMessage: input.userMessage,
        scoresJson: ai.scores,
        feedback: ai.feedback,
        betterAlternative: ai.better_alternative,
      },
    });

    return NextResponse.json({
      turn,
      suggestedReplies: ai.suggested_replies,
      shouldFinish: turnNumber >= 5,
    });
  } catch (error) {
    return jsonError(parseError(error));
  }
}
