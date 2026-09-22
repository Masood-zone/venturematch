import { ventureService } from "@/server/services/venture.service";
import { z } from "zod";
import { requireSessionUser, parseBody, jsonResponse, apiError } from "@/lib/api-helpers";

const Schema = z.object({
  requirements: z.array(z.object({
    capabilityId: z.string(),
    importanceScore: z.number().int().min(1).max(10),
    priority: z.string().optional(),
  })),
});

export async function PUT(req: Request, { params }: { params: Promise<{ ventureId: string }> }) {
  try {
    const user = await requireSessionUser();
    const { ventureId } = await params;
    const body = await parseBody(req, Schema);
    const result = await ventureService.setRequirements(ventureId, user.id, body.requirements);
    if (!result.success) return Response.json({ error: result.error }, { status: 400 });
    return jsonResponse({ success: true });
  } catch (e) {
    return apiError(e);
  }
}
