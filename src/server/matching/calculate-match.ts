
import type { CandidateProfile, VentureProfile, MatchScore, MatchingWeights, FactorScores } from "./types";
import { DEFAULT_WEIGHTS, ALGORITHM_VERSION } from "./types";
import { clampScore } from "@/lib/utils";

// Factor C: Missing Capability Coverage (35%)
export function scoreCapability(candidate: CandidateProfile, venture: VentureProfile): number {
  const missing = venture.requiredCapabilities.filter(
    r => !venture.coveredCapabilityIds.includes(r.capabilityId)
  );
  if (missing.length === 0) return 50; // venture fully covered, moderate score

  let totalWeight = 0;
  let coveredWeight = 0;

  for (const req of missing) {
    const w = req.importanceScore;
    totalWeight += w;
    const has = candidate.capabilities.find(c => c.capabilityId === req.capabilityId);
    if (has) {
      const profBonus = { BEGINNER: 0.6, INTERMEDIATE: 0.8, ADVANCED: 0.95, EXPERT: 1.0 }[has.proficiency] ?? 0.7;
      coveredWeight += w * profBonus;
    }
  }

  return totalWeight > 0 ? (coveredWeight / totalWeight) * 100 : 0;
}

// Factor I: Venture / Industry Interest (20%)
export function scoreInterest(candidate: CandidateProfile, venture: VentureProfile): number {
  if (!venture.primarySectorId) return 50;
  if (candidate.sectorInterests.includes(venture.primarySectorId)) return 100;
  return 30;
}

// Factor M: Commitment Compatibility (15%)
const COMMITMENT_ORDER = ["CASUAL", "SIDE_VENTURE", "SERIOUS", "FULL_TIME"];
export function scoreCommitment(candidate: CandidateProfile, venture: VentureProfile): number {
  const ci = COMMITMENT_ORDER.indexOf(candidate.commitmentLevel);
  const vi = COMMITMENT_ORDER.indexOf(venture.expectedCommitment);
  if (ci === -1 || vi === -1) return 50;
  const diff = Math.abs(ci - vi);
  return Math.max(0, 100 - diff * 30);
}

// Factor A: Availability Compatibility (10%)
const HOURS_ORDER = ["2-5", "5-10", "10-20", "20+"];
export function scoreAvailability(candidate: CandidateProfile, venture: VentureProfile): number {
  const ci = HOURS_ORDER.indexOf(candidate.weeklyHoursBand);
  if (ci === -1) return 50;
  // Map venture commitment to expected hours
  const ventureHoursMap: Record<string, string> = {
    CASUAL: "2-5", SIDE_VENTURE: "5-10", SERIOUS: "10-20", FULL_TIME: "20+"
  };
  const vh = HOURS_ORDER.indexOf(ventureHoursMap[venture.expectedCommitment] ?? "5-10");
  const diff = Math.abs(ci - vh);
  return Math.max(0, 100 - diff * 25);
}

// Factor G: Venture Goal Alignment (10%)
const GOAL_COMPAT: Record<string, Record<string, number>> = {
  "experimental": { "experimental": 100, "side_venture": 80, "serious": 50, "long_term": 30 },
  "side_venture":  { "experimental": 80,  "side_venture": 100,"serious": 70, "long_term": 50 },
  "serious":       { "experimental": 50,  "side_venture": 70, "serious": 100,"long_term": 80 },
  "long_term":     { "experimental": 30,  "side_venture": 50, "serious": 80, "long_term": 100 },
};
export function scoreGoal(candidate: CandidateProfile, venture: VentureProfile): number {
  const cg = (candidate.ventureGoal ?? "side_venture").toLowerCase();
  const vg = (venture.ambition ?? "side_venture").toLowerCase();
  return GOAL_COMPAT[cg]?.[vg] ?? 50;
}

// Factor W: Working Style Compatibility (5%)
export function scoreWorkingStyle(candidate: CandidateProfile, _venture: VentureProfile): number {
  // Without venture-level prefs, score based on reasonable defaults
  const sv = Math.abs(candidate.structuredVsFlexible - 3);
  const ic = Math.abs(candidate.independentVsCollaborative - 3);
  const fd = Math.abs(candidate.fastVsDeliberate - 3);
  const avg = (sv + ic + fd) / 3;
  return Math.max(0, 100 - avg * 20);
}

// Factor E: Skill Evidence / Experience (5%)
export function scoreEvidence(candidate: CandidateProfile, venture: VentureProfile): number {
  const relevantCaps = venture.requiredCapabilities.map(r => r.capabilityId);
  const relevantWithEvidence = candidate.capabilities.filter(
    c => relevantCaps.includes(c.capabilityId) && c.hasEvidence
  );
  const relevantTotal = candidate.capabilities.filter(
    c => relevantCaps.includes(c.capabilityId)
  );
  if (relevantTotal.length === 0) return 30;
  return (relevantWithEvidence.length / relevantTotal.length) * 100;
}

// ─── Main calculator ───────────────────────────────────────────────────────────

export function calculateMatchScore(
  candidate: CandidateProfile,
  venture: VentureProfile,
  weights: MatchingWeights = DEFAULT_WEIGHTS,
  configVersion = ALGORITHM_VERSION
): MatchScore {
  const factors: FactorScores = {
    capability:   clampScore(scoreCapability(candidate, venture)),
    interest:     clampScore(scoreInterest(candidate, venture)),
    commitment:   clampScore(scoreCommitment(candidate, venture)),
    availability: clampScore(scoreAvailability(candidate, venture)),
    goal:         clampScore(scoreGoal(candidate, venture)),
    workingStyle: clampScore(scoreWorkingStyle(candidate, venture)),
    evidence:     clampScore(scoreEvidence(candidate, venture)),
  };

  const overall = clampScore(
    factors.capability   * weights.capability +
    factors.interest     * weights.interest +
    factors.commitment   * weights.commitment +
    factors.availability * weights.availability +
    factors.goal         * weights.goal +
    factors.workingStyle * weights.workingStyle +
    factors.evidence     * weights.evidence
  );

  // Build explanation
  const missingCaps = venture.requiredCapabilities
    .filter(r => !venture.coveredCapabilityIds.includes(r.capabilityId))
    .map(r => r.capabilityName);
  const contributions = candidate.capabilities
    .filter(c => missingCaps.map((_, i) =>
      venture.requiredCapabilities.filter(r => !venture.coveredCapabilityIds.includes(r.capabilityId))[i]?.capabilityId
    ).includes(c.capabilityId))
    .map(c => c.capabilityName);

  const strengths: string[] = [];
  const concerns: string[] = [];

  if (factors.interest >= 80) strengths.push("Strong sector interest alignment");
  if (factors.commitment >= 80) strengths.push("Compatible commitment level");
  if (factors.evidence >= 70) strengths.push("Evidenced relevant capabilities");
  if (factors.availability < 50) concerns.push("Availability may not meet venture needs");
  if (factors.capability < 40) concerns.push("Limited coverage of missing capabilities");

  return {
    overall,
    factors,
    weights,
    algorithmVersion: configVersion,
    explanation: {
      contributions,
      gapsAddressed: missingCaps.slice(0, 3),
      strengths,
      concerns,
    },
  };
}
