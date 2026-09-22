import { ventureService } from "@/server/services/venture.service";
import { requireSessionUser, jsonResponse, apiError } from "@/lib/api-helpers";

export async function POST(_req: Request, { params }: { params: Promise<{ ventureId: string }> }) {
  try {
    const user = await requireSessionUser();
    const { ventureId } = await params;
    const result = await ventureService.publish(ventureId, user.id);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
