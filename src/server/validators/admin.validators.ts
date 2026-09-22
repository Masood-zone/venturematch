import { z } from "zod";

export const UpdateUserRoleSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(["student", "admin", "moderator", "verifier"]),
});

export const ResolveReportSchema = z.object({
  reportId: z.string().cuid(),
  action: z.string().min(1).max(100),
  reason: z.string().max(1000).optional(),
});

export const UpdateVentureStatusSchema = z.object({
  ventureId: z.string().cuid(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"]),
  reason: z.string().max(500).optional(),
});

export const AddAdminNoteSchema = z.object({
  entityType: z.enum(["user", "venture", "report", "ticket"]),
  entityId: z.string().cuid(),
  text: z.string().min(1).max(2000),
});

export const UpdateSystemSettingSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(5000),
});

export const AdminListQuerySchema = z.object({
  status: z.string().optional(),
  role: z.string().optional(),
  search: z.string().max(200).optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
});

export const CreateSupportTicketSchema = z.object({
  category: z.enum(["ACCOUNT", "VENTURE", "MATCHING", "BILLING", "BUG", "FEATURE", "OTHER"]),
  subject: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  relatedEntityType: z.string().optional(),
  relatedEntityId: z.string().cuid().optional(),
});

export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
export type ResolveReportInput = z.infer<typeof ResolveReportSchema>;
export type CreateSupportTicketInput = z.infer<typeof CreateSupportTicketSchema>;
