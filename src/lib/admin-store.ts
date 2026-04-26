"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminRole,
  AdminUserRecord,
  AuditLogRecord,
  GLOBAL_ADMIN_ACCOUNT,
  HARDCODED_ADMIN_USERS,
  HARDCODED_AUDIT_LOGS,
  PORTAL_ROLE_LABELS,
  PORTAL_ROLE_ROUTES,
  PortalRole,
} from "./admin-data";

type CreateUserInput = {
  fullName: string;
  email: string;
  role: AdminRole;
  branch: string;
  password: string;
};

type AuthResult =
  | {
      ok: true;
      user: {
        fullName: string;
        email: string;
        role: PortalRole;
        route: string;
      };
    }
  | {
      ok: false;
      error: string;
    };

let usersStore: AdminUserRecord[] = [...HARDCODED_ADMIN_USERS];
let auditLogsStore: AuditLogRecord[] = [...HARDCODED_AUDIT_LOGS];
let userListeners: Array<(users: AdminUserRecord[]) => void> = [];
let auditListeners: Array<(logs: AuditLogRecord[]) => void> = [];

const nextUserNumber = () =>
  usersStore.reduce((max, user) => {
    const value = Number.parseInt(user.id.replace("USR-", ""), 10);
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0) + 1;

const nextAuditNumber = () =>
  auditLogsStore.reduce((max, log) => {
    const value = Number.parseInt(log.id.replace("AUD-", ""), 10);
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0) + 1;

let userSequence = nextUserNumber();
let auditSequence = nextAuditNumber();

const emitUsers = () => {
  userListeners.forEach((listener) => listener(usersStore));
};

const emitAuditLogs = () => {
  auditListeners.forEach((listener) => listener(auditLogsStore));
};

const pad = (value: number) => value.toString().padStart(2, "0");

const formatTimestamp = (date = new Date()) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const buildAuditEntry = (
  entry: Omit<AuditLogRecord, "id" | "timestamp">
): AuditLogRecord => ({
  id: `AUD-${String(auditSequence++).padStart(3, "0")}`,
  timestamp: formatTimestamp(),
  ...entry,
});

export const addAuditLogEntry = (entry: Omit<AuditLogRecord, "id" | "timestamp">) => {
  auditLogsStore = [buildAuditEntry(entry), ...auditLogsStore];
  emitAuditLogs();
};

const syncUser = (updatedUser: AdminUserRecord) => {
  usersStore = usersStore.map((user) => (user.id === updatedUser.id ? updatedUser : user));
  emitUsers();
};

export const getDashboardRouteForRole = (role: PortalRole) => PORTAL_ROLE_ROUTES[role];

export const getPortalRoleLabel = (role: PortalRole) => PORTAL_ROLE_LABELS[role];

export const authenticatePortalUser = (email: string, password: string): AuthResult => {
  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail === GLOBAL_ADMIN_ACCOUNT.email.toLowerCase() &&
    password === GLOBAL_ADMIN_ACCOUNT.password
  ) {
    addAuditLogEntry({
      actor: GLOBAL_ADMIN_ACCOUNT.fullName,
      actorRole: getPortalRoleLabel("admin"),
      action: "Signed into admin console",
      target: "Global Administration Workspace",
      severity: "INFO",
      outcome: "SUCCESS",
    });

    return {
      ok: true,
      user: {
        fullName: GLOBAL_ADMIN_ACCOUNT.fullName,
        email: GLOBAL_ADMIN_ACCOUNT.email,
        role: GLOBAL_ADMIN_ACCOUNT.role,
        route: getDashboardRouteForRole(GLOBAL_ADMIN_ACCOUNT.role),
      },
    };
  }

  const matchedUser = usersStore.find((user) => user.email.toLowerCase() === normalizedEmail);

  if (!matchedUser || matchedUser.password !== password) {
    addAuditLogEntry({
      actor: "Access Gateway",
      actorRole: "Security Layer",
      action: "Rejected sign-in attempt",
      target: normalizedEmail || "Unknown account",
      severity: "CRITICAL",
      outcome: "BLOCKED",
    });

    return { ok: false, error: "Invalid email or password." };
  }

  if (matchedUser.status === "SUSPENDED") {
    addAuditLogEntry({
      actor: matchedUser.fullName,
      actorRole: getPortalRoleLabel(matchedUser.role),
      action: "Attempted sign-in while suspended",
      target: matchedUser.id,
      severity: "WARNING",
      outcome: "BLOCKED",
    });

    return { ok: false, error: "This account is suspended. Reactivate it from admin first." };
  }

  const updatedUser = {
    ...matchedUser,
    lastLogin: formatTimestamp(),
  };

  syncUser(updatedUser);

  addAuditLogEntry({
    actor: matchedUser.fullName,
    actorRole: getPortalRoleLabel(matchedUser.role),
    action: "Signed into portal workspace",
    target: getDashboardRouteForRole(matchedUser.role),
    severity: matchedUser.status === "PENDING_RESET" ? "WARNING" : "INFO",
    outcome: "SUCCESS",
  });

  return {
    ok: true,
    user: {
      fullName: matchedUser.fullName,
      email: matchedUser.email,
      role: matchedUser.role,
      route: getDashboardRouteForRole(matchedUser.role),
    },
  };
};

export const useAdminConsole = () => {
  const [users, setUsers] = useState<AdminUserRecord[]>(usersStore);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(auditLogsStore);

  useEffect(() => {
    const userListener = (nextUsers: AdminUserRecord[]) => setUsers([...nextUsers]);
    const auditListener = (nextLogs: AuditLogRecord[]) => setAuditLogs([...nextLogs]);

    userListeners.push(userListener);
    auditListeners.push(auditListener);

    return () => {
      userListeners = userListeners.filter((listener) => listener !== userListener);
      auditListeners = auditListeners.filter((listener) => listener !== auditListener);
    };
  }, []);

  const createUser = useCallback(
    ({ fullName, email, role, branch, password }: CreateUserInput, createdBy = GLOBAL_ADMIN_ACCOUNT.fullName) => {
      const normalizedEmail = email.trim().toLowerCase();
      const alreadyExists =
        normalizedEmail === GLOBAL_ADMIN_ACCOUNT.email.toLowerCase() ||
        usersStore.some((user) => user.email.toLowerCase() === normalizedEmail);

      if (alreadyExists) {
        return { ok: false as const, error: "A user with this email already exists." };
      }

      const newUser: AdminUserRecord = {
        id: `USR-${String(userSequence++).padStart(3, "0")}`,
        fullName: fullName.trim(),
        email: normalizedEmail,
        role,
        branch: branch.trim(),
        password,
        status: "ACTIVE",
        createdBy,
        createdAt: formatTimestamp(),
        lastLogin: "Never",
      };

      usersStore = [newUser, ...usersStore];
      emitUsers();

      addAuditLogEntry({
        actor: createdBy,
        actorRole: getPortalRoleLabel("admin"),
        action: `Created ${getPortalRoleLabel(role)} user`,
        target: `${newUser.id} / ${newUser.fullName}`,
        severity: "INFO",
        outcome: "SUCCESS",
      });

      return { ok: true as const, user: newUser };
    },
    []
  );

  const updateUserStatus = useCallback(
    (userId: string, status: AdminUserRecord["status"], actor = GLOBAL_ADMIN_ACCOUNT.fullName) => {
      const currentUser = usersStore.find((user) => user.id === userId);

      if (!currentUser) {
        return { ok: false as const, error: "User not found." };
      }

      const updatedUser = { ...currentUser, status };
      syncUser(updatedUser);

      addAuditLogEntry({
        actor,
        actorRole: getPortalRoleLabel("admin"),
        action:
          status === "SUSPENDED"
            ? "Suspended user access"
            : status === "ACTIVE"
              ? "Reactivated user access"
              : "Flagged user for password reset",
        target: `${updatedUser.id} / ${updatedUser.fullName}`,
        severity: status === "SUSPENDED" ? "WARNING" : "INFO",
        outcome: status === "PENDING_RESET" ? "REVIEW" : "SUCCESS",
      });

      return { ok: true as const, user: updatedUser };
    },
    []
  );

  const resetUserPassword = useCallback(
    (userId: string, password: string, actor = GLOBAL_ADMIN_ACCOUNT.fullName) => {
      const currentUser = usersStore.find((user) => user.id === userId);

      if (!currentUser) {
        return { ok: false as const, error: "User not found." };
      }

      const updatedUser = {
        ...currentUser,
        password,
        status: "PENDING_RESET" as const,
      };

      syncUser(updatedUser);

      addAuditLogEntry({
        actor,
        actorRole: getPortalRoleLabel("admin"),
        action: "Reset user password",
        target: `${updatedUser.id} / ${updatedUser.fullName}`,
        severity: "WARNING",
        outcome: "REVIEW",
      });

      return { ok: true as const, user: updatedUser };
    },
    []
  );

  return {
    users,
    auditLogs,
    createUser,
    updateUserStatus,
    resetUserPassword,
  };
};
