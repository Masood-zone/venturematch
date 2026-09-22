import { notificationService } from "@/server/services/notification.service";
import { requireSessionUser, jsonResponse, apiError } from "@/lib/api-helpers";

export async function POST() {
  try {
    const user = await requireSessionUser();
    await notificationService.markAllRead(user.id);
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
