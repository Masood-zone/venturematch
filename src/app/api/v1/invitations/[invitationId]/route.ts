import { invitationService } from "@/server/services/invitation.service";
import { requireSessionUser, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ invitationId: string }> }) {
  try {
    await requireSessionUser();
    const { invitationId } = await params;
    const result = await invitationService.getInvitation(invitationId);
    if (!result.success) return Response.json({ error: result.error }, { status: 404 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}
