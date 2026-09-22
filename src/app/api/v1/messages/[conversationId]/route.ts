import { messagingService } from "@/server/services/messaging.service";
import { SendMessageSchema } from "@/server/validators/messaging.validators";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET(req: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    const user = await requireSessionUser();
    const { conversationId } = await params;
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "50");
    const before = url.searchParams.get("before") ? new Date(url.searchParams.get("before")!) : undefined;
    const result = await messagingService.getMessages(conversationId, user.id, limit, before);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    const user = await requireSessionUser();
    const { conversationId } = await params;
    const body = await parseBody(req, SendMessageSchema);
    const result = await messagingService.sendMessage(conversationId, user.id, body.body, body.attachments);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data, 201);
  } catch (e) {
    return apiError(e);
  }
}
