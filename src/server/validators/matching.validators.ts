import { z } from "zod";

export const SendInvitationSchema = z.object({
  ventureId: z.string().cuid(),
  recipientUserId: z.string().cuid(),
  proposedRole: z.string().max(100).optional(),
  expectedCommitment: z.enum(["CASUAL", "SIDE_VENTURE", "SERIOUS", "FULL_TIME"]).optional(),
  message: z.string().max(1000).optional(),
  recommendationId: z.string().cuid().optional(),
});

export const RespondInvitationSchema = z.object({
  invitationId: z.string().cuid(),
  response: z.enum(["INTERESTED", "DECLINED"]),
});

export const ProposeTrialSchema = z.object({
  invitationId: z.string().cuid(),
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
  ventureId: z.string().cuid(),
});

export type SendInvitationInput = z.infer<typeof SendInvitationSchema>;
export type RespondInvitationInput = z.infer<typeof RespondInvitationSchema>;
export type CreateMatchingConfigInput = z.infer<typeof CreateMatchingConfigSchema>;
