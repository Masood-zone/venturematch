import { adminService } from "@/server/services/admin.service";
import { requireAdminUser, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    await requireAdminUser();
    const result = await adminService.getPlatformStats();
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}
