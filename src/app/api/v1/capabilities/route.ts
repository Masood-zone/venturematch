import { profileService } from "@/server/services/profile.service";
import { jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const families = await profileService.getCapabilityLibrary();
    return jsonResponse(families);
  } catch (e) {
    return apiError(e);
  }
}
