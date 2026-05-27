import { z } from "zod";
import type {
  FinalReport,
  MessageContext,
  OutcomeAdvice,
  OutcomeInput,
  TurnAiResponse,
} from "@/lib/types";

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

export class AiServiceError extends Error {
  constructor(message = "AI servisi şu an cevap veremedi. Lütfen tekrar dene.") {
    super(message);
    this.name = "AiServiceError";
  }
}

const REQUEST_TIMEOUT_MS = 20000;

const scoresSchema = z.object({
  clarity: z.number().int().min(0).max(100),
  confidence: z.number().int().min(0).max(100),
  empathy: z.number().int().min(0).max(100),
  boundaries: z.number().int().min(0).max(100),
  naturalness: z.number().int().min(0).max(100),
  risk: z.number().int().min(0).max(100),
  persuasion: z.number().int().min(0).max(100),
});

const turnSchema = z.object({
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

const finalReportSchema = z.object({
  total_score: z.number().int().min(0).max(100),
  summary: z.string().min(1),
  best_sentence: z.string().min(1),
  weakest_sentence: z.string().min(1),
  perceived_by_other_person: z.string().min(1),
  better_alternatives: z.array(z.string().min(1)).min(1).max(3),
  real_life_tips: z.array(z.string().min(1)).min(1).max(3),
  risks: z.array(z.string().min(1)).min(1).max(3),
});

const outcomeAdviceSchema = z.object({
  situation_analysis: z.string().min(1),
  what_went_well: z.array(z.string().min(1)).min(1).max(3),
  risks: z.array(z.string().min(1)).min(1).max(3),
  next_steps: z.array(z.string().min(1)).min(1).max(3),
  followup_message: z.string().min(1),
  next_conversation_opener: z.string().min(1),
});

const baseSystemPrompt = [
  "Türkçe cevap ver.",
  "Sadece geçerli JSON döndür.",
  "JSON dışında açıklama, markdown veya kod bloğu yazma.",
  "Manipülasyon, tehdit, taciz, şantaj veya baskı amaçlı cevap üretme.",
  "Karşı tarafı kısa ve gerçekçi konuştur.",
].join(" ");

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

function parseJson(content: string) {
  const trimmed = content.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(withoutFence);
}

function logDeepSeek(parts: Record<string, string | number>) {
  console.info(
    Object.entries({ provider: "deepseek", ...parts })
      .map(([key, value]) => `${key}: ${value}`)
      .join(" "),
  );
}

function logDeepSeekError(parts: Record<string, string | number>) {
  console.error(
    Object.entries({ provider: "deepseek", ...parts })
      .map(([key, value]) => `${key}: ${value}`)
      .join(" "),
  );
}

async function requestJson<T>(
  messages: ChatMessage[],
  schema: z.ZodType<T>,
  maxTokens: number,
): Promise<T> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = getModel();

  if (!apiKey) {
    logDeepSeekError({ model, timeoutMs: REQUEST_TIMEOUT_MS, error: "missing_api_key" });
    throw new AiServiceError();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

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
        temperature: 0.4,
        max_tokens: maxTokens,
      }),
    });

    logDeepSeek({ model, status: response.status, timeoutMs: REQUEST_TIMEOUT_MS });

    if (!response.ok) {
      throw new AiServiceError();
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      logDeepSeekError({ model, timeoutMs: REQUEST_TIMEOUT_MS, error: "empty_content" });
      throw new AiServiceError();
    }

    let parsed: unknown;

    try {
      parsed = parseJson(content);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown_parse_error";
      logDeepSeekError({
        model,
        timeoutMs: REQUEST_TIMEOUT_MS,
        jsonParseError: message.slice(0, 160),
      });
      throw new AiServiceError();
    }

    const result = schema.safeParse(parsed);

    if (!result.success) {
      logDeepSeekError({
        model,
        timeoutMs: REQUEST_TIMEOUT_MS,
        jsonParseError: result.error.issues[0]?.message || "schema_validation_failed",
      });
      throw new AiServiceError();
    }

    return result.data;
  } catch (error) {
    if (error instanceof AiServiceError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      logDeepSeekError({ model, timeoutMs: REQUEST_TIMEOUT_MS, error: "timeout" });
      throw new AiServiceError("AI cevabı zaman aşımına uğradı. Lütfen tekrar dene.");
    }

    const message = error instanceof Error ? error.message : "request_failed";
    logDeepSeekError({ model, timeoutMs: REQUEST_TIMEOUT_MS, error: message.slice(0, 160) });
    throw new AiServiceError();
  } finally {
    clearTimeout(timeout);
  }
}

export function createTurnMessages(
  context: MessageContext,
  userMessage: string,
  turnNumber: number,
): ChatMessage[] {
  return [
    { role: "system", content: baseSystemPrompt },
    {
      role: "user",
      content: JSON.stringify({
        task: "Zor Mesajlar simülasyonu için karşı taraf tepkisi ve kısa değerlendirme üret.",
        rules: [
          "Karşı tarafı 1-2 cümleyle konuştur.",
          "Feedback 1 cümle olsun.",
          "better_alternative 1 kısa cümle olsun.",
          "suggested_replies soft/clear/short kısa olsun.",
          "Skorlar 0-100 integer olsun.",
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
        context,
        turnNumber,
        userMessage,
      }),
    },
  ];
}

export function createFinalReportMessages(
  context: MessageContext,
  turns: Array<{ turnNumber: number; userMessage: string; aiMessage: string }>,
): ChatMessage[] {
  return [
    { role: "system", content: baseSystemPrompt },
    {
      role: "user",
      content: JSON.stringify({
        task: "Simülasyon final raporunu kısa üret.",
        rules: ["summary kısa olsun.", "Listeler en fazla 3 madde olsun.", "Cümleler uygulanabilir olsun."],
        json: {
          total_score: 78,
          summary: "...",
          best_sentence: "...",
          weakest_sentence: "...",
          perceived_by_other_person: "...",
          better_alternatives: ["...", "...", "..."],
          real_life_tips: ["...", "...", "..."],
          risks: ["...", "..."],
        },
        context,
        turns,
      }),
    },
  ];
}

export function createOutcomeAdviceMessages(
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
        context,
        outcome,
      }),
    },
  ];
}

export async function getDeepSeekTurnResponse(
  context: MessageContext,
  userMessage: string,
  turnNumber: number,
) {
  return requestJson<TurnAiResponse>(
    createTurnMessages(context, userMessage, turnNumber),
    turnSchema,
    700,
  );
}

export async function getDeepSeekFinalReport(
  context: MessageContext,
  turns: Array<{ turnNumber: number; userMessage: string; aiMessage: string }>,
) {
  return requestJson<FinalReport>(
    createFinalReportMessages(context, turns),
    finalReportSchema,
    900,
  );
}

export async function getDeepSeekOutcomeAdvice(context: MessageContext, outcome: OutcomeInput) {
  return requestJson<OutcomeAdvice>(
    createOutcomeAdviceMessages(context, outcome),
    outcomeAdviceSchema,
    800,
  );
}
