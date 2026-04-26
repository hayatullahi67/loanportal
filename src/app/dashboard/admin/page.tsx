"use client";

import React from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { useAdminConsole } from "@/lib/admin-store";
import { Shield, Users, Activity, FileStack, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const { loans } = useLoans();
  const { users } = useAdminConsole();

  const navItems = [
    { label: "System Overview", href: "/dashboard/admin", icon: <Shield className="w-4 h-4" /> },
    { label: "User Management", href: "/dashboard/admin/users", icon: <Users className="w-4 h-4" /> },
    { label: "Audit Logs", href: "/dashboard/admin/logs", icon: <Activity className="w-4 h-4" /> },
  ];

  const totalAmountReleased = loans
    .filter((loan) => loan.status === "DISBURSED")
    .reduce((acc, curr) => acc + curr.loan.amount, 0);

  const registeredMicrofinanceBanks = users.filter((user) => user.role === "microfinance").length;

  return (
    <DashboardLayout role="admin" navItems={navItems}>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Global Administration</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Real-time oversight of the national guarantee ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-10">
        <Card className="bg-primary text-white border-none shadow-xl shadow-primary/20 relative overflow-hidden group">
          <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Amount Released</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black">NGN {totalAmountReleased.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Number Of Microfinance Banks Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-foreground">{registeredMicrofinanceBanks}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Registered bank users in the portal</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Number Of Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-foreground">{loans.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1">All loans currently in the registry</p>
          </CardContent>
        </Card>
      </div>

      <div className="gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <FileStack className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold tracking-tight">National Guarantee Registry</h3>
            </div>
            <Badge variant="outline" className="hidden sm:flex border-primary/20 text-primary bg-primary/5 px-3 py-1 text-[10px] font-black uppercase">
              Live Update
            </Badge>
          </div>
          <LoanTable loans={loans} role="admin" />
        </div>
      </div>
    </DashboardLayout>
  );
}
