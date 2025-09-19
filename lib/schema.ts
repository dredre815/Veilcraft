import { z } from "zod";

export const OrientationSchema = z.enum(["upright", "reversed"]);
export type Orientation = z.infer<typeof OrientationSchema>;

export const EvidenceSchema = z.object({
  cardId: z.string(),
  orientation: OrientationSchema,
  positionId: z.string(),
  quotes: z.array(z.string().min(1)).min(1).max(3),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export const CardReadSchema = z.object({
  cardId: z.string(),
  name: z.string(),
  orientation: OrientationSchema,
  positionId: z.string(),
  summary: z.string().min(10).max(240),
  keyFactors: z.array(z.string().min(4)).min(1).max(5),
  advice: z.string().min(10).max(240),
  evidence: z.array(EvidenceSchema).min(1),
});
export type CardRead = z.infer<typeof CardReadSchema>;

export const ReadingSchema = z.object({
  question: z.string().min(1),
  spreadId: z.string(),
  overview: z.string().min(30).max(400),
  theme: z.array(z.string().min(1)).min(1).max(5),
  cards: z.array(CardReadSchema).min(1),
  actionItems: z.array(z.string().min(5)).min(1).max(5),
  cautions: z.array(z.string().min(5)).min(1).max(3),
  disclaimer: z.string().min(10).max(200),
});
export type Reading = z.infer<typeof ReadingSchema>;

export const QuestionDetailSchema = z.object({
  text: z.string().min(5).max(400),
  category: z.string().min(1),
  tone: z.string().min(1),
  language: z.string().min(1),
});
export type QuestionDetail = z.infer<typeof QuestionDetailSchema>;

export const InterpretCardInputSchema = z.object({
  cardId: z.string(),
  positionId: z.string(),
  orientation: OrientationSchema,
});
export type InterpretCardInput = z.infer<typeof InterpretCardInputSchema>;

export const InterpretRequestSchema = z.object({
  seed: z.string().min(1),
  spreadId: z.string(),
  question: QuestionDetailSchema,
  cards: z.array(InterpretCardInputSchema).min(1),
});
export type InterpretRequest = z.infer<typeof InterpretRequestSchema>;

export const ShareRequestSchema = z
  .object({
    seed: z.string().min(1),
    spreadId: z.string().min(1),
    question: QuestionDetailSchema,
    cards: z.array(InterpretCardInputSchema).min(1),
    reading: ReadingSchema,
  })
  .refine((payload) => payload.reading.spreadId === payload.spreadId, {
    message: "Reading spread does not match payload spreadId",
    path: ["reading", "spreadId"],
  })
  .refine((payload) => payload.reading.question === payload.question.text, {
    message: "Reading question does not match payload question",
    path: ["reading", "question"],
  });
export type ShareRequest = z.infer<typeof ShareRequestSchema>;

export const FeedbackRequestSchema = z.object({
  readingId: z.string().min(1),
  score: z.number().int().min(1).max(5),
  tags: z.array(z.string().min(1)).max(6).optional(),
  comment: z.string().trim().max(400).optional(),
});
export type FeedbackRequest = z.infer<typeof FeedbackRequestSchema>;
