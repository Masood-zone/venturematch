import { z } from "zod";

const IdSchema = z.string().regex(new RegExp("^[a-z0-9]{20,32}$", "i"), "Invalid id");

export const StartConversationSchema = z.object({
  otherUserId: IdSchema,
});

export const SendMessageSchema = z.object({
  conversationId: IdSchema,
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
  conversationId: IdSchema,
  limit: z.number().int().min(1).max(100).default(50),
  before: z.string().datetime().optional(),
});

export type SendMessageInput = z.infer<typeof SendMessageSchema>;
