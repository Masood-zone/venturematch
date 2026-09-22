import { z } from "zod";

const IdSchema = z.string().regex(new RegExp("^[a-z0-9]{20,32}$", "i"), "Invalid id");

export const StartTrialSchema = z.object({
  ventureId: IdSchema,
  objective: z.string().max(1000).optional(),
  durationDays: z.number().int().min(3).max(30).default(7),
  participantUserIds: z.array(IdSchema).min(1, "At least one participant required"),
});

export const AddTrialTaskSchema = z.object({
  trialId: IdSchema,
  title: z.string().min(2).max(200),
  purpose: z.string().max(1000).optional(),
  assigneeUserId: IdSchema.optional(),
  dueAt: z.string().datetime().optional(),
});

export const UpdateTaskStatusSchema = z.object({
  taskId: IdSchema,
  status: z.enum(["PENDING", "IN_PROGRESS", "SUBMITTED", "COMPLETED"]),
  progress: z.number().int().min(0).max(100).optional(),
});

export const SubmitEvidenceSchema = z.object({
  taskId: IdSchema,
  type: z.enum(["TEXT", "FILE", "LINK"]),
  textValue: z.string().max(5000).optional(),
  url: z.string().url().optional(),
  cloudinaryPublicId: z.string().optional(),
});

export const SubmitTrialReviewSchema = z.object({
  trialId: IdSchema,
  communicationScore: z.number().int().min(1).max(5),
  reliabilityScore: z.number().int().min(1).max(5),
  contributionScore: z.number().int().min(1).max(5),
  commitmentScore: z.number().int().min(1).max(5),
  goalAlignmentScore: z.number().int().min(1).max(5),
  workedWellText: z.string().max(2000).optional(),
  concernsText: z.string().max(2000).optional(),
  decision: z.enum(["CONTINUE", "EXTEND", "STOP"]),
});

export type StartTrialInput = z.infer<typeof StartTrialSchema>;
export type AddTrialTaskInput = z.infer<typeof AddTrialTaskSchema>;
export type SubmitTrialReviewInput = z.infer<typeof SubmitTrialReviewSchema>;
