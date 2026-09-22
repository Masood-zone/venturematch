import { notificationsRepository } from "@/server/repositories/notifications.repository";
import { ok, type ServiceResult } from "@/lib/errors";

export const notificationService = {
  async getForUser(userId: string, options: { unreadOnly?: boolean; page?: number; pageSize?: number } = {}) {
    const { page = 1, pageSize = 30 } = options;
    const offset = (page - 1) * pageSize;
    const [notifications, unreadCount] = await Promise.all([
      notificationsRepository.getForUser(userId, { ...options, limit: pageSize, offset }),
      notificationsRepository.countUnread(userId),
    ]);
    return ok({ notifications, unreadCount });
  },

  async markRead(id: string, userId: string): Promise<ServiceResult<boolean>> {
    await notificationsRepository.markRead(id, userId);
    return ok(true);
  },

  async markAllRead(userId: string): Promise<ServiceResult<boolean>> {
    await notificationsRepository.markAllRead(userId);
    return ok(true);
  },

  async getUnreadCount(userId: string) {
    return ok(await notificationsRepository.countUnread(userId));
  },

  async delete(id: string, userId: string): Promise<ServiceResult<boolean>> {
    await notificationsRepository.delete(id, userId);
    return ok(true);
  },
};
