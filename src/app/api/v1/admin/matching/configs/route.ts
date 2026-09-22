import { matchingService } from "@/server/services/matching.service";
import { CreateMatchingConfigSchema } from "@/server/validators/matching.validators";
import { requireAdminUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    await requireAdminUser();
    const result = await matchingService.getAllConfigs();
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdminUser();
    const body = await parseBody(req, CreateMatchingConfigSchema);
    const result = await matchingService.createConfig(body);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true }, 201);
  } catch (e) {
    return apiError(e);
  }
}
