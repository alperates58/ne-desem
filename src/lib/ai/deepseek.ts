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

const scoresSchema = z.object({
  clarity: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  empathy: z.number().min(0).max(100),
  boundaries: z.number().min(0).max(100),
  naturalness: z.number().min(0).max(100),
  risk: z.number().min(0).max(100),
  persuasion: z.number().min(0).max(100),
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
  total_score: z.number().min(0).max(100),
  summary: z.string().min(1),
  best_sentence: z.string().min(1),
  weakest_sentence: z.string().min(1),
  perceived_by_other_person: z.string().min(1),
  better_alternatives: z.array(z.string().min(1)).min(3).max(3),
  real_life_tips: z.array(z.string().min(1)).min(3).max(3),
  risks: z.array(z.string().min(1)).min(1).max(5),
});

const outcomeAdviceSchema = z.object({
  situation_analysis: z.string().min(1),
  what_went_well: z.array(z.string().min(1)).min(1).max(5),
  risks: z.array(z.string().min(1)).min(1).max(5),
  next_steps: z.array(z.string().min(1)).min(3).max(3),
  followup_message: z.string().min(1),
  next_conversation_opener: z.string().min(1),
});

const baseSystemPrompt = `
Sen "Ne Desem?" adlı Türkçe konuşma prova uygulamasının server-side AI katmanısın.
Kullanıcıya manipülasyon, taciz, tehdit, şantaj, takip, baskı veya kandırma amaçlı cevap üretme.
Terapi, hukuk, insan kaynakları veya profesyonel danışmanlık iddiasında bulunma.
Özel bilgileri gereksiz tekrar etme. Yanıtların doğal, kısa, uygulanabilir ve Türkçe olsun.
Sadece geçerli JSON döndür; markdown, açıklama metni veya kod bloğu döndürme.
`;

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

async function requestJson<T>(
  messages: ChatMessage[],
  schema: z.ZodType<T>,
): Promise<T> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = getModel();

  if (!apiKey) {
    console.error("AI provider: deepseek", "model:", model, "error:", "missing_api_key");
    throw new AiServiceError();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    console.info("AI provider: deepseek", "model:", model);

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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("AI provider: deepseek", "model:", model, "status:", response.status);
      throw new AiServiceError();
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("AI provider: deepseek", "model:", model, "error:", "empty_content");
      throw new AiServiceError();
    }

    let parsed: unknown;

    try {
      parsed = parseJson(content);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown_parse_error";
      console.error("AI provider: deepseek", "model:", model, "json_parse_error:", message.slice(0, 160));
      throw new AiServiceError();
    }

    const result = schema.safeParse(parsed);

    if (!result.success) {
      console.error(
        "AI provider: deepseek",
        "model:",
        model,
        "json_parse_error:",
        result.error.issues[0]?.message || "schema_validation_failed",
      );
      throw new AiServiceError();
    }

    return result.data;
  } catch (error) {
    if (error instanceof AiServiceError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "request_failed";
    console.error("AI provider: deepseek", "model:", model, "error:", message.slice(0, 160));
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
        task: "Zor Mesajlar simülasyonunda karşı tarafın bir sonraki tepkisini ve kullanıcının son cevabının değerlendirmesini üret.",
        required_json_shape: {
          ai_message: "string",
          suggested_replies: { soft: "string", clear: "string", short: "string" },
          scores: {
            clarity: "0-100",
            confidence: "0-100",
            empathy: "0-100",
            boundaries: "0-100",
            naturalness: "0-100",
            risk: "0-100, düşük iyi yüksek kötü",
            persuasion: "0-100",
          },
          feedback: "string",
          better_alternative: "string",
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
        task: "Simülasyon final raporunu üret.",
        required_json_shape: {
          total_score: "0-100",
          summary: "string",
          best_sentence: "string",
          weakest_sentence: "string",
          perceived_by_other_person: "string",
          better_alternatives: ["string", "string", "string"],
          real_life_tips: ["string", "string", "string"],
          risks: ["string"],
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
        task: "Gerçek hayat sonucuna göre ek öneri üret.",
        required_json_shape: {
          situation_analysis: "string",
          what_went_well: ["string"],
          risks: ["string"],
          next_steps: ["string", "string", "string"],
          followup_message: "string",
          next_conversation_opener: "string",
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
  return requestJson<TurnAiResponse>(createTurnMessages(context, userMessage, turnNumber), turnSchema);
}

export async function getDeepSeekFinalReport(
  context: MessageContext,
  turns: Array<{ turnNumber: number; userMessage: string; aiMessage: string }>,
) {
  return requestJson<FinalReport>(createFinalReportMessages(context, turns), finalReportSchema);
}

export async function getDeepSeekOutcomeAdvice(
  context: MessageContext,
  outcome: OutcomeInput,
) {
  return requestJson<OutcomeAdvice>(createOutcomeAdviceMessages(context, outcome), outcomeAdviceSchema);
}
