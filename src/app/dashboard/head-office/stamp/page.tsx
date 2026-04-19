"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { BadgeCheck, Banknote, AlertCircle, Sparkles } from "lucide-react";
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
import { headOfficeLoanSummary } from "@/ai/flows/head-office-loan-summary-flow";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HeadOfficeStampPage() {
  const { loans, updateLoanStatus } = useLoans();
  const { toast } = useToast();
  const [targetLoan, setTargetLoan] = useState<LoanApplication | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const navItems = [
    { label: "Pending Stamp", href: "/dashboard/head-office/stamp", icon: <BadgeCheck className="w-4 h-4" /> },
    { label: "Pending Disbursement", href: "/dashboard/head-office/disburse", icon: <Banknote className="w-4 h-4" /> },
  ];

  const handleAction = (loan: LoanApplication) => {
    setTargetLoan(loan);
    generateSummary(loan);
  };

  const generateSummary = async (loan: LoanApplication) => {
    setIsSummarizing(true);
    try {
      const summary = await headOfficeLoanSummary({
        bankDetails: loan.bankDetails,
        borrower: loan.borrower,
        project: loan.project,
        loan: loan.loan,
        dates: loan.dates
      });
      setAiSummary(summary);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const confirmStamp = () => {
    if (targetLoan) {
      updateLoanStatus(targetLoan.id, 'AWAITING_DFO_VERIFICATION', 'Head Office Admin');
      toast({
        title: "Loan Stamped",
        description: `Loan ${targetLoan.id} is now awaiting DFO verification.`,
      });
      setTargetLoan(null);
      setAiSummary(null);
    }
  };

  return (
    <DashboardLayout role="head-office" navItems={navItems}>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-foreground">Pending Stamping</h2>
        <p className="text-muted-foreground">Review and stamp initial guarantee requests from Microfinance Banks.</p>
      </div>

      <LoanTable 
        loans={loans} 
        onAction={handleAction} 
        actionLabel="Stamp Loan" 
        allowedStatus="PENDING_HEAD_OFFICE_STAMP"
        role="head-office"
      />

      <AlertDialog open={!!targetLoan} onOpenChange={() => { setTargetLoan(null); setAiSummary(null); }}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black">
              <BadgeCheck className="w-6 h-6 text-primary" /> Confirm Stamping
            </AlertDialogTitle>
            <AlertDialogDescription>
              Review the loan application details. AI summary has been generated for your convenience.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4 space-y-4">
            <Card className="bg-primary/5 border-primary/20 shadow-none border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">AI Quick Summary</span>
                </div>
                {isSummarizing ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-primary/10 rounded w-3/4"></div>
                    <div className="h-4 bg-primary/10 rounded w-full"></div>
                    <div className="h-4 bg-primary/10 rounded w-2/3"></div>
                  </div>
                ) : (
                  <div className="text-sm prose prose-sm max-w-none prose-p:leading-relaxed text-foreground/80">
                    {aiSummary ? (
                      <div dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br/>') }} />
                    ) : (
                      "Failed to generate AI summary. Please review manual details below."
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="bg-accent/30 p-4 rounded-lg flex items-start gap-3 border border-border/50">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold">Important Notice</p>
                <p className="text-muted-foreground">Stamping this loan moves it to the DFO Verification stage. Ensure all bank requirements are met.</p>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStamp} className="font-bold px-8">Confirm & Stamp</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
