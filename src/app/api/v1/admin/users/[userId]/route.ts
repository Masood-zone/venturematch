import { adminService } from "@/server/services/admin.service";
import { UpdateUserRoleSchema } from "@/server/validators/admin.validators";
import { requireAdminUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await requireAdminUser();
    const { userId } = await params;
    const result = await adminService.getUserDetail(userId);
    if (!result.success) return Response.json({ error: result.error }, { status: 404 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { userId } = await params;
    const body = await parseBody(req, UpdateUserRoleSchema);
    const result = await adminService.updateUserRole(admin.id, userId, body.role);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
