import { adminService } from "@/server/services/admin.service";
import { CreateSupportTicketSchema } from "@/server/validators/admin.validators";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function POST(req: Request) {
  try {
    const user = await requireSessionUser();
    const body = await parseBody(req, CreateSupportTicketSchema);
    const result = await adminService.createSupportTicket({ userId: user.id, ...body });
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data, 201);
  } catch (e) {
    return apiError(e);
  }
}
