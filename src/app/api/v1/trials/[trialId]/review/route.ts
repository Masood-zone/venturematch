import { trialService } from "@/server/services/trial.service";
import { SubmitTrialReviewSchema } from "@/server/validators/trial.validators";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function POST(req: Request, { params }: { params: Promise<{ trialId: string }> }) {
  try {
    const user = await requireSessionUser();
    const { trialId } = await params;
    const body = await parseBody(req, SubmitTrialReviewSchema);
    const result = await trialService.submitReview(trialId, user.id, body);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
