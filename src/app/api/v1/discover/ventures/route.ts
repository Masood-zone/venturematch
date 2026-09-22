import { ventureService } from "@/server/services/venture.service";
import { requireSessionUser, jsonResponse, apiError } from "@/lib/api-helpers";
import { z } from "zod";

const QuerySchema = z.object({
  sectorId: z.string().optional(),
  stage: z.enum(["IDEA", "VALIDATION", "PROTOTYPE", "EARLY_LAUNCH", "OPERATE"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(req: Request) {
  try {
    await requireSessionUser();
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = QuerySchema.safeParse(params);
    if (!parsed.success) return Response.json({ error: "Invalid query" }, { status: 400 });
    const result = await ventureService.discoverVentures(parsed.data);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}
