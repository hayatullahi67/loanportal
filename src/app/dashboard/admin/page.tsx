"use client";

import React from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { Shield, Users, Activity, FileStack, TrendingUp, AlertTriangle } from "lucide-react";
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
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Global Administration</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Real-time oversight of the national guarantee ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-10">
        <Card className="bg-primary text-white border-none shadow-xl shadow-primary/20 relative overflow-hidden group">
          <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-80">Aggregate Guaranteed Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-black">₦{totalAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm ring-1 ring-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Portfolio Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-black text-foreground">{loans.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Active digital files tracked</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-primary/5 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Disbursement Velocity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              {loans.filter(l => l.status === 'DISBURSED').length}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Released funds verified</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <FileStack className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold tracking-tight">National Guarantee Registry</h3>
          </div>
          <Badge variant="outline" className="hidden sm:flex border-primary/20 text-primary bg-primary/5 px-3 py-1 text-[10px] font-black uppercase">Live Update</Badge>
        </div>
        <LoanTable loans={loans} role="admin" />
      </div>
    </DashboardLayout>
  );
}