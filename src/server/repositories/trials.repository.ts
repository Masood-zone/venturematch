import { db } from "@/lib/db";

export const trialsRepository = {
  async createRoom(ventureId: string) {
    return db.ventureRoom.create({
      data: {
        ventureId,
        status: "OPEN",
      },
    });
  },

  async getRoom(id: string) {
    return db.ventureRoom.findUnique({
      where: { id },
      include: {
        venture: {
          include: { owner: { select: { id: true, name: true, image: true } } },
        },
        participants: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        trials: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
  },

  async getRoomForVenture(ventureId: string) {
    return db.ventureRoom.findFirst({
      where: { ventureId, status: { in: ["OPEN", "TRIAL_ACTIVE"] } },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        trials: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
  },

  async addRoomParticipant(roomId: string, userId: string, proposedRole?: string) {
    return db.ventureRoomParticipant.upsert({
      where: { roomId_userId: { roomId, userId } },
      update: { status: "ACTIVE", proposedRole },
      create: { roomId, userId, proposedRole, status: "ACTIVE" },
    });
  },

  async createTrial(data: {
    ventureId: string;
    ventureRoomId?: string;
    objective?: string;
    durationDays?: number;
    startAt?: Date;
  }) {
    return db.founderTrial.create({
      data: {
        ...data,
        status: "PENDING",
        durationDays: data.durationDays ?? 7,
      },
    });
  },

  async getTrial(id: string) {
    return db.founderTrial.findUnique({
      where: { id },
      include: {
        venture: {
          include: { owner: { select: { id: true, name: true, image: true } } },
        },
        participants: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, image: true } },
            evidence: {
              include: { submitter: { select: { id: true, name: true } } },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        reviews: {
          include: { reviewer: { select: { id: true, name: true, image: true } } },
        },
      },
    });
  },

  async updateTrialStatus(id: string, status: string, dates?: {
    startAt?: Date;
    reviewAt?: Date;
    endAt?: Date;
  }) {
    return db.founderTrial.update({
      where: { id },
      data: { status: status as never, ...dates },
    });
  },

  async addTrialParticipant(trialId: string, userId: string, proposedRole?: string) {
    return db.founderTrialParticipant.upsert({
      where: { trialId_userId: { trialId, userId } },
      update: { proposedRole },
      create: { trialId, userId, proposedRole },
    });
  },

  async createTask(data: {
    trialId: string;
    title: string;
    purpose?: string;
    assigneeUserId?: string;
    dueAt?: Date;
  }) {
    return db.founderTrialTask.create({ data });
  },

  async updateTaskStatus(id: string, status: string, progress?: number) {
    return db.founderTrialTask.update({
      where: { id },
      data: {
        status: status as never,
        ...(progress !== undefined ? { progressCurrent: progress } : {}),
      },
    });
  },

  async submitTaskEvidence(taskId: string, submittedBy: string, data: {
    type: string;
    textValue?: string;
    url?: string;
    cloudinaryPublicId?: string;
  }) {
    return db.founderTrialEvidence.create({
      data: { taskId, submittedBy, ...data },
    });
  },

  async submitReview(data: {
    trialId: string;
    reviewerUserId: string;
    communicationScore: number;
    reliabilityScore: number;
    contributionScore: number;
    commitmentScore: number;
    goalAlignmentScore: number;
    workedWellText?: string;
    concernsText?: string;
    decision: string;
  }) {
    return db.founderTrialReview.upsert({
      where: { trialId_reviewerUserId: { trialId: data.trialId, reviewerUserId: data.reviewerUserId } },
      update: data as any,
      create: data as any,
    });
  },

  async getTrialsForVenture(ventureId: string) {
    return db.founderTrial.findMany({
      where: { ventureId },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, image: true } } },
        },
        tasks: true,
        reviews: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getTrialsForUser(userId: string) {
    return db.founderTrial.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        venture: {
          include: { owner: { select: { id: true, name: true } } },
        },
        tasks: {
          where: { assigneeUserId: userId },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
