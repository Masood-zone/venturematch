import { db } from "@/lib/db";

export const talentRepository = {
  async findById(userId: string) {
    return db.studentProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, email: true, image: true, role: true } },
        academicProfile: true,
        capabilities: {
          include: {
            capability: { include: { family: true } },
            evidence: true,
          },
        },
        ventureInterests: { include: { sector: true } },
        founderPreference: true,
        availability: true,
      },
    });
  },

  async findByUserId(userId: string) {
    return db.studentProfile.findUnique({ where: { userId } });
  },

  async upsertAcademicProfile(
    studentProfileId: string,
    data: { faculty?: string; department?: string; programme?: string }
  ) {
    return db.academicProfile.upsert({
      where: { studentProfileId },
      update: data,
      create: { studentProfileId, ...data },
    });
  },

  async updateStudentProfile(userId: string, data: Partial<{
    bio: string;
    level: string;
    expectedGraduationYear: number;
    discoverability: boolean;
    availabilityStatus: string;
    profileStrength: number;
    onboardingCompleted: boolean;
    onboardingStep: string;
  }>) {
    return db.studentProfile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  },

  async addCapability(studentProfileId: string, capabilityId: string, proficiency: string) {
    return db.studentCapability.upsert({
      where: { studentProfileId_capabilityId: { studentProfileId, capabilityId } },
      update: { proficiency: proficiency as never },
      create: { studentProfileId, capabilityId, proficiency: proficiency as never },
    });
  },

  async removeCapability(studentProfileId: string, capabilityId: string) {
    return db.studentCapability.deleteMany({
      where: { studentProfileId, capabilityId },
    });
  },

  async setCapabilities(studentProfileId: string, capabilities: Array<{ capabilityId: string; proficiency: string }>) {
    await db.studentCapability.deleteMany({ where: { studentProfileId } });
    if (capabilities.length === 0) return [];
    return db.studentCapability.createMany({
      data: capabilities.map(c => ({
        studentProfileId,
        capabilityId: c.capabilityId,
        proficiency: c.proficiency as never,
      })),
    });
  },

  async setVentureInterests(studentProfileId: string, sectorIds: string[]) {
    await db.studentVentureInterest.deleteMany({ where: { studentProfileId } });
    if (sectorIds.length === 0) return [];
    return db.studentVentureInterest.createMany({
      data: sectorIds.map(sectorId => ({ studentProfileId, sectorId })),
    });
  },

  async upsertFounderPreference(studentProfileId: string, data: {
    commitmentLevel?: string;
    preferredRoleCategory?: string;
    ventureGoal?: string;
    structuredVsFlexible?: number;
    independentVsCollaborative?: number;
    fastVsDeliberate?: number;
  }) {
    return db.founderPreference.upsert({
      where: { studentProfileId },
      update: data as never,
      create: { studentProfileId, ...data } as never,
    });
  },

  async upsertAvailability(studentProfileId: string, data: {
    weeklyHoursBand?: string;
    timezone?: string;
    notes?: string;
  }) {
    return db.studentAvailability.upsert({
      where: { studentProfileId },
      update: data,
      create: { studentProfileId, ...data },
    });
  },

  async listDiscoverable(filters: {
    capabilityIds?: string[];
    sectorIds?: string[];
    limit?: number;
    offset?: number;
  }) {
    const { capabilityIds, sectorIds, limit = 20, offset = 0 } = filters;
    return db.studentProfile.findMany({
      where: {
        discoverability: true,
        onboardingCompleted: true,
        ...(capabilityIds?.length ? {
          capabilities: { some: { capabilityId: { in: capabilityIds } } }
        } : {}),
        ...(sectorIds?.length ? {
          ventureInterests: { some: { sectorId: { in: sectorIds } } }
        } : {}),
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        academicProfile: true,
        capabilities: { include: { capability: { include: { family: true } } } },
        ventureInterests: { include: { sector: true } },
        availability: true,
      },
      take: limit,
      skip: offset,
      orderBy: { profileStrength: "desc" },
    });
  },

  async countDiscoverable(filters: { capabilityIds?: string[]; sectorIds?: string[] }) {
    const { capabilityIds, sectorIds } = filters;
    return db.studentProfile.count({
      where: {
        discoverability: true,
        onboardingCompleted: true,
        ...(capabilityIds?.length ? {
          capabilities: { some: { capabilityId: { in: capabilityIds } } }
        } : {}),
        ...(sectorIds?.length ? {
          ventureInterests: { some: { sectorId: { in: sectorIds } } }
        } : {}),
      },
    });
  },

  async getAllCapabilityFamilies() {
    return db.capabilityFamily.findMany({
      where: { status: "ACTIVE" },
      include: {
        capabilities: {
          where: { status: "ACTIVE" },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
  },

  async getAllSectors() {
    return db.ventureSector.findMany({
      where: { status: "ACTIVE" },
      orderBy: { sortOrder: "asc" },
    });
  },

  async addCapabilityEvidence(studentCapabilityId: string, data: {
    type: string;
    title: string;
    description?: string;
    cloudinaryPublicId?: string;
    url?: string;
    linkUrl?: string;
  }) {
    return db.capabilityEvidence.create({
      data: { studentCapabilityId, ...data },
    });
  },
};
