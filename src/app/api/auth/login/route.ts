import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { attachSession } from "@/lib/auth";
import { jsonError, parseError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const email = input.email.toLocaleLowerCase("tr-TR");
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await compare(input.password, user.passwordHash))) {
      return jsonError("E-posta veya şifre hatalı.", 401);
    }

    const responseUser = { id: user.id, name: user.name, email: user.email };
    return attachSession(NextResponse.json({ user: responseUser }), user.id);
  } catch (error) {
    return jsonError(parseError(error));
  }
}
