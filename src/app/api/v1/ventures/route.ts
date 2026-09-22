import { ventureService } from "@/server/services/venture.service";
import { CreateVentureSchema } from "@/server/validators/venture.validators";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const user = await requireSessionUser();
    const result = await ventureService.getUserVentures(user.id);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireSessionUser();
    const body = await parseBody(req, CreateVentureSchema);
    const result = await ventureService.create(user.id, body);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data, 201);
  } catch (e) {
    return apiError(e);
  }
}
