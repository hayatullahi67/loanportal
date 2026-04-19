"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { LoanTable } from "@/components/shared/LoanTable";
import { useLoans } from "@/lib/store";
import { UserCheck, Award, Sparkles, FileText } from "lucide-react";
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
import { generateDfoOfficerVerificationSummary } from "@/ai/flows/dfo-officer-verification-summary-flow";
import { Card, CardContent } from "@/components/ui/card";

export default function DfoOfficerVerifyPage() {
  const { loans, updateLoanStatus } = useLoans();
  const { toast } = useToast();
  const [targetLoan, setTargetLoan] = useState<LoanApplication | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const navItems = [
    { label: "Verify Loans", href: "/dashboard/dfo-officer/verify", icon: <UserCheck className="w-4 h-4" /> },
    { label: "Certificates", href: "/dashboard/dfo-officer/certificate", icon: <Award className="w-4 h-4" /> },
  ];

  const handleAction = (loan: LoanApplication) => {
    setTargetLoan(loan);
    getAiSummary(loan);
  };

  const getAiSummary = async (loan: LoanApplication) => {
    setIsSummarizing(true);
    try {
      const result = await generateDfoOfficerVerificationSummary({
        bankDetails: {
          bankName: loan.bankDetails.bankName,
          state: loan.bankDetails.state,
          lga: loan.bankDetails.lga,
          applicationDate: loan.bankDetails.date
        },
        borrowerDetails: loan.borrower,
        projectDetails: loan.project,
        loanDetails: loan.loan,
        dateDetails: loan.dates
      });
      setAiSummary(result.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const confirmVerify = () => {
    if (targetLoan) {
      updateLoanStatus(targetLoan.id, 'AWAITING_SIGNATORY_APPROVAL', 'DFO Officer');
      toast({
        title: "Loan Verified",
        description: `Loan ${targetLoan.id} verified and sent for signatory approval.`,
      });
      setTargetLoan(null);
      setAiSummary(null);
    }
  };

  return (
    <DashboardLayout role="dfo-officer" navItems={navItems}>
      <div className="mb-8">
        <h2 className="text-3xl font-black text-foreground">Loan Verification</h2>
        <p className="text-muted-foreground">Verify loan applications that have been stamped by the Head Office.</p>
      </div>

      <LoanTable 
        loans={loans} 
        onAction={handleAction} 
        actionLabel="Verify" 
        allowedStatus="AWAITING_DFO_VERIFICATION"
        role="dfo-officer"
      />

      <AlertDialog open={!!targetLoan} onOpenChange={() => setTargetLoan(null)}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-black">
              <FileText className="w-6 h-6 text-primary" /> Application Verification
            </AlertDialogTitle>
            <AlertDialogDescription>
              A summary of the application has been generated for quick review.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Card className="bg-accent/30 border-none shadow-none mt-4">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Verification Summary</span>
              </div>
              {isSummarizing ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-primary/5 rounded w-full"></div>
                  <div className="h-4 bg-primary/5 rounded w-5/6"></div>
                  <div className="h-4 bg-primary/5 rounded w-4/6"></div>
                </div>
              ) : (
                <div className="text-sm prose prose-sm max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {aiSummary || "Error generating summary."}
                </div>
              )}
            </CardContent>
          </Card>

          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel>Reject</AlertDialogCancel>
            <AlertDialogAction onClick={confirmVerify} className="font-bold">Verify & Forward</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}