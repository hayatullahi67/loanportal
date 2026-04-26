"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { BadgeCheck, Banknote, Landmark, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoanApplication } from "@/types/loan";
import { HARDCODED_DISBURSEMENT_LOANS } from "@/lib/hardcoded-disbursement-loans";
import { addAuditLogEntry } from "@/lib/admin-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HeadOfficeDisbursePage() {
  const router = useRouter();
  const { loans, updateLoanStatus } = useLoans();
  const { toast } = useToast();
  const [targetLoan, setTargetLoan] = useState<LoanApplication | null>(null);
  const [hardcodedLoans, setHardcodedLoans] = useState<LoanApplication[]>(HARDCODED_DISBURSEMENT_LOANS);

  const navItems = [
    { label: "Pending Stamp", href: "/dashboard/head-office/stamp", icon: <BadgeCheck className="w-4 h-4" /> },
    { label: "Pending Disbursement", href: "/dashboard/head-office/disburse", icon: <Banknote className="w-4 h-4" /> },
  ];

  const liveDisbursementLoans = loans.filter(
    (loan) => loan.status === "CERTIFICATE_GENERATED" || loan.status === "DISBURSED"
  );
  const disbursementLoans = [...hardcodedLoans, ...liveDisbursementLoans];
  const readyForReleaseCount = disbursementLoans.length;
  const disbursedCount = disbursementLoans.filter((loan) => loan.status === "DISBURSED").length;
  const totalLoanValue = disbursementLoans.reduce((sum, loan) => sum + loan.loan.amount, 0);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleAction = (loan: LoanApplication) => {
    setTargetLoan(loan);
  };

  const confirmDisburse = () => {
    if (targetLoan) {
      const isHardcodedLoan = hardcodedLoans.some((loan) => loan.id === targetLoan.id);

      if (isHardcodedLoan) {
        setHardcodedLoans((currentLoans) =>
          currentLoans.map((loan) =>
            loan.id === targetLoan.id
              ? {
                  ...loan,
                  status: "DISBURSED",
                  timeline: [
                    ...loan.timeline,
                    {
                      status: "DISBURSED",
                      timestamp: new Date().toLocaleString(),
                      user: "Head Office Admin",
                    },
                  ],
                }
              : loan
          )
        );
        addAuditLogEntry({
          actor: "Head Office Admin",
          actorRole: "Head Office",
          action: "Marked loan as disbursed",
          target: targetLoan.id,
          severity: "WARNING",
          outcome: "SUCCESS",
        });
      } else {
        updateLoanStatus(targetLoan.id, "DISBURSED", "Head Office Admin");
      }

      toast({
        title: "Funds Disbursed",
        description: `Loan ${targetLoan.id} has been marked as disbursed.`,
      });
      setTargetLoan(null);
    }
  };

  return (
    <DashboardLayout role="head-office" navItems={navItems}>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-foreground">Final Disbursement</h2>
        <p className="text-muted-foreground">Release funds for loans with generated certificates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/40">Ready for Release</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-2xl font-black text-white">{readyForReleaseCount}</p>
            <Banknote className="w-8 h-8 text-primary/40" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Amount Release Today</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-2xl font-black text-white">{formatCurrency(totalLoanValue)}</p>
            <Wallet className="w-8 h-8 text-blue-400/40" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white/40">Disbursed Today</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-2xl font-black text-white">{disbursedCount}</p>
            <BadgeCheck className="w-8 h-8 text-primary/40" />
          </CardContent>
        </Card>
      </div>

      <LoanTable
        loans={disbursementLoans}
        onAction={handleAction}
        onPreview={(loan) => router.push(`/dashboard/dfo-officer/certificate/${loan.id}`)}
        actionLabel="Mark as Disbursed"
        allowedStatus="CERTIFICATE_GENERATED"
        role="head-office"
      />

      <AlertDialog open={!!targetLoan} onOpenChange={() => setTargetLoan(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black">
              <Landmark className="w-6 h-6 text-primary" /> Authorize Disbursement
            </AlertDialogTitle>
            <AlertDialogDescription>
              Certificate for <span className="font-bold">{targetLoan?.id}</span> has been verified. Do you want to mark this loan as disbursed and confirm the funds have been sent to the borrower?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisburse} className="font-bold">
              Mark as Disbursed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
