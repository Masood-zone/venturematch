import { adminService } from "@/server/services/admin.service";
import { UpdateSystemSettingSchema } from "@/server/validators/admin.validators";
import { requireAdminUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    await requireAdminUser();
    const result = await adminService.getSystemSettings();
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(req: Request) {
  try {
    const admin = await requireAdminUser();
    const body = await parseBody(req, UpdateSystemSettingSchema);
    const result = await adminService.updateSystemSetting(admin.id, body.key, body.value);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
