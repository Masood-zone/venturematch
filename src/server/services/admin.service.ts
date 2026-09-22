import { adminRepository } from "@/server/repositories/admin.repository";
import { venturesRepository } from "@/server/repositories/ventures.repository";
import { ok, err, type ServiceResult } from "@/lib/errors";

export const adminService = {
  async getPlatformStats() {
    return ok(await adminRepository.getPlatformStats());
  },

  async listUsers(filters: {
    role?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { page = 1, pageSize = 25 } = filters;
    const offset = (page - 1) * pageSize;
    const [users, total] = await Promise.all([
      adminRepository.listUsers({ ...filters, limit: pageSize, offset }),
      adminRepository.countUsers(filters),
    ]);
    return ok({ users, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  },

  async getUserDetail(userId: string) {
    const user = await adminRepository.getUserDetail(userId);
    if (!user) return err("User not found", "NOT_FOUND");
    return ok(user);
  },

  async updateUserRole(
    adminId: string,
    userId: string,
    role: string
  ): Promise<ServiceResult<boolean>> {
    const validRoles = ["student", "admin", "moderator", "verifier"];
    if (!validRoles.includes(role)) return err("Invalid role", "VALIDATION_ERROR");
    await adminRepository.updateUserRole(userId, role);
    await adminRepository.createAuditLog({
      actorUserId: adminId,
      action: "USER_ROLE_UPDATED",
      entityType: "user",
      entityId: userId,
      afterJson: JSON.stringify({ role }),
    });
    return ok(true);
  },

  async suspendUser(adminId: string, userId: string, reason: string): Promise<ServiceResult<boolean>> {
    await adminRepository.createAuditLog({
      actorUserId: adminId,
      action: "USER_SUSPENDED",
      entityType: "user",
      entityId: userId,
      metadataJson: JSON.stringify({ reason }),
    });
    return ok(true);
  },

  async listVentures(filters: {
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { page = 1, pageSize = 25 } = filters;
    const offset = (page - 1) * pageSize;
    const [ventures, total] = await Promise.all([
      venturesRepository.findForAdmin({ ...filters, limit: pageSize, offset }),
      venturesRepository.countForAdmin(filters),
    ]);
    return ok({ ventures, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  },

  async getVentureDetail(ventureId: string) {
    const venture = await venturesRepository.findById(ventureId);
    if (!venture) return err("Venture not found", "NOT_FOUND");
    return ok(venture);
  },

  async updateVentureStatus(
    adminId: string,
    ventureId: string,
    status: string,
    reason?: string
  ): Promise<ServiceResult<boolean>> {
    await venturesRepository.update(ventureId, { status });
    await adminRepository.createAuditLog({
      actorUserId: adminId,
      action: "VENTURE_STATUS_UPDATED",
      entityType: "venture",
      entityId: ventureId,
      afterJson: JSON.stringify({ status, reason }),
    });
    return ok(true);
  },

  async listReports(filters: { status?: string; page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 25 } = filters;
    const offset = (page - 1) * pageSize;
    const [reports, total] = await Promise.all([
      adminRepository.listReports({ ...filters, limit: pageSize, offset }),
      adminRepository.countReports(filters),
    ]);
    return ok({ reports, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  },

  async resolveReport(
    adminId: string,
    reportId: string,
    action: string,
    reason?: string
  ): Promise<ServiceResult<boolean>> {
    await adminRepository.updateReportStatus(reportId, "RESOLVED");
    await adminRepository.createModerationAction({ reportId, adminUserId: adminId, action, reason });
    await adminRepository.createAuditLog({
      actorUserId: adminId,
      action: "REPORT_RESOLVED",
      entityType: "report",
      entityId: reportId,
      metadataJson: JSON.stringify({ action, reason }),
    });
    return ok(true);
  },

  async dismissReport(adminId: string, reportId: string): Promise<ServiceResult<boolean>> {
    await adminRepository.updateReportStatus(reportId, "DISMISSED");
    await adminRepository.createAuditLog({
      actorUserId: adminId,
      action: "REPORT_DISMISSED",
      entityType: "report",
      entityId: reportId,
    });
    return ok(true);
  },

  async addNote(adminId: string, entityType: string, entityId: string, text: string) {
    return ok(await adminRepository.addAdminNote({ entityType, entityId, adminUserId: adminId, text }));
  },

  async getSystemSettings() {
    return ok(await adminRepository.getAllSettings());
  },

  async updateSystemSetting(adminId: string, key: string, value: string): Promise<ServiceResult<boolean>> {
    await adminRepository.setSetting(key, value, adminId);
    await adminRepository.createAuditLog({
      actorUserId: adminId,
      action: "SYSTEM_SETTING_UPDATED",
      entityType: "system_setting",
      entityId: key,
      afterJson: JSON.stringify({ value }),
    });
    return ok(true);
  },

  async getAuditLogs(filters: { entityType?: string; entityId?: string; page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 25 } = filters;
    const offset = (page - 1) * pageSize;
    const logs = await adminRepository.getAuditLogs({ ...filters, limit: pageSize, offset });
    return ok(logs);
  },

  async createSupportTicket(data: {
    userId: string;
    category: string;
    subject: string;
    description: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
  }) {
    const ticket = await adminRepository.createSupportTicket(data);
    return ok(ticket);
  },

  async listSupportTickets(filters: { status?: string; page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 25 } = filters;
    const offset = (page - 1) * pageSize;
    const tickets = await adminRepository.listSupportTickets({ ...filters, limit: pageSize, offset });
    return ok(tickets);
  },
};
