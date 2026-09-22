import { matchingService } from "@/server/services/matching.service";
import { requireSessionUser, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const user = await requireSessionUser();
    const result = await matchingService.getMatchesForUser(user.id);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}
