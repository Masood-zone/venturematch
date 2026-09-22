-- AlterTable
ALTER TABLE `account` MODIFY `accessToken` VARCHAR(191) NULL,
    MODIFY `refreshToken` VARCHAR(191) NULL,
    MODIFY `idToken` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `admin_note` MODIFY `text` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `audit_log` MODIFY `beforeJson` VARCHAR(191) NULL,
    MODIFY `afterJson` VARCHAR(191) NULL,
    MODIFY `metadataJson` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `capability` MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `capability_evidence` MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `founder_trial` MODIFY `objective` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `founder_trial_evidence` MODIFY `textValue` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `founder_trial_review` MODIFY `workedWellText` VARCHAR(191) NULL,
    MODIFY `concernsText` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `founder_trial_task` MODIFY `purpose` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `match_factor_score` MODIFY `explanationDataJson` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `message` MODIFY `body` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `moderation_action` MODIFY `reason` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `notification` MODIFY `body` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `report` MODIFY `details` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `student_availability` MODIFY `notes` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `student_profile` MODIFY `bio` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `support_ticket` MODIFY `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `system_setting` MODIFY `value` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `team_charter` MODIFY `expectationsText` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `team_charter_member` MODIFY `responsibilities` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `venture` MODIFY `shortPitch` VARCHAR(191) NULL,
    MODIFY `problem` VARCHAR(191) NULL,
    MODIFY `solution` VARCHAR(191) NULL,
    MODIFY `targetUsers` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `venture_contribution` MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `venture_dna` MODIFY `structuredSummaryJson` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `venture_invitation` MODIFY `message` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `venture_milestone` MODIFY `objective` VARCHAR(191) NULL,
    MODIFY `expectedOutcome` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `venture_sector` MODIFY `description` VARCHAR(191) NULL;
