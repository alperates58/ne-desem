import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  context: RouteContext
) {
  try {
    const user = await requireUser();
    const { id } = await context.params;

    const simulation = await prisma.simulation.findFirst({
      where: { id, userId: user.id },
    });

    if (!simulation) {
      return jsonError("Simülasyon bulunamadı veya yetkiniz yok.", 404);
    }

    const updated = await prisma.simulation.update({
      where: { id },
      data: {
        isFavorite: !simulation.isFavorite,
      },
    });

    return NextResponse.json({
      success: true,
      isFavorite: updated.isFavorite,
    });
  } catch (err: any) {
    return jsonError(err.message || "Bir hata oluştu", 500);
  }
}
