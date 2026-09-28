import { z } from 'zod';

export const attitudeSchema = z.enum(['VULNERABLE', 'HESITANT', 'CAUTIOUS', 'DEFENSIVE']);
export type StudentAttitude = z.infer<typeof attitudeSchema>;

export const phishingOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  attitude: attitudeSchema,
  feedbackNote: z.string().optional(),
});
export type PhishingOptionDTO = z.infer<typeof phishingOptionSchema>;

export const chatSenderSchema = z.enum(['ATTACKER', 'STUDENT', 'LEO']);
export type ChatSender = z.infer<typeof chatSenderSchema>;

export const chatMessageSchema = z.object({
  id: z.string(),
  sender: chatSenderSchema,
  text: z.string().min(1),
  timestamp: z.string(),
  isWarningSignal: z.boolean().optional(),
  warningTitle: z.string().optional(),
  warningExplanation: z.string().optional(),
});
export type ChatMessageDTO = z.infer<typeof chatMessageSchema>;

export const chatStatusSchema = z.enum(['IN_PROGRESS', 'ESCALATED', 'DEFENDED']);
export type ChatStatus = z.infer<typeof chatStatusSchema>;

export const startPhishingRequestSchema = z.object({
  scenarioCount: z.union([z.literal(3), z.literal(5)]).default(3),
  difficulty: z.enum(['EASY', 'MEDIUM']).default('EASY'),
});
export type StartPhishingRequestDTO = z.infer<typeof startPhishingRequestSchema>;

export const phishingStepResponseSchema = z.object({
  chatId: z.string(),
  scenarioIndex: z.number(),
  totalScenarios: z.number(),
  scenarioTitle: z.string(),
  scenarioContext: z.string(),
  status: chatStatusSchema,
  messages: z.array(chatMessageSchema),
  options: z.array(phishingOptionSchema).optional(),
  statusMessage: z.string().optional(),
  providerUsed: z.string().optional(),
});
export type PhishingStepResponseDTO = z.infer<typeof phishingStepResponseSchema>;

export const replyPhishingRequestSchema = z.object({
  chatId: z.string().uuid(),
  selectedOptionId: z.string(),
});
export type ReplyPhishingRequestDTO = z.infer<typeof replyPhishingRequestSchema>;

export const warningSignalReviewSchema = z.object({
  quote: z.string(),
  type: z.string(),
  explanation: z.string(),
  protectionTip: z.string(),
});
export type WarningSignalReviewDTO = z.infer<typeof warningSignalReviewSchema>;

export const phishingReviewSchema = z.object({
  chatId: z.string(),
  scenarioTitle: z.string(),
  outcome: chatStatusSchema,
  signals: z.array(warningSignalReviewSchema),
  goldenRule: z.string(),
  leoSummary: z.string(),
  providerUsed: z.string().optional(),
});
export type PhishingReviewDTO = z.infer<typeof phishingReviewSchema>;
