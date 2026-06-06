import type { MessageContext, OutcomeInput } from "@/lib/types";
import {
  getDeepSeekFinalReport,
  getDeepSeekOutcomeAdvice,
  getDeepSeekTurnResponse,
  getDeepSeekOpeningMessage,
  getDeepSeekSimulationBrief,
} from "@/lib/ai/deepseek";
import {
  getGeminiFinalReport,
  getGeminiOutcomeAdvice,
  getGeminiTurnResponse,
  getGeminiOpeningMessage,
  getGeminiSimulationBrief,
} from "@/lib/ai/gemini";
import {
  getOpenAiFinalReport,
  getOpenAiOutcomeAdvice,
  getOpenAiTurnResponse,
  getOpenAiOpeningMessage,
  getOpenAiSimulationBrief,
} from "@/lib/ai/openai";
import {
  createOpeningMessage,
  generateFinalReport,
  generateOutcomeAdvice,
  generateTurnResponse,
  generateSimulationBrief,
} from "@/lib/ai/mock";

export function getAiMode(): "gemini" | "openai" | "deepseek" | "mock" {
  if (process.env.AI_MODE) {
    const mode = process.env.AI_MODE.toLowerCase();
    if (mode === "gemini" || mode === "openai" || mode === "deepseek" || mode === "mock") {
      return mode as "gemini" | "openai" | "deepseek" | "mock";
    }
  }

  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.DEEPSEEK_API_KEY) return "deepseek";
  if (process.env.OPENAI_API_KEY) return "openai";

  return "mock";
}

export function getOpeningMessage(context: MessageContext) {
  return createOpeningMessage(context);
}

export async function getAiOpeningMessage(category: string, context: MessageContext): Promise<string> {
  if (context.initiatedBy === "user") {
    return "";
  }
  const mode = getAiMode();

  try {
    if (mode === "gemini") {
      const res = await getGeminiOpeningMessage(category, context);
      return res.opening_message;
    }
    if (mode === "openai") {
      const res = await getOpenAiOpeningMessage(category, context);
      return res.opening_message;
    }
    if (mode === "deepseek") {
      const res = await getDeepSeekOpeningMessage(category, context);
      return res.opening_message;
    }
  } catch (error) {
    console.error(
      `[AI Fallback] Primary AI (${mode}) failed for getAiOpeningMessage. Falling back to raw incomingMessage. Error:`,
      error,
    );
  }

  // Mock / Catch-all Fallback
  if (context.incomingMessage.length > 100 || context.incomingMessage.includes("geliştirdim ancak") || context.incomingMessage.includes("istiyorum")) {
    const other = context.otherPerson || "Karşı taraf";
    const goal = context.goal || "konuyu konuşmak";
    if (other.toLowerCase().includes("patron") || other.toLowerCase().includes("yönetici") || other.toLowerCase().includes("müdür")) {
      return `Merhaba, bu konuyu (özellikle ${goal.toLowerCase()}) benimle görüşmek istemişsin. Dinliyorum, ne söylemek istersin?`;
    }
    if (other.toLowerCase().includes("flört") || other.toLowerCase().includes("sevgili")) {
      return `Selam, bir süredir aramızdaki durum (${goal.toLowerCase()}) hakkında konuşmak istiyordun sanırım. Seni dinliyorum.`;
    }
    if (other.toLowerCase().includes("ev sahibi")) {
      return `Merhaba, kira/kira artış durumu hakkında konuşmak istemişsin. Seni dinliyorum, ne düşünüyorsun?`;
    }
    return `Selam, bu durum (${goal.toLowerCase()}) hakkında konuşmak istemişsin. Dinliyorum, ne söylemek istersin?`;
  }

  return context.incomingMessage;
}

export async function getAiSimulationBrief(category: string, context: MessageContext): Promise<string> {
  const mode = getAiMode();

  try {
    if (mode === "gemini") {
      const res = await getGeminiSimulationBrief(category, context);
      return res.simulation_brief;
    }
    if (mode === "openai") {
      const res = await getOpenAiSimulationBrief(category, context);
      return res.simulation_brief;
    }
    if (mode === "deepseek") {
      const res = await getDeepSeekSimulationBrief(category, context);
      return res.simulation_brief;
    }
  } catch (error) {
    console.error(
      `[AI Fallback] Primary AI (${mode}) failed for getAiSimulationBrief. Falling back to Mock. Error:`,
      error,
    );
  }

  return generateSimulationBrief(category, context);
}

type ConversationMessage = {
  role: "ai" | "user";
  content: string;
};

export async function getTurnResponse(
  category: string,
  context: MessageContext,
  userMessage: string,
  turnNumber: number,
  conversation: ConversationMessage[] = [],
) {
  const mode = getAiMode();

  try {
    if (mode === "gemini") {
      return await getGeminiTurnResponse(category, context, userMessage, turnNumber, conversation);
    }
    if (mode === "openai") {
      return await getOpenAiTurnResponse(category, context, userMessage, turnNumber, conversation);
    }
    if (mode === "deepseek") {
      return await getDeepSeekTurnResponse(category, context, userMessage, turnNumber, conversation);
    }
  } catch (error) {
    console.error(
      `[AI Fallback] Primary AI (${mode}) failed for getTurnResponse. Falling back to Mock mode. Error:`,
      error,
    );
  }

  return generateTurnResponse(category, context, userMessage, turnNumber);
}

export async function getFinalReport(
  category: string,
  context: MessageContext,
  turns: Parameters<typeof generateFinalReport>[2],
) {
  const mode = getAiMode();

  try {
    if (mode === "gemini") {
      return await getGeminiFinalReport(
        category,
        context,
        turns.map((turn) => ({
          turnNumber: turn.turnNumber,
          userMessage: turn.userMessage,
          aiMessage: turn.aiMessage,
        })),
      );
    }
    if (mode === "openai") {
      return await getOpenAiFinalReport(
        category,
        context,
        turns.map((turn) => ({
          turnNumber: turn.turnNumber,
          userMessage: turn.userMessage,
          aiMessage: turn.aiMessage,
        })),
      );
    }
    if (mode === "deepseek") {
      return await getDeepSeekFinalReport(
        category,
        context,
        turns.map((turn) => ({
          turnNumber: turn.turnNumber,
          userMessage: turn.userMessage,
          aiMessage: turn.aiMessage,
        })),
      );
    }
  } catch (error) {
    console.error(
      `[AI Fallback] Primary AI (${mode}) failed for getFinalReport. Falling back to Mock mode. Error:`,
      error,
    );
  }

  return generateFinalReport(category, context, turns);
}

export async function getOutcomeAdvice(category: string, context: MessageContext, outcome: OutcomeInput) {
  const mode = getAiMode();

  try {
    if (mode === "gemini") {
      return await getGeminiOutcomeAdvice(category, context, outcome);
    }
    if (mode === "openai") {
      return await getOpenAiOutcomeAdvice(category, context, outcome);
    }
    if (mode === "deepseek") {
      return await getDeepSeekOutcomeAdvice(category, context, outcome);
    }
  } catch (error) {
    console.error(
      `[AI Fallback] Primary AI (${mode}) failed for getOutcomeAdvice. Falling back to Mock mode. Error:`,
      error,
    );
  }

  return generateOutcomeAdvice(category, context, outcome);
}

