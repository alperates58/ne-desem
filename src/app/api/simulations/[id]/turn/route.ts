import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getInitialResponse, getTurnResponse } from "@/lib/ai";
import { jsonError, parseError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import type { MessageContext, Scores } from "@/lib/types";
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
    const body = await request.json();
    const isInitial = body?.initial === true;
    const input = isInitial ? { userMessage: "" } : turnSchema.parse(body);
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

    if (isInitial && simulation.turns.length > 0) {
      return NextResponse.json({
        turn: simulation.turns[0],
        suggestedReplies: null,
        shouldFinish: false,
      });
    }

    if (isInitial) {
      const ai = await getInitialResponse(simulation.contextJson as unknown as MessageContext);
      const emptyScores: Scores = {
        clarity: 0,
        confidence: 0,
        empathy: 0,
        boundaries: 0,
        naturalness: 0,
        risk: 0,
        persuasion: 0,
      };
      const turn = await prisma.simulationTurn.create({
        data: {
          simulationId: simulation.id,
          turnNumber: 1,
          aiMessage: ai.ai_message,
          userMessage: "",
          scoresJson: emptyScores,
          feedback: "",
          betterAlternative: "",
        },
      });

      return NextResponse.json({
        turn,
        suggestedReplies: null,
        shouldFinish: false,
      });
    }

    const turnNumber = simulation.turns.length + 1;
    const conversation = simulation.turns.flatMap((turn) => [
      ...(turn.userMessage ? [{ role: "user" as const, content: turn.userMessage }] : []),
      { role: "ai" as const, content: turn.aiMessage },
    ]);
    const ai = await getTurnResponse(
      simulation.contextJson as unknown as MessageContext,
      input.userMessage,
      turnNumber,
      conversation,
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
      shouldFinish: simulation.turns.filter((turnItem) => turnItem.userMessage).length + 1 >= 5,
    });
  } catch (error) {
    return jsonError(parseError(error));
  }
}
