import { invitationService } from "@/server/services/invitation.service";
import { SendInvitationSchema } from "@/server/validators/matching.validators";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET(req: Request) {
  try {
    const user = await requireSessionUser();
    const status = new URL(req.url).searchParams.get("status") ?? undefined;
    const result = await invitationService.getInvitationsForUser(user.id, status);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireSessionUser();
    const body = await parseBody(req, SendInvitationSchema);
    const result = await invitationService.sendInvitation(user.id, body);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data, 201);
  } catch (e) {
    return apiError(e);
  }
}
