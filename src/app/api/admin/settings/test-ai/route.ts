import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { getAiMode, getAiSimulationBrief } from "@/lib/ai";
import { MessageContext } from "@/lib/types";

export const runtime = "nodejs";

export async function POST() {
  try {
    await requireAdmin();

    const mode = getAiMode();
    const startTime = performance.now();

    // Small testing payload
    const testCategory = "is_kariyer";
    const testContext: MessageContext = {
      incomingMessage: "Yarın sabah saat 9'da acil bir toplantı yapalım.",
      otherPerson: "Patron Hakan Bey",
      otherPersonPersonality: "Disiplinli ve aceleci",
      difficultyReason: "Beklenmedik bir toplantı ve hazırlıksız olmak",
      goal: "Toplantı saatini 10:00'a ertelemek veya hazırlıklı gitmek",
      tone: "Saygılı ve profesyonel",
      replyLength: "Kısa",
      preserveRelationship: "Evet",
      fear: "Profesyonel görünmemek",
    };

    const brief = await getAiSimulationBrief(testCategory, testContext);
    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    // If mock was returned, check if AI_MODE was actually mock or fell back due to error
    let warning = null;
    if (mode !== "mock" && brief.includes("Sana verilen durum açıklaması")) {
      warning = "AI yanıtı şablon fallback moduna girdi. API anahtarını veya model ayarlarını kontrol edin.";
    }

    return NextResponse.json({
      success: true,
      mode,
      latencyMs,
      outputSample: brief,
      warning,
    });
  } catch (error: any) {
    if (error.message?.includes("redirect")) {
      return jsonError("Yetkisiz işlem.", 403);
    }
    console.error("Admin test AI error:", error);
    return NextResponse.json({
      success: false,
      mode: getAiMode(),
      error: error.message || String(error),
    }, { status: 500 });
  }
}
