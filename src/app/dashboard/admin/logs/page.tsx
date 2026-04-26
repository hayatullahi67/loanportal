"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { useAdminConsole } from "@/lib/admin-store";
import { Activity, AlertTriangle, Shield, ShieldAlert, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const navItems = [
  { label: "System Overview", href: "/dashboard/admin", icon: <Shield className="w-4 h-4" /> },
  { label: "User Management", href: "/dashboard/admin/users", icon: <Users className="w-4 h-4" /> },
  { label: "Audit Logs", href: "/dashboard/admin/logs", icon: <Activity className="w-4 h-4" /> },
];

const severityClasses = {
  INFO: "bg-sky-500/10 text-sky-200 border-sky-500/20",
  WARNING: "bg-amber-500/10 text-amber-200 border-amber-500/20",
  CRITICAL: "bg-red-500/10 text-red-300 border-red-500/20",
};

const outcomeClasses = {
  SUCCESS: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  REVIEW: "bg-amber-500/10 text-amber-200 border-amber-500/20",
  BLOCKED: "bg-red-500/10 text-red-300 border-red-500/20",
};

export default function AdminLogsPage() {
  const { auditLogs } = useAdminConsole();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [outcomeFilter, setOutcomeFilter] = useState("ALL");

  const filteredLogs = auditLogs.filter((log) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      [log.id, log.actor, log.actorRole, log.action, log.target]
        .join(" ")
        .toLowerCase()
        .includes(query);
    const matchesSeverity = severityFilter === "ALL" || log.severity === severityFilter;
    const matchesOutcome = outcomeFilter === "ALL" || log.outcome === outcomeFilter;

    return matchesSearch && matchesSeverity && matchesOutcome;
  });

  const criticalCount = auditLogs.filter((log) => log.severity === "CRITICAL").length;
  const blockedCount = auditLogs.filter((log) => log.outcome === "BLOCKED").length;
  const reviewCount = auditLogs.filter((log) => log.outcome === "REVIEW").length;

  return (
    <DashboardLayout role="admin" navItems={navItems}>
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">Audit Trail</h2>
          <p className="mt-1 text-sm text-white/60">
            Review sign-ins, provisioning events, loan workflow actions, and blocked access attempts in one stream.
          </p>
        </div>
        <Badge className="w-fit border-primary/20 bg-primary/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
          Live oversight
        </Badge>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Total events" value={auditLogs.length.toString()} helper="Across admin and operations" icon={<Activity className="h-5 w-5 text-primary" />} />
        <MetricCard label="Critical alerts" value={criticalCount.toString()} helper="Security-sensitive activity" icon={<ShieldAlert className="h-5 w-5 text-red-300" />} />
        <MetricCard label="Blocked" value={blockedCount.toString()} helper="Rejected or suspended activity" icon={<AlertTriangle className="h-5 w-5 text-amber-200" />} />
        <MetricCard label="Under review" value={reviewCount.toString()} helper="Requires follow-up" icon={<Shield className="h-5 w-5 text-sky-200" />} />
      </div>

      <Card className="border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <CardHeader className="gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <CardTitle className="text-xl font-black text-white">Security and Operations Log</CardTitle>
            <p className="mt-1 text-sm text-white/60">Use the filters to focus on escalations, reviews, or a specific actor.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:min-w-[760px]">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search actor, target, action, or ID"
              className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/25"
            />

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#001a0e] text-white">
                <SelectItem value="ALL">All severities</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="WARNING">Warning</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
              <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Outcome" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#001a0e] text-white">
                <SelectItem value="ALL">All outcomes</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-3xl border border-white/10 bg-[#000d07]/70">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/45">Time</TableHead>
                  <TableHead className="text-white/45">Actor</TableHead>
                  <TableHead className="text-white/45">Action</TableHead>
                  <TableHead className="text-white/45">Target</TableHead>
                  <TableHead className="text-white/45">Severity</TableHead>
                  <TableHead className="text-white/45">Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-white/10 hover:bg-white/[0.03]">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-white">{log.timestamp}</p>
                        <p className="text-[11px] font-mono text-white/40">{log.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-white">{log.actor}</p>
                        <p className="text-xs text-white/45">{log.actorRole}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[280px] text-sm text-white/70">{log.action}</TableCell>
                    <TableCell className="max-w-[260px] text-sm text-white/55">{log.target}</TableCell>
                    <TableCell>
                      <Badge className={`border ${severityClasses[log.severity]}`}>{log.severity}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`border ${outcomeClasses[log.outcome]}`}>{log.outcome}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 ? (
                  <TableRow className="border-white/10">
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-white/45">
                      No audit events match the selected filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

function MetricCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">{label}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-black text-white">{value}</p>
        <p className="mt-1 text-xs text-white/45">{helper}</p>
      </CardContent>
    </Card>
  );
}
