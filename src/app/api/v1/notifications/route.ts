import { notificationService } from "@/server/services/notification.service";
import { requireSessionUser, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET(req: Request) {
  try {
    const user = await requireSessionUser();
    const url = new URL(req.url);
    const unreadOnly = url.searchParams.get("unreadOnly") === "true";
    const page = parseInt(url.searchParams.get("page") ?? "1");
    const result = await notificationService.getForUser(user.id, { unreadOnly, page });
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}
