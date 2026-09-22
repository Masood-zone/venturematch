import { db } from "@/lib/db";

export const notificationsRepository = {
  async create(data: {
    userId: string;
    type: string;
    title: string;
    body: string;
    entityType?: string;
    entityId?: string;
  }) {
    return db.notification.create({ data });
  },

  async createMany(notifications: Array<{
    userId: string;
    type: string;
    title: string;
    body: string;
    entityType?: string;
    entityId?: string;
  }>) {
    return db.notification.createMany({ data: notifications });
  },

  async getForUser(userId: string, options: { unreadOnly?: boolean; limit?: number; offset?: number } = {}) {
    const { unreadOnly = false, limit = 30, offset = 0 } = options;
    return db.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { readAt: null } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });
  },

  async countUnread(userId: string) {
    return db.notification.count({
      where: { userId, readAt: null },
    });
  },

  async markRead(id: string, userId: string) {
    return db.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });
  },

  async markAllRead(userId: string) {
    return db.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  },

  async delete(id: string, userId: string) {
    return db.notification.deleteMany({
      where: { id, userId },
    });
  },
};
