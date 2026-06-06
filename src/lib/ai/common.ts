import { z } from "zod";
import type { MessageContext } from "@/lib/types";

export class AiServiceError extends Error {
  constructor(message = "AI servisi şu an cevap veremedi. Lütfen tekrar dene.") {
    super(message);
    this.name = "AiServiceError";
  }
}

export const scoresSchema = z.object({
  clarity: z.number().int().min(0).max(100),
  confidence: z.number().int().min(0).max(100),
  empathy: z.number().int().min(0).max(100),
  boundaries: z.number().int().min(0).max(100),
  naturalness: z.number().int().min(0).max(100),
  risk: z.number().int().min(0).max(100),
  persuasion: z.number().int().min(0).max(100),
});

export const turnSchema = z.object({
  ai_message: z.string().min(1),
  suggested_replies: z.object({
    soft: z.string().min(1),
    clear: z.string().min(1),
    short: z.string().min(1),
  }),
  scores: scoresSchema,
  feedback: z.string().min(1),
  better_alternative: z.string().min(1),
});

export const finalReportSchema = z.object({
  total_score: z.number().int().min(0).max(100),
  summary: z.string().min(1),
  best_sentence: z.string().min(1),
  weakest_sentence: z.string().min(1),
  perceived_by_other_person: z.string().min(1),
  better_alternatives: z.array(z.string().min(1)).min(1).max(3),
  real_life_tips: z.array(z.string().min(1)).min(1).max(3),
  risks: z.array(z.string().min(1)).min(1).max(3),
  detailed_evaluation: z.string().optional(),
});

export const outcomeAdviceSchema = z.object({
  situation_analysis: z.string().min(1),
  what_went_well: z.array(z.string().min(1)).min(1).max(3),
  risks: z.array(z.string().min(1)).min(1).max(3),
  next_steps: z.array(z.string().min(1)).min(1).max(3),
  followup_message: z.string().min(1),
  next_conversation_opener: z.string().min(1),
});

export const openingMessageSchema = z.object({
  opening_message: z.string().min(1),
});

export const simulationBriefSchema = z.object({
  simulation_brief: z.string().min(1),
});

export const baseSystemPrompt = [
  "Sen Türkçe konuşan, kullanıcının belirttiği Kategori, Karşı Taraf rolünü ve Karşı Tarafın Kişilik Tipini canlandıran zeki, gerçekçi ve duruma göre tepki veren birisin.",
  "Sen bir simülatör olsan da, 'ai_message' alanında KESİNLİKLE yapay zeka veya simülatör gibi konuşmamalısın; doğrudan o karşı taraf karakterinin ağzından yazmalısın! Karakterinin dışına asla çıkma.",
  "Canlandırdığın karakterin 'karsi_taraf_kisilik_tipi' (kişilik tipi) özelliklerini çok güçlü bir şekilde yansıt. Örneğin 'Pasif-Agresif' ise iğneleyici ve dolaylı konuş; 'Otoriter ve Sert' ise baskıcı ve sert ol; 'Anlayışlı ve Mantıklı' ise mantıklı ve yapıcı ol. Her tonda bu kişiliğe sadık kalarak farklı bir yoldan cevap ver.",
  "Örneğin, karşı taraf 'Patron' ise profesyonel ama talepkar; 'Flört' ise WhatsApp'tan yazan bir sevgili gibi samimi, mesafeli, kırgın veya soğuk ol. Kısaltmalar, emojiler, doğal konuşma kalıpları ve günlük dili kullan.",
  "'ai_message' içinde asla 'Karşı Taraf:' veya 'Sistem:' gibi ibareler kullanma; doğrudan mesajın kendisi olmalı.",
  "Cevapların robotik, aşırı mesafeli veya tekdüze olmasın. Eğlenceli, inandırıcı ve sürükleyici bir sohbet akışı sağla.",
  "Kullanıcıya her turda hemen teslim olma. Kendi sınırları olan, makul itirazlar yapabilen, takip soruları soran ve kullanıcıyı sakin kalıp net konuşmaya zorlayan bir tepki ver.",
  "suggested_replies.soft sıcak, yapıcı, yumuşak ve samimi olsun.",
  "suggested_replies.clear net, sınır çizen ama kırmadan olsun.",
  "suggested_replies.short kısa, direkt, gerekirse hafif esprili veya iğneleyici/doğal olsun.",
  "feedback 1-2 cümle olsun ve kullanıcının mesajının tonunu, riskini analiz etsin.",
  "better_alternative kullanıcının gerçekten gönderebileceği daha iyi bir mesaj olsun, 1-3 cümle.",
  "Sadece geçerli JSON döndür. JSON dışında açıklama yazma.",
  "JSON'u tamamlamadan cevabı bitirme. Tüm stringleri çift tırnak içinde kapat. Sonda trailing comma kullanma.",
].join(" ");

export function getCategoryName(category: string) {
  const map: Record<string, string> = {
    is_kariyer: "İş / Kariyer",
    flort_iliski: "Flört / İlişki",
    aile_arkadas: "Aile / Arkadaş",
    para_pazarlik: "Para / Pazarlık",
    zor_mesajlar: "Zor Mesajlar",
    egitim_okul: "Eğitim / Okul",
    gunluk_yasam: "Günlük Yaşam",
    sosyal_medya_dijital: "Dijital / Sosyal Medya",
  };
  return map[category] || category;
}

export function compactContext(category: string, context: MessageContext) {
  return {
    kategori: getCategoryName(category),
    karsi_taraf: context.otherPerson,
    karsi_taraf_kisilik_tipi: context.otherPersonPersonality,
    gelen_mesaj: context.incomingMessage,
    zorluk_nedeni: context.difficultyReason,
    amac: context.goal,
    ton: context.tone,
    cekince: context.fear,
    karsi_taraf_tavri: context.otherPersonAttitude,
    daha_once_konusuldu_mu: context.previouslyDiscussed,
    kirmizi_cizgi: context.redLine,
    iletisim_suresi: context.relationshipDuration,
    asla_yapilmayacak: context.avoidAction,
    cevap_gelmezse: context.noReplyAction,
    yakinlik_derecesi: context.closenessLevel,
    gecmis_konusmalar: context.pastConversations,
    para_meselesi: context.financialIssue,
    mevcut_tutar: context.currentAmount,
    kabul_edilebilir_minimum: context.minAcceptableLevel,
    koz_alternatif: context.leverageOrAlternative,
    anlasma_olmazsa: context.noAgreementAction,
    baslatan: context.initiatedBy === "user" ? "Kullanıcı (Ben)" : "Karşı Taraf",
  };
}

/**
 * Konuşma geçmişi penceresini akıllıca kırpar.
 * Kısa geçmişlerde tamamını döndürür.
 * Uzun geçmişlerde ilk mesajı (açılış/bağlam) korur + son 9 mesajı alır.
 * Bu sayede 8+ turlu simülasyonlarda AI bağlamı kaybetmez.
 */
export function buildConversationHistory<T>(conversation: T[]): T[] {
  if (conversation.length <= 10) return conversation;
  return [conversation[0], ...conversation.slice(-9)];
}

export function parseJson(content: string) {
  const trimmed = content.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(withoutFence);
}

export async function retry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 1200,
  provider = "unknown",
  phase = "unknown"
): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries) {
        console.warn(
          `[AI Retry] ${provider} (${phase}) failed. Retrying in ${delayMs}ms... (Attempt ${i + 1}/${retries + 1}). Error: ${err instanceof Error ? err.message : String(err)}`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

