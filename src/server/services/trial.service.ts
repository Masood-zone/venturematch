import { trialsRepository } from "@/server/repositories/trials.repository";
import { venturesRepository } from "@/server/repositories/ventures.repository";
import { notificationsRepository } from "@/server/repositories/notifications.repository";
import { ok, err, type ServiceResult } from "@/lib/errors";

export const trialService = {
  async getOrCreateRoom(ventureId: string, userId: string): Promise<ServiceResult<{ id: string }>> {
    const venture = await venturesRepository.findById(ventureId);
    if (!venture) return err("Venture not found", "NOT_FOUND");
    if (venture.ownerId !== userId) return err("Forbidden", "FORBIDDEN");

    const existing = await trialsRepository.getRoomForVenture(ventureId);
    if (existing) return ok({ id: existing.id });

    const room = await trialsRepository.createRoom(ventureId);
    await trialsRepository.addRoomParticipant(room.id, userId, "Founder");
    return ok({ id: room.id });
  },

  async getRoom(roomId: string) {
    const room = await trialsRepository.getRoom(roomId);
    if (!room) return err("Room not found", "NOT_FOUND");
    return ok(room);
  },

  async inviteToRoom(roomId: string, userId: string, proposedRole?: string): Promise<ServiceResult<boolean>> {
    const room = await trialsRepository.getRoom(roomId);
    if (!room) return err("Room not found", "NOT_FOUND");
    await trialsRepository.addRoomParticipant(roomId, userId, proposedRole);
    await notificationsRepository.create({
      userId,
      type: "ROOM_INVITATION",
      title: "You've been added to a venture room",
      body: `You've been added to a pre-trial venture room for ${room.venture.name}`,
      entityType: "room",
      entityId: roomId,
    });
    return ok(true);
  },

  async startTrial(
    ventureId: string,
    ownerId: string,
    data: {
      objective?: string;
      durationDays?: number;
      participantUserIds: string[];
    }
  ): Promise<ServiceResult<{ id: string }>> {
    const venture = await venturesRepository.findById(ventureId);
    if (!venture) return err("Venture not found", "NOT_FOUND");
    if (venture.ownerId !== ownerId) return err("Forbidden", "FORBIDDEN");

    const room = await trialsRepository.getRoomForVenture(ventureId);
    const startAt = new Date();
    const reviewAt = new Date(startAt.getTime() + (data.durationDays ?? 7) * 24 * 60 * 60 * 1000);

    const trial = await trialsRepository.createTrial({
      ventureId,
      ventureRoomId: room?.id,
      objective: data.objective,
      durationDays: data.durationDays ?? 7,
      startAt,
    });

    // Add founder + participants
    await trialsRepository.addTrialParticipant(trial.id, ownerId, "Founder");
    for (const uid of data.participantUserIds) {
      await trialsRepository.addTrialParticipant(trial.id, uid);
      await notificationsRepository.create({
        userId: uid,
        type: "TRIAL_STARTED",
        title: "Founder trial started",
        body: `Your trial with ${venture.name} has started`,
        entityType: "trial",
        entityId: trial.id,
      });
    }

    await trialsRepository.updateTrialStatus(trial.id, "ACTIVE", { startAt, reviewAt });
    return ok({ id: trial.id });
  },

  async getTrial(id: string) {
    const trial = await trialsRepository.getTrial(id);
    if (!trial) return err("Trial not found", "NOT_FOUND");
    return ok(trial);
  },

  async addTask(
    trialId: string,
    userId: string,
    data: { title: string; purpose?: string; assigneeUserId?: string; dueAt?: Date }
  ): Promise<ServiceResult<boolean>> {
    const trial = await trialsRepository.getTrial(trialId);
    if (!trial) return err("Trial not found", "NOT_FOUND");
    if (trial.venture.ownerId !== userId) return err("Forbidden", "FORBIDDEN");
    await trialsRepository.createTask({ trialId, ...data });
    return ok(true);
  },

  async updateTaskStatus(
    taskId: string,
    userId: string,
    status: string,
    progress?: number
  ): Promise<ServiceResult<boolean>> {
    await trialsRepository.updateTaskStatus(taskId, status, progress);
    return ok(true);
  },

  async submitEvidence(
    taskId: string,
    userId: string,
    data: { type: string; textValue?: string; url?: string; cloudinaryPublicId?: string }
  ): Promise<ServiceResult<boolean>> {
    await trialsRepository.submitTaskEvidence(taskId, userId, data);
    return ok(true);
  },

  async submitReview(
    trialId: string,
    reviewerUserId: string,
    data: {
      communicationScore: number;
      reliabilityScore: number;
      contributionScore: number;
      commitmentScore: number;
      goalAlignmentScore: number;
      workedWellText?: string;
      concernsText?: string;
      decision: string;
    }
  ): Promise<ServiceResult<boolean>> {
    const trial = await trialsRepository.getTrial(trialId);
    if (!trial) return err("Trial not found", "NOT_FOUND");
    const isParticipant = trial.participants.some(p => p.userId === reviewerUserId);
    if (!isParticipant) return err("You are not a participant in this trial", "FORBIDDEN");

    await trialsRepository.submitReview({ trialId, reviewerUserId, ...data });

    // Check if all participants have reviewed to finalize
    const allParticipants = trial.participants.map(p => p.userId);
    const allReviewed = trial.reviews.length + 1 >= allParticipants.length;
    if (allReviewed) {
      await trialsRepository.updateTrialStatus(trialId, "COMPLETED", { endAt: new Date() });
    }

    return ok(true);
  },

  async getTrialsForVenture(ventureId: string) {
    return ok(await trialsRepository.getTrialsForVenture(ventureId));
  },

  async getTrialsForUser(userId: string) {
    return ok(await trialsRepository.getTrialsForUser(userId));
  },
};
