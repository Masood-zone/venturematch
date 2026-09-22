import { talentRepository } from "@/server/repositories/talent.repository";
import { ok, err, type ServiceResult } from "@/lib/errors";

export const profileService = {
  async getProfile(userId: string): Promise<ServiceResult<Awaited<ReturnType<typeof talentRepository.findById>>>> {
    const profile = await talentRepository.findById(userId);
    if (!profile) return err("Profile not found", "NOT_FOUND");
    return ok(profile);
  },

  async ensureProfile(userId: string) {
    const existing = await talentRepository.findByUserId(userId);
    if (existing) return ok(existing);
    const created = await talentRepository.updateStudentProfile(userId, {});
    return ok(created);
  },

  async saveAcademicStep(
    userId: string,
    data: { faculty?: string; department?: string; programme?: string; level?: string; expectedGraduationYear?: number }
  ): Promise<ServiceResult<boolean>> {
    if (!data.faculty || !data.programme) {
      return err("Select a faculty and programme", "VALIDATION_ERROR");
    }
    const programme = await talentRepository.findActiveAcademicProgramme(data.faculty, data.programme);
    if (!programme) {
      return err("Select a current USTED Kumasi programme from the catalogue", "VALIDATION_ERROR");
    }
    const profile = await talentRepository.updateStudentProfile(userId, {
      level: data.level,
      expectedGraduationYear: data.expectedGraduationYear,
      onboardingStep: "capabilities",
    });
    await talentRepository.upsertAcademicProfile(profile.id, {
      faculty: data.faculty,
      department: data.department,
      programme: data.programme,
    });
    return ok(true);
  },

  async saveCapabilitiesStep(
    userId: string,
    capabilities: Array<{ capabilityId: string; proficiency: string }>
  ): Promise<ServiceResult<boolean>> {
    const profile = await talentRepository.findByUserId(userId);
    if (!profile) return err("Profile not found", "NOT_FOUND");
    await talentRepository.setCapabilities(profile.id, capabilities);
    await talentRepository.updateStudentProfile(userId, { onboardingStep: "interests" });
    return ok(true);
  },

  async saveInterestsStep(
    userId: string,
    sectorIds: string[]
  ): Promise<ServiceResult<boolean>> {
    const profile = await talentRepository.findByUserId(userId);
    if (!profile) return err("Profile not found", "NOT_FOUND");
    await talentRepository.setVentureInterests(profile.id, sectorIds);
    await talentRepository.updateStudentProfile(userId, { onboardingStep: "preferences" });
    return ok(true);
  },

  async savePreferencesStep(
    userId: string,
    data: {
      commitmentLevel?: string;
      preferredRoleCategory?: string;
      ventureGoal?: string;
      structuredVsFlexible?: number;
      independentVsCollaborative?: number;
      fastVsDeliberate?: number;
      weeklyHoursBand?: string;
      timezone?: string;
    }
  ): Promise<ServiceResult<boolean>> {
    const profile = await talentRepository.findByUserId(userId);
    if (!profile) return err("Profile not found", "NOT_FOUND");
    await talentRepository.upsertFounderPreference(profile.id, {
      commitmentLevel: data.commitmentLevel,
      preferredRoleCategory: data.preferredRoleCategory,
      ventureGoal: data.ventureGoal,
      structuredVsFlexible: data.structuredVsFlexible,
      independentVsCollaborative: data.independentVsCollaborative,
      fastVsDeliberate: data.fastVsDeliberate,
    });
    await talentRepository.upsertAvailability(profile.id, {
      weeklyHoursBand: data.weeklyHoursBand,
      timezone: data.timezone,
    });
    await talentRepository.updateStudentProfile(userId, { onboardingStep: "talent-dna" });
    return ok(true);
  },

  async completeOnboarding(userId: string): Promise<ServiceResult<boolean>> {
    const profile = await talentRepository.findByUserId(userId);
    if (!profile) return err("Profile not found", "NOT_FOUND");
    const strength = await this.calculateProfileStrength(userId);
    await talentRepository.updateStudentProfile(userId, {
      onboardingCompleted: true,
      onboardingStep: "complete",
      profileStrength: strength,
    });
    return ok(true);
  },

  async calculateProfileStrength(userId: string): Promise<number> {
    const profile = await talentRepository.findById(userId);
    if (!profile) return 0;
    let score = 0;
    if (profile.bio) score += 15;
    if (profile.academicProfile?.faculty) score += 10;
    if (profile.academicProfile?.programme) score += 10;
    if (profile.capabilities.length >= 3) score += 20;
    else if (profile.capabilities.length > 0) score += 10;
    if (profile.ventureInterests.length >= 2) score += 15;
    else if (profile.ventureInterests.length > 0) score += 8;
    if (profile.founderPreference) score += 15;
    if (profile.availability) score += 10;
    const withEvidence = profile.capabilities.filter(c => c.evidence.length > 0);
    if (withEvidence.length >= 2) score += 5;
    return Math.min(100, score);
  },

  async updateProfile(
    userId: string,
    data: { bio?: string; discoverability?: boolean; availabilityStatus?: string }
  ): Promise<ServiceResult<boolean>> {
    await talentRepository.updateStudentProfile(userId, data);
    const strength = await this.calculateProfileStrength(userId);
    await talentRepository.updateStudentProfile(userId, { profileStrength: strength });
    return ok(true);
  },

  async getCapabilityLibrary() {
    return talentRepository.getAllCapabilityFamilies();
  },

  async getAcademicProgrammes() {
    return talentRepository.listAcademicProgrammes();
  },

  async getSectors() {
    return talentRepository.getAllSectors();
  },

  async discoverPeople(filters: {
    capabilityIds?: string[];
    sectorIds?: string[];
    page?: number;
    pageSize?: number;
  }) {
    const { page = 1, pageSize = 20 } = filters;
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      talentRepository.listDiscoverable({ ...filters, limit: pageSize, offset }),
      talentRepository.countDiscoverable(filters),
    ]);
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },
};
