import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export function parseError(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message || "Form bilgilerini kontrol et.";
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "Bu e-posta zaten kayıtlı.";
    }
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    (typeof error === "object" &&
      error !== null &&
      "message" in error &&
      String(error.message).includes("Can't reach database server"))
  ) {
    return "Veritabanına bağlanılamadı. Lütfen biraz sonra tekrar dene.";
  }

  return "Bir şey ters gitti. Lütfen tekrar dene.";
}
