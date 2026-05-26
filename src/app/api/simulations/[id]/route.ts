import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Giriş yapman gerekiyor.", 401);
  }

  const { id } = await context.params;
  const simulation = await prisma.simulation.findFirst({
    where: { id, userId: user.id },
    include: {
      turns: { orderBy: { turnNumber: "asc" } },
      outcome: true,
    },
  });

  if (!simulation) {
    return jsonError("Simülasyon bulunamadı.", 404);
  }

  return NextResponse.json({ simulation });
}
