import { db } from "@/lib/db";

export const messagingRepository = {
  async getOrCreateDirectConversation(userId1: string, userId2: string) {
    // Look for existing direct conversation between these two users
    const existing = await db.conversation.findFirst({
      where: {
        type: "DIRECT",
        participants: { some: { userId: userId1 } },
        AND: { participants: { some: { userId: userId2 } } },
      },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
    if (existing) return existing;

    return db.conversation.create({
      data: {
        type: "DIRECT",
        participants: {
          create: [{ userId: userId1 }, { userId: userId2 }],
        },
      },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        messages: true,
      },
    });
  },

  async getConversation(id: string) {
    return db.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        venture: { select: { id: true, name: true, logoUrl: true } },
      },
    });
  },

  async getUserConversations(userId: string) {
    return db.conversation.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: { select: { id: true, name: true } },
          },
        },
        venture: { select: { id: true, name: true, logoUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getMessages(conversationId: string, limit = 50, before?: Date) {
    return db.message.findMany({
      where: {
        conversationId,
        ...(before ? { createdAt: { lt: before } } : {}),
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        attachments: true,
      },
      orderBy: { createdAt: "asc" },
      take: limit,
    });
  },

  async sendMessage(data: {
    conversationId: string;
    senderUserId: string;
    body: string;
    type?: string;
    attachments?: Array<{ url: string; resourceType: string; bytes?: number; cloudinaryPublicId?: string }>;
  }) {
    const { attachments, ...msgData } = data;
    return db.message.create({
      data: {
        ...msgData,
        type: (data.type as never) ?? "TEXT",
        ...(attachments?.length ? {
          attachments: { create: attachments },
        } : {}),
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        attachments: true,
      },
    });
  },

  async markConversationRead(conversationId: string, userId: string) {
    return db.conversationParticipant.updateMany({
      where: { conversationId, userId },
      data: { lastReadAt: new Date() },
    });
  },

  async getUnreadCount(userId: string) {
    const participants = await db.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true, lastReadAt: true },
    });

    let total = 0;
    for (const p of participants) {
      const count = await db.message.count({
        where: {
          conversationId: p.conversationId,
          senderUserId: { not: userId },
          createdAt: p.lastReadAt ? { gt: p.lastReadAt } : undefined,
        },
      });
      total += count;
    }
    return total;
  },

  async isParticipant(conversationId: string, userId: string) {
    const p = await db.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    return !!p;
  },
};
