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
  difficultyReason: z.string().trim().min(2).max(200),
  goal: z.string().trim().min(2).max(160),
  tone: z.string().trim().min(2).max(80),
  replyLength: z.string().trim().min(2).max(80),
  preserveRelationship: z.string().trim().min(2).max(80),
  fear: z.string().trim().min(2).max(240),
});

export const createSimulationSchema = z.object({
  category: z.literal("zor_mesajlar"),
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
