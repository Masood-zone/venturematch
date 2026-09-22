import { z } from "zod";

export const StartTrialSchema = z.object({
  ventureId: z.string().cuid(),
  objective: z.string().max(1000).optional(),
  durationDays: z.number().int().min(3).max(30).default(7),
  participantUserIds: z.array(z.string().cuid()).min(1, "At least one participant required"),
});

export const AddTrialTaskSchema = z.object({
  trialId: z.string().cuid(),
  title: z.string().min(2).max(200),
  purpose: z.string().max(1000).optional(),
  assigneeUserId: z.string().cuid().optional(),
  dueAt: z.string().datetime().optional(),
});

export const UpdateTaskStatusSchema = z.object({
  taskId: z.string().cuid(),
  status: z.enum(["PENDING", "IN_PROGRESS", "SUBMITTED", "COMPLETED"]),
  progress: z.number().int().min(0).max(100).optional(),
});

export const SubmitEvidenceSchema = z.object({
  taskId: z.string().cuid(),
  type: z.enum(["TEXT", "FILE", "LINK"]),
  textValue: z.string().max(5000).optional(),
  url: z.string().url().optional(),
  cloudinaryPublicId: z.string().optional(),
});

export const SubmitTrialReviewSchema = z.object({
  trialId: z.string().cuid(),
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
