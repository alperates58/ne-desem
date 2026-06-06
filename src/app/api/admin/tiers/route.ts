import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError, parseError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const tiers = await prisma.membershipTier.findMany({
      orderBy: { price: "asc" },
    });
    return NextResponse.json({ tiers });
  } catch (error) {
    return jsonError(parseError(error));
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, name, price, monthlyLimit } = body;

    if (!name || name.trim().length === 0) {
      return jsonError("Plan adı boş olamaz.", 400);
    }
    if (price === undefined || price < 0) {
      return jsonError("Geçerli bir fiyat girin.", 400);
    }
    if (monthlyLimit === undefined || monthlyLimit < 0) {
      return jsonError("Geçerli bir aylık limit girin.", 400);
    }

    if (id) {
      // Update
      const tier = await prisma.membershipTier.update({
        where: { id },
        data: {
          name: name.trim(),
          price: parseFloat(price),
          monthlyLimit: parseInt(monthlyLimit),
        },
      });
      return NextResponse.json({ success: true, tier });
    } else {
      // Create
      const tier = await prisma.membershipTier.create({
        data: {
          name: name.trim(),
          price: parseFloat(price),
          monthlyLimit: parseInt(monthlyLimit),
        },
      });
      return NextResponse.json({ success: true, tier });
    }
  } catch (error) {
    return jsonError(parseError(error));
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return jsonError("Plan ID belirtilmedi.", 400);
    }

    // Check if users are assigned to this tier
    const usersCount = await prisma.user.count({ where: { membershipTierId: id } });
    if (usersCount > 0) {
      return jsonError("Bu plana atanmış kullanıcılar var. Planı silmek için önce bu kullanıcıları başka bir plana geçirmelisiniz.", 400);
    }

    await prisma.membershipTier.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(parseError(error));
  }
}
