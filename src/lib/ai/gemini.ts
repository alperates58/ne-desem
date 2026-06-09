import { z } from "zod";
import type {
  FinalReport,
  MessageContext,
  OutcomeAdvice,
  OutcomeInput,
  TurnAiResponse,
} from "@/lib/types";

import {
  AiServiceError,
  baseSystemPrompt,
  buildConversationHistory,
  compactContext,
  finalReportSchema,
  outcomeAdviceSchema,
  openingMessageSchema,
  simulationBriefSchema,
  parseJson,
  retry,
  turnSchema,
} from "./common";

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

type ConversationMessage = {
  role: "ai" | "user";
  content: string;
};

const TURN_TIMEOUT_MS = 18000;
const LONG_TIMEOUT_MS = 25000;

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

function getEndpoint() {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const apiKey = process.env.GEMINI_API_KEY;
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
}

function getModel() {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

function logGemini(parts: {
  model: string;
  phase: "turn" | "final" | "outcome";
  status?: number;
  timeoutMs: number;
}) {
  const status = parts.status ? ` status: ${parts.status}` : "";
  console.info(
    `AI provider: gemini model: ${parts.model} phase: ${parts.phase}${status} timeoutMs: ${parts.timeoutMs}`,
  );
}

function logGeminiError(parts: {
  model: string;
  phase: "turn" | "final" | "outcome";
  timeoutMs: number;
  status?: number;
  error?: string;
  jsonParseError?: string;
}) {
  const status = parts.status ? ` status: ${parts.status}` : "";
  const error = parts.error ? ` error: ${parts.error}` : "";
  const jsonParseError = parts.jsonParseError ? ` jsonParseError: ${parts.jsonParseError}` : "";
  console.error(
    `AI provider: gemini model: ${parts.model} phase: ${parts.phase}${status}${error}${jsonParseError} timeoutMs: ${parts.timeoutMs}`,
  );
}

async function requestGeminiJson<T>(
  phase: "turn" | "final" | "outcome",
  userPrompt: string,
  schema: z.ZodType<T>,
  timeoutMs: number,
): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = getModel();

  if (!apiKey) {
    logGeminiError({ model, phase, timeoutMs, error: "missing_api_key" });
    throw new AiServiceError();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: baseSystemPrompt }],
      },
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.65,
      },
    };

    const response = await fetch(getEndpoint(), {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    logGemini({ model, phase, status: response.status, timeoutMs });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      logGeminiError({ model, phase, timeoutMs, status: response.status, error: errorText });
      throw new AiServiceError();
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
        finishReason?: string;
      }>;
    };

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      logGeminiError({ model, phase, timeoutMs, error: "empty_content" });
      throw new AiServiceError();
    }

    let parsed: unknown;
    try {
      parsed = parseJson(content);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown_parse_error";
      logGeminiError({
        model,
        phase,
        timeoutMs,
        jsonParseError: message.slice(0, 160),
      });
      throw new AiServiceError("AI cevabı formatlanamadı. Lütfen tekrar dene.");
    }

    const result = schema.safeParse(parsed);
    if (!result.success) {
      logGeminiError({
        model,
        phase,
        timeoutMs,
        jsonParseError: result.error.issues[0]?.message || "schema_validation_failed",
      });
      throw new AiServiceError("AI cevabı formatlanamadı. Lütfen tekrar dene.");
    }

    return result.data;
  } catch (error) {
    if (error instanceof AiServiceError) {
      throw error;
    }

    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.message.toLowerCase().includes("aborted"))
    ) {
      logGeminiError({ model, phase, timeoutMs, error: "timeout" });
      throw new AiServiceError("AI cevabı zaman aşımına uğradı. Lütfen tekrar dene.");
    }

    const message = error instanceof Error ? error.message : "request_failed";
    logGeminiError({ model, phase, timeoutMs, error: message.slice(0, 160) });
    throw new AiServiceError();
  } finally {
    clearTimeout(timeout);
  }
}

export async function getGeminiTurnResponse(
  category: string,
  context: MessageContext,
  userMessage: string,
  turnNumber: number,
  conversation: ConversationMessage[] = [],
) {
  const userPrompt = JSON.stringify({
    task: "Kullanıcının gönderdiği mesaja karşı taraf rolünde doğal ve inandırıcı bir sonraki yanıtı yaz ve tura ait puanlama/önerileri üret.",
    rules: [
      "Karşı tarafın doğrudan ağzından yaz (ai_message). Birebir rol yap ve karakterinden çıkma.",
      "Konuşma doğal bir chat (WhatsApp, Slack vb.) veya yüz yüze konuşma hissi vermeli.",
      "Kullanıcının cevabı zayıfsa karşı taraf nazikçe zorlayabilir, itiraz edebilir veya takip sorusu sorabilir.",
      "Feedback 1-2 cümle olsun.",
      "better_alternative 1-3 cümle olsun.",
      "suggested_replies soft/clear/short 1-3 cümle olsun.",
      "Skorlar 0-100 integer olsun.",
      "JSON'u tamamlamadan cevabı bitirme.",
    ],
    json: {
      ai_message: "...",
      suggested_replies: {
        soft: "...",
        clear: "...",
        short: "...",
      },
      scores: {
        clarity: 80,
        confidence: 70,
        empathy: 75,
        boundaries: 65,
        naturalness: 85,
        risk: 25,
        persuasion: 70,
      },
      feedback: "...",
      better_alternative: "...",
    },
    context: compactContext(category, context),
    turnNumber,
    conversation: buildConversationHistory(conversation),
    userMessage,
  });

  return retry(
    () => requestGeminiJson<TurnAiResponse>("turn", userPrompt, turnSchema, 10000),
    2,
    1000,
    "gemini",
    "turn",
  );
}

export async function getGeminiFinalReport(
  category: string,
  context: MessageContext,
  turns: Array<{ turnNumber: number; userMessage: string; aiMessage: string }>,
) {
  const userPrompt = JSON.stringify({
    task: "Simülasyon final raporunu üret. Bu raporda kullanıcının performansını detaylıca değerlendir.",
    rules: [
      "summary kısa olsun.",
      "Listeler en fazla 3 madde olsun.",
      "Cümleler uygulanabilir olsun.",
      "simulation_goal_result: Kullanıcının konuşma hedefine (context.goal) bu simülasyondaki diyalog akışına göre ulaşıp ulaşamadığını değerlendir ve 'evet' | 'kismen' | 'hayir' değerlerinden birini ata.",
      "simulation_goal_explanation: Kullanıcının neden bu hedefe ulaştığını, kısmen ulaştığını veya neden ulaşamadığını açıklayan 1-2 cümlelik yapıcı bir açıklama yaz.",
      "detailed_evaluation alanında kullanıcının yaptığı konuşma hatalarını, hangi cümlelerin yerine neleri kullanabileceğini ve karşıdaki kişinin canlandırılan karakter ve kişilik yapısına (otherPersonPersonality) göre nasıl bir iletişim yaklaşımı sergilemesi gerektiğini detaylandıran 2-3 paragraflık samimi ve yapıcı Türkçe bir değerlendirme yazısı oluştur."
    ],
    json: {
      total_score: 78,
      summary: "...",
      best_sentence: "...",
      weakest_sentence: "...",
      perceived_by_other_person: "...",
      better_alternatives: ["...", "...", "..."],
      real_life_tips: ["...", "...", "..."],
      risks: ["...", "..."],
      detailed_evaluation: "...",
      simulation_goal_result: "evet",
      simulation_goal_explanation: "..."
    },
    context: compactContext(category, context),
    turns,
  });

  return retry(
    () => requestGeminiJson<FinalReport>("final", userPrompt, finalReportSchema, 12000),
    2,
    1000,
    "gemini",
    "final",
  );
}

export async function getGeminiOutcomeAdvice(
  category: string,
  context: MessageContext,
  outcome: OutcomeInput,
) {
  const userPrompt = JSON.stringify({
    task: "Gerçek hayat sonucuna göre kısa ek öneri üret.",
    rules: ["Listeler en fazla 3 madde olsun.", "Takip mesajı kısa ve gönderilebilir olsun."],
    json: {
      situation_analysis: "...",
      what_went_well: ["...", "..."],
      risks: ["...", "..."],
      next_steps: ["...", "...", "..."],
      followup_message: "...",
      next_conversation_opener: "...",
    },
    context: compactContext(category, context),
    outcome,
  });

  return retry(
    () => requestGeminiJson<OutcomeAdvice>("outcome", userPrompt, outcomeAdviceSchema, 12000),
    2,
    1000,
    "gemini",
    "outcome",
  );
}

export async function getGeminiOpeningMessage(
  category: string,
  context: MessageContext,
) {
  const userPrompt = JSON.stringify({
    task: "Sana verilen durum açıklaması ve konuşma detaylarına göre, canlandırdığın karakterin (örneğin Patron, Flört vb.) konuşmayı başlatacağı ilk doğal ve inandırıcı sohbet mesajını (opening_message) yaz.",
    rules: [
      "Eğer durum/mesaj alanı zaten doğrudan karşı tarafın söylediği bir söz ise (örneğin 'Hafta sonu işe gelebilir misin?' gibi), bu sözü aynen koru veya canlandırdığın karakterin ağzından çok küçük doğal bir tonlama/emoji ile söyle.",
      "Eğer durum/mesaj alanı üçüncü şahıs gözünden anlatılan bir olay veya arka plan ise, canlandırdığın karakterin ağzından bu olayı/durumu tetikleyen veya başlatan doğal bir ilk mesaj yaz. Karşı taraf rolünden çıkma.",
      "Bu ilk mesaj 1-3 cümle uzunluğunda olsun ve doğrudan karşı tarafın ağzından söylenmiş olmalı. Robotik olmasın.",
    ],
    json: {
      opening_message: "...",
    },
    context: compactContext(category, context),
  });

  return retry(
    () => requestGeminiJson<{ opening_message: string }>("turn", userPrompt, openingMessageSchema, 10000),
    2,
    1000,
    "gemini",
    "opening",
  );
}

export async function getGeminiSimulationBrief(
  category: string,
  context: MessageContext,
) {
  const userPrompt = JSON.stringify({
    task: "Sana verilen durum açıklaması ve konuşma detaylarına göre karşıdaki kişiyi, onun canlandırılacak kişiliğini ve konuşulacak durumu özetleyen, simülasyona başlamadan önce kullanıcıyı havaya sokacak ve provayı başlatacak 2-3 cümlelik heyecan verici, hazırlayıcı bir tanıtım yazısı (simulation_brief) yaz.",
    rules: [
      "Durumu ve karşı tarafın kim olduğunu, onun canlandırılacak tavrını ve kişiliğini kısa ve etkileyici bir dille anlat.",
      "Yazı doğrudan kullanıcıya hitap etmeli (Örn: 'Müdürün Hakan Bey ile karşı karşıyasın. Kendisi otoriter tavrıyla bilinir...')",
      "Kısa ve net ol, 2-3 cümleyi aşma.",
    ],
    json: {
      simulation_brief: "...",
    },
    context: compactContext(category, context),
  });

  return retry(
    () => requestGeminiJson<{ simulation_brief: string }>("turn", userPrompt, simulationBriefSchema, 10000),
    2,
    1000,
    "gemini",
    "brief",
  );
}
