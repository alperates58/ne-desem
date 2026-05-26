import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { attachSession } from "@/lib/auth";
import { jsonError, parseError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const email = input.email.toLocaleLowerCase("tr-TR");
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return jsonError("Bu e-posta zaten kayıtlı.", 409);
    }

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email,
        passwordHash: await hash(input.password, 12),
      },
      select: { id: true, name: true, email: true },
    });

    return attachSession(NextResponse.json({ user }), user.id);
  } catch (error) {
    return jsonError(parseError(error));
  }
}
