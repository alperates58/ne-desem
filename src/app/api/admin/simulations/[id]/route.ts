import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const simulation = await prisma.simulation.findUnique({
      where: { id },
    });

    if (!simulation) {
      return jsonError("Simülasyon bulunamadı.", 404);
    }

    await prisma.simulation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Simülasyon başarıyla silindi." });
  } catch (error: any) {
    if (error.message?.includes("redirect")) {
      return jsonError("Yetkisiz işlem.", 403);
    }
    console.error("Admin delete simulation error:", error);
    return jsonError("İşlem sırasında bir sunucu hatası oluştu.", 500);
  }
}
