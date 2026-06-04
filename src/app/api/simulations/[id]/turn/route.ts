import { NextResponse } from "next/server";
import { getTurnResponse } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";
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
      include: { turns: { orderBy: { turnNumber: "asc" } } },
    });

    if (!simulation) {
      return jsonError("Simülasyon bulunamadı.", 404);
    }

    if (simulation.status !== "in_progress") {
      return jsonError("Bu simülasyon tamamlanmış.", 409);
    }

    const messageContext = simulation.contextJson as unknown as MessageContext;
    const answeredTurns = simulation.turns.filter((turn) => turn.userMessage.trim().length > 0);
    const userTurnNumber = answeredTurns.length + 1;
    const storageTurnNumber = simulation.turns.length + 1;
    const conversation = [
      { role: "ai" as const, content: messageContext.incomingMessage },
      ...answeredTurns.flatMap((turn) => [
        { role: "user" as const, content: turn.userMessage },
        { role: "ai" as const, content: turn.aiMessage },
      ]),
    ];
    const ai = await getTurnResponse(
      simulation.category,
      messageContext,
      input.userMessage,
      userTurnNumber,
      conversation,
    );

    const turn = await prisma.simulationTurn.create({
      data: {
        simulationId: simulation.id,
        turnNumber: storageTurnNumber,
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
      shouldFinish: userTurnNumber >= 5,
    });
  } catch (error) {
    return jsonError(parseError(error));
  }
}
