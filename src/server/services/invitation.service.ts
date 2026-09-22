import { matchingRepository } from "@/server/repositories/matching.repository";
import { venturesRepository } from "@/server/repositories/ventures.repository";
import { notificationsRepository } from "@/server/repositories/notifications.repository";
import { ok, err, type ServiceResult } from "@/lib/errors";

export const invitationService = {
  async sendInvitation(
    senderUserId: string,
    data: {
      ventureId: string;
      recipientUserId: string;
      proposedRole?: string;
      expectedCommitment?: string;
      message?: string;
      recommendationId?: string;
    }
  ): Promise<ServiceResult<{ id: string }>> {
    const venture = await venturesRepository.findById(data.ventureId);
    if (!venture) return err("Venture not found", "NOT_FOUND");
    if (venture.ownerId !== senderUserId) return err("Only the venture owner can send invitations", "FORBIDDEN");

    // Check not already invited
    const existing = await matchingRepository.getInvitationsForVenture(data.ventureId);
    const alreadyInvited = existing.some(
      i => i.recipientUserId === data.recipientUserId && ["PENDING", "INTERESTED", "TRIAL_PROPOSED"].includes(i.status)
    );
    if (alreadyInvited) return err("This person already has a pending invitation to this venture", "CONFLICT");

    const invitation = await matchingRepository.createInvitation({
      ...data,
      senderUserId,
      invitationType: data.recommendationId ? "MATCH_INVITATION" : "DIRECT_INVITATION",
    });

    await notificationsRepository.create({
      userId: data.recipientUserId,
      type: "INVITATION_RECEIVED",
      title: "New venture invitation",
      body: `You've been invited to join ${venture.name}`,
      entityType: "invitation",
      entityId: invitation.id,
    });

    return ok({ id: invitation.id });
  },

  async respondToInvitation(
    invitationId: string,
    userId: string,
    response: "INTERESTED" | "DECLINED"
  ): Promise<ServiceResult<boolean>> {
    const invitation = await matchingRepository.getInvitation(invitationId);
    if (!invitation) return err("Invitation not found", "NOT_FOUND");
    if (invitation.recipientUserId !== userId) return err("Not your invitation", "FORBIDDEN");
    if (invitation.status !== "PENDING") return err("Invitation is no longer pending", "CONFLICT");

    await matchingRepository.updateInvitationStatus(invitationId, response);

    if (response === "INTERESTED") {
      await notificationsRepository.create({
        userId: invitation.senderUserId,
        type: "INVITATION_ACCEPTED",
        title: `${invitation.recipient.name} is interested`,
        body: `${invitation.recipient.name} expressed interest in joining ${invitation.venture.name}`,
        entityType: "invitation",
        entityId: invitation.id,
      });
      if (invitation.recommendationId) {
        await matchingRepository.acceptRecommendation(invitation.recommendationId);
      }
    }

    return ok(true);
  },

  async getInvitationsForUser(userId: string, status?: string) {
    const invitations = await matchingRepository.getInvitationsForRecipient(userId, status);
    return ok(invitations);
  },

  async getInvitationsForVenture(ventureId: string, userId: string, status?: string) {
    const venture = await venturesRepository.findById(ventureId);
    if (!venture) return err("Venture not found", "NOT_FOUND");
    if (venture.ownerId !== userId) return err("Forbidden", "FORBIDDEN");
    const invitations = await matchingRepository.getInvitationsForVenture(ventureId, status);
    return ok(invitations);
  },

  async getInvitation(id: string) {
    const invitation = await matchingRepository.getInvitation(id);
    if (!invitation) return err("Invitation not found", "NOT_FOUND");
    return ok(invitation);
  },

  async proposeTrialFromInvitation(
    invitationId: string,
    senderUserId: string
  ): Promise<ServiceResult<boolean>> {
    const invitation = await matchingRepository.getInvitation(invitationId);
    if (!invitation) return err("Invitation not found", "NOT_FOUND");
    if (invitation.senderUserId !== senderUserId) return err("Forbidden", "FORBIDDEN");
    if (invitation.status !== "INTERESTED") return err("Invitation must be in INTERESTED state", "CONFLICT");

    await matchingRepository.updateInvitationStatus(invitationId, "TRIAL_PROPOSED");

    await notificationsRepository.create({
      userId: invitation.recipientUserId,
      type: "TRIAL_PROPOSED",
      title: "Founder trial proposed",
      body: `${invitation.venture.name} has proposed a founder trial with you`,
      entityType: "venture",
      entityId: invitation.ventureId,
    });

    return ok(true);
  },
};
