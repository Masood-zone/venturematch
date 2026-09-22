import { ventureService } from "@/server/services/venture.service";
import { UpdateVentureSchema } from "@/server/validators/venture.validators";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ ventureId: string }> }) {
  try {
    await requireSessionUser();
    const { ventureId } = await params;
    const result = await ventureService.get(ventureId);
    if (!result.success) return Response.json({ error: result.error }, { status: 404 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ ventureId: string }> }) {
  try {
    const user = await requireSessionUser();
    const { ventureId } = await params;
    const body = await parseBody(req, UpdateVentureSchema);
    const cleaned = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== null)) as Parameters<typeof ventureService.update>[2];
    const result = await ventureService.update(ventureId, user.id, cleaned);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
