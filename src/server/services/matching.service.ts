import { matchingRepository } from "@/server/repositories/matching.repository";
import { venturesRepository } from "@/server/repositories/ventures.repository";
import { calculateMatchScore } from "@/server/matching/calculate-match";
import { DEFAULT_WEIGHTS, ALGORITHM_VERSION, type CandidateProfile, type VentureProfile } from "@/server/matching/types";
import { ok, err, type ServiceResult } from "@/lib/errors";

export const matchingService = {
  async runMatchingForVenture(ventureId: string): Promise<ServiceResult<number>> {
    const venture = await venturesRepository.findById(ventureId);
    if (!venture) return err("Venture not found", "NOT_FOUND");

    const config = await matchingRepository.getActiveConfig();
    const weights = config ? {
      capability: config.capabilityWeight,
      interest: config.interestWeight,
      commitment: config.commitmentWeight,
      availability: config.availabilityWeight,
      goal: config.goalWeight,
      workingStyle: config.workingStyleWeight,
      evidence: config.evidenceWeight,
    } : DEFAULT_WEIGHTS;

    const ventureProfile: VentureProfile = {
      ventureId: venture.id,
      requiredCapabilities: venture.capabilityRequirements.map(r => ({
        capabilityId: r.capabilityId,
        capabilityName: r.capability.name,
        importanceScore: r.importanceScore,
      })),
      coveredCapabilityIds: venture.members
        .filter(m => m.status === "ACTIVE")
        .flatMap(m => m.user.studentProfile?.capabilities.map(c => c.capabilityId) ?? []),
      primarySectorId: venture.primarySectorId ?? "",
      expectedCommitment: venture.expectedCommitment,
      ambition: venture.ambition ?? "side_venture",
      stage: venture.stage,
    };

    const candidates = await matchingRepository.getCandidatesForMatching(ventureId);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    let created = 0;
    for (const candidate of candidates) {
      const candidateProfile: CandidateProfile = {
        userId: candidate.userId,
        capabilities: candidate.capabilities.map(c => ({
          capabilityId: c.capabilityId,
          capabilityName: c.capability.name,
          proficiency: c.proficiency,
          confirmed: c.confirmed,
          hasEvidence: c.evidence.length > 0,
        })),
        sectorInterests: candidate.ventureInterests.map(i => i.sectorId),
        commitmentLevel: candidate.founderPreference?.commitmentLevel ?? "SIDE_VENTURE",
        weeklyHoursBand: candidate.availability?.weeklyHoursBand ?? "5-10",
        ventureGoal: candidate.founderPreference?.ventureGoal ?? "side_venture",
        structuredVsFlexible: candidate.founderPreference?.structuredVsFlexible ?? 3,
        independentVsCollaborative: candidate.founderPreference?.independentVsCollaborative ?? 3,
        fastVsDeliberate: candidate.founderPreference?.fastVsDeliberate ?? 3,
      };

      const score = calculateMatchScore(candidateProfile, ventureProfile, weights, ALGORITHM_VERSION);

      // Only save recommendations with overall score >= 40
      if (score.overall >= 40) {
        await matchingRepository.createRecommendation({
          ventureId,
          candidateUserId: candidate.userId,
          overallScore: score.overall,
          algorithmVersion: score.algorithmVersion,
          configId: config?.id,
          expiresAt,
          factorScores: Object.entries(score.factors).map(([factor, rawScore]) => ({
            factor,
            rawScore,
            weight: weights[factor as keyof typeof weights],
            weightedScore: rawScore * weights[factor as keyof typeof weights],
            explanationDataJson: JSON.stringify(score.explanation),
          })),
        });
        created++;
      }
    }

    return ok(created);
  },

  async getRecommendationsForVenture(ventureId: string) {
    const recs = await matchingRepository.getRecommendationsForVenture(ventureId);
    return ok(recs);
  },

  async getMatchesForUser(userId: string) {
    const recs = await matchingRepository.getRecommendationsForCandidate(userId);
    return ok(recs);
  },

  async getActiveConfig() {
    const config = await matchingRepository.getActiveConfig();
    return ok(config ?? DEFAULT_WEIGHTS);
  },

  async getAllConfigs() {
    return ok(await matchingRepository.getAllConfigs());
  },

  async createConfig(data: {
    capabilityWeight: number;
    interestWeight: number;
    commitmentWeight: number;
    availabilityWeight: number;
    goalWeight: number;
    workingStyleWeight: number;
    evidenceWeight: number;
  }): Promise<ServiceResult<boolean>> {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (Math.abs(total - 1) > 0.01) return err("Weights must sum to 1.0", "VALIDATION_ERROR");

    const latest = await matchingRepository.getAllConfigs();
    const version = (latest[0]?.version ?? 0) + 1;
    await matchingRepository.createConfig({ ...data, version });
    return ok(true);
  },

  async activateConfig(id: string, adminId: string): Promise<ServiceResult<boolean>> {
    await matchingRepository.activateConfig(id, adminId);
    return ok(true);
  },
};
