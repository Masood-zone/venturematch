import { adminService } from "@/server/services/admin.service";
import { UpdateVentureStatusSchema } from "@/server/validators/admin.validators";
import { requireAdminUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ ventureId: string }> }) {
  try {
    await requireAdminUser();
    const { ventureId } = await params;
    const result = await adminService.getVentureDetail(ventureId);
    if (!result.success) return Response.json({ error: result.error }, { status: 404 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ ventureId: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { ventureId } = await params;
    const body = await parseBody(req, UpdateVentureStatusSchema);
    const result = await adminService.updateVentureStatus(admin.id, ventureId, body.status, body.reason);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
