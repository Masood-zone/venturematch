import { messagingRepository } from "@/server/repositories/messaging.repository";
import { notificationsRepository } from "@/server/repositories/notifications.repository";
import { ok, err, type ServiceResult } from "@/lib/errors";

export const messagingService = {
  async getOrCreateConversation(
    userId: string,
    otherUserId: string
  ): Promise<ServiceResult<{ id: string }>> {
    if (userId === otherUserId) return err("Cannot message yourself", "VALIDATION_ERROR");
    const convo = await messagingRepository.getOrCreateDirectConversation(userId, otherUserId);
    return ok({ id: convo.id });
  },

  async getConversations(userId: string) {
    const convos = await messagingRepository.getUserConversations(userId);
    return ok(convos);
  },

  async getMessages(conversationId: string, userId: string, limit = 50, before?: Date) {
    const isParticipant = await messagingRepository.isParticipant(conversationId, userId);
    if (!isParticipant) return err("Not a participant in this conversation", "FORBIDDEN");
    const messages = await messagingRepository.getMessages(conversationId, limit, before);
    await messagingRepository.markConversationRead(conversationId, userId);
    return ok(messages);
  },

  async sendMessage(
    conversationId: string,
    userId: string,
    body: string,
    attachments?: Array<{ url: string; resourceType: string; bytes?: number; cloudinaryPublicId?: string }>
  ): Promise<ServiceResult<{ id: string }>> {
    const isParticipant = await messagingRepository.isParticipant(conversationId, userId);
    if (!isParticipant) return err("Not a participant in this conversation", "FORBIDDEN");
    if (!body.trim() && (!attachments || attachments.length === 0)) {
      return err("Message body is required", "VALIDATION_ERROR");
    }

    const message = await messagingRepository.sendMessage({
      conversationId,
      senderUserId: userId,
      body,
      attachments,
    });

    // Notify other participants
    const convo = await messagingRepository.getConversation(conversationId);
    if (convo) {
      for (const p of convo.participants) {
        if (p.userId !== userId) {
          await notificationsRepository.create({
            userId: p.userId,
            type: "NEW_MESSAGE",
            title: "New message",
            body: body.length > 80 ? body.slice(0, 80) + "…" : body,
            entityType: "conversation",
            entityId: conversationId,
          });
        }
      }
    }

    return ok({ id: message.id });
  },

  async getUnreadCount(userId: string) {
    return ok(await messagingRepository.getUnreadCount(userId));
  },

  async markRead(conversationId: string, userId: string): Promise<ServiceResult<boolean>> {
    const isParticipant = await messagingRepository.isParticipant(conversationId, userId);
    if (!isParticipant) return err("Not a participant", "FORBIDDEN");
    await messagingRepository.markConversationRead(conversationId, userId);
    return ok(true);
  },
};
