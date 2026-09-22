import { profileService } from "@/server/services/profile.service";
import { jsonResponse, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const programmes = await profileService.getAcademicProgrammes();
    return jsonResponse({
      data: programmes.map((programme) => ({
        ...programme,
        studyModes: JSON.parse(programme.studyModesJson) as string[],
      })),
    });
  } catch (error) {
    return apiError(error);
  }
}