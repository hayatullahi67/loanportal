"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { BadgeCheck, Banknote, Landmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoanApplication } from "@/types/loan";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

export default function HeadOfficeDisbursePage() {
  const { loans, updateLoanStatus } = useLoans();
  const { toast } = useToast();
  const [targetLoan, setTargetLoan] = useState<LoanApplication | null>(null);

  const navItems = [
    { label: "Pending Stamp", href: "/dashboard/head-office/stamp", icon: <BadgeCheck className="w-4 h-4" /> },
    { label: "Pending Disbursement", href: "/dashboard/head-office/disburse", icon: <Banknote className="w-4 h-4" /> },
  ];

  const handleAction = (loan: LoanApplication) => {
    setTargetLoan(loan);
  };

  const confirmDisburse = () => {
    if (targetLoan) {
      updateLoanStatus(targetLoan.id, 'DISBURSED', 'Head Office Admin');
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

      <LoanTable 
        loans={loans} 
        onAction={handleAction} 
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
              Certificate for <span className="font-bold">{targetLoan?.id}</span> has been verified. Do you confirm the disbursement of ₦{targetLoan?.loan.amount.toLocaleString()}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisburse} className="font-bold">Confirm Disbursement</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
