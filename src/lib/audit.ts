import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export interface AuditLogInput {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export async function createAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        metadata: input.metadata ? (input.metadata as Prisma.InputJsonValue) : Prisma.DbNull,
        ipAddress: input.ipAddress ?? null,
      },
    });
  } catch (error) {
    // Log error but don't throw - audit logging should never break the main flow
    console.error("Failed to create audit log:", error);
  }
}

// Common audit actions
export const AUDIT_ACTIONS = {
  // Auth
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILED: "LOGIN_FAILED",
  LOGOUT: "LOGOUT",
  REGISTER: "REGISTER",
  PASSWORD_RESET_REQUEST: "PASSWORD_RESET_REQUEST",
  PASSWORD_RESET_COMPLETE: "PASSWORD_RESET_COMPLETE",
  PASSWORD_CHANGE: "PASSWORD_CHANGE",
  TWO_FACTOR_ENABLED: "TWO_FACTOR_ENABLED",
  TWO_FACTOR_DISABLED: "TWO_FACTOR_DISABLED",
  EMAIL_VERIFIED: "EMAIL_VERIFIED",

  // Investor
  PROFILE_UPDATED: "PROFILE_UPDATED",
  KYC_SUBMITTED: "KYC_SUBMITTED",
  KYC_APPROVED: "KYC_APPROVED",
  KYC_REJECTED: "KYC_REJECTED",
  NDA_SIGNED: "NDA_SIGNED",

  // Deals
  DEAL_VIEWED: "DEAL_VIEWED",
  INVESTMENT_COMMITTED: "INVESTMENT_COMMITTED",
  INVESTMENT_CANCELLED: "INVESTMENT_CANCELLED",

  // Documents
  DOCUMENT_UPLOADED: "DOCUMENT_UPLOADED",
  DOCUMENT_DOWNLOADED: "DOCUMENT_DOWNLOADED",

  // Admin
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_DEACTIVATED: "USER_DEACTIVATED",
  DEAL_CREATED: "DEAL_CREATED",
  DEAL_UPDATED: "DEAL_UPDATED",
} as const;
