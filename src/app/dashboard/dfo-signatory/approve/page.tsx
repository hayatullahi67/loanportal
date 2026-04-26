"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { Signature, ShieldCheck, AlertCircle, Info, FileStack } from "lucide-react";
import { LoanApplication } from "@/types/loan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DfoSignatoryApprovePage() {
  const router = useRouter();
  const { loans } = useLoans();

  const navItems = [
    { label: "Executive Approval", href: "/dashboard/dfo-signatory/approve", icon: <Signature className="w-4 h-4" /> },
  ];

  const handleAction = (loan: LoanApplication) => {
    router.push(`/dashboard/dfo-signatory/approve/${loan.id}`);
  };

  return (
    <DashboardLayout role="dfo-signatory" navItems={navItems}>
      {/* Executive Header */}
      <div className="mb-10 animate-in fade-in slide-in-from-left duration-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-1 bg-primary rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Executive Protocol</span>
        </div>
        <h2 className="text-4xl font-black text-foreground tracking-tight uppercase">Sovereign Approval</h2>
        <p className="text-muted-foreground mt-2 text-sm font-medium">Final authorization manifest for verified financial guarantee instruments.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
               <CardHeader className="p-6 pb-2">
                 <CardTitle className="text-[10px] font-black uppercase text-white/40 tracking-widest">Awaiting Signature</CardTitle>
               </CardHeader>
               <CardContent className="p-6 pt-0">
                  <p className="text-4xl font-black text-primary">{loans.filter(l => l.status === 'AWAITING_SIGNATORY_APPROVAL').length}</p>
               </CardContent>
            </Card>
            
            <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
               <CardHeader className="p-6 pb-2">
                 <CardTitle className="text-[10px] font-black uppercase text-white/40 tracking-widest">Total Appovals (MTD)</CardTitle>
               </CardHeader>
               <CardContent className="p-6 pt-0">
                  <p className="text-4xl font-black text-white">142</p>
               </CardContent>
            </Card>

            <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-primary/10 backdrop-blur-xl relative overflow-hidden group border-l-4 border-l-primary">
               <CardHeader className="p-6 pb-2">
                 <CardTitle className="text-[10px] font-black uppercase text-primary tracking-widest">Exposure Authorized</CardTitle>
               </CardHeader>
               <CardContent className="p-6 pt-0">
                  <p className="text-3xl font-black text-white">₦1.2B</p>
               </CardContent>
            </Card>
          </div>

          <LoanTable 
            loans={loans} 
            onAction={handleAction} 
            actionLabel="Authorize Manifest" 
            allowedStatus="AWAITING_SIGNATORY_APPROVAL"
            role="dfo-signatory"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
