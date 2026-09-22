import { messagingService } from "@/server/services/messaging.service";
import { z } from "zod";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

const Schema = z.object({ otherUserId: z.string().cuid() });

export async function POST(req: Request) {
  try {
    const user = await requireSessionUser();
    const body = await parseBody(req, Schema);
    const result = await messagingService.getOrCreateConversation(user.id, body.otherUserId);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}
