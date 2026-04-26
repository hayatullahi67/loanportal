export type AdminRole =
  | "microfinance"
  | "dfo-officer"
  | "dfo-signatory"
  | "head-office";

export type PortalRole = AdminRole | "admin";

export interface AdminUserRecord {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  branch: string;
  password: string;
  status: "ACTIVE" | "PENDING_RESET" | "SUSPENDED";
  createdBy: string;
  createdAt: string;
  lastLogin: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  outcome: "SUCCESS" | "REVIEW" | "BLOCKED";
}

export interface PortalAccount {
  fullName: string;
  email: string;
  password: string;
  role: PortalRole;
}

export const ADMIN_ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: "microfinance", label: "Microfinance" },
  { value: "dfo-officer", label: "DFO Officer" },
  { value: "dfo-signatory", label: "DFO Signatory" },
  { value: "head-office", label: "Head Office" },
];

export const PORTAL_ROLE_LABELS: Record<PortalRole, string> = {
  admin: "Global Admin",
  microfinance: "Microfinance Bank",
  "dfo-officer": "DFO Officer",
  "dfo-signatory": "DFO Signatory",
  "head-office": "Head Office",
};

export const PORTAL_ROLE_ROUTES: Record<PortalRole, string> = {
  admin: "/dashboard/admin",
  microfinance: "/dashboard/microfinance/loans",
  "dfo-officer": "/dashboard/dfo-officer/verify",
  "dfo-signatory": "/dashboard/dfo-signatory/approve",
  "head-office": "/dashboard/head-office/stamp",
};

export const GLOBAL_ADMIN_ACCOUNT: PortalAccount = {
  fullName: "Global Admin",
  email: "admin@gmail.com",
  password: "Admin@2026#Root",
  role: "admin",
};

export const HARDCODED_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: "USR-001",
    fullName: "Amina Yusuf",
    email: "amina.yusuf@gmail.com",
    role: "microfinance",
    branch: "First Microfinance Bank, Lagos",
    password: "MFB@2026#Amina",
    status: "ACTIVE",
    createdBy: "Global Admin",
    createdAt: "2026-04-10 08:15",
    lastLogin: "2026-04-25 09:12",
  },
  {
    id: "USR-002",
    fullName: "David Ekanem",
    email: "david.ekanem@gmail.com",
    role: "dfo-officer",
    branch: "DFO South South Desk",
    password: "DFO@2026#David",
    status: "ACTIVE",
    createdBy: "Global Admin",
    createdAt: "2026-04-11 10:05",
    lastLogin: "2026-04-25 08:44",
  },
  {
    id: "USR-003",
    fullName: "Ngozi Nwankwo",
    email: "ngozi.nwankwo@gmail.com",
    role: "dfo-signatory",
    branch: "DFO Executive Approval Unit",
    password: "SIGN@2026#Ngozi",
    status: "PENDING_RESET",
    createdBy: "Global Admin",
    createdAt: "2026-04-12 14:20",
    lastLogin: "2026-04-23 16:30",
  },
  {
    id: "USR-004",
    fullName: "Sule Ibrahim",
    email: "sule.ibrahim@gmail.com",
    role: "head-office",
    branch: "Head Office Operations",
    password: "HO@2026#Sule",
    status: "ACTIVE",
    createdBy: "Global Admin",
    createdAt: "2026-04-13 09:40",
    lastLogin: "2026-04-25 07:58",
  },
];

export const HARDCODED_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: "AUD-101",
    timestamp: "2026-04-25 09:05",
    actor: "Global Admin",
    actorRole: "Admin",
    action: "Created new Microfinance user credential",
    target: "USR-001 / Amina Yusuf",
    severity: "INFO",
    outcome: "SUCCESS",
  },
  {
    id: "AUD-102",
    timestamp: "2026-04-25 08:52",
    actor: "Head Office Admin",
    actorRole: "Head Office",
    action: "Marked loan as disbursed",
    target: "LN-702",
    severity: "WARNING",
    outcome: "SUCCESS",
  },
  {
    id: "AUD-103",
    timestamp: "2026-04-25 08:10",
    actor: "DFO Officer",
    actorRole: "DFO Officer",
    action: "Generated guarantee certificate",
    target: "LN-703",
    severity: "INFO",
    outcome: "SUCCESS",
  },
  {
    id: "AUD-104",
    timestamp: "2026-04-24 18:42",
    actor: "System Monitor",
    actorRole: "Security Layer",
    action: "Blocked invalid admin sign-in attempt",
    target: "Admin Console / IP Review Queue",
    severity: "CRITICAL",
    outcome: "BLOCKED",
  },
  {
    id: "AUD-105",
    timestamp: "2026-04-24 17:25",
    actor: "Global Admin",
    actorRole: "Admin",
    action: "Forced password reset",
    target: "USR-003 / Ngozi Nwankwo",
    severity: "WARNING",
    outcome: "REVIEW",
  },
  {
    id: "AUD-106",
    timestamp: "2026-04-24 15:11",
    actor: "Head Office Admin",
    actorRole: "Head Office",
    action: "Stamped guarantee application",
    target: "LN-001",
    severity: "INFO",
    outcome: "SUCCESS",
  },
];
