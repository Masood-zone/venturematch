import { invitationService } from "@/server/services/invitation.service";
import { requireSessionUser, jsonResponse, apiError } from "@/lib/api-helpers";

export async function POST(_req: Request, { params }: { params: Promise<{ invitationId: string }> }) {
  try {
    const user = await requireSessionUser();
    const { invitationId } = await params;
    const result = await invitationService.proposeTrialFromInvitation(invitationId, user.id);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
