"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { Signature, CheckSquare } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function DfoSignatoryApprovePage() {
  const { loans, updateLoanStatus } = useLoans();
  const { toast } = useToast();
  const [targetLoan, setTargetLoan] = useState<LoanApplication | null>(null);
  const [signed, setSigned] = useState(false);

  const navItems = [
    { label: "Pending Approval", href: "/dashboard/dfo-signatory/approve", icon: <Signature className="w-4 h-4" /> },
  ];

  const handleAction = (loan: LoanApplication) => {
    setTargetLoan(loan);
  };

  const confirmApprove = () => {
    if (targetLoan && signed) {
      updateLoanStatus(targetLoan.id, 'APPROVED', 'DFO Signatory');
      toast({
        title: "Loan Approved",
        description: `Loan ${targetLoan.id} has been fully approved by the Signatory.`,
      });
      setTargetLoan(null);
      setSigned(false);
    }
  };

  return (
    <DashboardLayout role="dfo-signatory" navItems={navItems}>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-foreground tracking-tight">Executive Approval</h2>
        <p className="text-muted-foreground">Authorized signatures for verified loan guarantee applications.</p>
      </div>

      <LoanTable 
        loans={loans} 
        onAction={handleAction} 
        actionLabel="Approve" 
        allowedStatus="AWAITING_SIGNATORY_APPROVAL"
        role="dfo-signatory"
      />

      <AlertDialog open={!!targetLoan} onOpenChange={() => setTargetLoan(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black">
              <Signature className="w-6 h-6 text-primary" /> Digital Authorization
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm your identity and authorize the guarantee for <span className="font-bold text-foreground">{targetLoan?.id}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-8 border-2 border-dashed border-primary/20 rounded-xl bg-accent/20 flex flex-col items-center justify-center space-y-4">
            <div className="h-20 w-full flex items-center justify-center italic text-2xl text-primary/40 font-serif">
               {signed ? "Digital Signature Applied" : "Awaiting Authorization..."}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={signed} onCheckedChange={(val) => setSigned(!!val)} />
              <Label htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer">
                I authorize this loan guarantee based on the verification report.
              </Label>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSigned(false)}>Decline</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} disabled={!signed} className="font-bold">
              Sign & Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}