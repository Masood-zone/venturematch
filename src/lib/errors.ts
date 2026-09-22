export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

export function err<T>(error: string, code?: string): ServiceResult<T> {
  return { success: false, error, code };
}

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = "INTERNAL_ERROR",
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, "NOT_FOUND", 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN", 403);
  }
}

export function apiError(error: unknown) {
  if (error instanceof AppError) {
    return Response.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }
  console.error("[API Error]", error);
  return Response.json(
    { error: "An unexpected error occurred" },
    { status: 500 }
  );
}
