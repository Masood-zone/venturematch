/**
 * Server-side environment validation.
 * Call `validateEnv()` at startup to fail fast on missing required vars.
 */

const required = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
] as const;

export function validateEnv() {
  const missing: string[] = [];
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL!,
  authSecret: process.env.BETTER_AUTH_SECRET!,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  pusherAppId: process.env.PUSHER_APP_ID ?? "",
  pusherKey: process.env.PUSHER_KEY ?? "",
  pusherSecret: process.env.PUSHER_SECRET ?? "",
  pusherCluster: process.env.PUSHER_CLUSTER ?? "us2",
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: parseInt(process.env.SMTP_PORT ?? "587"),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPassword: process.env.SMTP_PASSWORD ?? "",
  smtpFrom: process.env.SMTP_FROM ?? "noreply@venturematch.app",
  aiModel: process.env.AI_MODEL ?? "gpt-4o-mini",
  aiApiKey: process.env.AI_GATEWAY_API_KEY ?? "",
  features: {
    aiTalentExtraction: process.env.FEATURE_AI_TALENT_EXTRACTION === "true",
    aiVentureAnalysis: process.env.FEATURE_AI_VENTURE_ANALYSIS === "true",
    founderTrials: process.env.FEATURE_FOUNDER_TRIALS === "true",
    ventureHealth: process.env.FEATURE_VENTURE_HEALTH === "true",
    messaging: process.env.FEATURE_MESSAGING === "true",
  },
} as const;
