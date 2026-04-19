"use client";

import React from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { Shield, Users, Activity, FileStack, TrendingUp, Cpu, Server, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
        <Card className="bg-primary text-white border-none shadow-xl shadow-primary/20 relative overflow-hidden group">
          <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-80">Aggregate Guaranteed Exposure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black">₦{totalAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm ring-1 ring-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Portfolio Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-foreground">{loans.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Active digital files tracked</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System Health</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xl font-black text-foreground">Operational</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Disbursement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-foreground">
              {Math.round((loans.filter(l => l.status === 'DISBURSED').length / (loans.length || 1)) * 100)}%
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Success velocity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <FileStack className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold tracking-tight">National Guarantee Registry</h3>
            </div>
            <Badge variant="outline" className="hidden sm:flex border-primary/20 text-primary bg-primary/5 px-3 py-1 text-[10px] font-black uppercase">Live Update</Badge>
          </div>
          <LoanTable loans={loans} role="admin" />
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm ring-1 ring-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Infrastructure Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Blockchain Verification Node", status: "Active", icon: <Server className="w-3 h-3" /> },
                { label: "Global KYC/BVN Oracle", status: "Connected", icon: <Globe className="w-3 h-3" /> },
                { label: "Treasury Gateway", status: "Secure", icon: <Shield className="w-3 h-3" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-2 border-b last:border-0 border-primary/5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="font-bold text-green-600">{item.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-accent/40 border-none shadow-sm ring-1 ring-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Activity className="w-4 h-4" /> Recent Audit Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-primary/5">
                  <p className="text-[10px] font-bold text-primary mb-1">Treasury Alert • 2m ago</p>
                  <p className="text-xs leading-relaxed text-foreground">Disbursement batch for MFB-KANO-02 verified and released to clearing house.</p>
                </div>
                <div className="p-3 bg-white rounded-lg shadow-sm border border-primary/5">
                  <p className="text-[10px] font-bold text-primary mb-1">Security Audit • 15m ago</p>
                  <p className="text-xs leading-relaxed text-foreground">Root administrator "super_admin" performed a global portfolio backup.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
