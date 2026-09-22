import { profileService } from "@/server/services/profile.service";
import { requireSessionUser, jsonResponse, apiError } from "@/lib/api-helpers";

export async function POST() {
  try {
    const user = await requireSessionUser();
    const result = await profileService.completeOnboarding(user.id);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
