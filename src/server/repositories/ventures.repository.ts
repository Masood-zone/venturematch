import { db } from "@/lib/db";

export const venturesRepository = {
  async findById(id: string) {
    return db.venture.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, image: true } },
        primarySector: true,
        secondarySector: true,
        members: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        capabilityRequirements: {
          include: { capability: { include: { family: true } } },
        },
        dnaVersions: { orderBy: { version: "desc" }, take: 1 },
        charter: true,
      },
    });
  },

  async findBySlug(slug: string) {
    return db.venture.findUnique({
      where: { slug },
      include: {
        owner: { select: { id: true, name: true, image: true } },
        primarySector: true,
        secondarySector: true,
        members: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        capabilityRequirements: {
          include: { capability: { include: { family: true } } },
        },
      },
    });
  },

  async findByOwnerId(ownerId: string) {
    return db.venture.findMany({
      where: { ownerId },
      include: {
        primarySector: true,
        members: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        capabilityRequirements: { include: { capability: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findByMemberId(userId: string) {
    return db.venture.findMany({
      where: {
        members: { some: { userId, status: "ACTIVE" } },
      },
      include: {
        owner: { select: { id: true, name: true, image: true } },
        primarySector: true,
        members: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  async create(data: {
    ownerId: string;
    name: string;
    slug: string;
    shortPitch?: string;
    stage?: string;
    primarySectorId?: string;
    expectedCommitment?: string;
  }) {
    const venture = await db.venture.create({
      data: {
        ...data,
        stage: (data.stage as never) ?? "IDEA",
        expectedCommitment: (data.expectedCommitment as never) ?? "SIDE_VENTURE",
        members: {
          create: {
            userId: data.ownerId,
            membershipType: "FOUNDER",
            status: "ACTIVE",
          },
        },
      },
    });
    return venture;
  },

  async update(id: string, data: Partial<{
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
    logoPublicId: string;
    logoUrl: string;
    status: string;
  }>) {
    return db.venture.update({
      where: { id },
      data: data as never,
    });
  },

  async delete(id: string) {
    return db.venture.delete({ where: { id } });
  },

  async listActive(filters: {
    sectorId?: string;
    stage?: string;
    limit?: number;
    offset?: number;
  }) {
    const { sectorId, stage, limit = 20, offset = 0 } = filters;
    return db.venture.findMany({
      where: {
        status: "ACTIVE",
        ...(sectorId ? { primarySectorId: sectorId } : {}),
        ...(stage ? { stage: stage as never } : {}),
      },
      include: {
        owner: { select: { id: true, name: true, image: true } },
        primarySector: true,
        members: {
          where: { status: "ACTIVE" },
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        capabilityRequirements: { include: { capability: true } },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
  },

  async countActive(filters: { sectorId?: string; stage?: string }) {
    return db.venture.count({
      where: {
        status: "ACTIVE",
        ...(filters.sectorId ? { primarySectorId: filters.sectorId } : {}),
        ...(filters.stage ? { stage: filters.stage as never } : {}),
      },
    });
  },

  async setCapabilityRequirements(
    ventureId: string,
    requirements: Array<{ capabilityId: string; importanceScore: number; priority?: string }>
  ) {
    await db.ventureCapabilityRequirement.deleteMany({ where: { ventureId } });
    if (requirements.length === 0) return [];
    return db.ventureCapabilityRequirement.createMany({
      data: requirements.map(r => ({
        ventureId,
        capabilityId: r.capabilityId,
        importanceScore: r.importanceScore,
        priority: r.priority ?? "MEDIUM",
        source: "MANUAL",
      })),
    });
  },

  async addMember(ventureId: string, userId: string, data: {
    roleTitle?: string;
    membershipType?: string;
  }) {
    return db.ventureMember.upsert({
      where: { ventureId_userId: { ventureId, userId } },
      update: {
        status: "ACTIVE",
        roleTitle: data.roleTitle,
        membershipType: (data.membershipType as "FOUNDER" | "CO_FOUNDER" | "TEAM_MEMBER" | "SPECIALIST") ?? "TEAM_MEMBER",
      },
      create: {
        ventureId,
        userId,
        membershipType: (data.membershipType as "FOUNDER" | "CO_FOUNDER" | "TEAM_MEMBER" | "SPECIALIST") ?? "TEAM_MEMBER",
        status: "ACTIVE",
        roleTitle: data.roleTitle,
      },
    });
  },

  async removeMember(ventureId: string, userId: string) {
    return db.ventureMember.updateMany({
      where: { ventureId, userId },
      data: { status: "REMOVED" },
    });
  },

  async getVentureDNA(ventureId: string) {
    return db.ventureDNA.findFirst({
      where: { ventureId },
      orderBy: { version: "desc" },
    });
  },

  async createDNAVersion(ventureId: string, summary: string, version: number) {
    return db.ventureDNA.create({
      data: { ventureId, structuredSummaryJson: summary, version },
    });
  },

  async getMilestones(ventureId: string) {
    return db.ventureMilestone.findMany({
      where: { ventureId },
      include: { contributions: { include: { user: { select: { id: true, name: true, image: true } } } } },
      orderBy: { createdAt: "asc" },
    });
  },

  async createMilestone(data: {
    ventureId: string;
    stage: string;
    title: string;
    objective?: string;
    expectedOutcome?: string;
    dueAt?: Date;
  }) {
    return db.ventureMilestone.create({
      data: {
        ventureId: data.ventureId,
        stage: data.stage as "IDEA" | "VALIDATION" | "PROTOTYPE" | "EARLY_LAUNCH" | "OPERATE",
        title: data.title,
        objective: data.objective,
        expectedOutcome: data.expectedOutcome,
        dueAt: data.dueAt,
      },
    });
  },

  async updateMilestone(id: string, data: Partial<{
    title: string;
    objective: string;
    expectedOutcome: string;
    status: string;
    progressCurrent: number;
    progressTarget: number;
    dueAt: Date;
    completedAt: Date;
  }>) {
    return db.ventureMilestone.update({ where: { id }, data: data as never });
  },

  async getContributions(ventureId: string) {
    return db.ventureContribution.findMany({
      where: { ventureId },
      include: {
        user: { select: { id: true, name: true, image: true } },
        milestone: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async addContribution(data: {
    ventureId: string;
    userId: string;
    milestoneId?: string;
    category: string;
    title: string;
    description?: string;
    evidenceUrl?: string;
  }) {
    return db.ventureContribution.create({ data });
  },

  async getHealthSnapshots(ventureId: string) {
    return db.ventureHealthSnapshot.findMany({
      where: { ventureId },
      orderBy: { createdAt: "desc" },
      take: 12,
    });
  },

  async createHealthSnapshot(data: {
    ventureId: string;
    overallHealth: number;
    milestoneProgress: number;
    capabilityCoverage: number;
    participationScore: number;
    founderAlignment: number;
  }) {
    return db.ventureHealthSnapshot.create({ data });
  },

  async getCharter(ventureId: string) {
    return db.teamCharter.findUnique({
      where: { ventureId },
      include: {
        members: { include: { user: { select: { id: true, name: true, image: true } } } },
        objectives: { orderBy: { order: "asc" } },
      },
    });
  },

  async upsertCharter(ventureId: string, data: {
    meetingFrequency?: string;
    communicationMethod?: string;
    decisionMethod?: string;
    expectationsText?: string;
    status?: string;
  }) {
    return db.teamCharter.upsert({
      where: { ventureId },
      update: data as never,
      create: { ventureId, ...data } as never,
    });
  },

  async slugExists(slug: string) {
    const count = await db.venture.count({ where: { slug } });
    return count > 0;
  },

  async findForAdmin(filters: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const { status, search, limit = 25, offset = 0 } = filters;
    return db.venture.findMany({
      where: {
        ...(status ? { status: status as never } : {}),
        ...(search ? { name: { contains: search } } : {}),
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        primarySector: true,
        _count: { select: { members: true } },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
  },

  async countForAdmin(filters: { status?: string; search?: string }) {
    return db.venture.count({
      where: {
        ...(filters.status ? { status: filters.status as never } : {}),
        ...(filters.search ? { name: { contains: filters.search } } : {}),
      },
    });
  },
};
