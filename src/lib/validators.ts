import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Ad en az 2 karakter olmalı.").max(80),
  email: z.string().trim().email("Geçerli bir e-posta yaz."),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı.").max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta yaz."),
  password: z.string().min(1, "Şifreni yaz."),
});

export const messageContextSchema = z.object({
  incomingMessage: z.string().trim().min(3).max(2000),
  otherPerson: z.string().trim().min(2).max(80),
  otherPersonPersonality: z.string().trim().min(2).max(120),
  difficultyReason: z.string().trim().min(2).max(200),
  goal: z.string().trim().min(2).max(160),
  tone: z.string().trim().min(2).max(80),
  replyLength: z.string().trim().min(2).max(80),
  preserveRelationship: z.string().trim().min(2).max(80),
  fear: z.string().trim().min(2).max(240),
  aiOpeningMessage: z.string().trim().optional(),
  otherPersonAttitude: z.string().trim().optional(),
  previouslyDiscussed: z.string().trim().optional(),
  redLine: z.string().trim().optional(),
  relationshipDuration: z.string().trim().optional(),
  avoidAction: z.string().trim().optional(),
  noReplyAction: z.string().trim().optional(),
  closenessLevel: z.string().trim().optional(),
  pastConversations: z.string().trim().optional(),
  financialIssue: z.string().trim().optional(),
  currentAmount: z.string().trim().optional(),
  minAcceptableLevel: z.string().trim().optional(),
  leverageOrAlternative: z.string().trim().optional(),
  noAgreementAction: z.string().trim().optional(),
  initiatedBy: z.enum(["user", "other"]).optional(),
});

export const createSimulationSchema = z.object({
  category: z.enum([
    "is_kariyer",
    "flort_iliski",
    "aile_arkadas",
    "para_pazarlik",
    "egitim_okul",
    "gunluk_yasam",
    "zor_mesajlar",
    "sosyal_medya_dijital"
  ]),
  context: messageContextSchema,
});

export const turnSchema = z.object({
  userMessage: z.string().trim().min(1).max(2000),
});

export const outcomeSchema = z.object({
  whatHappened: z.string().trim().min(3).max(3000),
  otherPersonReaction: z.string().trim().min(2).max(1000),
  goalResult: z.enum(["evet", "kismen", "hayir"]),
  satisfactionScore: z.coerce.number().int().min(1).max(5),
  nextGoal: z.string().trim().min(2).max(1000),
});
