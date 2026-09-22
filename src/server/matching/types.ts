export interface MatchingWeights {
  capability: number;      // 0.35
  interest: number;        // 0.20
  commitment: number;      // 0.15
  availability: number;    // 0.10
  goal: number;            // 0.10
  workingStyle: number;    // 0.05
  evidence: number;        // 0.05
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  capability: 0.35,
  interest: 0.20,
  commitment: 0.15,
  availability: 0.10,
  goal: 0.10,
  workingStyle: 0.05,
  evidence: 0.05,
};

export interface FactorScores {
  capability: number;
  interest: number;
  commitment: number;
  availability: number;
  goal: number;
  workingStyle: number;
  evidence: number;
}

export interface MatchScore {
  overall: number;
  factors: FactorScores;
  weights: MatchingWeights;
  algorithmVersion: string;
  explanation: {
    contributions: string[];
    gapsAddressed: string[];
    strengths: string[];
    concerns: string[];
  };
}

export const ALGORITHM_VERSION = "1.0.0";

export interface CandidateProfile {
  userId: string;
  capabilities: Array<{
    capabilityId: string;
    capabilityName: string;
    proficiency: string;
    confirmed: boolean;
    hasEvidence: boolean;
  }>;
  sectorInterests: string[];
  commitmentLevel: string;
  weeklyHoursBand: string;
  ventureGoal: string;
  structuredVsFlexible: number;
  independentVsCollaborative: number;
  fastVsDeliberate: number;
}

export interface VentureProfile {
  ventureId: string;
  requiredCapabilities: Array<{
    capabilityId: string;
    capabilityName: string;
    importanceScore: number;
  }>;
  coveredCapabilityIds: string[];
  primarySectorId: string;
  expectedCommitment: string;
  ambition: string;
  stage: string;
}
