import { trialService } from "@/server/services/trial.service";
import { requireSessionUser, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ trialId: string }> }) {
  try {
    await requireSessionUser();
    const { trialId } = await params;
    const result = await trialService.getTrial(trialId);
    if (!result.success) return Response.json({ error: result.error }, { status: 404 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}
