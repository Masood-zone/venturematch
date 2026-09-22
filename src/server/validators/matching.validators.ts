import { z } from "zod";

const IdSchema = z.string().regex(new RegExp("^[a-z0-9]{20,32}$", "i"), "Invalid id");

export const SendInvitationSchema = z.object({
  ventureId: IdSchema,
  recipientUserId: IdSchema,
  proposedRole: z.string().max(100).optional(),
  expectedCommitment: z.enum(["CASUAL", "SIDE_VENTURE", "SERIOUS", "FULL_TIME"]).optional(),
  message: z.string().max(1000).optional(),
  recommendationId: IdSchema.optional(),
});

export const RespondInvitationSchema = z.object({
  invitationId: IdSchema,
  response: z.enum(["INTERESTED", "DECLINED"]),
});

export const ProposeTrialSchema = z.object({
  invitationId: IdSchema,
});

export const CreateMatchingConfigSchema = z.object({
  capabilityWeight: z.number().min(0).max(1),
  interestWeight: z.number().min(0).max(1),
  commitmentWeight: z.number().min(0).max(1),
  availabilityWeight: z.number().min(0).max(1),
  goalWeight: z.number().min(0).max(1),
  workingStyleWeight: z.number().min(0).max(1),
  evidenceWeight: z.number().min(0).max(1),
}).refine(
  data => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    return Math.abs(total - 1.0) < 0.01;
  },
  { message: "Weights must sum to 1.0" }
);

export const RunMatchingSchema = z.object({
  ventureId: IdSchema,
});

export type SendInvitationInput = z.infer<typeof SendInvitationSchema>;
export type RespondInvitationInput = z.infer<typeof RespondInvitationSchema>;
export type CreateMatchingConfigInput = z.infer<typeof CreateMatchingConfigSchema>;
