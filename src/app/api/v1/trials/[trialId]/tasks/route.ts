import { trialService } from "@/server/services/trial.service";
import { AddTrialTaskSchema } from "@/server/validators/trial.validators";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function POST(req: Request, { params }: { params: Promise<{ trialId: string }> }) {
  try {
    const user = await requireSessionUser();
    const { trialId } = await params;
    const body = await parseBody(req, AddTrialTaskSchema);
    const result = await trialService.addTask(trialId, user.id, {
      ...body,
      dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
    });
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true }, 201);
  } catch (e) {
    return apiError(e);
  }
}
