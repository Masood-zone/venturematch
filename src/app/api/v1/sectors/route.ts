import { profileService } from "@/server/services/profile.service";
import { jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const sectors = await profileService.getSectors();
    return jsonResponse(sectors);
  } catch (e) {
    return apiError(e);
  }
}
