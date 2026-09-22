import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { apiError, AuthError, ValidationError } from "@/lib/errors";
import type { ZodSchema } from "zod";

export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) throw new AuthError();
  return user;
}

export async function requireAdminUser() {
  const user = await requireSessionUser();
  if (!["admin", "moderator", "verifier"].includes(user.role ?? "")) {
    throw new AuthError("Admin access required");
  }
  return user;
}

export async function parseBody<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ValidationError("Invalid JSON body");
  }
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.issues.map((e: { message: string }) => e.message).join(", "));
  }
  return result.data;
}

export async function parseQuery<T>(url: string, schema: ZodSchema<T>): Promise<T> {
  const params = Object.fromEntries(new URL(url).searchParams);
  // Coerce numeric strings
  const coerced: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    const num = Number(v);
    coerced[k] = isNaN(num) || v === "" ? v : num;
  }
  const result = schema.safeParse(coerced);
  if (!result.success) {
    throw new ValidationError(result.error.issues.map((e: { message: string }) => e.message).join(", "));
  }
  return result.data;
}

export function jsonResponse<T>(data: T, status = 200) {
  return Response.json(data, { status });
}

export { apiError };
