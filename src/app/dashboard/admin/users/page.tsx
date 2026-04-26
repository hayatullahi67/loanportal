"use client";

import React, { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { useAdminConsole, getDashboardRouteForRole, getPortalRoleLabel } from "@/lib/admin-store";
import { ADMIN_ROLE_OPTIONS } from "@/lib/admin-data";
import { useToast } from "@/hooks/use-toast";
import { Activity, Search, Shield, UserPlus, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const statusClasses = {
  ACTIVE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  PENDING_RESET: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  SUSPENDED: "border-red-500/20 bg-red-500/10 text-red-300",
};

export default function AdminUsersPage() {
  const { users, createUser, updateUserStatus } = useAdminConsole();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: ADMIN_ROLE_OPTIONS[0].value,
    branch: "",
    password: "",
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        [user.fullName, user.email, user.branch, user.id, getPortalRoleLabel(user.role)]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, searchTerm, statusFilter, users]);

  const activeCount = users.filter((user) => user.status === "ACTIVE").length;
  const suspendedCount = users.filter((user) => user.status === "SUSPENDED").length;
  const resetCount = users.filter((user) => user.status === "PENDING_RESET").length;

  const handleCreateUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = createUser(formData);

    if (!result.ok) {
      toast({
        title: "User not created",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "User created",
      description: `${result.user.fullName} can now sign in through ${getPortalRoleLabel(result.user.role)}.`,
    });

    setFormData({
      fullName: "",
      email: "",
      role: ADMIN_ROLE_OPTIONS[0].value,
      branch: "",
      password: "",
    });
  };

  const handleToggleStatus = (userId: string, nextStatus: "ACTIVE" | "SUSPENDED") => {
    const result = updateUserStatus(userId, nextStatus);

    if (!result.ok) {
      toast({
        title: "Status update failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: nextStatus === "SUSPENDED" ? "Access suspended" : "Access restored",
      description: `${result.user.fullName} is now ${nextStatus.toLowerCase()}.`,
    });
  };

  return (
    <DashboardLayout role="admin" navItems={navItems}>
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white">User Management</h2>
          <p className="mt-1 text-sm text-white/60">
            Create operational accounts, assign dashboards, and manage access in a cleaner user roster.
          </p>
        </div>
        <Badge className="w-fit border-primary/20 bg-primary/10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-primary">
          Role-based provisioning
        </Badge>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Total managed users" value={users.length.toString()} helper="Operational accounts" />
        <StatCard label="Active" value={activeCount.toString()} helper="Can sign in now" />
        <StatCard label="Pending reset" value={resetCount.toString()} helper="Needs credential review" />
        <StatCard label="Suspended" value={suspendedCount.toString()} helper="Access blocked" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.02fr,1.75fr]">
        <Card className="border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black text-white">
              <UserPlus className="h-5 w-5 text-primary" />
              Create New User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-[0.25em] text-white/55">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(event) => setFormData((current) => ({ ...current, fullName: event.target.value }))}
                  placeholder="e.g. Blessing Okon"
                  className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/25"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.25em] text-white/55">
                  Work Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  placeholder="username@gmail.com"
                  className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/25"
                  required
                />
                <p className="text-[11px] text-white/40">Enter the email exactly as the user will use it to sign in.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-[0.25em] text-white/55">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData((current) => ({ ...current, role: value as typeof current.role }))
                    }
                  >
                    <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/5 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#001a0e] text-white">
                      {ADMIN_ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-[0.25em] text-white/55">
                    Initial Password
                  </Label>
                  <Input
                    id="password"
                    type="text"
                    value={formData.password}
                    onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Secure@2026#Role"
                    className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/25"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch" className="text-xs font-black uppercase tracking-[0.25em] text-white/55">
                  Branch / Desk
                </Label>
                <Input
                  id="branch"
                  value={formData.branch}
                  onChange={(event) => setFormData((current) => ({ ...current, branch: event.target.value }))}
                  placeholder="e.g. DFO North Central Desk"
                  className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/25"
                  required
                />
              </div>

              <div className="rounded-3xl border border-primary/15 bg-primary/5 p-4 text-sm text-white/70">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-primary">Assigned workspace</p>
                <p className="mt-2 font-semibold text-white">{getPortalRoleLabel(formData.role)}</p>
                <p className="mt-1 font-mono text-xs text-primary/90">{getDashboardRouteForRole(formData.role)}</p>
              </div>

              <Button type="submit" className="h-12 w-full rounded-2xl bg-primary font-black text-[#001a0e] hover:bg-primary/90">
                Create User Access
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <CardHeader className="border-b border-white/10 pb-5">
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="text-xl font-black text-white">Provisioned Accounts</CardTitle>
                <p className="mt-1 text-sm text-white/60">
                  Search, filter, and manage users from a simpler roster view.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr,0.8fr,0.8fr]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by name, email, branch, role, or ID"
                    className="h-11 rounded-2xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/25"
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#001a0e] text-white">
                    <SelectItem value="all">All roles</SelectItem>
                    {ADMIN_ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#001a0e] text-white">
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PENDING_RESET">Pending reset</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="mb-5 grid grid-cols-1 gap-3 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 md:grid-cols-3">
              <RosterStat label="Visible Accounts" value={filteredUsers.length.toString()} />
              <RosterStat label="Email Type" value="Gmail demo" />
              <RosterStat label="Table Mode" value="User friendly" />
            </div>

            <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#000d07]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <Table className="min-w-[1080px] table-auto">
                  <TableHeader>
                    <TableRow className="border-white/10 bg-white/[0.02] hover:bg-white/[0.02]">
                      <TableHead className="h-12 min-w-[280px] pl-5 text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                        User
                      </TableHead>
                      <TableHead className="h-12 min-w-[250px] whitespace-nowrap text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                        Role & Workspace
                      </TableHead>
                      <TableHead className="h-12 min-w-[180px] whitespace-nowrap text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                        Unit
                      </TableHead>
                      <TableHead className="h-12 min-w-[220px] whitespace-nowrap text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                        Activity
                      </TableHead>
                      <TableHead className="h-12 min-w-[130px] whitespace-nowrap text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                        Status
                      </TableHead>
                      <TableHead className="h-12 min-w-[140px] pr-5 text-right text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className={`border-white/10 hover:bg-white/[0.035] ${index % 2 === 0 ? "bg-white/[0.015]" : "bg-transparent"}`}
                      >
                        <TableCell className="pl-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-sm font-black text-primary">
                              {user.fullName
                                .split(" ")
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join("")}
                            </div>
                            <div className="space-y-0.5 whitespace-nowrap">
                              <p className="text-sm font-bold leading-tight text-white">{user.fullName}</p>
                              <p className="text-xs leading-tight text-white/55">{user.email}</p>
                              <p className="text-[11px] leading-tight font-mono text-primary/80">{user.id}</p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-3.5">
                          <div className="space-y-1 whitespace-nowrap">
                            <Badge className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                              {getPortalRoleLabel(user.role)}
                            </Badge>
                            <p className="text-[11px] font-mono text-white/45">{getDashboardRouteForRole(user.role)}</p>
                          </div>
                        </TableCell>

                        <TableCell className="py-3.5">
                          <p className="whitespace-nowrap text-sm font-medium text-white/72">{user.branch}</p>
                        </TableCell>

                        <TableCell className="py-3.5">
                          <div className="space-y-0.5 whitespace-nowrap">
                            <p className="text-sm font-medium text-white/80">Last login: {user.lastLogin}</p>
                            <p className="text-[11px] text-white/42">Created {user.createdAt}</p>
                          </div>
                        </TableCell>

                        <TableCell className="py-3.5">
                          <Badge
                            className={`whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${statusClasses[user.status]}`}
                          >
                            {user.status.replace("_", " ")}
                          </Badge>
                        </TableCell>

                        <TableCell className="pr-5 py-3.5">
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              className={`h-8 min-w-[112px] rounded-full px-3 text-xs font-bold ${
                                user.status === "SUSPENDED"
                                  ? "bg-primary text-[#001a0e] hover:bg-primary/90"
                                  : "bg-red-500/90 text-white hover:bg-red-500"
                              }`}
                              onClick={() =>
                                handleToggleStatus(user.id, user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED")
                              }
                            >
                              {user.status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredUsers.length === 0 ? (
                      <TableRow className="border-white/10">
                        <TableCell colSpan={6} className="py-10 text-center text-sm text-white/45">
                          No users match the current search or filters.
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <Card className="border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-black text-white">{value}</p>
        <p className="mt-1 text-xs text-white/45">{helper}</p>
      </CardContent>
    </Card>
  );
}

function RosterStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#001a0e]/55 px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className="mt-2 text-sm font-bold text-white">{value}</p>
    </div>
  );
}
