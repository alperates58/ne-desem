import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getFinalReport } from "@/lib/ai";
import { jsonError, parseError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import type { MessageContext, Scores } from "@/lib/types";

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
      include: { turns: { orderBy: { turnNumber: "asc" } } },
    });

    if (!simulation) {
      return jsonError("Simülasyon bulunamadı.", 404);
    }

    const report = await getFinalReport(
      simulation.category,
      simulation.contextJson as unknown as MessageContext,
      simulation.turns.map((turn) => ({
        turnNumber: turn.turnNumber,
        userMessage: turn.userMessage,
        aiMessage: turn.aiMessage,
        scores: turn.scoresJson as Scores,
        feedback: turn.feedback,
        betterAlternative: turn.betterAlternative,
      })),
    );

    const updated = await prisma.simulation.update({
      where: { id: simulation.id },
      data: {
        status: "completed",
        totalScore: report.total_score,
        finalReportJson: report,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ simulation: updated, report });
  } catch (error) {
    return jsonError(parseError(error));
  }
}
