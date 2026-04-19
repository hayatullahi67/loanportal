"use client";

import React from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { Shield, Users, Activity, FileStack } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { loans } = useLoans();

  const navItems = [
    { label: "System Overview", href: "/dashboard/admin", icon: <Shield className="w-4 h-4" /> },
    { label: "User Management", href: "/dashboard/admin/users", icon: <Users className="w-4 h-4" /> },
    { label: "Audit Logs", href: "/dashboard/admin/logs", icon: <Activity className="w-4 h-4" /> },
  ];

  const totalAmount = loans.reduce((acc, curr) => acc + curr.loan.amount, 0);

  return (
    <DashboardLayout role="admin" navItems={navItems}>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-foreground tracking-tight">System Administration</h2>
        <p className="text-muted-foreground">Global oversight of all loan guarantee activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary text-white border-none shadow-xl shadow-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-80">Total Guaranteed Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black">₦{totalAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-foreground">{loans.length}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Disbursed Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-foreground">
              {loans.filter(l => l.status === 'DISBURSED').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileStack className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">Master Loan Registry</h3>
        </div>
        <LoanTable loans={loans} role="admin" />
      </div>
    </DashboardLayout>
  );
}