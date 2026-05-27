import { z } from "zod";
import type {
  FinalReport,
  MessageContext,
  OutcomeAdvice,
  OutcomeInput,
  Scores,
  TurnAiResponse,
} from "@/lib/types";

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

type ConversationMessage = {
  role: "ai" | "user";
  content: string;
};

export class AiServiceError extends Error {
  constructor(message = "AI servisi şu an cevap veremedi. Lütfen tekrar dene.") {
    super(message);
    this.name = "AiServiceError";
  }
}

const TURN_TIMEOUT_MS = 18000;
const LONG_TIMEOUT_MS = 25000;

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
  "Sen Türkçe konuşan doğal, zeki ve biraz esprili bir konuşma prova simülatörüsün.",
  "Kullanıcıya gerçek hayatta gönderebileceği daha iyi cümleler buldurursun.",
  "Cevaplar fazla resmi, robotik veya tekdüze olmasın.",
  "Gerektiğinde yaratıcı ama inandırıcı bahaneler üret.",
  "Espri kullanacaksan dozunda ve karşı tarafı küçümsemeden kullan.",
  "Karşı tarafı 1-3 cümleyle gerçekçi şekilde konuştur.",
  "Karşı taraf bazen makul itiraz, kırgınlık, şaşkınlık veya takip sorusu sorarak kullanıcıyı biraz zorlasın.",
  "Her turda hemen kabullenme; bağlama göre nazik ama zorlayıcı bir tepki de verebilirsin.",
  "suggested_replies.soft sıcak, yumuşak ve samimi olsun.",
  "suggested_replies.clear net ama kırmadan olsun.",
  "suggested_replies.short kısa, doğal, gerekirse hafif esprili olsun.",
  "feedback 1-2 cümle olsun.",
  "better_alternative kullanıcının gerçekten gönderebileceği daha iyi bir mesaj olsun, 1-3 cümle.",
  "Sadece geçerli JSON döndür. JSON dışında açıklama yazma.",
  "JSON'u tamamlamadan cevabı bitirme. Tüm stringleri çift tırnak içinde kapat. Sonda trailing comma kullanma.",
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
        temperature: 0.55,
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

function compactContext(context: MessageContext) {
  return {
    kategori: "Zor Mesajlar",
    karsi_taraf: context.otherPerson,
    gelen_mesaj: context.incomingMessage,
    amac: context.goal,
    ton: context.tone,
    cekince: context.fear,
  };
}

export function createTurnMessages(
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
        task: "Zor Mesajlar simülasyonu için karşı taraf tepkisi ve kısa değerlendirme üret.",
        rules: [
          "Karşı tarafı 1-3 cümleyle konuştur.",
          "Kullanıcının cevabı zayıfsa karşı taraf nazikçe zorlayabilir veya takip sorusu sorabilir.",
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
        context: compactContext(context),
        turnNumber,
        conversation: conversation.slice(-6),
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
        context: compactContext(context),
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
        context: compactContext(context),
        outcome,
      }),
    },
  ];
}

export async function getDeepSeekTurnResponse(
  context: MessageContext,
  userMessage: string,
  turnNumber: number,
  conversation: ConversationMessage[] = [],
) {
  return requestJson<TurnAiResponse>(
    "turn",
    createTurnMessages(context, userMessage, turnNumber, conversation),
    turnSchema,
    1900,
    TURN_TIMEOUT_MS,
  );
}

export async function getDeepSeekFinalReport(
  context: MessageContext,
  turns: Array<{ turnNumber: number; userMessage: string; aiMessage: string }>,
) {
  return requestJson<FinalReport>(
    "final",
    createFinalReportMessages(context, turns),
    finalReportSchema,
    800,
    LONG_TIMEOUT_MS,
  );
}

export async function getDeepSeekOutcomeAdvice(context: MessageContext, outcome: OutcomeInput) {
  return requestJson<OutcomeAdvice>(
    "outcome",
    createOutcomeAdviceMessages(context, outcome),
    outcomeAdviceSchema,
    700,
    LONG_TIMEOUT_MS,
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
