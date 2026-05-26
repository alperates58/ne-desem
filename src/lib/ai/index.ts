import type { MessageContext, OutcomeInput } from "@/lib/types";
import {
  getDeepSeekFinalReport,
  getDeepSeekOutcomeAdvice,
  getDeepSeekTurnResponse,
  isDeepSeekConfigured,
} from "@/lib/ai/deepseek";
import {
  createOpeningMessage,
  generateFinalReport,
  generateOutcomeAdvice,
  generateTurnResponse,
} from "@/lib/ai/mock";

export const aiMode = process.env.AI_MODE === "deepseek" ? "deepseek" : "mock";

export function getOpeningMessage(context: MessageContext) {
  return createOpeningMessage(context);
}

export async function getTurnResponse(
  context: MessageContext,
  userMessage: string,
  turnNumber: number,
) {
  const fallback = generateTurnResponse(context, userMessage, turnNumber);

  if (aiMode === "deepseek" && isDeepSeekConfigured()) {
    return getDeepSeekTurnResponse(context, userMessage, turnNumber, fallback);
  }

  return fallback;
}

export async function getFinalReport(
  context: MessageContext,
  turns: Parameters<typeof generateFinalReport>[1],
) {
  const fallback = generateFinalReport(context, turns);

  if (aiMode === "deepseek" && isDeepSeekConfigured()) {
    return getDeepSeekFinalReport(
      context,
      turns.map((turn) => ({
        turnNumber: turn.turnNumber,
        userMessage: turn.userMessage,
        aiMessage: turn.aiMessage,
      })),
      fallback,
    );
  }

  return fallback;
}

export async function getOutcomeAdvice(context: MessageContext, outcome: OutcomeInput) {
  const fallback = generateOutcomeAdvice(context, outcome);

  if (aiMode === "deepseek" && isDeepSeekConfigured()) {
    return getDeepSeekOutcomeAdvice(context, outcome, fallback);
  }

  return fallback;
}
