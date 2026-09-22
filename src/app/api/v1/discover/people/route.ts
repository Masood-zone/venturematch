import { profileService } from "@/server/services/profile.service";
import { requireSessionUser, jsonResponse, apiError } from "@/lib/api-helpers";
import { z } from "zod";

const QuerySchema = z.object({
  capabilityIds: z.string().optional().transform(v => v?.split(",").filter(Boolean)),
  sectorIds: z.string().optional().transform(v => v?.split(",").filter(Boolean)),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(req: Request) {
  try {
    await requireSessionUser();
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = QuerySchema.safeParse(params);
    if (!parsed.success) return Response.json({ error: "Invalid query" }, { status: 400 });
    const result = await profileService.discoverPeople(parsed.data);
    return jsonResponse(result);
  } catch (e) {
    return apiError(e);
  }
}
