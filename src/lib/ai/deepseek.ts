import { z } from "zod";
import type {
  FinalReport,
  MessageContext,
  OutcomeAdvice,
  OutcomeInput,
  Scores,
  TurnAiResponse,
} from "@/lib/types";

import {
  AiServiceError,
  baseSystemPrompt,
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

export function isDeepSeekConfigured() {
  return Boolean(process.env.DEEPSEEK_API_KEY);
}

function getEndpoint() {
  const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  return `${baseUrl.replace(/\/$/, "")}/chat/completions`;
}

function getModel() {
  return process.env.DEEPSEEK_MODEL || "deepseek-v4-pro";
}

function logDeepSeek(parts: {
  model: string;
  phase: "turn" | "final" | "outcome";
  status?: number;
  timeoutMs: number;
}) {
  const status = parts.status ? ` status: ${parts.status}` : "";
  console.info(
    `AI provider: deepseek model: ${parts.model} phase: ${parts.phase}${status} timeoutMs: ${parts.timeoutMs}`,
  );
}

function logDeepSeekError(parts: {
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
    `AI provider: deepseek model: ${parts.model} phase: ${parts.phase}${status}${error}${jsonParseError} timeoutMs: ${parts.timeoutMs}`,
  );
}

function logEmptyContentDebug(params: {
  model: string;
  phase: "turn" | "final" | "outcome";
  data: {
    choices?: Array<{
      finish_reason?: string;
      message?: Record<string, unknown>;
    }>;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  };
}) {
  const firstChoice = params.data.choices?.[0];
  const choicesLength = params.data.choices?.length ?? 0;
  const choiceKeys = firstChoice ? Object.keys(firstChoice).join(",") : "none";
  const messageKeys = firstChoice?.message ? Object.keys(firstChoice.message).join(",") : "none";
  const finishReason = firstChoice?.finish_reason ?? "none";
  const usage = params.data.usage
    ? `prompt_tokens=${params.data.usage.prompt_tokens ?? "unknown"},completion_tokens=${params.data.usage.completion_tokens ?? "unknown"},total_tokens=${params.data.usage.total_tokens ?? "unknown"}`
    : "none";

  console.error(
    `AI provider: deepseek model: ${params.model} phase: ${params.phase} empty_content_debug choices: ${choicesLength} choiceKeys: ${choiceKeys} messageKeys: ${messageKeys} finishReason: ${finishReason} usage: ${usage}`,
  );
}

async function requestJson<T>(
  phase: "turn" | "final" | "outcome",
  messages: ChatMessage[],
  schema: z.ZodType<T>,
  maxTokens: number,
  timeoutMs: number,
): Promise<T> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = getModel();

  if (!apiKey) {
    logDeepSeekError({ model, phase, timeoutMs, error: "missing_api_key" });
    throw new AiServiceError();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(getEndpoint(), {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: { type: "json_object" },
        temperature: 0.65,
        max_tokens: maxTokens,
      }),
    });

    logDeepSeek({ model, phase, status: response.status, timeoutMs });

    if (!response.ok) {
      throw new AiServiceError();
    }

    const data = (await response.json()) as {
      choices?: Array<{
        finish_reason?: string;
        message?: {
          content?: string;
          reasoning_content?: string;
        };
      }>;
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
    };
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      logEmptyContentDebug({ model, phase, data });
      logDeepSeekError({ model, phase, timeoutMs, error: "empty_content" });
      throw new AiServiceError();
    }

    let parsed: unknown;

    try {
      parsed = parseJson(content);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown_parse_error";
      logDeepSeekError({
        model,
        phase,
        timeoutMs,
        jsonParseError: message.slice(0, 160),
      });
      throw new AiServiceError("AI cevabı formatlanamadı. Lütfen tekrar dene.");
    }

    const result = schema.safeParse(parsed);

    if (!result.success) {
      logDeepSeekError({
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
      (error.name === "AbortError" || error.message.toLocaleLowerCase("en-US").includes("aborted"))
    ) {
      logDeepSeekError({ model, phase, timeoutMs, error: "timeout" });
      throw new AiServiceError("AI cevabı zaman aşımına uğradı. Lütfen tekrar dene.");
    }

    const message = error instanceof Error ? error.message : "request_failed";
    logDeepSeekError({ model, phase, timeoutMs, error: message.slice(0, 160) });
    throw new AiServiceError();
  } finally {
    clearTimeout(timeout);
  }
}


export function createTurnMessages(
  category: string,
  context: MessageContext,
  userMessage: string,
  turnNumber: number,
  conversation: ConversationMessage[] = [],
): ChatMessage[] {
  return [
    { role: "system", content: baseSystemPrompt },
    {
      role: "user",
      content: JSON.stringify({
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
        conversation: conversation.slice(-6),
        userMessage,
      }),
    },
  ];
}

export function createFinalReportMessages(
  category: string,
  context: MessageContext,
  turns: Array<{ turnNumber: number; userMessage: string; aiMessage: string }>,
): ChatMessage[] {
  return [
    { role: "system", content: baseSystemPrompt },
    {
      role: "user",
      content: JSON.stringify({
        task: "Simülasyon final raporunu üret. Bu raporda kullanıcının performansını detaylıca değerlendir.",
        rules: [
          "summary kısa olsun.",
          "Listeler en fazla 3 madde olsun.",
          "Cümleler uygulanabilir olsun.",
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
          detailed_evaluation: "..."
        },
        context: compactContext(category, context),
        turns,
      }),
    },
  ];
}

export function createOutcomeAdviceMessages(
  category: string,
  context: MessageContext,
  outcome: OutcomeInput,
): ChatMessage[] {
  return [
    { role: "system", content: baseSystemPrompt },
    {
      role: "user",
      content: JSON.stringify({
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
      }),
    },
  ];
}

export async function getDeepSeekTurnResponse(
  category: string,
  context: MessageContext,
  userMessage: string,
  turnNumber: number,
  conversation: ConversationMessage[] = [],
) {
  return retry(
    () =>
      requestJson<TurnAiResponse>(
        "turn",
        createTurnMessages(category, context, userMessage, turnNumber, conversation),
        turnSchema,
        1900,
        10000,
      ),
    2,
    1000,
    "deepseek",
    "turn",
  );
}

export async function getDeepSeekFinalReport(
  category: string,
  context: MessageContext,
  turns: Array<{ turnNumber: number; userMessage: string; aiMessage: string }>,
) {
  return retry(
    () =>
      requestJson<FinalReport>(
        "final",
        createFinalReportMessages(category, context, turns),
        finalReportSchema,
        800,
        12000,
      ),
    2,
    1000,
    "deepseek",
    "final",
  );
}

export async function getDeepSeekOutcomeAdvice(
  category: string,
  context: MessageContext,
  outcome: OutcomeInput,
) {
  return retry(
    () =>
      requestJson<OutcomeAdvice>(
        "outcome",
        createOutcomeAdviceMessages(category, context, outcome),
        outcomeAdviceSchema,
        700,
        12000,
      ),
    2,
    1000,
    "deepseek",
    "outcome",
  );
}

export function createEmptyScores(): Scores {
  return {
    clarity: 0,
    confidence: 0,
    empathy: 0,
    boundaries: 0,
    naturalness: 0,
    risk: 0,
    persuasion: 0,
  };
}

export async function getDeepSeekOpeningMessage(
  category: string,
  context: MessageContext,
) {
  const messages = [
    { role: "system", content: baseSystemPrompt },
    {
      role: "user",
      content: JSON.stringify({
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
      }),
    },
  ];

  return retry(
    () =>
      requestJson<{ opening_message: string }>(
        "turn",
        messages as any,
        openingMessageSchema,
        400,
        10000,
      ),
    2,
    1000,
    "deepseek",
    "opening",
  );
}

export async function getDeepSeekSimulationBrief(
  category: string,
  context: MessageContext,
) {
  const messages = [
    { role: "system", content: baseSystemPrompt },
    {
      role: "user",
      content: JSON.stringify({
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
      }),
    },
  ];

  return retry(
    () =>
      requestJson<{ simulation_brief: string }>(
        "turn",
        messages as any,
        simulationBriefSchema,
        400,
        10000,
      ),
    2,
    1000,
    "deepseek",
    "brief",
  );
}
