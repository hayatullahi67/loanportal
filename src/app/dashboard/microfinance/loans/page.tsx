"use client";

import React from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { LayoutDashboard, FilePlus, CreditCard, Plus, HelpCircle, AlertCircle, Info, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MicrofinanceLoansPage() {
  const { loans } = useLoans();

  const navItems = [
    { label: "Dashboard", href: "/dashboard/microfinance/loans", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "New Application", href: "/dashboard/microfinance/apply", icon: <FilePlus className="w-4 h-4" /> },
    { label: "Repayments", href: "/dashboard/microfinance/repayment", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout role="microfinance" navItems={navItems}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Loan Portfolio</h2>
          <p className="text-muted-foreground">Manage and track all submitted guarantee applications for your branch.</p>
        </div>
        <Link href="/dashboard/microfinance/apply" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto font-bold shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> New Application
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/40">Approval Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-white">84%</p>
            <p className="text-[10px] text-primary font-bold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-2.5 h-2.5" /> 2.4% vs last quarter
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/40">In-Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-white">
              {loans.filter(l => l.status !== 'DISBURSED' && l.status !== 'REJECTED').length}
            </p>
            <p className="text-[10px] text-white/40 mt-1">Processing applications</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/40">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-red-500">
              {loans.filter(l => l.status === 'REJECTED').length}
            </p>
            <p className="text-[10px] text-white/40 mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className=" gap-8">
        <div className="lg:col-span-3">
          <LoanTable loans={loans} role="microfinance" />
        </div>

        {/* <div className="space-y-6">
          <Alert className="bg-primary/5 border-primary/20">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-xs font-black uppercase text-primary">Compliance Hub</AlertTitle>
            <AlertDescription className="text-xs mt-2 leading-relaxed text-foreground/70">
              Ensure all borrower BVNs are verified before submission to avoid Head Office rejection.
            </AlertDescription>
          </Alert>

          <Card className="border-none shadow-sm ring-1 ring-primary/5 overflow-hidden">
            <CardHeader className="bg-accent/40 py-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5" /> Processing Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-foreground">1. Application</p>
                <p className="text-[10px] text-muted-foreground">Submit borrower details and project specs.</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-foreground">2. HO Stamp</p>
                <p className="text-[10px] text-muted-foreground">Head office performs initial validation.</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-foreground">3. DFO Verification</p>
                <p className="text-[10px] text-muted-foreground">Field office verifies farm location and project.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <AlertCircle className="w-16 h-16" />
            </div>
            <CardContent className="p-6">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Notice</p>
              <p className="text-sm font-bold leading-snug">The Q2 reporting window closes in 5 days. Ensure all disbursements are updated.</p>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </DashboardLayout>
  );
}
