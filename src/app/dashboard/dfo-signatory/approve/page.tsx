"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { Signature, CheckSquare, ShieldCheck, AlertCircle, Info, FileStack } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <LoanTable 
            loans={loans} 
            onAction={handleAction} 
            actionLabel="Authorize" 
            allowedStatus="AWAITING_SIGNATORY_APPROVAL"
            role="dfo-signatory"
          />
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-white border-none shadow-xl shadow-primary/20">
             <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-80">Executive Summary</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="flex items-center justify-between">
                   <p className="text-3xl font-black">
                      {loans.filter(l => l.status === 'AWAITING_SIGNATORY_APPROVAL').length}
                   </p>
                   <FileStack className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-[10px] opacity-70 mt-1 uppercase font-bold">Applications Awaiting Signature</p>
             </CardContent>
          </Card>

          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-xs font-black uppercase text-amber-700">Legal Mandate</AlertTitle>
            <AlertDescription className="text-xs mt-2 leading-relaxed text-amber-900/80">
              Your digital signature carries the same weight as a physical one. Review the DFO Officer's report before signing.
            </AlertDescription>
          </Alert>

          <Card className="border-none shadow-sm ring-1 ring-primary/5 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Compliance Note
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Approved guarantees are immediately published to the National Registry. Ensure all risk assessments are satisfactory.
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!targetLoan} onOpenChange={() => { setTargetLoan(null); setSigned(false); }}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black">
              <Signature className="w-6 h-6 text-primary" /> Digital Executive Approval
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm your identity and authorize the guarantee for <span className="font-bold text-foreground">{targetLoan?.id}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-8 border-2 border-dashed border-primary/20 rounded-2xl bg-accent/20 flex flex-col items-center justify-center space-y-4">
            <div className="h-24 w-full flex items-center justify-center italic text-2xl text-primary/30 font-serif select-none">
               {signed ? (
                 <div className="flex flex-col items-center">
                    <span className="text-primary font-black opacity-100">AUTHORIZED</span>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest">Digital ID: SEC-998877</span>
                 </div>
               ) : "Awaiting Authorization..."}
            </div>
            <div className="flex items-center space-x-3 px-6 text-center">
              <Checkbox id="terms" checked={signed} onCheckedChange={(val) => setSigned(!!val)} className="h-5 w-5 rounded-md" />
              <Label htmlFor="terms" className="text-xs font-bold leading-tight cursor-pointer text-muted-foreground select-none">
                I authorize this loan guarantee based on the verification report provided by the DFO Officer.
              </Label>
            </div>
          </div>

          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel onClick={() => setSigned(false)}>Decline Authorization</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} disabled={!signed} className="font-black px-10">
              Sign & Finalize Approval
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
