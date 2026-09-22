import { profileService } from "@/server/services/profile.service";
import { AcademicStepSchema } from "@/server/validators/profile.validators";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function POST(req: Request) {
  try {
    const user = await requireSessionUser();
    await profileService.ensureProfile(user.id);
    const body = await parseBody(req, AcademicStepSchema);
    const result = await profileService.saveAcademicStep(user.id, body);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
