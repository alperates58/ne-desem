import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { compactScenario, createSimulationTitle } from "@/lib/categories";
import { jsonError, parseError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { createSimulationSchema } from "@/lib/validators";
import { getAiOpeningMessage } from "@/lib/ai";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Giriş yapman gerekiyor.", 401);
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim();
  const filter = url.searchParams.get("filter");

  const simulations = await prisma.simulation.findMany({
    where: {
      userId: user.id,
      ...(filter && filter !== "all" ? { status: filter as never } : {}),
      ...(search
        ? {
            OR: [
              { scenario: { contains: search, mode: "insensitive" } },
              { title: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { outcome: true },
  });

  return NextResponse.json({ simulations });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return jsonError("Giriş yapman gerekiyor.", 401);
    }

    const input = createSimulationSchema.parse(await request.json());
    
    // Generate AI opening message based on context
    const aiOpeningMessage = await getAiOpeningMessage(input.category, input.context);
    
    const enrichedContext = {
      ...input.context,
      aiOpeningMessage,
    };

    const simulation = await prisma.simulation.create({
      data: {
        userId: user.id,
        category: input.category,
        scenario: compactScenario(input.context),
        title: createSimulationTitle(input.context),
        contextJson: enrichedContext as any,
      },
    });

    return NextResponse.json({ simulation });
  } catch (error) {
    return jsonError(parseError(error));
  }
}
