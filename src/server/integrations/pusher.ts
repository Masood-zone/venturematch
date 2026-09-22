import Pusher from "pusher";
import { env } from "@/lib/env";

let _pusher: Pusher | null = null;

export function getPusher(): Pusher {
  if (!_pusher) {
    if (!env.pusherAppId || !env.pusherKey || !env.pusherSecret) {
      throw new Error("Pusher environment variables not configured");
    }
    _pusher = new Pusher({
      appId: env.pusherAppId,
      key: env.pusherKey,
      secret: env.pusherSecret,
      cluster: env.pusherCluster,
      useTLS: true,
    });
  }
  return _pusher;
}

export async function triggerEvent(
  channel: string,
  event: string,
  data: unknown
) {
  try {
    const pusher = getPusher();
    await pusher.trigger(channel, event, data);
  } catch (err) {
    console.error("[Pusher] Failed to trigger event:", err);
  }
}

export const PUSHER_CHANNELS = {
  user: (userId: string) => `private-user-${userId}`,
  venture: (ventureId: string) => `private-venture-${ventureId}`,
  conversation: (conversationId: string) => `private-conversation-${conversationId}`,
} as const;

export const PUSHER_EVENTS = {
  MESSAGE_CREATED: "message.created",
  NOTIFICATION_CREATED: "notification.created",
  INVITATION_UPDATED: "invitation.updated",
  TRIAL_TASK_UPDATED: "trial.task.updated",
  MILESTONE_UPDATED: "milestone.updated",
} as const;
