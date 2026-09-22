import { ventureService } from "@/server/services/venture.service";
import { AddContributionSchema } from "@/server/validators/venture.validators";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ ventureId: string }> }) {
  try {
    await requireSessionUser();
    const { ventureId } = await params;
    const result = await ventureService.getContributions(ventureId);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ ventureId: string }> }) {
  try {
    const user = await requireSessionUser();
    const { ventureId } = await params;
    const body = await parseBody(req, AddContributionSchema);
    const result = await ventureService.addContribution(ventureId, user.id, body);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true }, 201);
  } catch (e) {
    return apiError(e);
  }
}
