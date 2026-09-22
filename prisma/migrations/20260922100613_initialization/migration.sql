-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'student',

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `session_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `providerId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `accessToken` TEXT NULL,
    `refreshToken` TEXT NULL,
    `idToken` TEXT NULL,
    `accessTokenExpiresAt` DATETIME(3) NULL,
    `refreshTokenExpiresAt` DATETIME(3) NULL,
    `scope` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_profile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bio` TEXT NULL,
    `level` VARCHAR(191) NULL,
    `expectedGraduationYear` INTEGER NULL,
    `discoverability` BOOLEAN NOT NULL DEFAULT true,
    `availabilityStatus` VARCHAR(191) NOT NULL DEFAULT 'AVAILABLE',
    `profileStrength` INTEGER NOT NULL DEFAULT 0,
    `onboardingCompleted` BOOLEAN NOT NULL DEFAULT false,
    `onboardingStep` VARCHAR(191) NOT NULL DEFAULT 'academic',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_profile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academic_profile` (
    `id` VARCHAR(191) NOT NULL,
    `studentProfileId` VARCHAR(191) NOT NULL,
    `faculty` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `programme` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `academic_profile_studentProfileId_key`(`studentProfileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_profile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_profile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `capability_family` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `capability_family_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `capability` (
    `id` VARCHAR(191) NOT NULL,
    `familyId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `capability_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_capability` (
    `id` VARCHAR(191) NOT NULL,
    `studentProfileId` VARCHAR(191) NOT NULL,
    `capabilityId` VARCHAR(191) NOT NULL,
    `proficiency` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL DEFAULT 'INTERMEDIATE',
    `source` ENUM('SELF_SELECTED', 'AI_EXTRACTED', 'ADMIN_ADDED') NOT NULL DEFAULT 'SELF_SELECTED',
    `confirmed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_capability_studentProfileId_capabilityId_key`(`studentProfileId`, `capabilityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `capability_evidence` (
    `id` VARCHAR(191) NOT NULL,
    `studentCapabilityId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `cloudinaryPublicId` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `linkUrl` VARCHAR(191) NULL,
    `verificationStatus` VARCHAR(191) NOT NULL DEFAULT 'UNVERIFIED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venture_sector` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `venture_sector_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_venture_interest` (
    `id` VARCHAR(191) NOT NULL,
    `studentProfileId` VARCHAR(191) NOT NULL,
    `sectorId` VARCHAR(191) NOT NULL,
    `strength` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `student_venture_interest_studentProfileId_sectorId_key`(`studentProfileId`, `sectorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `founder_preference` (
    `id` VARCHAR(191) NOT NULL,
    `studentProfileId` VARCHAR(191) NOT NULL,
    `commitmentLevel` ENUM('CASUAL', 'SIDE_VENTURE', 'SERIOUS', 'FULL_TIME') NOT NULL DEFAULT 'SIDE_VENTURE',
    `preferredRoleCategory` VARCHAR(191) NULL,
    `ventureGoal` VARCHAR(191) NULL,
    `structuredVsFlexible` INTEGER NOT NULL DEFAULT 3,
    `independentVsCollaborative` INTEGER NOT NULL DEFAULT 3,
    `fastVsDeliberate` INTEGER NOT NULL DEFAULT 3,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `founder_preference_studentProfileId_key`(`studentProfileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_availability` (
    `id` VARCHAR(191) NOT NULL,
    `studentProfileId` VARCHAR(191) NOT NULL,
    `weeklyHoursBand` VARCHAR(191) NOT NULL DEFAULT '5-10',
    `timezone` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_availability_studentProfileId_key`(`studentProfileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venture` (
    `id` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `shortPitch` TEXT NULL,
    `problem` TEXT NULL,
    `solution` TEXT NULL,
    `targetUsers` TEXT NULL,
    `primarySectorId` VARCHAR(191) NULL,
    `secondarySectorId` VARCHAR(191) NULL,
    `stage` ENUM('IDEA', 'VALIDATION', 'PROTOTYPE', 'EARLY_LAUNCH', 'OPERATE') NOT NULL DEFAULT 'IDEA',
    `ambition` VARCHAR(191) NULL,
    `expectedCommitment` ENUM('CASUAL', 'SIDE_VENTURE', 'SERIOUS', 'FULL_TIME') NOT NULL DEFAULT 'SIDE_VENTURE',
    `logoPublicId` VARCHAR(191) NULL,
    `logoUrl` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `venture_slug_key`(`slug`),
    INDEX `venture_ownerId_idx`(`ownerId`),
    INDEX `venture_primarySectorId_idx`(`primarySectorId`),
    INDEX `venture_stage_status_idx`(`stage`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venture_member` (
    `id` VARCHAR(191) NOT NULL,
    `ventureId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `roleTitle` VARCHAR(191) NULL,
    `membershipType` ENUM('FOUNDER', 'CO_FOUNDER', 'TEAM_MEMBER', 'SPECIALIST') NOT NULL DEFAULT 'TEAM_MEMBER',
    `status` ENUM('ACTIVE', 'INVITED', 'LEFT', 'REMOVED') NOT NULL DEFAULT 'ACTIVE',
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `venture_member_ventureId_userId_key`(`ventureId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venture_capability_requirement` (
    `id` VARCHAR(191) NOT NULL,
    `ventureId` VARCHAR(191) NOT NULL,
    `capabilityId` VARCHAR(191) NOT NULL,
    `importanceScore` INTEGER NOT NULL DEFAULT 5,
    `priority` VARCHAR(191) NOT NULL DEFAULT 'MEDIUM',
    `source` VARCHAR(191) NOT NULL DEFAULT 'MANUAL',
    `confirmed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `venture_capability_requirement_ventureId_capabilityId_key`(`ventureId`, `capabilityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venture_dna` (
    `id` VARCHAR(191) NOT NULL,
    `ventureId` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `structuredSummaryJson` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `confirmedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matching_configuration` (
    `id` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL,
    `capabilityWeight` DOUBLE NOT NULL DEFAULT 0.35,
    `interestWeight` DOUBLE NOT NULL DEFAULT 0.20,
    `commitmentWeight` DOUBLE NOT NULL DEFAULT 0.15,
    `availabilityWeight` DOUBLE NOT NULL DEFAULT 0.10,
    `goalWeight` DOUBLE NOT NULL DEFAULT 0.10,
    `workingStyleWeight` DOUBLE NOT NULL DEFAULT 0.05,
    `evidenceWeight` DOUBLE NOT NULL DEFAULT 0.05,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `publishedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match_recommendation` (
    `id` VARCHAR(191) NOT NULL,
    `ventureId` VARCHAR(191) NOT NULL,
    `candidateUserId` VARCHAR(191) NOT NULL,
    `overallScore` DOUBLE NOT NULL,
    `algorithmVersion` VARCHAR(191) NOT NULL,
    `configId` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'ACCEPTED', 'DECLINED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `generatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,

    INDEX `match_recommendation_ventureId_overallScore_idx`(`ventureId`, `overallScore`),
    INDEX `match_recommendation_candidateUserId_generatedAt_idx`(`candidateUserId`, `generatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match_factor_score` (
    `id` VARCHAR(191) NOT NULL,
    `recommendationId` VARCHAR(191) NOT NULL,
    `factor` VARCHAR(191) NOT NULL,
    `rawScore` DOUBLE NOT NULL,
    `weight` DOUBLE NOT NULL,
    `weightedScore` DOUBLE NOT NULL,
    `explanationDataJson` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venture_invitation` (
    `id` VARCHAR(191) NOT NULL,
    `ventureId` VARCHAR(191) NOT NULL,
    `senderUserId` VARCHAR(191) NOT NULL,
    `recipientUserId` VARCHAR(191) NOT NULL,
    `recommendationId` VARCHAR(191) NULL,
    `proposedRole` VARCHAR(191) NULL,
    `expectedCommitment` ENUM('CASUAL', 'SIDE_VENTURE', 'SERIOUS', 'FULL_TIME') NULL,
    `message` TEXT NULL,
    `invitationType` ENUM('MATCH_INVITATION', 'DIRECT_INVITATION') NOT NULL DEFAULT 'DIRECT_INVITATION',
    `status` ENUM('PENDING', 'INTERESTED', 'DECLINED', 'WITHDRAWN', 'TRIAL_PROPOSED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `respondedAt` DATETIME(3) NULL,

    INDEX `venture_invitation_recipientUserId_status_idx`(`recipientUserId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venture_room` (
    `id` VARCHAR(191) NOT NULL,
    `ventureId` VARCHAR(191) NOT NULL,
    `status` ENUM('OPEN', 'TRIAL_ACTIVE', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venture_room_participant` (
    `id` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `proposedRole` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `venture_room_participant_roomId_userId_key`(`roomId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `founder_trial` (
    `id` VARCHAR(191) NOT NULL,
    `ventureId` VARCHAR(191) NOT NULL,
    `ventureRoomId` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `startAt` DATETIME(3) NULL,
    `reviewAt` DATETIME(3) NULL,
    `endAt` DATETIME(3) NULL,
    `objective` TEXT NULL,
    `durationDays` INTEGER NOT NULL DEFAULT 7,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `founder_trial_participant` (
    `id` VARCHAR(191) NOT NULL,
    `trialId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `proposedRole` VARCHAR(191) NULL,
    `decisionStatus` ENUM('CONTINUE', 'EXTEND', 'STOP') NULL,

    UNIQUE INDEX `founder_trial_participant_trialId_userId_key`(`trialId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `founder_trial_task` (
    `id` VARCHAR(191) NOT NULL,
    `trialId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `purpose` TEXT NULL,
    `assigneeUserId` VARCHAR(191) NULL,
    `dueAt` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `progressCurrent` INTEGER NOT NULL DEFAULT 0,
    `progressTarget` INTEGER NOT NULL DEFAULT 100,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `founder_trial_evidence` (
    `id` VARCHAR(191) NOT NULL,
    `taskId` VARCHAR(191) NOT NULL,
    `submittedBy` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `textValue` TEXT NULL,
    `url` VARCHAR(191) NULL,
    `cloudinaryPublicId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `founder_trial_review` (
    `id` VARCHAR(191) NOT NULL,
    `trialId` VARCHAR(191) NOT NULL,
    `reviewerUserId` VARCHAR(191) NOT NULL,
    `communicationScore` INTEGER NOT NULL,
    `reliabilityScore` INTEGER NOT NULL,
    `contributionScore` INTEGER NOT NULL,
    `commitmentScore` INTEGER NOT NULL,
    `goalAlignmentScore` INTEGER NOT NULL,
    `workedWellText` TEXT NULL,
    `concernsText` TEXT NULL,
    `decision` ENUM('CONTINUE', 'EXTEND', 'STOP') NOT NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `founder_trial_review_trialId_reviewerUserId_key`(`trialId`, `reviewerUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_charter` (
    `id` VARCHAR(191) NOT NULL,
    `ventureId` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `meetingFrequency` VARCHAR(191) NULL,
    `communicationMethod` VARCHAR(191) NULL,
    `decisionMethod` VARCHAR(191) NULL,
    `expectationsText` TEXT NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `team_charter_ventureId_key`(`ventureId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_charter_member` (
    `id` VARCHAR(191) NOT NULL,
    `charterId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `roleTitle` VARCHAR(191) NULL,
    `responsibilities` TEXT NULL,
    `weeklyCommitmentHours` INTEGER NULL,
    `confirmedAt` DATETIME(3) NULL,

    UNIQUE INDEX `team_charter_member_charterId_userId_key`(`charterId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_objective` (
    `id` VARCHAR(191) NOT NULL,
    `charterId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venture_milestone` (
    `id` VARCHAR(191) NOT NULL,
    `ventureId` VARCHAR(191) NOT NULL,
    `stage` ENUM('IDEA', 'VALIDATION', 'PROTOTYPE', 'EARLY_LAUNCH', 'OPERATE') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `objective` TEXT NULL,
    `expectedOutcome` TEXT NULL,
    `status` ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE') NOT NULL DEFAULT 'PLANNED',
    `dueAt` DATETIME(3) NULL,
    `progressCurrent` INTEGER NOT NULL DEFAULT 0,
    `progressTarget` INTEGER NOT NULL DEFAULT 100,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venture_contribution` (
    `id` VARCHAR(191) NOT NULL,
    `ventureId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `milestoneId` VARCHAR(191) NULL,
    `category` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `evidenceUrl` VARCHAR(191) NULL,
    `publicId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venture_health_snapshot` (
    `id` VARCHAR(191) NOT NULL,
    `ventureId` VARCHAR(191) NOT NULL,
    `overallHealth` DOUBLE NOT NULL,
    `milestoneProgress` DOUBLE NOT NULL,
    `capabilityCoverage` DOUBLE NOT NULL,
    `participationScore` DOUBLE NOT NULL,
    `founderAlignment` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `algorithmVersion` VARCHAR(191) NOT NULL DEFAULT '1.0',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversation` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('DIRECT', 'VENTURE') NOT NULL DEFAULT 'DIRECT',
    `ventureId` VARCHAR(191) NULL,
    `contextType` VARCHAR(191) NULL,
    `contextId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversation_participant` (
    `id` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `muted` BOOLEAN NOT NULL DEFAULT false,
    `lastReadAt` DATETIME(3) NULL,

    UNIQUE INDEX `conversation_participant_conversationId_userId_key`(`conversationId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `id` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NOT NULL,
    `senderUserId` VARCHAR(191) NULL,
    `type` ENUM('TEXT', 'SYSTEM', 'ATTACHMENT') NOT NULL DEFAULT 'TEXT',
    `body` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `editedAt` DATETIME(3) NULL,

    INDEX `message_conversationId_createdAt_idx`(`conversationId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message_attachment` (
    `id` VARCHAR(191) NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `cloudinaryPublicId` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,
    `resourceType` VARCHAR(191) NOT NULL,
    `bytes` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `entityType` VARCHAR(191) NULL,
    `entityId` VARCHAR(191) NULL,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notification_userId_readAt_createdAt_idx`(`userId`, `readAt`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `support_ticket` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `relatedEntityType` VARCHAR(191) NULL,
    `relatedEntityId` VARCHAR(191) NULL,
    `priority` VARCHAR(191) NOT NULL DEFAULT 'MEDIUM',
    `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `referenceCode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `support_ticket_referenceCode_key`(`referenceCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report` (
    `id` VARCHAR(191) NOT NULL,
    `reporterUserId` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `details` TEXT NULL,
    `priority` VARCHAR(191) NOT NULL DEFAULT 'MEDIUM',
    `status` ENUM('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `report_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `moderation_action` (
    `id` VARCHAR(191) NOT NULL,
    `reportId` VARCHAR(191) NULL,
    `adminUserId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `reason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_note` (
    `id` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `adminUserId` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `admin_note_entityType_entityId_idx`(`entityType`, `entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_log` (
    `id` VARCHAR(191) NOT NULL,
    `actorUserId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `beforeJson` TEXT NULL,
    `afterJson` TEXT NULL,
    `metadataJson` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_log_entityType_entityId_createdAt_idx`(`entityType`, `entityId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_setting` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,

    UNIQUE INDEX `system_setting_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_profile` ADD CONSTRAINT `student_profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academic_profile` ADD CONSTRAINT `academic_profile_studentProfileId_fkey` FOREIGN KEY (`studentProfileId`) REFERENCES `student_profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_profile` ADD CONSTRAINT `admin_profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `capability` ADD CONSTRAINT `capability_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `capability_family`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_capability` ADD CONSTRAINT `student_capability_studentProfileId_fkey` FOREIGN KEY (`studentProfileId`) REFERENCES `student_profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_capability` ADD CONSTRAINT `student_capability_capabilityId_fkey` FOREIGN KEY (`capabilityId`) REFERENCES `capability`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `capability_evidence` ADD CONSTRAINT `capability_evidence_studentCapabilityId_fkey` FOREIGN KEY (`studentCapabilityId`) REFERENCES `student_capability`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_venture_interest` ADD CONSTRAINT `student_venture_interest_studentProfileId_fkey` FOREIGN KEY (`studentProfileId`) REFERENCES `student_profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_venture_interest` ADD CONSTRAINT `student_venture_interest_sectorId_fkey` FOREIGN KEY (`sectorId`) REFERENCES `venture_sector`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `founder_preference` ADD CONSTRAINT `founder_preference_studentProfileId_fkey` FOREIGN KEY (`studentProfileId`) REFERENCES `student_profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_availability` ADD CONSTRAINT `student_availability_studentProfileId_fkey` FOREIGN KEY (`studentProfileId`) REFERENCES `student_profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture` ADD CONSTRAINT `venture_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture` ADD CONSTRAINT `venture_primarySectorId_fkey` FOREIGN KEY (`primarySectorId`) REFERENCES `venture_sector`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture` ADD CONSTRAINT `venture_secondarySectorId_fkey` FOREIGN KEY (`secondarySectorId`) REFERENCES `venture_sector`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_member` ADD CONSTRAINT `venture_member_ventureId_fkey` FOREIGN KEY (`ventureId`) REFERENCES `venture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_member` ADD CONSTRAINT `venture_member_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_capability_requirement` ADD CONSTRAINT `venture_capability_requirement_ventureId_fkey` FOREIGN KEY (`ventureId`) REFERENCES `venture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_capability_requirement` ADD CONSTRAINT `venture_capability_requirement_capabilityId_fkey` FOREIGN KEY (`capabilityId`) REFERENCES `capability`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_dna` ADD CONSTRAINT `venture_dna_ventureId_fkey` FOREIGN KEY (`ventureId`) REFERENCES `venture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_recommendation` ADD CONSTRAINT `match_recommendation_ventureId_fkey` FOREIGN KEY (`ventureId`) REFERENCES `venture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_recommendation` ADD CONSTRAINT `match_recommendation_candidateUserId_fkey` FOREIGN KEY (`candidateUserId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_recommendation` ADD CONSTRAINT `match_recommendation_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `matching_configuration`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_factor_score` ADD CONSTRAINT `match_factor_score_recommendationId_fkey` FOREIGN KEY (`recommendationId`) REFERENCES `match_recommendation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_invitation` ADD CONSTRAINT `venture_invitation_ventureId_fkey` FOREIGN KEY (`ventureId`) REFERENCES `venture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_invitation` ADD CONSTRAINT `venture_invitation_senderUserId_fkey` FOREIGN KEY (`senderUserId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_invitation` ADD CONSTRAINT `venture_invitation_recipientUserId_fkey` FOREIGN KEY (`recipientUserId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_invitation` ADD CONSTRAINT `venture_invitation_recommendationId_fkey` FOREIGN KEY (`recommendationId`) REFERENCES `match_recommendation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_room` ADD CONSTRAINT `venture_room_ventureId_fkey` FOREIGN KEY (`ventureId`) REFERENCES `venture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_room_participant` ADD CONSTRAINT `venture_room_participant_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `venture_room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_room_participant` ADD CONSTRAINT `venture_room_participant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `founder_trial` ADD CONSTRAINT `founder_trial_ventureId_fkey` FOREIGN KEY (`ventureId`) REFERENCES `venture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `founder_trial` ADD CONSTRAINT `founder_trial_ventureRoomId_fkey` FOREIGN KEY (`ventureRoomId`) REFERENCES `venture_room`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `founder_trial_participant` ADD CONSTRAINT `founder_trial_participant_trialId_fkey` FOREIGN KEY (`trialId`) REFERENCES `founder_trial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `founder_trial_participant` ADD CONSTRAINT `founder_trial_participant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `founder_trial_task` ADD CONSTRAINT `founder_trial_task_trialId_fkey` FOREIGN KEY (`trialId`) REFERENCES `founder_trial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `founder_trial_task` ADD CONSTRAINT `founder_trial_task_assigneeUserId_fkey` FOREIGN KEY (`assigneeUserId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `founder_trial_evidence` ADD CONSTRAINT `founder_trial_evidence_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `founder_trial_task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `founder_trial_evidence` ADD CONSTRAINT `founder_trial_evidence_submittedBy_fkey` FOREIGN KEY (`submittedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `founder_trial_review` ADD CONSTRAINT `founder_trial_review_trialId_fkey` FOREIGN KEY (`trialId`) REFERENCES `founder_trial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `founder_trial_review` ADD CONSTRAINT `founder_trial_review_reviewerUserId_fkey` FOREIGN KEY (`reviewerUserId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_charter` ADD CONSTRAINT `team_charter_ventureId_fkey` FOREIGN KEY (`ventureId`) REFERENCES `venture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_charter_member` ADD CONSTRAINT `team_charter_member_charterId_fkey` FOREIGN KEY (`charterId`) REFERENCES `team_charter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_charter_member` ADD CONSTRAINT `team_charter_member_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_objective` ADD CONSTRAINT `team_objective_charterId_fkey` FOREIGN KEY (`charterId`) REFERENCES `team_charter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_milestone` ADD CONSTRAINT `venture_milestone_ventureId_fkey` FOREIGN KEY (`ventureId`) REFERENCES `venture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_contribution` ADD CONSTRAINT `venture_contribution_ventureId_fkey` FOREIGN KEY (`ventureId`) REFERENCES `venture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_contribution` ADD CONSTRAINT `venture_contribution_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_contribution` ADD CONSTRAINT `venture_contribution_milestoneId_fkey` FOREIGN KEY (`milestoneId`) REFERENCES `venture_milestone`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `venture_health_snapshot` ADD CONSTRAINT `venture_health_snapshot_ventureId_fkey` FOREIGN KEY (`ventureId`) REFERENCES `venture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation` ADD CONSTRAINT `conversation_ventureId_fkey` FOREIGN KEY (`ventureId`) REFERENCES `venture`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation_participant` ADD CONSTRAINT `conversation_participant_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation_participant` ADD CONSTRAINT `conversation_participant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_senderUserId_fkey` FOREIGN KEY (`senderUserId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message_attachment` ADD CONSTRAINT `message_attachment_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `message`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_ticket` ADD CONSTRAINT `support_ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `report_reporterUserId_fkey` FOREIGN KEY (`reporterUserId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moderation_action` ADD CONSTRAINT `moderation_action_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `report`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moderation_action` ADD CONSTRAINT `moderation_action_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_note` ADD CONSTRAINT `admin_note_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_actorUserId_fkey` FOREIGN KEY (`actorUserId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
