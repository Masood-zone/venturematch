import { invitationService } from "@/server/services/invitation.service";
import { z } from "zod";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

const Schema = z.object({ response: z.enum(["INTERESTED", "DECLINED"]) });

export async function POST(req: Request, { params }: { params: Promise<{ invitationId: string }> }) {
  try {
    const user = await requireSessionUser();
    const { invitationId } = await params;
    const body = await parseBody(req, Schema);
    const result = await invitationService.respondToInvitation(invitationId, user.id, body.response);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
