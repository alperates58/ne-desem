import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { jsonError, parseError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return jsonError("Giriş yapman gerekiyor.", 401);
    }

    const { name, bio, isPublic, socialLinks } = await request.json();

    if (!name || name.trim().length === 0) {
      return jsonError("İsim alanı boş bırakılamaz.", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        bio: bio ? bio.trim() : null,
        isPublic: !!isPublic,
        socialLinksJson: socialLinks || {},
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return jsonError(parseError(error));
  }
}
