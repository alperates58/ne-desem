import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError, parseError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim() || "";

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        membershipTier: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return jsonError(parseError(error));
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, role, customSimulationCredits, membershipTierId } = body;

    if (!id) {
      return jsonError("Kullanıcı ID'si eksik.", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: role || undefined,
        customSimulationCredits:
          customSimulationCredits !== undefined ? parseInt(customSimulationCredits) : undefined,
        membershipTierId: membershipTierId === "null" ? null : membershipTierId || undefined,
      },
      include: {
        membershipTier: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return jsonError(parseError(error));
  }
}
