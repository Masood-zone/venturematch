import { adminService } from "@/server/services/admin.service";
import { requireAdminUser, jsonResponse, apiError } from "@/lib/api-helpers";
import { z } from "zod";

const QuerySchema = z.object({
  status: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export async function GET(req: Request) {
  try {
    await requireAdminUser();
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = QuerySchema.safeParse(params);
    if (!parsed.success) return Response.json({ error: "Invalid query" }, { status: 400 });
    const result = await adminService.listReports(parsed.data);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse(result.data);
  } catch (e) {
    return apiError(e);
  }
}
