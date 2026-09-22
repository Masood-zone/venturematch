import { matchingService } from "@/server/services/matching.service";
import { requireSessionUser, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ ventureId: string }> }) {
  try {
    await requireSessionUser();
    const { ventureId } = await params;
    const result = await matchingService.getRecommendationsForVenture(ventureId);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(_req: Request, { params }: { params: Promise<{ ventureId: string }> }) {
  try {
    const user = await requireSessionUser();
    const { ventureId } = await params;
    const result = await matchingService.runMatchingForVenture(ventureId);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ generated: result.data });
  } catch (e) {
    return apiError(e);
  }
}
