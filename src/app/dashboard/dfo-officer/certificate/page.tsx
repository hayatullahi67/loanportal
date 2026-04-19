"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { UserCheck, Award, FileBadge } from "lucide-react";
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

export default function DfoOfficerCertificatePage() {
  const { loans, updateLoanStatus } = useLoans();
  const { toast } = useToast();
  const [targetLoan, setTargetLoan] = useState<LoanApplication | null>(null);

  const navItems = [
    { label: "Verify Loans", href: "/dashboard/dfo-officer/verify", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Certificates", href: "/dashboard/dfo-officer/certificate", icon: <Award className="w-4 h-4" /> },
  ];

  const handleAction = (loan: LoanApplication) => {
    setTargetLoan(loan);
  };

  const confirmGenerate = () => {
    if (targetLoan) {
      updateLoanStatus(targetLoan.id, 'CERTIFICATE_GENERATED', 'DFO Officer');
      toast({
        title: "Certificate Generated",
        description: `Certificate for Loan ${targetLoan.id} has been generated.`,
      });
      setTargetLoan(null);
    }
  };

  return (
    <DashboardLayout role="dfo-officer" navItems={navItems}>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-foreground">Certificate Generation</h2>
        <p className="text-muted-foreground">Issue official guarantee certificates for approved applications.</p>
      </div>

      <LoanTable 
        loans={loans} 
        onAction={handleAction} 
        actionLabel="Generate Certificate" 
        allowedStatus="APPROVED"
        role="dfo-officer"
      />

      <AlertDialog open={!!targetLoan} onOpenChange={() => setTargetLoan(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black">
              <FileBadge className="w-6 h-6 text-primary" /> Issue Certificate
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to generate the official guarantee certificate for <span className="font-bold">{targetLoan?.id}</span>. This document will be sent to the Head Office for disbursement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmGenerate} className="font-bold">Generate Issue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}