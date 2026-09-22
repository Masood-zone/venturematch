import { z } from "zod";

const IdSchema = z.string().min(1, "Invalid id").max(191, "Invalid id");

export const AcademicStepSchema = z.object({
  faculty: z.string().min(1).max(100).optional(),
  department: z.string().min(1).max(100).optional(),
  programme: z.string().min(1).max(100).optional(),
  level: z.string().min(1).max(50).optional(),
  expectedGraduationYear: z.number().int().min(2020).max(2035).optional(),
});

export const CapabilityItemSchema = z.object({
  capabilityId: IdSchema,
  proficiency: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
});

export const CapabilitiesStepSchema = z.object({
  capabilities: z.array(CapabilityItemSchema).min(1, "Select at least one capability").max(20),
});

export const InterestsStepSchema = z.object({
  sectorIds: z.array(IdSchema).min(1, "Select at least one sector").max(10),
});

export const PreferencesStepSchema = z.object({
  commitmentLevel: z.enum(["CASUAL", "SIDE_VENTURE", "SERIOUS", "FULL_TIME"]).optional(),
  preferredRoleCategory: z.string().max(100).optional(),
  ventureGoal: z.string().max(100).optional(),
  structuredVsFlexible: z.number().int().min(1).max(5).optional(),
  independentVsCollaborative: z.number().int().min(1).max(5).optional(),
  fastVsDeliberate: z.number().int().min(1).max(5).optional(),
  weeklyHoursBand: z.enum(["2-5", "5-10", "10-20", "20+"]).optional(),
  timezone: z.string().max(50).optional(),
});

export const UpdateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  discoverability: z.boolean().optional(),
  availabilityStatus: z.string().max(50).optional(),
});

export const AddCapabilityEvidenceSchema = z.object({
  studentCapabilityId: IdSchema,
  type: z.enum(["FILE", "LINK", "TEXT"]),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  cloudinaryPublicId: z.string().optional(),
  url: z.string().url().optional(),
  linkUrl: z.string().url().optional(),
});

export const DiscoverPeopleSchema = z.object({
  capabilityIds: z.array(IdSchema).optional(),
  sectorIds: z.array(IdSchema).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(50).default(20),
});

export type AcademicStepInput = z.infer<typeof AcademicStepSchema>;
export type CapabilitiesStepInput = z.infer<typeof CapabilitiesStepSchema>;
export type InterestsStepInput = z.infer<typeof InterestsStepSchema>;
export type PreferencesStepInput = z.infer<typeof PreferencesStepSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
