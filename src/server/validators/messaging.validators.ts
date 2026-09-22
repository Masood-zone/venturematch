import { z } from "zod";

export const StartConversationSchema = z.object({
  otherUserId: z.string().cuid(),
});

export const SendMessageSchema = z.object({
  conversationId: z.string().cuid(),
  body: z.string().max(5000),
  attachments: z
    .array(
      z.object({
        url: z.string().url(),
        resourceType: z.string().max(50),
        bytes: z.number().int().optional(),
        cloudinaryPublicId: z.string().optional(),
      })
    )
    .max(5)
    .optional(),
});

export const GetMessagesSchema = z.object({
  conversationId: z.string().cuid(),
  limit: z.number().int().min(1).max(100).default(50),
  before: z.string().datetime().optional(),
});

export type SendMessageInput = z.infer<typeof SendMessageSchema>;
