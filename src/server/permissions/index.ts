import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireUser() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return session.user;
}

export async function requireRole(roles: string[]) {
  const user = await requireUser();
  if (!roles.includes(user.role ?? "student")) {
    redirect("/dashboard");
  }
  return user;
}

export async function requireAdmin() {
  return requireRole(["admin", "moderator", "verifier"]);
}

export function canEditVenture(userId: string, ownerId: string, memberUserIds: string[]): boolean {
  return userId === ownerId || memberUserIds.includes(userId);
}

export function canManageTrial(userId: string, ventureOwnerId: string): boolean {
  return userId === ventureOwnerId;
}

export function canModerate(role: string): boolean {
  return ["admin", "moderator"].includes(role);
}

export function canPublishMatchingConfig(role: string): boolean {
  return role === "admin";
}
