"use client";

import React from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { LayoutDashboard, FilePlus, CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MicrofinanceLoansPage() {
  const { loans } = useLoans();

  const navItems = [
    { label: "Dashboard", href: "/dashboard/microfinance/loans", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "New Application", href: "/dashboard/microfinance/apply", icon: <FilePlus className="w-4 h-4" /> },
    { label: "Repayments", href: "/dashboard/microfinance/repayment", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <DashboardLayout role="microfinance" navItems={navItems}>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Loan Portfolio</h2>
          <p className="text-muted-foreground">Manage and track all submitted guarantee applications.</p>
        </div>
        <Link href="/dashboard/microfinance/apply">
          <Button className="font-bold shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> New Application
          </Button>
        </Link>
      </div>

      <LoanTable 
        loans={loans} 
        role="microfinance"
      />
    </DashboardLayout>
  );
}