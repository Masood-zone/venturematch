import { db } from "@/lib/db";

export const matchingRepository = {
  async getActiveConfig() {
    return db.matchingConfiguration.findFirst({
      where: { active: true },
      orderBy: { version: "desc" },
    });
  },

  async getAllConfigs() {
    return db.matchingConfiguration.findMany({
      orderBy: { version: "desc" },
    });
  },

  async createConfig(data: {
    version: number;
    capabilityWeight: number;
    interestWeight: number;
    commitmentWeight: number;
    availabilityWeight: number;
    goalWeight: number;
    workingStyleWeight: number;
    evidenceWeight: number;
  }) {
    return db.matchingConfiguration.create({ data });
  },

  async activateConfig(id: string, publishedBy: string) {
    await db.matchingConfiguration.updateMany({ data: { active: false } });
    return db.matchingConfiguration.update({
      where: { id },
      data: { active: true, publishedAt: new Date(), publishedBy },
    });
  },

  async createRecommendation(data: {
    ventureId: string;
    candidateUserId: string;
    overallScore: number;
    algorithmVersion: string;
    configId?: string;
    expiresAt?: Date;
    factorScores: Array<{
      factor: string;
      rawScore: number;
      weight: number;
      weightedScore: number;
      explanationDataJson?: string;
    }>;
  }) {
    const { factorScores, ...recData } = data;
    return db.matchRecommendation.create({
      data: {
        ...recData,
        factorScores: { create: factorScores },
      },
      include: { factorScores: true },
    });
  },

  async getRecommendationsForVenture(ventureId: string, limit = 20) {
    return db.matchRecommendation.findMany({
      where: { ventureId, status: "ACTIVE" },
      include: {
        candidate: {
          select: { id: true, name: true, image: true },
        },
        factorScores: true,
      },
      orderBy: { overallScore: "desc" },
      take: limit,
    });
  },

  async getRecommendationsForCandidate(candidateUserId: string, limit = 20) {
    return db.matchRecommendation.findMany({
      where: { candidateUserId, status: "ACTIVE" },
      include: {
        venture: {
          include: {
            owner: { select: { id: true, name: true, image: true } },
            primarySector: true,
          },
        },
        factorScores: true,
      },
      orderBy: { overallScore: "desc" },
      take: limit,
    });
  },

  async expireRecommendation(id: string) {
    return db.matchRecommendation.update({
      where: { id },
      data: { status: "EXPIRED" },
    });
  },

  async acceptRecommendation(id: string) {
    return db.matchRecommendation.update({
      where: { id },
      data: { status: "ACCEPTED" },
    });
  },

  async declineRecommendation(id: string) {
    return db.matchRecommendation.update({
      where: { id },
      data: { status: "DECLINED" },
    });
  },

  async findRecommendation(ventureId: string, candidateUserId: string) {
    return db.matchRecommendation.findFirst({
      where: { ventureId, candidateUserId, status: "ACTIVE" },
    });
  },

  async getCandidatesForMatching(ventureId: string) {
    // Get profiles of all students who could be matched to this venture
    return db.studentProfile.findMany({
      where: {
        discoverability: true,
        onboardingCompleted: true,
        user: {
          ventureMembers: {
            none: { ventureId, status: "ACTIVE" },
          },
          receivedInvitations: {
            none: { ventureId, status: { in: ["PENDING", "INTERESTED", "TRIAL_PROPOSED"] } },
          },
        },
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        capabilities: {
          include: { capability: true, evidence: { take: 1 } },
        },
        ventureInterests: true,
        founderPreference: true,
        availability: true,
      },
    });
  },

  async createInvitation(data: {
    ventureId: string;
    senderUserId: string;
    recipientUserId: string;
    recommendationId?: string;
    proposedRole?: string;
    expectedCommitment?: string;
    message?: string;
    invitationType?: string;
  }) {
    return db.ventureInvitation.create({
      data: {
        ...data,
        invitationType: (data.invitationType as never) ?? "DIRECT_INVITATION",
        expectedCommitment: data.expectedCommitment as never,
      },
    });
  },

  async getInvitation(id: string) {
    return db.ventureInvitation.findUnique({
      where: { id },
      include: {
        venture: {
          include: {
            owner: { select: { id: true, name: true, image: true } },
            primarySector: true,
          },
        },
        sender: { select: { id: true, name: true, image: true } },
        recipient: { select: { id: true, name: true, image: true } },
        recommendation: { include: { factorScores: true } },
      },
    });
  },

  async getInvitationsForRecipient(recipientUserId: string, status?: string) {
    return db.ventureInvitation.findMany({
      where: {
        recipientUserId,
        ...(status ? { status: status as never } : {}),
      },
      include: {
        venture: {
          include: {
            owner: { select: { id: true, name: true, image: true } },
            primarySector: true,
          },
        },
        sender: { select: { id: true, name: true, image: true } },
        recommendation: { include: { factorScores: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getInvitationsForVenture(ventureId: string, status?: string) {
    return db.ventureInvitation.findMany({
      where: {
        ventureId,
        ...(status ? { status: status as never } : {}),
      },
      include: {
        recipient: { select: { id: true, name: true, image: true } },
        recommendation: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateInvitationStatus(id: string, status: string) {
    return db.ventureInvitation.update({
      where: { id },
      data: { status: status as never, respondedAt: new Date() },
    });
  },

  async countPendingInvitations(recipientUserId: string) {
    return db.ventureInvitation.count({
      where: { recipientUserId, status: "PENDING" },
    });
  },
};
