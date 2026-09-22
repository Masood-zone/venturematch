import { venturesRepository } from "@/server/repositories/ventures.repository";
import { ok, err, type ServiceResult } from "@/lib/errors";
import { slugify } from "@/lib/utils";

export const ventureService = {
  async create(
    ownerId: string,
    data: {
      name: string;
      shortPitch?: string;
      stage?: string;
      primarySectorId?: string;
      expectedCommitment?: string;
    }
  ): Promise<ServiceResult<{ id: string; slug: string }>> {
    let slug = slugify(data.name);
    if (await venturesRepository.slugExists(slug)) {
      slug = `${slug}-${Date.now()}`;
    }
    const venture = await venturesRepository.create({ ownerId, slug, ...data });
    return ok({ id: venture.id, slug: venture.slug });
  },

  async get(id: string): Promise<ServiceResult<Awaited<ReturnType<typeof venturesRepository.findById>>>> {
    const venture = await venturesRepository.findById(id);
    if (!venture) return err("Venture not found", "NOT_FOUND");
    return ok(venture);
  },

  async getBySlug(slug: string) {
    const venture = await venturesRepository.findBySlug(slug);
    if (!venture) return err("Venture not found", "NOT_FOUND");
    return ok(venture);
  },

  async update(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      shortPitch: string;
      problem: string;
      solution: string;
      targetUsers: string;
      primarySectorId: string;
      secondarySectorId: string;
      stage: string;
      ambition: string;
      expectedCommitment: string;
      logoUrl: string;
      logoPublicId: string;
      status: string;
    }>
  ): Promise<ServiceResult<boolean>> {
    const venture = await venturesRepository.findById(id);
    if (!venture) return err("Venture not found", "NOT_FOUND");
    if (venture.ownerId !== userId) return err("You do not own this venture", "FORBIDDEN");
    await venturesRepository.update(id, data);
    return ok(true);
  },

  async publish(id: string, userId: string): Promise<ServiceResult<boolean>> {
    const venture = await venturesRepository.findById(id);
    if (!venture) return err("Venture not found", "NOT_FOUND");
    if (venture.ownerId !== userId) return err("Forbidden", "FORBIDDEN");
    await venturesRepository.update(id, { status: "ACTIVE" });
    return ok(true);
  },

  async getUserVentures(userId: string) {
    const owned = await venturesRepository.findByOwnerId(userId);
    const member = await venturesRepository.findByMemberId(userId);
    const memberNotOwned = member.filter(v => v.ownerId !== userId);
    return ok({ owned, member: memberNotOwned });
  },

  async discoverVentures(filters: {
    sectorId?: string;
    stage?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { page = 1, pageSize = 20 } = filters;
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      venturesRepository.listActive({ ...filters, limit: pageSize, offset }),
      venturesRepository.countActive(filters),
    ]);
    return ok({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  },

  async setRequirements(
    ventureId: string,
    userId: string,
    requirements: Array<{ capabilityId: string; importanceScore: number; priority?: string }>
  ): Promise<ServiceResult<boolean>> {
    const venture = await venturesRepository.findById(ventureId);
    if (!venture) return err("Venture not found", "NOT_FOUND");
    if (venture.ownerId !== userId) return err("Forbidden", "FORBIDDEN");
    await venturesRepository.setCapabilityRequirements(ventureId, requirements);
    return ok(true);
  },

  async getMilestones(ventureId: string) {
    const milestones = await venturesRepository.getMilestones(ventureId);
    return ok(milestones);
  },

  async addMilestone(
    ventureId: string,
    userId: string,
    data: { stage: string; title: string; objective?: string; expectedOutcome?: string; dueAt?: Date }
  ): Promise<ServiceResult<boolean>> {
    const venture = await venturesRepository.findById(ventureId);
    if (!venture) return err("Venture not found", "NOT_FOUND");
    if (venture.ownerId !== userId) return err("Forbidden", "FORBIDDEN");
    await venturesRepository.createMilestone({ ventureId, ...data });
    return ok(true);
  },

  async updateMilestone(
    milestoneId: string,
    userId: string,
    data: Partial<{ title: string; status: string; progressCurrent: number; completedAt: Date }>
  ): Promise<ServiceResult<boolean>> {
    await venturesRepository.updateMilestone(milestoneId, data);
    return ok(true);
  },

  async getContributions(ventureId: string) {
    return ok(await venturesRepository.getContributions(ventureId));
  },

  async addContribution(
    ventureId: string,
    userId: string,
    data: { milestoneId?: string; category: string; title: string; description?: string; evidenceUrl?: string }
  ): Promise<ServiceResult<boolean>> {
    await venturesRepository.addContribution({ ventureId, userId, ...data });
    return ok(true);
  },

  async getHealthSnapshot(ventureId: string) {
    const snapshots = await venturesRepository.getHealthSnapshots(ventureId);
    return ok(snapshots);
  },

  async computeAndSaveHealth(ventureId: string): Promise<ServiceResult<boolean>> {
    const venture = await venturesRepository.findById(ventureId);
    if (!venture) return err("Venture not found", "NOT_FOUND");

    const milestones = await venturesRepository.getMilestones(ventureId);
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === "COMPLETED").length;
    const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

    const requiredCaps = venture.capabilityRequirements.length;
    const activeMemberIds = venture.members.filter(m => m.status === "ACTIVE").map(m => m.userId);
    // Simple heuristic: covered if any active member has the capability
    const capabilityCoverage = requiredCaps > 0 ? Math.min(100, (activeMemberIds.length / Math.max(1, requiredCaps)) * 100) : 100;

    const participationScore = Math.min(100, activeMemberIds.length * 25);
    const founderAlignment = 70; // default, would be computed from trial reviews
    const overallHealth = Math.round(
      milestoneProgress * 0.3 +
      capabilityCoverage * 0.3 +
      participationScore * 0.2 +
      founderAlignment * 0.2
    );

    await venturesRepository.createHealthSnapshot({
      ventureId,
      overallHealth,
      milestoneProgress,
      capabilityCoverage,
      participationScore,
      founderAlignment,
    });
    return ok(true);
  },

  async getCharter(ventureId: string) {
    return ok(await venturesRepository.getCharter(ventureId));
  },

  async updateCharter(
    ventureId: string,
    userId: string,
    data: { meetingFrequency?: string; communicationMethod?: string; decisionMethod?: string; expectationsText?: string }
  ): Promise<ServiceResult<boolean>> {
    const venture = await venturesRepository.findById(ventureId);
    if (!venture) return err("Venture not found", "NOT_FOUND");
    if (venture.ownerId !== userId) return err("Forbidden", "FORBIDDEN");
    await venturesRepository.upsertCharter(ventureId, data);
    return ok(true);
  },
};
