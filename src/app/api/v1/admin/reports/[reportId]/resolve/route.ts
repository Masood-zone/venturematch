import { adminService } from "@/server/services/admin.service";
import { ResolveReportSchema } from "@/server/validators/admin.validators";
import { requireAdminUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function POST(req: Request, { params }: { params: Promise<{ reportId: string }> }) {
  try {
    const admin = await requireAdminUser();
    const { reportId } = await params;
    const body = await parseBody(req, ResolveReportSchema);
    const result = await adminService.resolveReport(admin.id, reportId, body.action, body.reason);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
