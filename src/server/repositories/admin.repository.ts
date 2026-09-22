import { db } from "@/lib/db";

export const adminRepository = {
  // Users
  async listUsers(filters: {
    role?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const { role, search, limit = 25, offset = 0 } = filters;
    return db.user.findMany({
      where: {
        ...(role ? { role } : {}),
        ...(search
          ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] }
          : {}),
      },
      include: {
        studentProfile: true,
        adminProfile: true,
        _count: { select: { ownedVentures: true, sentMessages: true } },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
  },

  async countUsers(filters: { role?: string; search?: string }) {
    return db.user.count({
      where: {
        ...(filters.role ? { role: filters.role } : {}),
        ...(filters.search
          ? { OR: [{ name: { contains: filters.search } }, { email: { contains: filters.search } }] }
          : {}),
      },
    });
  },

  async getUserDetail(userId: string) {
    return db.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: {
            academicProfile: true,
            capabilities: { include: { capability: true } },
            ventureInterests: { include: { sector: true } },
            founderPreference: true,
            availability: true,
          },
        },
        adminProfile: true,
        ownedVentures: { select: { id: true, name: true, status: true } },
        ventureMembers: { include: { venture: { select: { id: true, name: true } } } },
        reports: { orderBy: { createdAt: "desc" }, take: 5 },
        adminNotes: {
          where: { entityType: "user" },
          include: { admin: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  async updateUserRole(userId: string, role: string) {
    return db.user.update({ where: { id: userId }, data: { role } });
  },

  // Reports & Moderation
  async listReports(filters: {
    status?: string;
    entityType?: string;
    limit?: number;
    offset?: number;
  }) {
    const { entityType, limit = 25, offset = 0 } = filters;
    return db.report.findMany({
      where: {
        ...(filters.status ? { status: filters.status as never } : {}),
        ...(entityType ? { entityType } : {}),
      },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        moderationActions: {
          include: { admin: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
  },

  async countReports(filters: { status?: string }) {
    return db.report.count({
      where: filters.status ? { status: filters.status as never } : {},
    });
  },

  async updateReportStatus(id: string, status: string) {
    return db.report.update({
      where: { id },
      data: { status: status as never },
    });
  },

  async createModerationAction(data: {
    reportId?: string;
    adminUserId: string;
    action: string;
    reason?: string;
  }) {
    return db.moderationAction.create({ data });
  },

  async addAdminNote(data: {
    entityType: string;
    entityId: string;
    adminUserId: string;
    text: string;
  }) {
    return db.adminNote.create({ data });
  },

  async createAuditLog(data: {
    actorUserId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    beforeJson?: string;
    afterJson?: string;
    metadataJson?: string;
  }) {
    return db.auditLog.create({ data });
  },

  async getAuditLogs(filters: {
    entityType?: string;
    entityId?: string;
    limit?: number;
    offset?: number;
  }) {
    const { entityType, entityId, limit = 25, offset = 0 } = filters;
    return db.auditLog.findMany({
      where: {
        ...(entityType ? { entityType } : {}),
        ...(entityId ? { entityId } : {}),
      },
      include: {
        actor: { select: { id: true, name: true } },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
  },

  // Support Tickets
  async createSupportTicket(data: {
    userId: string;
    category: string;
    subject: string;
    description: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    priority?: string;
  }) {
    return db.supportTicket.create({ data: data as never });
  },

  async listSupportTickets(filters: {
    status?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }) {
    const { userId, limit = 25, offset = 0 } = filters;
    return db.supportTicket.findMany({
      where: {
        ...(filters.status ? { status: filters.status as never } : {}),
        ...(userId ? { userId } : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
  },

  async updateSupportTicketStatus(id: string, status: string) {
    return db.supportTicket.update({
      where: { id },
      data: { status: status as never },
    });
  },

  // System Settings
  async getSetting(key: string) {
    return db.systemSetting.findUnique({ where: { key } });
  },

  async setSetting(key: string, value: string, updatedBy: string) {
    return db.systemSetting.upsert({
      where: { key },
      update: { value, updatedBy },
      create: { key, value, updatedBy },
    });
  },

  async getAllSettings() {
    return db.systemSetting.findMany({ orderBy: { key: "asc" } });
  },

  // Stats
  async getPlatformStats() {
    const [
      totalUsers,
      totalVentures,
      activeVentures,
      pendingReports,
      openTickets,
    ] = await Promise.all([
      db.user.count(),
      db.venture.count(),
      db.venture.count({ where: { status: "ACTIVE" } }),
      db.report.count({ where: { status: "PENDING" } }),
      db.supportTicket.count({ where: { status: "OPEN" } }),
    ]);
    return { totalUsers, totalVentures, activeVentures, pendingReports, openTickets };
  },
};
