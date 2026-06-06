import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  try {
    await requireAdmin();

    const defaultTiers = [
      { name: "Free", price: 0, monthlyLimit: 5 },
      { name: "Silver", price: 99, monthlyLimit: 15 },
      { name: "Gold", price: 199, monthlyLimit: 40 },
      { name: "Premium", price: 399, monthlyLimit: 100 },
    ];

    const seededTiers = [];

    for (const tier of defaultTiers) {
      let existing = await prisma.membershipTier.findFirst({
        where: { name: { equals: tier.name, mode: "insensitive" } },
      });

      if (!existing) {
        existing = await prisma.membershipTier.create({
          data: {
            name: tier.name,
            price: tier.price,
            monthlyLimit: tier.monthlyLimit,
          },
        });
        seededTiers.push(existing);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${seededTiers.length} adet yeni plan başarıyla oluşturuldu.`,
      seeded: seededTiers,
    });
  } catch (error: any) {
    if (error.message?.includes("redirect")) {
      return jsonError("Yetkisiz işlem.", 403);
    }
    console.error("Admin seed tiers error:", error);
    return jsonError("İşlem sırasında bir sunucu hatası oluştu.", 500);
  }
}
