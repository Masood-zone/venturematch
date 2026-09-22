import { z } from "zod";

const IdSchema = z.string().regex(new RegExp("^[a-z0-9]{20,32}$", "i"), "Invalid id");

export const CreateVentureSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  shortPitch: z.string().max(280, "Short pitch must be under 280 characters").optional(),
  stage: z.enum(["IDEA", "VALIDATION", "PROTOTYPE", "EARLY_LAUNCH", "OPERATE"]).optional(),
  primarySectorId: IdSchema.optional(),
  expectedCommitment: z.enum(["CASUAL", "SIDE_VENTURE", "SERIOUS", "FULL_TIME"]).optional(),
});

export const UpdateVentureSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  shortPitch: z.string().max(280).optional(),
  problem: z.string().max(2000).optional(),
  solution: z.string().max(2000).optional(),
  targetUsers: z.string().max(1000).optional(),
  primarySectorId: IdSchema.optional().nullable(),
  secondarySectorId: IdSchema.optional().nullable(),
  stage: z.enum(["IDEA", "VALIDATION", "PROTOTYPE", "EARLY_LAUNCH", "OPERATE"]).optional(),
  ambition: z.string().max(500).optional(),
  expectedCommitment: z.enum(["CASUAL", "SIDE_VENTURE", "SERIOUS", "FULL_TIME"]).optional(),
  logoUrl: z.string().url().optional(),
  logoPublicId: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"]).optional(),
});

export const CapabilityRequirementSchema = z.object({
  capabilityId: IdSchema,
  importanceScore: z.number().int().min(1).max(10),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
});

export const SetCapabilityRequirementsSchema = z.object({
  ventureId: IdSchema,
  requirements: z.array(CapabilityRequirementSchema).max(20),
});

export const AddMilestoneSchema = z.object({
  stage: z.enum(["IDEA", "VALIDATION", "PROTOTYPE", "EARLY_LAUNCH", "OPERATE"]),
  title: z.string().min(2).max(200),
  objective: z.string().max(1000).optional(),
  expectedOutcome: z.string().max(1000).optional(),
  dueAt: z.string().datetime().optional(),
});

export const UpdateMilestoneSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "OVERDUE"]).optional(),
  progressCurrent: z.number().int().min(0).max(100).optional(),
  dueAt: z.string().datetime().optional(),
});

export const AddContributionSchema = z.object({
  milestoneId: IdSchema.optional(),
  category: z.string().min(1).max(100),
  title: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  evidenceUrl: z.string().url().optional(),
});

export const UpdateCharterSchema = z.object({
  meetingFrequency: z.string().max(100).optional(),
  communicationMethod: z.string().max(100).optional(),
  decisionMethod: z.string().max(100).optional(),
  expectationsText: z.string().max(2000).optional(),
});

export const DiscoverVenturesSchema = z.object({
  sectorId: IdSchema.optional(),
  stage: z.enum(["IDEA", "VALIDATION", "PROTOTYPE", "EARLY_LAUNCH", "OPERATE"]).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(20),
});

export type CreateVentureInput = z.infer<typeof CreateVentureSchema>;
export type UpdateVentureInput = z.infer<typeof UpdateVentureSchema>;
export type SetCapabilityRequirementsInput = z.infer<typeof SetCapabilityRequirementsSchema>;
export type AddMilestoneInput = z.infer<typeof AddMilestoneSchema>;
export type AddContributionInput = z.infer<typeof AddContributionSchema>;
export type UpdateCharterInput = z.infer<typeof UpdateCharterSchema>;
