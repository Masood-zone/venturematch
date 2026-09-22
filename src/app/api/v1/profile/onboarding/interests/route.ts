import { profileService } from "@/server/services/profile.service";
import { InterestsStepSchema } from "@/server/validators/profile.validators";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function POST(req: Request) {
  try {
    const user = await requireSessionUser();
    const body = await parseBody(req, InterestsStepSchema);
    const result = await profileService.saveInterestsStep(user.id, body.sectorIds);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
