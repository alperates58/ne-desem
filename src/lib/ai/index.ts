import type { MessageContext, OutcomeInput } from "@/lib/types";
import {
  getDeepSeekInitialResponse,
  getDeepSeekFinalReport,
  getDeepSeekOutcomeAdvice,
  getDeepSeekTurnResponse,
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

export async function getInitialResponse(context: MessageContext) {
  if (aiMode === "deepseek") {
    return getDeepSeekInitialResponse(context);
  }

  return { ai_message: createOpeningMessage(context) };
}

type ConversationMessage = {
  role: "ai" | "user";
  content: string;
};

export async function getTurnResponse(
  context: MessageContext,
  userMessage: string,
  turnNumber: number,
  conversation: ConversationMessage[] = [],
) {
  if (aiMode === "deepseek") {
    return getDeepSeekTurnResponse(context, userMessage, turnNumber, conversation);
  }

  return generateTurnResponse(context, userMessage, turnNumber);
}

export async function getFinalReport(
  context: MessageContext,
  turns: Parameters<typeof generateFinalReport>[1],
) {
  if (aiMode === "deepseek") {
    return getDeepSeekFinalReport(
      context,
      turns.map((turn) => ({
        turnNumber: turn.turnNumber,
        userMessage: turn.userMessage,
        aiMessage: turn.aiMessage,
      })),
    );
  }

  return generateFinalReport(context, turns);
}

export async function getOutcomeAdvice(context: MessageContext, outcome: OutcomeInput) {
  if (aiMode === "deepseek") {
    return getDeepSeekOutcomeAdvice(context, outcome);
  }

  return generateOutcomeAdvice(context, outcome);
}
