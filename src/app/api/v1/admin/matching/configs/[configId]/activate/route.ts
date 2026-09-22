import { matchingService } from "@/server/services/matching.service";
import { requireAdminUser, jsonResponse, apiError } from "@/lib/api-helpers";

export async function POST(_req: Request, { params }: { params: Promise<{ configId: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { configId } = await params;
    const result = await matchingService.activateConfig(configId, admin.id);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
