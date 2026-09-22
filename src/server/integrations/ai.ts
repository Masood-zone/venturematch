import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { env } from "@/lib/env";

const openai = createOpenAI({
  apiKey: env.aiApiKey,
  baseURL: "https://openrouter.ai/api/v1",
});

export function getModel() {
  return openai(env.aiModel);
}

// AI-01: Capability Extraction
export const capabilityExtractionSchema = z.object({
  capabilities: z.array(
    z.object({
      name: z.string(),
      proficiency: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
      evidence: z.string().optional(),
      familyHint: z.string().optional(),
    })
  ),
  summary: z.string(),
});

export type CapabilityExtractionResult = z.infer<typeof capabilityExtractionSchema>;

export async function extractCapabilities(
  userText: string
): Promise<CapabilityExtractionResult> {
  const result = await generateObject({
    model: getModel(),
    schema: capabilityExtractionSchema,
    system: `You are an academic capability analyst for VentureMatch, a student venture platform.
Extract transferable capabilities from the student's description.
Focus on skills and capabilities, NOT academic programmes or departments.
Be conservative — only extract what is clearly evidenced.`,
    prompt: `Student description: ${userText}`,
  });
  return result.object;
}

// AI-02: Venture DNA Analysis
export const ventureDnaSchema = z.object({
  capabilityNeeds: z.array(
    z.object({
      name: z.string(),
      importance: z.number().min(1).max(10),
      reason: z.string(),
    })
  ),
  summary: z.string(),
  sectors: z.array(z.string()),
});

export type VentureDnaResult = z.infer<typeof ventureDnaSchema>;

export async function analyzeVentureDna(
  problem: string,
  solution: string,
  targetUsers: string
): Promise<VentureDnaResult> {
  const result = await generateObject({
    model: getModel(),
    schema: ventureDnaSchema,
    system: `You are a venture capability analyst for VentureMatch.
Identify the capability needs of this venture based on the problem and solution described.
Focus on what capabilities would complement the founding team.`,
    prompt: `Problem: ${problem}\nSolution: ${solution}\nTarget Users: ${targetUsers}`,
  });
  return result.object;
}

// AI-03: Match Explanation
export async function explainMatch(
  studentName: string,
  ventureName: string,
  score: number,
  factors: Record<string, number>,
  contributions: string[]
): Promise<string> {
  const { generateText } = await import("ai");
  const result = await generateText({
    model: getModel(),
    system: `You are a match explanation writer for VentureMatch.
Write a brief, encouraging explanation (2-3 sentences) for why a student matches a venture.
Be specific about capabilities. Do not be vague. Do not use the word "perfect".`,
    prompt: `Student: ${studentName}
Venture: ${ventureName}
Match Score: ${score}%
Capability contributions: ${contributions.join(", ")}
Factor scores: ${JSON.stringify(factors)}`,
    maxOutputTokens: 150,
  });
  return result.text;
}
