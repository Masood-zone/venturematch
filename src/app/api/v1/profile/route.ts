import { profileService } from "@/server/services/profile.service";
import { UpdateProfileSchema } from "@/server/validators/profile.validators";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const user = await requireSessionUser();
    const result = await profileService.getProfile(user.id);
    if (!result.success) return Response.json({ error: result.error }, { status: 404 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireSessionUser();
    const body = await parseBody(req, UpdateProfileSchema);
    const result = await profileService.updateProfile(user.id, body);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
